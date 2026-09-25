# PAYLOAD TO ERPNEXT — PHASE 6.1 INFRASTRUCTURE DECOMMISSIONING AUDIT

## 1. ARCHITECTURE ACTUELLE
L'application Bokengi Group 2.0 est propulsée exclusivement par **Next.js** en front-end (Cloudflare Pages/Vercel) et **ERPNext v15** en back-end (via son API REST).
La chaîne d'appel nominale Next.js -> erpnext-client.ts -> ERPNext est active à 100%.

## 2. INVENTAIRE INFRASTRUCTURE

### A. Neon PostgreSQL (Base Payload)
- **Ressource** : Cluster Neon Serverless PostgreSQL.
- **Type** : Base de données relationnelle.
- **État actuel** : Intacte, contenant les données historiques de Payload.
- **Utilisé par ERPNext ?** NON (ERPNext possède sa propre base MariaDB/PostgreSQL distincte).
- **Utilisé par Next.js ?** NON (Aucun client SQL direct dans src/).
- **Utilisé par Payload ?** OUI (Historiquement la seule base de Payload).
- **Rollback requis ?** NON (La Phase 5 a validé l'indépendance totale d'ERPNext).
- **Action proposée** : DÉSACTIVATION et SUPPRESSION (en Phase 6.2).
- **Risque** : Nul sur la production actuelle.

### B. Cloudflare Hyperdrive
- **Ressource** : Binding Hyperdrive (HYPERDRIVE) et instances Cloudflare associées.
- **Type** : Connection pooler TCP/PostgreSQL de Cloudflare.
- **État actuel** : Présent dans wrangler.jsonc (id: 67e941a48c744118b9faa0adf0affa79).
- **Utilisé par ERPNext ?** NON (Les requêtes Next.js vers ERPNext sont du trafic HTTP/REST pur).
- **Utilisé par Next.js ?** NON (Les routes /api et le data layer ne l'invoquent plus).
- **Action proposée** : DÉSACTIVATION du binding (en Phase 6.2).
- **Risque** : Nul.

### C. Cloudflare R2 (MEDIA_BUCKET)
- **Ressource** : Bucket okengi-media.
- **Type** : Object Storage (S3-compatible).
- **État actuel** : Présent dans wrangler.jsonc.
- **Utilisé par ERPNext / Next.js ?** OUI (Considéré comme critique par les règles métier pour servir les assets statiques et médias).
- **Action proposée** : CONSERVER ABSOLUMENT.
- **Risque** : Destruction entraînerait la perte des médias de production.

### D. Secrets Payload
- **Ressources** : PAYLOAD_SECRET, POSTGRES_URL, DATABASE_URI.
- **Type** : Variables d'environnement critiques.
- **État actuel** : Déclarées dans les environnements de déploiement et .env.example.
- **Utilisé par ERPNext ?** NON (rpnext-client.ts requiert uniquement ERPNEXT_API_URL, ERPNEXT_API_KEY, ERPNEXT_API_SECRET).
- **Utilisé par Next.js ?** NON.
- **Action proposée** : RÉVOCATION et SUPPRESSION (en Phase 6.2).

## 3. PREUVE D'INDÉPENDANCE ERPNEXT
Une recherche formelle sur l'arbre de sources complet (git grep) prouve l'inexistence des appels à :
- process.env.POSTGRES_URL
- process.env.PAYLOAD_SECRET
- L'utilisation du binding HYPERDRIVE (ex: nv.HYPERDRIVE).
La connectivité d'ERPNext est rigoureusement encapsulée et vérifiée dans src/lib/erpnext-client.ts, s'appuyant exclusivement sur les clés ERPNEXT_API_*.

## 4. TESTS DE NON-DÉPENDANCE
- Les requêtes HTTP effectuées localement et testées lors de la passe CI de Next.js (pnpm build) ne sollicitent jamais les bindings TCP Hyperdrive (inexistants dans la runtime Next.js native sans Payload).
- Le trafic est 100% orienté vers l'API HTTP d'ERPNext.

## 5. MATRICE DE DÉCISION POUR LA PHASE 6.2

| Ressource | Décision | Action Prévue | Rollback |
|---|---|---|---|
| Binding HYPERDRIVE | **SUPPRIMER** | Retrait de wrangler.jsonc | Restauration via Git |
| Neon Postgres | **DÉSACTIVER** | Suspension ou Suppression du cluster Neon | Dump SQL historique stocké localement (docs/archive) |
| PAYLOAD_SECRET | **RÉVOQUER** | Retrait des variables CF / Vercel | Aucun |
| R2 (MEDIA_BUCKET) | **CONSERVER** | Aucune modification | N/A |

## 6. CONCLUSION
- Les composants liés à Neon, Hyperdrive, et aux variables secrètes de Payload CMS sont **authentifiés comme orphelins**. 
- Ils n'interagissent plus avec aucune composante du code de production en cours.
- L'intégrité de la production actuelle repose sur ERPNEXT_API_* et R2.
- **AUCUNE DESTRUCTION EFFECTUÉE.** La production reste inchangée. L'environnement est prêt pour la Phase 6.2 de suppression physique de l'infrastructure Legacy.
