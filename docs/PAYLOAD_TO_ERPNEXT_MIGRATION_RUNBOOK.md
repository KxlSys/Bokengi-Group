# RUNBOOK D'EXÉCUTION DE MIGRATION
## PAYLOAD CMS 3.x → ERPNEXT (BOKENGI GROUP 2.0)

**Référence :** `PAYLOAD_TO_ERPNEXT_MIGRATION_RUNBOOK.md`  
**Version :** 1.0.0 — Production-Ready Preparation  
**Statut :** PRÉPARÉ POUR EXÉCUTION / NON EXÉCUTÉ  
**Auteur :** Direction Technique & Ingénierie des Systèmes Bokengi  
**Date :** 20 Septembre 2026  

---

## 1. OBJECTIFS, PÉRIMÈTRE & PRINCIPES DIRECTEURS

Ce Runbook constitue le **guide opératoire exhaustif, déterministe et vérifiable** permettant à l'équipe technique d'exécuter la migration des données de **Payload CMS** vers **ERPNext** sans risque de perte de données, d'incohérence relationnelle ou d'interruption du trafic public.

### Règles d'Or Opérationnelles :
1. **Idempotence stricte :** Tout script ou commande de migration doit pouvoir être ré-exécuté $N$ fois sans créer de doublons ni altérer l'état valide (`UPSERT` systématique basé sur `custom_payload_id`).
2. **Non-destructivité :** Les données source PostgreSQL et les fichiers Cloudflare R2 sont traités en **lecture seule stricte**.
3. **Traçabilité totale :** Chaque écriture est consignée dans un journal local `migration-journal.json` avec hash SHA-256 de parité.
4. **Conservation intégrale I18N UI :** Les 319 clés de traduction de l'interface restent dans les dictionnaires Next.js (`src/i18n/dictionaries/`).
5. **Rollback opérationnel et résilience contrôlée :** La bascule vers ERPNext s'effectue via un commutateur dynamique avec repli automatique (*graceful fallback*) vers Payload en cas d'anomalie, ce qui réduit et contrôle fortement le risque d'indisponibilité sans toutefois l'annuler totalement (nécessite une surveillance continue des métriques).

---

## 2. PRÉREQUIS D'INFRASTRUCTURE & CONFIGURATION

### 2.1. Environnement ERPNext Cible
* **Instance ERPNext :** Version 15+ ou Frappe Framework v15+ accessible en HTTPS.
* **Compte de Service API :** Utilisateur système dédié (ex: `migration_bot@bokengi-group.com`) muni d'une paire de clés d'API active :
  * `ERPNEXT_API_KEY`
  * `ERPNEXT_API_SECRET`
  * Rôles ERPNext requis : `System Manager`, `Sales Master Manager`, `Accounts Manager`.
* **Application Personnalisée Frappe (`bokengi_core`) :** Déploiement préalable des DocTypes et Custom Fields répertoriés en Section 4.

### 2.2. Stockage Objet Cloudflare R2
* **Bucket R2 Actif :** `bokengi-media` (production) et `bokengi-media-preview` (staging).
* **Identifiants S3 R2 configurés dans ERPNext :**
  * `R2_ACCESS_KEY_ID`
  * `R2_SECRET_ACCESS_KEY`
  * `R2_ENDPOINT` : `https://<account_id>.r2.cloudflarestorage.com`
  * `R2_PUBLIC_DOMAIN` : `https://pub-media.bokengi-group.com`

### 2.3. Variables d'Environnement de Migration (.env.migration)
```bash
# Configuration Source Payload
DATABASE_URI="postgresql://postgres:password@127.0.0.1:5432/bokengi_payload"
PAYLOAD_SECRET="your-payload-secret"

# Configuration Cible ERPNext
ERPNEXT_HOST="https://erp.bokengi-group.com"
ERPNEXT_API_KEY="bk_api_key_xxxxxxxxxxxx"
ERPNEXT_API_SECRET="bk_api_sec_xxxxxxxxxxxx"

# Mode Opératoire
MIGRATION_DRY_RUN="true" # Passer à "false" uniquement lors du RUN réel
MIGRATION_BATCH_SIZE="50"
MIGRATION_JOURNAL_PATH="./migration-journal.json"
```

