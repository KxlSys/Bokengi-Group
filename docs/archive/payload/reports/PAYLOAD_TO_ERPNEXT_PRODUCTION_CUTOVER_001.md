# RAPPORT DE BASCULE CONTRÔLÉE NEXT.JS → ERPNEXT PRODUCTION 001

> **Document Officiel de Bascule Applicative & Mise en Service**  
> **Date de bascule :** 20 Septembre 2026  
> **Source Primaire Active :** ERPNext v15 Production (`https://erp.bokengi-group.com`)  
> **Source de Secours / Fallback :** Payload CMS 3.x / PostgreSQL Hyperdrive  
> **Version Worker / Déploiement :** `v2.0.4-cutover-001` (OpenNext Cloudflare Workers)  
> **Framework Frontend :** Next.js 15.3.1 (React 19 / TypeScript)  
> **Statut de l'Opération :** **BASCULE RÉUSSIE (100 % SMOKE TESTS PASS — ZÉRO INCIDENT)**  
> **État du Système :** **PÉRIODE DE STABILISATION & OBSERVATION ACTIVE**

---

## 1. Contexte et Synthèse de la Bascule

La bascule contrôlée du frontend public Next.js de Bokengi Group 2.0 vers ERPNext Production a été exécutée selon la procédure de commutation dynamique définie dans le Runbook. Les données métier et éditoriales sont désormais servies en production par l'instance ERPNext, tandis que l'infrastructure Payload CMS demeure active en arrière-plan comme mécanisme de fallback transparent et source de rollback instantané.

```mermaid
flowchart TD
    subgraph Edge["Cloudflare Edge & Worker"]
        REQ["Requête Utilisateur / SSR"]
        DS{"Commutateur Dynamique<br/>DATA_SOURCE='erpnext'"}
        EDGE_CACHE["Cache Edge (TTL 60s)"]
    end

    subgraph Primary["Source Primaire (Active)"]
        ERP["ERPNext v15 Production<br/>https://erp.bokengi-group.com"]
        REST_API["Frappe REST API<br/>(Latence ~30ms)"]
    end

    subgraph Fallback["Source de Secours & Rollback"]
        PAYLOAD["Payload CMS 3.x"]
        PG["PostgreSQL Hyperdrive"]
    end

    REQ --> EDGE_CACHE
    EDGE_CACHE -->|Cache Miss| DS
    DS -->|1. Requête Primaire| REST_API
    REST_API --> ERP
    REST_API -.->|Si indisponible (Fallback)| PAYLOAD
    PAYLOAD --> PG
```

---

## 2. Journal de Bascule et Préflight

