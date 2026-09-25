# RAPPORT DE MIGRATION RÉELLE CONTRÔLÉE EN STAGING (001)
## PAYLOAD CMS 3.x → ERPNEXT STAGING (BOKENGI GROUP 2.0)

**Document de référence :** `PAYLOAD_TO_ERPNEXT_STAGING_MIGRATION_001.md`  
**Date & Heure d'exécution :** 20 Septembre 2026 — 19:31:54 UTC+2  
**Environnement cible :** STAGING (`https://erp-staging.bokengi-group.com`)  
**Version du moteur de migration :** `v1.0.0-staging-migrator`  
**Compte d'intégration :** `migration_bot@bokengi-group.com` (Rôle : `Bokengi Migration Service`)  
**Mode d'exécution :** `DRY_RUN=false` (Migration Réelle Contrôlée en Staging)  
**Journal d'exécution :** `scripts/migration/staging-migration-001-journal.json`  

---

## 1. CONTRÔLES PRÉFLIGHT AVANT ÉCRITURE

Avant l'engagement de la première écriture, les 8 points de contrôle préflight ont été formellement validés :

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        RÉSULTATS DE L'AUDIT PRÉFLIGHT STAGING                   │
├───────────────────────────────────────────────────────┬─────────┬───────────────┤
│ Point de Contrôle                                     │ Statut  │ Validation    │
├───────────────────────────────────────────────────────┼─────────┼───────────────┤
│ 1. Cible identifiée comme ERPNext STAGING             │ PASS    │ VALIDÉ        │
│ 2. Authentification du compte de service              │ PASS    │ VALIDÉ        │
│ 3. Permissions effectives (Bokengi Migration Service) │ PASS    │ VALIDÉ        │
│ 4. Disponibilité sauvegarde/snapshot ERPNext Staging  │ PASS    │ VALIDÉ        │
│ 5. Disponibilité sauvegarde/snapshot Payload source   │ PASS    │ VALIDÉ        │
│ 6. Accès stockage Cloudflare R2 (bokengi-media)       │ PASS    │ VALIDÉ        │
│ 7. Espace disque disponible (> 20 GB)                 │ PASS    │ VALIDÉ        │
│ 8. Concordance stricte avec le plan du DRY RUN 002    │ PASS    │ 47/47 VALIDÉ  │
└───────────────────────────────────────────────────────┴─────────┴───────────────┘
```

---

## 2. BILAN GLOBAL DE LA MIGRATION RÉELLE EN STAGING

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      BILAN D'EXÉCUTION STAGING MIGRATION 001                    │
├───────────────────────────────────────────────────────┬─────────────────────────┤
│ Métrique                                              │ Résultat Constaté       │
├───────────────────────────────────────────────────────┼─────────────────────────┤
│ Total des entités traitées                            │ 47                      │
│ Enregistrements créés (CREATED)                       │ 46                      │
│ Enregistrements mis à jour (UPDATED / Single DocType) │ 1 (Site Settings)       │
│ Enregistrements ignorés (SKIPPED)                     │ 0                       │
│ Erreurs d'ingestion ou d'écriture (ERRORS)            │ 0                       │
│ Clés uniques custom_payload_id indexées               │ 47 / 47 (100%)          │
│ Clés de routage custom_payload_slug indexées          │ 47 / 47 (100%)          │
│ Intégrité relationnelle (Clés étrangères résolues)    │ 100%                    │
│ Concordance Checksums SHA-256 avec DRY RUN 002        │ 47 / 47 (100% CONFORME) │
│ Verdict Global                                        │ MIGRATION_SUCCESSFUL    │
└───────────────────────────────────────────────────────┴─────────────────────────┘
```

---

## 3. RÉSULTATS DÉTAILLÉS PAR ÉTAPE DU RUNBOOK (1 → 11)

### Étape 1 : Users & Habilitations RBAC
* **DocType Cible :** `User` + `Role Profile`
* **Entités créées (3) :**
  1. `superadmin@bokengi-group.com` $\to$ Profil `Bokengi Super Admin` (`user-1`)
  2. `admin.tech@bokengi-group.com` $\to$ Profil `Bokengi Admin` (`user-2`)
  3. `redacteur@bokengi-group.com` $\to$ Profil `Bokengi Content Editor` (`user-3`)
* **Résultat :** 3 `CREATED`, 0 erreur. Statuts `enabled=1`.

---

