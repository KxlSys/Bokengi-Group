import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const upStatements = [
  // 1. Enums
  `CREATE TYPE "public"."enum_poles_status" AS ENUM('draft', 'published')`,
  `CREATE TYPE "public"."enum_leads_request_type" AS ENUM('devis', 'cadrage', 'partenariat', 'autre')`,
  `CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'converted', 'archived')`,
  `CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('linkedin', 'twitter', 'github', 'youtube', 'other')`,

  // 2. Tables & Auxiliary tables
  `CREATE TABLE "poles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"short_description" varchar,
	"description" jsonb,
	"icon" varchar,
	"order" numeric DEFAULT 0,
	"status" "enum_poles_status" DEFAULT 'draft' NOT NULL,
	"seo_title" varchar,
	"seo_description" varchar,
	"seo_image_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
)`,
  `CREATE TABLE "services_technical_tags" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"tag" varchar NOT NULL
)`,
  `CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"pole_id" integer NOT NULL,
	"category" varchar,
	"short_description" varchar,
	"content" jsonb,
	"featured" boolean DEFAULT false,
	"order" numeric DEFAULT 0,
	"seo_title" varchar,
	"seo_description" varchar,
	"seo_image_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
)`,
  `CREATE TABLE "case_studies_technologies" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
)`,
  `CREATE TABLE "case_studies_screenshots" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"caption" varchar
)`,
  `CREATE TABLE "case_studies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"client_name" varchar,
	"category" varchar,
	"summary" varchar,
	"context" jsonb,
	"challenge" jsonb,
	"solution" jsonb,
	"results" jsonb,
	"architecture" jsonb,
	"featured" boolean DEFAULT false,
	"published_date" timestamp(3) with time zone,
	"seo_title" varchar,
	"seo_description" varchar,
	"seo_image_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
)`,
  `CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar NOT NULL,
	"lastname" varchar NOT NULL,
	"company" varchar,
	"email" varchar NOT NULL,
	"phone" varchar,
	"request_type" "enum_leads_request_type" DEFAULT 'devis' NOT NULL,
	"pole_id" integer,
	"message" varchar NOT NULL,
	"source" varchar DEFAULT 'website',
	"status" "enum_leads_status" DEFAULT 'new' NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
)`,
  `CREATE TABLE "site_settings_social_links" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"platform" "enum_site_settings_social_links_platform" NOT NULL,
	"url" varchar NOT NULL
)`,
  `CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar DEFAULT 'Bokengi Group' NOT NULL,
	"contact_email" varchar,
	"phone" varchar,
	"address_street" varchar,
	"address_city" varchar,
	"address_country" varchar,
	"domains_production" varchar DEFAULT 'https://bokengi-group.com',
	"domains_preview" varchar DEFAULT 'https://bokengi.vercel.app',
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
)`,

  // 3. Columns for payload_locked_documents_rels
  `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "poles_id" integer`,
  `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "services_id" integer`,
  `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "case_studies_id" integer`,
  `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "leads_id" integer`,

  // 4. Foreign Keys
  `ALTER TABLE "poles" ADD CONSTRAINT "poles_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action`,
  `ALTER TABLE "services_technical_tags" ADD CONSTRAINT "services_technical_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action`,
  `ALTER TABLE "services" ADD CONSTRAINT "services_pole_id_poles_id_fk" FOREIGN KEY ("pole_id") REFERENCES "public"."poles"("id") ON DELETE set null ON UPDATE no action`,
  `ALTER TABLE "services" ADD CONSTRAINT "services_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action`,
  `ALTER TABLE "case_studies_technologies" ADD CONSTRAINT "case_studies_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action`,
  `ALTER TABLE "case_studies_screenshots" ADD CONSTRAINT "case_studies_screenshots_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action`,
  `ALTER TABLE "case_studies_screenshots" ADD CONSTRAINT "case_studies_screenshots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action`,
  `ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action`,
  `ALTER TABLE "leads" ADD CONSTRAINT "leads_pole_id_poles_id_fk" FOREIGN KEY ("pole_id") REFERENCES "public"."poles"("id") ON DELETE set null ON UPDATE no action`,
  `ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action`,
  `ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_poles_fk" FOREIGN KEY ("poles_id") REFERENCES "public"."poles"("id") ON DELETE cascade ON UPDATE no action`,
  `ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action`,
  `ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action`,
  `ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action`,

  // 5. Indexes and Unique Indexes
  `CREATE UNIQUE INDEX "poles_slug_idx" ON "poles" USING btree ("slug")`,
  `CREATE INDEX "poles_seo_seo_image_idx" ON "poles" USING btree ("seo_image_id")`,
  `CREATE INDEX "poles_updated_at_idx" ON "poles" USING btree ("updated_at")`,
  `CREATE INDEX "poles_created_at_idx" ON "poles" USING btree ("created_at")`,
  `CREATE INDEX "services_technical_tags_order_idx" ON "services_technical_tags" USING btree ("_order")`,
  `CREATE INDEX "services_technical_tags_parent_id_idx" ON "services_technical_tags" USING btree ("_parent_id")`,
  `CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug")`,
  `CREATE INDEX "services_pole_idx" ON "services" USING btree ("pole_id")`,
  `CREATE INDEX "services_seo_seo_image_idx" ON "services" USING btree ("seo_image_id")`,
  `CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at")`,
  `CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at")`,
  `CREATE INDEX "case_studies_technologies_order_idx" ON "case_studies_technologies" USING btree ("_order")`,
  `CREATE INDEX "case_studies_technologies_parent_id_idx" ON "case_studies_technologies" USING btree ("_parent_id")`,
  `CREATE INDEX "case_studies_screenshots_order_idx" ON "case_studies_screenshots" USING btree ("_order")`,
  `CREATE INDEX "case_studies_screenshots_parent_id_idx" ON "case_studies_screenshots" USING btree ("_parent_id")`,
  `CREATE INDEX "case_studies_screenshots_image_idx" ON "case_studies_screenshots" USING btree ("image_id")`,
  `CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug")`,
  `CREATE INDEX "case_studies_seo_seo_image_idx" ON "case_studies" USING btree ("seo_image_id")`,
  `CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at")`,
  `CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at")`,
  `CREATE INDEX "leads_pole_idx" ON "leads" USING btree ("pole_id")`,
  `CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at")`,
  `CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at")`,
  `CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order")`,
  `CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id")`,
  `CREATE INDEX "payload_locked_documents_rels_poles_id_idx" ON "payload_locked_documents_rels" USING btree ("poles_id")`,
  `CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id")`,
  `CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id")`,
  `CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id")`
]

