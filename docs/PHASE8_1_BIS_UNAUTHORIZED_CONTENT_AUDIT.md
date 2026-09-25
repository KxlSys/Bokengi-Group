# BOKENGI GROUP 2.0 — PHASE 8.1 BIS
# RAPPORT D'AUDIT DES CONTENUS NON AUTORISÉS & RÉSOLUTION DES INCOHÉRENCES ÉDITORIALES

**Date de l'audit :** 26 Septembre 2026  
**Branche Git :** `main`  
**Dernier commit Git :** `bc4c246`  
**Statut de conformité :** 🔴 **INCOHÉRENCE ÉDITORIALE DÉTECTÉE — VALIDATION HUMAINE EXPLICITE REQUISE**  
**Règle de gel appliquée :** 0 modification de code/contenu, 0 suppression, 0 harmonisation automatique, 0 déploiement, 0 modification ERPNext/DNS.

---

## 1. CONTEXTE & DÉCLENCHEMENT DE L'INCIDENT DE CONFORMITÉ

Lors des vérifications pré-déploiement consécutives à la Phase 8.1, une divergence éditoriale et institutionnelle majeure a été relevée entre plusieurs pages publiques de la plateforme Bokengi Group.

Des informations géographiques, administratives et juridiques contradictoires coexistent dans le code source :
- **Page `/contact` & `/groupe` :** Siège social indiqué à **Brazzaville, République du Congo**, téléphone **+242 06 536 64 44**, représentations à Pointe-Noire, Kinshasa, Paris.
- **Page `/confidentialite` & `/mentions-legales` :** Siège social indiqué à **Paris, France**, forme juridique **TPE**, capital **7 500 €**.

Conformément à la règle de gouvernance du projet, **aucune décision éditoriale ou juridique autonome n'a été prise par l'agent**. Cet audit établit la traçabilité factuelle et historique rigoureuse de chaque chaîne de caractères sans modifier le code existant.

---

## 2. SYNTHÈSE DE L'INCOHÉRENCE ÉDITORIALE MAJEURE

| Page / Emplacement | Paramètre institutionnel | Valeur actuellement affichée | Fichier source |
| :--- | :--- | :--- | :--- |
| **Page Contact** (`/[locale]/contact`) | Siège social | `Brazzaville, République du Congo` | `src/i18n/dictionaries/fr.ts` (l. 226) & `en.ts` (l. 226) |
| **Page Contact** (`/[locale]/contact`) | Téléphone | `+242 06 536 64 44` | `src/app/(frontend)/[locale]/contact/page.tsx` (l. 124) |
| **Page Contact** (`/[locale]/contact`) | Bureaux secondaires | `Pointe-Noire · Kinshasa · Paris` | `src/i18n/dictionaries/fr.ts` (l. 228) & `en.ts` (l. 228) |
| **Page Groupe** (`/[locale]/groupe`) | Siège social & Bureaux | `Siège social : Brazzaville` / `Bureaux : Pointe-Noire · Kinshasa · Paris` | `src/app/(frontend)/[locale]/groupe/page.tsx` (l. 225-226) |
| **Page Confidentialité** (`/[locale]/confidentialite`) | Siège social du Responsable | `Paris, France` | `src/app/(frontend)/[locale]/confidentialite/page.tsx` (l. 85) |
| **Mentions Légales** (`/[locale]/mentions-legales`) | Siège social | `Paris, France` | `src/app/(frontend)/[locale]/mentions-legales/page.tsx` (l. 93) |
| **Mentions Légales** (`/[locale]/mentions-legales`) | Forme juridique & Capital | `TPE` / `7 500 €` | `src/app/(frontend)/[locale]/mentions-legales/page.tsx` (l. 85, 89) |

---

## 3. AUDIT DÉTAILLÉ DES QUATRE SOURCES POTENTIELLES

### Source A — Code source Next.js (Hardcoded & i18n)
Les textes litigieux se répartissent entre deux mécanismes :
1. **Dictionnaires i18n (`src/i18n/dictionaries/fr.ts` & `en.ts`) :** Contiennent les clés `headquartersCity` ("Brazzaville, République du Congo"), `secondaryCities` ("Pointe-Noire · Kinshasa · Paris"), `coverageCountries` ("Afrique centrale & Projets internationaux à distance").
2. **Composants JSX React hardcodés :**
   - `src/app/(frontend)/[locale]/confidentialite/page.tsx` (l. 85) et `mentions-legales/page.tsx` (l. 93) affichent en dur `Paris, France`.
   - `src/app/(frontend)/[locale]/groupe/page.tsx` (l. 225-226) affiche en dur `Siège social : Brazzaville` et `Bureaux : Pointe-Noire · Kinshasa · Paris`.
   - `src/app/(frontend)/[locale]/contact/page.tsx` (l. 121-125) affiche en dur le numéro `+242 06 536 64 44`.

