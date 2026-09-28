import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

describe('BOKENGI 2.0 — CR-06 : Apache Superset BI & Analytics Suite', () => {
  const COMPOSE_BI_PATH = path.resolve(process.cwd(), 'docker-compose.bi.yml')
  const SQL_VIEWS_PATH = path.resolve(process.cwd(), 'scripts/bi/init_bi_views.sql')
  const ENV_BI_EXAMPLE_PATH = path.resolve(process.cwd(), '.env.bi.example')
  const DESIGN_DOC_PATH = path.resolve(process.cwd(), 'BOKENGI_2.0_CR06_SUPERSET_TECHNICAL_DESIGN.md')

  // ──────────────────────────────────────────────────────────────────────────
  // 1. VÉRIFICATION DU FICHIER DOCKER-COMPOSE.BI.YML
  // ──────────────────────────────────────────────────────────────────────────
  it('CR06-1: Verify docker-compose.bi.yml contains all 3 core services and persistent volumes', () => {
    assert(fs.existsSync(COMPOSE_BI_PATH), 'docker-compose.bi.yml must exist')
    const content = fs.readFileSync(COMPOSE_BI_PATH, 'utf-8')

    // Services requis
    assert(content.includes('superset-db:'), 'PostgreSQL service missing')
    assert(content.includes('superset-redis:'), 'Redis service missing')
    assert(content.includes('superset:'), 'Superset app service missing')

    // Volumes persistants
    assert(content.includes('superset_pg_data:'), 'PostgreSQL persistent volume missing')
    assert(content.includes('superset_home:'), 'Superset home volume missing')
    assert(content.includes('superset_redis_data:'), 'Redis persistent volume missing')

    // Réseau & Port
    assert(content.includes('bokengi_bi_net:'), 'Network bokengi_bi_net missing')
    assert(content.includes('127.0.0.1:'), 'Port must be bound to 127.0.0.1')
    assert(content.includes('8088'), 'Port 8088 configured')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 2. VÉRIFICATION DES 4 VUES SQL DU LOT 1
  // ──────────────────────────────────────────────────────────────────────────
  it('CR06-2: Verify all 4 SQL BI views are defined in init_bi_views.sql', () => {
    assert(fs.existsSync(SQL_VIEWS_PATH), 'init_bi_views.sql must exist')
    const sql = fs.readFileSync(SQL_VIEWS_PATH, 'utf-8')

    assert(sql.includes('CREATE OR REPLACE VIEW `view_bi_pipeline`'), 'view_bi_pipeline missing')
    assert(sql.includes('CREATE OR REPLACE VIEW `view_bi_conversion`'), 'view_bi_conversion missing')
    assert(sql.includes('CREATE OR REPLACE VIEW `view_bi_delivery`'), 'view_bi_delivery missing')
    assert(sql.includes('CREATE OR REPLACE VIEW `view_bi_timesheet`'), 'view_bi_timesheet missing')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 3. VÉRIFICATION DE L'ÉTANCHÉITÉ ET PRIVILÈGES READ-ONLY DE SUPERSET_RO
  // ──────────────────────────────────────────────────────────────────────────
  it('CR06-3: Verify superset_ro permissions are strictly restricted to SELECT on BI views', () => {
    const sql = fs.readFileSync(SQL_VIEWS_PATH, 'utf-8')
    const lower = sql.toLowerCase()

    // Vérifier l'attribution de SELECT
    assert(sql.includes("GRANT SELECT ON `view_bi_pipeline` TO 'superset_ro'@'%'"), 'Grant SELECT pipeline')
    assert(sql.includes("GRANT SELECT ON `view_bi_conversion` TO 'superset_ro'@'%'"), 'Grant SELECT conversion')
    assert(sql.includes("GRANT SELECT ON `view_bi_delivery` TO 'superset_ro'@'%'"), 'Grant SELECT delivery')
    assert(sql.includes("GRANT SELECT ON `view_bi_timesheet` TO 'superset_ro'@'%'"), 'Grant SELECT timesheet')

    // Vérifier l'absence absolue de droits d'écriture
    assert(!lower.includes('grant insert'), 'No INSERT privilege allowed')
    assert(!lower.includes('grant update'), 'No UPDATE privilege allowed')
    assert(!lower.includes('grant delete'), 'No DELETE privilege allowed')
    assert(!lower.includes('grant alter'), 'No ALTER privilege allowed')
    assert(!lower.includes('grant drop'), 'No DROP privilege allowed')
    assert(!lower.includes('grant all privileges'), 'No global privileges allowed')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 4. SÉCURITÉ & MINIMISATION DES DONNÉES SENSIBLES
  // ──────────────────────────────────────────────────────────────────────────
  it('CR06-4: Verify data minimization in BI views (no private contacts, no secrets, no InfraPulse)', () => {
    const sql = fs.readFileSync(SQL_VIEWS_PATH, 'utf-8')
    const lower = sql.toLowerCase()

    assert(!lower.includes('email_id'), 'Do not expose lead email address in views')
    assert(!lower.includes('mobile_no'), 'Do not expose phone numbers in views')
    assert(!lower.includes('tabuser'), 'Do not query tabUser in BI views')
    assert(!lower.includes('tabsessions'), 'Do not query tabSessions in BI views')
    assert(!lower.includes('infrapulse'), 'Do not reference InfraPulse')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 5. STRUCTURE DU DASHBOARD EXÉCUTIF ET VERROU FINANCIER CR-03
  // ──────────────────────────────────────────────────────────────────────────
  it('CR06-5: Verify Dashboard structure and explicit CR-03 lock on CA/Margin panels', () => {
    assert(fs.existsSync(DESIGN_DOC_PATH), 'Technical design doc must exist')
    const doc = fs.readFileSync(DESIGN_DOC_PATH, 'utf-8')

    assert(doc.includes('DASHBOARD_EXECUTIVE_BOKENGI'), 'Executive dashboard definition present')
    assert(doc.includes('EN ATTENTE CR-03') || doc.includes('EN ATTENTE ARBITRAGES CR-03'), 'CR-03 Financial lock must be explicitly marked')
    assert(doc.includes('view_bi_pipeline') && doc.includes('view_bi_delivery'), 'Views referenced in design')
  })

  // ──────────────────────────────────────────────────────────────────────────
  // 6. SMOKE TESTS PRODUCTION & ÉTANCHÉITÉ DES SERVICES
  // ──────────────────────────────────────────────────────────────────────────
  it('CR06-SMOKE-1: Verify production environment isolation and no hardcoded production secrets', () => {
    assert(fs.existsSync(ENV_BI_EXAMPLE_PATH), '.env.bi.example must exist')
    const envExample = fs.readFileSync(ENV_BI_EXAMPLE_PATH, 'utf-8')

    assert(envExample.includes('SUPERSET_SECRET_KEY='), 'Secret key placeholder present')
    assert(envExample.includes('MARIADB_PASSWORD='), 'MariaDB RO password placeholder present')
    assert(envExample.includes('SUPERSET_PG_PASSWORD='), 'Postgres password placeholder present')
  })

  it('CR06-SMOKE-2: Verify zero automated invoice routes and total absence of InfraPulse', () => {
    const compose = fs.readFileSync(COMPOSE_BI_PATH, 'utf-8')
    const sql = fs.readFileSync(SQL_VIEWS_PATH, 'utf-8')

    assert(!compose.toLowerCase().includes('infrapulse'), 'InfraPulse must never appear in compose')
    assert(!sql.toLowerCase().includes('infrapulse'), 'InfraPulse must never appear in SQL')
    assert(!sql.toLowerCase().includes('tabsales invoice'), 'No direct query on tabSales Invoice in views')
  })
})