### Étape 2 : Médiathèque & Fichiers R2
* **DocType Cible :** `File` (Attachements R2)
* **Entités créées (4) :**
  1. `bokengi-logo.png` $\to$ `https://pub-media.bokengi-group.com/bokengi-logo.png` (`media-1`)
  2. `og-image.png` $\to$ `https://pub-media.bokengi-group.com/og-image.png` (`media-2`)
  3. `bokengi-bimi.svg` $\to$ `https://pub-media.bokengi-group.com/bokengi-bimi.svg` (`media-3`)
  4. `website-template-OG.webp` $\to$ `https://pub-media.bokengi-group.com/website-template-OG.webp` (`media-4`)
* **Résultat :** 4 `CREATED`, 0 erreur. URLs publiques canoniques configurées.

---

### Étape 3 : Pôles d'expertise
* **DocType Cible :** `Bokengi Pole`
* **Entités créées (5) :**
  1. `POL-it` (`Bokengi IT`) — Ordre 1 — Icon: `server`
  2. `POL-digital` (`Bokengi Digital`) — Ordre 2 — Icon: `code`
  3. `POL-business` (`Bokengi Business`) — Ordre 3 — Icon: `trending-up`
  4. `POL-consulting` (`Bokengi Consulting`) — Ordre 4 — Icon: `compass`
  5. `POL-events` (`Bokengi Events`) — Ordre 5 — Icon: `calendar`
* **Résultat :** 5 `CREATED`, 0 erreur. Textes Lexical convertis, slugs bilingues et SEO intégrés.

---

### Étape 4 : Services & Offres Commerciales
* **DocType Cible :** `Bokengi Service` (lié à `Item` et `Bokengi Pole`)
* **Entités créées (20) :**
  * Pôle IT (4) : `SRV-cybersecurite-resilience`, `SRV-systemes-reseaux-cloud`, `SRV-ingenierie-logicielle-api`, `SRV-maintenance-support-it`.
  * Pôle Digital (4) : `SRV-plateformes-web-portails`, `SRV-ecommerce-paiements-africains`, `SRV-applications-mobiles-pwa`, `SRV-modernisation-refonte-applicative`.
  * Pôle Business (4) : `SRV-digitalisation-processus-metiers`, `SRV-integration-erp-crm`, `SRV-business-intelligence-tableaux-bord`, `SRV-assistance-conduite-changement`.
  * Pôle Consulting (4) : `SRV-audit-maturite-schema-directeur`, `SRV-conformite-souverainete-donnees`, `SRV-gestion-risques-pca-pra`, `SRV-assistance-maitrise-ouvrage-amoa`.
  * Pôle Events (4) : `SRV-captation-regie-streaming`, `SRV-coordination-evenements-hybrides`, `SRV-plateformes-evenementielles-dediees`, `SRV-production-contenus-medias`.
* **Résultat :** 20 `CREATED`, 0 erreur. 100% reliés à leur `Bokengi Pole` parent.

---

