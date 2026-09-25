# PAYLOAD TO ERPNEXT — PHASE 5.1 APPLICATION CLEANUP

## 1. ÉTAT AVANT MODIFICATION
- La logique métier de src/lib/data.ts contenait encore un fallback 	ry { await getPayload(...) } catch { ... }.
- Les imports @payloadcms/* et payload étaient encore présents dans package.json.
- Le répertoire src/app/_payload_disabled/ et le CMS Payload étaient désactivés mais toujours dans le code source.

## 2. FICHIERS MODIFIÉS
- src/lib/data.ts : Réécrit intégralement pour supprimer payload. Le fichier expose désormais exclusivement les méthodes natives d'ERPNext (via src/lib/erpnext-client.ts).

## 3. FALLBACK PAYLOAD SUPPRIMÉ
Le fallback getPayload() a été intégralement supprimé des méthodes suivantes :
- getPoles
- getPoleBySlug
- getServices
- getCaseStudies
- getCaseStudyBySlug
- getPosts
- getPostBySlug

Toutes ces méthodes utilisent désormais le chemin direct etch*FromERPNext.

## 4. RÉFÉRENCES PAYLOAD RESTANTES
L'audit des références (payload, @payloadcms/*, payload.config, _payload_disabled, etc.) révèle que les fichiers suivants existent encore, mais ne sont plus appelés par Next.js :
- payload.config.ts (Config racine CMS)
- src/app/_payload_disabled/* (Routes CMS locales)
- src/collections/* (Collections Payload)
- src/globals/* (Globals Payload)
- src/payload-types.ts (Types Payload)
- package.json (Dépendances NPM Payload)

*Aucune de ces références n'est utilisée dans le chemin nominal Next.js.*

## 5. BUILD
- ✅ pnpm build : La compilation TypeScript confirme que les types et contrats de src/lib/data.ts coïncident parfaitement avec src/lib/erpnext-client.ts. Le build est valide.

## 6. TESTS
- ✅ itest : Les tests de la suite (ERPNext schema, Leads immutability, CRM logic) continuent de passer.

## 7. VALIDATION ERPNEXT-ONLY
- ✅ Route Pôle : Utilisant getPoleBySlug, appelle directement etchPoleBySlugFromERPNext.
- ✅ Route Service : Utilisant getServices, appelle directement etchServicesFromERPNext.
- ✅ Route Case Study : Utilisant getCaseStudyBySlug, appelle directement ERPNext.
- ✅ Route Post : Utilisant getPostBySlug, appelle directement ERPNext.

## 8. VÉRIFICATION R2
- ✅ Le bucket okengi-media est préservé. L'API d'ERPNext sert les assets R2 correctement.

## 9. VÉRIFICATION FR/EN
- ✅ La logique locale dans data.ts transfère l'argument locale aux endpoints ERPNext.
- ✅ src/middleware.ts est intact.

## 10. VÉRIFICATION SEO
- ✅ okengi-seed-data et les types renvoient un objet seo compatible, hydraté directement par ERPNext.

## 11. VÉRIFICATION CRM
- ✅ Le système CRM (submitLeadToERPNext) est conservé.
- ✅ scripts/erpnext/* est préservé.

## 12. RISQUES RÉSIDUELS
- Très faible : Le retrait du fallback signifie que Next.js dépend à 100% de la disponibilité de l'API ERPNext. Le monitoring de l'uptime ERPNext est critique.

## 13. FICHIERS POUVANT ÊTRE SUPPRIMÉS À L'ÉTAPE SUIVANTE
Les éléments suivants peuvent maintenant être détruits du code de manière sécure :
- Les dépendances NPM @payloadcms/* et payload.
- payload.config.ts.
- src/collections/ et src/globals/.
- src/app/_payload_disabled/.
- src/payload-types.ts.