---

## 3. GRAPHE DE DÉPENDANCES & ORDRE D'EXÉCUTION DÉTERMINISTE

Toutes les collections et entités doivent être migrées selon l'ordre strict imposé par leurs relations de clés étrangères :

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     SÉQUENCE DE MIGRATION DÉTERMINISTE (11 ÉTAPES)              │
├───────┬─────────────────────────────┬───────────────────┬───────────────────────┤
│ Ordre │ Entité / Collection         │ DocType ERPNext   │ Dépendances Directes  │
├───────┼─────────────────────────────┼───────────────────┼───────────────────────┤
│ 1     │ Users & Habilitations RBAC  │ User, Role Profile│ Aucune                │
│ 2     │ Médiathèque & Fichiers R2   │ File              │ R2 Bucket             │
│ 3     │ Pôles d'expertise (5)       │ Bokengi Pole      │ Étape 2 (Icônes SVG)  │
│ 4     │ Services Commerciaux (20)   │ Item, Bokengi Srv │ Étape 3 (Pôles)       │
│ 5     │ Réalisations & Case Studies │ Bokengi Case Study│ Étape 2 (Screenshots) │
│ 6     │ Articles & Thought Leader.  │ Bokengi Post      │ Étape 1 (Auteurs)     │
│ 7     │ Pages Web Modulaires        │ Bokengi Web Page  │ Étape 2 (Bannières)   │
│ 8     │ Demandes & Prospects CRM    │ Lead              │ Étape 3 (Pôles)       │
│ 9     │ Devis & Factures Légales    │ Quotation, Invoice│ Étape 8, Étape 4      │
│ 10    │ Demandes d'Accès Système    │ Bokengi Access Req│ Étape 1 (Valideurs)   │
│ 11    │ Paramètres Globaux & Nav.   │ Bokengi Settings  │ Étape 2 (Logos)       │
└───────┴─────────────────────────────┴───────────────────┴───────────────────────┘
```

---

## 4. MAPPINGS DÉTAILLÉS & RÈGLES DE TRANSFORMATION

### 4.1. Règle Générale de Conversion Lexical AST $\to$ Markdown / HTML
Les contenus Payload stockés sous forme d'arbre AST Lexical (`{ root: { children: [...] } }`) sont convertis de manière déterministe :
* Titres (`heading`) $\to$ Balises `#`, `##`, `###` ou `<h1>`, `<h2>`, `<h3>`.
* Paragraphes (`paragraph`) $\to$ Blocs de texte séparés par double saut de ligne `\n\n`.
* Listes (`list`, `listitem`) $\to$ Puces `- item` ou listes numérotées `1. item`.
* Liens (`link`) $\to$ `[texte](url)`.
* Retours chariot (`linebreak`) $\to$ `\n`.

---

### 4.2. Mappings Spécifiques par Entité

#### Étape 1 : Utilisateurs (`users` $\to$ `User` + `Role Profile`)
* **Champs :**
  * `email` $\to$ `name` & `email` (Data, Unique)
  * `name` $\to$ `first_name` & `full_name` (Data)
  * `role` :
    * `super-admin` $\to$ Rôle `System Manager` + profil `Bokengi Super Admin`
    * `admin` $\to$ Rôles `Sales Manager`, `Accounts Manager`
    * `editor` $\to$ Rôle `Bokengi Content Editor`
  * `status` :
    * `active` $\to$ `enabled = 1`
    * `pending` / `suspended` / `rejected` $\to$ `enabled = 0`
  * `id` (Payload) $\to$ `custom_payload_id` (Data, Indexé)

---

