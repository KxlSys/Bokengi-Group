# BOKENGI GROUP 2.0 — AUDIT DU CLOISONNEMENT ERPNext PAR PÔLE
## RAPPORT TECHNIQUE D'ARCHITECTURE & DE SÉCURITÉ (PHASE 1)

> **CONSIGNES DE PHASAGE :** Conformément aux directives strictes, **aucun fichier applicatif, aucune base de données, aucune permission et aucune configuration de production n'ont été modifiés** au cours de cet audit.

---

## 1. CONTEXTE & PÉRIMÈTRE

Le système **Bokengi Group 2.0** utilise **ERPNext v15** comme source de vérité unique pour la gestion commerciale et le suivi de projets.
La passerelle de notification Mattermost avec routage par pôle (1:1, isolation 100%, anti-doublon) a été précédemment implémentée et validée (43/43 tests PASS).

L'objectif de cette nouvelle phase est d'implémenter le **cloisonnement métier strict des données dans ERPNext Desk** :
- Un projet ou lead appartenant au pôle **BOKENGI DIGITAL** (`POL-digital`) doit être visible et traitable **uniquement par les utilisateurs opérationnels du pôle Digital**.
- Les utilisateurs opérationnels des autres pôles (`POL-it`, `POL-business`, `POL-consulting`, `POL-events`) ne doivent **pas pouvoir voir ni accéder** aux leads et projets du pôle Digital.
- Les rôles de direction (`Bokengi Executive`, `System Manager`, `Administrator`) conservent une **vision consolidée multi-pôles** indispensable au pilotage du Groupe et au fonctionnement du **BOKENGI Enterprise Cockpit v2.0**.

---

## 2. DIAGNOSTIC DE L'ARCHITECTURE ACTUELLE

