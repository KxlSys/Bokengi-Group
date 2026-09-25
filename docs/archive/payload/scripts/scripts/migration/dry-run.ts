import crypto from 'crypto'
import {
  POLES_SEED_DATA,
  SERVICES_SEED_DATA,
  CASE_STUDIES_SEED_DATA,
  POSTS_SEED_DATA,
} from '../../src/data/bokengi-seed-data.ts'

export interface DryRunAction {
  step: number
  collection: string
  targetDocType: string
  sourceId: string | number
  sourceSlug: string
  action: 'UPSERT' | 'CREATE' | 'INDEX_METADATA'
  dependencies: string[]
  checksum: string
  payloadPreview: Record<string, any>
  validation: {
    status: 'PASS' | 'WARN' | 'FAIL'
    errors: string[]
    warnings: string[]
  }
}

export interface DryRunReport {
  timestamp: string
  mode: 'DRY_RUN_ZERO_WRITE'
  totalRecordsAnalyzed: number
  totalActionsPlanned: number
  statusCounts: {
    PASS: number
    WARN: number
    FAIL: number
  }
  entitiesSummary: Record<string, { count: number; docType: string; status: 'VALID' | 'ANOMALY' }>
  actions: DryRunAction[]
  conflictReport: string[]
  readinessVerdict: 'READY_FOR_MIGRATION' | 'BLOCKED_BY_ANOMALIES'
}

function computeChecksum(data: unknown): string {
  const json = JSON.stringify(data, Object.keys(data as object).sort())
  return crypto.createHash('sha256').update(json).digest('hex')
}