#### Étape 2 : Médiathèque (`media` $\to$ `File`)
* **Champs :**
  * `filename` $\to$ `file_name` (Data)
  * `url` / `/api/media/file/:filename` $\to$ `file_url` (`https://pub-media.bokengi-group.com/{filename}`)
  * `alt` $\to$ `custom_alt_fr` & `custom_alt_en` (Data)
  * `caption` (Lexical) $\to$ `custom_caption_fr` & `custom_caption_en` (Text)
  * `mimeType` $\to$ `custom_mime_type` (Data)
  * `filesize` $\to$ `file_size` (Int)
  * `width`, `height` $\to$ `custom_width`, `custom_height` (Int)
  * `is_private` $\to$ `0` (Tous les médias web Bokengi sont publics)
  * `id` (Payload) $\to$ `custom_payload_id` (Data, Indexé)

---

#### Étape 3 : Pôles d'expertise (`poles` $\to$ `Bokengi Pole`)
* **Champs :**
  * `name` $\to$ `pole_name_fr` & `pole_name_en` (Data)
  * `slug` $\to$ `slug_fr` & `slug_en` (Data, Indexé)
  * `shortDescription` $\to$ `short_description_fr` & `short_description_en` (Small Text)
  * `description` (Lexical) $\to$ `description_fr` & `description_en` (Text Editor / HTML)
  * `icon` $\to$ `icon_code` (Data, ex: `server`, `code`, `trending-up`)
  * `order` $\to$ `display_order` (Int)
  * `status` $\to$ `status` (`Draft` / `Published`)
  * `seo.title` $\to$ `seo_title_fr` & `seo_title_en` (Data)
  * `seo.description` $\to$ `seo_description_fr` & `seo_description_en` (Small Text)
  * `id` (Payload) $\to$ `custom_payload_id` (Data, Unique, Indexé)

---

#### Étape 4 : Services Commerciaux (`services` $\to$ `Item` & `Bokengi Service`)
* **A. Entité ERPNext `Item` (Niveau Comptable/Devisage) :**
  * `item_code` $\to$ `SRV-{slug}` (ex: `SRV-CYBERSECURITE-RESILIENCE`)
  * `item_name` $\to$ `title` (FR)
  * `item_group` $\to$ `"Services"`
  * `is_sales_item` $\to$ `1`
  * `is_stock_item` $\to$ `0`
* **B. Entité ERPNext `Bokengi Service` (Niveau Marketing Front-Office) :**
  * `title` $\to$ `title_fr` & `title_en` (Data)
  * `slug` $\to$ `slug_fr` & `slug_en` (Data, Indexé)
  * `pole` (Relation ID) $\to$ `pole` (Link $\to$ `Bokengi Pole` résolu par table de correspondance)
  * `item` $\to$ Link $\to$ `Item`
  * `category` $\to$ `category_fr` & `category_en` (Data)
  * `shortDescription` $\to$ `short_description_fr` & `short_description_en` (Small Text)
  * `content` (Lexical) $\to$ `content_fr` & `content_en` (Text Editor / HTML)
  * `technicalTags` (Array) $\to$ Child Table `Bokengi Service Tag` (`tag_name`)
  * `featured` $\to$ `featured` (Check 0/1)
  * `order` $\to$ `display_order` (Int)
  * `status` $\to$ `status` (`Draft` / `Published`)
  * `id` (Payload) $\to$ `custom_payload_id` (Data, Unique, Indexé)

---

#### Étape 5 : Réalisations & Études de cas (`case-studies` $\to$ `Bokengi Case Study`)
* **Champs Principaux :**
  * `title` $\to$ `title_fr` & `title_en` (Data)
  * `slug` $\to$ `slug_fr` & `slug_en` (Data, Indexé)
  * `clientName` $\to$ `client_name` (Data)
  * `category` $\to$ `category_fr` & `category_en` (Data)
  * `summary` $\to$ `summary_fr` & `summary_en` (Small Text)
  * `context` (Lexical) $\to$ `context_fr` & `context_en` (Text / Markdown)
  * `challenge` (Lexical) $\to$ `challenge_fr` & `challenge_en` (Text / Markdown)
  * `solution` (Lexical) $\to$ `solution_fr` & `solution_en` (Text / Markdown)
  * `results` (Lexical) $\to$ `results_fr` & `results_en` (Text / Markdown)
  * `architecture` (Lexical) $\to$ `architecture_fr` & `architecture_en` (Text / Markdown)
  * `publishedDate` $\to$ `published_date` (Date)
  * `featured` $\to$ `featured` (Check 0/1)
  * `status` $\to$ `status` (`Draft` / `Published`)
  * `id` (Payload) $\to$ `custom_payload_id` (Data, Unique, Indexé)