### Source B — Backend ERPNext v15
- Le DocType Single `Bokengi Site Settings` a été défini historiquement dans le schéma Frappe (`scripts/erpnext/doctypes.json`) avec des valeurs par défaut françaises (`phone: "07 58 88 84 34"`, `address_city: "Paris"`, `address_country: "France"`).
- **Constat technique d'isolation :** La méthode `fetchSiteSettingsFromERPNext` dans [`src/lib/erpnext-client.ts`](file:///E:/01_Projets/Actifs/Bokengi-group/src/lib/erpnext-client.ts) **n'est appelée par aucune page du frontend**. Les pages institutionnelles n'injectent pas dynamiquement ces données depuis l'API REST ERPNext ; les données affichées proviennent exclusivement du code Next.js et des dictionnaires i18n.

### Source C — Historique Git & Origine des Commits
L'analyse par `git log -S` et `git blame` révèle la chronologie exacte de l'apparition des deux versions divergentes :

1. **Vague 1 — 07 Septembre 2026 (Introduction de "Paris, France" et "+33 / 07 58...") :**
   - Commit `d302064` (`fix(legal): finalize contact and legal information`, auteur : `Kalel`, date : `Mon Sep 7 15:22:32 2026`) : A introduit dans `mentions-legales/page.tsx` : `Siège social : Paris, France`, `Forme juridique : TPE`, `Capital social : 7 500 €` et le téléphone `07 58 88 84 34`.
   - Commit `49ebc73` (`fix(legal): finalize privacy contact information`, auteur : `Kalel`, date : `Mon Sep 7 15:32:59 2026`) : A introduit dans `confidentialite/page.tsx` : `Siège social : Paris, France`.

2. **Vague 2 — 20 Septembre 2026 (Introduction de "Brazzaville", "+242 06 536 64 44", "Pointe-Noire", "Kinshasa") :**
   - Commit `2e90a5a` (`description des modifications`, auteur : `Kalel DAMBA`, date : `Sun Sep 20 18:48:58 2026`) :
     - Création de `src/i18n/dictionaries/fr.ts` et `en.ts` avec `headquartersCity: 'Brazzaville, République du Congo'`, `secondaryCities: 'Pointe-Noire · Kinshasa · Paris'`, `coverageCountries: 'Afrique centrale & Projets internationaux à distance'`.
     - Mise à jour de `contact/page.tsx` avec `+242 06 536 64 44`.
     - Création de `groupe/page.tsx` avec `Siège social : Brazzaville`.
     - **Cause racine de l'incohérence :** Lors de cette restructuration bilingue du 20 septembre 2026, les pages `mentions-legales` et `confidentialite` ont été déplacées dans l'arborescence `[locale]` sans que leurs mentions textuelles de siège social ("Paris, France") ne soient réalignées avec les nouvelles coordonnées de contact ("Brazzaville").

### Source D — Production & Hébergement
- Le working tree Git est rigoureusement propre (aucun fichier modifié non commité).
- L'écart provient d'un déphasage historique interne au dépôt Git entre les commits du 7 septembre et du 20 septembre 2026, et non d'un artefact de déploiement ou d'une injection externe.

---

## 4. TABLEAU DE TRAÇABILITÉ EXHAUSTIF

