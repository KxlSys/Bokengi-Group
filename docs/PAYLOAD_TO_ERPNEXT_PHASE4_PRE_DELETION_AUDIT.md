# PAYLOAD TO ERPNEXT — PHASE 4 PRE-DELETION AUDIT

## 1. EXECUTIVE SUMMARY
L'architecture Bokengi Group 2.0 fonctionne intégralement avec ERPNext comme CMS primaire depuis la validation de la Phase 3. Payload CMS est désactivé au niveau du routage (`_payload_disabled`). 
Cet audit final dresse l'inventaire exhaustif des composants liés à Payload afin d'établir un plan de suppression sans risque, sans procéder à la moindre altération du système actuel.

## 2. ÉTAT ACTUEL DE L'ARCHITECTURE
Le flux nominal est : `Next.js → ERPNext REST API → ERPNext v15`.
Aucun parcours client ne passe par Payload.

## 3. INVENTAIRES ET DÉPENDANCES PAYLOAD

### Dépendances Payload restantes dans le code
| FICHIER | UTILISATION | PRODUCTION ? | FALLBACK ? | ARCHIVE ? | SUPPRIMABLE ? |
|---|---|---|---|---|---|
| `src/lib/data.ts` | Mécanisme SSR `import('payload')` (bloc catch) | NON | OUI | NON | OUI (post-validation) |
| `src/app/_payload_disabled` | Anciennes routes API et Admin | NON | NON | OUI | OUI |
| `src/payload.config.ts` | Configuration du CMS désactivé | NON | OUI | OUI | OUI |
| `src/collections/*` | Schémas de base de données Neon | NON | OUI | OUI | OUI |
| `src/globals/*` | Schémas statiques | NON | OUI | OUI | OUI |
| `src/hooks/*` | Anciens middlewares CRM/Payload | NON | NON | OUI | OUI |

### Dépendances réellement actives
Zéro dépendance Payload n'est active en production. L'intégralité du code exécuté passe par les abstractions `erpnext-client`.

### Packages NPM Payload
| PACKAGE | OÙ UTILISÉ | PROD ? | FALLBACK ? | TESTS/SCRIPTS ? | SUPPRIMABLE APRÈS VALIDATION ? |
|---|---|---|---|---|---|
| `payload` | `data.ts`, config, hooks | NON | OUI | OUI | OUI |
| `@payloadcms/admin-bar` | `_payload_disabled` | NON | NON | NON | OUI |
| `@payloadcms/db-postgres` | `payload.config.ts` | NON | OUI | NON | OUI |
| `@payloadcms/live-preview-react` | Inutilisé | NON | NON | NON | OUI |
| `@payloadcms/next` | `_payload_disabled` | NON | NON | NON | OUI |
| `@payloadcms/richtext-lexical` | Champs Lexical (Collections) | NON | OUI | NON | OUI |
| `@payloadcms/storage-r2` | `payload.config.ts` | NON | OUI | NON | OUI |
| `@payloadcms/ui` | Composants UI admin | NON | NON | NON | OUI |

### Infrastructure (PostgreSQL, Hyperdrive, Cloudflare)
- **PostgreSQL Payload (Neon)** : Base read-only. `SUPPRIMABLE APRÈS VALIDATION`
- **Hyperdrive Payload** : Binding Cloudflare (`HYPERDRIVE_CONNECTION_STRING`). `SUPPRIMABLE APRÈS VALIDATION`
- **Bindings Cloudflare (R2)** : `CONSERVER` (Partagé avec ERPNext).
- **Monitoring / Logs Payload** : Historique Cloudflare. `ARCHIVER`

### Secrets et Variables d'Environnement
- `PAYLOAD_SECRET` : Authentification JWT Payload -> `OBSOLÈTE` (à révoquer plus tard).
- `DATABASE_URI` / `POSTGRES_URL` : Base de fallback -> `OBSOLÈTE` (à dropper plus tard).
- `ERPNEXT_API_URL`, `KEY`, `SECRET` -> `ERPNext` (Intact).
- `DATA_SOURCE` -> `ERPNext` (Intact).

## 4. AUDIT FRONTEND & FALLBACK
- Pôles, Services, Case Studies, Médias, CRM, SEO, i18n FR/EN sont 100% routés via `erpnext-client.ts`. `src/lib/data.ts` tente toujours le catch vers Payload, mais le code de fallback est **devenu inutile** car ERPNext assure le service nominal à 100%. Le fallback ne doit pas être supprimé aujourd'hui, mais la suppression de ce bloc `catch` sera la première étape du nettoyage du code.

## 5. AUDIT DES ARCHIVES
La Phase 1 a bien packagé `payload_code_archive_20260925.zip` (SHA-256 garanti) et les métadonnées de dump (dont le dump réel est chez Neon). Toutes les entités nécessaires au rollback asymétrique existent.

## 6. RISQUES & ORDRE EXACT DE SUPPRESSION FUTURE
**Risques lors de la suppression** : 
- Supprimer accidentellement les accès R2 partagés (qui portent les médias de production).
- Retirer la variable `DATA_SOURCE` provoquant un plantage Next.js.

**Ordre strict de suppression future** :
1. Suppression du code (`_payload_disabled`, `collections`, `globals`, `hooks`, config).
2. Nettoyage du fichier `src/lib/data.ts` (retrait des blocs catch `getPayload`).
3. Retrait des 8 dépendances `@payloadcms/*` et `payload` via `npm uninstall`.
4. Validation fonctionnelle Next.js (Build local et Tests CI).
5. Déploiement du code nettoyé sur Cloudflare.
6. Phase d'observation (72h).
7. Révocation des secrets (`PAYLOAD_SECRET`, variables Postgres).
8. Destruction de l'instance Neon PostgreSQL et retrait du binding Hyperdrive.

## 7. CRITÈRES DE VALIDATION POST-SUPPRESSION
- `npm run build` doit réussir sans Payload installé.
- Zéro dépendance résiduelle détectée par le CI.
- Zéro erreur réseau Cloudflare.

## 8. MATRICE DE SUPPRESSION

| Composant | Utilisation actuelle | ERPNext | Fallback | Archive | Suppression possible | Risque |
|---|---|---|---|---|---|---|
| Payload CMS (NPM) | Fallback inactif | NON | OUI | OUI | OUI (en 3e étape) | Bas |
| PostgreSQL | Veille (Neon) | NON | OUI | OUI | OUI (en 8e étape) | Bas |
| Hyperdrive | Binding (Veille) | NON | OUI | OUI | OUI (en 8e étape) | Bas |
| Collections | Code TS Mort | NON | OUI | OUI | OUI (en 1re étape) | Nul |
| Config | payload.config.ts | NON | OUI | OUI | OUI (en 1re étape) | Nul |
| Adapters | DB/Storage init | NON | OUI | OUI | OUI (en 1re étape) | Nul |
| API | Route _disabled | NON | NON | OUI | OUI (en 1re étape) | Nul |
| Secrets (Payload) | Veille | NON | OUI | NON | OUI (en 7e étape) | Bas |
| Cloudflare DNS/CDN| Trafic Prod | OUI | NON | NON | **NON** (CONSERVER) | Critique |
| R2 (Médias) | Stockage Prod | OUI | NON | NON | **NON** (CONSERVER) | Critique |
| Scripts/Migrations| Historique | NON | NON | OUI | OUI (en 1re étape) | Nul |
| Monitoring | Logs CF | OUI | NON | OUI | **NON** (CONSERVER) | Bas |

PAYLOAD → ERPNEXT — PHASE 4 PRE-DELETION AUDIT TERMINÉ / EN ATTENTE DE VALIDATION
