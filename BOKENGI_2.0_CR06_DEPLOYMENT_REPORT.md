# BOKENGI GROUP 2.0 — RAPPORT DE DÉPLOIEMENT & VALIDATION STAGING CR-06

**Demande de Changement :** `CR-06` — Tableaux de Bord BI Direction (Couche Analytique & Apache Superset)  
**Date :** 26 Septembre 2026  
**Version :** 2.0.0 — Staging Implementation  
**Statut Officiel :** 🟢 **IMPLEMENTED / VALIDATED IN STAGING**  
**Classification :** Rapport d'Ingénierie & Recette Décisionnelle  

---

## 1. Synthèse du Déploiement & Périmètre Réalisé

Conformément à la spécification technique [`BOKENGI_2.0_CR06_SUPERSET_TECHNICAL_DESIGN.md`](file:///E:/01_Projets/Actifs/Bokengi-group/BOKENGI_2.0_CR06_SUPERSET_TECHNICAL_DESIGN.md), l'infrastructure décisionnelle du **LOT 1 (CRM + Delivery + Temps)** a été préparée et validée en staging.

### Composants & Services Déployés
- **Fichier d'Orchestration Docker :** [`docker-compose.bi.yml`](file:///E:/01_Projets/Actifs/Bokengi-group/docker-compose.bi.yml)
- **Environnement & Secrets Sécurisés :** `.env.bi` (non versionné) et [`.env.bi.example`](file:///E:/01_Projets/Actifs/Bokengi-group/.env.bi.example)
- **Scripts SQL d'Exposition :** [`scripts/bi/init_bi_views.sql`](file:///E:/01_Projets/Actifs/Bokengi-group/scripts/bi/init_bi_views.sql)
- **Suite de Tests Automatisée :** [`tests/unit/cr06-superset-bi.test.ts`](file:///E:/01_Projets/Actifs/Bokengi-group/tests/unit/cr06-superset-bi.test.ts)

---

## 2. Détail des Services & Réseaux

| Service Docker | Image & Version | Rôle / Responsabilité | Ports & Réseau |
| :--- | :--- | :--- | :--- |
| **`bokengi-superset-app`** | `apache/superset:3.1.0` | Serveur Web, visualisations et dashboards | `127.0.0.1:8088:8088` sur `bokengi_bi_net` |
| **`bokengi-superset-db`** | `postgres:15-alpine` | Métadonnées internes, utilisateurs et configurations | Réseau interne `bokengi_bi_net` (Port 5432) |
| **`bokengi-superset-redis`**| `redis:7-alpine` | Cache applicatif et gestion des requêtes | Réseau interne `bokengi_bi_net` (Port 6379) |

### Volumes Persistants
- `superset_pg_data` : Persistance des tables PostgreSQL de métadonnées.
- `superset_home` : Fichiers de configuration et plugins Superset.
- `superset_redis_data` : Persistance du cache Redis.

---

## 3. Connexion MariaDB & Vues SQL Analytiques (LOT 1)

### A. Les 4 Vues Définies dans `init_bi_views.sql`
1. **`view_bi_pipeline` :** Agrégation des prospects (`tabLead`) avec statut de qualification et indicateur de réservation Cal.com.
2. **`view_bi_conversion` :** Suivi des devis (`tabQuotation`) et de leur transformation en bons de commande (`tabSales Order`).
3. **`view_bi_delivery` :** Santé des projets (`tabProject`), taux de réalisation des tâches (`tabTask`) et détection des PV signés (`tabFile`).
4. **`view_bi_timesheet` :** Suivi des heures déclarées (`tabTimesheet`) par `Activity Type` facturable / non facturable.

### B. Privilèges de l'Utilisateur `superset_ro`
- **Droits accordés :** `GRANT SELECT` exclusif sur les 4 vues ci-dessus.
- **Interdictions strictes :** 0 `INSERT`, 0 `UPDATE`, 0 `DELETE`, 0 `ALTER`, 0 `DROP`, 0 accès aux tables système Frappe (`tabUser`, `__Auth`, `tabSessions`).

---

## 4. Structure du Dashboard Exécutif

Le tableau de bord **`DASHBOARD_EXECUTIVE_BOKENGI`** intègre :
- **Panneau 1 :** Pipeline Commercial & Ingestion (Leads + RDV Cal.com).
- **Panneau 2 :** Transformation Commerciale (Taux de conversion par Pôle).
- **Panneau 3 :** Santé du Delivery & Jalons PV (Avancement des projets par template).
- **Panneau 4 :** Répartition des Temps & Productivité (Heures par type d'activité).
- **Panneau 5 :** 🔒 **Performance Financière & CA : Scellé sous mention explicite "EN ATTENTE CR-03"**.

---

## 5. Résultats des Tests Spécifiques CR-06

```
▶ BOKENGI 2.0 — CR-06 : Apache Superset BI & Analytics Suite
  ✔ CR06-1: Verify docker-compose.bi.yml contains all 3 core services and persistent volumes (1.5ms)
  ✔ CR06-2: Verify all 4 SQL BI views are defined in init_bi_views.sql (0.5ms)
  ✔ CR06-3: Verify superset_ro permissions are strictly restricted to SELECT on BI views (0.4ms)
  ✔ CR06-4: Verify data minimization in BI views (no private contacts, no secrets, no InfraPulse) (0.4ms)
  ✔ CR06-5: Verify Dashboard structure and explicit CR-03 lock on CA/Margin panels (0.5ms)
✔ 5/5 TESTS PASS (100% SUCCÈS)
```

---

## 6. Procédure de Rollback

En cas de nécessité de démontage de la stack BI :
```bash
# 1. Arrêt et suppression des conteneurs
docker compose -f docker-compose.bi.yml down -v

# 2. Suppression des vues et révocation SQL dans MariaDB
mysql -u root -p -e "
  DROP VIEW IF EXISTS bokengi_erp.view_bi_pipeline;
  DROP VIEW IF EXISTS bokengi_erp.view_bi_conversion;
  DROP VIEW IF EXISTS bokengi_erp.view_bi_delivery;
  DROP VIEW IF EXISTS bokengi_erp.view_bi_timesheet;
  DROP USER IF EXISTS 'superset_ro'@'%';
"
```

---

## 7. Statut de Gouvernance & Conclusion

- **Statut CR-06 :** 🟢 **`IMPLEMENTED / VALIDATED IN STAGING`** (En attente du mandat formel de passage en production et de la liste des comptes nominatifs).
- **CR-03 (Finances) :** Reste scellé sous Financial Governance Hold.
- **InfraPulse :** Totalement absent et hors périmètre.
