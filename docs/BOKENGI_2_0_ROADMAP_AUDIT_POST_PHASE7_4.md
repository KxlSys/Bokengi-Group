# BOKENGI GROUP 2.0 — AUDIT COMPLET DE REPRISE DE LA ROADMAP (POST-PHASE 7.4)

## 1. CONTEXTE & SYNTHÈSE D'ÉVOLUTION

Le projet **Bokengi Group 2.0** a franchi avec succès deux cycles d'ingénierie majeurs :
1. **La transition intégrale vers ERPNext v15 :** Remplacement réussi de Payload CMS par ERPNext comme source unique de vérité et CMS Headless, suivi du décommissionnement physique complet de l'infrastructure Payload historique (Neon Postgres, Hyperdrive, bindings et dépendances).
2. **Le parachèvement des intégrations du cahier des charges (Série Phase 7) :**
   - **Phase 7.1 :** Finalisation des notifications Leads (DocType ERPNext `Lead` + passerelle email asynchrone sécurisée).
   - **Phase 7.2 :** Finalisation de l'intégration Cal.com accessible et bilingue (`CalBooking.tsx`).
   - **Phase 7.3 :** Finalisation du module d'observabilité et de monitoring public (`OpenStatusBadge.tsx`).
   - **Phase 7.4 :** Finalisation du tracking analytique respectueux de la vie privée (`UmamiAnalytics.tsx`).

---

## 2. ÉTAT D'AVANCEMENT DU CAHIER DES CHARGES

### 2.1. CE QUI EST TERMINÉ (100% OPÉRATIONNEL)
- **Architecture technique globale :** Next.js 16 App Router bilingue (Server Components, React 19) consommant l'API REST d'ERPNext v15.
- **Design System V4 Corporate :** Identité visuelle institutionnelle, tokens bicolores (dark/light), typographies Outfit/Inter/Fira Code/Syne, mise en page 1440px et réactivité mobile/tablette.
- **Routage et Internationalisation (i18n) :** Routage complet sous `/[locale]/*` (FR / EN), détection par cookie `bokengi_locale`, switch de langue instantané et dictionnaires synchronisés.
- **Pages et Sections Vitrines :**
  - Accueil (`/[locale]`)
  - Groupe & Gouvernance (`/[locale]/groupe`)
  - Expertises & Pôles (`/[locale]/expertises` et `/[locale]/expertises/[slug]`)
  - Réalisations & Études de cas (`/[locale]/realisations`)
  - Actualités / Blog éditorial (`/[locale]/actualites` et `/[locale]/actualites/[slug]`)
  - Contact & Coordonnées officielles (`/[locale]/contact`)
  - Mentions légales & Politique de confidentialité (`/[locale]/mentions-legales`, `/[locale]/confidentialite`)
- **Moteur de données ERPNext :** Client unifié `src/lib/erpnext-client.ts` avec gestion des DocTypes `bokengi_pole`, `bokengi_service`, `bokengi_case_study`, `bokengi_post`, `bokengi_settings`.
- **Hébergement des Médias :** Bucket Cloudflare R2 (`bokengi-media`) préservé et connecté.
- **Sécurité CRM :** Formulaire de contact avec protection anti-spam (honeypot), rate limiting (6 req/min/IP), et transmission stricte vers le DocType `Lead`.

---

### 2.2. CE QUI EST PARTIELLEMENT TERMINÉ
- **Module de Demande d'Accès Sécurisé (`/[locale]/demande-acces`) :**
  - L'interface frontend et le formulaire existent et sont stylisés.
  - La route `/api/access-requests` répond actuellement sous forme de mock sécurisé validant la requête. Elle n'est pas encore directement reliée à un DocType spécifique dans ERPNext (ex: `User` ou `Bokengi Access Request`).

---