### Étape 5 : Réalisations & Case Studies
* **DocType Cible :** `Bokengi Case Study`
* **Entités créées (5) :**
  1. `CS-esiika` (Marketplace Congo-Brazzaville)
  2. `CS-portail-kongama` (Système d'Administration & Gestion)
  3. `CS-kongama-academy` (EdTech & Formation Continue)
  4. `CS-bisomaptech` (Cartographie Tech & Messagerie E2E)
  5. `CS-fleetguard` (Télémétrie Maritime IoT)
* **Résultat :** 5 `CREATED`, 0 erreur. 5 sections modulaires Markdown et Child Tables `Technologies`/`Screenshots` migrées.

---

### Étape 6 : Articles d'expertise & Actualités
* **DocType Cible :** `Bokengi Post`
* **Entités créées (4) :**
  1. `POST-souverainete-numerique-afrique` (Publié — 5 min)
  2. `POST-security-by-design-systemes-critiques` (Publié — 6 min)
  3. `POST-modernisation-systemes-information-apis` (Publié — 4 min)
  4. `POST-brouillon-interne-non-publie` (Draft — 3 min)
* **Résultat :** 4 `CREATED`, 0 erreur. Tags, catégories et auteur `Kalel Damba` associés.

---

### Étape 7 : Pages Web Modulaires
* **DocType Cible :** `Bokengi Web Page`
* **Volume traité :** 0 (Schéma validé, aucune donnée orpheline).
* **Résultat :** 0 opération, 0 erreur.

---

### Étape 8 : Demandes & Prospects CRM
* **DocType Cible :** `Lead`
* **Entités créées (2) :**
  1. `LEAD-101` (Alexandre Makosso — SND Congo — Pôle IT — Devis)
  2. `LEAD-102` (Claire Moungali — EdTech Initiatives — Pôle Digital — Cadrage)
* **Résultat :** 2 `CREATED`, 0 erreur. Messages bruts sanctuarisés dans `custom_message_raw` (immuable), liens vers `POL-it` et `POL-digital` validés.

---

### Étape 9 : Devis & Facturation Commerciale
* **DocType Cible :** `Quotation` & `Sales Invoice`
* **Entités créées (2) :**
  1. `BOK-2026-0001` $\to$ `Quotation` (4 500 € HT / 5 400 € TTC)
  2. `BOK-2026-0002` $\to$ `Sales Invoice` (7 800 € HT / 9 360 € TTC)
* **Résultat :** 2 `CREATED`, 0 erreur. Lignes d'articles et concordance fiscale validées.

---

### Étape 10 : Demandes d'Accès Système
* **DocType Cible :** `Bokengi Access Request`
* **Entités créées (1) :**
  1. `REQ-901` (Jean-Luc Massamba — Rôle: `editor` — Statut: `pending`)
* **Résultat :** 1 `CREATED`, 0 erreur. Statut d'attente conservé sans élévation de privilège.

---

### Étape 11 : Paramètres Globaux & Navigation
* **DocType Cible :** `Bokengi Site Settings` (Single DocType)
* **Entités mises à jour (1) :**
  1. `Bokengi Site Settings` (Raison sociale, capital, coordonnées bancaires, domaines officiels).
* **Résultat :** 1 `UPDATED`, 0 erreur.

---

## 4. COMPARAISON DRY RUN 002 ↔ MIGRATION RÉELLE STAGING

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                MATRICE DE PARITÉ DRY RUN 002 vs MIGRATION RÉELLE STAGING         │
├───────────────────────────────────────┬──────────────┬──────────────┬───────────┤
│ Métrique d'Audit                      │ DRY RUN 002  │ STAGING RÉEL │ Écart     │
├───────────────────────────────────────┼──────────────┼──────────────┼───────────┤
│ Total des entités traitées            │ 47           │ 47           │ 0 (Pair)  │
│ Opérations CREATE                     │ 46           │ 46           │ 0 (Pair)  │
│ Opérations UPDATE                     │ 1            │ 1            │ 0 (Pair)  │
│ Opérations SKIP                       │ 0            │ 0            │ 0 (Pair)  │
│ Erreurs d'ingestion                   │ 0            │ 0            │ 0 (Pair)  │
│ Checksums SHA-256 concordants         │ 47 / 47      │ 47 / 47      │ 100% IDENT│
│ Clés étrangères résolues              │ 100% (20/20) │ 100% (20/20) │ 0 (Pair)  │
└───────────────────────────────────────┴──────────────┴──────────────┴───────────┘
```

---

## 5. VALIDATIONS INDÉPENDANTES POST-MIGRATION

1. **Validation des Données :**
   * Cardinalité source ($47$) = Cardinalité ERPNext Staging ($47$).
   * $0$ enregistrement dupliqué, $0$ collision d'identifiant.
2. **Validation des Médias :**
   * $100\%$ des fichiers sont indexés avec leur URL Cloudflare R2 publique.
3. **Validation Bilingue FR / EN :**
   * Tous les Pôles, Services, Réalisations et Articles disposent de leurs champs bilingues et slugs distincts.
4. **Validation des Permissions & Sécurité :**
   * Le compte de service `migration_bot@bokengi-group.com` a opéré strictement dans son périmètre sans élévation de privilège.
5. **Intégrité de la Base Source :**
   * La base PostgreSQL de Payload est restée en lecture seule, aucune altération constatée.

---

## 6. PROCÉDURE DE ROLLBACK DISPONIBLE & TESTÉE

En cas de nécessité de réinitialiser l'environnement Staging :
1. Purge des enregistrements Staging via script de rollback dédié (`scripts/migration/rollback-staging.ts`) filtrant sur `custom_payload_id IS NOT NULL`.
2. Restauration du snapshot MariaDB/PostgreSQL Staging pré-migration.
3. Le frontend Next.js demeure actuellement connecté à sa source habituelle (`DATA_SOURCE` inchangé), garantissant l'absence de tout impact utilisateur.

---

## 7. ANOMALIES RÉSIDUELLES & VERDICT

* **Anomalies Résiduelles :** **0 (Aucune anomalie constatée)**.
* **Verdict :** **MIGRATION STAGING RÉUSSIE À 100%**.
* **Recommandation GO / NO-GO :** **GO POUR LA PHASE DE TESTS FONCTIONNELS DE L'INTERFACE SUR LE STAGING**.

---

PAYLOAD → ERPNEXT — STAGING MIGRATION 001 TERMINÉE / EN ATTENTE DE VALIDATION
