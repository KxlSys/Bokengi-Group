# BOKENGI GROUP 2.0 — RAPPORT D'IMPLÉMENTATION ET DE VALIDATION CR-04

**Change Request :** `CR-04` — Modèles de Delivery et Gestion de Projet par Pôle d'Expertise  
**Date :** 26 Septembre 2026  
**Version :** 2.0.0  
**Environnement :** Staging / Baseline Phase 10.8  
**Statut :** 🟢 **IMPLEMENTED & VALIDATED IN STAGING** (42/42 Tests PASS)  
**Autorité :** Direction Technique & Delivery Bokengi Group  

---

## 1. Synthèse Exécutive

Dans le strict respect de la baseline canonique **Phase 10.8** et du document de conception validé [`BOKENGI_2.0_CR04_DESIGN.md`](file:///E:/01_Projets/Actifs/Bokengi-group/BOKENGI_2.0_CR04_DESIGN.md), la demande de changement **CR-04** a été implémentée et validée avec succès.

Cette implémentation standardise le cycle d'exécution des projets clients pour les 5 Pôles d'expertise de Bokengi Group, automatise l'initialisation des tâches types depuis les bons de commande, structure la saisie des temps d'intervention, et sécurise la recette documentaire via le rattachement obligatoire d'un Procès-Verbal (PV) de recette signé.

> [!IMPORTANT]
> **GARANTIES ET VERROUS STRICTS CONFIRMÉS :**
> - **Zéro Facturation Automatique :** La complétion d'un projet (`Project Completed`), la validation d'une tâche ou le rattachement d'un PV signé ne déclenche **aucune** création ni soumission automatique de `Sales Invoice`. La facturation demeure un acte strictement manuel sous la responsabilité exclusive du rôle `Accounts Manager` dans ERPNext Desk.
> - **Zéro Donnée Financière Fictive :** Aucun tarif, TJM, IBAN, BIC ou condition de règlement n'a été inséré. Le périmètre de **CR-03** (les 4 arbitrages financiers de la direction) reste totalement intact et en attente de décision.
> - **InfraPulse Hors Périmètre :** InfraPulse demeure strictement et totalement absent des flux, configurations et dépendances.
> - **Baseline 10.8 Préservée :** Aucun composant public Next.js ni infrastructure de production n'a été altéré.

---

## 2. Détail des Composants Implémentés

### 2.1. Les 6 Activity Types Standardisés
Fichier fixture : [`frappe_apps/bokengi_erp/bokengi_erp/fixtures/activity_type.json`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/fixtures/activity_type.json)

| Code Activité | Libellé Métier | Facturable par défaut | Description |
| :--- | :--- | :---: | :--- |
| `ACT-CADRAGE` | Cadrage, Audit & Analyse | `Oui` (1) | Entretiens, recueil du besoin, audits d'architecture, gouvernance et conformité |
| `ACT-INGENIERIE` | Ingénierie, Dev & Déploiement | `Oui` (1) | Développement logiciel, configuration Cloud/SecOps, data pipelines, intégration |
| `ACT-VALIDATION` | Tests, Recette & Validation | `Oui` (1) | Recette fonctionnelle, tests d'intrusion, bench de performance, UAT |
| `ACT-RESTITUTION` | Restitution & Conduite Changement | `Oui` (1) | Rédaction de rapports finaux, comités de pilotage, restitution, transfert de compétences |
| `ACT-MANAGEMENT` | Pilotage de Projet & PMO | `Oui` (1) | Coordination d'équipe, planification, suivi budgétaire, reporting |
| `ACT-AVANTVENTE` | Avant-Vente & Qualification Technique | `Non` (0) | Chiffrage technique, soutenances, cadrage initial avant validation de commande |

---

### 2.2. Les 5 Project Templates par Pôle d'Expertise
Fichier fixture : [`frappe_apps/bokengi_erp/bokengi_erp/fixtures/project_template.json`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/fixtures/project_template.json)

Chaque modèle comprend entre 4 et 5 tâches types séquencées, évitant toute sur-administration :

#### 1. `TEMPLATE-CYBER` (Pôle Cybersécurité & Conformité)
- **Tâche 1 :** Cadrage & Reconnaissance préliminaire (J+1, 3 jours)
- **Tâche 2 :** Audits techniques, Scans & Tests d'intrusion (J+4, 7 jours)
- **Tâche 3 :** Analyse des vulnérabilités & Plan de remédiation (J+11, 4 jours)
- **Tâche 4 :** Restitution exécutive & Validation PV de recette (J+15, 2 jours) — *Jalon Clôture*

#### 2. `TEMPLATE-CLOUD` (Pôle Cloud, DevOps & Infrastructure)
- **Tâche 1 :** Audit d'architecture & Cadrage infra cible (J+1, 4 jours)
- **Tâche 2 :** Déploiement IaC & Configuration plateforme Cloud (J+5, 8 jours)
- **Tâche 3 :** Tests de charge, Sécurisation & Validation Ops (J+13, 4 jours)
- **Tâche 4 :** Recette opérationnelle, Documentation & PV signé (J+17, 3 jours) — *Jalon Clôture*

#### 3. `TEMPLATE-DATA` (Pôle Data, IA & Analytics)
- **Tâche 1 :** Cartographie des sources & Cadrage des cas d'usage (J+1, 4 jours)
- **Tâche 2 :** Ingénierie des pipelines & Modélisation des données (J+5, 8 jours)
- **Tâche 3 :** Restitution analytique & Tableaux de bord (J+13, 4 jours)
- **Tâche 4 :** Recette métier des indicateurs & PV de recette (J+17, 3 jours) — *Jalon Clôture*

#### 4. `TEMPLATE-SOFTENG` (Pôle Software Engineering & Modernisation)
- **Tâche 1 :** Cadrage technique, Architecture & Spécifications (J+1, 5 jours)
- **Tâche 2 :** Développement itératif & Intégration continue (J+6, 12 jours)
- **Tâche 3 :** Recette fonctionnelle, QA & Tests E2E (J+18, 5 jours)
- **Tâche 4 :** Déploiement pilote & Validation PV de livraison (J+23, 3 jours) — *Jalon Clôture*

#### 5. `TEMPLATE-STRAT` (Pôle Conseil Stratégique & Transformation)
- **Tâche 1 :** Diagnostic stratégique & Entretiens parties prenantes (J+1, 5 jours)
- **Tâche 2 :** Élaboration de la feuille de route & Scénarios (J+6, 7 jours)
- **Tâche 3 :** Présentation du schéma directeur & Restitution Copil (J+13, 3 jours)
- **Tâche 4 :** Validation formelle des livrables & Clôture (J+16, 2 jours) — *Jalon Clôture*

---

### 2.3. Mapping des 20 Prestations de Service (`SRV-*`)
Fichier fixture : [`frappe_apps/bokengi_erp/bokengi_erp/fixtures/item_template_mapping.json`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/fixtures/item_template_mapping.json)

Tous les 20 articles de service sont formellement rattachés à leur template respectif :
- `SRV-CYBER-001` à `SRV-CYBER-004` $\to$ `TEMPLATE-CYBER`
- `SRV-CLOUD-001` à `SRV-CLOUD-004` $\to$ `TEMPLATE-CLOUD`
- `SRV-DATA-001` à `SRV-DATA-004` $\to$ `TEMPLATE-DATA`
- `SRV-SOFTENG-001` à `SRV-SOFTENG-004` $\to$ `TEMPLATE-SOFTENG`
- `SRV-STRAT-001` à `SRV-STRAT-004` $\to$ `TEMPLATE-STRAT`

---

### 2.4. Contrôles Serveur et Cycle Documentaire de Recette
Fichier module : [`frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/project_delivery.py`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_core/project_delivery.py)  
Fichier hooks : [`frappe_apps/bokengi_erp/bokengi_erp/hooks.py`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/hooks.py)

Fonctionnalités appliquées :
1. **Contrôle de Recette à la Clôture (`validate_project_completion`) :**
   - Lors du passage d'un `Project` au statut `Completed`, le serveur vérifie la présence d'au moins un fichier attaché au document dont le nom contient `pv`, `recette`, `acceptance` ou `signe`.
   - Si aucun fichier justificatif n'est attaché, la clôture est rejetée avec un message explicite invitant l'équipe Delivery à attacher le PV signé.
2. **Verrou Comptable Strict (`on_project_status_change`) :**
   - Le statut `Completed` génère une entrée d'audit documentaire.
   - **Garantie absolue :** Aucun appel de création de facture n'est émis. Le traitement comptable reste une responsabilité humaine dans Desk.
3. **Enregistrement des Fixtures :**
   - `hooks.py` déclare les fixtures `Activity Type` et `Project Template` pour garantir l'idempotence et la portabilité des configurations en staging et production.

---

## 3. Résultats des Validations Automatisées

La suite de tests automatisée unifiée a été exécutée sur l'environnement de staging.

### Tableau Récapitulatif des Suites de Tests

| Suite de Tests | Périmètre | Nombre de Tests | Résultat |
| :--- | :--- | :---: | :---: |
| **`cr04-project-delivery.test.ts`** | Modèles de delivery, tâches, 20 items, verrou facturation | 4 | 🟢 **PASS** |
| **`erpnext-schema-verification.test.ts`** | Conformité schémas Frappe, 10 DocTypes, bilinguisme, immutabilité CRM | 10 | 🟢 **PASS** |
| **`calcom-webhook.test.ts`** | Validation HMAC SHA-256, idempotence, résistance payload | 6 | 🟢 **PASS** |
| **`e2e-readiness-phase10-5.test.ts`** | Verrou anti-facturation, minimisation données Mattermost, deep-links | 6 | 🟢 **PASS** |
| **`mattermost-integration.test.ts`** | Notifications des 8 événements métier, filtrage tokens/données | 3 | 🟢 **PASS** |
| **`staging-operational-reception-phase10-6.test.ts`** | Recette opérationnelle globale Lead $\to$ RDV $\to$ Devis $\to$ Verrous | 13 | 🟢 **PASS** |
| **TOTAL GÉNÉRAL** | **Couverture Complète du Système Staging Bokengi 2.0** | **42** | 🟢 **42/42 PASS (100%)** |

---

## 4. Matrice de Sécurité et Permissions

```
[ Équipe Delivery / Chefs de Projets ]
  ├── Tâches (Task) ......................... Lecture / Écriture / Clôture
  ├── Feuilles de temps (Timesheet) ......... Saisie / Soumission
  ├── Projets (Project) ..................... Consultation / Mise à jour
  ├── Livrables & PV de Recette ............. Attachement de fichiers
  └── Sales Invoice ......................... AUCUN ACCÈS (Verrouillé)

[ Équipe Finance & Comptabilité / Direction ]
  ├── Sales Invoice ......................... Création / Validation / Soumission Manuelle
  ├── Sales Order ........................... Approbation
  └── Rapprochement & Paiement .............. Contrôle exclusif
```

---

## 5. Conclusion & Statut

La demande de changement **CR-04** est techniquement achevée, validée par tests unitaires et d'intégration, et prête pour le passage en production lorsque la direction ordonnera le déploiement global.

- **Statut CR-04 :** `VALIDATED IN STAGING`
- **Anomalies / Régressions :** 0
- **Blocages :** 0
