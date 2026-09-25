import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ---------------------------------------------------------------------------
  // PHASE 1 — ADD COLUMN (Idempotent, Nullable, Non-destructive)
  // ---------------------------------------------------------------------------
  const addColumnStatements = [
    `ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "excerpt" varchar`,
    `ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "author_id" integer`,
    `ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "cover_image_id" integer`,
    `ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "status" "public"."enum_posts_status" DEFAULT 'draft'`,
    `ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "seo_title" varchar`,
    `ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "seo_description" varchar`,
    `ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "seo_image_id" integer`,
  ]

  for (const statement of addColumnStatements) {
    try {
      await db.execute(sql.raw(statement))
    } catch (err: any) {
      const cause = err?.cause || err
      // Idempotency: duplicate_column (42701)
      if (cause?.code === '42701' || cause?.message?.includes('already exists')) {
        continue
      }
      throw err
    }
  }

  // ---------------------------------------------------------------------------
  // PHASE 2 — MIGRATION DES DONNÉES (Copie conditionnelle, sans écrasement)
  // ---------------------------------------------------------------------------
  // 1. cover_image_id : hero_image_id -> cover_image_id
  await db.execute(sql.raw(`
    UPDATE "public"."posts"
    SET cover_image_id = hero_image_id
    WHERE cover_image_id IS NULL 
      AND hero_image_id IS NOT NULL
  `))

  // 2. status : _status -> status, puis repli 'draft' si résiduel NULL
  await db.execute(sql.raw(`
    UPDATE "public"."posts"
    SET status = _status
    WHERE status IS NULL 
      AND _status IS NOT NULL
  `))

  await db.execute(sql.raw(`
    UPDATE "public"."posts"
    SET status = 'draft'
    WHERE status IS NULL
  `))

  // 3. SEO : meta_* -> seo_*
  await db.execute(sql.raw(`
    UPDATE "public"."posts"
    SET 
      seo_title = COALESCE(seo_title, meta_title),
      seo_description = COALESCE(seo_description, meta_description),
      seo_image_id = COALESCE(seo_image_id, meta_image_id)
    WHERE meta_title IS NOT NULL 
       OR meta_description IS NOT NULL 
       OR meta_image_id IS NOT NULL
  `))

  // 4. author_id : posts_rels -> author_id (premier auteur par post, sans écrasement)
  await db.execute(sql.raw(`
    UPDATE "public"."posts" p
    SET author_id = sub.users_id
    FROM (
      SELECT DISTINCT ON (parent_id) parent_id, users_id
      FROM "public"."posts_rels"
      WHERE users_id IS NOT NULL 
        AND path IN ('author', 'authors')
      ORDER BY parent_id, "order" ASC NULLS LAST
    ) sub
    WHERE p.id = sub.parent_id
      AND p.author_id IS NULL
  `))

  // ---------------------------------------------------------------------------
  // PHASE 3 — VALIDATION AVANT CRÉATION DES FK (Détection d'orphelins)
  // ---------------------------------------------------------------------------
  const orphanResult: any = await db.execute(sql.raw(`
    SELECT
      (SELECT COUNT(*) FROM "public"."posts" p LEFT JOIN "public"."users" u ON p.author_id = u.id WHERE p.author_id IS NOT NULL AND u.id IS NULL) AS orphan_authors,
      (SELECT COUNT(*) FROM "public"."posts" p LEFT JOIN "public"."media" m ON p.cover_image_id = m.id WHERE p.cover_image_id IS NOT NULL AND m.id IS NULL) AS orphan_cover_images,
      (SELECT COUNT(*) FROM "public"."posts" p LEFT JOIN "public"."media" m ON p.seo_image_id = m.id WHERE p.seo_image_id IS NOT NULL AND m.id IS NULL) AS orphan_seo_images
  `))

  const orphanRow = orphanResult?.rows?.[0] || orphanResult?.[0]
  const orphanAuthors = Number(orphanRow?.orphan_authors || 0)
  const orphanCoverImages = Number(orphanRow?.orphan_cover_images || 0)
  const orphanSeoImages = Number(orphanRow?.orphan_seo_images || 0)

  if (orphanAuthors > 0 || orphanCoverImages > 0 || orphanSeoImages > 0) {
    const errorDetails: string[] = []
    if (orphanAuthors > 0) {
      errorDetails.push(`${orphanAuthors} orphan author_id reference(s) -> users(id)`)
    }
    if (orphanCoverImages > 0) {
      errorDetails.push(`${orphanCoverImages} orphan cover_image_id reference(s) -> media(id)`)
    }
    if (orphanSeoImages > 0) {
      errorDetails.push(`${orphanSeoImages} orphan seo_image_id reference(s) -> media(id)`)
    }
    throw new Error(`[MIGRATION ABORTED - ORPHAN REFERENCES DETECTED]: ${errorDetails.join(', ')}`)
  }

  // ---------------------------------------------------------------------------
  // PHASE 4 — CLÉS ÉTRANGÈRES (Idempotentes, ON DELETE SET NULL)
  // ---------------------------------------------------------------------------
  const fkStatements = [
    `DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'posts_author_id_users_id_fk') THEN
        ALTER TABLE "public"."posts" 
          ADD CONSTRAINT "posts_author_id_users_id_fk" 
          FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") 
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;`,
    `DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'posts_cover_image_id_media_id_fk') THEN
        ALTER TABLE "public"."posts" 
          ADD CONSTRAINT "posts_cover_image_id_media_id_fk" 
          FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") 
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;`,
    `DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'posts_seo_image_id_media_id_fk') THEN
        ALTER TABLE "public"."posts" 
          ADD CONSTRAINT "posts_seo_image_id_media_id_fk" 
          FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") 
          ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;`,
  ]

  for (const statement of fkStatements) {
    try {
      await db.execute(sql.raw(statement))
    } catch (err: any) {
      const cause = err?.cause || err
      if (cause?.code === '42710' || cause?.message?.includes('already exists')) {
        continue
      }
      throw err
    }
  }

  // ---------------------------------------------------------------------------
  // PHASE 5 — INDEX (Idempotents, sans collision de noms)
  // ---------------------------------------------------------------------------
  const indexStatements = [
    `CREATE INDEX IF NOT EXISTS "posts_author_idx" ON "public"."posts" USING btree ("author_id")`,
    `CREATE INDEX IF NOT EXISTS "posts_cover_image_idx" ON "public"."posts" USING btree ("cover_image_id")`,
    `CREATE INDEX IF NOT EXISTS "posts_status_idx" ON "public"."posts" USING btree ("status")`,
    `CREATE INDEX IF NOT EXISTS "posts_seo_seo_image_idx" ON "public"."posts" USING btree ("seo_image_id")`,
  ]

  for (const statement of indexStatements) {
    try {
      await db.execute(sql.raw(statement))
    } catch (err: any) {
      const cause = err?.cause || err
      if (cause?.code === '42P07' || cause?.message?.includes('already exists')) {
        continue
      }
      throw err
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // ---------------------------------------------------------------------------
  // PHASE 6 — DOWN MIGRATION (Supprime uniquement les objets de cette migration)
  // ---------------------------------------------------------------------------
  const downStatements = [
    // 1. Drop Indexes
    `DROP INDEX IF EXISTS "public"."posts_seo_seo_image_idx"`,
    `DROP INDEX IF EXISTS "public"."posts_status_idx"`,
    `DROP INDEX IF EXISTS "public"."posts_cover_image_idx"`,
    `DROP INDEX IF EXISTS "public"."posts_author_idx"`,

    // 2. Drop Foreign Keys
    `ALTER TABLE "public"."posts" DROP CONSTRAINT IF EXISTS "posts_seo_image_id_media_id_fk"`,
    `ALTER TABLE "public"."posts" DROP CONSTRAINT IF EXISTS "posts_cover_image_id_media_id_fk"`,
    `ALTER TABLE "public"."posts" DROP CONSTRAINT IF EXISTS "posts_author_id_users_id_fk"`,

    // 3. Drop Added Columns (conserve hero_image_id, _status, meta_*, etc.)
    `ALTER TABLE "public"."posts" DROP COLUMN IF EXISTS "seo_image_id"`,
    `ALTER TABLE "public"."posts" DROP COLUMN IF EXISTS "seo_description"`,
    `ALTER TABLE "public"."posts" DROP COLUMN IF EXISTS "seo_title"`,
    `ALTER TABLE "public"."posts" DROP COLUMN IF EXISTS "status"`,
    `ALTER TABLE "public"."posts" DROP COLUMN IF EXISTS "cover_image_id"`,
    `ALTER TABLE "public"."posts" DROP COLUMN IF EXISTS "author_id"`,
    `ALTER TABLE "public"."posts" DROP COLUMN IF EXISTS "excerpt"`,
  ]

  for (const statement of downStatements) {
    try {
      await db.execute(sql.raw(statement))
    } catch (err: any) {
      const cause = err?.cause || err
      if (
        cause?.code === '42704' || // undefined_object
        cause?.code === '42703' || // undefined_column
        cause?.code === '42P01' || // undefined_table
        cause?.message?.includes('does not exist')
      ) {
        continue
      }
      throw err
    }
  }
}
