import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { Invoices, calculateInvoiceTotals } from '../src/collections/Invoices'
import { Leads } from '../src/collections/Leads'
import { Poles } from '../src/collections/Poles'
import { Services } from '../src/collections/Services'
import { CaseStudies } from '../src/collections/CaseStudies'
import { Posts } from '../src/collections/Posts'
import { Media } from '../src/collections/Media'
import { Pages } from '../src/collections/Pages'
import { Users } from '../src/collections/Users'
import { AccessRequests } from '../src/collections/AccessRequests'
import { SiteSettings } from '../src/globals/SiteSettings'
import { Header } from '../src/globals/Header'
import { Footer } from '../src/globals/Footer'
import { protectLeadImmutability } from '../src/collections/hooks/protectLeadImmutability'
import * as migration14 from '../src/migrations/20260909_180000_add_invoices_and_crm_fields'

describe('Facturation Bokengi — Calculs financiers & Hooks', () => {
  it('calcule correctement les montants HT, TVA et TTC pour chaque ligne et les totaux', async () => {
    const rawData: any = {
      items: [
        {
          description: 'Audit de sécurité applicative',
          quantity: 2,
          unitPriceHT: 1500,
          vatRate: 20,
        },
        {
          description: 'Accompagnement ISO 27001',
          quantity: 1,
          unitPriceHT: 2500,
          vatRate: 20,
        },
      ],
    }

    const result = await (calculateInvoiceTotals as any)({
      data: rawData,
      req: {} as any,
      operation: 'create',
    })

    assert.equal(result.items[0].totalHT, 3000)
    assert.equal(result.items[0].totalTTC, 3600)
    assert.equal(result.items[1].totalHT, 2500)
    assert.equal(result.items[1].totalTTC, 3000)

    assert.equal(result.subtotalHT, 5500)
    assert.equal(result.totalVAT, 1100)
    assert.equal(result.totalTTC, 6600)
  })

  it('génère un numéro de facture au format BOK-AAAA-XXXX si absent', async () => {
    const rawData: any = {
      items: [],
    }

    const result = await (calculateInvoiceTotals as any)({
      data: rawData,
      req: {} as any,
      operation: 'create',
    })

    const year = new Date().getFullYear()
    assert.match(result.invoiceNumber, new RegExp(`^BOK-${year}-\\d+`))
  })

  it('préserve un numéro de facture déjà renseigné', async () => {
    const rawData: any = {
      invoiceNumber: 'BOK-2026-0042',
      items: [],
    }

    const result = await (calculateInvoiceTotals as any)({
      data: rawData,
      req: {} as any,
      operation: 'update',
    })

    assert.equal(result.invoiceNumber, 'BOK-2026-0042')
  })

  it('gère les décimales et arrondis financiers sans perte de précision', async () => {
    const rawData: any = {
      items: [
        {
          description: 'Licence logicielle mensuelle',
          quantity: 3,
          unitPriceHT: 33.33,
          vatRate: 20,
        },
      ],
    }

    const result = await (calculateInvoiceTotals as any)({
      data: rawData,
      req: {} as any,
      operation: 'create',
    })

    assert.equal(result.items[0].totalHT, 99.99)
    assert.equal(result.items[0].totalTTC, 119.99)
    assert.equal(result.subtotalHT, 99.99)
    assert.equal(result.totalVAT, 20)
    assert.equal(result.totalTTC, 119.99)
  })
})

