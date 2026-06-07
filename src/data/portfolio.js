export const portfolioProjects = [
  {
    id: 'esiika',
    category: 'Full-Stack',
    title: 'ESIIKA — Marketplace Congo-Brazzaville',
    summary:
      'Plateforme e-commerce de mode et électronique (neuf & occasion) avec livraison à Brazzaville et paiement Mobile Money / Airtel Money / Visa.',
    challenge:
      'Ancien frontend statique difficile à maintenir, backend PHP à sécuriser et besoin d\'une expérience d\'achat fiable pour un marché africain.',
    solution:
      'Reconstruction du frontend en React + Vite, API REST PHP durcie (rate limiting, bcrypt, sessions), pipeline de build vers hébergement LWS et administration dynamique.',
    results: [
      'Site en production sur esiika.com',
      'Parcours complet : inscription, panier, checkout, admin',
      'Backend sécurisé : CSRF, rate limiting, secrets hors Git',
    ],
    stack: ['React', 'Vite', 'PHP', 'MySQL', 'Axios'],
    year: '2025',
    client: 'Projet fondateur · Marketplace Afrique',
  },
  {
    id: 'kongama',
    category: 'Full-Stack',
    title: 'Kongama Academy — Plateforme e-learning',
    summary:
      'Écosystème numérique connectant apprenants et formateurs, avec interface moderne et expérience mobile-first.',
    challenge:
      'Offrir une plateforme éducative fluide, accessible partout, avec une navigation simple et des performances élevées sur mobile.',
    solution:
      'Application React + TypeScript (Vite), UI shadcn/ui + Tailwind, architecture PWA et déploiement continu synchronisé avec le workflow de production.',
    results: [
      'Plateforme en ligne sur kongama.com',
      'Interface responsive et PWA-ready',
      'Stack moderne : React, TypeScript, Tailwind, Vite',
    ],
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'shadcn/ui'],
    year: '2026',
    client: 'Kongama Academy · Éducation numérique',
  },
  {
    id: 'bisomaptech',
    category: 'Full-Stack & Cybersécurité',
    title: 'BisoMapTech — Carte tech du Congo',
    summary:
      'Plateforme open source qui cartographie et connecte la communauté informatique congolaise : devs, sysadmins, cybersécurité, DevOps.',
    challenge:
      'Rendre visible un écosystème tech dispersé et permettre des échanges sécurisés entre profils, lieux et communautés.',
    solution:
      'Carte interactive Leaflet, profils détaillés avec sync GitHub, messagerie chiffrée E2E (ECDH P-256 + AES-GCM), backend Supabase et déploiement Vercel.',
    results: [
      'Carte interactive + recherche multi-critères',
      'Messagerie chiffrée de bout en bout',
      'Auth Supabase, admin modération, mode clair/sombre',
    ],
    stack: ['React', 'TypeScript', 'Supabase', 'Leaflet', 'Zustand'],
    year: '2025',
    client: 'Projet open source · Communauté tech Congo',
  },
  {
    id: 'fleetguard',
    category: 'DevOps & Administration Systèmes',
    title: 'FleetGuard — Gestion maritime des équipements',
    summary:
      'Application de suivi des équipements de sécurité à bord (extincteurs, radeaux, EPIRB…) avec alertes d\'expiration et sync multi-appareils.',
    challenge:
      'Remplacer un suivi papier/Excel par un outil fiable, accessible sur mer et à terre, avec historique et rapports de conformité.',
    solution:
      'Single-page app JavaScript vanilla, stockage cloud Upstash Redis via API serverless Vercel, polling temps réel, dashboard Chart.js et export rapport HTML.',
    results: [
      'Synchronisation cloud entre tous les appareils',
      'Alertes automatiques par code couleur',
      'Historique complet des modifications + export rapport',
    ],
    stack: ['JavaScript', 'Upstash Redis', 'Vercel', 'Chart.js'],
    year: '2025',
    client: 'Projet métier · Flotte maritime',
  },
];