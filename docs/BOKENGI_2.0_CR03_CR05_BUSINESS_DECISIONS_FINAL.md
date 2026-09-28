# BOKENGI GROUP 2.0 — REGISTRE OFFICIEL DES ARBITRAGES MÉTIER (CR-03 + CR-05)

**Chantier :** Framework Financier & Facturation Électronique Multi-Pays (`CR-03` + `CR-05`)  
**Date de Mise à Jour :** 26 Septembre 2026  
**Version :** 2.1.0 — Final Business Decisions Record (Updated)  
**Statut Officiel :** 🟢 **READY FOR PRODUCTION (ARBITRAGES MÉTIER ENREGISTRÉS)**  
**Classification :** Registre Officiel de Gouvernance & Paramétrage Métier  

---

## 1. Contexte & Enregistrement des Décisions

Le framework technique logiciel est **100% validé en staging (85/85 tests PASS)**. Les arbitrages métier complets et mis à jour transmis par la direction générale sont officiellement actés et consignés dans le présent document.

```
================================================================================
  BOKENGI GROUP 2.0 — RÉCAPITULATIF DES ARBITRAGES ENREGISTRÉS
================================================================================
  1. Modèle Tarifaire      : MIXTE (Configurable individuellement Forfait ou TJM par SRV-*)
  2. Domiciliation Banque  : PARIS, FRANCE (Banque 28233 Revolut, IBAN FR76..., BIC REVOFRP2)
  3. Identité Légale       : TPE (Statut provisoire / SIRET en cours d'attribution)
  4. Naming Series         : VALIDÉES (FR: DEV/CMD/FAC/AVR | INT: QTN/SO/SINV/ACC-CN)
  5. Conditions Règlement  : DÉLAI FIXÉ À 30 JOURS POUR LES PRESTATIONS CONCERNÉES
  6. Déploiement Prod      : EN ATTENTE DES DERNIÈRES DONNÉES RÉELLES (Zéro valeur fictive)
================================================================================
```

---

## 2. Détail des Arbitrages Métier Validés

### 2.1. Tarification : Modèle Commercial Dynamique (Forfait ou TJM par Projet)
- **Architecture Définitive :**
  - Le catalogue des 20 prestations `SRV-*` constitue le référentiel d'ingénierie et de delivery.
  - Chaque prestation peut être facturée selon les deux modèles :
    1. **FORFAIT :** Montant fixé au niveau du devis (`Quotation`), de la commande (`Sales Order`) ou du contrat.
    2. **TJM / RÉGIE :** Tarif journalier $\times$ quantité de temps passée (`Timesheet`).
  - **Détermination Commerciale :** Les montants ne sont pas figés de manière arbitraire dans le catalogue : ils sont déterminés commercialement lors de chaque négociation de projet.
  - **Capacité ERPNext :** Le système permet cette souplesse tarifaire nativement au niveau de la ligne d'article sans modification de code.

---

### 2.2. Coordonnées Bancaires & Domiciliation Officielles
Les coordonnées bancaires destinées à figurer sur les factures et formats d'impression légaux sont enregistrées :

```yaml
# CONFIGURATION BANCAIRE BOKENGI GROUP (CONFIGURÉE DANS LES FORMATS D'IMPRESSION)
Libellé_Raison: "Paiement projet"
Banque_Code: "28233"                   # Revolut Bank
Titulaire_du_Compte: "Providence DAMBA"
IBAN: "FR76 2823 3000 0175 1010 7748 179"
BIC_SWIFT: "REVOFRP2"
Domiciliation_Ville: "Paris"
Domiciliation_Pays: "France"
```

> [!NOTE]
> Ces coordonnées sont réservées aux formats d'impression légaux et aux variables d'environnement sécurisées, sans exposition dans les logs applicatifs publics.

---

### 2.3. Identité Légale de l'Entité
- **Statut / Forme déclarée actuellement :** **TPE** *(donnée provisoire en attente de la forme juridique définitive)*.
- **Numéro SIRET :** **EN COURS D'ATTRIBUTION** *(aucun numéro inventé ou substitué)*.

---

### 2.4. Séquences de Numérotation (Naming Series) par Juridiction
Le routage dynamique applique les préfixes suivants selon le contexte contractuel et territorial :

| Juridiction | Devis | Bon de Commande | Facture de Vente | Avoir Comptable |
| :--- | :---: | :---: | :---: | :---: |
| **France (FR_STANDARD)** | `DEV-.YYYY.-` | `CMD-.YYYY.-` | `FAC-.YYYY.-` | `AVR-.YYYY.-` |
| **International (INT_STANDARD)** | `QTN-.YYYY.-` | `SO-.YYYY.-` | `SINV-.YYYY.-` | `ACC-CN-.YYYY.-` |

*Règle : Continuité chronologique sans rupture garantie sur l'ensemble des séries comptables.*

---

### 2.5. Politiques et Grilles de Règlement Validées

| Profil de Prestation | Acompte à la Commande | Solde & Condition Déclenchante | Délai de Paiement Retenu |
| :--- | :---: | :---: | :---: |
| **Projet Standard** | **30 %** | **70 %** à livraison / validation (PV signé) | **30 jours net** |
| **Projet à Risque / Important** | **50 %** | **50 %** à livraison / validation (PV signé) | **30 jours net** |
| **Petite Prestation Ponctuelle** | **0 % à 30 %** *(paramétrable)* | Solde à livraison | **15 jours net** |
| **Régie / Assistance Technique (TJM)** | **0 %** (Pas d'acompte) | Facturation périodique (Timesheets) | **30 jours net** *(fixé)* |
| **Abonnement / Infogérance SaaS** | **0 %** | Facturation mensuelle ou annuelle | **À échéance** |
| **Contrat International** | Selon contrat | Selon contrat | Devise & délai selon contrat |

---

## 3. Données Administratives en Attente d'Attribution

La tarification étant désormais opérationnelle sous le modèle dynamique (Forfait / TJM au devis), les seuls éléments administratifs en attente sont :

1. **Forme juridique officielle définitive** *(lorsque celle-ci remplacera le statut provisoire TPE)* ;
2. **Numéro SIRET officiel** *(dès attribution par l'administration)*.

---

## 4. Statut de Clôture & Préparation au Déploiement

- **Framework Logiciel :** **🟢 READY FOR PRODUCTION (85/85 TESTS PASS)**
- **Tarification :** **🟢 OPÉRATIONNELLE (Modèle dynamique Forfait / TJM par projet validé)**
- **Aucun déploiement en production n'est effectué à ce stade sans ordre formel.**
- L'infrastructure et le runbook d'exécution sont scellés et prêts.