describe('CRM Leads — Immutabilité & Champs internes', () => {
  const originalLead = {
    id: 42,
    firstname: 'Amara',
    lastname: 'Diallo',
    company: 'Société Minière',
    email: 'adiallo@societe-miniere.org',
    phone: '+243 81 234 5678',
    requestType: 'devis',
    pole: 1,
    message: 'Demande de devis pour sécurisation infrastructure.',
    source: 'website-contact-form',
    status: 'new',
    priority: 'medium',
    assignedTo: null,
    internalNotes: null,
  }

  it('autorise la mise à jour des champs internes de qualification (status, priority, assignedTo, internalNotes)', async () => {
    const updateData = {
      status: 'qualified',
      priority: 'high',
      assignedTo: 2,
      internalNotes: 'Contact téléphonique établi le 10/09, réunion de cadrage fixée.',
    }

    const result = await (protectLeadImmutability as any)({
      data: updateData,
      originalDoc: originalLead,
      operation: 'update',
    })

    assert.deepEqual(result, updateData)
  })

  it('rejette avec HTTP 403 toute tentative de modification des données originales du prospect', async () => {
    const illegalUpdate = {
      email: 'hacked@evil.org',
      priority: 'high',
    }

    await assert.rejects(
      async () => {
        await (protectLeadImmutability as any)({
          data: illegalUpdate,
          originalDoc: originalLead,
          operation: 'update',
        })
      },
      (err: any) => {
        assert.equal(err.status, 403)
        assert.match(err.message, /strictement immuable/)
        return true
      }
    )
  })

  it('rejette la modification du message prospect', async () => {
    await assert.rejects(
      async () => {
        await (protectLeadImmutability as any)({
          data: { message: 'Nouveau message altéré' },
          originalDoc: originalLead,
          operation: 'update',
        })
      },
      (err: any) => {
        assert.equal(err.status, 403)
        return true
      }
    )
  })

  it('rejette la modification du pôle ciblé', async () => {
    await assert.rejects(
      async () => {
        await (protectLeadImmutability as any)({
          data: { pole: 3 },
          originalDoc: originalLead,
          operation: 'update',
        })
      },
      (err: any) => {
        assert.equal(err.status, 403)
        return true
      }
    )
  })
})

