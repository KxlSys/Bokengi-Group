# PAYLOAD TO ERPNEXT — FINAL PRE-DELETION AUDIT (PHASE 4)

## CONTEXTE
Ce document présente le bilan technique exhaustif précédant la suppression définitive du code, des données et de l'infrastructure de Payload CMS.
- **Source primaire** : ERPNext v15 (Actif, Validé).
- **Fallback Payload** : Inactif par défaut, mais code toujours présent.
- **Chemin nominal** : Next.js → ERPNext REST API → ERPNext.

---

## 1. MATRICE DE DÉPENDANCES ET COMPOSANTS

| Élément | Référence trouvée | Utilisé par ERPNext | Nécessaire Rollback | Suppression Possible | Risque |
|---|---|---|---|---|---|
| **Packages NPM** | @payloadcms/*, payload dans package.json | ❌ NON | ✅ OUI | ✅ OUI (après retrait fallback) | Modéré (Nécessite MAJ de data.ts) |
| **Config CMS** | payload.config.ts, src/collections/, src/globals/ | ❌ NON | ✅ OUI | ✅ OUI | Faible |
| **Routes Admin/API** | src/app/_payload_disabled/ | ❌ NON | ✅ OUI | ✅ OUI | Faible |
| **Génération Types** | src/payload-types.ts | ❌ NON | ✅ OUI | ✅ OUI | Faible |
| **Fallback Data** | src/lib/data.ts (imports conditionnels payload) | ❌ NON | ✅ OUI | ✅ OUI (Récrire sans Payload) | Modéré (Impact Frontend direct) |
| **Base de données** | Neon PostgreSQL (via DATABASE_URI) | ❌ NON | ✅ OUI | ✅ OUI (côté DB) | Faible (Isolée) |
| **Infra Cloudflare** | Binding HYPERDRIVE (wrangler.jsonc) | ❌ NON | ✅ OUI | ✅ OUI | Faible (Isolé) |
| **Stockage Médias** | Bucket R2 okengi-media | ✅ OUI (partagé) | ✅ OUI | ❌ **NON** (utilisé par ERPNext) | **CRITIQUE** |

---

## 2. ANALYSE DES PACKAGES NPM

Les packages suivants sont encore présents dans package.json :
- @payloadcms/admin-bar : Orphelin (inutile).
- @payloadcms/db-postgres : Utilisé uniquement par le Fallback.
- @payloadcms/live-preview-react : Orphelin.
- @payloadcms/next : Utilisé uniquement par le Fallback / config.
- @payloadcms/richtext-lexical : Orphelin (le parsing Lexical a été redéveloppé ou supprimé du flux nominal).
- @payloadcms/storage-r2 : Utilisé par la config Payload, mais ERPNext accède à R2 via d'autres mécanismes ou proxy.
- @payloadcms/ui : Orphelin.
- payload : Utilisé uniquement par le Fallback.

**Conclusion NPM** : Tous les packages Payload peuvent être supprimés en toute sécurité, à condition de retirer au préalable le fallback dans src/lib/data.ts.

---

## 3. INDÉPENDANCE DU CHEMIN ERPNEXT

- src/lib/erpnext-client.ts : Aucune dépendance, aucun import vers Payload.
- **R2 / Cloudflare Edge** : R2 est partagé, il **NE DOIT PAS ÊTRE SUPPRIMÉ**. Le binding HYPERDRIVE (utilisé par Payload pour PostgreSQL) peut en revanche être retiré de wrangler.jsonc sans impacter ERPNext.
- **CRM / SEO / FR-EN** : Les données sont servies intégralement par ERPNext. Le SEO et les slugs multilingues sont gérés dans data.ts via le client ERPNext.

---

## 4. CONTRÔLE DES ARCHIVES ET ROLLBACK

- Les archives froides (backups SQL, ZIP du code source) sont sécurisées et ignorées par Git (.gitignore).
- Le rollback Payload est actuellement toujours possible car aucun code n'a été détruit, juste désactivé via le renommage de (payload) en _payload_disabled.

---

## 5. DÉCISIONS DE SUPPRESSION

### Composants RÉELLEMENT SUPPRIMABLES (au GO final) :
1. Les dépendances @payloadcms/* et payload du package.json.
2. Le binding HYPERDRIVE et la configuration Payload dans wrangler.jsonc.
3. Le code source entier de Payload : payload.config.ts, src/collections, src/globals, src/plugins, src/fields, src/app/_payload_disabled, src/payload-types.ts.
4. Le dossier des scripts de migration historique : scripts/migration.
5. Le code de Fallback dans src/lib/data.ts.
6. L'instance Neon PostgreSQL et le service Hyperdrive sur Cloudflare.

### Composants À CONSERVER STRICTEMENT (Ne jamais supprimer) :
1. Le bucket Cloudflare R2 okengi-media.
2. src/lib/erpnext-client.ts et scripts/erpnext/.
3. Le middleware multilingue src/middleware.ts.

---

## 6. ORDRE DE SUPPRESSION RECOMMANDÉ (PHASE 5)

Une fois ce rapport validé, la suppression devra suivre cet ordre exact pour limiter les risques :

1. **Retrait du Fallback (Code)** : Nettoyage de src/lib/data.ts pour supprimer tout import asynchrone de payload et toute logique conditionnelle.
2. **Nettoyage Next.js (Code)** : Suppression du code métier Payload (src/collections, payload.config.ts, _payload_disabled, src/payload-types.ts).
3. **Nettoyage NPM (Dépendances)** : Suppression des packages Payload du package.json.
4. **Validation Locale** : Lancement du build Next.js pur pour valider que la compilation ne nécessite plus Payload (pnpm build).
5. **Nettoyage Cloudflare (Infra)** : Retrait du binding Hyperdrive dans wrangler.jsonc.
6. **Déploiement (Production)** : Poussée de la nouvelle version purifiée sur Vercel/Cloudflare.
7. **Destruction Distante (Infra)** : (Post-déploiement) Suppression de Neon PostgreSQL et de Cloudflare Hyperdrive via les consoles d'administration respectives.

### Tests Obligatoires après chaque suppression (Code) :
- pnpm build : doit réussir sans erreur de type manquant.
- Parcourir les routes locales pour vérifier que data.ts interroge bien ERPNext sans crasher sur l'absence de Payload.
