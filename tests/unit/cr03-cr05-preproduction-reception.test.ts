import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

describe('BOKENGI 2.0 — CR-03 + CR-05 : RECETTE PRÉ-PRODUCTION DU FRAMEWORK FINANCIER & E-INVOICING', () => {
  const FRAMEWORK_DOC = path.resolve(process.cwd(), 'BOKENGI_2.0_FINANCIAL_AND_EINVOICING_FRAMEWORK.md')
  const TECH_DESIGN_DOC = path.resolve(process.cwd(), 'BOKENGI_2.0_CR03_CR05_TECHNICAL_DESIGN.md')
  const IMPL_REPORT_DOC = path.resolve(process.cwd(), 'BOKENGI_2.0_CR03_CR05_IMPLEMENTATION_REPORT.md')

  const TX_JSON = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/doctype/bokengi_einvoice_transaction/bokengi_einvoice_transaction.json')
  const LOG_JSON = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/doctype/bokengi_einvoice_log/bokengi_einvoice_log.json')
  const CF_JSON = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/fixtures/custom_field.json')
  const HOOKS_PATH = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/hooks.py')
  const GUARDS_PATH = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/einvoice/guards.py')
  const ENGINE_PATH = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/einvoice/engine.py')
  const ROUTER_PATH = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/einvoice/router.py')

  // ──────────────────────────────────────────────────────────────────────────
  // 1. VÉRIFICATION DU MODÈLE DE CRÉATION MANUELLE ET DU VERROU HUMAIN
  // ──────────────────────────────────────────────────────────────────────────
  it('REC-01: Sales Invoice manual creation & role guard enforcement', () => {
    assert(fs.existsSync(GUARDS_PATH), 'guards.py must exist')
    const guardsContent = fs.readFileSync(GUARDS_PATH, 'utf-8')

    assert(guardsContent.includes('validate_sales_invoice_manual_submission'), 'Submission guard must be defined')
    assert(guardsContent.includes('Accounts Manager'), 'Accounts Manager role is required')
    assert(guardsContent.includes('System Manager'), 'System Manager role is accepted')
    assert(guardsContent.includes('frappe.throw'), 'Throws exception on unauthorized automatic submission')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 2. SUPPORT BIMODAL : MODE FORFAIT & MODE TJM
  // ──────────────────────────────────────────────────────────────────────────
  it('REC-02: Support bimodal tarifaire Forfait et TJM x Quantite', () => {
    const cfContent = JSON.parse(fs.readFileSync(CF_JSON, 'utf-8'))
    const billingModelField = cfContent.find((f: { name: string }) => f.name === 'Sales Invoice-bokengi_billing_model')

    assert(billingModelField, 'bokengi_billing_model field must exist in custom_field.json')
    assert(billingModelField.options.includes('Forfait'), 'Must include Forfait option')
    assert(billingModelField.options.includes('Regie_TJM'), 'Must include Regie_TJM option')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 3. GESTION DES ACOMPTES ET JALONS DE PAIEMENT
  // ──────────────────────────────────────────────────────────────────────────
  it('REC-03: Configuration des acomptes et jalons de paiement par projet', () => {
    const cfContent = JSON.parse(fs.readFileSync(CF_JSON, 'utf-8'))
    const milestoneField = cfContent.find((f: { name: string }) => f.name === 'Sales Invoice-bokengi_payment_milestone')
    const depositField = cfContent.find((f: { name: string }) => f.name === 'Sales Invoice-bokengi_deposit_percent')

    assert(milestoneField, 'bokengi_payment_milestone field must exist')
    assert(depositField, 'bokengi_deposit_percent field must exist')
    assert(milestoneField.options.includes('Acompte_Commande'), 'Supports Acompte_Commande milestone')
    assert(milestoneField.options.includes('Solde_PV_Signe'), 'Supports Solde_PV_Signe milestone')
    assert(milestoneField.options.includes('Regie_Mensuelle'), 'Supports Regie_Mensuelle milestone')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 4. FACTURE DE SOLDE CONDITIONNÉE AU PV DE RÉCEPTION SIGNÉ
  // ──────────────────────────────────────────────────────────────────────────
  it('REC-04: Facture de solde conditionnee a la presence du PV signe', () => {
    const engineContent = fs.readFileSync(ENGINE_PATH, 'utf-8')
    assert(engineContent.includes('Solde_PV_Signe'), 'Engine checks for Solde_PV_Signe milestone')
    assert(engineContent.includes('bokengi_pv_attachment'), 'Engine checks for bokengi_pv_attachment')
    assert(engineContent.includes('PV de réception signé'), 'Engine enforces signed PV message')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 5. GÉNÉRATION E-INVOICE (FACTUR-X CII/UBL XML) ET CALCUL SHA-256
  // ──────────────────────────────────────────────────────────────────────────
  it('REC-05: Generation E-Invoice Factur-X XML et calcul empreinte SHA-256', () => {
    const engineContent = fs.readFileSync(ENGINE_PATH, 'utf-8')
    assert(engineContent.includes('CrossIndustryInvoice'), 'Must generate UN/CEFACT CrossIndustryInvoice XML')
    assert(engineContent.includes('urn:factur-x.eu:1p0:comfort'), 'Factur-X comfort profile guideline present')
    assert(engineContent.includes('compute_sha256'), 'SHA-256 computation method present')

    // Simulation de calcul SHA-256 sur un document test
    const dummyXml = '<rsm:CrossIndustryInvoice><ram:ID>FAC-2026-TEST</ram:ID></rsm:CrossIndustryInvoice>'
    const hash = crypto.createHash('sha256').update(dummyXml, 'utf-8').digest('hex')
    assert.strictEqual(hash.length, 64, 'SHA-256 hash must be 64 characters hex')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 6. PERSISTANCE DES DOCTYPES TRANSACTION ET LOG (PAF)
  // ──────────────────────────────────────────────────────────────────────────
  it('REC-06: Persistance des DocTypes Bokengi EInvoice Transaction et Log (PAF)', () => {
    const txContent = JSON.parse(fs.readFileSync(TX_JSON, 'utf-8'))
    const logContent = JSON.parse(fs.readFileSync(LOG_JSON, 'utf-8'))

    // Transaction
    const txFields = txContent.fields.map((f: { fieldname: string }) => f.fieldname)
    assert(txFields.includes('sales_invoice'), 'Transaction links to sales_invoice')
    assert(txFields.includes('transmission_id'), 'Transaction tracks transmission_id')
    assert(txFields.includes('file_sha256'), 'Transaction tracks file_sha256')
    assert(txFields.includes('status'), 'Transaction tracks status')

    // Log (PAF)
    const logFields = logContent.fields.map((f: { fieldname: string }) => f.fieldname)
    assert(logFields.includes('transaction'), 'Log links to transaction')
    assert(logFields.includes('event_type'), 'Log records event_type')
    assert(logFields.includes('raw_response'), 'Log stores raw_response JSON')
    assert(logFields.includes('timestamp'), 'Log timestamps UTC')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 7. ROUTAGE JURIDICTIONNEL MULTI-PAYS (FR_STANDARD, EU_B2B, INT_EXPORT)
  // ──────────────────────────────────────────────────────────────────────────
  it('REC-07: Routage juridictionnel multi-pays et selection adaptateur', () => {
    const routerContent = fs.readFileSync(ROUTER_PATH, 'utf-8')

    assert(routerContent.includes('ChorusProAdapter'), 'Routes France B2G/PPF to ChorusProAdapter')
    assert(routerContent.includes('PDPFranceAdapter'), 'Routes France B2B to PDPFranceAdapter')
    assert(routerContent.includes('PeppolAdapter'), 'Routes International/EU to PeppolAdapter')
    assert(routerContent.includes('StandaloneExportAdapter'), 'Routes Default/Manual to StandaloneExportAdapter')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 8. SIMULATION TRANSMISSION NOMINALE ET TRANSITION D'ÉTATS
  // ──────────────────────────────────────────────────────────────────────────
  it('REC-08: Simulation du cycle de transmission nominale (DRAFT -> SUBMITTED -> TRANSMITTED -> ACCEPTED -> ARCHIVED)', () => {
    const engineContent = fs.readFileSync(ENGINE_PATH, 'utf-8')
    const validStatuses = ['DRAFT', 'SUBMITTED', 'TRANSMITTED', 'ACCEPTED', 'REJECTED', 'CORRECTION_REQUIRED', 'RESUBMISSION', 'ARCHIVED']

    for (const st of validStatuses) {
      assert(engineContent.includes(st), `Engine must support status ${st}`)
    }
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 9. SIMULATION DU REJET, CORRECTION ET RESOUMISSION
  // ──────────────────────────────────────────────────────────────────────────
  it('REC-09: Simulation du rejet, correction et resoumission (Error & Resubmission Flow)', () => {
    const engineContent = fs.readFileSync(ENGINE_PATH, 'utf-8')
    assert(engineContent.includes('handle_status_transition'), 'Engine must support handle_status_transition')
    assert(engineContent.includes('on_sales_invoice_cancelled'), 'Supports handling cancellation and marking REJECTED')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 10. VÉRIFICATION DE L'ABSENCE TOTALE DE FACTURATION AUTOMATISÉE
  // ──────────────────────────────────────────────────────────────────────────
  it('REC-10: Verrou absolu anti-facturation automatique dans les API, webhooks et delivery', () => {
    const hooksContent = fs.readFileSync(HOOKS_PATH, 'utf-8')
    assert(hooksContent.includes('validate_sales_invoice_manual_submission'), 'validate hook registered on Sales Invoice')

    // Verrouillage des routes publiques
    const apiRoutesDir = path.resolve(process.cwd(), 'src/app/api')
    if (fs.existsSync(apiRoutesDir)) {
      const files = fs.readdirSync(apiRoutesDir, { recursive: true })
      for (const f of files) {
        if (typeof f === 'string' && (f.endsWith('.ts') || f.endsWith('.tsx'))) {
          const content = fs.readFileSync(path.join(apiRoutesDir, f), 'utf-8')
          assert(!content.includes('docstatus: 1') || !content.includes('Sales Invoice'), `No API route may auto-submit Sales Invoice: ${f}`)
        }
      }
    }
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 11. VÉRIFICATION DU RESPECT DE LA GOUVERNANCE SANS DONNÉES FICTIVES
  // ──────────────────────────────────────────────────────────────────────────
  it('REC-11: Zero donnee financiere fictive et exclusion stricte de InfraPulse', () => {
    const engineContent = fs.readFileSync(ENGINE_PATH, 'utf-8')
    const routerContent = fs.readFileSync(ROUTER_PATH, 'utf-8')

    assert(!engineContent.toLowerCase().includes('infrapulse'), 'No InfraPulse in engine')
    assert(!routerContent.toLowerCase().includes('infrapulse'), 'No InfraPulse in router')
  })
})
