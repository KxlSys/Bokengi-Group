# PLAN TECHNIQUE DE CONCEPTION : MIGRATION PAYLOAD CMS → ERPNEXT
**Projet :** Bokengi Group Web (Plateforme Corporate, Offres & CRM)  
**Version du document :** 1.0.0 — Validé pour implémentation  
**Statut de l'étape :** Conception technique détaillée (Phase pré-opératoire — Aucun code applicatif modifié, aucune donnée migrée)  
**Date :** 20 Septembre 2026  

---

## 1. ÉTAT ACTUEL DU SYSTÈME

### 1.1 Architecture en Place
La plateforme web de Bokengi Group repose sur :
* **Frontend :** Next.js 16.3.3 (App Router, React 19, Server Components), packagé pour Cloudflare Workers via OpenNext (`@opennextjs/cloudflare` 1.20.6).
* **Internationalisation d'interface :** Architecture dynamique sous `src/app/(frontend)/[locale]/` supportant `/fr` et `/en`, balise dynamique `<html lang={locale}>`, SEO alternates `hreflang`, et un dictionnaire de 319 clés strictement appairées (`src/i18n/dictionaries/fr.ts` et `en.ts`).
* **Couche CMS / Données :** Payload CMS 3.88.0 adossé à une base PostgreSQL (Drizzle ORM / Hyperdrive) avec configuration de localisation `locales: ['fr', 'en']`, `defaultLocale: 'fr'`, et **`fallback: false`** strict.
* **Médiathèque :** Stockage objet Cloudflare R2 (`MEDIA_BUCKET`) via le plugin `@payloadcms/storage-r2`.
* **Couche de secours (Offline/Build) :** Jeu de données de référence synchronisé dans `src/data/bokengi-seed-data.ts` et interrogé par `src/lib/data.ts`.

### 1.2 Inventaire Réel des Entités et Données

| Entité Payload | Type | Enregistrements réels | Statut Bilingue FR / EN | Relations existantes |
| :--- | :--- | :---: | :---: | :--- |
| **`poles`** | Collection | 5 | 100% FR / 100% EN | Lié à 20 Services, Lié à Leads (`pole`, `treatmentPole`) |
| **`services`** | Collection | 20 (4 / pôle) | 100% FR / 100% EN | Rattaché à 1 Pôle obligatoire (`poleSlug`) |
| **`case-studies`** | Collection | 5 | 100% FR / 100% EN | Technologies (Array), Screenshots (`media`) |
| **`posts`** | Collection | 4 (3 pub., 1 draft) | 100% FR / 100% EN | Auteur (`users`), Image de couverture (`media`) |
| **`categories`** | Sous-structure | 8 catégories | 100% FR / 100% EN | Intégrées dans les Posts |
| **`pages`** | Collection | 0 (réservoir vide) | N/A | Les 12 pages courantes sont dans l'App Router |
| **`media`** | Collection | 0 DB / 18 assets publics | N/A | Bucket Cloudflare R2 actif |
| **`leads`** | Collection | 0 seed (dynamique) | Non localisé | 9 champs prospect immuables, workflow interne |
| **`invoices`** | Collection | 0 seed (dynamique) | Non localisé | Lié à Leads, items comptables HT/TVA/TTC |
| **`access-requests`**| Collection | 0 seed (dynamique) | Non localisé | Sas d'accès collaborateurs vers `users` |
| **`users`** | Collection | 1 (Super Admin ID 1) | Non localisé | Compte sanctuarisé |
| **`site-settings`** | Global | 1 | Non localisé | Données d'entreprise, bancaires, domaines |
| **`header` / `footer`**| Globals | 2 | Géré par i18n UI | Menus et liens de navigation |

---

## 2. ARCHITECTURE CIBLE ERPNEXT

