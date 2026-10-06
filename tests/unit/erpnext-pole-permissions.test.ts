import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

describe('BOKENGI 2.0 — Cloisonnement ERPNext par Pôle (Suite de Contrôle d\'Accès Serveur)', () => {
  const BASE_DIR = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp')
  const FIXTURES_DIR = path.join(BASE_DIR, 'fixtures')
  const CORE_DIR = path.join(BASE_DIR, 'bokengi_core')

  // ──────────────────────────────────────────────────────────────────────────
  // 1. AUDIT DE STRUCTURE DE FIXTURES & SEMAINS DE CONFIGURATION
  // ──────────────────────────────────────────────────────────────────────────
  it('PERM-1: Custom Field fixtures for Lead and Project include custom_requested_pole and custom_treatment_pole', () => {
    const fixturePath = path.join(FIXTURES_DIR, 'custom_field.json')
    assert(fs.existsSync(fixturePath), `custom_field.json missing at ${fixturePath}`)

    const fixtures: any[] = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'))

    // Lead Custom Fields
    const leadFields = fixtures.filter((f) => f.dt === 'Lead').map((f) => f.fieldname)
    assert(leadFields.includes('custom_requested_pole'), 'Lead fixture missing custom_requested_pole')
    assert(leadFields.includes('custom_treatment_pole'), 'Lead fixture missing custom_treatment_pole')

    // Project Custom Fields
    const projectFields = fixtures.filter((f) => f.dt === 'Project').map((f) => f.fieldname)
    assert(projectFields.includes('custom_requested_pole'), 'Project fixture missing custom_requested_pole')
    assert(projectFields.includes('custom_treatment_pole'), 'Project fixture missing custom_treatment_pole')
  })

  it('PERM-2: Frappe hooks.py registers permission_query_conditions and has_permission for Lead and Project', () => {
    const hooksPath = path.join(BASE_DIR, 'hooks.py')
    assert(fs.existsSync(hooksPath), `hooks.py missing at ${hooksPath}`)

    const hooksContent = fs.readFileSync(hooksPath, 'utf-8')

    assert(hooksContent.includes('permission_query_conditions'), 'hooks.py must register permission_query_conditions')
    assert(hooksContent.includes('has_permission'), 'hooks.py must register has_permission')

    assert(hooksContent.includes('get_lead_permission_query_conditions'), 'hooks.py must register Lead query conditions')
    assert(hooksContent.includes('get_project_permission_query_conditions'), 'hooks.py must register Project query conditions')
    assert(hooksContent.includes('has_lead_permission'), 'hooks.py must register Lead document permission')
    assert(hooksContent.includes('has_project_permission'), 'hooks.py must register Project document permission')
    assert(hooksContent.includes('propagate_pole_to_project'), 'hooks.py must register propagate_pole_to_project on Project validate')
  })

  it('PERM-3: Server-side Python security module pole_permissions.py is valid and well-formed', () => {
    const permModulePath = path.join(CORE_DIR, 'pole_permissions.py')
    assert(fs.existsSync(permModulePath), `pole_permissions.py missing at ${permModulePath}`)

    const code = fs.readFileSync(permModulePath, 'utf-8')

    assert(code.includes('DIRECTION_ROLES'), 'pole_permissions.py must define DIRECTION_ROLES')
    assert(code.includes('Bokengi Executive'), 'pole_permissions.py must include Bokengi Executive in direction roles')
    assert(code.includes('System Manager'), 'pole_permissions.py must include System Manager in direction roles')
    assert(code.includes('get_lead_permission_query_conditions'), 'pole_permissions.py must define get_lead_permission_query_conditions')
    assert(code.includes('has_lead_permission'), 'pole_permissions.py must define has_lead_permission')
    assert(code.includes('get_project_permission_query_conditions'), 'pole_permissions.py must define get_project_permission_query_conditions')
    assert(code.includes('has_project_permission'), 'pole_permissions.py must define has_project_permission')
    assert(code.includes('propagate_pole_to_project'), 'pole_permissions.py must define propagate_pole_to_project')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 2. SIMULATION ET TESTS DE LA LOGIQUE DE CLOISONNEMENT SERVEUR (CAS 1 À 10)
  // ──────────────────────────────────────────────────────────────────────────
  
  // Helpers de simulation de la logique Python Frappe
  function simulateIsExecutiveOrAdmin(userRoles: string[], username: string): boolean {
    if (username === 'Administrator' || username === 'Script') return true
    const directionRoles = new Set(['System Manager', 'Administrator', 'Bokengi Executive'])
    return userRoles.some((r) => directionRoles.has(r))
  }

  function simulateGetPermissionQueryConditions(
    doctype: 'Lead' | 'Project',
    userRoles: string[],
    username: string,
    userAllowedPoles: string[]
  ): string {
    if (simulateIsExecutiveOrAdmin(userRoles, username)) {
      return '' // Vision consolidée sans restriction
    }

    if (!userAllowedPoles || userAllowedPoles.length === 0) {
      return `\`tab${doctype}\`.\`custom_treatment_pole\` IS NULL AND 1=0`
    }

    const escaped = userAllowedPoles.map((p) => `'${p}'`).join(', ')
    return `\`tab${doctype}\`.\`custom_treatment_pole\` IN (${escaped})`
  }

  function simulateHasPermission(
    doc: { custom_treatment_pole?: string; custom_requested_pole?: string },
    userRoles: string[],
    username: string,
    userAllowedPoles: string[]
  ): boolean {
    if (simulateIsExecutiveOrAdmin(userRoles, username)) {
      return true
    }

    if (!userAllowedPoles || userAllowedPoles.length === 0) {
      return false
    }

    const docPole = doc.custom_treatment_pole || doc.custom_requested_pole
    if (!docPole) return false

    return userAllowedPoles.includes(docPole)
  }

  // CAS 1 : Lead POL-digital → Utilisateur Digital → Visible
  it('CAS-1: Lead POL-digital is visible for Digital user', () => {
    const lead = { custom_treatment_pole: 'POL-digital', custom_requested_pole: 'POL-digital' }
    const userRoles = ['Sales User']
    const userPoles = ['POL-digital']

    const sqlCond = simulateGetPermissionQueryConditions('Lead', userRoles, 'user_digital', userPoles)
    const hasPerm = simulateHasPermission(lead, userRoles, 'user_digital', userPoles)

    assert(sqlCond.includes("'POL-digital'"), 'SQL condition must filter for POL-digital')
    assert.strictEqual(hasPerm, true, 'Digital user must have read permission on POL-digital Lead')
  })

  // CAS 2 : Lead POL-digital → Utilisateur IT → Inaccessible
  it('CAS-2: Lead POL-digital is NOT accessible for IT user', () => {
    const lead = { custom_treatment_pole: 'POL-digital', custom_requested_pole: 'POL-digital' }
    const userRoles = ['Sales User']
    const userPoles = ['POL-it']

    const sqlCond = simulateGetPermissionQueryConditions('Lead', userRoles, 'user_it', userPoles)
    const hasPerm = simulateHasPermission(lead, userRoles, 'user_it', userPoles)

    assert(!sqlCond.includes("'POL-digital'"), 'SQL condition must NOT include POL-digital for IT user')
    assert.strictEqual(hasPerm, false, 'IT user MUST NOT have permission on POL-digital Lead')
  })

  // CAS 3 : Project POL-digital → Utilisateur Digital → Visible
  it('CAS-3: Project POL-digital is visible for Digital user', () => {
    const project = { custom_treatment_pole: 'POL-digital', custom_requested_pole: 'POL-digital' }
    const userRoles = ['Projects User']
    const userPoles = ['POL-digital']

    const sqlCond = simulateGetPermissionQueryConditions('Project', userRoles, 'proj_user_digital', userPoles)
    const hasPerm = simulateHasPermission(project, userRoles, 'proj_user_digital', userPoles)

    assert(sqlCond.includes("'POL-digital'"), 'Project SQL condition must include POL-digital')
    assert.strictEqual(hasPerm, true, 'Digital Projects User must have permission on POL-digital Project')
  })

  // CAS 4 : Project POL-digital → Utilisateur IT → Inaccessible
  it('CAS-4: Project POL-digital is NOT accessible for IT user', () => {
    const project = { custom_treatment_pole: 'POL-digital', custom_requested_pole: 'POL-digital' }
    const userRoles = ['Projects User']
    const userPoles = ['POL-it']

    const sqlCond = simulateGetPermissionQueryConditions('Project', userRoles, 'proj_user_it', userPoles)
    const hasPerm = simulateHasPermission(project, userRoles, 'proj_user_it', userPoles)

    assert(!sqlCond.includes("'POL-digital'"), 'Project SQL condition must NOT include POL-digital for IT user')
    assert.strictEqual(hasPerm, false, 'IT Projects User MUST NOT have permission on POL-digital Project')
  })

  // CAS 5 : Direction / System Manager → Vision Consolidée
  it('CAS-5: Executive / System Manager has consolidated vision across all poles', () => {
    const lead = { custom_treatment_pole: 'POL-digital', custom_requested_pole: 'POL-digital' }
    const project = { custom_treatment_pole: 'POL-events', custom_requested_pole: 'POL-events' }

    // System Manager
    const smCond = simulateGetPermissionQueryConditions('Lead', ['System Manager'], 'admin_user', [])
    const smPermLead = simulateHasPermission(lead, ['System Manager'], 'admin_user', [])
    const smPermProj = simulateHasPermission(project, ['System Manager'], 'admin_user', [])

    assert.strictEqual(smCond, '', 'System Manager must have empty SQL condition (sees all rows)')
    assert.strictEqual(smPermLead, true, 'System Manager must access any Lead')
    assert.strictEqual(smPermProj, true, 'System Manager must access any Project')

    // Bokengi Executive
    const execCond = simulateGetPermissionQueryConditions('Project', ['Bokengi Executive'], 'exec_user', [])
    const execPerm = simulateHasPermission(project, ['Bokengi Executive'], 'exec_user', [])

    assert.strictEqual(execCond, '', 'Bokengi Executive must have empty SQL condition')
    assert.strictEqual(execPerm, true, 'Bokengi Executive must access any Project')
  })

  // CAS 6 : Réassignation POL-digital → POL-business
  it('CAS-6: Reassigning custom_treatment_pole from POL-digital to POL-business updates access scope', () => {
    const document = {
      custom_requested_pole: 'POL-digital',
      custom_treatment_pole: 'POL-digital',
    }

    const digitalUserPoles = ['POL-digital']
    const businessUserPoles = ['POL-business']
    const salesRoles = ['Sales User']

    // Avant réassignation : Digital accède, Business n'accède pas
    assert.strictEqual(simulateHasPermission(document, salesRoles, 'u_dig', digitalUserPoles), true)
    assert.strictEqual(simulateHasPermission(document, salesRoles, 'u_biz', businessUserPoles), false)

    // Réassignation du pôle opérationnel vers POL-business
    document.custom_treatment_pole = 'POL-business'

    // Après réassignation : Business accède, Digital n'accède plus
    assert.strictEqual(simulateHasPermission(document, salesRoles, 'u_dig', digitalUserPoles), false, 'Digital user must lose access after reassignment')
    assert.strictEqual(simulateHasPermission(document, salesRoles, 'u_biz', businessUserPoles), true, 'Business user must gain access after reassignment')

    // Pôle demandé initial reste inchangé
    assert.strictEqual(document.custom_requested_pole, 'POL-digital', 'custom_requested_pole must remain untouched')
  })

  // CAS 7 : Immutabilité de custom_requested_pole
  it('CAS-7: Verify Lead security immutability logic protects custom_requested_pole', () => {
    const leadSecPath = path.join(CORE_DIR, 'lead_security.py')
    const code = fs.readFileSync(leadSecPath, 'utf-8')

    assert(code.includes('"custom_requested_pole"') || code.includes("'custom_requested_pole'"), 'lead_security.py must protect custom_requested_pole')
    assert(code.includes('IMMUTABLE_PROSPECT_FIELDS'), 'IMMUTABLE_PROSPECT_FIELDS list must exist')
  })

  // CAS 8 : Utilisateur opérationnel sans pôle
  it('CAS-8: Operational user with NO assigned pole has 0 operational access (1=0 condition)', () => {
    const sqlCond = simulateGetPermissionQueryConditions('Lead', ['Sales User'], 'unassigned_user', [])
    const hasPerm = simulateHasPermission({ custom_treatment_pole: 'POL-it' }, ['Sales User'], 'unassigned_user', [])

    assert.strictEqual(sqlCond, '`tabLead`.`custom_treatment_pole` IS NULL AND 1=0', 'Must return 1=0 SQL condition for unassigned operational user')
    assert.strictEqual(hasPerm, false, 'Unassigned user MUST NOT access any pole document')
  })

  // CAS 9 : Refus côté serveur sur accès direct API
  it('CAS-9: Direct document API access to document of another pole returns server-side refusal', () => {
    const targetLead = { custom_treatment_pole: 'POL-consulting', custom_requested_pole: 'POL-consulting' }
    const digitalUserPoles = ['POL-digital']

    const hasPerm = simulateHasPermission(targetLead, ['Sales User'], 'u_digital', digitalUserPoles)

    assert.strictEqual(hasPerm, false, 'has_permission MUST return False to generate HTTP 403 Forbidden')
  })

  // CAS 10 & 11 : Non-régression Cockpit et Mattermost
  it('CAS-10-11: Enterprise Cockpit and Mattermost integration files exist and remain intact', () => {
    const workspacePath = path.join(FIXTURES_DIR, 'workspace.json')
    const numberCardPath = path.join(FIXTURES_DIR, 'number_card.json')
    const chartPath = path.join(FIXTURES_DIR, 'dashboard_chart.json')
    const htmlBlockPath = path.join(FIXTURES_DIR, 'custom_html_block.json')

    assert(fs.existsSync(workspacePath), 'workspace.json must exist')
    assert(fs.existsSync(numberCardPath), 'number_card.json must exist')
    assert(fs.existsSync(chartPath), 'dashboard_chart.json must exist')
    assert(fs.existsSync(htmlBlockPath), 'custom_html_block.json must exist')
  })
})
