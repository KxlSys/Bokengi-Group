# BOKENGI GROUP 2.0 — PHASE 7.6 FINALISATION DE LA DEMANDE D'ACCÈS ERPNext

## 1. CONTEXTE & ÉTAT INITIAL
- **Page concernée :** `/[locale]/demande-acces` (Formulaire d'habilitation interne / partenaires).
- **État préalable :** L'interface frontend et les protections (rate limiting, honeypot) étaient en place, mais la route `/api/access-requests` retournait un simple identifiant temporaire mocké (`erpnext-${Date.now()}`) sans persistance effective dans ERPNext v15.
- **Objectif :** Transformer `/api/access-requests` en proxy sécurisé vers ERPNext v15 via `src/lib/erpnext-client.ts`.

---

## 2. MODÉLISATION ERPNext RETENUE

### DocType Cible : `Lead`
Pour éviter de multiplier des DocTypes redondants et bénéficier immédiatement des mécanismes de sécurité, d'immutabilité et de notification déjà configurés en Phase 7.1, les demandes d'accès sont persistées dans le DocType standard `Lead` d'ERPNext v15 avec une qualification d'habilitation spécifique.

### Matrice de Mapping (Frontend → ERPNext) :

| Donnée Frontend | Paramètre API REST ERPNext | Type / Destination | Exemple de valeur |
|---|---|---|---|
| `firstName` + `lastName` | `lead_name` | Data (String) | `"Jean Dupont"` |
| `email` | `email_id` | Data (Email) | `"jean.dupont@entreprise.com"` |
| Pôle de traitement | `custom_pole` | Link (`Bokengi Pole`) | `"POL-it"` (Direction IT & Sécurité) |
| Organisation | `company_name` | Data (String) | `"Demande d'accès interne / Partenaire"` |
| Rôle sollicité + Justification | `custom_payload_message_raw` | Long Text (Message) | `"[DEMANDE D'ACCÈS INTERNE / HABILITATION]\nDemandeur : Jean Dupont\nRôle sollicité : Éditeur de Contenu (editor)\n\nJustification & Motivation :\n..."` |
| Priorité | `custom_priority_flag` | Select | `"Normal"` |
| Statut initial | `status` | Select | `"Open"` |

---

## 3. MODIFICATIONS APPORTÉES AU CODE

1. **`src/lib/erpnext-client.ts` :**
   - Ajout de la méthode dédiée `submitAccessRequestToERPNext(...)`.
   - Formatage structuré de la demande d'habilitation et transmission sécurisée vers `submitLeadToERPNext(...)`.

2. **`src/app/api/access-requests/route.ts` :**
   - Remplacement du mock par un appel effectif à `submitAccessRequestToERPNext(...)`.
   - Conservation des sécurités :
     - Rate-limiting (5 requêtes / heure / IP).
     - Honeypot invisible anti-bot (`website`).
     - Blocage d'escalade de privilèges (`super-admin`, injection de champs `assignedRole`, `status`).
     - Validation stricte des longueurs et format email (RFC 5322).
     - Fallback résilient en cas d'indisponibilité momentanée du serveur ERP.

---

## 4. SÉCURITÉ & PRIVACY
- **Zero-Trust :** Aucune clé API ERPNext ni credential n'est exposée au navigateur client.
- **Principe du moindre privilège :** Les demandes sont obligatoirement créées avec le statut `Open` et nécessitent une intervention humaine d'un administrateur dans ERPNext Desk pour l'attribution éventuelle d'un compte utilisateur (`User`).

---

## 5. VALIDATIONS & TESTS

| Test | Résultat | Commentaire |
|---|---|---|
| **TypeScript Check** (`pnpm tsc --noEmit`) | **PASS (0 erreur)** | Typage 100% strict |
| **Validation des entrées & Sanitization** | **PASS** | Contrôle des longueurs, rejet des formats invalides |
| **Protection Anti-Spam (Honeypot)** | **PASS** | Détection immédiate du champ piège |
| **Blocage Privilege Escalation** | **PASS** | Rejet automatique de `super-admin` |
| **Absence de référence Payload** | **PASS** | 0 dépendance Payload |
| **Résilience hors-ligne** | **PASS** | Gestion d'erreur sans crash |

*Remarque sur le test réseau réel :* Dans le bac à sable local (sans résolution DNS de `erp.bokengi-group.com`), le test statique/code est **PASS**, la liaison réseau réelle est testée automatiquement en environnement de staging/production.

---

## 6. PROCHAINE ÉTAPE DU CAHIER DES CHARGES
- **Phase 7.7 :** Formalisation et cadrage du workflow commercial Devis & Facturation dans ERPNext Desk (`Quotation` & `Sales Invoice`).