### 2.1 Principes Directeurs
1. **ERPNext comme Cœur Unique de Vérité :**
   ERPNext prend en charge à la fois la gestion opérationnelle (CRM, Prospects, Clients, Devis, Factures, Gestion des Services) et la diffusion éditoriale Headless (Pôles, Catalogue de services, Réalisations, Articles techniques, Paramètres d'entreprise).
2. **Sanctuarisation de l'I18N Frontend :**
   Les **319 clés d'interface statiques** (boutons, labels, navigation, footers, statuts d'erreur) restent hébergées dans Next.js pour garantir un rendu SSR ultra-rapide sans latence réseau.
3. **Restitution Headless Découplée :**
   Next.js consomme les données dynamiques via l'API REST / RPC de Frappe/ERPNext (`/api/method/...`), avec revalidation ISR et mise en cache au niveau de Cloudflare Workers.
4. **Conservation Intégrale de la Règle "Zéro Masquage" :**
   Si une traduction anglaise d'un contenu éditorial n'est pas saisie dans ERPNext, l'API renvoie explicitement `null` ou déclenche la bannière de traduction manquante dans le composant, sans masquer silencieusement le manque par du contenu français.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PUBLIC NEXT.JS                         │
│  - Routage dynamique /[locale]/ (FR et EN)                            │
│  - 319 clés d'interface locales (dictionnaires légers)                 │
│  - Rendu SSR / ISR sur Cloudflare Workers (OpenNext)                  │
└───────────────────▲────────────────────────────────▲───────────────────┘
                    │                                │
    Contenus éditoriaux & CRM (REST)      Assets binaires (CDN / Direct)
                    │                                │
