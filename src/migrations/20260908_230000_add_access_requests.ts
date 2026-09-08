import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ---------------------------------------------------------------------------
  // 1. CRÉATION IDEMPOTENTE DES TYPES ENUM ACCESS_REQUESTS
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_access_requests_requested_role" AS ENUM('admin', 'editor');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_access_requests_status" AS ENUM('pending', 'approved', 'rejected', 'expired');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_access_requests_assigned_role" AS ENUM('admin', 'editor');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  // ---------------------------------------------------------------------------
  // 2. CRÉATION IDEMPOTENTE DE LA TABLE ACCESS_REQUESTS
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "public"."access_requests" (
      "id" serial PRIMARY KEY NOT NULL,
      "first_name" varchar NOT NULL,
      "last_name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "requested_role" "public"."enum_access_requests_requested_role" DEFAULT 'editor' NOT NULL,
      "justification" varchar NOT NULL,
      "status" "public"."enum_access_requests_status" DEFAULT 'pending' NOT NULL,
      "assigned_role" "public"."enum_access_requests_assigned_role",
      "admin_notes" varchar,
      "processed_at" timestamp(3) with time zone,
      "processed_by_id" integer,
      "expires_at" timestamp(3) with time zone NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `))

  // ---------------------------------------------------------------------------
  // 3. CLÉ ÉTRANGÈRE VERS LA TABLE USERS
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'access_requests_processed_by_id_users_id_fk'
      ) THEN
        ALTER TABLE "public"."access_requests"
        ADD CONSTRAINT "access_requests_processed_by_id_users_id_fk"
        FOREIGN KEY ("processed_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;
      END IF;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  // ---------------------------------------------------------------------------
  // 4. INDEX DE PERFORMANCE
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "access_requests_email_idx" ON "public"."access_requests" USING btree ("email");
  `))
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "access_requests_status_idx" ON "public"."access_requests" USING btree ("status");
  `))
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "access_requests_expires_at_idx" ON "public"."access_requests" USING btree ("expires_at");
  `))
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "access_requests_processed_by_id_idx" ON "public"."access_requests" USING btree ("processed_by_id");
  `))

  // ---------------------------------------------------------------------------
  // 5. CONTRAINTE D'UNICITÉ CONDITIONNELLE (ANTI-RACE CONDITION SUR STATUT PENDING)
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "access_requests_pending_email_uidx"
    ON "public"."access_requests" ("email")
    WHERE ("status" = 'pending');
  `))
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // ---------------------------------------------------------------------------
  // ROLLBACK AUDITÉ DE LA TABLE ET DES TYPES
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`DROP INDEX IF EXISTS "public"."access_requests_pending_email_uidx"`))
  await db.execute(sql.raw(`DROP INDEX IF EXISTS "public"."access_requests_processed_by_id_idx"`))
  await db.execute(sql.raw(`DROP INDEX IF EXISTS "public"."access_requests_expires_at_idx"`))
  await db.execute(sql.raw(`DROP INDEX IF EXISTS "public"."access_requests_status_idx"`))
  await db.execute(sql.raw(`DROP INDEX IF EXISTS "public"."access_requests_email_idx"`))
  await db.execute(sql.raw(`DROP TABLE IF EXISTS "public"."access_requests"`))
  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."enum_access_requests_assigned_role"`))
  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."enum_access_requests_status"`))
  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."enum_access_requests_requested_role"`))
}
