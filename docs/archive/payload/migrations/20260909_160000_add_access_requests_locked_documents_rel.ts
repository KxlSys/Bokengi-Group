import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ---------------------------------------------------------------------------
  // 1. AJOUT DE LA COLONNE RELATIONNELLE POUR ACCESS_REQUESTS DANS PAYLOAD_LOCKED_DOCUMENTS_RELS
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    ALTER TABLE "public"."payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "access_requests_id" integer;
  `))

  // ---------------------------------------------------------------------------
  // 2. CONTRAINTE DE CLÉ ÉTRANGÈRE VERS LA TABLE ACCESS_REQUESTS
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_access_requests_fk'
      ) THEN
        ALTER TABLE "public"."payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_access_requests_fk"
        FOREIGN KEY ("access_requests_id") REFERENCES "public"."access_requests"("id")
        ON DELETE cascade ON UPDATE no action;
      END IF;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  // ---------------------------------------------------------------------------
  // 3. INDEX BTREE POUR LES REQUÊTES DE JOINTURE ET DE VERROUILLAGE ADMIN
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_access_requests_id_idx"
    ON "public"."payload_locked_documents_rels" USING btree ("access_requests_id");
  `))
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // ---------------------------------------------------------------------------
  // ROLLBACK DE LA COLONNE ET DES CONTRAINTES ASSOCIÉES
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    DROP INDEX IF EXISTS "public"."payload_locked_documents_rels_access_requests_id_idx";
  `))

  await db.execute(sql.raw(`
    ALTER TABLE "public"."payload_locked_documents_rels"
    DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_access_requests_fk";
  `))

  await db.execute(sql.raw(`
    ALTER TABLE "public"."payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "access_requests_id";
  `))
}