┌───────────────────┴────────────────────────┐ ┌─────┴──────────────────┐
│              ERPNEXT / FRAPPE              │ │     CLOUDFLARE R2      │
│  - CRM & Leads (Immutabilité stricte)      │ │  - Bucket d'images HD  │
│  - Facturation & Devis (Sales Invoice)     │ │  - Documents PDF       │
│  - Catalogue d'offres (Item & Services)    │ │  - Screenshots projets │
│  - CMS Headless Bilingue (Side-by-Side)    │ └────────────────────────┘
└────────────────────────────────────────────┘
```

---

## 3. MAPPING COMPLET PAYLOAD → ERPNEXT

| Collection / Global Payload | Entité Cible ERPNext | Nature du Modèle | Justification Technique & Métier |
| :--- | :--- | :--- | :--- |
| **`poles`** | **`Bokengi Pole`** | **Custom DocType** | Le DocType standard `Department` d'ERPNext ne gère ni les icônes SVG, ni les accroches marketing, ni les structures bilingues et SEO. `Bokengi Pole` contient les champs de vitrine et pointe vers le `Department` standard. |
| **`services`** | **`Item`** + **`Bokengi Service`** | **Standard + Custom** | Tout service facturable dans ERPNext **doit obligatoirement être un `Item`** (`is_service_item: 1`). Le DocType compagnon `Bokengi Service` porte les attributs vitrine (titre bilingue, livrables, tags, SEO). |
| **`case-studies`** | **`Bokengi Case Study`** | **Custom DocType** | Aucun DocType standard ERPNext ne modélise une étude de cas d'ingénierie (architecture, problématique, solution, technologies, métriques d'impact). |
| **`posts`** | **`Bokengi Post`** | **Custom DocType** | Le `Blog Post` Frappe standard est monolingue et limité. Un DocType dédié garantit une structure bilingue "Side-by-Side" avec révision éditoriale. |
| **`pages`** | **`Bokengi Page`** | **Custom DocType** | Réservoir pour pages institutionnelles futures personnalisées. |
| **`media`** | **`File`** | **Standard Frappe** | Indexe les URLs Cloudflare R2 dans ERPNext (`file_url`, `is_private: 0`) sans dupliquer le stockage binaire sur le serveur ERP. |
| **`leads`** | **`Lead`** | **Standard étendu** | DocType natif du CRM ERPNext, enrichi par des Custom Fields pour sanctuariser les 9 champs immuables et le double pôle (demandé vs traitement). |
| **`invoices`** | **`Sales Invoice`** & **`Quotation`** | **Standards ERPNext** | Cœur financier natif d'ERPNext : fiscalité, devises, lignes d'articles, génération PDF officielle et grand livre comptable. |
| **`access-requests`**| **`Bokengi Access Request`** | **Custom DocType** | Sas de validation avant création/habilitation d'un `User` Frappe. |
| **`users`** | **`User`** | **Standard ERPNext** | Comptes collaborateurs avec rôles RBAC (`System Manager`, `Bokengi Editor`, `Bokengi Sales`). |
| **`site-settings`** | **`Company`** & **`Bokengi Settings`** | **Standard + Single** | Données fiscales/bancaires dans `Company` ; paramètres de domaines et réseaux sociaux dans un DocType Single `Bokengi Settings`. |
| **`header` / `footer`**| **Dictionnaires Next.js** | **Code / UI** | Maintenus dans le code Next.js (statique, zéro latence). |

---

## 4. MODÈLE DE DONNÉES DÉTAILLÉ DANS ERPNEXT

### 4.1 Approche Multilingue "Side-by-Side" (Justification)
Dans Frappe/ERPNext, deux approches sont envisageables pour le multilingue :
1. *Deux documents distincts reliés par un champ parent/enfant :* Rejeté car source d'incohérences de clés étrangères (un service pointerait vers la version FR ou EN du pôle de façon ambiguë).
2. *Champs jumeaux explicites au sein du même document (Retenu) :*
   Chaque entité possède ses attributs `_fr` et `_en`.
   * **Avantages majeurs :**
     * Clé primaire technique unique (`slug` ou `custom_payload_id`) préservée.
     * Les relations inter-entités sont parfaitement univoques.
     * Édition simultanée FR/EN sur le même écran dans le Desk ERPNext.
     * Consommation simple par l'API : l'endpoint filtre et retourne le bloc demandé selon le paramètre `?locale=fr|en`.

---

### 4.2 Spécification des DocTypes Personnalisés

#### A. DocType `Bokengi Pole`
* **Module :** Bokengi Core
* **Naming :** Field `slug` (ex: `it`, `digital`, `business`, `consulting`, `events`)
* **Champs :**
  * `custom_payload_id` (Data, Unique, Read Only)
  * `slug` (Data, Unique, Required)
  * `icon` (Data, ex: `server`, `code`, `trending-up`, `compass`, `calendar`)
  * `order` (Int, Default: 0)
  * `status` (Select: `Draft`, `Published`, Default: `Published`)
  * `department` (Link $\rightarrow$ `Department`, Optionnel pour liaison comptable)
  * **Section Contenu FR :**
    * `pole_name_fr` (Data, Required)
    * `short_description_fr` (Small Text, Required)
    * `description_fr` (Text Editor / HTML, Required)
    * `domains_fr` (Data)
    * `seo_title_fr` (Data)
    * `seo_description_fr` (Small Text)
  * **Section Contenu EN :**
    * `pole_name_en` (Data, Required)
    * `short_description_en` (Small Text, Required)
    * `description_en` (Text Editor / HTML, Required)
    * `domains_en` (Data)
    * `seo_title_en` (Data)
    * `seo_description_en` (Small Text)

#### B. DocType `Bokengi Service`
* **Module :** Bokengi Catalog
* **Naming :** Field `slug` (ex: `cybersecurite-resilience`)
* **Champs :**
  * `custom_payload_id` (Data, Unique, Read Only)
  * `slug` (Data, Unique, Required)
  * `pole` (Link $\rightarrow$ `Bokengi Pole`, Required)
  * `item_code` (Link $\rightarrow$ `Item`, Optionnel mais requis pour facturation)
  * `featured` (Check, Default: 0)
  * `order` (Int, Default: 0)
  * `status` (Select: `Draft`, `Published`)
  * `technical_tags` (Table $\rightarrow$ `Bokengi Technical Tag`)
  * **Section FR :**
    * `service_title_fr` (Data, Required)
    * `category_fr` (Data)
    * `short_description_fr` (Small Text)
    * `content_fr` (Text Editor / HTML)
    * `seo_title_fr` (Data)
    * `seo_description_fr` (Small Text)
  * **Section EN :**
    * `service_title_en` (Data, Required)
    * `category_en` (Data)
    * `short_description_en` (Small Text)
    * `content_en` (Text Editor / HTML)
    * `seo_title_en` (Data)
    * `seo_description_en` (Small Text)

#### C. DocType Enfant `Bokengi Technical Tag`
* **Champs :** `tag_name` (Data, Required)

#### D. DocType `Bokengi Case Study`
* **Module :** Bokengi Portfolio
* **Naming :** Field `slug` (ex: `esiika`, `portail-kongama`, `fleetguard`)
* **Champs :**
  * `custom_payload_id` (Data, Unique, Read Only)
  * `slug` (Data, Unique, Required)
  * `client_name` (Data)
  * `customer` (Link $\rightarrow$ `Customer`, Optionnel)
  * `project` (Link $\rightarrow$ `Project`, Optionnel)
  * `published_date` (Date)
  * `featured` (Check, Default: 0)
  * `status` (Select: `Draft`, `Published`)
  * `technologies` (Table $\rightarrow$ `Bokengi Technology Item`)
  * `screenshots` (Table $\rightarrow$ `Bokengi Screenshot Item`)
  * **Section FR :**
    * `title_fr` (Data, Required)
    * `category_fr` (Data)
    * `summary_fr` (Small Text)
    * `context_fr` (Text Editor / HTML)
    * `challenge_fr` (Text Editor / HTML)
    * `solution_fr` (Text Editor / HTML)
    * `results_fr` (Text Editor / HTML)
    * `architecture_fr` (Text Editor / HTML)
    * `seo_title_fr` (Data)
    * `seo_description_fr` (Small Text)
  * **Section EN :**
    * `title_en` (Data, Required)
    * `category_en` (Data)
    * `summary_en` (Small Text)
    * `context_en` (Text Editor / HTML)
    * `challenge_en` (Text Editor / HTML)
    * `solution_en` (Text Editor / HTML)
    * `results_en` (Text Editor / HTML)
    * `architecture_en` (Text Editor / HTML)
    * `seo_title_en` (Data)
    * `seo_description_en` (Small Text)

#### E. DocTypes Enfants Portfolio
* `Bokengi Technology Item` : `technology_name` (Data)
* `Bokengi Screenshot Item` : `image_url` (Data / Attach), `caption_fr` (Data), `caption_en` (Data)

#### F. DocType `Bokengi Post`
* **Module :** Bokengi Editorial
* **Naming :** Field `slug`
* **Champs :**
  * `custom_payload_id` (Data, Unique, Read Only)
  * `slug` (Data, Unique, Required)
  * `author` (Link $\rightarrow$ `User`)
  * `author_name_override` (Data)
  * `cover_image` (Attach / Data URL)
  * `published_at` (Datetime)
  * `status` (Select: `Draft`, `Published`)
  * `reading_time_minutes` (Int)
  * `categories` (Table $\rightarrow$ `Bokengi Category Item`)
  * `tags` (Table $\rightarrow$ `Bokengi Tag Item`)
  * **Section FR :**
    * `title_fr` (Data, Required)
    * `excerpt_fr` (Small Text)
    * `content_fr` (Text Editor / HTML)
    * `seo_title_fr` (Data)
    * `seo_description_fr` (Small Text)
  * **Section EN :**
    * `title_en` (Data, Required)
    * `excerpt_en` (Small Text)
    * `content_en` (Text Editor / HTML)
    * `seo_title_en` (Data)
    * `seo_description_en` (Small Text)

---

## 5. MIGRATION DES MÉDIAS ET GESTION CLOUDFLARE R2

### 5.1 Analyse du Stockage R2 Existant
Actuellement, Payload CMS stocke les fichiers binaires dans Cloudflare R2 (`MEDIA_BUCKET`).
Les visuels sont identifiés par leur nom de fichier canonique et servis publiquement via le CDN (ex: `https://bokengi-group.com/media/...` ou domaine R2 associé).

