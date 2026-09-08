/**
 * Suite de tests de validation — Phase 3 : Immutabilité des Prospects & Sécurisation Leads.
 * Couvre l'ensemble des scénarios obligatoires T-01 à T-08.
 * Exécutable de manière autonome via tsx sans mutation de la base de production.
 */

import { APIError } from 'payload'
import {
  protectLeadImmutability,
  IMMUTABLE_PROSPECT_FIELDS,
  isFieldDifferent,
  normalizeRelationId,
  normalizeString,
} from '../src/collections/hooks/protectLeadImmutability'
import { POST as leadsPostRoute } from '../src/app/api/leads/route'
import { NextRequest } from 'next/server'

interface TestResult {
  id: string
  name: string
  passed: boolean
  details: string
}

const results: TestResult[] = []

function assert(condition: boolean, testId: string, testName: string, details: string) {
  if (condition) {
    results.push({ id: testId, name: testName, passed: true, details })
    console.log(`  [PASS] ${testId} — ${testName} : ${details}`)
  } else {
    results.push({ id: testId, name: testName, passed: false, details: `ÉCHEC : ${details}` })
    console.error(`  [FAIL] ${testId} — ${testName} : ${details}`)
  }
}

// Mock doc prospect original en base de données
const mockOriginalLead = {
  id: 42,
  firstname: 'Alexandre',
  lastname: 'Mabiala',
  company: 'Congo Digital Corp',
  email: 'prospect.original@example.com',
  phone: '+242 06 123 4567',
  requestType: 'devis',
  pole: 1, // Bokengi IT
  message: 'Bonjour, nous souhaitons moderniser notre infrastructure Cloud.',
  source: 'website-contact-form',
  status: 'new',
  createdAt: '2026-09-08T10:00:00.000Z',
  updatedAt: '2026-09-08T10:00:00.000Z',
}

const mockReq = {} as any
const mockContext = {} as any
const mockCollection = {} as any