* **Tables Enfants (Child Tables) :**
  * `technologies` (Array) $\to$ Child Table `Bokengi Tech Item` (`tech_name`)
  * `screenshots` (Array) $\to$ Child Table `Bokengi Case Screenshot` (`file_attachment` [Link `File`], `caption_fr`, `caption_en`)

---

#### Étape 6 : Articles d'expertise (`posts` $\to$ `Bokengi Post`)
* **Champs :**
  * `title` $\to$ `title_fr` & `title_en` (Data)
  * `slug` $\to$ `slug_fr` & `slug_en` (Data, Indexé)
  * `excerpt` $\to$ `excerpt_fr` & `excerpt_en` (Small Text)
  * `content` (Lexical) $\to$ `content_fr` & `content_en` (Long Text / Markdown)
  * `author` (Relation ID) $\to$ `author` (Link $\to$ `User` résolu par email)
  * `coverImage` (Relation ID) $\to$ `cover_image` (Link $\to$ `File`)
  * `categories` (Array) $\to$ Child Table `Bokengi Post Category` (`category_name`)
  * `tags` (Array) $\to$ Child Table `Bokengi Post Tag` (`tag_name`)
  * `publishedAt` $\to$ `published_at` (Datetime)
  * `status` $\to$ `status` (`Draft` / `Published`)
  * `seo.title` $\to$ `seo_title_fr` & `seo_title_en` (Data)
  * `seo.description` $\to$ `seo_description_fr` & `seo_description_en` (Small Text)
  * `id` (Payload) $\to$ `custom_payload_id` (Data, Unique, Indexé)

---

#### Étape 8 : Demandes & Prospects CRM (`leads` $\to$ `Lead`)
* **Champs Standards ERPNext :**
  * `firstname` $\to$ `first_name`
  * `lastname` $\to$ `last_name`
  * `email` $\to$ `email_id` (Data, Indexé)
  * `phone` $\to$ `phone` & `mobile_no`
  * `company` $\to$ `company_name`
  * `source` $\to$ `source` (ex: `Website Contact Form`)
  * `status` :
    * `new` $\to$ `Lead Status: Open`
    * `contacted` $\to$ `Lead Status: Contacted`
    * `qualified` $\to$ `Lead Status: Qualified`
    * `converted` $\to$ `Lead Status: Converted`
    * `archived` $\to$ `Lead Status: Do Not Contact`
* **Custom Fields Spécifiques Bokengi :**
  * `custom_request_type` $\to$ `requestType` (`devis`, `cadrage`, `support`, `partenariat`, `autre`)
  * `custom_pole` $\to$ Link $\to$ `Bokengi Pole` (résolu depuis `pole` initial)
  * `custom_treatment_pole` $\to$ Link $\to$ `Bokengi Pole`
  * `custom_priority` $\to$ `priority` (`low`, `medium`, `high`, `urgent`)
  * `custom_message_raw` $\to$ `message` (Text, Immuable)
  * `custom_internal_notes` $\to$ `internalNotes` (Text)
  * `custom_payload_id` $\to$ `id` (Payload)

---

#### Étape 9 : Factures & Devis (`invoices` $\to$ `Quotation` & `Sales Invoice`)
* **Règle de Séparation :**
  * Si `type === 'quote'` $\to$ Création d'un document `Quotation` dans ERPNext.
  * Si `type === 'invoice'` $\to$ Création d'un document `Sales Invoice` dans ERPNext.
  * Si `type === 'credit_note'` $\to$ `Sales Invoice` avec `is_return = 1`.
