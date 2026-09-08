import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ---------------------------------------------------------------------------
  // 1. CRÉATION IDEMPOTENTE DES TYPES ENUM RBAC
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'admin', 'editor');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_status" AS ENUM('pending', 'active', 'suspended', 'rejected');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  // ---------------------------------------------------------------------------
  // 2. AJOUT DES COLONNES AVEC VALEURS PAR DÉFAUT SÉCURISÉES (Non-destructif)
  // ---------------------------------------------------------------------------
  const addColumnStatements = [
    `ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "role" "public"."enum_users_role" DEFAULT 'editor' NOT NULL`,
    `ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "status" "public"."enum_users_status" DEFAULT 'pending' NOT NULL`,
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
  // 3. SANCTUARISATION DU COMPTE SUPER ADMINISTRATEUR ID 1
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    UPDATE "public"."users"
    SET "role" = 'super-admin', "status" = 'active'
    WHERE "id" = 1;
  `))

  // ---------------------------------------------------------------------------
  // 4. MISE À JOUR DE SÉCURITÉ POUR TOUT ENREGISTREMENT RÉSIDUEL NULL
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    UPDATE "public"."users"
    SET "role" = 'editor'
    WHERE "role" IS NULL;
  `))

  await db.execute(sql.raw(`
    UPDATE "public"."users"
    SET "status" = 'pending'
    WHERE "status" IS NULL AND "id" != 1;
  `))

  // ---------------------------------------------------------------------------
  // 5. INDEX DE PERFORMANCE SUR ROLE ET STATUS
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "users_role_idx" ON "public"."users" USING btree ("role");
  `))
  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "users_status_idx" ON "public"."users" USING btree ("status");
  `))
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // ---------------------------------------------------------------------------
  // ROLLBACK AUDITÉ ET NON-DESTRUCTIF DES STRUCTURES RBAC
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`DROP INDEX IF EXISTS "public"."users_status_idx"`))
  await db.execute(sql.raw(`DROP INDEX IF EXISTS "public"."users_role_idx"`))
  await db.execute(sql.raw(`ALTER TABLE "public"."users" DROP COLUMN IF EXISTS "status"`))
  await db.execute(sql.raw(`ALTER TABLE "public"."users" DROP COLUMN IF EXISTS "role"`))
  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."enum_users_status"`))
  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."enum_users_role"`))
}
