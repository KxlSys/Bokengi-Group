# BOKENGI GROUP 2.0 — ROUTAGE MATTERMOST PAR PÔLE (RAPPORT FINAL)

## 1. ARCHITECTURE FINALE

```
FORMULAIRE PUBLIC WEB
          ↓ (POST /api/leads avec pole)
/api/leads
          ↓ (submitLeadToERPNext)
ERPNext v15 (Source de vérité)
  - DocType Lead : custom_requested_pole = POL-* (immuable)
  - DocType Lead : custom_treatment_pole = POL-* (opérationnel)
          ↓
Routeur Mattermost Centralisé (normalizePoleId / getWebhookUrlForPole)
          ↓
Canal Mattermost du Pôle Propriétaire Uniquement
```

---

## 2. MAPPING DES PÔLES & CANAUX MATTERMOST

| Pôle ERPNext (`POL-*`) | Input Slug Formulaire | Variable d'environnement (Secret) | Canal Mattermost Cible | Isolation Stricte |
|---|---|---|---|---|
| `POL-it` | `it`, `bokengi-it`, `POL-it` | `MATTERMOST_WEBHOOK_POLE_IT` | `#pole-it` | 100% Isolé |
| `POL-digital` | `digital`, `bokengi-digital`, `POL-digital` | `MATTERMOST_WEBHOOK_POLE_DIGITAL` | `#pole-digital` | 100% Isolé |
| `POL-business` | `business`, `bokengi-business`, `POL-business` | `MATTERMOST_WEBHOOK_POLE_BUSINESS` | `#pole-business` | 100% Isolé |
| `POL-consulting` | `consulting`, `bokengi-consulting`, `POL-consulting` | `MATTERMOST_WEBHOOK_POLE_CONSULTING` | `#pole-consulting` | 100% Isolé |
| `POL-events` | `events`, `bokengi-events`, `POL-events` | `MATTERMOST_WEBHOOK_POLE_EVENTS` | `#pole-events` | 100% Isolé |
| *Pôle Inconnu / Absent* | *N/A* | *Aucun Webhook Sollicité* | **Aucun canal** | Log d'avertissement, **Zéro fuite** |

---

## 3. ÉVÉNEMENTS SUPPORTÉS & FORMATAGE

### 1. `NEW_LEAD` (Nouvelle Demande)
- **Format :**
  ```text
  ### 🆕 NOUVELLE DEMANDE

  **Pôle :** BOKENGI DIGITAL
  **Client :** Jean Dupont (XYZ)
  **Projet / Description :** Création d'une plateforme web e-commerce
  **Type :** Demande de devis
  **Statut :** Nouveau
  **Email :** jean@xyz.com

  🔗 [Voir dans ERPNext →](https://erp.bokengi-group.com/app/lead/CRM-LEAD-2026-0001)
  ```

### 2. `NEW_PROJECT` (Nouveau Projet)
- **Format :**
  ```text
  ### 🚀 NOUVEAU PROJET

  **Projet :** Refonte de plateforme web
  **Client :** XYZ
  **Pôle :** BOKENGI DIGITAL
  **Statut :** Nouveau

  🔗 [Voir le projet dans ERPNext →](https://erp.bokengi-group.com/app/project/PROJ-2026-001)
  ```

### 3. `PROJECT_UPDATED` (Changement de Statut / Mise à Jour)
- **Format :**
  ```text
  ### 🔄 PROJET MIS À JOUR

  **Projet :** Refonte de plateforme web
  **Pôle :** BOKENGI DIGITAL
  **Nouveau statut :** En cours

  🔗 [Voir le projet dans ERPNext →](https://erp.bokengi-group.com/app/project/PROJ-2026-001)
  ```

### 4. `ACTION_REQUIRED` (Attention / Alerte Pôle)
- **Format :**
  ```text
  ### ⚠️ ACTION REQUISE

  **Projet :** Refonte de plateforme web
  **Pôle :** BOKENGI DIGITAL
  **Action / Alerte :** Échéance dépassée

  🔗 [Voir dans ERPNext →](https://erp.bokengi-group.com/app/project/PROJ-2026-001)
  ```

---

## 4. FICHIERS MODIFIÉS & CRÉÉS

