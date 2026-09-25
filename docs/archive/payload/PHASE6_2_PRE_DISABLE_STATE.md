# PHASE 6.2 - PRE-DISABLE SNAPSHOT

## 1. MÉTADONNÉES
- Date: 2026-09-25 18:26:31
- Git Commit: 26e2b7a46269b9128783c0b02cacbd099abe6d9a
- Status: Pre-Decommissioning Phase 6.2

## 2. ÉTAT CLOUDFLARE HYPERDRIVE
- Binding HYPERDRIVE présent dans wrangler.jsonc.
- ID Prod: 67e941a48c744118b9faa0adf0affa79
- ID Preview: 3b28e5bf5151410480fd9505eb7413fe
- Statut: Actif historiquement pour Payload.

## 3. ÉTAT NEON POSTGRESQL
- Base historique toujours intacte.
- Suspension prévue après suppression des accès TCP/HTTP.

## 4. SECRETS PAYLOAD
- PAYLOAD_SECRET, POSTGRES_URL : Actifs dans les interfaces Vercel/Cloudflare, mais ignorés par le code Next.js actuel.

## 5. R2 ET ERPNEXT
- MEDIA_BUCKET : Actif et critique (bokengi-media).
- ERPNEXT_API_URL : Actif et critique (Source unique de vérité).

## 6. MÉTHODE DE ROLLBACK (SI REQUIS)
1. Restauration de wrangler.jsonc via Git Checkout.
2. Dé-suspension de la base Neon dans le dashboard.
3. Aucune modification destructive n'étant effectuée, le système est immédiatement réversible.
