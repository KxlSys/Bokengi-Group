# PAYLOAD TO ERPNEXT — GIT UNTRACKED ARTIFACTS AUDIT

Ce rapport dresse l'inventaire strict des fichiers non-trackés détectés sur le dépôt, avec la matrice de classification requise, sans exécuter de suppression ou de `git add` sauvage, afin d'éviter tout leak de secrets ou d'archives massives.

## 1. MATRICE DES FICHIERS NON-TRACKÉS

| Fichier / Répertoire | Type | Rôle | Sensible | Rollback | Audit | À versionner | Action |
|---|---|---|---|---|---|---|---|
| `src/lib/erpnext-client.ts` | Code source (TS) | **Client API Frappe pour Next.js (CRITIQUE)** | NON (utilise env vars) | NON | NON | **OUI** | **Versionner obligatoirement** (dépendance de Prod) |
| `PAYLOAD_TO_ERPNEXT_*.md` (x10) | Documentation | Runbooks et bilans d'étapes (Staging, Dry-run) | NON | NON | **OUI** | OUI | Déplacer vers `docs/` puis versionner |
| `docs/PAYLOAD_TO_ERPNEXT_*.md` (x5) | Documentation | Rapports d'audit Phase 1, Cutover, etc. | NON | NON | **OUI** | OUI | Conserver dans `docs/` et versionner |
| `logs/*-journal.json` (x5) | Logs structurés | Traces d'exécution des migrations (Stats/Durées) | NON (valeurs masquées) | NON | **OUI** | OUI | Archiver ou versionner dans `docs/logs/` |
| `production-migration-001-journal.json` | Logs structurés | Bilan final d'exécution de la prod | NON | NON | **OUI** | OUI | Déplacer vers `logs/` et versionner |
| `scripts/migration/*.ts` | Scripts | Code d'automatisation des migrations historiques | NON | NON | **OUI** | OUI | Versionner dans `scripts/migration/` |
| `scripts/migration/.env.migration.example`| Config | Template d'environnement (valeurs factices) | NON | NON | NON | OUI | Versionner pour référence |
| `scripts/erpnext/*.json` | Config | Blueprints des doctypes et champs Frappe | NON | NON | OUI | OUI | Versionner comme infrastructure as code |

## 2. VÉRIFICATION DES SECRETS & DONNÉES SENSIBLES
- **Analyse des journaux (`*.json`)** : Les JSON ne contiennent que les noms des variables (`ERPNEXT_API_KEY`, etc.) sans leur valeur réelle. Zéro token fuité.
- **Client TypeScript** : `src/lib/erpnext-client.ts` utilise `process.env` et `cf.env`, aucune clé n'y est hardcodée.
- **Dumps/Archives** : Aucune base de données SQL (`.sql`, `.gz`) ni archive lourde (`.zip`) n'apparaît dans ce status git, ce qui confirme que l'archivage de la Phase 1 (`backups/payload/payload_code_archive_20260925.zip`) est soit ignoré, soit absent de ce `git status` car non ajouté.
- **Résultat** : Zéro donnée sensible détectée parmi ces fichiers non-trackés.

## 3. VÉRIFICATION DU .GITIGNORE
L'analyse du `.gitignore` actuel révèle :
- ✅ `.env*` est correctement protégé.
- ⚠️ `backups/`, `dumps/`, `*.sql`, `*.sql.gz`, `*.zip` ne sont **PAS** explicitement protégés. 
- *Recommandation* : Il est impératif d'ajouter ces lignes au `.gitignore` avant la prochaine phase d'archive ou de dump pour éviter un `git add .` désastreux.

## 4. DÉPENDANCES CRITIQUES
- **Le fichier `src/lib/erpnext-client.ts` est vital**. Le site Next.js (`Next.js → ERPNext → R2`) plantera au prochain déploiement si ce fichier n'est pas envoyé sur le dépôt.

## 5. DÉCISION ET RECOMMANDATIONS

- **Action 1 (Production)** : Faire un `git add src/lib/erpnext-client.ts` immédiat.
- **Action 2 (Propreté)** : Regrouper tous les `.md` orphelins de la racine vers le dossier `docs/`.
- **Action 3 (Propreté)** : Mettre le `production-migration-001-journal.json` dans `logs/`.
- **Action 4 (Sécurité)** : Mettre à jour `.gitignore` avec les exclusions de backups et d'archives.
- **Action 5 (Audit)** : Commiter l'ensemble (`docs/`, `logs/`, `scripts/`) en tant que bloc d'audit historique des migrations.

PAYLOAD → ERPNEXT — GIT UNTRACKED ARTIFACTS AUDIT TERMINÉ / EN ATTENTE DE VALIDATION
