# Bokengi Group 2.0 · Platform Foundation

Plateforme web institutionnelle et headless CMS de **Bokengi Group** — Ingénierie informatique, solutions numériques et services professionnels.

---

## 1. Architecture Technique

- **Framework Web :** [Next.js 16](https://nextjs.org/) (App Router, Server Components, React 19)
- **CMS Headless :** [Payload CMS 3.x](https://payloadcms.com/) (intégré directement dans le projet Next.js sur `/admin`)
- **Base de Données :** [PostgreSQL sur Neon](https://neon.tech/) (Serverless Postgres via `@payloadcms/db-vercel-postgres`)
- **Stockage Médias :** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Design System :** Bokengi Design System V4 (Corporate Technology, tokens natifs dark/light, Outfit, Inter, Fira Code, zéro bouton pilule)
- **Hébergement :** [Vercel](https://vercel.com/)

---

## 2. Cartographie des Domaines

Le projet distingue clairement le domaine de production future et l'environnement technique intermédiaire :

| Environnement | Domaine / URL | Rôle & Usage |
|---|---|---|
| **Production Future** | `https://bokengi-group.com` | Domaine officiel final de la marque (bascule DNS ultérieure) |
| **Preview / Développement** | `https://bokengi.vercel.app` | Environnement technique temporaire Vercel pour validation et tests |
| **Local** | `http://localhost:3000` | Environnement de développement machine |

> [!NOTE]
> Aucun changement DNS ou bascule Vercel n'est effectué à ce stade. `bokengi.vercel.app` sert d'URL canonique temporaire.

---

## 3. Configuration des Contacts (Phase 1.1)

L'adresse de contact principale est gérée de façon centralisée afin de ne jamais figer ni exposer d'adresse personnelle (ex: Gmail) dans le code source :

- **Variable maîtresse :** `CONTACT_EMAIL` (ou `NEXT_PUBLIC_CONTACT_EMAIL`)
- **Rôle :** Alimente dynamiquement le Footer, les formulaires de prise de contact / devis, les notifications système, Payload et l'intégration Resend (Phase 3).
- **Valeur actuelle :** Non définie par défaut dans le code. En l'absence de variable, l'interface propose un lien élégant vers le formulaire de contact.

---

## 4. Démarrage Local

### Prérequis
- **Node.js :** `>= 20.x` (v24 LTS recommandé)
- **Gestionnaire de paquets :** `pnpm` (v10 ou v11)

### Installation et exécution
```bash
# Installation des dépendances
pnpm install

# Configuration des variables d'environnement
cp .env.example .env

# Génération des types TypeScript et de l'importmap Payload
pnpm generate:importmap
pnpm generate:types

# Lancement en mode développement
pnpm dev

# Compilation de production
pnpm build

# Démarrage de la version compilée
pnpm start
```

---

## 5. Accès aux Interfaces

- **Frontend Public (Validation Phase 1) :** `http://localhost:3000/`
- **Panneau d'Administration Payload :** `http://localhost:3000/admin`
- **API GraphQL :** `http://localhost:3000/api/graphql`
- **API Playground :** `http://localhost:3000/api/graphql-playground`

---

## 6. Structure des Dossiers

```
bokengi-group-web/
├── .env.example            # Variables d'environnement documentées
├── next.config.ts          # Configuration Next.js & withPayload
├── src/
│   ├── app/
│   │   ├── (frontend)/     # Routes publiques & Layout Bokengi V4
│   │   └── (payload)/      # Routes Admin et API Payload CMS
│   ├── collections/        # Définition des collections (Media, Users, puis Phase 2)
│   ├── components/
│   │   └── bokengi/        # Navbar, Footer, HeroV4, Kicker, ThemeToggle
│   ├── config/
│   │   └── site.ts         # Configuration centralisée (siteConfig, CONTACT_EMAIL, domaines)
│   ├── payload.config.ts   # Configuration centrale Payload CMS
│   ├── providers/
│   │   └── Theme/          # ThemeProvider Dark/Light anti-FOUC
│   └── styles/
│       └── fonts.ts        # Polices Outfit, Inter, Fira Code (next/font/google)
└── public/                 # Assets officiels (bokengi-mark.svg, logos, manifest, favicons)
```

---

## 7. Sécurité & Bonnes Pratiques

- Aucun secret ni identifiant de base de données n'est commité dans le dépôt (`.env` et `.env.*.local` sont dans le `.gitignore`).
- Les tokens d'accès, mots de passe et clés API sont injectés exclusivement via les variables d'environnement Vercel ou fichiers `.env` locaux.