describe('Architecture & Navigation Métier Payload 3.88', () => {
  it('organise les collections et globals dans les 3 groupes métiers cibles', () => {
    // 1. CRM & Opérations
    assert.equal(Leads.admin?.group, 'CRM & Opérations')
    assert.equal(Invoices.admin?.group, 'CRM & Opérations')

    // 2. Offres & Métiers
    assert.equal(Poles.admin?.group, 'Offres & Métiers')
    assert.equal(Services.admin?.group, 'Offres & Métiers')
    assert.equal(CaseStudies.admin?.group, 'Offres & Métiers')
    assert.equal(Posts.admin?.group, 'Offres & Métiers')
    assert.equal(Media.admin?.group, 'Offres & Métiers')

    // 3. Paramètres & Système
    assert.equal(Users.admin?.group, 'Paramètres & Système')
    assert.equal(AccessRequests.admin?.group, 'Paramètres & Système')
    assert.equal(SiteSettings.admin?.group, 'Paramètres & Système')
    assert.equal(Header.admin?.group, 'Paramètres & Système')
    assert.equal(Footer.admin?.group, 'Paramètres & Système')
  })

  it('masque la collection Pages (admin.hidden: true)', () => {
    assert.equal(Pages.admin?.hidden, true)
  })

  it('applique les règles RBAC d visibilité sur les paramètres système', () => {
    const editorUser = { id: 2, role: 'editor', status: 'active' }
    const adminUser = { id: 3, role: 'admin', status: 'active' }
    const superAdminUser = { id: 1, role: 'super-admin', status: 'active' }

    // Users
    const usersHidden = Users.admin?.hidden as any
    assert.equal(typeof usersHidden, 'function')
    assert.equal(usersHidden({ user: editorUser }), true)
    assert.equal(usersHidden({ user: adminUser }), false)
    assert.equal(usersHidden({ user: superAdminUser }), false)

    // AccessRequests
    const accessRequestsHidden = AccessRequests.admin?.hidden as any
    assert.equal(typeof accessRequestsHidden, 'function')
    assert.equal(accessRequestsHidden({ user: editorUser }), true)
    assert.equal(accessRequestsHidden({ user: adminUser }), true)
    assert.equal(accessRequestsHidden({ user: superAdminUser }), false)

    // SiteSettings
    const siteSettingsHidden = SiteSettings.admin?.hidden as any
    assert.equal(typeof siteSettingsHidden, 'function')
    assert.equal(siteSettingsHidden({ user: editorUser }), true)
    assert.equal(siteSettingsHidden({ user: adminUser }), false)
    assert.equal(siteSettingsHidden({ user: superAdminUser }), false)
  })

  it('intègre les champs join (leads & services) sur la collection Poles', () => {
    const leadsJoin = Poles.fields.find((f: any) => f.name === 'leads')
    assert.ok(leadsJoin, 'Le champ join leads doit exister sur Poles')
    assert.equal((leadsJoin as any).type, 'join')
    assert.equal((leadsJoin as any).collection, 'leads')
    assert.equal((leadsJoin as any).on, 'pole')

    const servicesJoin = Poles.fields.find((f: any) => f.name === 'services')
    assert.ok(servicesJoin, 'Le champ join services doit exister sur Poles')
    assert.equal((servicesJoin as any).type, 'join')
    assert.equal((servicesJoin as any).collection, 'services')
    assert.equal((servicesJoin as any).on, 'pole')
  })

  it('la migration 14 exporte des fonctions up et down valides', () => {
    assert.equal(typeof migration14.up, 'function')
    assert.equal(typeof migration14.down, 'function')
  })

  it('applique les contrôles de sécurité RBAC stricts sur Invoices (create/read/update/delete)', () => {
    const editorUser = { id: 2, role: 'editor', status: 'active' }
    const adminUser = { id: 3, role: 'admin', status: 'active' }
    const superAdminUser = { id: 1, role: 'super-admin', status: 'active' }
    const suspendedUser = { id: 4, role: 'editor', status: 'suspended' }
    const anonReq = { req: { user: null } } as any

    const canCreate = Invoices.access?.create as any
    const canRead = Invoices.access?.read as any
    const canUpdate = Invoices.access?.update as any
    const canDelete = Invoices.access?.delete as any

    // 1. Éditeur actif : gestion opérationnelle (create, read, update)
    assert.equal(canCreate({ req: { user: editorUser } }), true)
    assert.equal(canRead({ req: { user: editorUser } }), true)
    assert.equal(canUpdate({ req: { user: editorUser } }), true)
    // 2. Éditeur actif : suppression comptable strictement INTERDITE
    assert.equal(canDelete({ req: { user: editorUser } }), false)

    // 3. Administrateur actif : gestion complète y compris suppression
    assert.equal(canCreate({ req: { user: adminUser } }), true)
    assert.equal(canRead({ req: { user: adminUser } }), true)
    assert.equal(canUpdate({ req: { user: adminUser } }), true)
    assert.equal(canDelete({ req: { user: adminUser } }), true)

    // 4. Super Administrateur ID 1 : contrôle total
    assert.equal(canCreate({ req: { user: superAdminUser } }), true)
    assert.equal(canRead({ req: { user: superAdminUser } }), true)
    assert.equal(canUpdate({ req: { user: superAdminUser } }), true)
    assert.equal(canDelete({ req: { user: superAdminUser } }), true)

    // 5. Utilisateur suspendu ou anonyme : accès refusé à 100%
    assert.equal(canCreate({ req: { user: suspendedUser } }), false)
    assert.equal(canDelete({ req: { user: suspendedUser } }), false)
    assert.equal(canCreate(anonReq), false)
    assert.equal(canRead(anonReq), false)
    assert.equal(canUpdate(anonReq), false)
    assert.equal(canDelete(anonReq), false)
  })

  it('ne contient aucune valeur légale ou bancaire fictive dans SiteSettings', () => {
    const fields = SiteSettings.fields as any[]
    const getField = (name: string) => fields.find((f: any) => f.name === name)

    assert.equal(getField('rcs')?.defaultValue, undefined)
    assert.equal(getField('siren')?.defaultValue, undefined)
    assert.equal(getField('siret')?.defaultValue, undefined)
    assert.equal(getField('vatNumber')?.defaultValue, undefined)

    const bankGroup = getField('bankDetails')
    assert.ok(bankGroup)
    const bankFields = bankGroup.fields
    assert.equal(bankFields.find((f: any) => f.name === 'bankName')?.defaultValue, undefined)
    assert.equal(bankFields.find((f: any) => f.name === 'iban')?.defaultValue, undefined)
    assert.equal(bankFields.find((f: any) => f.name === 'bic')?.defaultValue, undefined)

    // Seules les données validées ont des valeurs par défaut
    assert.equal(getField('companyName')?.defaultValue, 'Bokengi Group')
    assert.equal(getField('capital')?.defaultValue, '7 500 €')
    assert.equal(getField('contactEmail')?.defaultValue, 'contact@bokengi-group.com')
    assert.equal(getField('phone')?.defaultValue, '07 58 88 84 34')
  })
})
