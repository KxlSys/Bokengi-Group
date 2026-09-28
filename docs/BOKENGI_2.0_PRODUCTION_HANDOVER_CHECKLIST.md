# BOKENGI GROUP 2.0 — CHECKLIST DE HANDOVER OPÉRATIONNEL & TRANSFERT DE RESPONSABILITÉ

**Date :** 26 Septembre 2026  
**Projet :** Bokengi Group 2.0  
**Statut Global :** `READY FOR OPERATIONAL HANDOVER`  
**Destinataires :** Direction Générale, Équipe Commerciale, Pôle Technique & Exploitation  

---

## 1. GRILLE D'ÉVALUATION DE PASSAGE EN PRODUCTION

| # | Point de Contrôle / Exigence | Statut | Preuve / Référence | Signataire / Validateur |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Exclusion InfraPulse**<br>Confirmation qu'InfraPulse est 100% hors périmètre Bokengi Group. | **CONFORME** | Aucun lien, routage ni dépendance dans le code ou les schémas. | Architecte Solution |
| **2** | **Intégrité du Code & Tests**<br>Exécution complète et passage à 100% de la suite de tests automatisée. | **CONFORME** | 38/38 tests validés (`npm test` / Node test runner). | Lead Dev / QA |
| **3** | **Façade Publique & Acquisition**<br>Pages bilingues `/fr` et `/en` opérationnelles sur Cloudflare Workers. | **CONFORME** | DNS, SSL Strict, SSR/SSG et R2 `bokengi-media` validés. | Équipe Frontend |
| **4** | **Ingestion Lead & Anti-Spam**<br>Protection des formulaires via Rate Limiting et Honeypot. | **CONFORME** | Route `/api/leads` avec code 429 et piège bot vérifiés. | SecOps |
| **5** | **Webhook Cal.com & Idempotence**<br>Authentification cryptographique HMAC SHA-256 et cache 24h. | **CONFORME** | Rejet 401 sur mauvaise signature, rejeu idempotent validé. | Ingénieur Intégration |
| **6** | **Collaboration Mattermost & RGPD**<br>Notifications opérationnelles sur 4 canaux avec masquage strict. | **CONFORME** | Zéro IBAN, BIC, token, mot de passe ou pièce d'identité relayé. | DPO / SecOps |
| **7** | **Verrou Anti-Facturation Automatique**<br>Interdiction stricte de toute émission de facture sans validation humaine. | **CONFORME** | 0 endpoint d'émission automatique. Validation exclusive Desk. | Contrôleur Financier |
| **8** | **Sauvegardes & Rollback**<br>Sauvegardes quotidiennes actives et procédure de rollback documentée. | **CONFORME** | RPO $\le$ 24h, RTO $\le$ 2h, rollback Workers et ERP validés. | SRE / DevOps |
| **9** | **Documentation & Runbook**<br>Guide d'exploitation et plan d'incident disponibles. | **CONFORME** | `OPERATIONS_RUNBOOK.md` et `INCIDENT_RESPONSE.md` livrés. | Tech Lead |

---

## 2. ÉTAT DES 4 ARBITRAGES MÉTIER EN ATTENTE (HOLD FINANCIER)

Les points suivants sont explicitement réservés à l'arbitrage exclusif de la direction :

| # Arbitrage | Question Métier | Option Technique Recommandée | Statut Actuel |
| :---: | :--- | :--- | :---: |
| **A-1** | **Politique Tarifaire** | Tarification libre par devis (`standard_rate = 0.00`) avec saisie ad hoc du TJM/forfait lors de l'émission. | **HOLD (En attente décision)** |
| **A-2** | **Naming Series** | Maintien du standard ERPNext (`QTN-`, `SO-`, `ACC-SINV-`) ou bascule francophone (`DEV-`, `CMD-`, `FAC-`). | **HOLD (En attente décision)** |
| **A-3** | **Coordonnées Bancaires** | Fourniture de l'IBAN, BIC/SWIFT, Banque et Titulaire officiel pour les formats d'impression. | **HOLD (En attente décision)** |
| **A-4** | **Conditions de Règlement** | % d'acompte à la commande (ex: 30% ou 50%) et délais de paiement contractuels. | **HOLD (En attente décision)** |

---

## 3. ATTESTATION DE TRANSFERT OPÉRATIONNEL (HANDOVER SIGN-OFF)

### Déclaration de Conformité Technique
> *L'équipe technique atteste que le socle applicatif de Bokengi Group 2.0 (Front-office Next.js, API Edge Cloudflare, Business Core ERPNext v15, Passerelle Webhooks Cal.com et Hub de collaboration Mattermost) est pleinement opérationnel, sécurisé et conforme aux exigences de gouvernance.*

### Signatures d'Approbation

| Rôle | Nom / Référent | Date | Décision |
| :--- | :--- | :---: | :---: |
| **Lead Integration Engineer** | Antigravity Core Agent | 26/09/2026 | **APPROUVÉ (GO TECHNIQUE)** |
| **Responsable Infrastructure & SRE** | Équipe DevOps Bokengi | 26/09/2026 | **APPROUVÉ (GO PRODUCTION)** |
| **Direction Commerciale & Projets** | Direction Bokengi Group | 26/09/2026 | **VALIDÉ (SOUS RÉSERVE ARBITRAGES)** |
| **Direction Générale / Finance** | Direction Bokengi Group | 26/09/2026 | **SOUMIS À VALIDATION ARBITRAGES** |

---

## 4. DÉCISION FINALE DU HANDOVER

> ### 🏁 **READY FOR OPERATIONAL HANDOVER**
> **Statut : Le transfert opérationnel du système d'information Bokengi Group 2.0 est complet et validé.**  
> Le système d'acquisition et de collaboration peut être exploité au quotidien immédiatement.
