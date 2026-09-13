/**
 * Test Suite: Project Consultation UX, Email Notifications & FR/EN i18n
 * Verifies:
 * 1. Leads immutability non-regression (prospect data protected, internal treatment editable)
 * 2. Resend email notification subject format, body, plain-text fallback, non-blocking resilience
 * 3. i18n dictionary completeness, key parity between FR and EN
 * 4. Payload admin configuration and CSS accessibility rules
 */

import { APIError } from 'payload'
import {
  protectLeadImmutability,
  IMMUTABLE_PROSPECT_FIELDS,
} from '../src/collections/hooks/protectLeadImmutability'
import {
  formatLeadEmailSubject,
  buildLeadNotificationContent,
  REQUEST_TYPE_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  notifyNewLeadReceived,
} from '../src/lib/notifications'
import { fr } from '../src/i18n/dictionaries/fr'
import { en } from '../src/i18n/dictionaries/en'
import fs from 'fs'
import path from 'path'

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

const mockOriginalLead = {
  id: 42,
  firstname: 'Alexandre',
  lastname: 'Mabiala',
  company: 'Congo Digital Corp',
  email: 'prospect.original@example.com',
  phone: '+242 06 123 4567',
  requestType: 'devis',
  pole: 1,
  message: 'Bonjour, nous souhaitons moderniser notre infrastructure Cloud.',
  source: 'website-contact-form',
  status: 'new',
  priority: 'high',
  createdAt: '2026-09-08T10:00:00.000Z',
  updatedAt: '2026-09-08T10:00:00.000Z',
}

const mockReq = {} as any
const mockContext = {} as any
const mockCollection = {} as any

