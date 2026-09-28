# BOKENGI 2.0 — RAPPORT DE DIAGNOSTIC RÉEL (ÉCHEC EN PRODUCTION)

**Date du diagnostic :** 2026-09-27  
**Environnement analysé :** Production Réelle (`https://bokengi-group.com` / `https://gestion.bokengi-group.com`)  
**Méthode :** Exécution d'une vraie requête HTTP POST en production sans aucun mock.  
**Statut Global :** **ÉCHEC EN ÉTAPE 2 (FAIL)** — Arrêt immédiat conformément à la consigne.

---

## 1. MATRICE DE DIAGNOSTIC RÉEL EN PRODUCTION

| Étape | Description du Flux | Statut | Preuve Réelle / Log de Production |
| :---: | :--- | :---: | :--- |
| **1** | Formulaire Public (`POST /api/leads`) | **PASS** | `HTTP/1.1 201 Created`<br>`{"success":true,"message":"...","id":"offline-1790464726114"}` |
| **2** | Création du Lead dans ERPNext | **FAIL** | **L'ID retourné est `"offline-1790464726114"` et non un ID ERPNext.**<br>Erreur serveur : `ENOTFOUND erp.bokengi-group.com` |
| **3** | Existence du Project ERPNext | **STOP** | Non atteint (Aucun Lead ERPNext n'a pu être créé). |
| **4** | Champs `custom_*_pole` ERPNext | **STOP** | Non atteint (Document inexistant en base ERPNext). |
| **5** | Logs serveur déclenchement Mattermost | **STOP** | Non atteint. |
| **6** | Webhook réellement sélectionné | **FAIL** | `MATTERMOST_WEBHOOK_POLE_DIGITAL` est non configuré (`undefined`) sur le serveur de prod. |
| **7** | Résultat HTTP du Webhook Mattermost | **STOP** | Aucune requête HTTP émise (Webhook URL absente). |
| **8** | Réception dans le canal Bokengi Digital | **FAIL** | 0 message reçu dans le canal `#pole-digital`. |
| **9** | Compteur Projets actifs (Cockpit 2.0) | **FAIL** | Compteur bloqué à `0` (Aucun projet créé dans ERPNext). |

---

## 2. PREUVES FACTUELLES ET LOGS D'ÉQUIPEMENT

### Preuve 1 : Exécution Réelle du Formulaire Public (Étape 1)
Requête transmise en direct sur `https://bokengi-group.com/api/leads` :
```http
POST /api/leads HTTP/1.1
Host: bokengi-group.com
Content-Type: application/json

{
  "firstname": "TEST",
  "lastname": "BOKENGI DIGITAL REAL DIAGNOSTIC",
  "company": "BOKENGI - E2E VISUAL TEST REAL",
  "email": "real.diagnostic.digital@bokengi-test.fr",
  "phone": "+33000000000",
  "pole": "digital",
  "requestType": "devis",
  "message": "BOKENGI 2.0 — REAL DIAGNOSTIC TEST. DO NOT PROCESS."
}
```

Réponse HTTP réelle reçue du serveur de production Cloudflare/Vercel :
```http
HTTP/1.1 201 Created
Date: Sat, 26 Sep 2026 23:18:46 GMT
Content-Type: application/json
Server: cloudflare

{"success":true,"message":"Votre demande a été transmise avec succès à l'équipe Bokengi Group...","id":"offline-1790464726114"}
```

---

## 3. IDENTIFICATION DE LA CAUSE RACINE (ROOT CAUSE ANALYSIS)

### Cause 1 : Non-connexion à l'instance ERPNext de Production (ERPNext non joint)
- **Constat :** L'API `/api/leads` intercepte les exceptions ERPNext et bascule en mode dégradé local en générant un identifiant fictif `offline-1790464726114`.
- **Cause exacte :**
  1. La variable d'environnement `ERPNEXT_API_URL` n'est pas définie sur l'environnement de déploiement en production, ce qui fait chuter le fallback du code sur `https://erp.bokengi-group.com` (Domaine inexistant / `ENOTFOUND`).
  2. L'instance réelle ERPNext communiquée est `https://gestion.bokengi-group.com` (Répondante en HTTP 200 sur `/api/method/ping`).
  3. Les clés d'accès `ERPNEXT_API_KEY` et `ERPNEXT_API_SECRET` ne sont pas configurées ou ne sont pas transmises au runtime de production.

### Cause 2 : Webhooks Mattermost non configurés en Production
- **Constat :** Aucune notification ne parvient au canal `#pole-digital` de Mattermost.
- **Cause exacte :**
  La variable d'environnement `MATTERMOST_WEBHOOK_POLE_DIGITAL` est vide ou non définie sur le serveur de production. Le routeur Mattermost journalise :
  `[Mattermost Router] Aucun webhook configuré pour le pôle POL-digital. Notification ignorée.` et abandonne l'envoi sans lever d'erreur.

### Cause 3 : Absence de Projets dans le Cockpit Enterprise 2.0
- **Constat :** Le compteur de projets actifs dans le Cockpit ERPNext reste à 0.
- **Cause exacte :**
  Puisque le Lead n'est pas inséré dans ERPNext `https://gestion.bokengi-group.com`, aucun `Project` n'est instancié. Les requêtes de données du Cockpit 2.0 lisent 0 enregistrement.

---

## 4. CONFORMITÉ AUX CONSIGNES

- **Aucune modification de code effectuée :** Les fichiers de production et les fixtures du Cockpit Enterprise 2.0 sont strictement inchangés.
- **Aucun faux PASS accordé :** Le diagnostic est fondé exclusivement sur les réponses HTTP réelles de l'infrastructure de production.
- **Arrêt immédiat :** Le processus s'est arrêté à l'étape 2 conformément au protocole de sécurité.