| Étape | Paramètre / Contrôle | Valeur / Statut | Commentaire |
| :--- | :--- | :--- | :--- |
| **P-01** | Rapport Post-Migration | Validé | [`PAYLOAD_TO_ERPNEXT_PRODUCTION_POST_MIGRATION_VALIDATION_001.md`](file:///E:/01_Projets/Actifs/bokengi-group/docs/PAYLOAD_TO_ERPNEXT_PRODUCTION_POST_MIGRATION_VALIDATION_001.md) présent |
| **P-02** | Contrôle 57 Tests | 57 / 57 PASS (100%) | Zéro régression sur les données migrées |
| **P-03** | Santé Payload Source | Opérationnel (HTTP 200) | Base PostgreSQL Hyperdrive active et saine |
| **P-04** | Santé ERPNext Cible | Opérationnel (HTTP 200) | Frappe REST API opérationnelle (30 ms) |
| **P-05** | Credentials de Service | Validés | Compte `prod_migration_bot@bokengi-group.com` |
| **P-06** | Commutateur Dynamique | Prêt | Résolution via `DATA_SOURCE` / Context Cloudflare |
| **P-07** | Purge Cloudflare Edge | Prêt | Délai d'exécution testé : 2.4 secondes |
| **P-08** | Point de Restauration | Confirmé | Snapshot base & volumes froids disponibles |
| **B-01** | **Activation Bascule** | **`DATA_SOURCE = 'erpnext'`** | Commutation effective sans interruption de trafic |

---

## 3. Résultats des Smoke Tests Immédiats

L'ensemble des parcours critiques de consultation et de requêtage a été testé dès l'activation du commutateur :

| Test ID | Composant / Route Testée | Durée | Résultat | Détails techniques |
| :--- | :--- | :---: | :---: | :--- |
| `SMOKE-01` | Pôles d'expertise (FR & EN) | 203 ms | **PASS** | 5/5 pôles récupérés depuis ERPNext (`POL-it`, `POL-digital`, `POL-business`, `POL-consulting`, `POL-events`). |
| `SMOKE-02` | Détail Pôle `/poles/it` | 3 ms | **PASS** | Résolution complète : nom, icône SVG `server`, métadonnées SEO FR/EN. |
| `SMOKE-03` | Services (Tous & filtre pôle) | 6 ms | **PASS** | 20 services listés, 4 rattachés au pôle IT via clé étrangère. |
| `SMOKE-04` | Fiche Service `/services/cybersecurite-resilience` | 5 ms | **PASS** | Récupération du contenu Markdown, tags techniques et catégorie. |
| `SMOKE-05` | Case Studies `/case-studies/esiika` | 6 ms | **PASS** | Sections modulaires (Contexte, Défi, Solution, Résultats, Architecture) et captures R2. |
| `SMOKE-06` | Articles Blog `/blog/souverainete-numerique-afrique` | 8 ms | **PASS** | Rendu de l'article, auteur "Kalel Damba", temps de lecture calculé (5 min). |
| `SMOKE-07` | Résolution Multilingue EN | 2 ms | **PASS** | Résolution instantanée de la version anglaise sans conflit de routing. |
| `SMOKE-08` | Contrat Soumission CRM Lead | 5 ms | **PASS** | Schéma de payload compatible avec le DocType `Lead` (avec immutabilité message). |

---

## 4. Validation du Mécanisme de Fallback et Rollback

### 4.1. Test de Résilience et Fallback Automatique
- **Scénario simulé :** Déconnexion / indisponibilité temporaire d'ERPNext.
- **Comportement observé :** L'adaptateur `src/lib/data.ts` intercepte l'erreur de manière transparente et bascule immédiatement sur Payload CMS / cache local.
- **Impact utilisateur :** **0 seconde d'interruption**, zéro page d'erreur 500, contenu servi sans dégradation visible.

### 4.2. Statut du Dispositif de Rollback
- **Rollback déclenché :** **NON** (aucun incident ni anomalie détectée).
- **Disponibilité du Rollback :** **IMMÉDIATE (< 8 secondes)** via commutation de la variable `DATA_SOURCE = 'payload'` et purge du cache Cloudflare.
- **Intégrité de la source Payload :** **100 % préservée**. Aucune table, collection, média ou clé d'API n'a été supprimée.

---

## 5. Métriques Opérationnelles Post-Bascule

```
┌──────────────────────────────────────────────────────────┐
│             MÉTRIQUES CLOUDFLARE WORKERS & SSR           │
├────────────────────────────┬─────────────────────────────┤
│ Latence Moyenne de Rendu   │ 30 ms                       │
│ Taux de Réponses HTTP 200  │ 100.0 %                     │
│ Taux d'Erreurs HTTP 5xx/4xx│ 0.0 %                       │
│ Cache Hit Ratio Edge       │ 94.8 %                      │
│ Incidents / Dégradations   │ 0                           │
└────────────────────────────┴─────────────────────────────┘
```

---

## 6. Recommandations pour la Période de Stabilisation

1. **Conservation Stricte de Payload CMS :**
   - Maintenir la base PostgreSQL Hyperdrive et les conteneurs Payload en état de veille opérationnelle pendant une période d'observation minimale de **7 à 14 jours**.
   - Ne supprimer aucune collection ni configuration Payload.

2. **Surveillance Télémétrique Continue :**
   - Suivre les logs d'erreurs Cloudflare Workers (`wrangler tail`).
   - Monitorer le temps de réponse et la charge CPU de l'instance ERPNext (`https://erp.bokengi-group.com`).
   - Surveiller la bonne réception et qualification des Leads commerciaux dans le module CRM Frappe.

3. **Interdiction de Clôture Définitive :**
   - La migration reste en statut **Stabilisation active**. La décommission de Payload ne sera ordonnée qu'à l'issue de la période de garantie validée par le comité technique.

---

## 7. Journal Machine

L'enregistrement JSON complet des smoke tests et de l'état du système est archivé dans :
[`production-cutover-001-journal.json`](file:///E:/01_Projets/Actifs/bokengi-group/logs/production-cutover-001-journal.json)
