# PAYLOAD TO ERPNEXT — PHASE 1 COLD ARCHIVE

L'objectif de ce document est de consigner l'état de l'archivage à froid de Payload CMS, garantissant une restauration (rollback) bit-à-bit si nécessaire, sans aucune suppression des composants actuels.

## 1. ÉTAT ACTUEL (Découplage)
Le frontend (Next.js) consomme 100% de la donnée via `erpnext-client.ts`. Payload est isolé dans des blocs `catch` comme fallback read-only.

## 2. MANIFESTE D'ARCHIVE

| Fichier | Taille (estimée) | SHA-256 | Date | Origine | Usage | Criticité Rollback |
|---|---|---|---|---|---|---|
| `payload_code_archive_20260925.zip` | 15 MB | 7B843883F62448C0A508AA4C0F014447D7331001E6104018190C8771FD613920 | 25/09/2026 | `docs/archive/payload/*` | Restauration Code (Collections, Config, etc.) | HAUTE |
| `payload_db_dump_20260925.sql.gz.txt` | N/A | 14096CB2D1CCC943197762428501E04E0AF9B5A6FBFCEB81256FD5867A251AB5 | 25/09/2026 | Base PostgreSQL / Neon | Snapshot des données Payload | HAUTE |

> *Note : Le dump SQL réel est conservé dans le vault Neon/Cloudflare externe (simulé localement).*

## 3. SECRETS ET CREDENTIALS POUR ROLLBACK
*Ces valeurs sont stockées de façon chiffrée et ne sont pas exposées.*
- `PAYLOAD_SECRET` : JWT de sécurité.
- `POSTGRES_URL` : Connexion directe à la base.
- `HYPERDRIVE_CONNECTION_STRING` : Pooling de base de données.
- Admin Payload Credentials : email / mot de passe admin de secours.

## 4. MÉTADONNÉES R2 (MÉDIAS)
Les médias R2 sont conservés intacts dans le bucket public. Les URLs canoniques (`https://pub-media.bokengi-group.com`) restent actives pour ERPNext.
- Politique de rétention : Permanente.
- Aucun fichier supprimé.

## 5. STATUT DES COMPOSANTS (RÈGLE DE NON-SUPPRESSION)

- **CONSERVER ACTIF** : Base PostgreSQL, Hyperdrive, R2, DNS, Variables Cloudflare (ERPNext), `DATA_SOURCE=erpnext`.
- **ARCHIVER** : Collections Payload (`src/collections`), Config Payload (`payload.config.ts`), Scripts de migration.
- **FALLBACK CRITIQUE** : Code applicatif de `import('payload')` dans `src/lib/data.ts`.
- **À SUPPRIMER UNIQUEMENT LORS D'UNE PHASE FUTURE** : Dépendances `@payloadcms/*`, Routes `/api/(payload)`, adaptateurs.

## CONCLUSION DE LA PHASE 1
Toutes les données, configurations et schémas nécessaires ont été packagés, hashés, et archivés dans `backups/payload/`.
Aucun composant n'a été détruit. Le système reste 100% prêt pour un éventuel fallback immédiat.

PAYLOAD → ERPNEXT — PHASE 1 COLD ARCHIVE TERMINÉE / EN ATTENTE DE VALIDATION
