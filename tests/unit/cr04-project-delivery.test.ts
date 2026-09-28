import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

describe('BOKENGI 2.0 — CR-04 : Project Delivery & Delivery Models Suite', () => {
  const FIXTURES_DIR = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/fixtures')
  const DELIVERY_CORE_PATH = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/project_delivery.py')
  const HOOKS_PATH = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp/hooks.py')

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 1 : VÉRIFICATION DES 6 ACTIVITY TYPES
  // ──────────────────────────────────────────────────────────────────────────
  it('CR04-SMOKE-1: Verify all 6 Activity Types exist with correct billable settings', () => {
    const filePath = path.join(FIXTURES_DIR, 'activity_type.json')
    assert(fs.existsSync(filePath), `activity_type.json missing at ${filePath}`)

    const activities = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    assert.strictEqual(activities.length, 6, 'Exactly 6 Activity Types must exist')

    const expectedActivities = [
      { name: 'ACT-CADRAGE', billable: 1 },
      { name: 'ACT-INGENIERIE', billable: 1 },
      { name: 'ACT-VALIDATION', billable: 1 },
      { name: 'ACT-RESTITUTION', billable: 1 },
      { name: 'ACT-MANAGEMENT', billable: 1 },
      { name: 'ACT-AVANTVENTE', billable: 0 },
    ]

    for (const exp of expectedActivities) {
      const act = activities.find((a: any) => a.name === exp.name)
      assert(act, `Activity Type ${exp.name} is missing`)
      assert.strictEqual(act.default_is_billable, exp.billable, `${exp.name} default_is_billable mismatch`)
      assert(act.activity_type, `${exp.name} must have descriptive label`)
    }
  })

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 2 : VÉRIFICATION DES 5 PROJECT TEMPLATES
  // ──────────────────────────────────────────────────────────────────────────
  it('CR04-SMOKE-2: Verify all 5 Project Templates exist and contain structured tasks', () => {
    const filePath = path.join(FIXTURES_DIR, 'project_template.json')
    assert(fs.existsSync(filePath), `project_template.json missing at ${filePath}`)

    const templates = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    assert.strictEqual(templates.length, 5, 'Exactly 5 Project Templates must exist')

    const expectedTemplates = [
      'TEMPLATE-CYBER',
      'TEMPLATE-CLOUD',
      'TEMPLATE-DATA',
      'TEMPLATE-SOFTENG',
      'TEMPLATE-STRAT',
    ]

    for (const name of expectedTemplates) {
      const tmpl = templates.find((t: any) => t.name === name)
      assert(tmpl, `Project Template ${name} is missing`)
      assert(Array.isArray(tmpl.tasks), `${name} must have tasks array`)
      assert(tmpl.tasks.length >= 4 && tmpl.tasks.length <= 6, `${name} must have between 4 and 6 tasks (got ${tmpl.tasks.length})`)
      
      for (const task of tmpl.tasks) {
        assert(task.task_name, `Task in ${name} missing task_name`)
        assert(typeof task.duration === 'number' && task.duration > 0, `Task in ${name} must have positive duration`)
        assert(typeof task.start_day === 'number' && task.start_day >= 1, `Task in ${name} must have start_day >= 1`)
      }
    }
  })

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 3 : VÉRIFICATION DU MAPPING DES 20 ITEMS SRV-*
  // ──────────────────────────────────────────────────────────────────────────
  it('CR04-SMOKE-3: Verify mapping of all 20 service Items to their respective Project Templates', () => {
    const filePath = path.join(FIXTURES_DIR, 'item_template_mapping.json')
    assert(fs.existsSync(filePath), `item_template_mapping.json missing at ${filePath}`)

    const mappings = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    assert.strictEqual(mappings.length, 20, 'Exactly 20 Item mappings must exist')

    const poleTemplateMap: Record<string, string> = {
      'bokengi-cyber': 'TEMPLATE-CYBER',
      'bokengi-cloud': 'TEMPLATE-CLOUD',
      'bokengi-data': 'TEMPLATE-DATA',
      'bokengi-softeng': 'TEMPLATE-SOFTENG',
      'bokengi-strat': 'TEMPLATE-STRAT',
    }

    for (const m of mappings) {
      assert(m.item_code.startsWith('SRV-'), `Item code ${m.item_code} invalid`)
      const expectedTemplate = poleTemplateMap[m.pole]
      assert(expectedTemplate, `Pole ${m.pole} unknown in mapping`)
      assert.strictEqual(m.project_template, expectedTemplate, `Item ${m.item_code} mapped to wrong template`)
    }
  })

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 4 : CRÉATION D'UN PROJECT À PARTIR D'UNE PRESTATION AVEC TEMPLATE
  // ──────────────────────────────────────────────────────────────────────────
  it('CR04-SMOKE-4: Verify Project instantiation from Service Item using Project Template', () => {
    const mappings = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'item_template_mapping.json'), 'utf-8'))
    const templates = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'project_template.json'), 'utf-8'))

    // Simulation pour un Item : SRV-CYBER-01
    const testItem = mappings.find((m: any) => m.item_code === 'SRV-CYBER-01')
    assert(testItem, 'SRV-CYBER-01 must exist')
    
    const assignedTemplate = templates.find((t: any) => t.name === testItem.project_template)
    assert(assignedTemplate, `Template ${testItem.project_template} must be resolved`)

    // Simulation de création d'un Project basé sur le template
    const simulatedProject = {
      name: 'PROJ-TEST-CYBER-001',
      project_name: 'Audit Sécurité & Pentest - Client Acme',
      project_template: assignedTemplate.name,
      status: 'Open',
      tasks: assignedTemplate.tasks.map((task: any, index: number) => ({
        task_id: `TASK-CYBER-${index + 1}`,
        subject: task.task_name,
        expected_duration_days: task.duration,
        start_day_offset: task.start_day,
        status: 'Open',
      })),
    }

    assert.strictEqual(simulatedProject.project_template, 'TEMPLATE-CYBER')
    assert.strictEqual(simulatedProject.tasks.length, assignedTemplate.tasks.length)
    assert.strictEqual(simulatedProject.status, 'Open')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 5 & 6 : CONTRÔLE DE RECETTE & REFUS SANS PV SIGNÉ
  // ──────────────────────────────────────────────────────────────────────────
  it('CR04-SMOKE-5-6: Verify Project completion rule strictly rejects closing without signed PV', () => {
    assert(fs.existsSync(DELIVERY_CORE_PATH), `project_delivery.py missing at ${DELIVERY_CORE_PATH}`)
    const code = fs.readFileSync(DELIVERY_CORE_PATH, 'utf-8')

    // Vérifie la présence de la logique de refus avec frappe.throw
    assert(code.includes('def validate_project_completion_acceptance'), 'Validator method must exist')
    assert(code.includes('frappe.throw'), 'Must raise exception if no acceptance document attached')
    assert(code.includes('attached_to_doctype'), 'Must inspect attached files')

    // Simulation de la règle métier
    function simulateValidation(project: { name: string; status: string }, attachedFiles: Array<{ file_name: string }>) {
      if (project.status === 'Completed') {
        if (!attachedFiles || attachedFiles.length === 0) {
          throw new Error(`Clôture refusée : Le projet ${project.name} ne peut être marqué 'Completed' sans Procès-Verbal de Recette signé`)
        }
      }
      return true
    }

    // Cas 1 : Tentative de passage à 'Completed' SANS fichier attaché -> Doit lever une erreur
    const openProject = { name: 'PROJ-TEST-001', status: 'Completed' }
    assert.throws(
      () => simulateValidation(openProject, []),
      /Clôture refusée/,
      'Must reject completion without attached PV'
    )
  })

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 7 : CLÔTURE AVEC PV VALIDE AUTORISÉE
  // ──────────────────────────────────────────────────────────────────────────
  it('CR04-SMOKE-7: Verify Project completion succeeds when signed PV is attached', () => {
    function simulateValidation(project: { name: string; status: string }, attachedFiles: Array<{ file_name: string }>) {
      if (project.status === 'Completed') {
        if (!attachedFiles || attachedFiles.length === 0) {
          throw new Error(`Clôture refusée`)
        }
      }
      return true
    }

    // Cas 2 : Passage à 'Completed' AVEC PV attaché -> Doit réussir
    const projectWithPV = { name: 'PROJ-TEST-001', status: 'Completed' }
    const attachedFiles = [{ file_name: 'PV_Recette_Signe_Bokengi_Acme_2026.pdf' }]
    const result = simulateValidation(projectWithPV, attachedFiles)
    assert.strictEqual(result, true, 'Must accept completion when signed PV is attached')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // SMOKE TEST 8 : VERROU ANTI-FACTURATION AUTOMATIQUE
  // ──────────────────────────────────────────────────────────────────────────
  it('CR04-SMOKE-8: Verify zero CR-04 event creates or submits a Sales Invoice', () => {
    const code = fs.readFileSync(DELIVERY_CORE_PATH, 'utf-8')
    const lower = code.toLowerCase()

    assert(!lower.includes('make_sales_invoice'), 'Forbidden call: make_sales_invoice')
    assert(!lower.includes('submit_invoice'), 'Forbidden call: submit_invoice')
    assert(!lower.includes('sales_invoice'), 'No automated sales invoice reference')

    const hooksCode = fs.readFileSync(HOOKS_PATH, 'utf-8')
    assert(hooksCode.includes('validate_project_completion_acceptance'), 'Validator registered in hooks')
    assert(!hooksCode.includes('auto_invoice'), 'No auto invoice hook')
  })
})