### 2.1. Champs personnalisés (Custom Fields) sur `Lead`
- **[`frappe_apps/bokengi_erp/bokengi_erp/fixtures/custom_field.json`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/fixtures/custom_field.json#L26-L46) :**
  - `custom_requested_pole` (Link `Bokengi Pole`, `read_only: 1`) : Stocke le pôle demandé à l'origine par le prospect. Sanctuarisé et immuable via [`lead_security.py`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/lead_security.py#L18).
  - `custom_treatment_pole` (Link `Bokengi Pole`, `read_only: 0`) : Stocke le pôle de traitement opérationnel actuellement responsable du dossier.

### 2.2. Constat sur le DocType `Project`
- Le DocType `Project` dispose des règles de livraison CR-04 (recette obligatoire par Procès-Verbal dans [`project_delivery.py`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/project_delivery.py)).
- **Lacune constatée :** `Project` ne possède pas encore les champs personnalisés `custom_treatment_pole` et `custom_requested_pole` dans la fixture [`custom_field.json`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/fixtures/custom_field.json). Le rattachement au pôle opérationnel n'est pas encore modélisé sur l'objet `Project`.

### 2.3. Constat sur les permissions Frappe actuelles
- Inspection de [`frappe_apps/bokengi_erp/bokengi_erp/hooks.py`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/hooks.py) :
  - **Aucun hook `permission_query_conditions`** n'est enregistré.
  - **Aucun hook `has_permission`** n'est enregistré.
- **Faille de sécurité identifiée :** Par défaut dans ERPNext, tout utilisateur disposant du rôle `Sales User` ou `Projects User` peut consulter l'intégralité des enregistrements `Lead` et `Project` de la base de données, quel que soit le pôle. Les filtres d'interface utilisateur (vues, filtres de liste) sont facilement bypassables via :
  - L'API REST (`GET /api/resource/Lead` ou `GET /api/resource/Project`) ;
  - La recherche globale / raccourcis Desk (`Ctrl+K`) ;
  - L'accès direct par URL (`/app/lead/CRM-LEAD-xxxx` ou `/app/project/PROJ-xxxx`) ;
  - Les rapports et exportations Excel/CSV.

---

## 3. RÔLES ERPNEXT ET VECTEURS D'ACCÈS

### 3.1. Matrice des Rôles & Niveaux d'Accès

| Rôle ERPNext | Catégorie | Périmètre d'Accès Visé | Mécanisme de Filtrage |
|---|---|---|---|
| `Sales User` | Opérationnel Commercial | Restreint au pôle de l'utilisateur (`custom_treatment_pole`) | Dynamic SQL WHERE + Document Permission Check |
| `Sales Manager` | Opérationnel Commercial | Restreint aux pôles assignés à l'utilisateur | Dynamic SQL WHERE + Document Permission Check |
| `Projects User` | Opérationnel Delivery | Restreint au pôle du projet (`custom_treatment_pole`) | Dynamic SQL WHERE + Document Permission Check |
| `Projects Manager` | Opérationnel Delivery | Restreint aux pôles assignés à l'utilisateur | Dynamic SQL WHERE + Document Permission Check |
| `Bokengi Executive` | Direction / Management | **Vision Consolidée Global Groupe (Tous pôles)** | Pas de restriction (SQL WHERE `""`) |
| `System Manager` | Administration SI | **Vision Consolidée Global Groupe (Tous pôles)** | Pas de restriction (SQL WHERE `""`) |
| `Administrator` | Superutilisateur System | **Vision Consolidée Global Groupe (Tous pôles)** | Pas de restriction (SQL WHERE `""`) |

---

## 4. MODÈLE CIBLE DE CLOISONNEMENT CÔTÉ SERVEUR

Pour garantir une étanchéité **100% serveur** insensible aux manipulations de l'IHM Desk ou des requêtes API, la solution s'appuie sur le framework natif Frappe v15.

```
                    REQUÊTE UTILISATEUR (Desk / API REST / Recherche)
                                         ↓
                  Hook Frappe : permission_query_conditions
                                         ↓
                    Contrôle des Rôles de l'utilisateur (session)
                    /                                           \
       (Direction / System Manager)                     (Rôles Opérationnels)
                    ↓                                           ↓
       Vision Consolidée (SQL WHERE "")           Lecture User Permission "Bokengi Pole"
                                                                ↓
                                                   Conditions SQL injectées :
                                                   `tabLead`.`custom_treatment_pole` IN ('POL-digital')
                                                                ↓
                                                   Si aucun pôle assigné à l'utilisateur :
                                                   `tabLead`.`custom_treatment_pole` IS NULL AND 1=0 (Accès 0)
```

### 4.1. Composants à Implémenter (Phase 2)

#### A. Extension des Custom Fields sur `Project`
Ajout dans [`custom_field.json`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/fixtures/custom_field.json) :
- `Project-custom_treatment_pole` : Link `Bokengi Pole` (Pôle opérationnel responsable du projet).
- `Project-custom_requested_pole` : Link `Bokengi Pole` (Pôle d'origine du prospect, immuable, `read_only: 1`).

#### B. Propagation Automatique Pôle Lead $\rightarrow$ Project
Création du hook Frappe `validate` sur `Project` :
- Lors de l'instanciation d'un `Project` lié à un `Lead`, `Quotation` ou `Sales Order`, les champs `custom_treatment_pole` et `custom_requested_pole` sont automatiquement hérités du document d'origine.

#### C. Hooks de Filtrage des Listes (`permission_query_conditions`)
Création du module Python `bokengi_erp.bokengi_core.pole_permissions` :
```python
def get_lead_permission_query_conditions(user=None):
    if not user:
        user = frappe.session.user

    # Roles de direction et administrateurs : aucun filtre (vision tout pôle)
    if is_executive_or_admin(user):
        return ""

    # Utilisateurs operationnels : filtrage strict par User Permission Bokengi Pole
    allowed_poles = get_user_allowed_poles(user)
    if not allowed_poles:
        return "`tabLead`.`custom_treatment_pole` IS NULL AND 1=0"

    formatted_poles = ", ".join([frappe.db.escape(p) for p in allowed_poles])
    return f"`tabLead`.`custom_treatment_pole` IN ({formatted_poles})"
```

#### D. Hooks d'Accès Direct au Document (`has_permission`)
```python
def has_lead_permission(doc, ptype="read", user=None):
    if not user:
        user = frappe.session.user

    if is_executive_or_admin(user):
        return True

    allowed_poles = get_user_allowed_poles(user)
    if not allowed_poles:
        return False

    doc_pole = doc.get("custom_treatment_pole") or doc.get("custom_requested_pole")
    if not doc_pole:
        return False

    return doc_pole in allowed_poles
```

#### E. Sanctuarisation de `custom_requested_pole` & Fluidité du `custom_treatment_pole`
- `custom_requested_pole` reste **strictement immuable** dans `lead_security.py`.
- `custom_treatment_pole` peut être réassigné par un chef de pôle ou un manager (ex: de `POL-digital` vers `POL-business`).
- Dès la modification enregistrée en base, **les droits d'accès serveur basculent immédiatement** : les utilisateurs de `POL-business` accèdent au dossier, les utilisateurs de `POL-digital` n'y ont plus accès dans leurs listes opérationnelles.

---

## 5. COUVERTURE DES 10 CAS DE TEST OBLIGATOIRES

| Cas de Test | Description du scénario | Résultat Attendu | Mécanisme de Validation |
|---|---|---|---|
| **Cas 1** | Lead `POL-digital` $\rightarrow$ Utilisateur Pôle Digital | **VISIBLE** | `permission_query_conditions` inclut `'POL-digital'` |
| **Cas 2** | Lead `POL-digital` $\rightarrow$ Utilisateur Pôle IT | **MASQUÉ / ACCÈS REFUSÉ** | SQL query condition exclut `'POL-digital'` |
| **Cas 3** | Project `POL-digital` $\rightarrow$ Utilisateur Pôle Digital | **VISIBLE** | SQL query condition `Project.custom_treatment_pole = 'POL-digital'` |
| **Cas 4** | Project `POL-digital` $\rightarrow$ Utilisateur Pôle IT | **MASQUÉ / ACCÈS REFUSÉ** | SQL query condition exclut `'POL-digital'` |
| **Cas 5** | Lead/Project `POL-digital` $\rightarrow$ Rôle `Bokengi Executive` / `System Manager` | **VISIBLE (Vision Consolidée)** | `permission_query_conditions` retourne `""` |
| **Cas 6** | Réassignation `custom_treatment_pole` (`POL-digital` $\rightarrow$ `POL-business`) | **BASCULE DES DROITS** | L'utilisateur Business voit le dossier, l'utilisateur Digital ne le voit plus |
| **Cas 7** | Tentative de modification de `custom_requested_pole` après réassignation | **REJET STRICT / EXCEPTION** | `lead_security.py` lève une `frappe.PermissionError` |
| **Cas 8** | Utilisateur opérationnel sans aucun `User Permission` Bokengi Pole | **ACCÈS OPÉRATIONNEL 0** | Condition `1=0` injectée, aucun document retourné |
| **Cas 9** | Tentative d'accès API ou URL directe (`/api/resource/Lead/LEAD-xxx`) d'un autre pôle | **HTTP 403 FORBIDDEN** | Hook `has_permission` renvoie `False` |
| **Cas 10**| Exécution des tests d'intégration Cockpit BOKENGI 2.0 (`pnpm test:int`) | **100% PASS** | Cartes et graphiques consolidés pour la Direction intacts |

---

## 6. FICHIERS QUI DEVONT ÊTRE MODIFIÉS EN PHASE 2

1. **[`frappe_apps/bokengi_erp/bokengi_erp/fixtures/custom_field.json`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/fixtures/custom_field.json) :**
   - Ajout des Custom Fields `Project-custom_treatment_pole` et `Project-custom_requested_pole`.
2. **[`frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/pole_permissions.py`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/bokengi_core/pole_permissions.py) (Nouveau fichier) :**
   - Implémentation des fonctions `get_lead_permission_query_conditions`, `get_project_permission_query_conditions`, `has_lead_permission`, `has_project_permission`, `propagate_pole_to_project`.
3. **[`frappe_apps/bokengi_erp/bokengi_erp/hooks.py`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/hooks.py) :**
   - Enregistrement des dictionnaires `permission_query_conditions` et `has_permission` pour `Lead` et `Project`.
   - Mise à jour de la liste `fixtures` (Custom Field `Project`).
4. **[`tests/unit/erpnext-pole-permissions.test.ts`](file:///E:/01_Projets/Actifs/Bokengi-group/tests/unit/erpnext-pole-permissions.test.ts) (Nouveau fichier de test) :**
   - Suite de 10 tests automatisés couvrant l'ensemble des scénarios et de la matrice d'accès.

---

## 7. ANALYSE DES RISQUES & PLAN DE MITIGATION

| Risque Identifié | Impact | Mesure de Mitigation Préconisée |
|---|---|---|
| **Blocage accidentel des tableaux de bord du Cockpit Enterprise** | Élevé | Les rôles `Bokengi Executive`, `System Manager` et `Administrator` sont explicitement exemptés du filtre SQL (retour string vide `""`). Les cartes consolidées restent alimentées. |
| **Contournement par les rapports personnalisés Frappe** | Moyen | Les hooks `permission_query_conditions` s'appliquent automatiquement aux requêtes SQL des Query Reports et Report Builder de Frappe v15. |
| **Pôle non renseigné sur un document historique** | Faible | Définition d'un comportement par défaut sécurisé et script d'alignement initial des Lead/Projects existants sur `POL-it` ou pôle d'origine. |
| **Régression du routage Mattermost validé** | Aucun | Le routage Mattermost ([`src/lib/mattermost.ts`](file:///E:/01_Projets/Actifs/Bokengi-group/src/lib/mattermost.ts)) lit `custom_treatment_pole` ou `custom_requested_pole`. Le cloisonnement renforce la cohérence sans modifier la logique de notification validée. |

---

## 8. PROCÉDURE DE ROLLBACK

Si une anomalie bloquante survenait lors du déploiement Staging/Prod :
1. Désactiver les hooks `permission_query_conditions` et `has_permission` dans [`frappe_apps/bokengi_erp/bokengi_erp/hooks.py`](file:///E:/01_Projets/Actifs/Bokengi-group/frappe_apps/bokengi_erp/bokengi_erp/hooks.py) par simple mise en commentaire.
2. Exécuter `bench migrate` ou redémarrer le conteneur Frappe.
3. Le système réassumera le comportement standard sans aucune perte de données ni altération de schéma DB.

---

## 9. CONCLUSION & FEU VERT ATTENDU

L'audit technique est achevé sans aucune modification de code.
La stratégie de cloisonnement par pôle côté serveur dans ERPNext v15 est parfaitement cadrée, sécurisée et garantit la non-régression du Cockpit Enterprise 2.0.

**STOP APRÈS LE RAPPORT.**
J'attends votre feu vert explicite pour lancer l'implémentation de la Phase 2.
