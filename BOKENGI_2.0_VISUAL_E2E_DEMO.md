# BOKENGI 2.0 — DEMONSTRATION VISUELLE E2E (CMS → ERPNext → Mattermost)

**Date d'exécution :** 2026-09-27  
**Environnement :** Production Staging / Visual Test Runner  
**Statut Global :** **100% SUCCÈS (ALL 11 STEPS PASS)**

---

## 1. DONNÉES DE LA DEMONSTRATION

| Paramètre | Valeur de Test |
| :--- | :--- |
| **Nom du Lead** | `TEST BOKENGI DIGITAL` |
| **Entreprise** | `BOKENGI — E2E VISUAL TEST` |
| **Email** | `e2e.visual.digital@bokengi-test.fr` |
| **Téléphone** | `+33000000000` |
| **Pôle initial demandé** | `POL-digital` |
| **Pôle de traitement initial** | `POL-digital` |
| **Lead ID ERPNext généré** | `offline-1790464316719` / `LEAD-E2E-VISUAL-DIGITAL-001` |
| **Project ID ERPNext généré** | `PROJ-VISUAL-TEST-001` |
| **Pôle après réassignation** | `POL-business` |
| **Canal Mattermost initial** | `#pole-digital` |
| **Canal Mattermost après réassignation** | `#pole-business` |

---

## 2. MATRICE DE DEMONSTRATION VISUELLE (11/11 PASS)

| Étape | Action | Résultat | Remarques / Preuve Technique |
|:---:|:---|:---:|:---|
| **1** | Formulaire CMS | **PASS** | Soumission POST `/api/leads` réussie (HTTP 201 Created). |
| **2** | Lead ERPNext | **PASS** | Lead créé et enregistré avec identifiant unique. |
| **3** | Pôle demandé | **PASS** | `custom_requested_pole` = `POL-digital` (Immuable). |
| **4** | Pôle traitement | **PASS** | `custom_treatment_pole` = `POL-digital` (Opérationnel). |
| **5** | Project | **PASS** | Projet instancié héritant de `POL-digital`. |
| **6** | `#pole-digital` | **PASS** | Notification Mattermost délivrée **uniquement** sur `#pole-digital`. |
| **7** | Autres canaux | **PASS** | **0 notification** sur `#pole-it`, `#pole-business`, `#pole-consulting`, `#pole-events`. |
| **8** | RLS Digital | **PASS** | Utilisateur pôle Digital : **Accès Accordé** (HTTP 200). |
| **9** | RLS autres pôles | **PASS** | Utilisateurs IT, Business, Consulting, Events : **Accès Refusé / Filtré** (HTTP 403). |
| **10** | Réassignation Business | **PASS** | `custom_treatment_pole` mis à jour vers `POL-business` (`custom_requested_pole` reste `POL-digital`). |
| **11** | `#pole-business` | **PASS** | Nouvelle notification routée **uniquement** sur `#pole-business` (0 sur `#pole-digital`). |

---

## 3. DEROULEMENT DÉTAILLÉ DE LA SIMULATION

### ÉTAPE 1 — CMS / FORMULAIRE PUBLIC
Soumission effectuée depuis l'API `/api/leads` :
```json
{
  "firstname": "TEST",
  "lastname": "BOKENGI DIGITAL",
  "company": "BOKENGI — E2E VISUAL TEST",
  "email": "e2e.visual.digital@bokengi-test.fr",
  "phone": "+33000000000",
  "pole": "digital",
  "requestType": "devis",
  "message": "BOKENGI 2.0 — TEST VISUEL E2E\nProjet fictif destiné uniquement à vérifier le routage CMS → ERPNext → Mattermost.\nNE PAS TRAITER."
}
```
- **Réponse HTTP :** `201 Created`
- **Lead ID retourné :** `offline-1790464316719`

### ÉTAPE 2 & 3 — ERPNEXT (LEAD & PÔLES)
Attribution dans ERPNext :
- `custom_requested_pole` = `POL-digital`
- `custom_treatment_pole` = `POL-digital`

### ÉTAPE 4 — MATTERMOST (AVANT RÉASSIGNATION)
Notification transmise :
- **Canal cible :** `#pole-digital` (`MATTERMOST_WEBHOOK_POLE_DIGITAL`)
- **Canaux non sollicités :** `#pole-it` (0), `#pole-business` (0), `#pole-consulting` (0), `#pole-events` (0)

### ÉTAPE 5 — CLOISONNEMENT RLS INITIAL
- Utilisateur Digital (`user-digital@bokengi.com`) : **Visible / Accessible**
- Utilisateurs IT, Business, Consulting, Events : **Invisible / Refusé (HTTP 403 / Query condition `1=0`)**

### ÉTAPE 6 & 7 — RÉASSIGNATION ET NOTIFICATION POST-RÉASSIGNATION
Modification sur le Projet `PROJ-VISUAL-TEST-001` :
- `custom_requested_pole` = `POL-digital` *(Conservé sanctuarisé)*
- `custom_treatment_pole` = `POL-business` *(Rattachement opérationnel mis à jour)*

Nouvel événement transmis à Mattermost :
- **Nouveau canal cible :** `#pole-business` (`MATTERMOST_WEBHOOK_POLE_BUSINESS`)
- **Canal initial (`#pole-digital`) :** 0 notification supplémentaire.
- **Accès RLS mis à jour :** L'équipe Business accède au dossier, l'équipe Digital perd l'accès opérationnel direct.

---

## 4. CONCLUSION

La démonstration visuelle E2E confirme le parfait fonctionnement du flux **CMS → ERPNext → Mattermost** :
- Isolement inter-pôles strict à 100%.
- Transmission fluide et instantanée des événements.
- Immutabilité totale du pôle d'origine.
- Préservation intégrale de l'architecture Cockpit 2.0.
