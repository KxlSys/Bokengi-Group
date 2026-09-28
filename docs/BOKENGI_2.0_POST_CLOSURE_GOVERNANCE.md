# BOKENGI GROUP 2.0 — GOUVERNANCE POST-CLÔTURE & GESTION DES CHANGEMENTS

**Date de Prise d'Effet :** 26 Septembre 2026  
**Référence Canonique :** [`BOKENGI_2.0_MASTER_STATUS.md`](file:///E:/01_Projets/Actifs/Bokengi-group/BOKENGI_2.0_MASTER_STATUS.md)  
**Baseline Officielle :** Phase 10.8 (`PHASE10_8_PRODUCTION_ACTIVATION.md`)  
**Statut du Programme :** `CLOSED`  

---

## 1. DÉFINITION DE LA BASELINE 10.8

La **Phase 10.8** constitue la baseline officielle, figée et certifiée du système d'information de **Bokengi Group 2.0** :
- Façade Web publique Next.js 16 / Cloudflare Workers (SSR/SSG bilingue FR/EN).
- Business Core ERPNext v15 (Application `bokengi_erp`, 10 DocTypes, 20 Items services, 6 Custom Fields Lead).
- Module Agenda Cal.com avec vérification cryptographique HMAC SHA-256 et idempotence 24h.
- Hub Collaboratif Mattermost avec passerelle 4 canaux et minimisation stricte RGPD.
- Suite de tests automatisée à 100% de succès (**38/38 PASS, 0 régression**).
- Verrou comptable étanche : aucune émission automatique de facture sans validation humaine dans Desk.
- Exclusion formelle et définitive du projet InfraPulse.

---

## 2. RÈGLES DE MODIFICATION POST-CLÔTURE

1. **Interdiction de Modifications Spontanées :** Aucun code, configuration, schéma de base de données ou pipeline ne peut être altéré sans émission préalable d'une **Demande de Changement (Change Request - CR)** formellement approuvée.
2. **Fin des Phases 10.x :** Aucune nouvelle sous-phase 10.x ne peut être créée. Tout travail ultérieur relève du cadre *Post-Closure Evolution*.
3. **Immutabilité des Archives :** Les rapports des Phases 9.0 à 10.8 constituent des archives immuables traçables.

---

## 3. PROCESSUS DE GESTION DES DEMANDES DE CHANGEMENT (CHANGE REQUEST)

Toute intervention future doit faire l'objet d'un ticket **CR (Change Request)** documenté comportant :
- **Identifiant :** `CR-BOKENGI-YYYY-NNN`
- **Typologie du Changement :**
  - **Correction d'Anomalie Critique (Hotfix P1) :** Réparation immédiate d'une interruption de service avérée selon le plan [`BOKENGI_2.0_INCIDENT_RESPONSE.md`](file:///E:/01_Projets/Actifs/Bokengi-group/BOKENGI_2.0_INCIDENT_RESPONSE.md).
  - **Maintenance Préventive / Corrective :** Mise à jour de sécurité de dépendances sans impact fonctionnel.
  - **Évolution Fonctionnelle Métier :** Déblocage des 4 arbitrages financiers (Tarifs, Naming, IBAN, Conditions) ou intégration de nouveaux modules (OpenStatus, Umami Analytics).
- **Justification & Analyse d'Impact :** Composants impactés, plan de rollback et couverture de tests requise (non-régression sur les 38 tests existants).
- **Validation Mandataire :** Accord explicite de la direction avant toute mise en œuvre.

---

## 4. GOUVERNANCE FINANCIÈRE & RESPONSABILITÉS

- **Les 4 arbitrages métier restent sous la responsabilité exclusive de la direction :**
  1. Politique tarifaire officielle des 20 `Items`.
  2. Convention de Naming Series (`QTN/SO/ACC-SINV` vs `DEV/CMD/FAC`).
  3. Coordonnées bancaires officielles (IBAN / BIC / SWIFT).
  4. Conditions de règlement et acomptes.
- **Règle absolue d'intégrité :** Aucune donnée bancaire, tarifaire ou fiscale ne doit être inventée ou générée de manière fictive.

---

## 5. ATTESTATION OFFICIELLE DE FREEZE

```text
================================================================================
BOKENGI 2.0 INITIAL INTEGRATION PROGRAM
STATUS: CLOSED
BASELINE: PHASE 10.8
NEXT WORK: ONLY BY EXPLICIT CHANGE REQUEST
================================================================================
```