### 5.2 Stratégie d'Intégration dans ERPNext
1. **Aucun déplacement binaire inutile :**
   Les fichiers binaires restent hébergés sur Cloudflare R2 pour préserver les performances Edge mondiales et ne pas saturer l'espace disque du serveur ERPNext.
2. **Indexation dans Frappe `File` :**
   Pour chaque média, un document `File` est créé dans Frappe avec :
   * `file_name` : Nom du fichier (ex: `og-image.png`).
   * `file_url` : URL absolue publique R2 (`https://...`).
   * `is_private` : `0` (Fichier public).
   * `attached_to_doctype` / `attached_to_name` : Liaison à l'article ou cas client associé.
3. **Maintien des Métadonnées Bilingues :**
   Des Custom Fields sont ajoutés sur `File` :
   * `custom_alt_fr` (Data)
   * `custom_alt_en` (Data)
   * `custom_caption_fr` (Small Text)
   * `custom_caption_en` (Small Text)

---

## 6. MIGRATION DU CRM (LEADS & PROSPECTS)

### 6.1 Conservation Stricte de l'Immutabilité
Le modèle CRM Bokengi audité et validé garantit que les soumissions des prospects ne peuvent pas être falsifiées par les opérateurs. Dans ERPNext, ce comportement est répliqué via les mécanismes natifs de Frappe :

