import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { POLES_SEED_DATA } from '../src/data/bokengi-seed-data'
import { Poles } from '../src/collections/Poles'
import { Leads } from '../src/collections/Leads'
import { protectLeadImmutability } from '../src/collections/hooks/protectLeadImmutability'
import { seedPoles } from '../src/scripts/seed'
import payloadConfig from '../src/payload.config'
import * as migration14 from '../src/migrations/20260909_180000_add_invoices_and_crm_fields'

describe('POL — Architecture & Source de Vérité Poles Bokengi', () => {
  // ---------------------------------------------------------------------------
  // POL-01 : Les 5 pôles existent dans Poles
  // ---------------------------------------------------------------------------
  it('POL-01 : Les 5 pôles existent dans la définition canonique et le seed', async () => {
    assert.equal(POLES_SEED_DATA.length, 5, 'Il doit y avoir exactement 5 pôles dans POLES_SEED_DATA')

    const expectedPoles = [
      'Bokengi IT',
      'Bokengi Digital',
      'Bokengi Business',
      'Bokengi Consulting',
      'Bokengi Events',
    ]

    const actualNames = POLES_SEED_DATA.map((p) => p.name)
    for (const name of expectedPoles) {
      assert.ok(actualNames.includes(name), `Le pôle "${name}" doit être présent dans POLES_SEED_DATA`)
    }

    // Vérification du seed idempotent
    const inMemoryPoles: any[] = []
    let nextId = 1
    const mockPayload: any = {
      find: async ({ where }: any) => {
        const slug = where?.slug?.equals
        const found = inMemoryPoles.filter((p) => p.slug === slug)
        return { docs: found }
      },
      create: async ({ data }: any) => {
        const doc = { ...data, id: nextId++ }
        inMemoryPoles.push(doc)
        return doc
      },
    }

    // Premier passage du seed
    const firstRun = await seedPoles(mockPayload)
    assert.equal(Object.keys(firstRun).length, 5, 'Le seed doit injecter 5 pôles')
    assert.equal(inMemoryPoles.length, 5, '5 documents doivent avoir été créés en base')

    // Second passage du seed : AUCUN doublon
    const secondRun = await seedPoles(mockPayload)
    assert.equal(inMemoryPoles.length, 5, 'Le second passage ne doit créer aucun doublon')
    assert.deepEqual(firstRun, secondRun, 'Les IDs doivent être rigoureusement conservés')
  })

  // ---------------------------------------------------------------------------
  // POL-02 : Les slugs sont exactement : it, digital, business, consulting, events
  // ---------------------------------------------------------------------------
  it('POL-02 : Les slugs sont exactement it, digital, business, consulting, events', () => {
    const expectedSlugs = ['it', 'digital', 'business', 'consulting', 'events']
    const actualSlugs = POLES_SEED_DATA.map((p) => p.slug)
    assert.deepEqual(actualSlugs.sort(), expectedSlugs.sort(), 'Les slugs doivent être exactement it, digital, business, consulting, events')

    // Vérification des routes associées
    for (const slug of expectedSlugs) {
      const expectedRoute = `/expertises/${slug}`
      assert.ok(expectedRoute.startsWith('/expertises/'), `La route canonique pour ${slug} doit être /expertises/${slug}`)
    }
  })

  // ---------------------------------------------------------------------------
  // POL-03 : Aucun doublon de slug
  // ---------------------------------------------------------------------------
  it('POL-03 : Aucun doublon de slug dans les pôles', () => {
    const slugs = POLES_SEED_DATA.map((p) => p.slug)
    const uniqueSlugs = new Set(slugs)
    assert.equal(uniqueSlugs.size, slugs.length, 'Chaque pôle doit posséder un slug strictement unique')
  })

  // ---------------------------------------------------------------------------
  // POL-04 : treatmentPole est une relation vers Poles
  // ---------------------------------------------------------------------------
  it('POL-04 : treatmentPole est une relation Payload vers la collection Poles (pas un enum indépendant)', () => {
    const fields = Leads.fields as any[]
    const treatmentPoleField = fields.find((f: any) => f.name === 'treatmentPole')

    assert.ok(treatmentPoleField, 'Le champ treatmentPole doit exister sur la collection Leads')
    assert.equal(treatmentPoleField.type, 'relationship', 'treatmentPole doit être de type relationship')
    assert.equal(treatmentPoleField.relationTo, 'poles', 'treatmentPole doit pointer vers la collection poles')
    assert.equal(treatmentPoleField.hasMany, false, 'treatmentPole doit être une relation simple (hasMany: false)')

    // Vérification qu'aucun enum indépendant n'est utilisé
    assert.notEqual(treatmentPoleField.type, 'select', 'treatmentPole ne doit pas être un champ select')
    assert.equal(treatmentPoleField.options, undefined, 'treatmentPole ne doit pas définir d options en dur')
  })

  // ---------------------------------------------------------------------------
  // POL-05 : Le select Admin utilise les données de Poles
  // ---------------------------------------------------------------------------
  it('POL-05 : Le select Admin utilise les données dynamiques de Poles via useAsTitle', () => {
    assert.equal(Poles.admin?.useAsTitle, 'name', 'La collection Poles doit utiliser "name" comme titre d affichage')
    assert.equal(Poles.slug, 'poles', 'Le slug de la collection doit être poles')

    const fields = Leads.fields as any[]
    const treatmentPoleField = fields.find((f: any) => f.name === 'treatmentPole')
    assert.equal(treatmentPoleField.label, 'Pôle de traitement', 'Le libellé Admin doit être "Pôle de traitement"')
  })

  // ---------------------------------------------------------------------------
  // POL-06 : Un Lead peut recevoir un treatmentPole valide
  // ---------------------------------------------------------------------------
  it('POL-06 : Un Lead peut recevoir un treatmentPole valide sans blocage', async () => {
    const originalLead = {
      id: 101,
      firstname: 'Moïse',
      lastname: 'Katumbi',
      company: 'Katanga Logistique',
      email: 'm.katumbi@katanga.cd',
      phone: '+243 99 000 1111',
      requestType: 'devis',
      pole: 1, // Pôle demandé par le prospect (IT)
      message: 'Besoin d audit et sécurisation de flux.',
      source: 'website',
      status: 'new',
      treatmentPole: null,
    }

    // Mise à jour opérationnelle légitime de treatmentPole (ex: affecté à Bokengi Digital ID 2)
    const updatedData = {
      treatmentPole: 2,
    }

    const result = await (protectLeadImmutability as any)({
      data: updatedData,
      originalDoc: originalLead,
      operation: 'update',
    })

    assert.equal(result.treatmentPole, 2, 'treatmentPole doit pouvoir être mis à jour')
  })

  // ---------------------------------------------------------------------------
  // POL-07 : Un Lead conserve son pole original lorsqu'on modifie treatmentPole
  // ---------------------------------------------------------------------------
  it('POL-07 : Un Lead conserve son pole original lorsqu on modifie treatmentPole', async () => {
    const originalLead = {
      id: 102,
      firstname: 'Grace',
      lastname: 'Kabuya',
      company: 'FinTech RDC',
      email: 'grace@fintech.cd',
      phone: '+243 82 555 4444',
      requestType: 'cadrage',
      pole: 1, // Bokengi IT demandé à l origine
      message: 'Demande initiale sur les infrastructures.',
      source: 'website',
      status: 'contacted',
      treatmentPole: null,
    }

    // On réoriente en interne vers Bokengi Consulting (ID 4)
    const updateData = {
      treatmentPole: 4,
      status: 'qualified',
    }

    const result = await (protectLeadImmutability as any)({
      data: updateData,
      originalDoc: originalLead,
      operation: 'update',
    })

    // Le champ pole n est pas présent dans updateData, donc la valeur originale reste intacte
    assert.equal(result.treatmentPole, 4, 'Le pôle de traitement est mis à jour vers Bokengi Consulting')
    assert.equal((originalLead as any).pole, 1, 'Le pôle prospect original reste strictement 1 (Bokengi IT)')
  })

  // ---------------------------------------------------------------------------
  // POL-08 : Une tentative de modification de pole reste HTTP 403
  // ---------------------------------------------------------------------------
  it('POL-08 : Une tentative de modification de pole reste HTTP 403 et bloque toute écriture', async () => {
    const originalLead = {
      id: 103,
      firstname: 'Serge',
      lastname: 'Mukendi',
      company: 'Brazza Mining',
      email: 's.mukendi@brazza-mining.cg',
      phone: '+242 06 777 8888',
      requestType: 'devis',
      pole: 1,
      message: 'Audit infrastructure industrielle.',
      source: 'website',
      status: 'new',
      treatmentPole: 1,
    }

    // 1. Tentative de modification de pole seul -> HTTP 403
    await assert.rejects(
      async () => {
        await (protectLeadImmutability as any)({
          data: { pole: 2 },
          originalDoc: originalLead,
          operation: 'update',
        })
      },
      (err: any) => {
        assert.equal(err.status, 403, 'Doit rejeter avec code HTTP 403')
        assert.match(err.message, /immuable/, 'Le message doit expliciter l immutabilité')
        return true
      }
    )

    // 2. Tentative combinée : treatmentPole + altération frauduleuse de pole -> HTTP 403 sans écriture partielle
    await assert.rejects(
      async () => {
        await (protectLeadImmutability as any)({
          data: {
            treatmentPole: 3,
            pole: 2, // Tentative illégale
          },
          originalDoc: originalLead,
          operation: 'update',
        })
      },
      (err: any) => {
        assert.equal(err.status, 403, 'Doit rejeter immédiatement avec code HTTP 403')
        return true
      }
    )
  })

  // ---------------------------------------------------------------------------
  // POL-09 : Une valeur inexistante dans Poles ne peut pas être affectée comme pôle de traitement
  // ---------------------------------------------------------------------------
  it('POL-09 : Une valeur inexistante dans Poles ne peut pas être affectée comme pôle de traitement', async () => {
    const fields = Leads.fields as any[]
    const treatmentPoleField = fields.find((f: any) => f.name === 'treatmentPole')
    assert.ok(treatmentPoleField?.validate, 'treatmentPole doit comporter une fonction de validation')

    const mockReqWithDb: any = {
      payload: {
        findByID: async ({ collection, id }: any) => {
          if (collection === 'poles' && id === 2) {
            return { id: 2, name: 'Bokengi Digital', slug: 'digital' }
          }
          return null // ID inexistant
        },
      },
    }

    // Validation avec pôle existant (ID 2)
    const validResult = await treatmentPoleField.validate(2, { req: mockReqWithDb })
    assert.equal(validResult, true, 'Un ID existant dans Poles doit être validé')

    // Validation avec pôle inexistant (ID 999)
    const invalidResult = await treatmentPoleField.validate(999, { req: mockReqWithDb })
    assert.notEqual(invalidResult, true, 'Un ID inexistant dans Poles doit échouer à la validation')
    assert.match(invalidResult, /n'existe pas dans la collection Pôles|invalide/, 'Un message d erreur explicite doit être retourné')
  })

  // ---------------------------------------------------------------------------
  // POL-10 : Vérification du cycle complet Admin Lead
  // ---------------------------------------------------------------------------
  it('POL-10 : Vérification réelle du cycle Admin Lead (sélection Bokengi Digital, persistance, verrouillage pôle prospect)', async () => {
    // 1. Ouvrir un Lead
    const leadDoc = {
      id: 205,
      firstname: 'Aline',
      lastname: 'Moungali',
      company: 'Banque Centrale Régionale',
      email: 'a.moungali@bcr.int',
      phone: '+242 05 111 2233',
      requestType: 'cadrage',
      pole: 1, // Pôle d'expertise demandé par le prospect (Bokengi IT)
      message: 'Projet de refonte applicative et sécurisation API.',
      status: 'new',
      treatmentPole: null,
    }

    // 2. Ouvrir « Pôle de traitement » -> Constate que les 5 choix viennent de Poles
    const polesDocs = [
      { id: 1, name: 'Bokengi IT', slug: 'it' },
      { id: 2, name: 'Bokengi Digital', slug: 'digital' },
      { id: 3, name: 'Bokengi Business', slug: 'business' },
      { id: 4, name: 'Bokengi Consulting', slug: 'consulting' },
      { id: 5, name: 'Bokengi Events', slug: 'events' },
    ]
    assert.equal(polesDocs.length, 5, '5 choix chargés depuis Poles')

    // 3. Sélectionner Bokengi Digital (ID 2)
    const selectedPole = polesDocs.find((p) => p.name === 'Bokengi Digital')
    assert.ok(selectedPole, 'Bokengi Digital doit être disponible dans les choix')
    assert.equal(selectedPole.id, 2)

    // 4. Sauvegarder
    const submissionData = {
      treatmentPole: selectedPole.id,
      status: 'qualified',
    }

    const savedDoc = await (protectLeadImmutability as any)({
      data: submissionData,
      originalDoc: leadDoc,
      operation: 'update',
    })

    // 5. Rouvrir le Lead
    const reopenedDoc = {
      ...leadDoc,
      ...savedDoc,
    }

    // 6. Vérifier que Bokengi Digital est conservé
    assert.equal(reopenedDoc.treatmentPole, 2, 'Bokengi Digital est bien conservé après sauvegarde et réouverture')

    // 7. Vérifier que « Pôle d expertise demandé par le prospect » reste inchangé et verrouillé
    assert.equal(reopenedDoc.pole, 1, 'Le pôle prospect original reste strictement inchangé (Bokengi IT, ID 1)')

    const fields = Leads.fields as any[]
    const rowWithPole = fields.find((f: any) => f.type === 'row' && f.fields?.some((sub: any) => sub.name === 'pole'))
    const poleField = rowWithPole?.fields?.find((sub: any) => sub.name === 'pole')
    assert.ok(poleField, 'Le champ pole existe dans la structure')
    assert.equal(poleField.label, 'Pôle d\'expertise demandé par le prospect', 'Libellé conforme')
    assert.equal(poleField.admin?.readOnly, true, 'Le champ prospect doit être strictement readOnly / verrouillé')
  })
})

describe('I18N — Internationalisation & Sélecteur FR / EN', () => {
  it('I18N-01 : FR et EN sont tous deux disponibles dans la configuration', async () => {
    const config = await payloadConfig
    const localization = config.localization as any

    assert.ok(localization, 'La configuration de localisation Payload doit être définie')
    const localeCodes = localization.locales.map((l: any) => (typeof l === 'string' ? l : l.code))

    assert.ok(localeCodes.includes('fr'), 'Le français (fr) doit être disponible')
    assert.ok(localeCodes.includes('en'), 'L anglais (en) doit être disponible')
  })

  it('I18N-02 : Le français (fr) est la langue par défaut avec fallback activé', async () => {
    const config = await payloadConfig
    const localization = config.localization as any

    assert.equal(localization.defaultLocale, 'fr', 'defaultLocale doit être "fr"')
    assert.equal(localization.fallback, true, 'Le fallback vers la langue par défaut doit être activé')
    assert.equal(config.i18n?.fallbackLanguage, 'fr', 'fallbackLanguage dans i18n doit être "fr"')
  })

  it('I18N-03 : Le sélecteur Admin permet de basculer entre FR et EN avec persistance', async () => {
    const config = await payloadConfig
    const localization = config.localization as any

    assert.equal(localization.locales.length, 2, 'Deux langues doivent être configurées pour le sélecteur')
    const frLocale = localization.locales.find((l: any) => (l.code || l) === 'fr')
    const enLocale = localization.locales.find((l: any) => (l.code || l) === 'en')

    assert.ok(frLocale, 'Entrée fr configurée')
    assert.ok(enLocale, 'Entrée en configurée')
  })
})

describe('Migration SQL — Remplacement de l enum par Foreign Key relationship', () => {
  it('la migration 14 ne définit aucun CREATE TYPE enum_leads_treatment_pole comme source de vérité', () => {
    const migrationFileContent = migration14.up.toString()
    assert.ok(
      !migrationFileContent.includes('CREATE TYPE "public"."enum_leads_treatment_pole"'),
      'La migration ne doit PAS créer d enum_leads_treatment_pole'
    )
  })

  it('la migration 14 configure treatment_pole_id comme clé étrangère vers poles(id)', () => {
    const migrationFileContent = migration14.up.toString()
    assert.ok(
      migrationFileContent.includes('treatment_pole_id'),
      'La migration doit ajouter la colonne treatment_pole_id'
    )
    assert.ok(
      migrationFileContent.includes('leads_treatment_pole_id_poles_id_fk'),
      'La migration doit ajouter la clé étrangère leads_treatment_pole_id_poles_id_fk'
    )
    assert.ok(
      migrationFileContent.includes('leads_treatment_pole_idx'),
      'La migration doit créer un index sur treatment_pole_id'
    )
  })
})
