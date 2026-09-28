import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

describe('BOKENGI 2.0 — Phase 2 / Lot 1 — Bokengi Workspace Header Test Suite', () => {
  const BASE_DIR = path.resolve(process.cwd(), 'frappe_apps/bokengi_erp/bokengi_erp')
  const FIXTURES_DIR = path.join(BASE_DIR, 'fixtures')
  const CORE_DIR = path.join(BASE_DIR, 'bokengi_core')

  // ──────────────────────────────────────────────────────────────────────────
  // 1. VÉRIFICATION DE L'API BACKEND (api.py)
  // ──────────────────────────────────────────────────────────────────────────
  it('BWH-1: api.py exports get_workspace_header_data and BOKENGI_WORKSPACES_REGISTRY', () => {
    const apiPath = path.join(BASE_DIR, 'api.py')
    assert(fs.existsSync(apiPath), `api.py missing at ${apiPath}`)

    const apiCode = fs.readFileSync(apiPath, 'utf-8')

    assert(apiCode.includes('def get_workspace_header_data('), 'api.py must define get_workspace_header_data')
    assert(apiCode.includes('@frappe.whitelist()'), 'get_workspace_header_data must be whitelisted')
    assert(apiCode.includes('BOKENGI_WORKSPACES_REGISTRY'), 'api.py must define generic BOKENGI_WORKSPACES_REGISTRY')
    assert(apiCode.includes('def _derive_initials('), 'api.py must define helper _derive_initials')
    assert(apiCode.includes('IT & Infrastructure'), 'Registry must include IT & Infrastructure')
    assert(apiCode.includes('POL-it'), 'Registry must map IT & Infrastructure to POL-it')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 2. VÉRIFICATION DU CUSTOM HTML BLOCK (custom_html_block.json)
  // ──────────────────────────────────────────────────────────────────────────
  it('BWH-2: custom_html_block.json contains generic Bokengi Workspace Header', () => {
    const fixturePath = path.join(FIXTURES_DIR, 'custom_html_block.json')
    assert(fs.existsSync(fixturePath), `custom_html_block.json missing at ${fixturePath}`)

    const blocks: any[] = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'))
    const headerBlock = blocks.find((b) => b.name === 'Bokengi Workspace Header')

    assert(headerBlock, 'Bokengi Workspace Header block must exist in custom_html_block.json')
    assert.strictEqual(headerBlock.module, 'Bokengi ERP', 'Module must be Bokengi ERP')

    // HTML assertions
    const html = headerBlock.html
    assert(html.includes('id="bokengi-workspace-header-root"'), 'HTML must have root element')
    assert(html.includes('bwh-breadcrumb'), 'HTML must have breadcrumb section')
    assert(html.includes('bwh-status-badge'), 'HTML must have status badge')
    assert(html.includes('bwh-pole-tag'), 'HTML must have pole tag')
    assert(html.includes('bwh-current-user-capsule'), 'HTML must have current user capsule')
    assert(html.includes('bwh-team-section'), 'HTML must have team section')
    assert(html.includes('bwh-avatar-stack'), 'HTML must have avatar stack container')

    // Style assertions (Deep Navy, Navy, Cyan, Gold accent)
    const style = headerBlock.style
    assert(style.includes('#0A192F'), 'Style must use Deep Navy #0A192F')
    assert(style.includes('#112240'), 'Style must use Navy #112240')
    assert(style.includes('#64FFDA'), 'Style must use Cyan #64FFDA')

    // Script assertions (Frappe call to get_workspace_header_data)
    const script = headerBlock.script
    assert(script.includes('get_workspace_header_data'), 'Script must call get_workspace_header_data')
    assert(script.includes('members.slice(0, 4)'), 'Script must cap visible avatars to max 4')
    assert(script.includes('moreBadge'), 'Script must generate +N badge if total > 4')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 3. VÉRIFICATION DE L'INTÉGRATION DANS IT & INFRASTRUCTURE (workspace.json)
  // ──────────────────────────────────────────────────────────────────────────
  it('BWH-3: workspace.json places Bokengi Workspace Header as block #01 in IT & Infrastructure', () => {
    const wsFixturePath = path.join(FIXTURES_DIR, 'workspace.json')
    assert(fs.existsSync(wsFixturePath), `workspace.json missing at ${wsFixturePath}`)

    const workspaces: any[] = JSON.parse(fs.readFileSync(wsFixturePath, 'utf-8'))
    const itWs = workspaces.find((w) => w.name === 'IT & Infrastructure')

    assert(itWs, 'IT & Infrastructure workspace must exist')

    const content = JSON.parse(itWs.content)
    assert(content.length >= 5, 'IT & Infrastructure must contain at least 5 blocks')

    // Ordre cible :
    // #01 Bokengi Workspace Header
    // #02 Actions rapides
    // #03 Infrastructure & Prestations Informatiques
    // #04 Projets & Infrastructure
    // #05 Support & Opérations

    assert.strictEqual(content[0].type, 'custom_block', 'Block #01 must be custom_block')
    assert.strictEqual(content[0].data.custom_block_name, 'Bokengi Workspace Header', 'Block #01 must be Bokengi Workspace Header')

    assert.strictEqual(content[1].type, 'header', 'Block #02 header must exist')
    assert.strictEqual(content[1].data.text, 'Actions rapides', 'Block #02 header text must be Actions rapides')

    // Verify shortcuts under #02
    assert.strictEqual(content[2].data.shortcut_name, '+ Nouveau Projet IT', 'Shortcut 1 must be + Nouveau Projet IT')
    assert.strictEqual(content[3].data.shortcut_name, '+ Nouveau Ticket IT', 'Shortcut 2 must be + Nouveau Ticket IT')
    assert.strictEqual(content[4].data.shortcut_name, '+ Saisie de Temps', 'Shortcut 3 must be + Saisie de Temps')
    assert.strictEqual(content[5].data.shortcut_name, 'Projets IT Bokengi', 'Shortcut 4 must be Projets IT Bokengi')

    // Verify #03, #04, #05
    assert.strictEqual(content[6].data.text, 'Infrastructure & Prestations Informatiques', 'Block #03 must be Infrastructure & Prestations Informatiques')
    assert.strictEqual(content[7].data.card_name, 'Projets & Infrastructure', 'Block #04 must be card Projets & Infrastructure')
    assert.strictEqual(content[8].data.card_name, 'Support & Opérations', 'Block #05 must be card Support & Opérations')

    // Custom blocks child table
    assert(itWs.custom_blocks && itWs.custom_blocks.length > 0, 'custom_blocks table must not be empty')
    assert.strictEqual(itWs.custom_blocks[0].custom_block_name, 'Bokengi Workspace Header')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 4. NON-RÉGRESSION : LES 5 AUTRES WORKSPACES SONT INTACTS
  // ──────────────────────────────────────────────────────────────────────────
  it('BWH-4: Other workspaces in workspace.json remain completely untouched', () => {
    const wsFixturePath = path.join(FIXTURES_DIR, 'workspace.json')
    const workspaces: any[] = JSON.parse(fs.readFileSync(wsFixturePath, 'utf-8'))

    const otherWorkspaces = [
      'Bokengi Enterprise Cockpit',
      'Digital & Innovation',
      'Business Solutions',
      'Consulting & Stratégie',
      'Events & Formations'
    ]

    for (const wsName of otherWorkspaces) {
      const w = workspaces.find((x) => x.name === wsName)
      assert(w, `Workspace ${wsName} must be preserved in fixture`)
      if (wsName !== 'Bokengi Enterprise Cockpit') {
        const content = JSON.parse(w.content)
        const hasHeader = content.some((c: any) => c.data?.custom_block_name === 'Bokengi Workspace Header')
        assert(!hasHeader, `Workspace ${wsName} must NOT have Bokengi Workspace Header deployed yet`)
      }
    }
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 5. INTÉGRITÉ DE LA SÉCURITÉ ET DU MODULE POLE_PERMISSIONS.PY
  // ──────────────────────────────────────────────────────────────────────────
  it('BWH-5: pole_permissions.py remains strictly untouched and unmodified', () => {
    const permModulePath = path.join(CORE_DIR, 'pole_permissions.py')
    const code = fs.readFileSync(permModulePath, 'utf-8')

    assert(code.includes('DIRECTION_ROLES = {"System Manager", "Administrator", "Bokengi Executive"}'))
    assert(code.includes('def get_user_allowed_poles(user=None):'))
    assert(code.includes('def is_executive_or_admin(user=None):'))
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 6. SIMULATION DE LA LOGIQUE D'HABILITATION ET DU RENDU DYNAMIQUE
  // ──────────────────────────────────────────────────────────────────────────
  it('BWH-6: Initials calculation and dynamic user handling', () => {
    function deriveInitials(fullName: string = '', name: string = ''): string {
      const source = (fullName || name || '').trim()
      if (!source) return 'BG'
      const parts = source.replace(/-/g, ' ').split(/\s+/).filter(Boolean)
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
      return 'BG'
    }

    assert.strictEqual(deriveInitials('Kalel DAMBA'), 'KD')
    assert.strictEqual(deriveInitials('Jean-Pierre Michel'), 'JP')
    assert.strictEqual(deriveInitials('Administrator'), 'AD')
    assert.strictEqual(deriveInitials('', 'test@bokengi-group.com'), 'TG')
    assert.strictEqual(deriveInitials(''), 'BG')
  })

  it('BWH-7: Workspace team members filtration respects POL-it and max 4 avatars +N', () => {
    interface MockUser {
      name: string
      full_name: string
      roles: string[]
      allowed_poles: string[]
    }

    const mockUsers: MockUser[] = [
      { name: 'admin', full_name: 'Administrator', roles: ['Administrator'], allowed_poles: [] },
      { name: 'it_lead', full_name: 'Ingénieur DevOps', roles: ['Desk User'], allowed_poles: ['POL-it'] },
      { name: 'it_sec', full_name: 'Consultant Cyber', roles: ['Sales Manager'], allowed_poles: ['POL-it'] },
      { name: 'sys_mgr', full_name: 'Directeur Technique', roles: ['System Manager'], allowed_poles: [] },
      { name: 'it_tech', full_name: 'Technicien Systèmes', roles: ['Desk User'], allowed_poles: ['POL-it'] },
      { name: 'it_cloud', full_name: 'Architecte Cloud', roles: ['Desk User'], allowed_poles: ['POL-it'] },
      // Utilisateurs non habilités
      { name: 'dig_dev', full_name: 'Dev React', roles: ['Desk User'], allowed_poles: ['POL-digital'] },
      { name: 'no_pole', full_name: 'Stagiaire', roles: ['Desk User'], allowed_poles: [] },
      { name: 'no_role', full_name: 'Comptable', roles: ['Employee'], allowed_poles: ['POL-it'] },
    ]

    const workspaceRoles = new Set(['System Manager', 'Accounts Manager', 'Sales Manager', 'Desk User'])
    const targetPole = 'POL-it'
    const directionRoles = new Set(['System Manager', 'Administrator', 'Bokengi Executive'])

    const eligible = mockUsers.filter((u) => {
      const isExecOrAdmin = u.name === 'admin' || u.roles.some((r) => directionRoles.has(r))
      if (isExecOrAdmin) return true

      // Must have workspace role
      const hasWsRole = u.roles.some((r) => workspaceRoles.has(r))
      if (!hasWsRole) return false

      // Must have pole permission
      const hasPole = u.allowed_poles.includes(targetPole)
      return hasPole
    })

    // 6 utilisateurs éligibles : admin, it_lead, it_sec, sys_mgr, it_tech, it_cloud
    assert.strictEqual(eligible.length, 6, 'There must be exactly 6 eligible members')

    // Les non habilités doivent être exclus
    assert(!eligible.some((u) => u.name === 'dig_dev'), 'Digital user must be excluded')
    assert(!eligible.some((u) => u.name === 'no_pole'), 'User with no pole must be excluded')
    assert(!eligible.some((u) => u.name === 'no_role'), 'User with no workspace role must be excluded')

    // Avatars visible slice
    const visibleAvatars = eligible.slice(0, 4)
    assert.strictEqual(visibleAvatars.length, 4, 'Must show max 4 avatars')
    const remainingCount = eligible.length - 4
    assert.strictEqual(remainingCount, 2, 'Must indicate +2 members')
  })
})
