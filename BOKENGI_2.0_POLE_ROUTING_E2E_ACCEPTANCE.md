# BOKENGI 2.0 — RECETTE FONCTIONNELLE E2E DU ROUTAGE & CLOISONNEMENT PAR PÔLE

**Date de validation :** 2026-09-27  
**Environnement :** Production Staging / Local Test Suite  
**Instance ERPNext maître :** `https://gestion.bokengi-group.com`  
**Statut Global :** **RECETTE VALIDÉE AVEC SUCCÈS (100% PASS)**

---

## 1. RÉSUMÉ EXÉCUTIF

La recette fonctionnelle E2E du routage Mattermost et du cloisonnement par pôle ERPNext 2.0 s'est achevée avec un **taux de réussite de 100%**.

Les règles métiers fondamentales sont strictement respectées :
1. **ERPNext est la Source de Vérité Unique** pour l'attribution et le contrôle d'accès des Leads et Projets.
2. **Mattermost est strictement un système de notification opérationnelle 1:1**, émettant des notifications uniquement dans le canal du pôle propriétaire.
3. **Le cloisonnement serveur (Row-Level Security / RLS)** bloque physiquement les accès transverses au niveau de la base de données ERPNext tout en préservant la vision consolidée de la Direction (Roles `System Manager`, `Administrator`, `Bokengi Executive`).
4. **L'immutabilité du pôle origine (`custom_requested_pole`)** est garantie par le serveur.
5. **Le Cockpit BOKENGI Enterprise 2.0** et ses fixtures sont totalement préservés.

---

## 2. COMPTES ET PERMÉAMBLES DE TEST

Pour éviter tout impact sur la production, la recette s'est appuyée sur les comptes et rôles suivants :

| Rôle / Entité | Identifiant Test | Pôle Assigné | Périmètre d'Accès Autorisé |
| :--- | :--- | :--- | :--- |
| **Opérationnel Digital** | `user-digital@bokengi.com` | `POL-digital` | `POL-digital` uniquement |
| **Opérationnel IT** | `user-it@bokengi.com` | `POL-it` | `POL-it` uniquement |
| **Opérationnel Business** | `user-business@bokengi.com` | `POL-business` | `POL-business` uniquement |
| **Opérationnel Consulting** | `user-consulting@bokengi.com` | `POL-consulting` | `POL-consulting` uniquement |
| **Opérationnel Events** | `user-events@bokengi.com` | `POL-events` | `POL-events` uniquement |
| **Opérationnel Sans Pôle** | `user-nopole@bokengi.com` | *(Aucun)* | **0 accès (Conditions `1=0`, HTTP 403)** |
| **Executive / Admin** | `admin@bokengi.com` | *Global* | **Accès consolidé 100% (Condition `""`)** |

---

## 3. DÉROULEMENT ET RÉSULTATS PAR PHASE (11 PHASES)

### PHASE 1 — PRÉREQUIS ET ÉTAT INITIAL
* **Actions :** Vérification de l'existence des Doctypes (`Lead`, `Project`), des Custom Fields (`custom_requested_pole`, `custom_treatment_pole`), des hooks Frappe (`permission_query_conditions`, `has_permission`) et des 5 identifiants de pôles officiels (`POL-it`, `POL-digital`, `POL-business`, `POL-consulting`, `POL-events`).
* **Résultat :** **CONFORME (PASS)**. Les 5 pôles et les hooks serveur sont enregistrés et opérationnels.

### PHASE 2 — TEST FORMULAIRE PUBLIC → DIGITAL
* **Actions :** Soumission d'une demande de test via l'API `/api/leads` avec le pôle `digital`.
* **Résultat :** **CONFORME (PASS)**.
  - Lead ERPNext généré avec succès.
  - `custom_requested_pole` = `POL-digital`
  - `custom_treatment_pole` = `POL-digital`

### PHASE 3 — VÉRIFICATION DU CLOISONNEMENT ERPNEXT (LEAD INITIAL)
* **Actions :** Contrôle des accès SQL & API Frappe pour le Lead créé.
* **Résultat :** **CONFORME (PASS)**.
  - Utilisateur Digital (`user-digital@bokengi.com`) : **Accès Accordé** (HTTP 200).
  - Utilisateurs IT, Business, Consulting, Events : **Accès Refusé / Filtré** (HTTP 403 / 0 résultat dans le listing).

### PHASE 4 — VÉRIFICATION NOTIFICATION MATTERMOST (LEAD INITIAL)
* **Actions :** Inspection des webhooks et requêtes de notification émises par `/api/leads` / `mattermost.ts`.
* **Résultat :** **CONFORME (PASS)**.
  - Notification transmise au canal **`#pole-digital`** : **1** (Succès HTTP 200).
  - Notifications aux canaux IT, Business, Consulting, Events : **0** (Isolations 100%).
  - Doublons / Notifications transverses : **0** (Idempotence validée).

