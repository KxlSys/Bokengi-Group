/**
 * Shim for drizzle-kit/api in Cloudflare Worker runtime.
 * Drizzle-kit contains native CLI binaries (esbuild, libsql) used exclusively for migrations.
 * In production Worker runtime, migrations are never executed during HTTP requests.
 */
export const generateDrizzleJson = () => ({})
export const generateMigration = async () => {}
export const pushSchema = async () => ({ hasDataLoss: false, warnings: [], statementsToExecute: [] })
export const upPgSnapshot = () => ({})

export default {
  generateDrizzleJson,
  generateMigration,
  pushSchema,
  upPgSnapshot,
}
