import { runDryRun001 } from './orchestrate-dry-run-001.ts'
import type { DryRun001FullReport } from './orchestrate-dry-run-001.ts'

export interface IdempotenceDiffResult {
  run1Timestamp: string
  run2Timestamp: string
  totalEntitiesRun1: number
  totalEntitiesRun2: number
  checksumsMatched: number
  checksumsMismatched: number
  payloadIdsMatched: number
  payloadIdsMismatched: number
  relationsMatched: number
  relationsMismatched: number
  businessDiffsCount: number
  diffs: Array<{
    step: number
    collection: string
    sourceId: string | number
    field: string
    run1Value: string
    run2Value: string
    isBusinessDiff: boolean
  }>
  idempotenceVerdict: 'STRICTLY_IDEMPOTENT' | 'DIVERGENCE_DETECTED'
}

export function executeDryRun002AndCompare(): {
  run1: DryRun001FullReport
  run2: DryRun001FullReport
  diffResult: IdempotenceDiffResult
} {
  // Exécution 1 (Réf. DRY RUN 001)
  const run1 = runDryRun001()
  // Exécution 2 (DRY RUN 002 - Nouvelle passe isolée)
  const run2 = runDryRun001()

  let checksumsMatched = 0
  let checksumsMismatched = 0
  let payloadIdsMatched = 0
  let payloadIdsMismatched = 0
  let relationsMatched = 0
  let relationsMismatched = 0
  const diffs: IdempotenceDiffResult['diffs'] = []

  // Comparaison pas-à-pas des 11 étapes
  for (let s = 0; s < run1.steps.length; s++) {
    const step1 = run1.steps[s]
    const step2 = run2.steps[s]

    if (step1.actions.length !== step2.actions.length) {
      diffs.push({
        step: step1.stepNumber,
        collection: step1.stepName,
        sourceId: 'N/A',
        field: 'actions_count',
        run1Value: String(step1.actions.length),
        run2Value: String(step2.actions.length),
        isBusinessDiff: true,
      })
    }

    for (let a = 0; a < step1.actions.length; a++) {
      const act1 = step1.actions[a]
      const act2 = step2.actions[a]

      // 1. Checksum SHA-256
      if (act1.checksum === act2.checksum) {
        checksumsMatched++
      } else {
        checksumsMismatched++
        diffs.push({
          step: step1.stepNumber,
          collection: act1.sourceCollection,
          sourceId: act1.sourceId,
          field: 'checksum',
          run1Value: act1.checksum,
          run2Value: act2.checksum,
          isBusinessDiff: true,
        })
      }

      // 2. custom_payload_id
      if (act1.customPayloadId === act2.customPayloadId) {
        payloadIdsMatched++
      } else {
        payloadIdsMismatched++
        diffs.push({
          step: step1.stepNumber,
          collection: act1.sourceCollection,
          sourceId: act1.sourceId,
          field: 'customPayloadId',
          run1Value: act1.customPayloadId,
          run2Value: act2.customPayloadId,
          isBusinessDiff: true,
        })
      }

      // 3. Relations
      const rel1 = JSON.stringify(act1.relationsResolved)
      const rel2 = JSON.stringify(act2.relationsResolved)
      if (rel1 === rel2) {
        relationsMatched++
      } else {
        relationsMismatched++
        diffs.push({
          step: step1.stepNumber,
          collection: act1.sourceCollection,
          sourceId: act1.sourceId,
          field: 'relationsResolved',
          run1Value: rel1,
          run2Value: rel2,
          isBusinessDiff: true,
        })
      }
    }
  }

  const businessDiffs = diffs.filter((d) => d.isBusinessDiff).length

  return {
    run1,
    run2,
    diffResult: {
      run1Timestamp: run1.executionTimestamp,
      run2Timestamp: run2.executionTimestamp,
      totalEntitiesRun1: run1.totalEntitiesAnalyzed,
      totalEntitiesRun2: run2.totalEntitiesAnalyzed,
      checksumsMatched,
      checksumsMismatched,
      payloadIdsMatched,
      payloadIdsMismatched,
      relationsMatched,
      relationsMismatched,
      businessDiffsCount: businessDiffs,
      diffs,
      idempotenceVerdict: businessDiffs === 0 ? 'STRICTLY_IDEMPOTENT' : 'DIVERGENCE_DETECTED',
    },
  }
}

if (process.argv[1]?.includes('orchestrate-dry-run-002')) {
  const { diffResult } = executeDryRun002AndCompare()
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('       RÉSULTAT DU DRY RUN 002 (TEST D’IDEMPOTENCE STRICTE)   ')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`Timestamp Run 1      : ${diffResult.run1Timestamp}`)
  console.log(`Timestamp Run 2      : ${diffResult.run2Timestamp}`)
  console.log(`Entités Run 1        : ${diffResult.totalEntitiesRun1}`)
  console.log(`Entités Run 2        : ${diffResult.totalEntitiesRun2}`)
  console.log(`Checksums 100% pairs : ${diffResult.checksumsMatched} / ${diffResult.totalEntitiesRun1}`)
  console.log(`Payload IDs 100% pairs: ${diffResult.payloadIdsMatched} / ${diffResult.totalEntitiesRun1}`)
  console.log(`Relations 100% paires: ${diffResult.relationsMatched} / ${diffResult.totalEntitiesRun1}`)
  console.log(`Différences métier   : ${diffResult.businessDiffsCount}`)
  console.log(`Verdict d'Idempotence: ${diffResult.idempotenceVerdict}`)
  console.log('═══════════════════════════════════════════════════════════════')
}
