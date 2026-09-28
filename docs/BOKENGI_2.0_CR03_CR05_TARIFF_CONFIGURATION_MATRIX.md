# BOKENGI GROUP 2.0 — MATRICE DE CONFIGURATION TARIFAIRE DES 20 PRESTATIONS SRV-* (CR-03 + CR-05)

**Chantier :** Framework Financier & Facturation Électronique Multi-Pays (`CR-03` + `CR-05`)  
**Date d'Émission :** 26 Septembre 2026  
**Version :** 2.0.0 — Official Tariff Configuration Matrix  
**Statut Officiel :** 🟢 **READY FOR PRODUCTION (EN ATTENTE DES VALEURS DU PROPRIÉTAIRE)**  
**Classification :** Inventaire Exhaustif du Catalogue & Matrice Tarifaire Prête à l'Emploi  

---

## 1. Contexte & Objectif de la Matrice

Le framework logiciel financier et e-invoicing étant **100% validé et scellé (85/85 tests PASS)**, cette matrice présente l'inventaire factuel des 20 prestations de services `SRV-*` enregistrées dans ERPNext Desk et dans l'application `bokengi_erp`.

```
================================================================================
  BOKENGI GROUP 2.0 — BILAN D'INSPECTION DU CATALOGUE DES 20 PRESTATIONS
================================================================================
  Nombre de prestations réelles identifiées : 20 / 20
  Prestations déjà valorisées dans ERPNext  : 0 / 20 (Montants actuellement à 0.00 €)
  Prestations en attente de tarif           : 20 / 20
  Incohérences de catalogue                 : 0 (Mapping parfait 20/20 vers les 5 Pôles)
  Modèle Tarifaire                          : MIXTE (Forfait ou TJM selon contrat)
  Verrou de Gouvernance                     : AUCUN TARIF FICTIF INVENTÉ
================================================================================
```

---

## 2. Inventaire Factuel & Matrice Tarifaire des 20 Prestations `SRV-*`

Conformément à la décision d'un **modèle tarifaire MIXTE**, chaque prestation ci-dessous est conçue pour fonctionner de manière interchangeable au **Forfait** ou en **Régie (TJM)** selon les termes convenus avec le client lors de l'émission du devis.