```text
DocType Lead (Standard ERPNext) + Custom Fields Bokengi :
├── CHAMPS PROSPECT ORIGINAUX (Strictement Read Only après insertion)
│   ├── first_name (Prénom)
│   ├── last_name (Nom)
│   ├── company_name (Organisation)
│   ├── email_id (Email professionnel)
│   ├── mobile_no / phone (Téléphone)
│   ├── custom_request_type (Select: devis, cadrage, partenariat, autre)
│   ├── custom_requested_pole (Link -> Bokengi Pole : 'it', 'digital', etc.)
│   ├── source (Website)
│   └── custom_original_message (Text : Description brute du projet)
└── CHAMPS DE TRAITEMENT COMMERCIAL (Modifiables par les équipes Bokengi)
    ├── status (Lead, Open, Contacted, Qualified, Converted, Archived)
    ├── custom_priority (Low, Medium, High, Urgent)
    ├── custom_treatment_pole (Link -> Bokengi Pole : Pôle opérationnel assigné)
    ├── lead_owner (Link -> User : Collaborateur assigné)
    └── notes (Table de suivi commercial / comptes-rendus)
```

### 6.2 Contrôle d'Intégrité par Script Serveur Frappe
Un Server Script (ou Hook Python) `validate_bokengi_lead_immutability` est configuré sur l'événement `before_save` du DocType `Lead` :
* Interdiction formelle de modifier les 9 champs originaux dès lors que `doc.is_new()` est faux.
* Rejet avec exception HTTP 403 / `frappe.PermissionError` en cas de tentative d'altération.
* Déclenchement non-bloquant de la notification email Resend / alertes ERPNext.

---

## 7. MIGRATION DE LA FACTURATION & DEVIS

### 7.1 Séparation Étanche : Historique vs Flux Opérationnels
Dans Payload, la collection `invoices` a servi à la fois de registre d'expérimentation et de pièces comptables. Dans ERPNext :

1. **Devis (`type == 'quote'`) $\rightarrow$ DocType `Quotation` :**
   * Migrés comme devis rattachés au prospect (`party_name = Lead`).
   * Conservation des statuts : `Draft` (Brouillon), `Open` (Envoyé), `Lost` (Annulé), `Ordered` (Converti).
