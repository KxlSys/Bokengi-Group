import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload'
import { isAdmin, isEditor } from '../access/roles'

export const calculateInvoiceTotals: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
}) => {
  if (!data) return data

  // 1. Auto-génération du numéro de facture/devis si absent
  if (!data.invoiceNumber) {
    const year = new Date().getFullYear()
    try {
      if (req?.payload && typeof req.payload.count === 'function') {
        const countRes = await req.payload.count({
          collection: 'invoices',
          overrideAccess: true,
        })
        const nextNum = String((countRes?.totalDocs || 0) + 1).padStart(4, '0')
        data.invoiceNumber = `BOK-${year}-${nextNum}`
      } else {
        const rnd = Math.floor(1000 + Math.random() * 9000)
        data.invoiceNumber = `BOK-${year}-${rnd}`
      }
    } catch {
      const rnd = Math.floor(1000 + Math.random() * 9000)
      data.invoiceNumber = `BOK-${year}-${rnd}`
    }
  }

  // 2. Pré-remplissage client depuis le lead rattaché si les champs sont vides
  if (data.lead && (!data.clientName || !data.clientEmail)) {
    try {
      const leadId = typeof data.lead === 'object' && 'id' in data.lead ? (data.lead as any).id : data.lead
      if (leadId && req?.payload) {
        const leadDoc = await req.payload.findByID({
          collection: 'leads',
          id: leadId,
        })
        if (leadDoc) {
          if (!data.clientName) {
            data.clientName = `${leadDoc.firstname || ''} ${leadDoc.lastname || ''}`.trim()
          }
          if (!data.clientCompany && leadDoc.company) {
            data.clientCompany = leadDoc.company
          }
          if (!data.clientEmail && leadDoc.email) {
            data.clientEmail = leadDoc.email
          }
          if (!data.clientPhone && leadDoc.phone) {
            data.clientPhone = leadDoc.phone
          }
        }
      }
    } catch {
      // Ignorer silencieusement si la relation ne peut être résolue immédiatement
    }
  }

  // 3. Calculs financiers déterministes (lignes & totaux HT/TTC)
  let subtotal = 0
  let totalVat = 0

  if (Array.isArray(data.items)) {
    for (const item of data.items) {
      const qty = Number(item.quantity) || 1
      const price = Number(item.unitPriceHT) || 0
      const vat = typeof item.vatRate === 'number' ? item.vatRate : 20
      const lineHT = Math.round(qty * price * 100) / 100
      const lineVAT = Math.round(lineHT * (vat / 100) * 100) / 100
      const lineTTC = Math.round((lineHT + lineVAT) * 100) / 100

      item.totalHT = lineHT
      item.totalTTC = lineTTC

      subtotal += lineHT
      totalVat += lineVAT
    }
  }

  data.subtotalHT = Math.round(subtotal * 100) / 100
  data.totalVAT = Math.round(totalVat * 100) / 100
  data.totalTTC = Math.round((subtotal + totalVat) * 100) / 100

  return data
}

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  labels: {
    singular: 'Facture / Devis',
    plural: 'Factures & Devis',
  },
  admin: {
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'clientName', 'type', 'totalTTC', 'status', 'issueDate', 'dueDate'],
    group: 'CRM & Opérations',
    description: 'Module officiel de facturation, devis et gestion comptable Bokengi Group.',
  },
  lockDocuments: false,
  access: {
    create: ({ req: { user } }) => isEditor(user),
    read: ({ req: { user } }) => isEditor(user),
    update: ({ req: { user } }) => isEditor(user),
    delete: ({ req: { user } }) => isAdmin(user),
  },
  hooks: {
    beforeValidate: [calculateInvoiceTotals],
    beforeChange: [calculateInvoiceTotals],
  },
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Numéro de pièce',
      admin: {
        position: 'sidebar',
        description: 'Numéro légal généré automatiquement (format BOK-AAAA-XXXX).',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'invoice',
      label: 'Nature du document',
      options: [
        { label: 'Facture', value: 'invoice' },
        { label: 'Devis', value: 'quote' },
        { label: 'Avoir', value: 'credit_note' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Statut du document',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Émise / Envoyée', value: 'sent' },
        { label: 'Payée', value: 'paid' },
        { label: 'En retard', value: 'overdue' },
        { label: 'Annulée', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
        components: {
          Cell: '@/components/admin/invoices/InvoiceStatusCell',
        },
      },
    },
    {
      name: 'printAction',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/invoices/InvoicePrintButton',
        },
      },
    },
    {
      name: 'subtotalHT',
      type: 'number',
      label: 'Total Hors Taxes (€)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Calculé automatiquement à partir des lignes.',
      },
    },
    {
      name: 'totalVAT',
      type: 'number',
      label: 'Total TVA (€)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Montant de taxe calculé automatiquement.',
      },
    },
    {
      name: 'totalTTC',
      type: 'number',
      label: 'Net à payer TTC (€)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Montant total toutes taxes comprises.',
      },
    },
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
      hasMany: false,
      label: 'Prospect / Demande commerciale liée',
      admin: {
        description: 'Lier cette pièce à un prospect CRM pour pré-remplir les données client.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'clientName',
          type: 'text',
          required: true,
          label: 'Nom du client / Interlocuteur',
          admin: {
            width: '50%',
            placeholder: 'Ex: Jean Dupont, Direction Générale...',
          },
        },
        {
          name: 'clientCompany',
          type: 'text',
          label: 'Entreprise / Organisation',
          admin: {
            width: '50%',
            placeholder: 'Ex: Acme Corp, Groupe Kongama...',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'clientEmail',
          type: 'email',
          label: 'Email de facturation',
          admin: {
            width: '50%',
            placeholder: 'comptabilite@entreprise.com',
          },
        },
        {
          name: 'clientPhone',
          type: 'text',
          label: 'Numéro de téléphone',
          admin: {
            width: '50%',
            placeholder: '+33 6 12 34 56 78',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'clientAddress',
          type: 'textarea',
          label: 'Adresse postale de facturation',
          admin: {
            width: '60%',
            placeholder: '12 rue de la Paix, 75002 Paris, France',
          },
        },
        {
          name: 'clientVatNumber',
          type: 'text',
          label: 'N° TVA Intracommunautaire client',
          admin: {
            width: '40%',
            placeholder: 'Ex: FR 99 999999999',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'issueDate',
          type: 'date',
          required: true,
          label: "Date d'émission",
          defaultValue: () => new Date().toISOString(),
          admin: {
            width: '33%',
          },
        },
        {
          name: 'dueDate',
          type: 'date',
          required: true,
          label: "Date d'échéance",
          defaultValue: () => {
            const d = new Date()
            d.setDate(d.getDate() + 30)
            return d.toISOString()
          },
          admin: {
            width: '33%',
          },
        },
        {
          name: 'paymentMethod',
          type: 'select',
          defaultValue: 'virement',
          label: 'Mode de règlement',
          options: [
            { label: 'Virement bancaire', value: 'virement' },
            { label: 'Carte bancaire', value: 'carte' },
            { label: 'Chèque', value: 'cheque' },
            { label: 'Autre', value: 'autre' },
          ],
          admin: {
            width: '33%',
          },
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Lignes de prestations / Produits',
      labels: {
        singular: 'Ligne',
        plural: 'Lignes de facturation',
      },
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Désignation de la prestation',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'quantity',
              type: 'number',
              required: true,
              defaultValue: 1,
              label: 'Quantité',
              admin: {
                width: '20%',
              },
            },
            {
              name: 'unitPriceHT',
              type: 'number',
              required: true,
              label: 'Prix unitaire HT (€)',
              admin: {
                width: '30%',
              },
            },
            {
              name: 'vatRate',
              type: 'number',
              required: true,
              defaultValue: 20,
              label: 'Taux TVA (%)',
              admin: {
                width: '20%',
              },
            },
            {
              name: 'totalHT',
              type: 'number',
              label: 'Total HT (€)',
              admin: {
                width: '15%',
                readOnly: true,
              },
            },
            {
              name: 'totalTTC',
              type: 'number',
              label: 'Total TTC (€)',
              admin: {
                width: '15%',
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Conditions de règlement & Mentions légales',
      defaultValue:
        'En cas de retard de paiement, une indemnité forfaitaire de 40 € pour frais de recouvrement sera due de plein droit (art. D. 441-5 C. com.), majorée des pénalités de retard au taux directeur de la BCE majoré de 10 points de pourcentage. Pas d\'escompte pour règlement anticipé.',
      admin: {
        description: 'Mentions contractuelles et légales imprimées en bas de facture.',
      },
    },
  ],
  timestamps: true,
}

export default Invoices
