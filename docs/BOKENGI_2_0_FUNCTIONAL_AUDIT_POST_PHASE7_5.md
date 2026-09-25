# BOKENGI GROUP 2.0 — AUDIT FONCTIONNEL COMPLET POST-PHASE 7.5

## 1. CONTEXTE & OBJECTIF DE L'AUDIT

L'achèvement des phases 7.1 à 7.5 a permis de doter la plateforme **Bokengi Group 2.0** de l'ensemble de ses intégrations fonctionnelles et techniques externes (CRM Leads, Cal.com, OpenStatus, Umami, Sitemap dynamique & Robots.txt), le tout adossé exclusivement à **ERPNext v15** et **Cloudflare R2**.

Cet audit compare rigoureusement le cahier des charges historique avec l'état réel du code source afin de dresser la cartographie exacte de ce qui est achevé, en attente ou restant à relier de bout en bout.

---

## 2. MATRICE FONCTIONNELLE DE BOUT EN BOUT

| Fonctionnalité | État actuel | Cahier des charges | ERPNext concerné | Frontend concerné | Manquant | Priorité |
|---|---|---|---|---|---|---|
| **1. Pôles d'expertise** | **100% Opérationnel** | Présentation des 5 pôles | `Bokengi Pole` | `[locale]/expertises/[slug]` | Aucun | Terminée ✅ |
| **2. Services & Offres** | **100% Opérationnel** | 20 services détaillés | `Bokengi Service` | `[locale]/expertises/[slug]` | Aucun | Terminée ✅ |
| **3. Réalisations / Case Studies** | **100% Opérationnel** | Études de cas & projets | `Bokengi Case Study` | `[locale]/realisations` | Aucun | Terminée ✅ |
| **4. Actualités & Publications** | **100% Opérationnel** | Blog & articles de fond | `Bokengi Post` | `[locale]/actualites/[slug]` | Aucun | Terminée ✅ |
| **5. Formulaire Contact / CRM** | **100% Opérationnel** | Capture prospect & devis | `Lead` | `[locale]/contact`, `/api/leads` | Aucun côté Next.js (SMTP en prod) | Terminée ✅ |
| **6. Demande d'Accès Sécurisé** | **Partiellement terminé (Mock API)** | Demande d'habilitation | À relier (`Lead` / `User`) | `[locale]/demande-acces`, `/api/access-requests` | Persistance réelle dans ERPNext | **Haute (Phase 7.6)** |
| **7. Devis & Facturation** | **Prêt côté ERP (Desk)** | Gestion commerciale | `Quotation`, `Sales Invoice` | Aucun tunnel public (géré via ERPDesk) | Documentation workflow commercial | **Moyenne (Phase 7.7)** |
| **8. Prise de RDV Cal.com** | **Prêt (Standby)** | Agenda visioconférence | N/A | `CalBooking.tsx` | Renseignement slug prod | Basse (Activation) |
| **9. Observabilité OpenStatus** | **Prêt (Standby)** | Statut public & uptime | N/A | `OpenStatusBadge.tsx` | Sondes & URL prod | Basse (Activation) |
| **10. Analytics Umami** | **Prêt (Standby)** | Audience éthique RGPD | N/A | `UmamiAnalytics.tsx` | Website ID prod | Basse (Activation) |
| **11. SEO Sitemap & Robots** | **100% Opérationnel** | Indexation XML dynamique | `Bokengi Pole`, `Bokengi Post` | `src/app/sitemap.ts`, `robots.ts` | Aucun | Terminée ✅ |
| **12. Multilinguisme FR / EN** | **100% Opérationnel** | Plateforme bilingue | Champs multilingues ERPNext | `src/i18n/*`, routage `[locale]` | Aucun | Terminée ✅ |

---

## 3. ANALYSE DÉTAILLÉE DES COMPOSANTS CLÉS

### 3.1. Demande d'accès sécurisé (`/api/access-requests`)
- **Constat technique :** La route `/api/access-requests` applique les validations anti-spam, de rate limiting et d'interdiction de privilèges (`super-admin`), mais renvoie un identifiant mocké (`erpnext-${Date.now()}`) sans appel effectif à l'API REST d'ERPNext.
- **Action nécessaire (Phase 7.6) :** Connecter la route à ERPNext pour persister la demande sous forme de `Lead` qualifié (tag *"Demande d'accès"*) ou via une méthode RPC dédiée, garantissant que la direction technique reçoit une notification d'habilitation.

### 3.2. Devis et Facturation (Quotation & Sales Invoice)
- **Constat technique :** L'ancien module Payload de génération de factures PDF personnalisé a été supprimé lors du décommissionnement.
- **Architecture ERPNext v15 :** ERPNext intègre nativement un moteur complet de devis (`Quotation`), de commandes (`Sales Order`) et de facturation (`Sales Invoice`). Le site Bokengi 2.0 transmet les besoins prospects sous forme de `Lead`. La conversion en `Quotation` puis `Sales Invoice` s'effectue directement dans l'interface ERPNext Desk par les chargés d'affaires.
- **Action nécessaire (Phase 7.7) :** Cadrer et formaliser le runbook de traitement commercial `Lead → Devis/Facturation` dans ERPNext Desk.

### 3.3. Intégrations Tiers (Cal.com, OpenStatus, Umami)
- **Code implémenté :** 100% conforme, accessible, résilient et typé.
- **Configuration locale :** Validée (`false` par défaut / Standby).
- **Configuration production :** Les variables sont prêtes à être injectées sur l'hébergeur lors du déploiement.

---

## 4. PROCHAINE PHASE RECOMMANDÉE

Pour finaliser le dernier flux de données encore non relié à ERPNext :

> **PHASE 7.6 — LIAISON DES DEMANDES D'ACCÈS SÉCURISÉES DANS ERPNEXT (`/demande-acces`)**  
> *Objectif : Remplacer le mock de `/api/access-requests` par une persistance réelle dans ERPNext v15 avec notification immédiate à la direction technique.*
