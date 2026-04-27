# Kal-Cooperation — Landing Page

> Site vitrine freelance · Single-file HTML · Zero dépendances locales

![Preview](https://img.shields.io/badge/status-production-2d6a4f?style=flat-square)
![Type](https://img.shields.io/badge/type-single--file%20HTML-1a3a2a?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-52b788?style=flat-square)

---

## Aperçu

Landing page one-page pour **Kal-Cooperation**, cabinet de conseil freelance en ingénierie informatique. Conçu pour les PME et entrepreneurs cherchant une expertise en développement full-stack, cybersécurité, administration systèmes et maintenance informatique.

---

## Stack

| Technologie | Usage |
|---|---|
| HTML5 sémantique | Structure |
| CSS3 (variables, animations, grid) | Style & layout |
| JavaScript vanilla | Scroll animations, ticker |
| Google Fonts (DM Serif Display, DM Mono, DM Sans) | Typographie |

**Aucune dépendance npm. Aucun build requis.**

---

## Structure

```
kal-cooperation/
├── index.html          # Site complet (single-file)
├── README.md           # Ce fichier
├── .gitignore          # Fichiers à ignorer
└── LICENSE             # Licence MIT
```

---

## Déploiement

### GitHub Pages (recommandé)

1. Fork ou clone ce dépôt
2. `Settings` → `Pages` → Source : `main` / `root`
3. Le site est live sur `https://<username>.github.io/kal-cooperation`

### Netlify / Vercel

Drag & drop du fichier `index.html` sur [netlify.com/drop](https://app.netlify.com/drop) — en ligne en 30 secondes.

### Local

```bash
git clone https://github.com/<username>/kal-cooperation.git
cd kal-cooperation
open index.html   # macOS
# ou
xdg-open index.html  # Linux
```

---

## Sections

| Section | Description |
|---|---|
| **Hero** | Accroche + terminal animé + stats |
| **Services** | 3 cartes — Full-Stack, Cybersécurité, Systèmes |
| **Ticker** | Bandeau défilant de toutes les compétences |
| **À propos** | Présentation + stack technologique |
| **Contact** | CTA email + informations pratiques |

---

## Personnalisation rapide

Toutes les couleurs sont centralisées dans les variables CSS en haut du fichier `index.html` :

```css
:root {
  --ink: #0a0a0a;           /* Texte principal */
  --paper: #f5f2ed;         /* Fond clair */
  --accent: #1a3a2a;        /* Vert foncé (sections sombres) */
  --accent-bright: #2d6a4f; /* Vert moyen (accents) */
  --accent-glow: #52b788;   /* Vert vif (highlights) */
}
```

Pour modifier l'email de contact, chercher `contact@kal-cooperation.com` dans `index.html`.

---

## Licence

MIT — libre d'utilisation, de modification et de distribution.