* **Mapping des Données & Lignes :**
  * `invoiceNumber` $\to$ `custom_invoice_number` & `name` (si nommage manuel forcé)
  * `clientName` / `clientCompany` $\to$ Résolution ou création automatique du `Customer`
  * `issueDate` $\to$ `transaction_date` / `posting_date`
  * `dueDate` $\to$ `due_date`
  * `items` (Array) $\to$ Child Table `items` :
    * `description` $\to$ `item_name` & `description`
    * `quantity` $\to$ `qty`
    * `unitPriceHT` $\to$ `rate`
    * `totalHT` $\to$ `amount`
  * `custom_payload_id` $\to$ `id` (Payload)

---

#### Étape 10 : Demandes d'Accès (`access-requests` $\to$ `Bokengi Access Request`)
* **Champs :**
  * `firstName` $\to$ `first_name`
  * `lastName` $\to$ `last_name`
  * `email` $\to$ `email` (Data, Indexé)
  * `requestedRole` $\to$ `requested_role` (`admin` / `editor`)
  * `justification` $\to$ `justification` (Text)
  * `status` $\to$ `status` (`Pending`, `Approved`, `Rejected`, `Expired`)
  * `assignedRole` $\to$ `assigned_role`
  * `adminNotes` $\to$ `admin_notes` (Text)
  * `processedAt` $\to$ `processed_at` (Datetime)
  * `processedBy` $\to$ Link $\to$ `User`
  * `expiresAt` $\to$ `expires_at` (Datetime)
  * `custom_payload_id` $\to$ `id` (Payload)

---

#### Étape 11 : Paramètres Généraux (`site-settings`, `header`, `footer` $\to$ `Bokengi Site Settings`)
* **Modèle Single DocType ERPNext :**
  * Raison sociale, capital, RCS, SIRET, N° TVA, Email de contact, Téléphone institutionnel.
  * Coordonnées bancaires (IBAN, BIC, Banque).
  * Structure JSON pour la navigation d'en-tête (Header) et les colonnes du Footer.

---

## 5. OUTILLAGE DE MIGRATION & SCRIPT EXTRACTION-TRANSFORMATION-CHARGEMENT (ETL)

Le dossier de script de migration doit être structuré de manière isolée sans interférer avec le build Next.js :

```
scripts/migration/
├── src/
│   ├── config.ts              # Configuration & variables d'environnement
│   ├── db-extractor.ts        # Extraction brute depuis PostgreSQL / Drizzle
│   ├── lexical-parser.ts      # Convertisseur déterministe Lexical AST -> MD/HTML
│   ├── erpnext-api.ts         # Client HTTP REST avec retry & rate-limiting
│   ├── id-mapper.ts           # Gestion de la table de correspondance & journal
│   ├── migrators/
│   │   ├── 01-users.ts
│   │   ├── 02-media.ts
│   │   ├── 03-poles.ts
│   │   ├── 04-services.ts
│   │   ├── 05-case-studies.ts
│   │   ├── 06-posts.ts
│   │   ├── 07-pages.ts
│   │   ├── 08-leads.ts
│   │   ├── 09-invoices.ts
│   │   ├── 10-access-requests.ts
│   │   └── 11-globals.ts
│   └── run-migration.ts       # Orchestrateur central avec CLI flags (--dry-run, --step)
└── package.json
```

---

## 6. CHECKLIST PRÉFLIGHT (CONTRÔLE AVANT MIGRATION RÉELLE)