2. **Factures émises (`type == 'invoice'`) $\rightarrow$ DocType `Sales Invoice` :**
   * Les pièces historiques déjà payées sont injectées avec `docstatus: 1` (Soumis) et écritures de paiement associées, sans recalculer rétroactivement la numérotation légale.
   * `custom_payload_id` enregistre l'ancien numéro Payload (`BOK-2026-XXXX`).
   * Champ `naming_series` standard configuré pour les futures pièces : `BOK-.YYYY.-.####`.
3. **Lignes d'articles (`items`) :**
   * Chaque ligne est rattachée à son `Item` standard ERPNext, avec quantité, prix unitaire HT, code taxe TVA (20% par défaut) et totaux vérifiés au centime près.

---

## 8. GESTION DES IDENTIFIANTS ET IDEMPOTENCE

### 8.1 Clé Unique de Migration : `custom_payload_id`
Pour que la migration puisse être répétée à l'infini sans créer de doublons (idempotence totale) :
* Chaque DocType ERPNext comporte le champ `custom_payload_id` (Data, Indexé, Unique).
* Le script de migration effectue un `upsert` :
  ```python
  # Exemple de logique d'ingestion idempotente
  existing = frappe.db.get_value("Bokengi Service", {"custom_payload_id": payload_id}, "name")
  if existing:
      doc = frappe.get_doc("Bokengi Service", existing)
      doc.update(mapped_data)
      doc.save(ignore_permissions=True)
  else:
      doc = frappe.get_doc({"doctype": "Bokengi Service", **mapped_data})
      doc.insert(ignore_permissions=True)
  ```

---

## 9. API REST ET COUCHE D'INTÉGRATION FRONTEND

### 9.1 Endpoints Whitelistés dans ERPNext (Module `bokengi.api`)
Des méthodes Python dédiées et optimisées sont exposées sur ERPNext :

```python
# bokengi/api.py
import frappe

@frappe.whitelist(allow_guest=True)
def get_poles(locale='fr'):
    """Retourne les 5 pôles publiés dans la langue spécifiée."""
    poles = frappe.get_all(
        "Bokengi Pole",
        filters={"status": "Published"},
        fields=["name", "slug", "icon", "order",
                f"pole_name_{locale} as name",
                f"short_description_{locale} as shortDescription",
                f"description_{locale} as description",
                f"domains_{locale} as domains",
                f"seo_title_{locale} as seo_title",
                f"seo_description_{locale} as seo_description"],
        order_by="order asc"
    )
    return poles

@frappe.whitelist(allow_guest=True)
def get_services(pole_slug=None, locale='fr'):
    """Retourne les services publiés filtrés par pôle."""
    filters = {"status": "Published"}
    if pole_slug:
        filters["pole"] = pole_slug
    return frappe.get_all(
        "Bokengi Service",
        filters=filters,
        fields=["slug", "pole", "featured", "order",
                f"service_title_{locale} as title",
                f"category_{locale} as category",
                f"short_description_{locale} as shortDescription",
                f"content_{locale} as content"],
        order_by="order asc"
    )

@frappe.whitelist(allow_guest=True)
def get_case_studies(featured=False, locale='fr'):
    """Retourne les réalisations publiées."""
    filters = {"status": "Published"}
    if featured:
        filters["featured"] = 1
    return frappe.get_all(
        "Bokengi Case Study",
        filters=filters,
        fields=["slug", "client_name as clientName", "published_date as publishedDate",
                f"title_{locale} as title",
                f"category_{locale} as category",
                f"summary_{locale} as summary",
                f"context_{locale} as context",
                f"challenge_{locale} as challenge",
                f"solution_{locale} as solution",
                f"results_{locale} as results",
                f"architecture_{locale} as architecture"]
    )
```

### 9.2 Mapping des Fonctions de `src/lib/data.ts`
Dans la future phase d'implémentation, les fonctions TypeScript de `src/lib/data.ts` seront adaptées pour appeler ces endpoints de façon transparente :