1. **[`src/lib/mattermost.ts`](file:///E:/01_Projets/Actifs/Bokengi-group/src/lib/mattermost.ts) :**
   - Implémentation de `normalizePoleId()`, `getWebhookUrlForPole()`, `getPoleDisplayName()`.
   - Routage 1:1 strict par pôle.
   - Cache d'idempotence TTL 24h (`processedEventsCache`) évitant les double notifications.
   - Formatage des événements métiers ciblés.
2. **[`src/lib/erpnext-client.ts`](file:///E:/01_Projets/Actifs/Bokengi-group/src/lib/erpnext-client.ts) :**
   - Normalisation du pôle et transmission explicite de `custom_requested_pole` (immuable) et `custom_treatment_pole` (opérationnel) vers `/api/resource/Lead`.
3. **[`src/app/api/leads/route.ts`](file:///E:/01_Projets/Actifs/Bokengi-group/src/app/api/leads/route.ts) :**
   - Routage de la demande web vers le pôle sélectionné avec transmission de l'email et métadonnées.
4. **[`frappe_apps/bokengi_erp/bokengi_erp/mattermost_events.py`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/mattermost_events.py) :**
   - Alignement du hook Frappe backend Desk (`on_lead_inserted`) sur les webhooks de pôle `MATTERMOST_WEBHOOK_POLE_*` sans fallback transverse.
5. **[`.env.example`](file:///E:/01_Projets/Actifs/Bokengi-group/.env.example) :**
   - Documentation des 5 variables de webhooks `MATTERMOST_WEBHOOK_POLE_*`.
6. **[`tests/unit/mattermost-pole-routing.test.ts`](file:///E:/01_Projets/Actifs/Bokengi-group/tests/unit/mattermost-pole-routing.test.ts) :**
   - Suite de 11 tests unitaires dédiés au routage, à l'isolation inter-pôles et à l'anti-doublon.

---

## 5. MÉCANISME ANTI-DOUBLE NOTIFICATION

1. **Autorité principale :** Pour une demande issue du web (`/api/leads`), le Lead est d'abord créé dans ERPNext.
2. **Idempotence :** La passerelle `sendMattermostNotification` maintient un cache des clés d'idempotence (`<pole>:<eventType>:<documentId>`). Une re-soumission ou replay réseau sur un même événement est neutralisée silencieusement (`duplicate: true`) sans émettre de second webhook HTTP.

---

## 6. RÉSULTATS DES TESTS & VERIFICATIONS

### 1. Suite de tests du routeur de pôle (`mattermost-pole-routing.test.ts`)
- `TEST-1` (Normalisation slugs/IDs) : **PASS** (100%)
- `TEST-2` (`POL-it` $\rightarrow$ `#pole-it`) : **PASS**
- `TEST-3` (`POL-digital` $\rightarrow$ `#pole-digital`) : **PASS**
- `TEST-4` (`POL-business` $\rightarrow$ `#pole-business`) : **PASS**
- `TEST-5` (`POL-consulting` $\rightarrow$ `#pole-consulting`) : **PASS**
- `TEST-6` (`POL-events` $\rightarrow$ `#pole-events`) : **PASS**
- `TEST-7` (Isolation stricte `POL-digital` vs autres pôles) : **PASS**
- `TEST-8` (Pôle inconnu / vide $\rightarrow$ 0 appel webhook, zéro fuite) : **PASS**
- `TEST-9` (Changement de pôle `POL-digital` $\rightarrow$ `POL-business`) : **PASS**
- `TEST-10` (Idempotence 1 événement = 1 notification) : **PASS**
- `TEST-11` (Formatage concis des 4 événements) : **PASS**

### 2. Validation TypeScript et Non-Régression
- `pnpm exec tsc --noEmit` : **PASS** (0 erreur de compilation)
- `pnpm test:int` (Cockpit Enterprise 2.0) : **PASS** (19/19 tests validés)
- Complete unit test suite (`43/43 tests PASS`)

---

## 7. DEMONSTRATION DU CRITÈRE DE SUCCÈS

```text
FORMULAIRE WEB
     ↓ (pôle: "digital")
/api/leads
     ↓
ERPNext DocType Lead
  - custom_requested_pole = "POL-digital"
  - custom_treatment_pole = "POL-digital"
     ↓
ROUTEUR MATTERMOST (normalizePoleId)
     ↓
CANAL DU PÔLE UNICEMENT
  - #pole-digital (MATTERMOST_WEBHOOK_POLE_DIGITAL) ✅
  - #pole-it (0 notification) ❌
  - #pole-business (0 notification) ❌
  - #pole-consulting (0 notification) ❌
  - #pole-events (0 notification) ❌
```

**STATUT FINAL : PRODUCTION READY ✅**