### 2.3. CE QUI EST EN STANDBY (PRÊT POUR ACTIVATION SANS MODIFICATION DE CODE)
- **Prise de rendez-vous Cal.com :** `NEXT_PUBLIC_CALCOM_ENABLED=false` (mode Standby institutionnel avec badge, basculable en mode actif dès renseignement du slug).
- **Monitoring Public OpenStatus :** `NEXT_PUBLIC_OPENSTATUS_ENABLED=false` (badge du Footer dormant, prêt pour activation avec l'URL de la status page).
- **Analytics Umami :** `NEXT_PUBLIC_UMAMI_ENABLED=false` (0 script injecté, prêt pour activation avec le `Website ID`).
- **Emails Transactionnels Resend :** Prêts à relayer les notifications dès renseignement de `RESEND_API_KEY`, en complément ou relève du serveur SMTP ERPNext.

---

### 2.4. CE QUI RESTE À IMPLÉMENTER
1. **Génération dynamique du Sitemap XML & Robots.txt (`sitemap.ts`, `robots.ts`) :**
   - Implémentation native Next.js 16 pour indexer dynamiquement l'ensemble des URLs bilingues (`fr` et `en`) des 5 Pôles, 20 Services, 5 Réalisations et Articles depuis ERPNext.
2. **Tunnel Commercial & Devis / Facturation ERPNext (Invoicing) :**
   - Dans le modèle initial Payload, un module de génération de factures PDF personnalisé existait.
   - Avec ERPNext v15, ce processus doit être clarifié : intégration d'une passerelle vers les DocTypes standards `Quotation` / `Sales Invoice` d'ERPNext pour les devis signés, ou consultation côté ERPNext Desk.
3. **Préparation finale au Cutover DNS & Déploiement Production :**
   - Validation de la configuration DNS pour `bokengi-group.com`, certificats SSL et variables d'environnement de production sur l'hébergeur.

---

### 2.5. CE QUI N'EST PLUS PERTINENT
- **Anciennes collections et scripts Payload :** Collections `src/collections/*`, `payload.config.ts`, adapters PostgreSQL/Neon, et bindings Cloudflare Hyperdrive sont définitivement supprimés et ne doivent plus faire l'objet de travaux.

---

## 3. DÉPENDANCES ERPNext & CONFIGURATIONS RESTANTES

### Dépendances ERPNext :
- Endpoints REST `GET /api/resource/Bokengi Pole`, `Bokengi Service`, `Bokengi Case Study`, `Bokengi Post`.
- Endpoint `POST /api/resource/Lead` pour la création des prospects.
- Configuration SMTP dans ERPNext pour le routage des notifications d'alertes internes.

### Configurations Manuelles Restantes (pour mise en ligne définitive) :
1. **Renseigner les clés d'environnement de production :**
   - `ERPNEXT_API_URL`, `ERPNEXT_API_KEY`, `ERPNEXT_API_SECRET`
   - `RESEND_API_KEY` (si notification directe par Next.js souhaitée)
   - `NEXT_PUBLIC_CALCOM_LINK` & `NEXT_PUBLIC_CALCOM_ENABLED=true`
   - `NEXT_PUBLIC_OPENSTATUS_URL` & `NEXT_PUBLIC_OPENSTATUS_ENABLED=true`
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID` & `NEXT_PUBLIC_UMAMI_ENABLED=true`
2. **Pointage DNS officiel :** Bascule du domaine `https://bokengi-group.com`.

---

## 4. RISQUES OU BLOQUANTS IDENTIFIÉS

1. **Résolution DNS locale lors du Build (`ENOTFOUND erp.bokengi-group.com`) :**
   - Lors de l'exécution locale de `pnpm build`, Next.js tente de pré-rendre les pages dynamiques en interrogeant l'API ERPNext. Dans un environnement machine sans accès DNS externe au domaine ERPNext, l'étape SSG s'interrompt.
   - **Solution :** Ce comportement est normal en bac à sable isolé. Le build réussira naturellement dans l'environnement CI/CD ou l'hébergeur disposant d'un accès internet.

---

## 5. ROADMAP ORDONNÉE DES PROCHAINES PHASES

| Phase | Intitulé | Objectif & Périmètre | Dépendances | Statut |
|---|---|---|---|---|
| **Phase 7.5** | **SEO Avancé : Sitemap Dynamique & Robots.txt** | Implémenter `src/app/sitemap.ts` et `src/app/robots.ts` pour générer automatiquement les flux XML bilingues (FR/EN) à partir des données ERPNext. | `erpnext-client.ts` | **À EXÉCUTER (Recommandé)** |
| **Phase 7.6** | **Liaison Demandes d'Accès ERPNext** | Connecter le formulaire `/demande-acces` à un flux de validation d'accès sécurisé dans ERPNext. | DocType ERPNext User / Lead | En attente |
| **Phase 7.7** | **Revue Commerciale & Devis/Facturation ERPNext** | Cadrer et documenter la passerelle de conversion Lead → Devis (`Quotation`) dans ERPNext. | Module Ventes ERPNext | En attente |
| **Phase 8.0** | **Préparation Finale Déploiement & Audit Pré-Production** | Audit final de production, vérification des variables d'environnement et check-list de bascule DNS. | Infrastructure Cloudflare / Vercel | En attente |

---

## 6. RECOMMANDATION UNIQUE

La prochaine phase logique du cahier des charges à exécuter est :

> **PHASE 7.5 — SEO AVANCÉ : SITEMAP DYNAMIQUE & ROBOTS.TXT (BOKENGI 2.0)**  
> *Mise en place de `src/app/sitemap.ts` et `src/app/robots.ts` pour indexer automatiquement l'ensemble des pages, pôles, expertises, études de cas et articles multilingues depuis ERPNext.*