async function runTests() {
  console.log('\n======================================================')
  console.log('TESTS — CONSULTATION PROJETS / EMAIL / I18N')
  console.log('======================================================\n')

  // ==========================================================================
  // SECTION 1 : NON-RÉGRESSION IMMUTABILITÉ DES PROSPECTS
  // ==========================================================================
  console.log('--- SECTION 1 : Immutabilité des prospects ---')

  assert(
    IMMUTABLE_PROSPECT_FIELDS.length === 9,
    'IMM-01',
    'Liste des champs immuables',
    `9 champs enregistrés : ${IMMUTABLE_PROSPECT_FIELDS.join(', ')}`
  )

  for (const field of IMMUTABLE_PROSPECT_FIELDS) {
    try {
      await protectLeadImmutability({
        collection: mockCollection,
        context: mockContext,
        operation: 'update',
        originalDoc: mockOriginalLead,
        data: { [field]: 'VALEUR_MODIFIEE_INTERDITE' },
        req: mockReq,
      })
      assert(false, `IMM-${field}`, `Tentative modification ${field}`, 'Devrait être rejeté avec 403')
    } catch (err: any) {
      const is403 = err instanceof APIError && err.status === 403
      assert(is403, `IMM-${field}`, `Tentative modification ${field}`, `Rejeté avec HTTP 403 (${err.message})`)
    }
  }

  // Vérification que les champs internes restent modifiables
  try {
    await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: {
        status: 'qualifying',
        priority: 'urgent',
        assignedTo: 5,
        internalNotes: 'Contacté ce matin par téléphone. Entretien calé pour lundi.',
      },
      req: mockReq,
    })
    assert(true, 'IMM-INTERNAL', 'Modification champs traitement interne', 'status, priority, assignedTo, internalNotes modifiables sans erreur')
  } catch (err: any) {
    assert(false, 'IMM-INTERNAL', 'Modification champs traitement interne', `Échec inattendu : ${err.message}`)
  }

  // CRM-POLE-01 : Vérification que le nouveau champ opérationnel treatmentPole est modifiable
  try {
    const updatedTreatment = await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: {
        treatmentPole: 'digital',
        status: 'qualified',
      },
      req: mockReq,
    })
    assert(
      (updatedTreatment as any).treatmentPole === 'digital' && updatedTreatment.status === 'qualified',
      'CRM-POLE-01',
      'Pôle de traitement opérationnel modifiable',
      'treatmentPole ("digital") modifiable sans déclencher de rejet 403'
    )
  } catch (err: any) {
    assert(false, 'CRM-POLE-01', 'Pôle de traitement opérationnel modifiable', `Échec inattendu : ${err.message}`)
  }

  // CRM-POLE-02 : Vérification que la modification de treatmentPole n'écrase pas le pôle original pole
  try {
    const res = await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: {
        treatmentPole: 'consulting',
      },
      req: mockReq,
    })
    assert(
      !('pole' in res),
      'CRM-POLE-02',
      'Indépendance pôle demandé vs traitement',
      'Modifier treatmentPole ("consulting") ne touche pas au pôle demandé (pole=1 intact)'
    )
  } catch (err: any) {
    assert(false, 'CRM-POLE-02', 'Indépendance pôle demandé vs traitement', `Échec inattendu : ${err.message}`)
  }

  // CRM-POLE-03 : Vérification que toute tentative de modifier pole (le pôle demandé) est STRICTEMENT bloquée
  try {
    await protectLeadImmutability({
      collection: mockCollection,
      context: mockContext,
      operation: 'update',
      originalDoc: mockOriginalLead,
      data: {
        pole: 2,
        treatmentPole: 'business',
      },
      req: mockReq,
    })
    assert(false, 'CRM-POLE-03', 'Immutabilité stricte du pôle demandé', 'Aurait dû être rejeté avec 403')
  } catch (err: any) {
    const is403 = err instanceof APIError && err.status === 403
    assert(is403, 'CRM-POLE-03', 'Immutabilité stricte du pôle demandé', `Rejeté avec HTTP 403 (${err.message})`)
  }

  // ==========================================================================
  // SECTION 2 : FORMAT & NOTIFICATIONS EMAIL RESEND
  // ==========================================================================
  console.log('\n--- SECTION 2 : Notifications Email Resend ---')

  // EML-01 : Format exact du sujet avec entreprise
  const subjectWithCompany = formatLeadEmailSubject({
    requestType: 'devis',
    company: 'TotalEnergies Congo',
  })
  const expectedSubjectWithCompany = '[Bokengi] Nouveau projet reçu — Devis chiffré — TotalEnergies Congo'
  assert(
    subjectWithCompany === expectedSubjectWithCompany,
    'EML-01',
    'Format sujet avec entreprise',
    `Généré : "${subjectWithCompany}"`
  )

  // EML-02 : Format exact du sujet sans entreprise
  const subjectWithoutCompany = formatLeadEmailSubject({
    requestType: 'cadrage',
    company: '',
  })
  const expectedSubjectWithoutCompany = '[Bokengi] Nouveau projet reçu — Cadrage de projet & audit — Particulier / Non renseigné'
  assert(
    subjectWithoutCompany === expectedSubjectWithoutCompany,
    'EML-02',
    'Format sujet sans entreprise',
    `Généré : "${subjectWithoutCompany}"`
  )

  // EML-03 : Contenu HTML & Plain-text
  const content = buildLeadNotificationContent(mockOriginalLead)
  assert(
    content.html.includes('[Bokengi] Nouveau projet reçu') &&
    content.html.includes('Congo Digital Corp') &&
    content.html.includes('Alexandre Mabiala') &&
    content.html.includes('prospect.original@example.com') &&
    content.html.includes('/admin/collections/leads/42'),
    'EML-03',
    'Contenu HTML structuré',
    'Contient le titre officiel, identité, entreprise, email et lien admin direct'
  )

  // EML-04 : Plain-text fallback complet
  assert(
    content.text.includes('BOKENGI GROUP — NOUVEAU PROJET REÇU') &&
    content.text.includes('Alexandre Mabiala') &&
    content.text.includes('prospect.original@example.com') &&
    content.text.includes('Bonjour, nous souhaitons moderniser notre infrastructure Cloud.') &&
    content.text.includes('/admin/collections/leads/42'),
    'EML-04',
    'Plain-text fallback complet',
    'Contient toutes les sections textuelles, coordonnées et URL directe'
  )

  // EML-05 : Non-blocage en cas d'absence de clé API Resend ou erreur réseau
  try {
    const notifyResult = await notifyNewLeadReceived(mockOriginalLead)
    // Ne doit pas lever d'exception même si RESEND_API_KEY est non défini ou invalide dans l'env de test
    assert(
      notifyResult !== undefined,
      'EML-05',
      'Résilience notifyNewLeadReceived',
      'Exécution non-bloquante sous try/catch propre'
    )
  } catch (err: any) {
    assert(false, 'EML-05', 'Résilience notifyNewLeadReceived', `Une exception a fuité : ${err.message}`)
  }

  // ==========================================================================
  // SECTION 3 : INTERNATIONALISATION FR / EN
  // ==========================================================================
  console.log('\n--- SECTION 3 : Dictionnaires i18n & Parité ---')

  // I18N-01 : Vérification récursive de parité de clés entre FR et EN
  function compareKeys(obj1: Record<string, any>, obj2: Record<string, any>, prefix = ''): string[] {
    const diffs: string[] = []
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    for (const key of keys1) {
      const fullPath = prefix ? `${prefix}.${key}` : key
      if (!(key in obj2)) {
        diffs.push(`Clé manquante dans EN: ${fullPath}`)
      } else if (typeof obj1[key] === 'object' && obj1[key] !== null) {
        if (typeof obj2[key] !== 'object' || obj2[key] === null) {
          diffs.push(`Type différent pour: ${fullPath}`)
        } else {
          diffs.push(...compareKeys(obj1[key], obj2[key], fullPath))
        }
      } else if (typeof obj1[key] === 'string') {
        if (typeof obj2[key] !== 'string' || obj2[key].trim() === '') {
          diffs.push(`Chaîne vide ou non-string dans EN pour: ${fullPath}`)
        }
      }
    }

    for (const key of keys2) {
      const fullPath = prefix ? `${prefix}.${key}` : key
      if (!(key in obj1)) {
        diffs.push(`Clé superflue dans EN: ${fullPath}`)
      }
    }

    return diffs
  }

  const i18nDiffs = compareKeys(fr as any, en as any)
  assert(
    i18nDiffs.length === 0,
    'I18N-01',
    'Parité exacte dictionnaires FR / EN',
    i18nDiffs.length === 0 ? 'Toutes les clés FR et EN coïncident à 100%' : `Différences trouvées : ${i18nDiffs.join('; ')}`
  )

  // I18N-02 : Clés requises
  assert(
    Boolean(fr.nav.group && en.nav.group && fr.contactForm.submit && en.contactForm.submit && fr.footer.legalNotice && en.footer.legalNotice),
    'I18N-02',
    'Présence des clés requises d’interface',
    'nav, contactForm, expertises, footer validés'
  )

  // ==========================================================================
  // SECTION 4 : ACCESSIBILITÉ CSS & PAYLOAD CONFIG
  // ==========================================================================
  console.log('\n--- SECTION 4 : Accessibilité CSS & Configuration Payload ---')

  const customCssPath = path.resolve(process.cwd(), 'src/app/(payload)/custom.css')
  const customCss = fs.readFileSync(customCssPath, 'utf8')

  // CSS-01 : Opacité 100% et webkit-text-fill-color pour les champs read-only
  assert(
    customCss.includes('opacity: 1 !important') &&
    customCss.includes('-webkit-text-fill-color: currentColor !important'),
    'CSS-01',
    'Lisibilité des champs lecture seule',
    'opacity 100% et neutralisation du -webkit-text-fill-color appliqués'
  )

  // CSS-02 : Présence des styles de badges conformes WCAG AA
  const hasBadges =
    customCss.includes('.bokengi-status-badge--new') &&
    customCss.includes('.bokengi-status-badge--qualified') &&
    customCss.includes('.bokengi-status-badge--converted') &&
    customCss.includes('.bokengi-priority-badge--urgent') &&
    customCss.includes('.bokengi-priority-badge--high') &&
    customCss.includes('.bokengi-priority-badge--low')
  assert(
    hasBadges,
    'CSS-02',
    'Badges de statut et priorité stylisés',
    'Classes .bokengi-status-badge--* et .bokengi-priority-badge--* présentes'
  )

  // CSS-03 : Composants Lead Dossier présents dans CSS
  const hasDossierStyles =
    customCss.includes('.bokengi-lead-summary-card') &&
    customCss.includes('.bokengi-prospect-info-card') &&
    customCss.includes('.bokengi-prospect-message-card') &&
    customCss.includes('.bokengi-internal-section-divider')
  assert(
    hasDossierStyles,
    'CSS-03',
    'Styles du dossier Lead Admin',
    'Styles bokengi-lead-summary-card, bokengi-prospect-info-card, bokengi-prospect-message-card, bokengi-internal-section-divider configurés'
  )

  // CSS-04 : Styles spécifiques CRM Lead UX V2
  const hasCrmV2Styles =
    customCss.includes('.bokengi-lead-summary-grid--8kpi') &&
    customCss.includes('.bokengi-project-brief-card') &&
    customCss.includes('.bokengi-treatment-sidebar-header') &&
    customCss.includes('.bokengi-contact-action-btn--primary') &&
    customCss.includes('.bokengi-summary-pole-tag--treatment')
  assert(
    hasCrmV2Styles,
    'CSS-04',
    'Styles CRM Lead UX V2',
    'Grille 8 KPI, carte Project Brief, en-tête sidebar et boutons d\'action directe configurés dans custom.css'
  )

  // SCH-01 : Validation du schéma Leads.ts (Zone A prospect vs Zone B sidebar)
  const leadsSchemaPath = path.resolve(process.cwd(), 'src/collections/Leads.ts')
  const leadsSchema = fs.readFileSync(leadsSchemaPath, 'utf8')
  const hasTreatmentPoleField =
    leadsSchema.includes("name: 'treatmentPole'") &&
    leadsSchema.includes("label: 'Pôle de traitement'") &&
    leadsSchema.includes("position: 'sidebar'")
  const hasRequestedPoleRenamed =
    leadsSchema.includes("label: \"Pôle d'expertise demandé par le prospect\"") ||
    leadsSchema.includes("label: 'Pôle d\\'expertise demandé par le prospect'")
  const hasSidebarHeader = leadsSchema.includes("name: 'sidebarTreatmentHeader'")
  assert(
    hasTreatmentPoleField && hasRequestedPoleRenamed && hasSidebarHeader,
    'SCH-01',
    'Schéma Leads CRM V2 conforme',
    'treatmentPole en sidebar, pôle demandé renommé et SidebarTreatmentHeader configuré'
  )

  // CFG-01 : Configuration Payload i18n
  const payloadConfigPath = path.resolve(process.cwd(), 'src/payload.config.ts')
  const payloadConfig = fs.readFileSync(payloadConfigPath, 'utf8')
  assert(
    payloadConfig.includes("fallbackLanguage: 'fr'") &&
    payloadConfig.includes('supportedLanguages: { fr, en }'),
    'CFG-01',
    'Payload Admin i18n natif',
    'Français configuré comme fallbackLanguage et anglais activé dans supportedLanguages'
  )

  // ==========================================================================
  // BILAN FINAL
  // ==========================================================================
  console.log('\n======================================================')
  const total = results.length
  const passed = results.filter((r) => r.passed).length
  const failed = total - passed
  console.log(`RÉSULTATS : ${passed} / ${total} tests validés (${failed} échec(s))`)
  console.log('======================================================\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Erreur fatale lors de l’exécution des tests :', err)
  process.exit(1)
})
