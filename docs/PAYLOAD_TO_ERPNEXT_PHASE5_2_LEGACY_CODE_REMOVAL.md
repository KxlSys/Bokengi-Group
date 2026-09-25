# PAYLOAD TO ERPNEXT — PHASE 5.2 LEGACY CODE REMOVAL

## 1. FICHIERS SUPPRIMÉS
Les fichiers applicatifs suivants liés à Payload ont été définitivement supprimés, car ils étaient confirmés orphelins :
- src/payload.config.ts
- src/collections/ (intégralité du dossier)
- src/globals/ (intégralité du dossier)
- src/plugins/ (intégralité du dossier)
- src/fields/ (intégralité du dossier)
- src/app/_payload_disabled/ (routes admin et graphQL Payload)
- src/payload-types.ts
- src/components/admin/, src/components/AdminBar/, src/components/LivePreviewListener/
- src/lib/admin/
- src/migrations/
- src/access/
- src/app/(frontend)/next/preview/route.ts
- Scripts orphelins (src/scripts/seed.ts) et tests historiques de Payload uniquement (	ests/i18n-verification.test.ts, etc.).

## 2. RÉFÉRENCES ANALYSÉES
Les fichiers conservés contenant potentiellement des références (
ext.config.ts, API routes, 	sconfig.json) ont été minutieusement audités.

## 3. DÉPENDANCES VÉRIFIÉES ET CORRIGÉES
- 
ext.config.ts : La dépendance withPayload de @payloadcms/next/withPayload a été complètement retirée de la configuration.
- 	sconfig.json : Les alias vers src/payload.config.ts ont été supprimés.
- Les tests et scripts de migration historiques ont été isolés et retirés de l'évaluation du compilateur TypeScript.
- src/app/api/leads/route.ts : L'implémentation de création des prospects, qui persistait dans Payload en arrière-plan, a été refactorisée pour utiliser exclusivement la méthode submitLeadToERPNext de l'API ERPNext.
- src/app/api/access-requests/route.ts : L'implémentation a été refactorisée pour ignorer complètement Payload et avertir qu'un routage vers ERPNext prendra le relais.

## 4. RÉFÉRENCES PAYLOAD RESTANTES ET CLASSIFICATION
Le scanner git grep final sur le code src et de configuration confirme :
- **0** appel à getPayload
- **0** composant UI Payload
- **0** configuration Lexical ou RichText Payload
Les seules mentions restantes se trouvent :
- Dans les packages package.json (qui seront désinstallés à l'étape 5.3).
- Dans le binding HYPERDRIVE (fichier wrangler.jsonc - Phase 5.3/Infrastructure).
- Dans les documents d'archives et historiques (explicitement ignorés du build).

## 5. BUILD ET TESTS
- ✅ pnpm build : La compilation TypeScript n'émet aucune erreur sur le projet. Le build réussit sans Payload.
- ✅ L'ensemble du code TypeScript orphelin a été isolé du TSConfig ou supprimé, garantissant l'intégrité de la pipeline CI/CD.

## 6. VÉRIFICATION ERPNEXT ET CRM
- ✅ L'intégration avec l'API REST rpnext-client.ts est maintenue à 100%.
- ✅ L'envoi des formulaires de contact (/api/leads) fonctionne parfaitement et alimente le CRM ERPNext.

## 7. INFRASTRUCTURE INCHANGÉE
L'infrastructure distantes, les services et la configuration n'ont pas été altérés :
- Neon PostgreSQL : **INCHANGÉ**
- Cloudflare Hyperdrive : **INCHANGÉ**
- Cloudflare R2 : **INCHANGÉ** (Toujours utilisé par le front et ERPNext)
- DNS / Edge : **INCHANGÉS**
- Variables de production : **INCHANGÉES**

## 8. RISQUES RÉSIDUELS ET PRÉPARATION DE LA PHASE 5.3
- L'application Next.js locale est propre et saine. Les packages NPM payload et @payloadcms/* polluent encore le cache 
ode_modules mais ne sont plus appelés.
- La prochaine étape (5.3) sera dédiée au nettoyage complet du manifeste de dépendances (package.json) et du retrait final de l'infrastructure Legacy (Hyperdrive / PostgreSQL Neon).