Cette checklist **DOIT être validée à 100%** avant de déclencher la moindre écriture dans ERPNext :

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        CHECKLIST PRÉFLIGHT OBLIGATOIRE                          │
├───────────────────────────────────────────────────────────┬─────────┬───────────┤
│ Point de Contrôle                                         │ Statut  │ Validé Par│
├───────────────────────────────────────────────────────────┼─────────┼───────────┤
│ 1. Connectivité HTTPS vers ERPNext API opérationnelle     │ [ ]     │           │
│ 2. Clés API (Key/Secret) testées avec succès sur /api/... │ [ ]     │           │
│ 3. Tous les Custom DocTypes Bokengi créés dans ERPNext    │ [ ]     │           │
│ 4. Tous les Custom Fields (custom_payload_id) indexés     │ [ ]     │           │
│ 5. Bucket Cloudflare R2 accessible en lecture/écriture    │ [ ]     │           │
│ 6. Dump PostgreSQL Payload archivé sur support froid      │ [ ]     │           │
│ 7. Espace disque instance ERPNext vérifié (> 20 GB libre) │ [ ]     │           │
│ 8. Mode Dry-Run du script ETL validé à 100% sans erreur   │ [ ]     │           │
│ 9. Table de correspondance d'identifiants initialisée     │ [ ]     │           │
│ 10. Mécanisme de Rollback dynamique opérationnel en local │ [ ]     │           │
└───────────────────────────────────────────────────────────┴─────────┴───────────┘
```

---

## 7. PROTOCOLE DE CONTRÔLE DE PARITÉ & TESTS POST-MIGRATION

Une fois l'import achevé, le script de réconciliation exécute les vérifications automatiques suivantes :

1. **Parité Numérique :**
   * Nombre de Pôles : Payload ($5$) = ERPNext ($5$).
   * Nombre de Services : Payload ($20$) = ERPNext ($20$).
   * Nombre d'Études de cas : Payload ($5$) = ERPNext ($5$).
   * Nombre d'Articles : Payload ($4$) = ERPNext ($4$).
2. **Contrôle d'Intégrité Référentielle :**
   * $100\%$ des Services pointent vers un `Bokengi Pole` valide.
   * $100\%$ des `Lead` pointent vers un `Bokengi Pole` et un `User` valide.
   * $0$ relation orpheline ou clé étrangère nulle non autorisée.
3. **Contrôle d'Empreinte (Checksum SHA-256) :**
   * Le hash SHA-256 des textes et slugs extraits de Payload correspond exactement au hash des champs persistés dans ERPNext.
4. **Validation des Médias :**
   * Test de réponse HTTP 200 sur $100\%$ des `file_url` générées.

---

## 8. MATRICE DE DÉCISION GO / NO-GO

| Critère d'Évaluation | Condition Requise pour le GO | Décision en cas d'Échec |
| :--- | :--- | :--- |
| **Exécution Dry-Run** | 0 exception TypeScript / 0 erreur HTTP 4xx/5xx | **NO-GO Immédiat** |
| **Parité des Données** | $100\%$ des documents source migrés | **NO-GO** (Rejeu de l'étape défaillante) |
| **Intégrité des Liens R2** | $100\%$ des URLs accessibles en public | **NO-GO** |
| **Temps de Réponse API ERPNext** | $< 350\text{ ms}$ par requête unitaire | **NO-GO** (Optimisation des index requise) |

---

## 9. PROCÉDURE OPÉRATIONNELLE DE ROLLBACK PAS-À-PAS

Si une anomalie critique survient après la bascule du Frontend vers ERPNext :

```bash
# 1. BASCULE INSTANTANÉE DU ROUTAGE DYNAMIQUE VERS PAYLOAD (Edge KV)
npx wrangler kv:key put --binding=CONFIG "DATA_SOURCE" "payload"

# 2. PURGE IMMÉDIATE DU CACHE CLOUDFLARE EDGE
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
     -H "Authorization: Bearer ${CF_API_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{"purge_everything":true}'

# 3. VÉRIFICATION IMMÉDIATE DE L'ÉTAT DU SITE
curl -I "https://bokengi-group.com/expertises"
# Doit renvoyer HTTP 200 avec en-tête x-bokengi-source: payload

# 4. GEL DES ÉCRITURES ERPNEXT & ANALYSE DU JOURNAL D'ERREUR
cat migration-journal.json | grep "ERROR"
```

---

PAYLOAD → ERPNEXT — RUNBOOK DE MIGRATION PRÉPARÉ / EN ATTENTE DE VALIDATION