const downStatements = [
  // 1. Drop locked documents rels indexes and constraints
  `DROP INDEX IF EXISTS "payload_locked_documents_rels_leads_id_idx"`,
  `DROP INDEX IF EXISTS "payload_locked_documents_rels_case_studies_id_idx"`,
  `DROP INDEX IF EXISTS "payload_locked_documents_rels_services_id_idx"`,
  `DROP INDEX IF EXISTS "payload_locked_documents_rels_poles_id_idx"`,
  `ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_leads_fk"`,
  `ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_case_studies_fk"`,
  `ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_services_fk"`,
  `ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_poles_fk"`,
  `ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "leads_id"`,
  `ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "case_studies_id"`,
  `ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "services_id"`,
  `ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "poles_id"`,

  // 2. Drop tables created by this migration
  `DROP TABLE IF EXISTS "site_settings_social_links" CASCADE`,
  `DROP TABLE IF EXISTS "site_settings" CASCADE`,
  `DROP TABLE IF EXISTS "leads" CASCADE`,
  `DROP TABLE IF EXISTS "case_studies_screenshots" CASCADE`,
  `DROP TABLE IF EXISTS "case_studies_technologies" CASCADE`,
  `DROP TABLE IF EXISTS "case_studies" CASCADE`,
  `DROP TABLE IF EXISTS "services_technical_tags" CASCADE`,
  `DROP TABLE IF EXISTS "services" CASCADE`,
  `DROP TABLE IF EXISTS "poles" CASCADE`,

  // 3. Drop enums created by this migration
  `DROP TYPE IF EXISTS "public"."enum_site_settings_social_links_platform"`,
  `DROP TYPE IF EXISTS "public"."enum_leads_status"`,
  `DROP TYPE IF EXISTS "public"."enum_leads_request_type"`,
  `DROP TYPE IF EXISTS "public"."enum_poles_status"`
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (let i = 0; i < upStatements.length; i++) {
    const statement = upStatements[i]
    try {
      await db.execute(sql.raw(statement))
    } catch (err: any) {
      const cause = err?.cause || err
      // Idempotency: allow existing types or tables if previously created
      if (
        cause?.code === '42710' || // duplicate_object (enum already exists)
        cause?.code === '42P07' || // duplicate_table (table or index already exists)
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
        cause?.code === '42704' || // undefined_object (does not exist)
        cause?.code === '42P01' || // undefined_table (does not exist)
        cause?.message?.includes('does not exist')
      ) {
        continue
      }
      throw err
    }
  }
}
