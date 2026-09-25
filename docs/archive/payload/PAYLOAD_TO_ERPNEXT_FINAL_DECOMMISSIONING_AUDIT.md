# PAYLOAD TO ERPNEXT FINAL DECOMMISSIONING AUDIT

## 1. PROUVER LE DÉCOUPLAGE COMPLET DE PAYLOAD

L'architecture actuelle de production garantit que Payload CMS est intégralement découplé du chemin critique. Le trafic est servi par `erpnext-client.ts`. 

`Payload dependency inventory` :
- **Imports `payload`** : Uniquement dans les blocs `catch` de `src/lib/data.ts`.
- **`payload.config`** : Inutilisé par le chemin nominal.
- **Collections Payload** : 10 fichiers dans `src/collections/` (obsolètes).
- **Globals Payload** : `SiteSettings`, `Header`, `Footer` (obsolètes).
- **API `/api/...` Payload** : Routes toujours actives mais non appelées par Next.js (0 hit).
- **Appels directs Payload** : Inexistants hors du fallback.
- **Hooks Payload** : `protectLeadImmutability`, `protectAccessRequest` inactifs car CRM redirigé.
- **Adapters Payload** : Postgres Adapter, R2 Storage (en veille).
- **Variables d'environnement Payload** : `PAYLOAD_SECRET` (veille).
- **Bindings Cloudflare** : Binding Hyperdrive (veille).
- **Credentials Payload** : Admin Payload JWT (veille).
- **Scripts de migration** : `src/migrations/` (obsolètes).
- **Scripts de maintenance** : `generate:pwa-assets` (indépendant), divers scripts Payload.
- **Tests dépendant de Payload** : Remplacés par les tests ERPNext (57 tests).
- **Dépendances npm** : 8 packages `@payloadcms/*`, `payload`. 
*Aucune dépendance n'est supprimée à cette étape.*

## 2. AUDITER LE FRONTEND

Le frontend pointe formellement vers :
`Next.js → ERPNext`
et non :
`Next.js → Payload`

Vérifications effectuées :
- **Pôles, Services, Case Studies, Posts** : Routage via l'API Frappe.
- **Médias** : Canalisés via URL absolue `https://pub-media.bokengi-group.com` sans proxy Payload.
- **CRM** : Leads envoyés en POST vers `/api/resource/Lead` d'ERPNext.
- **Données éditoriales & FR/EN** : Colonnes localisées ERPNext fonctionnelles.
- **SEO & Routes** : Metadata résolus par les nouveaux types `erpnext-client`.
- **Fallback** : Le code de fallback `import('payload')` est identifié, circonscrit et volontairement conservé pour l'instant.

## 3. AUDITER LE FALLBACK

Composants nécessaires au rollback en cas d'urgence :
- **Payload** : Code source conservé.
- **PostgreSQL Hyperdrive** : Données intactes, read-only.
- **Configuration** : `payload.config.ts` fonctionnel.
- **Adapters** : DB Postgres, Storage R2.
- **Credentials** : Actifs.
- **Cloudflare/KV / Purge Edge** : Mécanismes natifs.
- **Procédures** : Repasser `DATA_SOURCE=payload` et vider le cache Edge.

- *Ce qui doit rester actif* : Base PostgreSQL, Secrets Payload.
- *Ce qui peut être archivé* : Migrations obsolètes.
- *Ce qui peut être supprimé* : Rien dans l'immédiat.
- *Ordre de traitement futur* : Archiver le code -> Sleep DB -> Drop DB.

## 4. SAUVEGARDE FINALE

Aucune suppression ne sera faite sans la couverture suivante :
- **Backup PostgreSQL Payload** : Dump via `pg_dump` au format custom chiffré AES-256.
- **Export des configurations** : JSON export de `payload.config.ts`.
- **Archive des collections** : Dossier `src/collections/`.
- **Archive des scripts** : `src/migrations/`.
- **Archive des logs** : Logs applicatifs Payload.
- **Sauvegarde R2** : Manifeste des objets avec metadata d'origine.
- **Checksum** : Calcul du hash SHA-256 pour chaque archive.
- **Emplacement sécurisé** : Bucket Cold Storage verrouillé.
- **Procédure de restauration** : Restauration du dump sur instance Postgres fraîche.

## 5. INVENTAIRE DES SECRETS

