import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ---------------------------------------------------------------------------
  // 1. CRÉATION IDEMPOTENTE DES TYPES ENUM
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  // ---------------------------------------------------------------------------
  // 2. AJOUT DES COLONNES AVEC DÉFAUT 'published' (Non-destructif)
  // ---------------------------------------------------------------------------
  const addColumnStatements = [
    `ALTER TABLE "public"."services" ADD COLUMN IF NOT EXISTS "status" "public"."enum_services_status" DEFAULT 'published' NOT NULL`,
    `ALTER TABLE "public"."case_studies" ADD COLUMN IF NOT EXISTS "status" "public"."enum_case_studies_status" DEFAULT 'published' NOT NULL`,
  ]

  for (const statement of addColumnStatements) {
    try {
      await db.execute(sql.raw(statement))
    } catch (err: any) {
      const cause = err?.cause || err
      if (cause?.code === '42701' || cause?.message?.includes('already exists')) {
        continue
      }
      throw err
    }
  }

  // ---------------------------------------------------------------------------
  // 3. MISE À JOUR DE SÉCURITÉ POUR TOUT ENREGISTREMENT RÉSIDUEL NULL
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    UPDATE "public"."services"
    SET "status" = 'published'
    WHERE "status" IS NULL;
  `))

  await db.execute(sql.raw(`
    UPDATE "public"."case_studies"
    SET "status" = 'published'
    WHERE "status" IS NULL;
  `))

  // ---------------------------------------------------------------------------
  // 4. INDEX DE PERFORMANCE
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "services_status_idx" ON "public"."services" USING btree ("status");
  `))
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "case_studies_status_idx" ON "public"."case_studies" USING btree ("status");
  `))
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`DROP INDEX IF EXISTS "public"."case_studies_status_idx"`))
  await db.execute(sql.raw(`DROP INDEX IF EXISTS "public"."services_status_idx"`))
  await db.execute(sql.raw(`ALTER TABLE "public"."case_studies" DROP COLUMN IF EXISTS "status"`))
  await db.execute(sql.raw(`ALTER TABLE "public"."services" DROP COLUMN IF EXISTS "status"`))
  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."enum_case_studies_status"`))
  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."enum_services_status"`))
}
