import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Création idempotente du type enum pour le pôle de traitement interne
  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_leads_treatment_pole" AS ENUM('it', 'digital', 'business', 'consulting', 'events');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  // Ajout de la colonne treatment_pole dans la table leads
  await db.execute(sql.raw(`
    ALTER TABLE "public"."leads"
    ADD COLUMN IF NOT EXISTS "treatment_pole" "public"."enum_leads_treatment_pole";
  `))

  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "leads_treatment_pole_idx" ON "public"."leads" USING btree ("treatment_pole");
  `))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(`
    DROP INDEX IF EXISTS "leads_treatment_pole_idx";
    ALTER TABLE "public"."leads" DROP COLUMN IF EXISTS "treatment_pole";
  `))
}
