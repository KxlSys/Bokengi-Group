import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const upStatements = [
  // 1. Create auxiliary tables for Posts array fields
  `CREATE TABLE IF NOT EXISTS "posts_categories" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
)`,
  `CREATE TABLE IF NOT EXISTS "posts_tags" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"tag" varchar NOT NULL
)`,

  // 2. Foreign keys referencing posts(id) ON DELETE CASCADE
  `ALTER TABLE "posts_categories" ADD CONSTRAINT "posts_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action`,
  `ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action`,

  // 3. Indexes for order and parent_id
  `CREATE INDEX IF NOT EXISTS "posts_categories_order_idx" ON "posts_categories" USING btree ("_order")`,
  `CREATE INDEX IF NOT EXISTS "posts_categories_parent_id_idx" ON "posts_categories" USING btree ("_parent_id")`,
  `CREATE INDEX IF NOT EXISTS "posts_tags_order_idx" ON "posts_tags" USING btree ("_order")`,
  `CREATE INDEX IF NOT EXISTS "posts_tags_parent_id_idx" ON "posts_tags" USING btree ("_parent_id")`
]

const downStatements = [
  `DROP INDEX IF EXISTS "posts_tags_parent_id_idx"`,
  `DROP INDEX IF EXISTS "posts_tags_order_idx"`,
  `DROP INDEX IF EXISTS "posts_categories_parent_id_idx"`,
  `DROP INDEX IF EXISTS "posts_categories_order_idx"`,
  `ALTER TABLE "posts_tags" DROP CONSTRAINT IF EXISTS "posts_tags_parent_id_fk"`,
  `ALTER TABLE "posts_categories" DROP CONSTRAINT IF EXISTS "posts_categories_parent_id_fk"`,
  `DROP TABLE IF EXISTS "posts_tags" CASCADE`,
  `DROP TABLE IF EXISTS "posts_categories" CASCADE`
]


export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (let i = 0; i < upStatements.length; i++) {
    const statement = upStatements[i]
    try {
      await db.execute(sql.raw(statement))
    } catch (err: any) {
      const cause = err?.cause || err
      // Idempotency: allow existing tables, constraints or indexes
      if (
        cause?.code === '42710' || // duplicate_object
        cause?.code === '42P07' || // duplicate_table
        cause?.code === '42701' || // duplicate_column
        cause?.message?.includes('already exists')
      ) {
        console.warn(`[MIGRATE SKIPPED EXISTING]: statement ${i + 1}/${upStatements.length}`)
        continue
      }
      console.error(`[MIGRATE ERROR at statement ${i + 1}/${upStatements.length}]:`, statement, err?.message)
      throw err
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  for (let i = 0; i < downStatements.length; i++) {
    const statement = downStatements[i]
    try {
      await db.execute(sql.raw(statement))
    } catch (err: any) {
      const cause = err?.cause || err
      if (
        cause?.code === '42704' || // undefined_object
        cause?.code === '42P01' || // undefined_table
        cause?.message?.includes('does not exist')
      ) {
        continue
      }
      throw err
    }
  }
}
