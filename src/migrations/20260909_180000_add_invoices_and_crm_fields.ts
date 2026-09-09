import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ---------------------------------------------------------------------------
  // 1. CRÉATION IDEMPOTENTE DES TYPES ENUM POUR FACTURATION ET CRM
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_invoices_type" AS ENUM('invoice', 'quote', 'credit_note');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_invoices_status" AS ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_invoices_payment_method" AS ENUM('virement', 'carte', 'cheque', 'autre');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_leads_priority" AS ENUM('low', 'medium', 'high', 'urgent');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  // ---------------------------------------------------------------------------
  // 2. CRÉATION IDEMPOTENTE DE LA TABLE INVOICES
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "public"."invoices" (
      "id" serial PRIMARY KEY NOT NULL,
      "invoice_number" varchar NOT NULL,
      "type" "public"."enum_invoices_type" DEFAULT 'invoice' NOT NULL,
      "status" "public"."enum_invoices_status" DEFAULT 'draft' NOT NULL,
      "subtotal_h_t" numeric,
      "total_v_a_t" numeric,
      "total_t_t_c" numeric,
      "lead_id" integer,
      "client_name" varchar NOT NULL,
      "client_company" varchar,
      "client_email" varchar,
      "client_phone" varchar,
      "client_address" varchar,
      "client_vat_number" varchar,
      "issue_date" timestamp(3) with time zone NOT NULL,
      "due_date" timestamp(3) with time zone NOT NULL,
      "payment_method" "public"."enum_invoices_payment_method" DEFAULT 'virement',
      "notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `))

  // Contrainte d'unicité et index sur invoice_number
  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'invoices_invoice_number_unique'
      ) THEN
        ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_invoice_number_unique" UNIQUE ("invoice_number");
      END IF;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "invoices_invoice_number_idx" ON "public"."invoices" USING btree ("invoice_number");
    CREATE INDEX IF NOT EXISTS "invoices_lead_id_idx" ON "public"."invoices" USING btree ("lead_id");
    CREATE INDEX IF NOT EXISTS "invoices_status_idx" ON "public"."invoices" USING btree ("status");
  `))

  // ---------------------------------------------------------------------------
  // 3. CRÉATION IDEMPOTENTE DE LA TABLE INVOICES_ITEMS (LIGNES DE FACTURE)
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "public"."invoices_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "description" varchar NOT NULL,
      "quantity" numeric DEFAULT 1 NOT NULL,
      "unit_price_h_t" numeric NOT NULL,
      "vat_rate" numeric DEFAULT 20 NOT NULL,
      "total_h_t" numeric,
      "total_t_t_c" numeric
    );
  `))

  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "invoices_items_order_idx" ON "public"."invoices_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "invoices_items_parent_id_idx" ON "public"."invoices_items" USING btree ("_parent_id");
  `))

  // Contraintes de clés étrangères pour Invoices
  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'invoices_lead_id_leads_id_fk'
      ) THEN
        ALTER TABLE "public"."invoices"
        ADD CONSTRAINT "invoices_lead_id_leads_id_fk"
        FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id")
        ON DELETE set null ON UPDATE no action;
      END IF;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'invoices_items_parent_id_fk'
      ) THEN
        ALTER TABLE "public"."invoices_items"
        ADD CONSTRAINT "invoices_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."invoices"("id")
        ON DELETE cascade ON UPDATE no action;
      END IF;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  // ---------------------------------------------------------------------------
  // 4. EXTENSION DE LA TABLE LEADS (CHAMPS INTERNES CRM)
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    ALTER TABLE "public"."leads"
    ADD COLUMN IF NOT EXISTS "priority" "public"."enum_leads_priority" DEFAULT 'medium' NOT NULL,
    ADD COLUMN IF NOT EXISTS "assigned_to_id" integer,
    ADD COLUMN IF NOT EXISTS "internal_notes" varchar;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'leads_assigned_to_id_users_id_fk'
      ) THEN
        ALTER TABLE "public"."leads"
        ADD CONSTRAINT "leads_assigned_to_id_users_id_fk"
        FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id")
        ON DELETE set null ON UPDATE no action;
      END IF;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "leads_assigned_to_id_idx" ON "public"."leads" USING btree ("assigned_to_id");
    CREATE INDEX IF NOT EXISTS "leads_priority_idx" ON "public"."leads" USING btree ("priority");
  `))

  // ---------------------------------------------------------------------------
  // 5. EXTENSION DE LA TABLE SITE_SETTINGS (CHAMPS JURIDIQUES ET FACTURATION)
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    ALTER TABLE "public"."site_settings"
    ADD COLUMN IF NOT EXISTS "legal_form" varchar DEFAULT 'SAS',
    ADD COLUMN IF NOT EXISTS "capital" varchar DEFAULT '7 500 €',
    ADD COLUMN IF NOT EXISTS "rcs" varchar,
    ADD COLUMN IF NOT EXISTS "siren" varchar,
    ADD COLUMN IF NOT EXISTS "siret" varchar,
    ADD COLUMN IF NOT EXISTS "vat_number" varchar,
    ADD COLUMN IF NOT EXISTS "bank_details_bank_name" varchar,
    ADD COLUMN IF NOT EXISTS "bank_details_iban" varchar,
    ADD COLUMN IF NOT EXISTS "bank_details_bic" varchar;
  `))

  // ---------------------------------------------------------------------------
  // 6. ENREGISTREMENT DANS PAYLOAD_LOCKED_DOCUMENTS_RELS
  // ---------------------------------------------------------------------------
  await db.execute(sql.raw(`
    ALTER TABLE "public"."payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "invoices_id" integer;
  `))

  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_invoices_fk'
      ) THEN
        ALTER TABLE "public"."payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_invoices_fk"
        FOREIGN KEY ("invoices_id") REFERENCES "public"."invoices"("id")
        ON DELETE cascade ON UPDATE no action;
      END IF;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `))

  await db.execute(sql.raw(`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_invoices_id_idx"
    ON "public"."payload_locked_documents_rels" USING btree ("invoices_id");
  `))
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Rollback locked documents rel
  await db.execute(sql.raw(`
    DROP INDEX IF EXISTS "public"."payload_locked_documents_rels_invoices_id_idx";
    ALTER TABLE "public"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_invoices_fk";
    ALTER TABLE "public"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "invoices_id";
  `))

  // Rollback site_settings
  await db.execute(sql.raw(`
    ALTER TABLE "public"."site_settings"
    DROP COLUMN IF EXISTS "legal_form",
    DROP COLUMN IF EXISTS "capital",
    DROP COLUMN IF EXISTS "rcs",
    DROP COLUMN IF EXISTS "siren",
    DROP COLUMN IF EXISTS "siret",
    DROP COLUMN IF EXISTS "vat_number",
    DROP COLUMN IF EXISTS "bank_details_bank_name",
    DROP COLUMN IF EXISTS "bank_details_iban",
    DROP COLUMN IF EXISTS "bank_details_bic";
  `))

  // Rollback leads
  await db.execute(sql.raw(`
    DROP INDEX IF EXISTS "public"."leads_assigned_to_id_idx";
    DROP INDEX IF EXISTS "public"."leads_priority_idx";
    ALTER TABLE "public"."leads" DROP CONSTRAINT IF EXISTS "leads_assigned_to_id_users_id_fk";
    ALTER TABLE "public"."leads"
    DROP COLUMN IF EXISTS "priority",
    DROP COLUMN IF EXISTS "assigned_to_id",
    DROP COLUMN IF EXISTS "internal_notes";
  `))

  // Rollback invoices
  await db.execute(sql.raw(`
    DROP TABLE IF EXISTS "public"."invoices_items" CASCADE;
    DROP TABLE IF EXISTS "public"."invoices" CASCADE;
  `))

  // Rollback types
  await db.execute(sql.raw(`
    DROP TYPE IF EXISTS "public"."enum_invoices_payment_method";
    DROP TYPE IF EXISTS "public"."enum_invoices_status";
    DROP TYPE IF EXISTS "public"."enum_invoices_type";
    DROP TYPE IF EXISTS "public"."enum_leads_priority";
  `))
}