| Fonction TypeScript | Appel Actuel | Futur Appel ERPNext |
| :--- | :--- | :--- |
| `getPoles(locale)` | `payload.find({ collection: 'poles' })` | `fetch(`${ERPNEXT_URL}/api/method/bokengi.api.get_poles?locale=${locale}`)` |
| `getPoleBySlug(slug, locale)` | `payload.find({ where: { slug } })` | `fetch(`${ERPNEXT_URL}/api/method/bokengi.api.get_pole_by_slug?slug=${slug}&locale=${locale}`)` |
| `getServices(pole, locale)` | `payload.find({ collection: 'services' })`| `fetch(`${ERPNEXT_URL}/api/method/bokengi.api.get_services?pole_slug=${pole}&locale=${locale}`)` |
| `getCaseStudies(feat, locale)`| `payload.find({ collection: 'case-studies' })`| `fetch(`${ERPNEXT_URL}/api/method/bokengi.api.get_case_studies?featured=${feat}&locale=${locale}`)` |
| `getPosts(filter, locale)` | `payload.find({ collection: 'posts' })` | `fetch(`${ERPNEXT_URL}/api/method/bokengi.api.get_posts?locale=${locale}`)` |
| Formulaire Contact Leads | `POST /api/leads` $\rightarrow$ Payload DB | `POST /api/leads` $\rightarrow$ `POST ${ERPNEXT_URL}/api/resource/Lead` |

---

## 10. STRATÉGIE DE BASCULE EN 4 PHASES

```mermaid
graph LR
    subgraph PHASE A
        A1[Payload Actif] --> A2[Jeu de données synchronisé]
    end

    subgraph PHASE B
        B1[Création Schémas ERPNext] --> B2[Migration contrôlée par script]
        B2 --> B3[Vérification parité 100%]
    end

    subgraph PHASE C
        C1[Double écriture Leads] --> C2[Bascule de lecture vers ERPNext]
        C2 --> C3[Période d'observation 14j]
    end

    subgraph PHASE D
        D1[Export SQL & Snapshot Payload] --> D2[Retrait dépendances code]
        D2 --> D3[ERPNext Source Unique Finale]
    end

    PHASE A --> PHASE B
    PHASE B --> PHASE C
    PHASE C --> PHASE D
```

### Phase A : Préparation (État Actuel)
* Payload CMS reste la source active.
* Le code TypeScript et les tests i18n 10/10 et CRM 27/27 sont au vert.
* Aucune interruption de service.

### Phase B : Migration Contrôlée et Ingestion
* Création de l'application Frappe personnalisée `bokengi_core` et déploiement des DocTypes cibles.
* Exécution du script d'ingestion des 5 pôles, 20 services, 5 réalisations et 4 publications.
* **Critère d'achèvement de Phase B :**
  * 100% des entités présentes dans ERPNext.
  * Checksums SHA-256 stricts des contenus FR et EN identiques entre Payload et ERPNext.

### Phase C : Double-Écriture et Bascule de Lecture
* L'endpoint Next.js `/api/leads` effectue la double écriture (Payload + ERPNext).
* `src/lib/data.ts` bascule ses lectures sur l'API ERPNext, tout en conservant le fallback sur `bokengi-seed-data.ts`.
* **Période d'observation :** 14 jours sans divergence ni anomalie.

### Phase D : Décommissionnement de Payload
* Export d'un dump PostgreSQL complet et snapshot d'archive de Payload.
* Suppression de l'arborescence `/admin` et des packages `@payloadcms/*` dans `package.json`.
* Recompilation finale du Cloudflare Worker (réduction estimée de 40% du bundle OpenNext).

---

## 11. TESTS DE NON-RÉGRESSION ET PLAN DE VALIDATION

La validation de la migration exigera le succès formel des jalons suivants :

1. **Validation Métrique des Volumes :**
   * 5 Pôles exactement dans ERPNext.
   * 20 Services exactement dans ERPNext (4 rattachés par pôle).
   * 5 Case Studies exactement dans ERPNext.
   * 4 Posts (3 publiés, 1 draft) exactement dans ERPNext.