| Contenu audité | Source | Fichier / Emplacement | Commit Git | Date | Validé par propriétaire ? |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Siège social : Brazzaville** | Code / i18n | `src/i18n/dictionaries/fr.ts` (l. 226) & `en.ts` (l. 226)<br>`src/app/(frontend)/[locale]/groupe/page.tsx` (l. 225) | `2e90a5a` | 20/09/2026 | ⚠️ **NON CONFIRMÉ** *(À valider)* |
| **Siège social : Paris, France** | Code JSX | `src/app/(frontend)/[locale]/mentions-legales/page.tsx` (l. 93)<br>`src/app/(frontend)/[locale]/confidentialite/page.tsx` (l. 85) | `d302064`<br>`49ebc73` | 07/09/2026 | ⚠️ **NON CONFIRMÉ** *(À valider)* |
| **Téléphone : +242 06 536 64 44** | Code JSX | `src/app/(frontend)/[locale]/contact/page.tsx` (l. 124) | `2e90a5a` | 20/09/2026 | ⚠️ **NON CONFIRMÉ** *(À valider)* |
| **Téléphone : 07 58 88 84 34** | ERPNext Schema | `scripts/erpnext/doctypes.json` (l. 233) | `d302064` / `2e90a5a` | 07/09/2026 | ⚠️ **NON CONFIRMÉ** *(À valider)* |
| **Bureaux : Pointe-Noire · Kinshasa · Paris** | Code / i18n | `src/i18n/dictionaries/fr.ts` (l. 228) & `en.ts` (l. 228)<br>`src/app/(frontend)/[locale]/groupe/page.tsx` (l. 226) | `2e90a5a` | 20/09/2026 | ⚠️ **NON CONFIRMÉ** *(À valider)* |
| **Zone : Afrique centrale & International** | Code / i18n | `src/i18n/dictionaries/fr.ts` (l. 230) & `en.ts` (l. 230) | `2e90a5a` | 20/09/2026 | ⚠️ **NON CONFIRMÉ** *(À valider)* |
| **Responsable de traitement / DPO** | Code JSX | `src/app/(frontend)/[locale]/confidentialite/page.tsx` (l. 63-95)<br>`src/app/(frontend)/[locale]/mentions-legales/page.tsx` (l. 153-163) | `ffcd293`<br>`49ebc73`<br>`2e90a5a` | 07/09/2026<br>20/09/2026 | ⚠️ **NON CONFIRMÉ** *(À valider)* |
| **Forme juridique (TPE) & Capital (7 500 €)** | Code JSX | `src/app/(frontend)/[locale]/mentions-legales/page.tsx` (l. 85, 89) | `d302064` | 07/09/2026 | ⚠️ **NON CONFIRMÉ** *(À valider)* |
| **Email : contact@bokengi-group.com** | Config & Env | `src/config/site.ts` (l. 27)<br>`.env.example` (l. 22) | `746a5d3` / `2e90a5a` | 04/09/2026 | ⚠️ **NON CONFIRMÉ** *(À valider)* |

---

## 5. DÉCISION DE VALIDATION & CONCLUSION DE L'AUDIT

### Conclusion formelle : **CAS B & CAS A (Contenu introduit lors de commits historiques identifiés)**

1. **Preuve d'origine :** Les contenus n'ont été ni inventés par l'agent lors des phases 7.1 à 8.1, ni injectés par une source externe non contrôlée. Ils proviennent de commits historiques successifs (`d302064`/`49ebc73` le 7 septembre 2026, puis `2e90a5a` le 20 septembre 2026).
2. **Nature de l'incohérence :** Une mise à jour partielle lors de la transition multilingue du 20 septembre 2026 a actualisé les pages `/contact` et `/groupe` (Brazzaville, +242) sans répercuter ces changements sur les pages légales `/mentions-legales` et `/confidentialite` (qui sont restées sur Paris, France).
3. **Application de la règle de gouvernance :** **Aucune harmonisation automatique n'a été effectuée.** Le code demeure sous gel strict.

---

## 6. QUESTIONS SOUMISES À LA DÉCISION DU PROPRIÉTAIRE DU PROJET

Avant toute mise en production (Phase 9) ou modification de code (Phase 8.2), le propriétaire du projet doit trancher et valider explicitement les éléments suivants :

1. **Siège social officiel & adresse juridique :**
   - Option 1 : Siège social à **Brazzaville, République du Congo** (avec mention éventuelle d'un bureau de liaison/représentation à Paris).
   - Option 2 : Siège social à **Paris, France** (avec bureaux régionaux à Brazzaville, Pointe-Noire, Kinshasa).
   - Option 3 : Autre formulation statutaire exacte à fournir par la direction.
2. **Numéro de téléphone institutionnel officiel :**
   - Confirmer s'il s'agit du `+242 06 536 64 44` (Congo), d'un numéro français (+33), ou d'une suppression de la ligne téléphonique directe au profit du formulaire de contact / Cal.com.
3. **Forme juridique, Capital & Statuts (Mentions légales) :**
   - Confirmer la forme juridique ("TPE", "SAS", "SARL", ou mention "Société en cours d'immatriculation").
   - Confirmer le montant du capital social ou sa mention.
4. **Directeur de publication :**
   - Confirmer le nom et titre du directeur de la publication (actuellement "Direction éditoriale").
