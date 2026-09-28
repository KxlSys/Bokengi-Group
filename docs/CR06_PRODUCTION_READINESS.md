# BOKENGI GROUP 2.0 — RAPPORT DE PRÉPARATION PRODUCTION CR-06 (PRODUCTION READINESS)

**Demande de Changement :** `CR-06` — Tableaux de Bord BI Direction (Couche Analytique & Apache Superset)  
**Date :** 26 Septembre 2026  
**Version :** 2.0.0 — Production Readiness  
**Statut CR-06 :** 🟢 **READY FOR PRODUCTION DEPLOYMENT** (En attente du mandat d'activation finale)  
**Baseline Canonique Préservée :** Phase 10.8  
**Classification :** Plan d'Exécution & Vérification des Prérequis de Production  

---

## 1. Prérequis Disponibles (100% Validés en Staging)

| Élément / Composant | État & Emplacement | Statut |
| :--- | :--- | :---: |
| **Stack Docker BI** | [`docker-compose.bi.yml`](file:///E:/01_Projets/Actifs/Bokengi-group/docker-compose.bi.yml) (Superset 3.1.0, Postgres 15, Redis 7) | 🟢 **PRÊT** |
| **Secrets & Environnement** | `.env.bi` généré et [`.env.bi.example`](file:///E:/01_Projets/Actifs/Bokengi-group/.env.bi.example) documenté | 🟢 **PRÊT** |
| **Scripts Vues Analytiques** | [`scripts/bi/init_bi_views.sql`](file:///E:/01_Projets/Actifs/Bokengi-group/scripts/bi/init_bi_views.sql) (4 vues Lot 1) | 🟢 **PRÊT** |
| **Modèle SQL READ-ONLY** | Utilisateur `superset_ro` bridé à `GRANT SELECT` exclusif sur les 4 vues | 🟢 **PRÊT** |
| **Dashboard Exécutif** | Spécification `DASHBOARD_EXECUTIVE_BOKENGI` (Lot 1 : CRM + Delivery + Temps) | 🟢 **PRÊT** |
| **Verrou Financier CR-03** | Panneau CA / Marge scellé et marqué "EN ATTENTE CR-03" | 🟢 **PRÊT** |
| **Tests Automatisés Dédiés** | [`tests/unit/cr06-superset-bi.test.ts`](file:///E:/01_Projets/Actifs/Bokengi-group/tests/unit/cr06-superset-bi.test.ts) (5/5 tests PASS) | 🟢 **PRÊT** |

---

## 2. Prérequis Manquants (Arbitrage Propriétaire Requis)

- ⏳ **Comptes Utilisateurs Nominatifs :** Fourniture des adresses emails réelles des membres de la Direction Générale et Financière pour initialiser les accès nominatifs dans Superset (à défaut, seul le compte d'administration technique local est initialisé).

---

## 3. Commandes de Déploiement Prévues

Lorsque le mandat formel de déploiement sera donné :

```bash
# Étape 1 : Démarrage de la stack conteneurisée
docker compose -f docker-compose.bi.yml up -d

# Étape 2 : Initialisation des métadonnées et rôles Superset
docker exec -it bokengi-superset-app superset db upgrade
docker exec -it bokengi-superset-app superset init

# Étape 3 : Déploiement des vues SQL et de l'utilisateur superset_ro dans MariaDB
# (Exécution contrôlée du script scripts/bi/init_bi_views.sql)
```

---

## 4. Smoke Tests de Production Prévus

Post-déploiement, les 6 vérifications suivantes seront exécutées :
1. **Disponibilité des Conteneurs :** Statut `Up (healthy)` pour `superset-app`, `superset-db`, `superset-redis`.
2. **Accessibilité Web :** Interface Superset accessible sur `127.0.0.1:8088`.
3. **Connexion MariaDB READ-ONLY :** Test `SELECT` réussi sur les 4 vues `view_bi_*`.
4. **Verrouillage Écriture :** Test d'interdiction formelle sur `INSERT`, `UPDATE`, `DELETE`, `DROP`.
5. **Dashboard Lot 1 :** Rendu fonctionnel des 4 panneaux (CRM, Conversion, Delivery, Temps).
6. **Étanchéité Financière & InfraPulse :** Panneau CA/Marge scellé et absence totale d'InfraPulse.

---

## 5. Procédure de Rollback

En cas d'anomalie lors de la mise en service :
```bash
# Arrêt immédiat et suppression des conteneurs
docker compose -f docker-compose.bi.yml down -v

# Nettoyage MariaDB
mysql -u root -p -e "
  DROP VIEW IF EXISTS bokengi_erp.view_bi_pipeline;
  DROP VIEW IF EXISTS bokengi_erp.view_bi_conversion;
  DROP VIEW IF EXISTS bokengi_erp.view_bi_delivery;
  DROP VIEW IF EXISTS bokengi_erp.view_bi_timesheet;
  DROP USER IF EXISTS 'superset_ro'@'%';
"
```

---

## 6. Statut de Gouvernance CR-06

- **Statut Actuel :** 🟢 **`READY FOR PRODUCTION DEPLOYMENT`** (Lot 1 : CRM + Delivery + Temps).
- **Consigne :** En attente du mandat explicite de déploiement de la direction.
