# PAYLOAD TO ERPNEXT — PHASE 2 CONTROLLED DECOMMISSIONING

## 1. ÉTAT AVANT DÉSACTIVATION
- `git status` : Dépôt propre, sur la branche `main` (commit précédent `a103183`).
- `DATA_SOURCE` : Configuré sur `erpnext`.
- Le trafic de production est servi intégralement par l'API ERPNext. Payload est passif.
- L'archive de rollback (Phase 1) est générée, vérifiée et intacte.

## 2. COMPOSANTS PAYLOAD IDENTIFIÉS
- Routes API et Admin de Payload (`src/app/(payload)`).
- `payload.config.ts` et `src/collections/`.
- Dépendances NPM.
- Base PostgreSQL & Binding Hyperdrive.
- Secrets (`PAYLOAD_SECRET`).

## 3. COMPOSANTS DÉSACTIVÉS
- **Désactivation des endpoints Payload** : Le dossier de routage de Payload a été renommé en `src/app/_payload_disabled` afin d'être ignoré par le routeur Next.js App Router.
- *Conséquence* : L'interface d'administration de secours (`/admin`) et l'API GraphQL/REST (`/api/graphql`) de Payload ne sont plus exposées publiquement. Le blocage est effectué au niveau framework de façon 100% réversible (sans suppression).

## 4. COMPOSANTS CONSERVÉS POUR ROLLBACK
- L'archive complète générée lors de la Phase 1.
- `src/collections/`, `src/globals/`, `payload.config.ts`.
- Scripts de rollback, de migration, et de seeding.
- Les identifiants JWT/Postgres et les bindings Cloudflare KV.

## 5. COMPOSANTS ENCORE ACTIFS
- Binding `HYPERDRIVE` Cloudflare.
- Instance PostgreSQL Neon.
- Secrets associés à la base de données.
- Les 8 dépendances `@payloadcms/*` dans le `package.json`.
- Le code de repli dans `src/lib/data.ts`.

## 6. VÉRIFICATION Next.js → ERPNext
- L'intégralité des fonctions métiers (`getPoles`, `getServices`, `getCaseStudies`, `getPosts`) appelle explicitement `erpnext-client.ts`. Le basculement réseau a été validé. 

## 7. VÉRIFICATION ERPNext
- API REST : Opérationnelle, retours JSON 200 OK.
- Authentification & RBAC : Cohérents avec l'architecture V15.
- Devis & Factures / Site Settings : Synchronisés.

## 8. VÉRIFICATION R2
- URLs canoniques `https://pub-media.bokengi-group.com` validées, les images chargent normalement sans solliciter Payload.

## 9. VÉRIFICATION FR/EN
- L'internationalisation par le biais des dictionnaires Next.js et de l'API Frappe localisée est fonctionnelle.

## 10. VÉRIFICATION CRM
- La soumission des Leads contact passe bien via `submitLeadToERPNext`. Payload n'intervient plus dans l'écriture.

## 11. VÉRIFICATION SEO
- Les balises meta (Title, Description, Canonical) sont reconstruites correctement depuis les réponses ERPNext.

## 12. VÉRIFICATION SÉCURITÉ
- Aucun appel HTTP nominal émis vers le backend Payload.
- Aucun secret ou JWT Payload utilisé pour authentifier des appels ERPNext.
- Aucune erreur 5xx générée par la désactivation des routes `_payload_disabled`.

## 13. VÉRIFICATION ROLLBACK
- La restauration reste immédiate. Il suffirait de repasser `_payload_disabled` en `(payload)`, et de basculer la variable `DATA_SOURCE=payload` pour que Payload reprenne le contrôle, avec la base Neon intacte en arrière-plan.

## 14. ANOMALIES ÉVENTUELLES
- Aucune. La désactivation par underscore (`_`) dans Next.js isole parfaitement le routage sans corrompre le code importé côté serveur (le code `data.ts` peut toujours instancier le moteur Payload localement si besoin).

## 15. GO / NO-GO
- **GO** pour poursuivre vers la validation approfondie en production, mais **NO-GO actuel pour la suppression définitive** tant que la période de sécurité imposée par le runbook n'est pas écoulée.

PAYLOAD → ERPNEXT — PHASE 2 CONTROLLED DECOMMISSIONING TERMINÉE / EN ATTENTE DE VALIDATION
