# BOKENGI GROUP 2.0 — RAPPORT D'IMPLÉMENTATION ET VALIDATION CR-01

**Demande de Changement :** `CR-01` — Activation de la Mesure d'Audience Éthique (Umami Analytics)  
**Date :** 26 Septembre 2026  
**Version :** 2.0.0 — Staging Validation  
**Statut Officiel :** 🟢 **VALIDATED IN STAGING** (Prêt pour passage en production sur accord)  
**Classification :** Rapport de Configuration & Recette Technique  

---

## 1. Synthèse de l'Implémentation

Conformément aux instructions et à l'obtention du site sur Umami Cloud, la configuration d'**Umami Analytics** a été mise en place sans altérer la façade publique Next.js ni le code métier transactionnel.

L'intégration réutilise le composant existant [`src/components/bokengi/UmamiAnalytics.tsx`](file:///E:/01_Projets/Actifs/Bokengi-group/src/components/bokengi/UmamiAnalytics.tsx) et respecte le mécanisme de rendu conditionnel asynchrone non-bloquant.

> [!IMPORTANT]
> **GARANTIE DE SÉCURITÉ ET PRIVACY :**
> - **Zéro Cookie Tiers :** Aucun cookie de pistage, aucune bannière intrusive obligatoire.
> - **Zéro Donnée Personnelle :** Aucune adresse IP stockée, aucun identifiant personnel.
> - **Étanchéité ERPNext / Finance :** Découplage strict avec le Business Core MariaDB et les données financières.
> - **InfraPulse Hors Périmètre :** Totalement absent de toute configuration ou dépendance.
> - **Déploiement en Production :** Non exécuté immédiatement (en attente de l'autorisation formelle du propriétaire).

---

## 2. Fichiers Modifiés et Variables Configurées

### A. Fichiers Modifiés
1. [`src/components/bokengi/UmamiAnalytics.tsx`](file:///E:/01_Projets/Actifs/Bokengi-group/src/components/bokengi/UmamiAnalytics.tsx) : Mise à jour de l'URL par défaut du tracker vers le endpoint Umami Cloud officiel (`https://cloud.umami.is/script.js`).
2. [`wrangler.jsonc`](file:///E:/01_Projets/Actifs/Bokengi-group/wrangler.jsonc) : Déclaration des variables d'environnement Cloudflare Workers.
3. [`.env.example`](file:///E:/01_Projets/Actifs/Bokengi-group/.env.example) : Mise à jour du template d'environnement.
4. [`tests/unit/cr01-umami-analytics.test.ts`](file:///E:/01_Projets/Actifs/Bokengi-group/tests/unit/cr01-umami-analytics.test.ts) : Création de la suite de tests dédiée CR-01.
5. [`tests/int/umami-analytics.int.spec.tsx`](file:///E:/01_Projets/Actifs/Bokengi-group/tests/int/umami-analytics.int.spec.tsx) : Synchronisation des assertions de test d'intégration.
6. [`BOKENGI_2.0_CHANGE_REQUEST_CATALOG.md`](file:///E:/01_Projets/Actifs/Bokengi-group/BOKENGI_2.0_CHANGE_REQUEST_CATALOG.md) : Mise à jour du statut vers `VALIDATED IN STAGING`.

### B. Variables Configurées
| Variable | Valeur Configurée | Rôle |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_UMAMI_ENABLED` | `true` | Active l'injection conditionnelle du tracker dans le Layout |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | `ebaf55dd-ba11-448c-97cb-d744953375d3` | Identifiant officiel du site Bokengi Group sur Umami Cloud |
| `NEXT_PUBLIC_UMAMI_SRC` | `https://cloud.umami.is/script.js` | URL officielle du script Umami Cloud |

---

## 3. Résultats des Tests et Validation en Staging

La suite unifiée de tests automatisés a été exécutée :

| Suite de Tests | Périmètre | Nb Tests | Résultat |
| :--- | :--- | :---: | :---: |
| **`cr01-umami-analytics.test.ts`** | Injection conditionnelle, Website ID, URL Cloud, Privacy | 5 | 🟢 **PASS** |
| **`cr04-project-delivery.test.ts`** | Modèles de delivery, tâches, PV signé, verrou financier | 7 | 🟢 **PASS** |
| **`erpnext-schema-verification.test.ts`** | 10 DocTypes, bilinguisme, immutabilité CRM | 10 | 🟢 **PASS** |
| **`calcom-webhook.test.ts`** | Validation HMAC SHA-256, idempotence | 6 | 🟢 **PASS** |
| **`e2e-readiness-phase10-5.test.ts`** | Verrou anti-facturation, minimisation données Mattermost | 6 | 🟢 **PASS** |
| **`mattermost-integration.test.ts`** | Notifications des 8 événements métier, filtrage tokens | 3 | 🟢 **PASS** |
| **`staging-operational-reception-phase10-6.test.ts`** | Recette opérationnelle globale Lead $\to$ RDV $\to$ Devis | 13 | 🟢 **PASS** |
| **TOTAL GÉNÉRAL** | **Couverture Globale Bokengi Group 2.0** | **50** | 🟢 **50/50 PASS (100%)** |

---

## 4. Bilan & État de CR-01

- **Anomalies / Régressions :** 0
- **Blocages Techniques :** 0
- **Statut CR-01 :** 🟢 **VALIDATED IN STAGING** (Prêt pour déploiement en production lors du prochain mandat).
