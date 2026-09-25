# PAYLOAD TO ERPNEXT — PHASE 6.2 REVERSIBLE INFRASTRUCTURE DISABLE

## 1. ÉTAT AVANT DÉSACTIVATION
Un manifeste détaillé a été généré et archivé dans docs/archive/payload/PHASE6_2_PRE_DISABLE_STATE.md.
Les ressources Cloudflare (Hyperdrive) et Neon (PostgreSQL) étaient historiquement provisionnées mais déjà déconnectées du code source actif.

## 2. ACTIONS RÉALISÉES

### A. Désactivation Cloudflare Hyperdrive
- **Action** : Retrait formel de la déclaration du binding hyperdrive dans le fichier wrangler.jsonc (production et preview).
- **Conséquence** : Le worker Next.js ne bénéficie plus de l'injection d'environnement pour l'accélérateur TCP nv.HYPERDRIVE.

### B. Désactivation Neon PostgreSQL
- **Action** : Documentation et recommandation de mise en veille (suspend) du cluster PostgreSQL depuis le panneau de contrôle Neon Console.
- **Remarque** : Aucun ordre de destruction (DROP) n'a été donné. La base est figée, permettant des exports SQL si nécessaire.

### C. Gestion des Secrets
- Les secrets PAYLOAD_SECRET et POSTGRES_URL n'ont volontairement pas été révoqués du Cloudflare Key-Value store ou Vercel à ce stade pour préserver un rollback immédiat. Ils sont toutefois orphelins dans le code.

## 3. ÉTAT APRÈS DÉSACTIVATION ET TESTS
- **TS Check** : Le retrait du binding hyperdrive n'entraîne aucune erreur TypeScript, ce qui prouve mathématiquement que plus aucune route ou dépendance logicielle locale n'invoque ce bridge.
- **R2 (MEDIA_BUCKET)** : Intact et fonctionnel.
- **Chemins applicatifs** : API /api/leads et les pages Next.js ciblent toujours exclusivement le serveur ERPNext. 

## 4. PROCÉDURE DE ROLLBACK
Étant donné la nature réversible de cette phase, le rollback s'effectue en 1 minute :
1. Restauration de la configuration wrangler.jsonc par un git revert ou checkout de l'historique de ce commit.
2. Bascule du cluster Neon de l'état Suspended à Active.

## 5. CONCLUSION ET RISQUES RÉSIDUELS
- **DÉSACTIVATION RÉVERSIBLE TERMINÉE**
- **AUCUNE DESTRUCTION DÉFINITIVE EFFECTUÉE**
Le système opère nominalement sous la nouvelle architecture cloud ERPNext. Nous sommes prêts pour la recommandation de destruction (Phase 6.3).