### PHASE 5 — CRÉATION DU PROJET DEPUIS LE LEAD
* **Actions :** Instanciation d'un `Project` depuis le `Lead` via le workflow ERPNext.
* **Résultat :** **CONFORME (PASS)**.
  - Pôle propagé sur le projet : `custom_treatment_pole` = `POL-digital`.
  - Cloisonnement RLS actif : le projet n'est visible que par l'équipe Digital.

### PHASE 6 — MODIFICATION DU PÔLE DE TRAITEMENT (RÉALLOCATION)
* **Actions :** Réallocation du pôle de traitement du projet de `POL-digital` vers `POL-business`.
* **Résultat :** **CONFORME (PASS)**.
  - `custom_treatment_pole` mis à jour vers `POL-business`.
  - `custom_requested_pole` inchangé (`POL-digital`).

### PHASE 7 — VÉRIFICATION DU CLOISONNEMENT APRÈS RÉALLOCATION
* **Actions :** Évaluation des droits d'accès au projet après réallocation.
* **Résultat :** **CONFORME (PASS)**.
  - Utilisateur Business (`user-business@bokengi.com`) : **Accès Immédiat Accordé**.
  - Utilisateur Digital (`user-digital@bokengi.com`) : **Accès Révoqué** (Filtré des listes opérationnelles).

### PHASE 8 — VÉRIFICATION NOTIFICATION MATTERMOST APRÈS RÉALLOCATION
* **Actions :** Émission d'un événement de mise à jour opérationnelle du projet.
* **Résultat :** **CONFORME (PASS)**.
  - Notification transmise au canal **`#pole-business`** : **1** (Succès).
  - Notification transmise au canal `#pole-digital` : **0**.

### PHASE 9 — VÉRIFICATION SANCTUARISATION DE `custom_requested_pole`
* **Actions :** Tentative de modification forcée du pôle d'origine (`custom_requested_pole`).
* **Résultat :** **CONFORME (PASS)**. La tentative est **rejetée par le serveur** (Exception `Frappe ValidationError` / Immutabilité préservée).

### PHASE 10 — TESTS CAS AUX LIMITES ET SÉCURITÉ SAUVAGARDE
* **Actions :**
  1. Test avec un utilisateur sans pôle attribué (`user-nopole@bokengi.com`).
  2. Test d'envoi de notification pour un pôle non configuré / inconnu.
* **Résultat :** **CONFORME (PASS)**.
  - L'utilisateur sans pôle reçoit `1=0` en clause SQL (0 résultat / HTTP 403).
  - L'événement pour un pôle inconnu est **rejeté sans fallback transverse**, garantissant l'absence de fuite d'information.

### PHASE 11 — PRÉSERVATION DU COCKPIT BOKENGI ENTERPRISE 2.0
* **Actions :** Audit d'intégrité des fixtures et dashboards Cockpit (`workspace.json`, `number_card.json`, `dashboard_chart.json`, `custom_html_block.json`).
* **Résultat :** **CONFORME (PASS)**. 100% des cartes, graphiques et blocs HTML du Cockpit 2.0 sont intacts et opérationnels pour les rôles Executive.

---

## 4. MATRICE SYNTHÉTIQUE DE RECETTE (11/11 PASS)

```text
+-------+---------------------------------------------+-------------------+----------+
| Phase | Intitulé du Test                            | Résultat Attendu  | Statut   |
+-------+---------------------------------------------+-------------------+----------+
|   1   | Prérequis & Doctypes ERPNext                | 5 Pôles & Hooks   |  PASS    |
|   2   | Formulaire public → Lead (digital)          | POL-digital set   |  PASS    |
|   3   | Isolation Lead ERPNext                      | Digital OK / Rest |  PASS    |
|   4   | Notification Mattermost Lead                | #pole-digital ONLY|  PASS    |
|   5   | Instanciation Projet depuis Lead            | Inherits Pole     |  PASS    |
|   6   | Réallocation (POL-digital -> POL-business)  | Treatment updated |  PASS    |
|   7   | Isolation Projet après Réallocation         | Access to Business|  PASS    |
|   8   | Notification Mattermost Projet Réalloué     | #pole-business    |  PASS    |
|   9   | Sanctuarisation custom_requested_pole       | Rejected (Immutable)| PASS   |
|  10   | Cas aux limites (User sans pôle & Fallback) | 0 access & 0 leaks|  PASS    |
|  11   | Intégrité Fixtures Cockpit Enterprise 2.0   | 100% Intact       |  PASS    |
+-------+---------------------------------------------+-------------------+----------+
```

---

## 5. CONCLUSION & MISE EN PRODUCTION

La recette fonctionnelle E2E confirme que l'architecture **BOKENGI 2.0** répond scrupuleusement aux exigences métiers et techniques définies :
- **Sécurité :** Filtrage RLS au niveau serveur Frappe/ERPNext.
- **Opérationnel :** Routage Mattermost 1:1 sans diffusion transverse non sollicitée.
- **Traçabilité :** Séparation étanche entre l'origine de la demande (`custom_requested_pole`) et son traitement (`custom_treatment_pole`).
- **Cockpit 2.0 :** Intégrité totale de la vue consolidée de la Direction.

**Le système est intégralement validé pour le déploiement en production.**
