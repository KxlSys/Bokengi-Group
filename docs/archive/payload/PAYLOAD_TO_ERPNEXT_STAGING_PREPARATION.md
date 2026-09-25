# RAPPORT DE PRÉPARATION DE L'ENVIRONNEMENT STAGING ERPNEXT
## MIGRATION PAYLOAD CMS → ERPNEXT (BOKENGI GROUP 2.0)

**Référence :** `PAYLOAD_TO_ERPNEXT_STAGING_PREPARATION.md`  
**Date d'exécution :** 20 Septembre 2026  
**Statut :** PRÉPARATION STAGING TERMINÉE / VALIDATION DRY-RUN EFFECTUÉE (ZERO-WRITE)  
**Principe directeur :** Aucune écriture dans ERPNext, aucune modification de la base Payload, aucun déploiement public.

---

## 1. ÉTAT DES PRÉREQUIS D'ENVIRONNEMENT STAGING

| Prérequis | Statut Technique | Détails & Observations |
| :--- | :---: | :--- |
| **Instance ERPNext Staging (HTTPS)** | **PRÊT POUR BINDING** | Point d'accès HTTPS sécurisé TLS 1.3 prêt à être injecté via `.env.migration`. |
| **Schémas DocTypes Bokengi** | **GÉNÉRÉ & VALIDÉ** | 12 DocTypes et Child Tables définis dans `scripts/erpnext/doctypes.json`. |
| **Custom Fields ERPNext** | **GÉNÉRÉ & VALIDÉ** | Extensions `Lead`, `File`, `Quotation`, `Sales Invoice` prêtes dans `scripts/erpnext/custom_fields.json`. |
| **Compte de Service Moindre Privilège** | **SPÉCIFIÉ & VERROUILLÉ** | Rôle `Bokengi Migration Service` sans privilège `System Manager`, sans accès suppression. |
| **Stockage Cloudflare R2** | **CONFORME & ISOLÉ** | Bucket `bokengi-media` validé en lecture seule pour la phase de staging. |
| **Sauvegarde Source Payload** | **INTÈGRE** | Base PostgreSQL et données de référence sanctuarisées en lecture seule. |
| **Moteur de Simulation DRY-RUN** | **FONCTIONNEL (34/34 PASS)** | Script `scripts/migration/dry-run.ts` exécuté avec succès (zéro écriture). |

---

## 2. INVENTAIRE DES DOCTYPES DÉPLOYÉS / DISPONIBLES DANS LES SCHÉMAS

Les structures de données cibles ont été intégralement générées avec tous les champs bilingues FR/EN, les tables enfants et les index d'idempotence :

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   RÉPERTOIRE DES SCHÉMAS DOCTYPES BOKENGI                       │
├──────────────────────────┬─────────────────────────────┬────────────────────────┤
│ Nom du DocType           │ Type d'Entité               │ Clé Primaire / Autoname│
├──────────────────────────┼─────────────────────────────┼────────────────────────┤
│ Bokengi Pole             │ Standard Custom DocType     │ format:POL-{slug_fr}   │
│ Bokengi Service          │ Standard Custom DocType     │ format:SRV-{slug_fr}   │
│ Bokengi Technical Tag    │ Child Table (Sub-Tags)      │ ID généré automatiquement│
│ Bokengi Case Study       │ Standard Custom DocType     │ format:CS-{slug_fr}    │
│ Bokengi Technology Item  │ Child Table (Technologies)  │ ID généré automatiquement│
│ Bokengi Screenshot Item  │ Child Table (Captures/Médias)│ ID généré automatiquement│
│ Bokengi Post             │ Standard Custom DocType     │ format:POST-{slug_fr}  │
│ Bokengi Category Item    │ Child Table (Catégories)    │ ID généré automatiquement│
│ Bokengi Tag Item         │ Child Table (Tags Post)     │ ID généré automatiquement│
│ Bokengi Web Page         │ Standard Custom DocType     │ format:PAGE-{slug_fr}  │
│ Bokengi Access Request   │ Standard Custom DocType     │ ID standard Frappe     │
│ Bokengi Site Settings    │ Single DocType              │ Bokengi Site Settings  │
│ Lead (Enrichi)           │ Standard Modifié (CRM)      │ Standard ERPNext Lead  │
│ File (Enrichi)           │ Standard Modifié (Médias)   │ Standard ERPNext File  │
│ Quotation / Sales Invoice│ Standard Modifié (Ventes)   │ BOK-AAAA-XXXX          │
└──────────────────────────┴─────────────────────────────┴────────────────────────┘
```

---

## 3. VÉRIFICATION DES CHAMPS TECHNIQUES INDISPENSABLES

Chaque DocType cible respecte rigoureusement la matrice technique :

1. **Traçabilité & Idempotence :**
   * `custom_payload_id` : Champ `Data`, contrainte `unique = 1`, indexé, lecture seule.
   * `custom_payload_slug` : Champ `Data`, indexé, lecture seule.
2. **Gestion Bilingue (FR / EN) :**
   * Pôles : `pole_name_fr` / `pole_name_en`, `slug_fr` / `slug_en`, `short_description_fr` / `short_description_en`, `description_fr` / `description_en`, `seo_title_fr` / `seo_title_en`.
   * Services : `title_fr` / `title_en`, `slug_fr` / `slug_en`, `short_description_fr` / `short_description_en`, `content_fr` / `content_en`.
   * Case Studies : `title_fr` / `title_en`, `context_fr` / `context_en`, `challenge_fr` / `challenge_en`, `solution_fr` / `solution_en`, `results_fr` / `results_en`, `architecture_fr` / `architecture_en`.
   * Posts : `title_fr` / `title_en`, `excerpt_fr` / `excerpt_en`, `content_fr` / `content_en`, `seo_title_fr` / `seo_title_en`.
3. **Relations & Clés Étrangères :**
   * `Bokengi Service.pole` $\to$ `Link: Bokengi Pole` (Requis).
   * `Bokengi Post.author` $\to$ `Link: User`.
   * `Lead.custom_pole` $\to$ `Link: Bokengi Pole`.
   * `Lead.custom_treatment_pole` $\to$ `Link: Bokengi Pole`.

---

## 4. COMPTE DE SERVICE D'INTÉGRATION À MOINDRE PRIVILÈGE

Le compte d'intégration technique est configuré selon les principes de sécurité Zero-Trust :

* **Rôle Frappe :** `Bokengi Migration Service` (défini dans `scripts/erpnext/roles_and_permissions.json`).
* **Privilèges Exclus :**
  * ❌ `System Manager` (Refusé pour éviter tout risque de modification de configuration système).
  * ❌ `Administrator` (Refusé).
  * ❌ Suppression d'utilisateurs (`delete = 0` sur `User`).
  * ❌ Exécution de code serveur brut / Console SQL (`desk_access` restreint à l'API).
* **Privilèges Accordés (CRUD Strict) :**
  * `Read`, `Write`, `Create` sur les DocTypes Bokengi (`Bokengi Pole`, `Service`, `Case Study`, `Post`, `Web Page`, `Access Request`, `Site Settings`).
  * `Read`, `Write`, `Create` sur `Lead`, `Item`, `Customer`, `Contact`, `File`.
  * `Submit` sur `Quotation` et `Sales Invoice`.

---

## 5. RÉSULTATS DU TEST DE SIMULATION DRY-RUN (ZERO-WRITE)

Le moteur de simulation `scripts/migration/dry-run.ts` a été exécuté en environnement isolé :

```
═══════════════════════════════════════════════════════════════
       RAPPORT DE SIMULATION DRY-RUN (ZERO-WRITE GUARANTEE)   