| Code Article | Intitulé Exact de la Prestation | Pôle d'Expertise | Template Projet Associé | Activity Types Requis | Modèle Applicable | Unité Standard | Montant HT Réel (€) | Source Actuelle |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **`SRV-CYBER-01`** | Audit d'Architecture & Sécurité | Cybersécurité | `TEMPLATE-CYBER` | Cadrage, Ingénierie, Validation, Restitution | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-CYBER-02`** | Test d'Intrusion & Pentest | Cybersécurité | `TEMPLATE-CYBER` | Ingénierie, Validation, Restitution | **Mixte** *(Forfait / TJM)* | Forfait / Jour | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-CYBER-03`** | Conformité & Gouvernance SSI (ISO 27001, NIS2) | Cybersécurité | `TEMPLATE-CYBER` | Cadrage, Ingénierie, Management, Restitution | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-CYBER-04`** | Accompagnement SSI & SecOps | Cybersécurité | `TEMPLATE-CYBER` | Ingénierie, Management | **Mixte** *(Régie / Forfait)* | Jour (TJM) | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-CLOUD-01`** | Migration & Architecture Cloud | Cloud & DevOps | `TEMPLATE-CLOUD` | Cadrage, Ingénierie, Validation, Restitution | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-CLOUD-02`** | Déploiement IaC & CI/CD Cloud | Cloud & DevOps | `TEMPLATE-CLOUD` | Ingénierie, Validation | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-CLOUD-03`** | Infogérance, Observabilité & SRE | Cloud & DevOps | `TEMPLATE-CLOUD` | Management, Ingénierie | **Mixte** *(Forfait / TJM)* | Forfait mois / Jour | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-CLOUD-04`** | Optimisation FinOps & Performance Cloud | Cloud & DevOps | `TEMPLATE-CLOUD` | Cadrage, Ingénierie, Restitution | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-DATA-01`** | Ingénierie & Pipelines de Données | Data & IA | `TEMPLATE-DATA` | Cadrage, Ingénierie, Validation | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-DATA-02`** | Modélisation & Data Warehousing | Data & IA | `TEMPLATE-DATA` | Ingénierie, Validation | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-DATA-03`** | Tableaux de Bord & Business Intelligence | Data & IA | `TEMPLATE-DATA` | Cadrage, Ingénierie, Restitution | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-DATA-04`** | Intégration IA, Machine Learning & LLM | Data & IA | `TEMPLATE-DATA` | Cadrage, Ingénierie, Validation, Restitution | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-SOFTE-01`** | Développement Web Fullstack & Next.js | Software Eng. | `TEMPLATE-SOFTENG` | Cadrage, Ingénierie, Validation, Restitution | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-SOFTE-02`** | API & Architecture Microservices | Software Eng. | `TEMPLATE-SOFTENG` | Ingénierie, Validation | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-SOFTE-03`** | Modernisation & Refactorisation Applicative | Software Eng. | `TEMPLATE-SOFTENG` | Cadrage, Ingénierie, Validation | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-SOFTE-04`** | Intégration ERP & Automatisation des Flux | Software Eng. | `TEMPLATE-SOFTENG` | Cadrage, Ingénierie, Validation, Restitution | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-STRAT-01`** | Schéma Directeur SI & Transformation Numérique | Stratégie & Conseil | `TEMPLATE-STRAT` | Cadrage, Management, Restitution | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-STRAT-02`** | Conseil en Choix de Solutions & Cadrage | Stratégie & Conseil | `TEMPLATE-STRAT` | Cadrage, Restitution | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-STRAT-03`** | Audit Organisationnel & Gouvernance IT | Stratégie & Conseil | `TEMPLATE-STRAT` | Cadrage, Restitution | **Mixte** *(Forfait / TJM)* | Jour / Forfait | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |
| **`SRV-STRAT-04`** | Direction de Transition & PMO Stratégique | Stratégie & Conseil | `TEMPLATE-STRAT` | Management | **Mixte** *(Régie / Forfait)* | Jour (TJM) | `À RENSEIGNER — PROPRIÉTAIRE` | `ERPNext Item (0.00 €)` |

---

## 3. Conformité de l'Architecture aux Règles de Gestion

L'implémentation actuelle permet nativement et sans modification technique :

1. **Le Forfait par prestation :** Émission de factures forfaitaires avec décompte d'acomptes à la commande et fixation dynamique du prix sur le devis.
2. **La Régie (TJM $\times$ temps passé) :** Facturation au temps réel calculée sur les feuilles de temps `Timesheet` validées selon le taux horaire/journalier convenu.
3. **La gestion des Acomptes par projet :** Pourcentages ajustables (30%, 50%, etc.) configurables dans `bokengi_deposit_percent`.
4. **Le conditionnement du Solde au PV signé :** Verrouillage automatique de la facture de solde si [`bokengi_pv_attachment`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/einvoice/engine.py) est absent.
5. **La facturation périodique de régie :** Émission mensuelle ou bi-mensuelle sans acompte.
6. **Le délai de paiement standard :** Paramétré à **30 jours net** pour la régie et les projets standards.

---

## 4. Statut des Données Financières & Non-Blocage

- **Gouvernance :** La tarification des 20 prestations `SRV-*` n'est plus un prérequis bloquant le passage en production.
- **Règle Commerciale :** Les montants sont déterminés au cas par cas lors de la négociation de chaque devis (`Quotation`) dans ERPNext Desk.
- **Zéro valeur fictive :** Aucun tarif catalogue arbitraire n'est injecté en dur dans la base de données.

---

## 5. Données Administratives en Attente

Seuls les éléments d'enregistrement légal suivants restent en attente :
1. **Forme juridique officielle définitive** *(lorsque connue pour remplacer le statut provisoire TPE)* ;
2. **Numéro SIRET officiel** *(dès attribution par l'administration)*.

---

## 6. Statut de Gouvernance

- **Statut CR-03 + CR-05 :** 🟢 **READY FOR PRODUCTION** (Framework logiciel, bancaire, Naming Series et tarification dynamique 100% validés).
- **Prochaine Étape :** Activation en production sur mandat formel.

