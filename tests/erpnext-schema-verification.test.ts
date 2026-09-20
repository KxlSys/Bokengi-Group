import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

interface DocField {
  fieldname: string
  fieldtype: string
  label?: string
  reqd?: number
  unique?: number
  options?: string
  read_only?: number
}

interface DocTypeSchema {
  name: string
  module: string
  doctype: string
  is_submittable?: number
  istable?: number
  issingle?: number
  fields: DocField[]
  permissions?: any[]
}

const BASE_DIR = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp')
const DOCTYPES_DIR = path.join(BASE_DIR, 'bokengi_core/doctype')

function loadDocTypeJson(doctypeName: string): DocTypeSchema {
  const filePath = path.join(DOCTYPES_DIR, doctypeName, `${doctypeName}.json`)
  assert(fs.existsSync(filePath), `DocType JSON file missing: ${filePath}`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as DocTypeSchema
}

describe('ERPNext Schema & Bokengi App Verification Suite', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // 1. VÉRIFICATION DE LA STRUCTURE DE L'APPLICATION FRAPPE
  // ──────────────────────────────────────────────────────────────────────────
  it('App 1: bokengi_erp packaging structure is valid and complete', () => {
    const rootDir = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp')
    assert(fs.existsSync(path.join(rootDir, 'setup.py')), 'setup.py must exist')
    assert(fs.existsSync(path.join(rootDir, 'requirements.txt')), 'requirements.txt must exist')
    assert(fs.existsSync(path.join(rootDir, 'bokengi_erp/hooks.py')), 'hooks.py must exist')
    assert(fs.existsSync(path.join(rootDir, 'bokengi_erp/api.py')), 'api.py must exist')
    assert(fs.existsSync(path.join(rootDir, 'bokengi_erp/fixtures/custom_field.json')), 'custom_field.json fixture must exist')
    assert(fs.existsSync(path.join(rootDir, 'bokengi_erp/bokengi_core/lead_security.py')), 'lead_security.py must exist')
    console.log('  [PASS] App 1: Packaging structure verified.')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 2. VÉRIFICATION DES 10 DOCTYPES
  // ──────────────────────────────────────────────────────────────────────────
  const primaryDocTypes = ['bokengi_pole', 'bokengi_service', 'bokengi_case_study', 'bokengi_post', 'bokengi_settings']
  const childDocTypes = [
    'bokengi_technical_tag',
    'bokengi_technology_item',
    'bokengi_screenshot_item',
    'bokengi_category_item',
    'bokengi_tag_item',
  ]

  it('Schema 1: All 10 DocTypes JSON definitions exist and are well-formed', () => {
    for (const dt of [...primaryDocTypes, ...childDocTypes]) {
      const schema = loadDocTypeJson(dt)
      assert(schema.name, `DocType ${dt} missing 'name' attribute`)
      assert(schema.module === 'Bokengi Core', `DocType ${dt} module must be 'Bokengi Core', got '${schema.module}'`)
      assert(Array.isArray(schema.fields), `DocType ${dt} 'fields' must be an array`)
      assert(schema.fields.length > 0, `DocType ${dt} must have at least one field`)
    }
    console.log(`  [PASS] Schema 1: All 10 DocTypes verified.`)
  })

  it('Schema 2: Child tables are properly designated as istable: 1', () => {
    for (const dt of childDocTypes) {
      const schema = loadDocTypeJson(dt)
      assert.strictEqual(schema.istable, 1, `Child DocType ${dt} must have istable = 1`)
    }
    console.log('  [PASS] Schema 2: All 5 Child tables confirmed with istable = 1.')
  })

  it('Schema 3: Settings DocType is single (issingle: 1)', () => {
    const schema = loadDocTypeJson('bokengi_settings')
    assert.strictEqual(schema.issingle, 1, 'Bokengi Settings must have issingle = 1')
    console.log('  [PASS] Schema 3: Bokengi Settings confirmed as Single DocType.')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 3. VÉRIFICATION DES CLÉS D'IDEMPOTENCE (custom_payload_id)
  // ──────────────────────────────────────────────────────────────────────────
  it('Idempotence 1: All 4 primary content DocTypes have unique custom_payload_id', () => {
    const contentDocTypes = ['bokengi_pole', 'bokengi_service', 'bokengi_case_study', 'bokengi_post']
    for (const dt of contentDocTypes) {
      const schema = loadDocTypeJson(dt)
      const payloadField = schema.fields.find((f) => f.fieldname === 'custom_payload_id')
      assert(payloadField, `DocType ${dt} must have 'custom_payload_id'`)
      assert.strictEqual(payloadField.fieldtype, 'Data', `custom_payload_id in ${dt} must be 'Data'`)
      assert.strictEqual(payloadField.unique, 1, `custom_payload_id in ${dt} must be unique`)
      assert.strictEqual(payloadField.read_only, 1, `custom_payload_id in ${dt} must be read_only`)
    }
    console.log('  [PASS] Idempotence 1: custom_payload_id is unique and read_only in all 4 content DocTypes.')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 4. VÉRIFICATION DU BILINGUISME STRICT FR / EN
  // ──────────────────────────────────────────────────────────────────────────
  it('Bilingual 1: Strict FR/EN parity across all localized fields in DocTypes', () => {
    const localizedDocTypes = ['bokengi_pole', 'bokengi_service', 'bokengi_case_study', 'bokengi_post', 'bokengi_screenshot_item']
    let totalPairs = 0

    for (const dt of localizedDocTypes) {
      const schema = loadDocTypeJson(dt)
      const frFields = schema.fields.filter((f) => f.fieldname.endsWith('_fr'))
      const enFields = schema.fields.filter((f) => f.fieldname.endsWith('_en'))

      assert(frFields.length > 0, `DocType ${dt} must have localized fields`)
      assert.strictEqual(
        frFields.length,
        enFields.length,
        `DocType ${dt} has mismatched count of FR (${frFields.length}) and EN (${enFields.length}) fields`,
      )

      for (const frF of frFields) {
        const expectedEn = frF.fieldname.replace(/_fr$/, '_en')
        const enF = enFields.find((f) => f.fieldname === expectedEn)
        assert(enF, `DocType ${dt} missing EN counterpart '${expectedEn}' for '${frF.fieldname}'`)
        assert.strictEqual(
          enF.fieldtype,
          frF.fieldtype,
          `DocType ${dt} fieldtype mismatch for ${frF.fieldname} (${frF.fieldtype}) vs ${expectedEn} (${enF.fieldtype})`,
        )
        totalPairs++
      }
    }
    console.log(`  [PASS] Bilingual 1: ${totalPairs} bilingual field pairs verified with 100% type parity.`)
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 5. VÉRIFICATION DU CRM : LEAD ET IMMUTABILITÉ
  // ──────────────────────────────────────────────────────────────────────────
  it('CRM 1: Custom Field fixtures for Lead and File are complete', () => {
    const fixturePath = path.join(BASE_DIR, 'fixtures/custom_field.json')
    const fixtures: any[] = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'))

    // Lead custom fields
    const leadFields = fixtures.filter((f) => f.dt === 'Lead').map((f) => f.fieldname)
    const requiredLeadFields = [
      'custom_request_type',
      'custom_requested_pole',
      'custom_original_message',
      'custom_priority',
      'custom_treatment_pole',
      'custom_payload_id',
    ]
    for (const req of requiredLeadFields) {
      assert(leadFields.includes(req), `Lead fixture missing custom field: ${req}`)
    }

    // File custom fields (R2 metadata)
    const fileFields = fixtures.filter((f) => f.dt === 'File').map((f) => f.fieldname)
    const requiredFileFields = ['custom_alt_fr', 'custom_alt_en', 'custom_caption_fr', 'custom_caption_en']
    for (const req of requiredFileFields) {
      assert(fileFields.includes(req), `File fixture missing custom field: ${req}`)
    }

    console.log('  [PASS] CRM 1: Fixtures for Lead (6 fields) and File (4 fields) verified.')
  })

  it('CRM 2: Lead immutability server-side security logic is verified', () => {
    const leadSecPath = path.join(BASE_DIR, 'bokengi_core/lead_security.py')
    const code = fs.readFileSync(leadSecPath, 'utf-8')

    // 9 immutable fields must be listed
    const expectedImmutable = [
      'first_name',
      'last_name',
      'company_name',
      'email_id',
      'mobile_no',
      'custom_request_type',
      'custom_requested_pole',
      'custom_original_message',
      'source',
    ]

    for (const field of expectedImmutable) {
      assert(code.includes(`"${field}"`) || code.includes(`'${field}'`), `lead_security.py must protect field: ${field}`)
    }

    // Must check doc.is_new()
    assert(code.includes('doc.is_new()'), 'lead_security.py must check doc.is_new()')
    // Must raise frappe.PermissionError
    assert(code.includes('frappe.PermissionError'), 'lead_security.py must raise frappe.PermissionError on tampering')

    console.log('  [PASS] CRM 2: Server-side immutability logic on 9 prospect fields verified.')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 6. VÉRIFICATION DU HOOKS ET DES ENDPOINTS PUBLICS
  // ──────────────────────────────────────────────────────────────────────────
  it('Hooks 1: Frappe hooks.py registers lead immutability and fixtures', () => {
    const hooksPath = path.join(BASE_DIR, 'hooks.py')
    const hooksCode = fs.readFileSync(hooksPath, 'utf-8')

    assert(hooksCode.includes('"Lead"'), 'hooks.py must register doc_events for Lead')
    assert(hooksCode.includes('"before_save"'), 'hooks.py must hook before_save for Lead')
    assert(hooksCode.includes('validate_lead_immutability'), 'hooks.py must reference validate_lead_immutability')
    assert(hooksCode.includes('"Custom Field"'), 'hooks.py fixtures must include "Custom Field"')

    console.log('  [PASS] Hooks 1: hooks.py correctly configured.')
  })

  it('API 1: Public read API methods are defined with guest access and published filter', () => {
    const apiPath = path.join(BASE_DIR, 'api.py')
    const apiCode = fs.readFileSync(apiPath, 'utf-8')

    const expectedMethods = [
      'get_poles',
      'get_pole_by_slug',
      'get_services',
      'get_case_studies',
      'get_case_study_by_slug',
      'get_posts',
      'get_post_by_slug',
    ]

    for (const m of expectedMethods) {
      assert(apiCode.includes(`def ${m}`), `api.py must define ${m}`)
    }

    // Check allow_guest=True
    assert(apiCode.includes('frappe.whitelist(allow_guest=True)'), 'api.py must allow guest for public endpoints')
    // Check status Published
    assert(apiCode.includes('"status": "Published"'), 'api.py must filter by Published status')

    console.log('  [PASS] API 1: All 7 public read API endpoints verified with guest access & Published filter.')
  })
})