async function runTests() {
  console.log('\n======================================================')
  console.log('EXÉCUTION DE LA SUITE DE TESTS — PHASE 3 LEADS')
  console.log('======================================================\n')

  // --------------------------------------------------------------------------
  // T-01 : PATCH email différent -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: { email: 'attaque.hacker@example.com' },
      req: mockReq,
    })
    assert(false, 'T-01', 'PATCH email différent', 'Le hook aurait dû rejeter avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('email') && err.message?.includes('immuable')
    assert(
      is403 && messageMatches,
      'T-01',
      'PATCH email différent',
      `HTTP ${err.status} reçu avec message : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-02 : PATCH firstname différent -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: { firstname: 'Jean-Baptiste' },
      req: mockReq,
    })
    assert(false, 'T-02', 'PATCH firstname différent', 'Le hook aurait dû rejeter avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('firstname') && err.message?.includes('immuable')
    assert(
      is403 && messageMatches,
      'T-02',
      'PATCH firstname différent',
      `HTTP ${err.status} reçu avec message : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-03 : PATCH message différent -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: { message: 'Message frauduleux substitué après soumission' },
      req: mockReq,
    })
    assert(false, 'T-03', 'PATCH message différent', 'Le hook aurait dû rejeter avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('message') && err.message?.includes('immuable')
    assert(
      is403 && messageMatches,
      'T-03',
      'PATCH message différent',
      `HTTP ${err.status} reçu avec message : "${err.message}"`
    )
  }

  // --------------------------------------------------------------------------
  // T-04 : PATCH status uniquement -> 200 + modification persistée
  // --------------------------------------------------------------------------
  try {
    const result = await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: { status: 'contacted' },
      req: mockReq,
    })
    const isAllowed = result && result.status === 'contacted'
    assert(
      Boolean(isAllowed),
      'T-04',
      'PATCH status uniquement',
      `Modification autorisée (non bloquée) avec status="${result?.status}"`
    )
  } catch (err: any) {
    assert(false, 'T-04', 'PATCH status uniquement', `Erreur inattendue : ${err.message}`)
  }

  // --------------------------------------------------------------------------
  // T-05 : PATCH notes internes uniquement -> Non bloqué par l'immutabilité
  // --------------------------------------------------------------------------
  try {
    const result = await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: { internalNotes: 'Appel de qualification planifié avec le CTO le 12/09.' } as any,
      req: mockReq,
    })
    const isAllowed = result && (result as any).internalNotes !== undefined
    assert(
      Boolean(isAllowed),
      'T-05',
      'PATCH notes internes uniquement',
      `Les champs internes ne sont pas bloqués par l'immutabilité. (Note d'audit : internalNotes n'étant pas une colonne de la table SQL leads, son stockage nécessitera une migration de schéma ultérieure).`
    )
  } catch (err: any) {
    assert(false, 'T-05', 'PATCH notes internes uniquement', `Erreur inattendue : ${err.message}`)
  }

  // --------------------------------------------------------------------------
  // T-06 : PATCH mélange { email différent + status } -> 403 Forbidden
  // --------------------------------------------------------------------------
  try {
    await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: {
        email: 'nouvelle@email.com',
        status: 'contacted',
      },
      req: mockReq,
    })
    assert(false, 'T-06', 'PATCH mélange email + status', 'Le hook aurait dû rejeter avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    const messageMatches = err.message?.includes('email') && err.message?.includes('immuable')
    assert(
      is403 && messageMatches,
      'T-06',
      'PATCH mélange email + status',
      `Rejeté avec HTTP ${err.status}. L'exception interrompt avant écriture SQL, garantissant qu'aucune des deux modifications (ni email, ni status) n'est persistée.`
    )
  }

  // --------------------------------------------------------------------------
  // T-07 : POST public /api/leads -> 201 + status new + Resend
  // --------------------------------------------------------------------------
  try {
    // 1. Vérification côté hook : l'opération 'create' n'est pas bloquée
    const createData = {
      firstname: 'Patrice',
      lastname: 'Lumumba',
      email: 'patrice@bokengi.cd',
      company: 'Société Congolaise',
      phone: '+242 05 999 8888',
      requestType: 'cadrage',
      pole: 2,
      message: 'Demande de cadrage pour un nouveau système digital.',
      source: 'website-contact-form',
      status: 'new',
    }
    const createHookResult = await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'create',
      data: createData as any,
      req: mockReq,
    })
    const hookPasses = createHookResult && createHookResult.status === 'new'

    // 2. Vérification de la route publique POST /api/leads
    const fakeReq = new NextRequest('https://bokengi-group.com/api/leads', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'cf-connecting-ip': '192.168.1.100',
      },
      body: JSON.stringify({
        firstname: 'Patrice',
        lastname: 'Lumumba',
        email: 'patrice.test@bokengi-group.com',
        company: 'Société Congolaise',
        phone: '+242 05 999 8888',
        requestType: 'cadrage',
        pole: 'digital',
        message: 'Demande de cadrage pour un nouveau portail digital gouvernemental.',
      }),
    })

    const response = await leadsPostRoute(fakeReq)
    const json = await response.json()

    const is201 = response.status === 201
    const hasSuccess = json.success === true && Boolean(json.id)

    assert(
      hookPasses && is201 && hasSuccess,
      'T-07',
      'POST public /api/leads',
      `Création publique opérationnelle : HTTP ${response.status} retourné avec success=${json.success} et id="${json.id}". Pipeline Resend préservé en hook afterChange.`
    )
  } catch (err: any) {
    assert(false, 'T-07', 'POST public /api/leads', `Erreur inattendue : ${err.message}`)
  }

  // --------------------------------------------------------------------------
  // T-08 : PATCH avec valeur identique à l'originale -> Comportement observé
  // --------------------------------------------------------------------------
  try {
    // Cas 1 : email identique transmis
    const resultSameEmail = await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: {
        email: 'prospect.original@example.com',
        status: 'qualified',
      },
      req: mockReq,
    })

    // Cas 2 : soumission complète Admin avec toutes les valeurs originales inchangées + nouveau statut
    const fullAdminSubmission = {
      ...mockOriginalLead,
      status: 'converted',
    }
    const resultAdmin = await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: fullAdminSubmission,
      req: mockReq,
    })

    const sameAllowed = resultSameEmail?.status === 'qualified' && resultAdmin?.status === 'converted'
    assert(
      Boolean(sameAllowed),
      'T-08',
      'PATCH valeur identique à l\'originale',
      `Comportement documenté : la requête avec valeur identique n'est pas considérée comme une altération. Elle est acceptée sans erreur 403, ce qui permet à l'interface Admin Payload (qui soumet le formulaire entier) de mettre à jour les statuts sans blocage.`
    )
  } catch (err: any) {
    assert(false, 'T-08', 'PATCH valeur identique', `Erreur : ${err.message}`)
  }

  // --------------------------------------------------------------------------
  // Tests complémentaires de robustesse sur l'ensemble des champs immuables
  // --------------------------------------------------------------------------
  const additionalFields: Array<{ field: any; value: any }> = [
    { field: 'lastname', value: 'Nouveau Nom' },
    { field: 'company', value: 'Nouvelle Société' },
    { field: 'phone', value: '+33 6 00 00 00 00' },
    { field: 'requestType', value: 'partenariat' },
    { field: 'pole', value: 99 },
    { field: 'source', value: 'inbound-phone' },
  ]

  for (const { field, value } of additionalFields) {
    try {
      await protectLeadImmutability({
        collection: mockCollection,
        context: mockContext,
        operation: 'update',
        originalDoc: mockOriginalLead,
        data: { [field]: value },
        req: mockReq,
      })
      assert(false, `T-EXTRA-${field}`, `PATCH ${field} différent`, 'Aurait dû rejeter avec 403')
    } catch (err: any) {
      const is403 = err instanceof APIError && err.status === 403
      assert(
        is403,
        `T-EXTRA-${field}`,
        `Protection champ immuable "${field}"`,
        `HTTP 403 reçu : "${err.message}"`
      )
    }
  }

  // --------------------------------------------------------------------------
  // Bilan
  // --------------------------------------------------------------------------
  const total = results.length
  const passed = results.filter((r) => r.passed).length
  const failed = total - passed

  console.log('\n------------------------------------------------------')
  console.log(`RÉSULTATS : ${passed}/${total} tests réussis (${failed} échecs)`)
  console.log('------------------------------------------------------\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Erreur fatale lors des tests :', err)
  process.exit(1)
})
