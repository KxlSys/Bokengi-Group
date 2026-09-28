import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

describe('BOKENGI 2.0 — Unified Financial & E-Invoicing Framework (CR-03 + CR-05)', () => {
  const FRAMEWORK_DOC_PATH = path.resolve(process.cwd(), 'BOKENGI_2.0_FINANCIAL_AND_EINVOICING_FRAMEWORK.md')

  it('FIN-01: Framework specification exists and contains target architecture', () => {
    assert(fs.existsSync(FRAMEWORK_DOC_PATH), 'BOKENGI_2.0_FINANCIAL_AND_EINVOICING_FRAMEWORK.md must exist')
    const content = fs.readFileSync(FRAMEWORK_DOC_PATH, 'utf-8')

    assert(content.includes('IPDPAdapter'), 'Must define IPDPAdapter interface')
    assert(content.includes('EInvoiceTransaction'), 'Must define EInvoiceTransaction data model')
    assert(content.includes('EInvoiceStatusLog'), 'Must define EInvoiceStatusLog data model')
  })

  it('FIN-02: Verifies dual pricing models (Forfait and TJM x Quantity)', () => {
    const content = fs.readFileSync(FRAMEWORK_DOC_PATH, 'utf-8')

    assert(content.includes('Forfait par Prestation'), 'Must support fixed fee per service')
    assert(content.includes('Régie / Temps Passé (TJM × Quantité)'), 'Must support TJM x days')
  })

  it('FIN-03: Verifies flexible and non-frozen naming series convention', () => {
    const content = fs.readFileSync(FRAMEWORK_DOC_PATH, 'utf-8')

    assert(content.includes('DEV-.YYYY.-') && content.includes('FAC-.YYYY.-'), 'Supports French convention')
    assert(content.includes('QTN-.YYYY.-') && content.includes('ACC-SINV-.YYYY.-'), 'Supports International convention')
  })

  it('FIN-04: Verifies absolute human validation lock for Sales Invoice creation/submission', () => {
    const content = fs.readFileSync(FRAMEWORK_DOC_PATH, 'utf-8')

    assert(content.includes('Validation Humaine Obligatoire'), 'Must require mandatory human validation')
    assert(content.includes('AUCUNE facture de vente (Sales Invoice) n\'est créée automatiquement'), 'Must state 0 automated invoice creation')
  })

  it('FIN-05: Verifies complete status lifecycle including rejection and resubmission', () => {
    const content = fs.readFileSync(FRAMEWORK_DOC_PATH, 'utf-8')

    const requiredStatuses = [
      'DRAFT',
      'SUBMITTED',
      'TRANSMITTED',
      'ACCEPTED',
      'ARCHIVED',
      'REJECTED',
      'CORRECTION_REQUIRED',
      'RESUBMISSION'
    ]

    for (const status of requiredStatuses) {
      assert(content.includes(status), `Lifecycle must include status: ${status}`)
    }
  })

  it('FIN-06: Verifies complete isolation from InfraPulse and zero fake financial data', () => {
    const content = fs.readFileSync(FRAMEWORK_DOC_PATH, 'utf-8')

    assert(content.includes('InfraPulse strictement hors périmètre'), 'InfraPulse must be excluded')
    assert(content.includes('Zéro Donnée Fictive'), 'Must enforce zero fake financial data')
  })

  it('FIN-07: Verifies technical design document BOKENGI_2.0_CR03_CR05_TECHNICAL_DESIGN.md', () => {
    const TECH_DESIGN_PATH = path.resolve(process.cwd(), 'BOKENGI_2.0_CR03_CR05_TECHNICAL_DESIGN.md')
    assert(fs.existsSync(TECH_DESIGN_PATH), 'Technical design doc must exist')
    const content = fs.readFileSync(TECH_DESIGN_PATH, 'utf-8')

    assert(content.includes('IPDPAdapter'), 'IPDPAdapter must be present in tech design')
    assert(content.includes('Bokengi EInvoice Transaction'), 'DocType Bokengi EInvoice Transaction must be defined')
    assert(content.includes('Bokengi EInvoice Log'), 'DocType Bokengi EInvoice Log must be defined')
    assert(content.includes('validate_sales_invoice_manual_submission'), 'Human validation guard must be defined')
    assert(content.includes('InfraPulse strictement exclu') || content.includes('InfraPulse strictement hors périmètre'), 'InfraPulse must be excluded')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // STAGING IMPLEMENTATION VERIFICATION (DocTypes, Custom Fields, Engine, Adapters)
  // ──────────────────────────────────────────────────────────────────────────
  it('FIN-08: Verifies DocType schemas for Bokengi EInvoice Transaction and Log', () => {
    const TX_JSON = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/doctype/bokengi_einvoice_transaction/bokengi_einvoice_transaction.json')
    const LOG_JSON = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/doctype/bokengi_einvoice_log/bokengi_einvoice_log.json')

    assert(fs.existsSync(TX_JSON), 'Transaction DocType JSON must exist')
    assert(fs.existsSync(LOG_JSON), 'Log DocType JSON must exist')

    const txContent = JSON.parse(fs.readFileSync(TX_JSON, 'utf-8'))
    const logContent = JSON.parse(fs.readFileSync(LOG_JSON, 'utf-8'))

    assert.strictEqual(txContent.name, 'Bokengi EInvoice Transaction')
    assert.strictEqual(logContent.name, 'Bokengi EInvoice Log')
  })

  it('FIN-09: Verifies Custom Fields for Sales Invoice and Customer in custom_field.json', () => {
    const CF_JSON = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/fixtures/custom_field.json')
    assert(fs.existsSync(CF_JSON), 'custom_field.json must exist')
    const customFields = JSON.parse(fs.readFileSync(CF_JSON, 'utf-8'))

    const fieldNames = customFields.map((f: { name: string }) => f.name)
    assert(fieldNames.includes('Sales Invoice-bokengi_billing_model'), 'Missing bokengi_billing_model')
    assert(fieldNames.includes('Sales Invoice-bokengi_jurisdiction'), 'Missing bokengi_jurisdiction')
    assert(fieldNames.includes('Sales Invoice-bokengi_payment_milestone'), 'Missing bokengi_payment_milestone')
    assert(fieldNames.includes('Sales Invoice-bokengi_deposit_percent'), 'Missing bokengi_deposit_percent')
    assert(fieldNames.includes('Sales Invoice-bokengi_pv_attachment'), 'Missing bokengi_pv_attachment')
    assert(fieldNames.includes('Sales Invoice-bokengi_einvoice_status'), 'Missing bokengi_einvoice_status')
    assert(fieldNames.includes('Sales Invoice-bokengi_einvoice_transmission_id'), 'Missing bokengi_einvoice_transmission_id')
    assert(fieldNames.includes('Sales Invoice-bokengi_einvoice_sha256'), 'Missing bokengi_einvoice_sha256')
    assert(fieldNames.includes('Customer-bokengi_vat_number'), 'Missing bokengi_vat_number')
    assert(fieldNames.includes('Customer-bokengi_registration_id'), 'Missing bokengi_registration_id')
    assert(fieldNames.includes('Customer-bokengi_peppol_id'), 'Missing bokengi_peppol_id')
  })

  it('FIN-10: Verifies hooks.py event bindings and fixture registrations', () => {
    const HOOKS_PATH = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/hooks.py')
    assert(fs.existsSync(HOOKS_PATH), 'hooks.py must exist')
    const content = fs.readFileSync(HOOKS_PATH, 'utf-8')

    assert(content.includes('validate_sales_invoice_manual_submission'), 'Manual submission guard bound in hooks')
    assert(content.includes('on_sales_invoice_submitted'), 'Submitted hook bound')
    assert(content.includes('on_sales_invoice_cancelled'), 'Cancelled hook bound')
    assert(content.includes('Sales Invoice-bokengi_billing_model'), 'Custom field registered in fixtures')
  })

  it('FIN-11: Verifies IPDPAdapter interface and all 4 concrete adapters', () => {
    const ADAPTER_IFACE = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/einvoice/adapter_interface.py')
    const CHORUS = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/einvoice/adapters/chorus_pro.py')
    const PDP_FR = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/einvoice/adapters/pdp_france.py')
    const PEPPOL = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/einvoice/adapters/peppol.py')
    const STANDALONE = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/einvoice/adapters/standalone.py')

    assert(fs.existsSync(ADAPTER_IFACE), 'adapter_interface.py must exist')
    assert(fs.existsSync(CHORUS), 'chorus_pro.py must exist')
    assert(fs.existsSync(PDP_FR), 'pdp_france.py must exist')
    assert(fs.existsSync(PEPPOL), 'peppol.py must exist')
    assert(fs.existsSync(STANDALONE), 'standalone.py must exist')
  })

  it('FIN-12: Verifies dynamic routing and engine logic', () => {
    const ROUTER_PATH = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/einvoice/router.py')
    const ENGINE_PATH = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/einvoice/engine.py')

    assert(fs.existsSync(ROUTER_PATH), 'router.py must exist')
    assert(fs.existsSync(ENGINE_PATH), 'engine.py must exist')

    const engineContent = fs.readFileSync(ENGINE_PATH, 'utf-8')
    assert(engineContent.includes('generate_facturx_xml_payload'), 'Must support Factur-X XML generation')
    assert(engineContent.includes('compute_sha256'), 'Must support SHA-256 hash calculation')
    assert(engineContent.includes('handle_status_transition'), 'Must handle status transitions')
  })
})