export function executeDryRunSimulation(): DryRunReport {
  const actions: DryRunAction[] = []
  const conflicts: string[] = []
  const poleIdMap = new Map<string, string>()

  // ─────────────────────────────────────────────────────────────────────────
  // 1. SIMULATION ÉTAPE 3 : PÔLES D'EXPERTISE (5)
  // ─────────────────────────────────────────────────────────────────────────
  for (let idx = 0; idx < POLES_SEED_DATA.length; idx++) {
    const pole = POLES_SEED_DATA[idx]
    const errors: string[] = []
    const warnings: string[] = []

    if (!pole.slug) errors.push('Slug FR manquant')
    if (!pole.name) errors.push('Nom du pôle manquant')

    const targetPayload = {
      doctype: 'Bokengi Pole',
      pole_name_fr: pole.name,
      pole_name_en: pole.name, // Initialisé avec nom FR si non encore traduit
      slug_fr: pole.slug,
      slug_en: pole.slug,
      short_description_fr: pole.shortDescription,
      short_description_en: pole.shortDescription,
      description_fr: pole.description,
      description_en: pole.description,
      icon_code: pole.icon,
      display_order: pole.order,
      status: pole.status === 'published' ? 'Published' : 'Draft',
      seo_title_fr: pole.seo?.title || `${pole.name} · Bokengi Group`,
      seo_title_en: pole.seo?.title || `${pole.name} · Bokengi Group`,
      seo_description_fr: pole.seo?.description || pole.shortDescription,
      seo_description_en: pole.seo?.description || pole.shortDescription,
      custom_payload_id: `pole-${pole.slug}`,
      custom_payload_slug: pole.slug,
    }

    poleIdMap.set(pole.slug, `POL-${pole.slug}`)

    actions.push({
      step: 3,
      collection: 'poles',
      targetDocType: 'Bokengi Pole',
      sourceId: `pole-${pole.slug}`,
      sourceSlug: pole.slug,
      action: 'UPSERT',
      dependencies: [],
      checksum: computeChecksum(targetPayload),
      payloadPreview: targetPayload,
      validation: {
        status: errors.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS',
        errors,
        warnings,
      },
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. SIMULATION ÉTAPE 4 : SERVICES COMMERCIAUX (20)
  // ─────────────────────────────────────────────────────────────────────────
  for (let idx = 0; idx < SERVICES_SEED_DATA.length; idx++) {
    const srv = SERVICES_SEED_DATA[idx]
    const errors: string[] = []
    const warnings: string[] = []

    if (!srv.slug) errors.push('Slug service manquant')
    if (!srv.poleSlug) errors.push('Référence de pôle manquante')
    if (!poleIdMap.has(srv.poleSlug)) {
      errors.push(`Clé étrangère orpheline : pôle parent '${srv.poleSlug}' introuvable`)
      conflicts.push(`Service '${srv.title}' pointe vers un pôle inexistant '${srv.poleSlug}'`)
    }

    const targetPayload = {
      doctype: 'Bokengi Service',
      title_fr: srv.title,
      title_en: srv.title,
      slug_fr: srv.slug,
      slug_en: srv.slug,
      pole: poleIdMap.get(srv.poleSlug) || `POL-${srv.poleSlug}`,
      category_fr: srv.category,
      category_en: srv.category,
      short_description_fr: srv.shortDescription,
      short_description_en: srv.shortDescription,
      content_fr: srv.content,
      content_en: srv.content,
      technical_tags: srv.technicalTags.map((t) => ({ tag_name: t.tag })),
      featured: srv.featured ? 1 : 0,
      display_order: srv.order,
      status: srv.status === 'draft' ? 'Draft' : 'Published',
      custom_payload_id: `srv-${srv.slug}`,
      custom_payload_slug: srv.slug,
    }

    actions.push({
      step: 4,
      collection: 'services',
      targetDocType: 'Bokengi Service',
      sourceId: `srv-${srv.slug}`,
      sourceSlug: srv.slug,
      action: 'UPSERT',
      dependencies: [`POL-${srv.poleSlug}`],
      checksum: computeChecksum(targetPayload),
      payloadPreview: targetPayload,
      validation: {
        status: errors.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS',
        errors,
        warnings,
      },
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. SIMULATION ÉTAPE 5 : CASE STUDIES / RÉALISATIONS (5)
  // ─────────────────────────────────────────────────────────────────────────
  for (let idx = 0; idx < CASE_STUDIES_SEED_DATA.length; idx++) {
    const cs = CASE_STUDIES_SEED_DATA[idx]
    const errors: string[] = []
    const warnings: string[] = []

    if (!cs.slug) errors.push('Slug CaseStudy manquant')

    const targetPayload = {
      doctype: 'Bokengi Case Study',
      title_fr: cs.title,
      title_en: cs.title,
      slug_fr: cs.slug,
      slug_en: cs.slug,
      client_name: cs.clientName,
      category_fr: cs.category,
      category_en: cs.category,
      summary_fr: cs.summary,
      summary_en: cs.summary,
      context_fr: cs.context,
      context_en: cs.context,
      challenge_fr: cs.challenge,
      challenge_en: cs.challenge,
      solution_fr: cs.solution,
      solution_en: cs.solution,
      results_fr: cs.results,
      results_en: cs.results,
      architecture_fr: cs.architecture,
      architecture_en: cs.architecture,
      technologies: cs.technologies.map((t) => ({ tech_name: t.name })),
      screenshots: (cs.screenshots || []).map((s) => ({
        image_file: s.url,
        caption_fr: s.caption || s.alt || '',
        caption_en: s.caption || s.alt || '',
      })),
      published_date: cs.publishedDate,
      featured: cs.featured ? 1 : 0,
      status: cs.status === 'draft' ? 'Draft' : 'Published',
      custom_payload_id: `cs-${cs.slug}`,
      custom_payload_slug: cs.slug,
    }

    actions.push({
      step: 5,
      collection: 'case-studies',
      targetDocType: 'Bokengi Case Study',
      sourceId: `cs-${cs.slug}`,
      sourceSlug: cs.slug,
      action: 'UPSERT',
      dependencies: [],
      checksum: computeChecksum(targetPayload),
      payloadPreview: targetPayload,
      validation: {
        status: errors.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS',
        errors,
        warnings,
      },
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. SIMULATION ÉTAPE 6 : ARTICLES D'EXPERTISE / POSTS (4)
  // ─────────────────────────────────────────────────────────────────────────
  for (let idx = 0; idx < POSTS_SEED_DATA.length; idx++) {
    const post = POSTS_SEED_DATA[idx]
    const errors: string[] = []
    const warnings: string[] = []

    if (!post.slug) errors.push('Slug Post manquant')

    const targetPayload = {
      doctype: 'Bokengi Post',
      title_fr: post.title,
      title_en: post.title,
      slug_fr: post.slug,
      slug_en: post.slug,
      excerpt_fr: post.excerpt,
      excerpt_en: post.excerpt,
      content_fr: post.content,
      content_en: post.content,
      categories: post.categories.map((c) => ({ category_name: c })),
      tags: post.tags.map((t) => ({ tag_name: t })),
      published_at: post.publishedAt,
      reading_time: post.readingTime || 3,
      status: post.status === 'draft' ? 'Draft' : 'Published',
      seo_title_fr: post.seo?.title || post.title,
      seo_title_en: post.seo?.title || post.title,
      seo_description_fr: post.seo?.description || post.excerpt,
      seo_description_en: post.seo?.description || post.excerpt,
      custom_payload_id: `post-${post.slug}`,
      custom_payload_slug: post.slug,
    }

    actions.push({
      step: 6,
      collection: 'posts',
      targetDocType: 'Bokengi Post',
      sourceId: `post-${post.slug}`,
      sourceSlug: post.slug,
      action: 'UPSERT',
      dependencies: [],
      checksum: computeChecksum(targetPayload),
      payloadPreview: targetPayload,
      validation: {
        status: errors.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS',
        errors,
        warnings,
      },
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. BILAN GLOBAL
  // ─────────────────────────────────────────────────────────────────────────
  const passCount = actions.filter((a) => a.validation.status === 'PASS').length
  const warnCount = actions.filter((a) => a.validation.status === 'WARN').length
  const failCount = actions.filter((a) => a.validation.status === 'FAIL').length

  return {
    timestamp: new Date().toISOString(),
    mode: 'DRY_RUN_ZERO_WRITE',
    totalRecordsAnalyzed: actions.length,
    totalActionsPlanned: actions.length,
    statusCounts: {
      PASS: passCount,
      WARN: warnCount,
      FAIL: failCount,
    },
    entitiesSummary: {
      poles: { count: POLES_SEED_DATA.length, docType: 'Bokengi Pole', status: 'VALID' },
      services: { count: SERVICES_SEED_DATA.length, docType: 'Bokengi Service', status: 'VALID' },
      caseStudies: { count: CASE_STUDIES_SEED_DATA.length, docType: 'Bokengi Case Study', status: 'VALID' },
      posts: { count: POSTS_SEED_DATA.length, docType: 'Bokengi Post', status: 'VALID' },
      pages: { count: 0, docType: 'Bokengi Web Page', status: 'VALID' },
    },
    actions,
    conflictReport: conflicts,
    readinessVerdict: failCount === 0 ? 'READY_FOR_MIGRATION' : 'BLOCKED_BY_ANOMALIES',
  }
}

if (process.argv[1]?.includes('dry-run')) {
  const report = executeDryRunSimulation()
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('       RAPPORT DE SIMULATION DRY-RUN (ZERO-WRITE GUARANTEE)   ')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`Date d'analyse        : ${report.timestamp}`)
  console.log(`Enregistrements audités: ${report.totalRecordsAnalyzed}`)
  console.log(`Succès de validation  : ${report.statusCounts.PASS} / ${report.totalRecordsAnalyzed}`)
  console.log(`Avertissements        : ${report.statusCounts.WARN}`)
  console.log(`Erreurs bloquantes    : ${report.statusCounts.FAIL}`)
  console.log(`Conflits détectés     : ${report.conflictReport.length}`)
  console.log(`Verdict d'admissibilité: ${report.readinessVerdict}`)
  console.log('═══════════════════════════════════════════════════════════════')
}