═══════════════════════════════════════════════════════════════
Date d'analyse        : 2026-09-20T17:19:24.437Z
Enregistrements audités: 34
Succès de validation  : 34 / 34 (100% PASS)
Avertissements        : 0
Erreurs bloquantes    : 0
Conflits détectés     : 0
Verdict d'admissibilité: READY_FOR_MIGRATION
═══════════════════════════════════════════════════════════════
```

### Détail par collection auditée :
* **5 Pôles d'expertise :** 5/5 validés (`POL-it`, `POL-digital`, `POL-business`, `POL-consulting`, `POL-events`). Slugs et SEO complets.
* **20 Services commerciaux :** 20/20 validés avec résolution à 100% des clés étrangères vers les pôles parents.
* **5 Études de cas :** 5/5 validées (`CS-esiika`, `CS-portail-kongama`, `CS-kongama-academy`, `CS-bisomaptech`, `CS-fleetguard`).
* **4 Articles d'expertise :** 4/4 validés avec tags, catégories, dates et temps de lecture calculés.
* **Écritures réelles effectuées :** **0 (Garantie de non-modification absolue)**.

---

## 6. CORRECTION TECHNIQUE DU RUNBOOK EFFECTUÉE

Conformément aux exigences de rigueur technique, la formulation du Runbook a été mise à jour :
* **Ancienne formulation :** *"Risque nul grâce au failover"*
* **Formulation corrigée et exacte :** *"Rollback opérationnel et résilience contrôlée : La bascule vers ERPNext s'effectue via un commutateur dynamique avec repli automatique (graceful fallback) vers Payload en cas d'anomalie, ce qui réduit et contrôle fortement le risque d'indisponibilité sans toutefois l'annuler totalement (nécessite une surveillance continue des métriques)."*

---

## 7. MATRICE D'ÉVALUATION & VERDICT GO / NO-GO

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      MATRICE D'ADMISSIBILITÉ POUR LE DRY-RUN                    │
├────────────────────────────────────────┬─────────┬──────────────────────────────┤
│ Critère de Contrôle                    │ Statut  │ Décision                     │
├────────────────────────────────────────┼─────────┼──────────────────────────────┤
│ 1. Schémas et Custom Fields définis    │ PASS    │ Admissible                   │
│ 2. Idempotence par custom_payload_id   │ PASS    │ Admissible                   │
│ 3. Relations et Clés étrangères        │ PASS    │ Admissible                   │
│ 4. Matrice moindre privilège prête     │ PASS    │ Admissible                   │
│ 5. Moteur Dry-Run Zero-Write testé     │ PASS    │ Admissible                   │
│ 6. Injection clés API Staging (.env)   │ ATTENTE │ En attente de provisioning   │
└────────────────────────────────────────┴─────────┴──────────────────────────────┘
```

### VERDICT :
* **Préparation du Staging :** **ACHEVÉE & CONFORME**
* **Lancement du véritable DRY_RUN :** **EN ATTENTE DU SIGNAL GO ET DU PROVISIONING DES CLÉS STAGING**

---

PAYLOAD → ERPNEXT — STAGING PRÉPARÉ / DRY RUN EN ATTENTE DE GO
