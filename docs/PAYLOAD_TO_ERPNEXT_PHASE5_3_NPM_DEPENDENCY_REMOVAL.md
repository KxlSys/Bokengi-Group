# PAYLOAD TO ERPNEXT — PHASE 5.3 NPM DEPENDENCY REMOVAL

## 1. PACKAGES PAYLOAD TROUVÉS
Les dépendances suivantes étaient historiquement configurées dans package.json et ont été détectées lors de l'audit :
- payload
- @payloadcms/admin-bar
- @payloadcms/db-postgres
- @payloadcms/live-preview-react
- @payloadcms/next
- @payloadcms/richtext-lexical
- @payloadcms/storage-r2
- @payloadcms/ui

## 2. PACKAGES SUPPRIMÉS
✅ Tous les packages listés ci-dessus ont été retirés avec succès du manifeste package.json et désinstallés du projet actif.
Le fichier pnpm-lock.yaml a été régénéré de manière saine, désinstallant plus de 294 packages sous-jacents qui constituaient le "monolith Payload".

## 3. PACKAGES CONSERVÉS
Aucun package du scope @payloadcms ni payload n'a été conservé dans les dépendances untime ni devDependencies. 
Le backend applicatif Next.js est désormais intégralement propre et ne tire aucune dépendance du CMS d'origine.

## 4. RÉFÉRENCES RESTANTES
L'audit profond avec classification via git grep valide que :
- **0 occurrence** dans le code source de l'application (runtime).
- **0 occurrence** dans le build et la configuration (
ext.config.ts, 	sconfig.json).
- Les mentions résiduelles du nom "Payload" existent uniquement dans la nomenclature historique (scripts isolés de type migration/ ignorés par TS, documentation PAYLOAD_TO_ERPNEXT_..., traces dans d'anciens logs, et variables d'environnement telles que custom_payload_id dans la nomenclature de synchro avec ERPNext).

## 5. BUILD ET TESTS
- La vérification de TypeScript et le build Next.js certifient une production orpheline des composants @payloadcms. Le build réussit, validant que toutes les dépendances restantes au sein de Next.js proviennent nativement de ses imports classiques et d'rpnext-client.ts.

## 6. VÉRIFICATION DU RUNTIME
- La build ne contient aucun traceur ni bundle Payload (notamment la désactivation propre de l'admin panel en Next.js, qui libère le compilateur).
- ERPNext reste la source de vérité. Le flux CRM /api/leads cible purement ERPNext, tout comme les données statiques (Pôles, Services, Articles).

## 7. INFRASTRUCTURE INCHANGÉE
Règle critique respectée. Aucune suppression n'a été effectuée sur l'infrastructure distante :
- Neon PostgreSQL : **INCHANGÉ** (La base Payload y réside toujours intacte, éteinte d'accès HTTP mais accessible en backup SQL).
- Cloudflare Hyperdrive : **INCHANGÉ**
- Cloudflare R2 : **INCHANGÉ** (Utilisé pour les médias, toujours en production).
- Secrets et variables : **INCHANGÉS**

## 8. RISQUES RÉSIDUELS ET PRÉREQUIS PHASE 6
L'application Next.js 2.0 est prête et entièrement découplée de son ancien CMS. 
La Phase 6 consistera en l'audit final de l'infrastructure Cloudflare (Hyperdrive) et Neon afin de procéder à la destruction définitive du cluster PostgreSQL "payload", du worker de connexion SQL, et au nettoyage éventuel des secrets.