2. **Validation Bilingue FR / EN :**
   * 0 chaîne manquante en anglais ou en français lors du rendu SSR Next.js.
   * Balises canoniques et alternates `hreflang` générées à l'identique.
   * URLs stables (`/fr/expertises/it` et `/en/expertises/it` fonctionnels).
3. **Validation CRM & Immutabilité :**
   * Soumission d'un prospect via `/api/leads` $\rightarrow$ Lead créé dans ERPNext.
   * Tentative de modification du prénom ou du message d'origine $\rightarrow$ Rejet strict 403.
   * Modification du pôle de traitement interne $\rightarrow$ Validation réussie.
4. **Validation de Build & Performance :**
   * `pnpm exec tsc --noEmit` : 0 erreur.
   * `pnpm run build` : 42 pages statiques générées avec succès.
   * `pnpm run build:worker` : OpenNext bundle généré avec succès.

---

## 12. PROCÉDURE DE REPLI D'URGENCE (ROLLBACK)

Tant que la Phase D n'est pas actée, un retour arrière instantané est garanti :

1. **Mécanisme par Variable d'Environnement :**
   `src/lib/data.ts` intègre une variable de commutation :
   ```typescript
   const CMS_BACKEND = process.env.CMS_BACKEND || 'erpnext' // 'erpnext' | 'payload' | 'seed'
   ```
2. **Déclenchement du Rollback :**
   En cas d'indisponibilité ou d'erreur sur l'instance ERPNext :
   * Bascule immédiate de la variable d'environnement : `CMS_BACKEND=payload`.
   * Reconnexion instantanée à la base Payload sans modification de code ni réécriture de base.
3. **Sanctuaire de Secours (Offline Data) :**
   Si la base de données distante est inaccessible, le fallback natif sur `src/data/bokengi-seed-data.ts` assure la continuité opérationnelle du site à 100%.

---

## 13. CRITÈRES DE DÉCOMMISSIONNEMENT DÉFINITIF DE PAYLOAD

Payload ne pourra être retiré du dépôt Git qu'aux conditions cumulatives suivantes :

* [ ] 100% des données éditoriales et de catalogue vérifiées dans ERPNext.
* [ ] 100% des relations Pôles $\leftrightarrow$ Services $\leftrightarrow$ Case Studies validées sans aucune référence orpheline.
* [ ] Zéro régression linguistique constatée sur les 42 routes publiques Next.js.
* [ ] Formulaire de contact public connecté et opérationnel vers le CRM ERPNext.
* [ ] 14 jours consécutifs de fonctionnement sans incident en Phase C.
* [ ] Dump d'archive chiffré de la base de données PostgreSQL de Payload déposé sur stockage froid sécurisé.
* [ ] Validation formelle de la Direction Technique Bokengi Group.

---

## 14. ORDRE D'EXÉCUTION CHRONOLOGIQUE (RUNBOOK)

Lors de la prochaine étape (Phase d'Exécution), les opérations seront menées dans cet ordre précis :

1. **Étape 1 :** Déploiement des DocTypes Bokengi dans ERPNext (Définition JSON des schémas Frappe).
2. **Étape 2 :** Script d'ingestion des 5 Pôles (`Bokengi Pole`).
3. **Étape 3 :** Script d'ingestion des 20 Services (`Bokengi Service` + `Item`).
4. **Étape 4 :** Indexation des Médias R2 (`File` Frappe).
5. **Étape 5 :** Script d'ingestion des 5 Case Studies (`Bokengi Case Study`).
6. **Étape 6 :** Script d'ingestion des 4 Articles (`Bokengi Post`).
7. **Étape 7 :** Déploiement des endpoints de consultation `bokengi.api` dans ERPNext.
8. **Étape 8 :** Branchement de la double écriture sur `/api/leads`.
9. **Étape 9 :** Adaptation du client d'accès aux données dans `src/lib/data.ts`.
10. **Étape 10 :** Recettage global, validation des tests et bascule définitive.

---

*Ce document constitue le plan de référence officiel pour la transition Payload CMS vers ERPNext de Bokengi Group.*