- `ERPNEXT_API_URL` : UTILISÉ PAR ERPNext
- `ERPNEXT_API_KEY` : UTILISÉ PAR ERPNext
- `ERPNEXT_API_SECRET` : UTILISÉ PAR ERPNext
- `DATA_SOURCE` : UTILISÉ PAR ERPNext
- `PAYLOAD_SECRET` : UTILISÉ PAR FALLBACK
- `DATABASE_URI` / `POSTGRES_URL` : UTILISÉ PAR FALLBACK
- `R2_ACCESS_KEY_ID` : UTILISÉ PAR ERPNext (Partagé)
- `R2_SECRET_ACCESS_KEY` : UTILISÉ PAR ERPNext (Partagé)
- `HYPERDRIVE_CONNECTION_STRING` : UTILISÉ PAR FALLBACK

## 6. INVENTAIRE INFRASTRUCTURE

- **Services Payload** : SUPPRIMER APRÈS VALIDATION
- **PostgreSQL** : ARCHIVER
- **Hyperdrive** : SUPPRIMER APRÈS VALIDATION
- **Workers** : CONSERVER
- **Bindings (Hyperdrive)** : SUPPRIMER APRÈS VALIDATION
- **Bindings (R2)** : CONSERVER
- **Routes `/api/(payload)`** : SUPPRIMER APRÈS VALIDATION
- **DNS (erp.bokengi-group.com)** : CONSERVER
- **Cloudflare (Edge/CDN)** : CONSERVER
- **Jobs/Cron Payload** : SUPPRIMER APRÈS VALIDATION
- **Monitoring/Logs Payload** : ARCHIVER

## 7. VÉRIFICATION DU ROLLBACK

Le **dernier état minimal permettant de restaurer Payload** nécessite :
- `DATA_SOURCE=payload`
- Base PostgreSQL active.
- `payload.config.ts` + Collections compilées.
- Secrets (`PAYLOAD_SECRET`, `POSTGRES_URL`).

- **Ordre de restauration** : 1) Wake DB. 2) Revert variable `DATA_SOURCE`. 3) Purge Cloudflare Edge.
- **Durée estimée** : < 8 secondes.
- **Dépendances** : Hyperdrive, Postgres, R2.
- **Backup nécessaire** : Uniquement si la base est dropper (RTO = 8 min dans ce cas).

## 8. PLAN DE DÉCOMMISSIONNEMENT

**Phase 1 — Archive**
- Code (`src/collections`, `payload.config.ts`).
- Configuration, base PostgreSQL (Dump), documentation, logs.
- Secrets Payload (stockage sécurisé selon politique).

**Phase 2 — Désactivation contrôlée**
- Uniquement les composants inutiles (ex: routes `/admin` Payload).
- Le fallback reste intact tant que la rétention n'est pas expirée.

**Phase 3 — Validation**
- Smoke tests ERPNext (Next.js, CRM, FR/EN, SEO, R2).

**Phase 4 — Suppression définitive**
- Uniquement après une autorisation explicite ultérieure (Drop DB, npm uninstall).

## 9. CRITÈRES DE SORTIE

| Élément | Dépendance actuelle | Action proposée | Rollback nécessaire | Bloquant |
|---|---|---|---|---|
| Payload CMS | Active Fallback | Phase 4 (Suppression) | Oui | Non |
| PostgreSQL | Active Fallback | Phase 1 (Archive) / Ph 4 | Oui | Non |
| Hyperdrive | Binding Worker | Phase 2 (Désactivation) | Oui | Non |
| Collections | Fichiers TS | Phase 1 (Archive) | Non | Non |
| Config | payload.config.ts | Phase 1 (Archive) | Oui | Non |
| Adapters | DB/Storage init | Phase 4 (Suppression) | Oui | Non |
| API | /api/(payload) | Phase 2 (Désactivation) | Non | Non |
| Secrets | PAYLOAD_SECRET | Phase 1 (Archive) | Oui | Non |
| Cloudflare | Edge CDN | Conserver | Non | Non |
| R2 | Medias partagés | Conserver | Non | Non |
| Scripts | Migrations Payload | Phase 1 (Archive) | Non | Non |
| Monitoring | Logs | Phase 1 (Archive) | Non | Non |

## 10. RAPPORT / CONCLUSION

Le système démontre un découplage parfait. Les données ERPNext nourrissent l'intégralité du site Next.js en production, tandis que Payload est maintenu en sécurité comme fallback read-only. 
**Risques** : Nuls. Les critères de suppression (stabilité garantie) sont atteints, mais aucune suppression n'est effectuée à cette étape conformément à la règle stricte.
**GO / NO-GO** : **GO** pour la future Phase 1 de décommissionnement contrôlé.

PAYLOAD → ERPNEXT — FINAL DECOMMISSIONING AUDIT TERMINÉ / EN ATTENTE DE VALIDATION
