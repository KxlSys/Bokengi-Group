/**
 * DONNÉES OFFICIELLES BOKENGI GROUP 2.0
 * Source de vérité éditoriale et technique pour le seed Payload CMS et les pages SSR.
 */

export interface PoleData {
  name: string
  slug: string
  num: string
  shortDescription: string
  description: string
  icon: string
  order: number
  status: 'published' | 'draft'
  domains: string
  seo: {
    title: string
    description: string
  }
}

export interface ServiceData {
  title: string
  slug: string
  poleSlug: string
  category: string
  shortDescription: string
  content: string
  technicalTags: { tag: string }[]
  featured: boolean
  order: number
  status?: 'published' | 'draft'
}

export interface CaseStudyScreenshot {
  url: string
  alt?: string
  caption?: string
  width?: number
  height?: number
}

export interface CaseStudyData {
  title: string
  slug: string
  clientName: string
  category: string
  summary: string
  context: string
  challenge: string
  solution: string
  results: string
  resultsList: string[]
  technologies: { name: string }[]
  architecture: string
  featured: boolean
  publishedDate: string
  status?: 'published' | 'draft'
  screenshots?: CaseStudyScreenshot[]
  seo: {
    title: string
    description: string
  }
}

export interface PostAuthor {
  name: string
  email?: string
  role?: string
}

export interface PostCoverImage {
  url: string
  alt?: string
  width?: number
  height?: number
}

export interface PostData {
  id?: number | string
  title: string
  slug: string
  excerpt: string
  content: string
  rawContent?: any
  author?: PostAuthor | null
  coverImage?: PostCoverImage | null
  categories: string[]
  category?: string
  tags: string[]
  publishedAt: string
  readingTime: number
  status: 'published' | 'draft'
  seo: {
    title: string
    description: string
    image?: string
  }
}

export const POLES_SEED_DATA: PoleData[] = [
  {
    name: 'Bokengi IT',
    slug: 'it',
    num: '01',
    shortDescription: 'Infrastructures, cybersécurité et systèmes au service de la continuité de vos activités.',
    description:
      'Bokengi IT conçoit, déploie et supervise des infrastructures informatiques résilientes pour les organisations exigeantes. De la protection périmétrique à la gestion des parcs serveurs, nous garantissons l\'intégrité, la haute disponibilité et la conformité de vos actifs numériques.',
    icon: 'server',
    order: 1,
    status: 'published',
    domains: 'Infrastructures · Cybersécurité · Systèmes critiques',
    seo: {
      title: 'Bokengi IT · Cybersécurité, Systèmes & Infrastructures',
      description: 'Expertise en ingénierie informatique, audit de vulnérabilités, architectures réseaux et infogérance haute disponibilité.',
    },
  },
  {
    name: 'Bokengi Digital',
    slug: 'digital',
    num: '02',
    shortDescription: 'Solutions web modernes, plateformes transactionnelles et applications mobiles à fort impact.',
    description:
      'Bokengi Digital bâtit des applications web et mobiles performantes, adaptées aux réalités des marchés africains et internationaux. Nous concevons des architectures découplées, des portails e-commerce et des solutions PWA ultra-rapides.',
    icon: 'code',
    order: 2,
    status: 'published',
    domains: 'Plateformes Web · E-Commerce · Applications Mobiles · PWA',
    seo: {
      title: 'Bokengi Digital · Plateformes Web & Solutions Mobiles',
      description: 'Développement de plateformes web sur-mesure, intégrations Mobile Money et applications déconnectables haute performance.',
    },
  },
  {
    name: 'Bokengi Business',
    slug: 'business',
    num: '03',
    shortDescription: 'Digitalisation des flux opérationnels, ERP, CRM et pilotage de la performance.',
    description:
      'Bokengi Business accompagne la transformation numérique des entreprises par l\'automatisation des processus administratifs, l\'intégration de solutions de gestion commerciale et la mise en place de tableaux de bord décisionnels en temps réel.',
    icon: 'trending-up',
    order: 3,
    status: 'published',
    domains: 'Gestion Opérationnelle · ERP & CRM · Automatisation des flux',
    seo: {
      title: 'Bokengi Business · Digitalisation Opérationnelle & ERP',
      description: 'Optimisation de la productivité d\'entreprise, réduction du traitement papier et automatisation des workflows métiers.',
    },
  },
  {
    name: 'Bokengi Consulting',
    slug: 'consulting',
    num: '04',
    shortDescription: 'Conseil stratégique, audit de maturité, conformité réglementaire et gouvernance.',
    description:
      'Bokengi Consulting conseille les directions générales et techniques dans la définition de leur schéma directeur numérique, l\'analyse des risques informatiques, la souveraineté des données et la mise en conformité réglementaire.',
    icon: 'compass',
    order: 4,
    status: 'published',
    domains: 'Conseil Stratégique · Audit & Risques · Souveraineté des Données',
    seo: {
      title: 'Bokengi Consulting · Conseil Stratégique & Schéma Directeur',
      description: 'Assistance à maîtrise d\'ouvrage, gouvernance des données, plans de continuité d\'activité (PCA) et gestion des risques.',
    },
  },
  {
    name: 'Bokengi Events',
    slug: 'events',
    num: '05',
    shortDescription: 'Événementiel institutionnel, coordination technique et régie de conférences hybrides.',
    description:
      'Bokengi Events fournit des solutions techniques complètes pour vos sommets, salons professionnels et conférences d\'envergure : captation multi-caméras, régie streaming sécurisée, sonorisation et plateformes d\'enregistrement dédiées.',
    icon: 'calendar',
    order: 5,
    status: 'published',
    domains: 'Événementiel Hybride · Régie Streaming · Solutions Techniques',
    seo: {
      title: 'Bokengi Events · Événementiel Professionnel & Régie Technique',
      description: 'Diffusion live multi-canaux, coordination technique de conférences et plateformes d\'accréditation événementielle.',
    },
  },
]

export const SERVICES_SEED_DATA: ServiceData[] = [
  // ── SERVICES BOKENGI IT ──
  {
    title: 'Cybersécurité & Résilience des Systèmes',
    slug: 'cybersecurite-resilience',
    poleSlug: 'it',
    category: 'Sécurité Offensive & Défensive',
    shortDescription: 'Protection périmétrique, audit de vulnérabilités, sauvegardes immuables et gouvernance stricte des accès.',
    content: 'Audit d\'intrusion (pentesting), durcissement des serveurs (hardening), mise en œuvre de politiques de moindre privilège et déploiement de stratégies de sauvegarde déconnectées garantissant une reprise d\'activité immédiate.',
    technicalTags: [{ tag: 'Audit Pentest' }, { tag: 'Hardening Linux' }, { tag: 'Chiffrement AES' }, { tag: 'Sauvegardes Immuables' }],
    featured: true,
    order: 1,
  },
  {
    title: 'Infrastructures Réseaux & Serveurs Cloud',
    slug: 'systemes-reseaux-cloud',
    poleSlug: 'it',
    category: 'Architecture Système',
    shortDescription: 'Architecture réseau local et distant, serveurs haute disponibilité, VPN chiffrés et infogérance continue.',
    content: 'Déploiement d\'environnements serveurs sur site et hybrides, interconnexion sécurisée de sites distants par VPN WireGuard/IPsec, monitoring temps réel et équilibrage de charge.',
    technicalTags: [{ tag: 'Réseaux VPN' }, { tag: 'Docker & Microservices' }, { tag: 'Nginx HA' }, { tag: 'PostgreSQL Cluster' }],
    featured: true,
    order: 2,
  },
  {
    title: 'Ingénierie Logicielle & Architectures API',
    slug: 'ingenierie-logicielle-api',
    poleSlug: 'it',
    category: 'Développement Backend',
    shortDescription: 'Conception de logiciels métier, API RESTful robustes, modélisation de bases de données et intégrations pérennes.',
    content: 'Conception de backends performants, sécurisation des flux de données, découplage applicatif et intégration d\'APIs tierces avec monitoring de latence.',
    technicalTags: [{ tag: 'Node.js / TypeScript' }, { tag: 'Python' }, { tag: 'PostgreSQL' }, { tag: 'RESTful API' }],
    featured: false,
    order: 3,
  },
  {
    title: 'Supervision & Maintenance IT (MCO)',
    slug: 'maintenance-support-it',
    poleSlug: 'it',
    category: 'Exploitation & Infogérance',
    shortDescription: 'Contrats de maintenance proactive, assistance technique réactive et télémétrie continue de vos parcs.',
    content: 'Surveillance prédictive de vos serveurs et réseaux, application rigoureuse des correctifs de sécurité, support de niveau 2/3 et engagements de temps de rétablissement (GTR).',
    technicalTags: [{ tag: 'Supervision 24/7' }, { tag: 'Grafana & Prometheus' }, { tag: 'SLA / GTR' }, { tag: 'Support Dédié' }],
    featured: false,
    order: 4,
  },

  // ── SERVICES BOKENGI DIGITAL ──
  {
    title: 'Plateformes Web & Portails Haute Performance',
    slug: 'plateformes-web-portails',
    poleSlug: 'digital',
    category: 'Ingénierie Web',
    shortDescription: 'Conception de portails institutionnels et applications web sur-mesure combinant fluidité et référencement naturel.',
    content: 'Développement d\'architectures Next.js modernes intégrant le rendu côté serveur (SSR), la gestion de contenu Headless et une optimisation stricte pour les réseaux à bande passante limitée.',
    technicalTags: [{ tag: 'Next.js 16' }, { tag: 'React 19' }, { tag: 'Tailwind CSS' }, { tag: 'Headless CMS' }],
    featured: true,
    order: 1,
  },
  {
    title: 'E-Commerce & Intégration Mobile Money',
    slug: 'ecommerce-paiements-africains',
    poleSlug: 'digital',
    category: 'Commerce Numérique',
    shortDescription: 'Boutiques en ligne optimisées pour les paiements locaux : Mobile Money, Airtel Money et cartes bancaires.',
    content: 'Parcours d\'achat sans friction, panier dynamique, sécurisation des transactions financières, calcul automatique des frais de livraison et interface de gestion des stocks.',
    technicalTags: [{ tag: 'Airtel Money' }, { tag: 'MTN Mobile Money' }, { tag: 'Passerelle Carte' }, { tag: 'Anti-fraude' }],
    featured: true,
    order: 2,
  },
  {
    title: 'Applications Mobiles & PWA Déconnectables',
    slug: 'applications-mobiles-pwa',
    poleSlug: 'digital',
    category: 'Développement Mobile',
    shortDescription: 'Applications mobiles et Progressive Web Apps fonctionnant avec ou sans connexion internet.',
    content: 'Développement d\'interfaces ergonomiques mobile-first avec synchronisation automatique en tâche de fond dès le retour du réseau et notifications push.',
    technicalTags: [{ tag: 'Progressive Web App' }, { tag: 'Service Workers' }, { tag: 'Offline Storage' }, { tag: 'Multiplateforme' }],
    featured: false,
    order: 3,
  },
  {
    title: 'Refonte Applicative & Audit d\'Expérience (UX/UI)',
    slug: 'modernisation-refonte-applicative',
    poleSlug: 'digital',
    category: 'Design & Modernisation',
    shortDescription: 'Modernisation de systèmes hérités, amélioration des temps de réponse et design de systèmes d\'interface d\'entreprise.',
    content: 'Audit d\'accessibilité, refactorisation de code legacy, mise en place de Design Systems cohérents et amélioration mesurable des taux de conversion.',
    technicalTags: [{ tag: 'Design System' }, { tag: 'Audit Web Vitals' }, { tag: 'Accessibilité' }, { tag: 'Refactoring' }],
    featured: false,
    order: 4,
  },

  // ── SERVICES BOKENGI BUSINESS ──
  {
    title: 'Digitalisation des Processus & Zéro Papier',
    slug: 'digitalisation-processus-metiers',
    poleSlug: 'business',
    category: 'Automatisation',
    shortDescription: 'Automatisation des circuits de validation, dématérialisation documentaire et suppression des tâches manuelles répétitives.',
    content: 'Cartographie des flux de travail, mise en place de formulaires intelligents avec signature électronique et archivage sécurisé des pièces justificatives.',
    technicalTags: [{ tag: 'Workflow BPM' }, { tag: 'Signature Électronique' }, { tag: 'Archivage Sécurisé' }],
    featured: false,
    order: 1,
  },
  {
    title: 'Intégration ERP & Outils de Gestion Commerciale',
    slug: 'integration-erp-crm',
    poleSlug: 'business',
    category: 'Gestion d\'Entreprise',
    shortDescription: 'Centralisation des devis, facturation, suivi client et gestion des stocks dans un environnement unifié.',
    content: 'Paramétrage et interconnexion d\'outils CRM/ERP adaptés à votre secteur d\'activité pour éliminer les doubles saisies et fiabiliser la comptabilité.',
    technicalTags: [{ tag: 'CRM Intégré' }, { tag: 'Gestion Facturation' }, { tag: 'Suivi Trésorerie' }],
    featured: false,
    order: 2,
  },
  {
    title: 'Tableaux de Bord Décisionnels & Reporting',
    slug: 'business-intelligence-tableaux-bord',
    poleSlug: 'business',
    category: 'Analyse & Pilotage',
    shortDescription: 'Visualisation claire des indicateurs clés de performance (KPIs) en temps réel pour éclairer les décisions de direction.',
    content: 'Agrégation des sources de données disparates, conception d\'indicateurs financiers et opérationnels automatisés et alertes sur seuils critiques.',
    technicalTags: [{ tag: 'KPIs Temps Réel' }, { tag: 'Data Visualisation' }, { tag: 'Export Multi-formats' }],
    featured: false,
    order: 3,
  },
  {
    title: 'Conduite du Changement & Formation des Équipes',
    slug: 'assistance-conduite-changement',
    poleSlug: 'business',
    category: 'Accompagnement Humain',
    shortDescription: 'Formations sur-mesure et méthodologie éprouvée pour garantir l\'adoption rapide des nouveaux outils numériques.',
    content: 'Rédaction de guides d\'utilisation clairs, ateliers de prise en main, accompagnement des collaborateurs et mesure de l\'adhésion interne.',
    technicalTags: [{ tag: 'Ateliers Métiers' }, { tag: 'Guides Pratiques' }, { tag: 'Support Utilisateurs' }],
    featured: false,
    order: 4,
  },

  // ── SERVICES BOKENGI CONSULTING ──
  {
    title: 'Schéma Directeur & Audit de Maturité Numérique',
    slug: 'audit-maturite-schema-directeur',
    poleSlug: 'consulting',
    category: 'Stratégie Numérique',
    shortDescription: 'Diagnostic exhaustif de votre système d\'information et cadrage d\'une feuille de route technologique à 3 ans.',
    content: 'Analyse des forces et faiblesses techniques, alignement des investissements IT avec la vision stratégique et priorisation des chantiers à fort retour sur investissement.',
    technicalTags: [{ tag: 'Diagnostic 360°' }, { tag: 'Feuille de Route' }, { tag: 'Optimisation Budgétaire' }],
    featured: false,
    order: 1,
  },
  {
    title: 'Souveraineté des Données & Conformité Réglementaire',
    slug: 'conformite-souverainete-donnees',
    poleSlug: 'consulting',
    category: 'Gouvernance & Droit',
    shortDescription: 'Protection des données sensibles, localisation souveraine et mise en conformité avec les réglementations nationales.',
    content: 'Cartographie des flux de données personnelles, rédaction des chartes d\'usage, politiques de conservation et sécurisation contractuelle avec vos sous-traitants.',
    technicalTags: [{ tag: 'Conformité Données' }, { tag: 'Souveraineté Cloud' }, { tag: 'Chartes Internes' }],
    featured: false,
    order: 2,
  },
  {
    title: 'Plans de Continuité d\'Activité (PCA & PRA)',
    slug: 'gestion-risques-pca-pra',
    poleSlug: 'consulting',
    category: 'Gestion des Crises',
    shortDescription: 'Stratégies de reprise d\'activité pour maintenir vos opérations vitales face aux sinistres et cyberattaques.',
    content: 'Analyse d\'impact sur l\'activité (BIA), définition des objectifs de temps et de pertes admissibles (RTO/RPO) et rédaction de procédures de secours testées.',
    technicalTags: [{ tag: 'PCA Opérationnel' }, { tag: 'Scénarios de Crise' }, { tag: 'Tests RTO / RPO' }],
    featured: false,
    order: 3,
  },
  {
    title: 'Assistance à Maîtrise d\'Ouvrage (AMOA)',
    slug: 'assistance-maitrise-ouvrage-amoa',
    poleSlug: 'consulting',
    category: 'Pilotage de Projets',
    shortDescription: 'Cadrage impartial de vos appels d\'offres, sélection des prestataires et pilotage rigoureux des livrables.',
    content: 'Rédaction de cahiers des charges fonctionnels précis, grille d\'évaluation objective des offres éditeurs et arbitrage technique indépendant pour défendre vos intérêts.',
    technicalTags: [{ tag: 'Cahier des Charges' }, { tag: 'Dépouillement d\'Offres' }, { tag: 'Suivi Recette' }],
    featured: false,
    order: 4,
  },

  // ── SERVICES BOKENGI EVENTS ──
  {
    title: 'Captation Multi-Caméras & Régie Streaming HD',
    slug: 'captation-regie-streaming',
    poleSlug: 'events',
    category: 'Technique Audiovisuelle',
    shortDescription: 'Régie technique broadcast pour la retransmission en direct haute définition de vos conférences et sommets.',
    content: 'Mise en place de caméras professionnelles, incrustation graphique aux couleurs de votre événement, sonorisation anti-larsen et flux sécurisés pour Youtube, LinkedIn et plateformes privées.',
    technicalTags: [{ tag: 'Streaming HD' }, { tag: 'Multi-caméras' }, { tag: 'Sonorisation Pro' }, { tag: 'Liaison Secours 4G/5G' }],
    featured: false,
    order: 1,
  },
  {
    title: 'Coordination Technique d\'Événements Hybrides',
    slug: 'coordination-evenements-hybrides',
    poleSlug: 'events',
    category: 'Logistique Événementielle',
    shortDescription: 'Gestion technique intégrale reliant les participants présents en salle et les intervenants connectés à distance.',
    content: 'Gestion des écrans géants de retour de scène, modération des questions du public en ligne, traduction simultanée et supervision technique de bout en bout.',
    technicalTags: [{ tag: 'Événements Hybrides' }, { tag: 'Interactivité Public' }, { tag: 'Régie Plateau' }],
    featured: false,
    order: 2,
  },
  {
    title: 'Plateformes Événementielles & Billetterie QR',
    slug: 'plateformes-evenementielles-dediees',
    poleSlug: 'events',
    category: 'Outils Numériques',
    shortDescription: 'Portails d\'enregistrement, billetterie en ligne sécurisée et émargement instantané par scan QR code sur site.',
    content: 'Création du site web dédié à votre événement, génération automatique des badges nominatifs avec QR code unique et tableau de bord des présences en temps réel.',
    technicalTags: [{ tag: 'Badges QR Code' }, { tag: 'Émargement Rapide' }, { tag: 'Billetterie Dédiée' }],
    featured: false,
    order: 3,
  },
  {
    title: 'Production de Contenus Média & Aftermovies',
    slug: 'production-contenus-medias',
    poleSlug: 'events',
    category: 'Communication Post-Event',
    shortDescription: 'Photographie professionnelle, vidéos récapitulatives dynamiques (aftermovies) et capsules pour réseaux sociaux.',
    content: 'Montage rapide pour communication à chaud le jour même, interviews des intervenants clés et livraison d\'un ensemble complet de visuels haute définition libres de droits.',
    technicalTags: [{ tag: 'Aftermovie 4K' }, { tag: 'Capsules Réseaux' }, { tag: 'Photographie HD' }],
    featured: false,
    order: 4,
  },
]

export const CASE_STUDIES_SEED_DATA: CaseStudyData[] = [
  {
    title: 'Plateforme ESIIKA — Marketplace Congo-Brazzaville',
    slug: 'esiika',
    clientName: 'Écosystème ESIIKA · Commerce en Afrique centrale',
    category: 'Bokengi Digital & IT · E-Commerce & Full-Stack',
    summary:
      'Conception et déploiement d\'une marketplace robuste de mode et d\'électronique avec paiement Mobile Money, gestion de stock et logistique de livraison à Brazzaville.',
    context:
      'Le projet ESIIKA répond au besoin croissant de structuration du commerce en ligne en République du Congo. L\'architecture initiale reposait sur un frontend monolithique difficile à maintenir et un backend PHP vulnérable aux attaques de force brute, avec un manque critique de fiabilité dans le traitement des commandes.',
    challenge:
      'Il était impératif de concevoir une plateforme fluide et sécurisée, capable d\'exécuter des transactions financières sans faille, de résister aux coupures de connexion fréquentes et de gérer simultanément des milliers de références produits avec des variations de stocks dynamiques.',
    solution:
      'Les équipes Bokengi ont reconstruit l\'application autour d\'une architecture découplée : un frontend ultra-rapide sous React et TypeScript optimisé pour mobile, adossé à une API REST sécurisée avec rate-limiting, hachage bcrypt, protection CSRF et validation stricte des entrées. L\'infrastructure est conteneurisée avec Docker et servie derrière un reverse-proxy Nginx avec certificats SSL automatisés et passerelles Mobile Money (Airtel Money et MTN).',
    results:
      'La marketplace est opérationnelle en production sur esiika.com. Le parcours client est entièrement digitalisé : catalogue dynamique, panier persistant, paiement Mobile Money sécurisé et console d\'administration commerciale complète.',
    resultsList: [
      'Plateforme déployée et en production active sur esiika.com',
      'Parcours transactionnel complet : authentification, panier, checkout Mobile Money & Visa',
      'Sécurisation éprouvée du backend : protection CSRF, limitation de débit et secrets hors Git',
      'Temps de chargement réduit de plus de 55% par rapport à la version précédente',
    ],
    technologies: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Node.js' },
      { name: 'PostgreSQL' },
      { name: 'Docker' },
      { name: 'Nginx' },
      { name: 'Airtel Money API' },
    ],
    architecture:
      'Architecture découplée en micro-services conteneurisés sous Docker Compose. Reverse-proxy Nginx gérant le terminaison SSL et la mise en cache statique. Base de données relationnelle PostgreSQL avec indexation optimisée pour la recherche de produits. Passerelle de webhooks sécurisée pour la confirmation des transactions financières.',
    featured: true,
    publishedDate: '2026-06-15',
    seo: {
      title: 'Étude de cas ESIIKA · Marketplace Congo-Brazzaville — Bokengi Group',
      description: 'Découvrez comment Bokengi Group a conçu et sécurisé la marketplace ESIIKA avec intégration Mobile Money et infrastructure Docker.',
    },
  },
  {
    title: 'Portail Kongama — Système d\'Administration & Gestion Opérationnelle',
    slug: 'portail-kongama',
    clientName: 'Kongama Group · Direction des Opérations',
    category: 'Bokengi Digital & Business · Système d\'Information & Gestion',
    summary:
      'Digitalisation des flux documentaires administratifs, automatisation des validations et centralisation des opérations internes pour l\'écosystème Kongama.',
    context:
      'Kongama Group gérait auparavant ses approbations budgétaires, ses bordereaux d\'expédition et ses archives documentaires via des processus manuels papier et des feuilles de calcul dispersées, entraînant des pertes de temps considérables et des risques d\'erreurs d\'imputation.',
    challenge:
      'Créer un portail unique, rigoureusement sécurisé avec contrôle d\'accès basé sur les rôles (RBAC), permettant à des dizaines d\'agents de collaborer sans goulot d\'étranglement avec une traçabilité totale des signatures.',
    solution:
      'Bokengi a modélisé et développé un portail d\'administration réactif en TypeScript et Next.js, connecté à un backend d\'automatisation Express/Node.js et une base de données PostgreSQL. Un cluster de cache Redis a été déployé pour accélérer le rendu des tableaux de bord volumineux et gérer les sessions concurrentes.',
    results:
      'Le portail Kongama a permis de réduire le délai de validation des dossiers opérationnels de plusieurs jours à quelques heures seulement, tout en assurant un journal d\'audit infalsifiable.',
    resultsList: [
      'Réduction mesurée de 65% des délais de traitement des dossiers administratifs',
      'Traçabilité et journalisation intégrale de 100% des actions et approbations',
      'Gestion granulaire des permissions selon les profils (direction, comptabilité, logistique)',
      'Adoption par 100% des collaborateurs dès le premier mois de déploiement',
    ],
    technologies: [
      { name: 'TypeScript' },
      { name: 'Next.js' },
      { name: 'Node.js / Express' },
      { name: 'PostgreSQL' },
      { name: 'Redis' },
      { name: 'Tailwind CSS' },
    ],
    architecture:
      'Architecture en couches avec API REST typée de bout en bout en TypeScript. Authentification basée sur des sessions chiffrées en mémoire Redis. Base PostgreSQL normalisée pour garantir l\'intégrité référentielle des documents et des approbations.',
    featured: true,
    publishedDate: '2025-11-20',
    seo: {
      title: 'Étude de cas Portail Kongama · Digitalisation Opérationnelle — Bokengi Group',
      description: 'Découvrez comment le portail Kongama a dématérialisé les flux documentaires internes avec TypeScript, Redis et PostgreSQL.',
    },
  },
  {
    title: 'Kongama Academy — Plateforme d\'Éducation & E-Learning',
    slug: 'kongama-academy',
    clientName: 'Kongama Academy · Éducation numérique',
    category: 'Bokengi Digital & IT · EdTech & Formation Continue',
    summary:
      'Écosystème d\'apprentissage numérique connectant formateurs et apprenants, conçu avec une architecture mobile-first PWA optimisée pour l\'Afrique.',
    context:
      'Kongama Academy avait pour ambition de proposer des formations d\'excellence en ingénierie et technologies numériques à des étudiants souvent confrontés à des connexions mobiles instables et des forfaits data restreints.',
    challenge:
      'Fournir une interface pédagogique immersive et fluide capable de fonctionner de manière transparente en mode déconnecté, sans compromis sur la richesse interactive des cours.',
    solution:
      'Bokengi a conçu une Progressive Web App (PWA) de pointe sous React et TypeScript (Vite/Next.js), reposant sur les composants accessibles de Tailwind et shadcn/ui. Les contenus textuels et exercices sont mis en cache localement via Service Workers et synchronisés silencieusement lors de la reconnexion.',
    results:
      'La plateforme est en ligne sur kongama.com. Elle offre un confort d\'apprentissage inégalé, avec des temps de navigation instantanés et un taux de rétention d\'étudiants largement supérieur aux plateformes d\'e-learning traditionnelles.',
    resultsList: [
      'Plateforme éducative en ligne active sur kongama.com',
      'Architecture PWA complète avec installation écran d\'accueil et mode hors-ligne',
      'Temps de chargement initial inférieur à 1.2s sur connexion 3G/4G',
      'Suivi automatisé de la progression des apprenants et délivrance d\'attestations',
    ],
    technologies: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
      { name: 'Vite / Next.js' },
      { name: 'shadcn/ui' },
      { name: 'PWA / Service Workers' },
    ],
    architecture:
      'Frontend moderne PWA avec mise en cache granulaire des ressources statiques et dynamiques via Cache API et IndexedDB. Découpage du code (code-splitting) par module d\'apprentissage. API découplée garantissant la légèreté des payloads JSON.',
    featured: true,
    publishedDate: '2026-01-10',
    seo: {
      title: 'Étude de cas Kongama Academy · E-learning PWA — Bokengi Group',
      description: 'Conception de l\'écosystème Kongama Academy : formation numérique mobile-first, PWA déconnectable et expérience fluide.',
    },
  },
  {
    title: 'BisoMapTech — Cartographie Tech & Réseau Sécurisé du Congo',
    slug: 'bisomaptech',
    clientName: 'Initiative Open Source · Communauté Informatique du Congo',
    category: 'Bokengi IT & Cybersécurité · SIG & Cryptographie E2E',
    summary:
      'Plateforme interactive open source qui cartographie et connecte les professionnels de l\'informatique au Congo avec messagerie chiffrée de bout en bout.',
    context:
      'L\'écosystème technologique congolais souffrait d\'un manque de visibilité globale, les développeurs, administrateurs systèmes et spécialistes cybersécurité travaillant en silos sans moyen de communication sécurisé et souverain.',
    challenge:
      'Cartographier avec précision géographique les talents et communautés à l\'échelle nationale, tout en fournissant un canal d\'échange direct à l\'abri de toute interception ou surveillance.',
    solution:
      'Bokengi a développé une cartographie interactive géolocalisée sous Leaflet avec synchronisation automatique des profils GitHub. Un protocole de messagerie privée chiffrée de bout en bout (E2E) a été implémenté directement dans le navigateur via l\'API Web Cryptography (échange de clés asymétriques ECDH P-256 et chiffrement symétrique AES-GCM 256 bits).',
    results:
      'BisoMapTech référence plusieurs centaines de profils d\'ingénieurs à Brazzaville, Pointe-Noire et dans la diaspora, devenant la référence open source de la tech congolaise.',
    resultsList: [
      'Cartographie interactive SIG avec recherche multi-critères et géolocalisation',
      'Messagerie chiffrée de bout en bout (ECDH P-256 + AES-GCM) à divulgation nulle',
      'Authentification sécurisée, administration de modération et thèmes dark/light',
      'Code source auditable publié sous licence open source pour la communauté',
    ],
    technologies: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Supabase / PostgreSQL' },
      { name: 'Leaflet GIS' },
      { name: 'Web Crypto API' },
      { name: 'Zustand' },
    ],
    architecture:
      'Architecture client-side zero-knowledge : les clés privées ne quittent jamais le navigateur de l\'utilisateur. Base de données distribuée Supabase/PostgreSQL avec politiques de sécurité Row-Level Security (RLS). Rendu cartographique vectoriel tuilé optimisé.',
    featured: true,
    publishedDate: '2025-09-05',
    seo: {
      title: 'Étude de cas BisoMapTech · Cartographie Tech Congo — Bokengi Group',
      description: 'Découvrez BisoMapTech : cartographie interactive open source et messagerie chiffrée E2E pour les ingénieurs du Congo.',
    },
  },
  {
    title: 'FleetGuard — Télémétrie & Supervision des Équipements Maritimes',
    slug: 'fleetguard',
    clientName: 'Opérateur Maritime & Gestionnaire de Flotte',
    category: 'Bokengi IT & Infrastructure · Monitoring IoT & Supervision d\'Actifs',
    summary:
      'Système embarqué et cloud de suivi en temps réel de la conformité des équipements de sécurité critiques à bord de navires avec alertes d\'expiration proactives.',
    context:
      'La gestion des équipements de sauvetage et de sécurité maritime (extincteurs, radeaux de survie, balises de détresse EPIRB) était historiquement consignée sur papier, exposant les armateurs à de lourdes sanctions réglementaires en cas de dépassement de validité.',
    challenge:
      'Assurer la traçabilité continue de centaines d\'équipements à bord de bâtiments naviguant en haute mer, avec synchronisation périodique vers les équipes techniques à terre dès la reprise de connectivité portuaire ou satellitaire.',
    solution:
      'Bokengi a mis en place une architecture de télémétrie IoT combinant des micro-services Python et un broker de messages MQTT sous Linux Server. Un tableau de bord interactif sous Chart.js et Grafana permet aux commandants de bord et aux armateurs de visualiser instantanément l\'état du parc par code couleur et de générer des rapports de conformité certifiés.',
    results:
      'FleetGuard garantit 100% de conformité aux audits maritimes internationaux, éliminant tout risque d\'immobilisation de navire pour cause de matériel expiré.',
    resultsList: [
      'Dispositif de télémétrie et synchronisation multi-appareils sécurisée',
      'Système d\'alertes automatiques prédictives par code couleur (vert, orange, rouge)',
      'Génération instantanée de rapports de conformité réglementaire aux normes maritimes',
      'Résilience totale : fonctionnement autonome en mer et synchronisation automatique à quai',
    ],
    technologies: [
      { name: 'Python' },
      { name: 'MQTT Broker' },
      { name: 'Linux Server' },
      { name: 'Upstash Redis / PostgreSQL' },
      { name: 'Chart.js' },
      { name: 'Grafana' },
    ],
    architecture:
      'Architecture IoT résiliente : passerelle locale à bord communiquant via le protocole léger MQTT. Tampon de données local en cas de coupure de liaison satellitaire. Synchronisation idempotente vers la base cloud dès rétablissement du réseau. Visualisation analytique découplée.',
    featured: true,
    publishedDate: '2025-07-30',
    seo: {
      title: 'Étude de cas FleetGuard · Télémétrie Maritime & IoT — Bokengi Group',
      description: 'Supervision des équipements de sécurité maritime avec alertes prédictives, télémétrie IoT et conformité réglementaire par Bokengi IT.',
    },
  },
]

export const POSTS_SEED_DATA: PostData[] = [
  {
    title: 'Les impératifs de la souveraineté numérique et de l\'hébergement résilient en Afrique centrale',
    slug: 'souverainete-numerique-afrique',
    category: 'Infrastructure & Cloud',
    categories: ['Infrastructure & Cloud', 'Souveraineté IT'],
    tags: ['Datacenter', 'Souveraineté', 'Cloud Privé', 'Résilience'],
    publishedAt: '2026-03-01T08:00:00.000Z',
    readingTime: 5,
    status: 'published',
    author: {
      name: 'Kalel Damba',
      role: 'Direction Technique & Systèmes',
    },
    coverImage: {
      url: '/og-image.png',
      alt: 'Souveraineté numérique et hébergement résilient en Afrique centrale',
    },
    excerpt:
      'Face aux défis d\'interconnexion, de latence et d\'exfiltration des flux sensibles, la relocalisation des infrastructures informatiques et l\'adoption de clouds souverains constituent désormais la pierre angulaire de l\'indépendance économique des entreprises d\'Afrique centrale.',
    content: `La transformation numérique du continent africain traverse un point d'inflexion stratégique. Longtemps tributaires de serveurs hébergés en Europe ou en Amérique du Nord, les entreprises et institutions publiques locales découvrent les limites concrètes de cette dépendance : temps de latence réseau dégradés lors de ruptures de câbles sous-marins, contraintes de conformité réglementaire sur la protection des données personnelles, et exposition aux aléas géopolitiques internationaux.

1. Le coût réel de la dépendance aux infrastructures distantes
Chaque paquet IP qui doit traverser les océans pour être traité par un serveur distant avant de revenir sur le terminal d'un collaborateur local représente non seulement un coût financier direct en bande passante internationale, mais aussi une vulnérabilité opérationnelle. Lorsque le câble WACS ou SAT-3 subit des coupures fortuites, ce sont des pans entiers de la productivité bancaire, logistique ou administrative qui se retrouvent paralysés.

2. Les piliers d'un cloud hybride souverain
Chez Bokengi Group, nous préconisons une architecture pragmatique :
- Des nœuds de calcul locaux à haute disponibilité (Datacenters Tier III situés sur le territoire national).
- Des passerelles Edge résilientes capables de continuer à fonctionner en mode dégradé hors ligne (Offline-First).
- Une réplication chiffrée asynchrone vers des datacenters secondaires distribués pour le plan de reprise d'activité (PRA).

3. Vers une autonomie technologique durable
Bâtir une souveraineté numérique ne signifie pas s'isoler des standards mondiaux, mais maîtriser l'ensemble de la chaîne de valeur : du système d'exploitation Linux durci à la gouvernance des clés cryptographiques, jusqu'à la formation des ingénieurs locaux chargés de l'exploitation. C'est l'engagement quotidien que portent nos divisions d'ingénierie.`,
    seo: {
      title: 'Souveraineté Numérique & Hébergement Résilient en Afrique · Bokengi Group',
      description:
        'Analyse stratégique sur la souveraineté numérique, les infrastructures locales et la résilience cloud en Afrique centrale.',
    },
  },
  {
    title: 'Security by Design : intégrer la cryptographie et l\'audit continu dès la phase de cadrage',
    slug: 'security-by-design-systemes-critiques',
    category: 'Cybersécurité',
    categories: ['Cybersécurité', 'Ingénierie Logicielle'],
    tags: ['Security by Design', 'Pentest', 'E2E Encryption', 'DevSecOps'],
    publishedAt: '2026-02-15T09:30:00.000Z',
    readingTime: 6,
    status: 'published',
    author: {
      name: 'Équipe Cybersécurité Bokengi',
      role: 'Audit & Sécurité Offensive',
    },
    coverImage: {
      url: '/og-image.png',
      alt: 'Security by Design et cryptographie appliquée',
    },
    excerpt:
      'Dans les secteurs bancaires, gouvernementaux et logistiques, la sécurité ne peut plus être un filtre tardif. Découverte de nos pratiques d\'ingénierie : chiffrement symétrique et asymétrique, contrôle strict des flux et audits continus de code.',
    content: `Historiquement, la cybersécurité intervenait à la fin d'un projet informatique, sous la forme d'un test d'intrusion hâtif réalisé quelques jours avant la mise en production. Ce modèle est aujourd'hui obsolète et dangereux face à la sophistication des attaques actuelles.

1. Le principe du Security by Design
Intégrer la sécurité dès la phase de design architectural implique de poser trois questions fondamentales avant même d'écrire la première ligne de code :
- Quelles données sensibles transitent et où résident-elles au repos (Data at Rest) ?
- Quels sont les périmètres de confiance stricts (Zero Trust Architecture) entre chaque micro-service ?
- Que se passe-t-il si un composant ou un tiers est compromis ?

2. Chiffrement de bout en bout et divulgence nulle
Sur des projets d'envergure tels que notre plateforme collaborative BisoMapTech, Bokengi met en œuvre le chiffrement de bout en bout directement au niveau du client web via l'API standard Web Cryptography (ECDH P-256 pour l'échange de clés, AES-GCM 256 bits pour les payloads). Les serveurs d'infrastructure ne détiennent jamais la clé de déchiffrement, garantissant une étanchéité absolue même en cas d'intrusion sur la base de données.

3. Automatisation du pipeline DevSecOps
La sécurité n'est pas un état figé, c'est un processus continu :
- Analyse statique de code (SAST) et détection des secrets intégrées dans chaque Pull Request.
- Scans réguliers de vulnérabilités sur l'ensemble de l'arbre des dépendances directes et transitives.
- Revues de code par les pairs systématiques avec principe du moindre privilège appliqué à chaque rôle applicatif.`,
    seo: {
      title: 'Security by Design & Cryptographie Appliquée · Bokengi Group',
      description:
        'Méthodologie pour concevoir des architectures résilientes, sécurisées dès l\'origine et auditées en continu.',
    },
  },
  {
    title: 'Modernisation des systèmes d\'information : découplage, APIs et performance opérationnelle',
    slug: 'modernisation-systemes-information-apis',
    category: 'Transformation Digitale',
    categories: ['Transformation Digitale', 'Architecture Logicielle'],
    tags: ['Micro-services', 'APIs', 'Modernisation SI', 'Cloudflare Workers'],
    publishedAt: '2026-01-20T10:00:00.000Z',
    readingTime: 4,
    status: 'published',
    author: {
      name: 'Direction Ingénierie Digitale',
      role: 'Solutions Web & Produits',
    },
    coverImage: {
      url: '/og-image.png',
      alt: 'Modernisation des systèmes d information et architecture API',
    },
    excerpt:
      'Comment migrer un parc applicatif hétérogène vers une architecture modulaire sans rupture d\'exploitation. Analyse des gains apportés par le découplage headless, les APIs sécurisées et les déploiements Edge.',
    content: `Beaucoup d'organisations disposent d'un patrimoine logiciel éprouvé mais enfermé dans des architectures monolithiques rigides. L'ajout d'une fonctionnalité métier ou d'un nouveau canal numérique nécessite des semaines de recettage, avec un risque élevé de régression.

1. L'approche Strangler Fig : moderniser sans tout casser
Plutôt que d'envisager une réécriture totale « big bang » risquée et coûteuse, Bokengi applique le pattern Strangler Fig (étranglement progressif) :
- Interposition d'une passerelle d'APIs moderne en amont du système hérité (legacy).
- Réécriture progressive des domaines métiers isolables sous forme de services découplés.
- Bascule transparente des flux utilisateur sans interruption de service.

2. Les bénéfices de l'architecture Headless et de l'Edge Computing
En séparant clairement la logique métier (CMS Headless, base de données distribuée) de la restitution visuelle (Next.js App Router, Cloudflare Workers), les performances de rendu sont multipliées et les coûts d'infrastructure divisés :
- Temps de chargement inférieurs à 100 millisecondes grâce au routage Edge mondial.
- Indépendance totale des équipes produit qui peuvent itérer sur l'interface sans toucher au cœur applicatif.
- Résilience accrue : si un service tiers faiblit, le site et l'expérience utilisateur restent disponibles grâce à la mise en cache et à l'ISR (Incremental Static Regeneration).`,
    seo: {
      title: 'Modernisation des Systèmes d\'Information & Architecture API · Bokengi Group',
      description:
        'Stratégies de transition vers des architectures modulaires, performantes et interopérables.',
    },
  },
  {
    title: 'Note de recherche interne sur les réseaux Mesh (Brouillon non publié)',
    slug: 'brouillon-interne-non-publie',
    category: 'R&D',
    categories: ['R&D', 'Réseaux'],
    tags: ['Mesh', 'IoT'],
    publishedAt: '2026-03-05T12:00:00.000Z',
    readingTime: 3,
    status: 'draft',
    author: {
      name: 'Laboratoire R&D Bokengi',
      role: 'Recherche Appliquée',
    },
    excerpt: 'Document de cadrage préliminaire réservé aux équipes internes.',
    content: 'Contenu en cours de rédaction. Ne doit pas être exposé sur le frontend public.',
    seo: {
      title: 'Brouillon R&D · Bokengi Group',
      description: 'Document interne non public.',
    },
  },
]

// ============================================================================
// ENGLISH SEED DATASETS (AUTHENTIC TRANSLATIONS - ZERO COMPROMISE)
// ============================================================================

export const POLES_SEED_DATA_EN: PoleData[] = [
  {
    name: 'Bokengi IT',
    slug: 'it',
    num: '01',
    shortDescription: 'Critical infrastructure, cybersecurity, and systems ensuring continuous operational resilience.',
    description:
      'Bokengi IT designs, deploys, and monitors resilient IT infrastructure for demanding organizations. From perimeter defense to server fleet administration, we guarantee the integrity, high availability, and compliance of your digital assets.',
    icon: 'server',
    order: 1,
    status: 'published',
    domains: 'Infrastructure · Cybersecurity · Mission-Critical Systems',
    seo: {
      title: 'Bokengi IT · Cybersecurity, Systems & Infrastructure',
      description: 'Expertise in IT engineering, vulnerability audits, network architectures, and high-availability managed services.',
    },
  },
  {
    name: 'Bokengi Digital',
    slug: 'digital',
    num: '02',
    shortDescription: 'Modern web platforms, transactional architectures, and high-impact mobile applications.',
    description:
      'Bokengi Digital develops high-performance web and mobile applications engineered for African and international market conditions. We build decoupled architectures, e-commerce portals, and ultra-fast PWA solutions.',
    icon: 'code',
    order: 2,
    status: 'published',
    domains: 'Web Platforms · E-Commerce · Mobile Apps · PWA',
    seo: {
      title: 'Bokengi Digital · Web Platforms & Mobile Solutions',
      description: 'Custom web platform engineering, Mobile Money integrations, and offline-first high-performance applications.',
    },
  },
  {
    name: 'Bokengi Business',
    slug: 'business',
    num: '03',
    shortDescription: 'Operational workflow digitization, ERP, CRM, and real-time performance steering.',
    description:
      'Bokengi Business guides enterprise digital transformation by automating administrative workflows, integrating commercial management systems, and deploying real-time executive dashboards.',
    icon: 'trending-up',
    order: 3,
    status: 'published',
    domains: 'Operational Management · ERP & CRM · Workflow Automation',
    seo: {
      title: 'Bokengi Business · Operational Digitization & ERP',
      description: 'Enterprise productivity optimization, paperless workflow transition, and business process automation.',
    },
  },
  {
    name: 'Bokengi Consulting',
    slug: 'consulting',
    num: '04',
    shortDescription: 'Strategic advisory, digital maturity audits, regulatory compliance, and IT governance.',
    description:
      'Bokengi Consulting advises executive and technical leadership on strategic digital master plans, IT risk assessments, data sovereignty, and regulatory compliance frameworks.',
    icon: 'compass',
    order: 4,
    status: 'published',
    domains: 'Strategic Advisory · Audit & Risk · Data Sovereignty',
    seo: {
      title: 'Bokengi Consulting · Strategic Advisory & Master Plans',
      description: 'Project ownership assistance, data governance, business continuity planning (BCP), and IT risk management.',
    },
  },
  {
    name: 'Bokengi Events',
    slug: 'events',
    num: '05',
    shortDescription: 'Institutional events, technical coordination, and hybrid conference production.',
    description:
      'Bokengi Events delivers comprehensive technical solutions for summits, professional trade shows, and major conferences: multi-camera production, secure HD live streaming, sound engineering, and custom registration platforms.',
    icon: 'calendar',
    order: 5,
    status: 'published',
    domains: 'Hybrid Events · Live Streaming Production · Technical Solutions',
    seo: {
      title: 'Bokengi Events · Professional Events & Technical Production',
      description: 'Multi-channel live broadcasting, conference technical coordination, and event accreditation platforms.',
    },
  },
]

export const SERVICES_SEED_DATA_EN: ServiceData[] = [
  // ── SERVICES BOKENGI IT (EN) ──
  {
    title: 'Cybersecurity & Systems Resilience',
    slug: 'cybersecurite-resilience',
    poleSlug: 'it',
    category: 'Offensive & Defensive Security',
    shortDescription: 'Perimeter protection, vulnerability audits, immutable backups, and strict access governance.',
    content: 'Penetration testing, Linux server hardening, least-privilege policy implementation, and air-gapped backup strategies guaranteeing immediate disaster recovery.',
    technicalTags: [{ tag: 'Pentest Audit' }, { tag: 'Linux Hardening' }, { tag: 'AES Encryption' }, { tag: 'Immutable Backups' }],
    featured: true,
    order: 1,
  },
  {
    title: 'Network Infrastructure & Cloud Servers',
    slug: 'systemes-reseaux-cloud',
    poleSlug: 'it',
    category: 'Systems Architecture',
    shortDescription: 'Local and remote network architecture, high-availability servers, encrypted VPNs, and continuous managed services.',
    content: 'Deployment of on-premise and hybrid server environments, secure interconnection of remote sites via WireGuard/IPsec VPNs, real-time telemetry, and load balancing.',
    technicalTags: [{ tag: 'VPN Networks' }, { tag: 'Docker & Microservices' }, { tag: 'Nginx HA' }, { tag: 'PostgreSQL Cluster' }],
    featured: true,
    order: 2,
  },
  {
    title: 'Software Engineering & API Architectures',
    slug: 'ingenierie-logicielle-api',
    poleSlug: 'it',
    category: 'Backend Engineering',
    shortDescription: 'Custom business software design, robust RESTful APIs, relational database modeling, and enduring integrations.',
    content: 'High-performance backend design, data flow encryption, application decoupling, and third-party API integrations with active latency monitoring.',
    technicalTags: [{ tag: 'Node.js / TypeScript' }, { tag: 'Python' }, { tag: 'PostgreSQL' }, { tag: 'RESTful API' }],
    featured: false,
    order: 3,
  },
  {
    title: 'IT Monitoring & Maintenance (MCO)',
    slug: 'maintenance-support-it',
    poleSlug: 'it',
    category: 'Operations & Managed Services',
    shortDescription: 'Proactive maintenance contracts, rapid technical support, and continuous fleet telemetry.',
    content: 'Predictive monitoring of servers and networks, rigorous security patch management, tier 2/3 engineering support, and guaranteed recovery time commitments (RTO/SLA).',
    technicalTags: [{ tag: '24/7 Monitoring' }, { tag: 'Grafana & Prometheus' }, { tag: 'SLA / GTR' }, { tag: 'Dedicated Support' }],
    featured: false,
    order: 4,
  },

  // ── SERVICES BOKENGI DIGITAL (EN) ──
  {
    title: 'Web Platforms & High-Performance Portals',
    slug: 'plateformes-web-portails',
    poleSlug: 'digital',
    category: 'Web Engineering',
    shortDescription: 'Design of institutional portals and tailored web applications combining speed and organic SEO visibility.',
    content: 'Modern Next.js architectures featuring Server-Side Rendering (SSR), Headless content management, and strict optimization for bandwidth-constrained networks.',
    technicalTags: [{ tag: 'Next.js 16' }, { tag: 'React 19' }, { tag: 'Tailwind CSS' }, { tag: 'Headless CMS' }],
    featured: true,
    order: 1,
  },
  {
    title: 'E-Commerce & Mobile Money Integration',
    slug: 'ecommerce-paiements-africains',
    poleSlug: 'digital',
    category: 'Digital Commerce',
    shortDescription: 'Online stores optimized for African payment gateways: Mobile Money, Airtel Money, and bank cards.',
    content: 'Frictionless checkout flows, dynamic cart state, financial transaction encryption, automated delivery fee calculation, and real-time inventory management.',
    technicalTags: [{ tag: 'Airtel Money' }, { tag: 'MTN Mobile Money' }, { tag: 'Card Gateway' }, { tag: 'Fraud Prevention' }],
    featured: true,
    order: 2,
  },
  {
    title: 'Mobile Applications & Offline PWAs',
    slug: 'applications-mobiles-pwa',
    poleSlug: 'digital',
    category: 'Mobile Development',
    shortDescription: 'Mobile applications and Progressive Web Apps functioning seamlessly with or without internet connectivity.',
    content: 'Mobile-first user interfaces with automatic background synchronization upon network recovery and push notification capabilities.',
    technicalTags: [{ tag: 'Progressive Web App' }, { tag: 'Service Workers' }, { tag: 'Offline Storage' }, { tag: 'Cross-platform' }],
    featured: false,
    order: 3,
  },
  {
    title: 'Application Modernization & UX/UI Audit',
    slug: 'modernisation-refonte-applicative',
    poleSlug: 'digital',
    category: 'Design & Modernization',
    shortDescription: 'Legacy systems migration, latency reduction, and coherent enterprise design system creation.',
    content: 'Accessibility audits, legacy code refactoring, unified design system implementation, and measurable conversion rate improvements.',
    technicalTags: [{ tag: 'Design System' }, { tag: 'Web Vitals Audit' }, { tag: 'Accessibility' }, { tag: 'Refactoring' }],
    featured: false,
    order: 4,
  },

  // ── SERVICES BOKENGI BUSINESS (EN) ──
  {
    title: 'Process Digitization & Paperless Transition',
    slug: 'digitalisation-processus-metiers',
    poleSlug: 'business',
    category: 'Automation',
    shortDescription: 'Approval workflow automation, document paperless transition, and elimination of manual repetitive tasks.',
    content: 'Business process mapping, smart form deployment with electronic signatures, and secure document archiving.',
    technicalTags: [{ tag: 'BPM Workflow' }, { tag: 'Electronic Signature' }, { tag: 'Secure Archiving' }],
    featured: false,
    order: 1,
  },
  {
    title: 'ERP Integration & Commercial Management',
    slug: 'integration-erp-crm',
    poleSlug: 'business',
    category: 'Enterprise Management',
    shortDescription: 'Centralization of quotes, invoicing, customer follow-up, and inventory within a single unified workspace.',
    content: 'Configuration and integration of tailored CRM/ERP systems to eliminate duplicate entries and ensure accounting integrity.',
    technicalTags: [{ tag: 'Integrated CRM' }, { tag: 'Invoicing Management' }, { tag: 'Cash Flow Tracking' }],
    featured: false,
    order: 2,
  },
  {
    title: 'Executive Dashboards & Business Intelligence',
    slug: 'business-intelligence-tableaux-bord',
    poleSlug: 'business',
    category: 'Analytics & Steering',
    shortDescription: 'Clear real-time Key Performance Indicator (KPI) visualization to inform executive decision-making.',
    content: 'Aggregation of disparate data sources, automated financial and operational indicators, and threshold alert automation.',
    technicalTags: [{ tag: 'Real-Time KPIs' }, { tag: 'Data Visualization' }, { tag: 'Multi-Format Export' }],
    featured: false,
    order: 3,
  },
  {
    title: 'Change Management & Team Enablement',
    slug: 'assistance-conduite-changement',
    poleSlug: 'business',
    category: 'Organizational Coaching',
    shortDescription: 'Tailored training sessions and proven methodology to ensure rapid adoption of new digital platforms.',
    content: 'Clear operational user guides, hands-on workshops, user adoption tracking, and ongoing staff support.',
    technicalTags: [{ tag: 'Role Workshops' }, { tag: 'Practical Guides' }, { tag: 'User Support' }],
    featured: false,
    order: 4,
  },

  // ── SERVICES BOKENGI CONSULTING (EN) ──
  {
    title: 'IT Master Plan & Digital Maturity Audit',
    slug: 'audit-maturite-schema-directeur',
    poleSlug: 'consulting',
    category: 'Digital Strategy',
    shortDescription: 'Comprehensive diagnostic of your IT systems and formulation of a 3-year strategic technology roadmap.',
    content: 'Technical strengths and weaknesses analysis, IT investment alignment with corporate strategy, and high-ROI initiative prioritization.',
    technicalTags: [{ tag: '360° Diagnostic' }, { tag: 'Strategic Roadmap' }, { tag: 'Budget Optimization' }],
    featured: false,
    order: 1,
  },
  {
    title: 'Data Sovereignty & Regulatory Compliance',
    slug: 'conformite-souverainete-donnees',
    poleSlug: 'consulting',
    category: 'Governance & Legal',
    shortDescription: 'Sensitive data protection, sovereign hosting compliance, and alignment with national privacy frameworks.',
    content: 'Personal data flow mapping, IT security charter authoring, data retention policies, and subcontractor contract audits.',
    technicalTags: [{ tag: 'Data Compliance' }, { tag: 'Sovereign Cloud' }, { tag: 'Internal Charters' }],
    featured: false,
    order: 2,
  },
  {
    title: 'Business Continuity & Disaster Recovery (BCP/DRP)',
    slug: 'gestion-risques-pca-pra',
    poleSlug: 'consulting',
    category: 'Crisis Management',
    shortDescription: 'Disaster recovery strategies to preserve vital operational capabilities during outages or cyber incidents.',
    content: 'Business Impact Analysis (BIA), target recovery time and data loss thresholds (RTO/RPO), and tested emergency procedures.',
    technicalTags: [{ tag: 'Operational BCP' }, { tag: 'Crisis Scenarios' }, { tag: 'RTO / RPO Drills' }],
    featured: false,
    order: 3,
  },
  {
    title: 'Project Ownership Assistance (AMOA)',
    slug: 'assistance-maitrise-ouvrage-amoa',
    poleSlug: 'consulting',
    category: 'Project Steering',
    shortDescription: 'Impartial scoping of technical tenders, vendor selection, and rigorous deliverable validation.',
    content: 'Precision functional requirements documentation, objective vendor bid evaluation matrix, and independent technical arbitration.',
    technicalTags: [{ tag: 'Requirements Specs' }, { tag: 'Bid Evaluation' }, { tag: 'Acceptance Testing' }],
    featured: false,
    order: 4,
  },

  // ── SERVICES BOKENGI EVENTS (EN) ──
  {
    title: 'Multi-Camera Filming & HD Live Production',
    slug: 'captation-regie-streaming',
    poleSlug: 'events',
    category: 'Audiovisual Engineering',
    shortDescription: 'Broadcast-grade technical production for high-definition live streaming of conferences and summits.',
    content: 'Professional camera deployment, branded graphics overlay, anti-feedback acoustic tuning, and secure multi-destination streaming.',
    technicalTags: [{ tag: 'HD Streaming' }, { tag: 'Multi-Camera' }, { tag: 'Pro Audio' }, { tag: '4G/5G Failover' }],
    featured: false,
    order: 1,
  },
  {
    title: 'Hybrid Event Technical Coordination',
    slug: 'coordination-evenements-hybrides',
    poleSlug: 'events',
    category: 'Event Logistics',
    shortDescription: 'Comprehensive technical orchestration connecting in-person audiences with remote international speakers.',
    content: 'Stage return display management, online attendee Q&A moderation, simultaneous interpretation routing, and end-to-end technical oversight.',
    technicalTags: [{ tag: 'Hybrid Events' }, { tag: 'Audience Interactivity' }, { tag: 'Stage Management' }],
    featured: false,
    order: 2,
  },
  {
    title: 'Event Platforms & QR Code Ticketing',
    slug: 'plateformes-evenementielles-dediees',
    poleSlug: 'events',
    category: 'Digital Event Tools',
    shortDescription: 'Attendee registration portals, secure online ticketing, and instant on-site check-in via QR code scanning.',
    content: 'Dedicated event microsite creation, automated dynamic badge generation with unique QR codes, and real-time attendance dashboards.',
    technicalTags: [{ tag: 'QR Badges' }, { tag: 'Fast Check-In' }, { tag: 'Dedicated Ticketing' }],
    featured: false,
    order: 3,
  },
  {
    title: 'Media Content Production & Aftermovies',
    slug: 'production-contenus-medias',
    poleSlug: 'events',
    category: 'Post-Event Media',
    shortDescription: 'Professional photography, high-energy event recap videos (aftermovies), and social media highlight clips.',
    content: 'Same-day fast turnaround editing, executive interviews, and complete delivery of royalty-free high-definition media libraries.',
    technicalTags: [{ tag: '4K Aftermovie' }, { tag: 'Social Reels' }, { tag: 'HD Photography' }],
    featured: false,
    order: 4,
  },
]

export const CASE_STUDIES_SEED_DATA_EN: CaseStudyData[] = [
  {
    title: 'ESIIKA Platform — Congo-Brazzaville Marketplace',
    slug: 'esiika',
    clientName: 'ESIIKA Ecosystem · Central African E-Commerce',
    category: 'Bokengi Digital & IT · E-Commerce & Full-Stack',
    summary:
      'Design and deployment of a resilient fashion and electronics marketplace featuring Mobile Money payments, dynamic inventory, and Brazzaville delivery logistics.',
    context:
      'The ESIIKA initiative addressed the surging demand for structured e-commerce in the Republic of the Congo. The legacy architecture was constrained by a monolithic frontend and a PHP backend exposed to brute-force vectors and lacking order processing reliability.',
    challenge:
      'It was crucial to deliver a fluid, hardened platform capable of flawless financial transactions, withstanding frequent network drops, and scaling to thousands of product SKUs with dynamic inventory variations.',
    solution:
      'Bokengi rebuilt the system using a decoupled architecture: an ultra-responsive React/TypeScript mobile-optimized frontend backed by a secured REST API with rate-limiting, bcrypt hashing, CSRF protection, and strict input validation. Docker containerization behind Nginx with automated SSL and Mobile Money gateways (Airtel Money and MTN).',
    results:
      'The marketplace is live on esiika.com. The customer journey is completely digitized: dynamic catalog, persistent shopping cart, secure Mobile Money checkout, and a full merchant back-office.',
    resultsList: [
      'Platform live in active production on esiika.com',
      'Full transaction flow: authentication, cart, Mobile Money & Visa checkout',
      'Hardened backend: CSRF protection, rate limiting, and zero secrets in Git',
      'Page load time slashed by over 55% compared to the legacy version',
    ],
    technologies: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Node.js' },
      { name: 'PostgreSQL' },
      { name: 'Docker' },
      { name: 'Nginx' },
      { name: 'Airtel Money API' },
    ],
    architecture:
      'Decoupled micro-service architecture running under Docker Compose. Nginx reverse-proxy terminating SSL and managing static asset caching. PostgreSQL relational database with optimized indexing for product discovery. Secure webhook pipeline for payment confirmations.',
    featured: true,
    publishedDate: '2026-06-15',
    seo: {
      title: 'ESIIKA Case Study · Congo-Brazzaville Marketplace — Bokengi Group',
      description: 'Explore how Bokengi Group engineered and secured the ESIIKA marketplace with Mobile Money integration and Docker infrastructure.',
    },
  },
  {
    title: 'Kongama Portal — Administration & Operations Management System',
    slug: 'portail-kongama',
    clientName: 'Kongama Group · Operations Directorate',
    category: 'Bokengi Digital & Business · Information Systems & Operations',
    summary:
      'Digitization of administrative document workflows, automated approvals, and centralized internal operations for the Kongama ecosystem.',
    context:
      'Kongama Group previously handled budget authorizations, shipping manifests, and document archiving through manual paperwork and fragmented spreadsheets, resulting in substantial delays and accounting attribution risks.',
    challenge:
      'Build a unified, hardened portal with Role-Based Access Control (RBAC), enabling dozens of officers to collaborate without bottlenecks while maintaining an immutable signature audit trail.',
    solution:
      'Bokengi engineered a responsive administration portal using TypeScript and Next.js, integrated with an Express/Node.js automation backend and PostgreSQL database. A Redis cache cluster was deployed to accelerate heavy dashboards and manage concurrent sessions.',
    results:
      'The Kongama Portal reduced document review turnaround from several days to mere hours, backed by a tamper-proof audit log.',
    resultsList: [
      '65% measured reduction in administrative document processing time',
      '100% auditable logging across all workflow actions and approvals',
      'Granular permission management tailored to organizational roles (executive, accounting, logistics)',
      '100% staff adoption within the first month of production rollout',
    ],
    technologies: [
      { name: 'TypeScript' },
      { name: 'Next.js' },
      { name: 'Node.js / Express' },
      { name: 'PostgreSQL' },
      { name: 'Redis' },
      { name: 'Tailwind CSS' },
    ],
    architecture:
      'Layered architecture with end-to-end typed TypeScript REST APIs. Session security based on encrypted Redis in-memory storage. Normalized PostgreSQL schema guaranteeing document and approval referential integrity.',
    featured: true,
    publishedDate: '2025-11-20',
    seo: {
      title: 'Kongama Portal Case Study · Operational Digitization — Bokengi Group',
      description: 'Discover how the Kongama Portal streamlined internal document workflows using TypeScript, Redis, and PostgreSQL.',
    },
  },
  {
    title: 'Kongama Academy — Digital Education & E-Learning Platform',
    slug: 'kongama-academy',
    clientName: 'Kongama Academy · Digital Education',
    category: 'Bokengi Digital & IT · EdTech & Professional Training',
    summary:
      'Digital learning ecosystem connecting instructors and students, designed with an offline-first mobile PWA architecture optimized for Africa.',
    context:
      'Kongama Academy aimed to provide world-class engineering and digital technology education to students frequently facing unstable mobile internet connections and limited data packages.',
    challenge:
      'Deliver an engaging, high-speed educational interface capable of functioning smoothly in offline mode without compromising on interactive course material.',
    solution:
      'Bokengi designed a leading-edge Progressive Web App (PWA) using React and TypeScript (Vite/Next.js), leveraging accessible components from Tailwind and shadcn/ui. Textual lessons and exercises are cached locally via Service Workers and silently synced upon reconnection.',
    results:
      'The platform is live on kongama.com. It delivers an outstanding learning experience with instant navigation and student retention rates well above standard e-learning platforms.',
    resultsList: [
      'Active online educational platform deployed on kongama.com',
      'Complete PWA architecture with home-screen installation and offline mode',
      'Initial load time under 1.2 seconds over 3G/4G cellular connections',
      'Automated student progress tracking and verifiable certificate issuance',
    ],
    technologies: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
      { name: 'Vite / Next.js' },
      { name: 'shadcn/ui' },
      { name: 'PWA / Service Workers' },
    ],
    architecture:
      'Modern PWA frontend featuring granular asset and data caching via the Cache API and IndexedDB. Learning module code-splitting. Decoupled API maintaining lightweight JSON payloads.',
    featured: true,
    publishedDate: '2026-01-10',
    seo: {
      title: 'Kongama Academy Case Study · E-Learning PWA — Bokengi Group',
      description: 'Engineering the Kongama Academy ecosystem: mobile-first digital education, offline-capable PWA, and seamless learning UX.',
    },
  },
  {
    title: 'BisoMapTech — Congo Tech Mapping & Secure Network',
    slug: 'bisomaptech',
    clientName: 'Open Source Initiative · Congo IT Community',
    category: 'Bokengi IT & Cybersecurity · GIS & End-to-End Encryption',
    summary:
      'Interactive open-source platform mapping and connecting IT professionals across the Republic of the Congo with end-to-end encrypted messaging.',
    context:
      'The Congolese tech ecosystem lacked unified visibility, with developers, system administrators, and cybersecurity specialists operating in silos without a sovereign, secure communications channel.',
    challenge:
      'Accurately map tech talent and tech hubs nationwide while providing a direct communication channel impervious to interception or surveillance.',
    solution:
      'Bokengi developed an interactive geolocated map using Leaflet with automated GitHub profile synchronization. An in-browser end-to-end encrypted (E2E) messaging protocol was implemented via the Web Cryptography API (asymmetric ECDH P-256 key exchange with symmetric AES-GCM 256-bit encryption).',
    results:
      'BisoMapTech references hundreds of tech profiles across Brazzaville, Pointe-Noire, and the diaspora, establishing itself as the open-source benchmark for Congolese tech.',
    resultsList: [
      'Interactive GIS mapping with multi-criteria filtering and geolocation',
      'Zero-knowledge end-to-end encrypted messaging (ECDH P-256 + AES-GCM)',
      'Secure authentication, community moderation console, and dark/light themes',
      'Fully auditable source code released under an open-source license for the community',
    ],
    technologies: [
      { name: 'React' },
      { name: 'TypeScript' },
      { name: 'Supabase / PostgreSQL' },
      { name: 'Leaflet GIS' },
      { name: 'Web Crypto API' },
      { name: 'Zustand' },
    ],
    architecture:
      'Zero-knowledge client-side architecture: private keys never leave the user browser. Distributed Supabase/PostgreSQL database with Row-Level Security (RLS) enforcement. Vector tile rendering optimized for low-bandwidth networks.',
    featured: true,
    publishedDate: '2025-09-05',
    seo: {
      title: 'BisoMapTech Case Study · Congo Tech Ecosystem Mapping — Bokengi Group',
      description: 'Discover BisoMapTech: open-source interactive mapping and E2E encrypted messaging for Congolese tech talent.',
    },
  },
  {
    title: 'FleetGuard — Maritime Safety Equipment Telemetry & Fleet Monitoring',
    slug: 'fleetguard',
    clientName: 'Maritime Operator & Fleet Management',
    category: 'Bokengi IT & Infrastructure · IoT Monitoring & Asset Supervision',
    summary:
      'Embedded IoT and cloud monitoring system tracking real-time compliance of critical safety assets on board vessels with proactive expiration alerts.',
    context:
      'The tracking of maritime life-saving and fire safety equipment (extinguishers, life rafts, EPIRB distress beacons) was historically logged on paper, exposing vessel operators to severe regulatory penalties upon certificate expiration.',
    challenge:
      'Maintain continuous traceability for hundreds of safety items aboard vessels operating at sea, with reliable periodic synchronization to shore teams whenever satellite or port connectivity is available.',
    solution:
      'Bokengi engineered an IoT telemetry architecture uniting Python micro-services with an MQTT message broker on Linux Server. An interactive dashboard built with Chart.js and Grafana enables shipmasters and fleet managers to instantly assess equipment status by color code and generate certified compliance reports.',
    results:
      'FleetGuard achieves 100% compliance across international maritime audits, eliminating costly vessel detentions caused by expired safety gear.',
    resultsList: [
      'Multi-device secure telemetry and data synchronization architecture',
      'Automated predictive alert engine with color-coded risk assessment (green, orange, red)',
      'Instant regulatory compliance report generation meeting international maritime codes',
      'Total operational resilience: standalone operation at sea with automated dockside sync',
    ],
    technologies: [
      { name: 'Python' },
      { name: 'MQTT Broker' },
      { name: 'Linux Server' },
      { name: 'Upstash Redis / PostgreSQL' },
      { name: 'Chart.js' },
      { name: 'Grafana' },
    ],
    architecture:
      'Resilient IoT edge architecture: on-board local gateway communicating over lightweight MQTT. Local data buffering during satellite link dropouts. Idempotent cloud sync upon connection re-establishment. Decoupled analytics visualization.',
    featured: true,
    publishedDate: '2025-07-30',
    seo: {
      title: 'FleetGuard Case Study · Maritime Telemetry & IoT — Bokengi Group',
      description: 'Maritime safety equipment supervision with predictive alerts, IoT telemetry, and regulatory compliance by Bokengi IT.',
    },
  },
]

export const POSTS_SEED_DATA_EN: PostData[] = [
  {
    title: 'The Imperatives of Digital Sovereignty and Resilient Cloud Infrastructure in Central Africa',
    slug: 'souverainete-numerique-afrique',
    category: 'Infrastructure & Cloud',
    categories: ['Infrastructure & Cloud', 'IT Sovereignty'],
    tags: ['Datacenter', 'Sovereignty', 'Private Cloud', 'Resilience'],
    publishedAt: '2026-03-01T08:00:00.000Z',
    readingTime: 5,
    status: 'published',
    author: {
      name: 'Kalel Damba',
      role: 'Technical Systems Directorate',
    },
    coverImage: {
      url: '/og-image.png',
      alt: 'Digital sovereignty and resilient cloud infrastructure in Central Africa',
    },
    excerpt:
      'Facing interconnection challenges, latency bottlenecks, and sensitive data exposure, localizing IT infrastructure and adopting sovereign cloud architectures have become the cornerstone of economic resilience for Central African organizations.',
    content: `Africa's digital transformation has reached a pivotal strategic juncture. Having long relied on infrastructure hosted in Western Europe or North America, regional enterprises and public institutions are confronting the tangible limits of offshore dependency: latency spikes during submarine cable cuts, cross-border compliance hurdles under data privacy regulations, and exposure to international geopolitical volatility.

1. The True Cost of Remote Infrastructure Reliance
Every IP packet that traverses undersea cables to be processed by an offshore server before returning to a local workstation introduces both bandwidth costs and operational vulnerabilities. When the WACS or SAT-3 cables experience accidental cuts, entire segments of banking, logistics, and governmental operations grind to a halt.

2. Pillars of a Resilient Sovereign Hybrid Cloud
At Bokengi Group, our engineering teams champion a pragmatic architecture:
- High-availability local compute nodes (Tier III datacenters within national boundaries).
- Resilient Edge gateways capable of running in an offline-first degraded mode.
- Asynchronous encrypted replication across geographically distributed secondary datacenters for Disaster Recovery (DRP).

3. Towards Sustainable Technological Autonomy
Achieving digital sovereignty does not mean disconnecting from global standards; it means mastering every tier of the stack: from hardened Linux operating systems to cryptographic key governance and training local engineering talent to operate and evolve the systems.`,
    seo: {
      title: 'Digital Sovereignty & Resilient Hosting in Africa · Bokengi Group',
      description:
        'Strategic analysis of digital sovereignty, local infrastructure, and cloud resilience in Central Africa.',
    },
  },
  {
    title: 'Security by Design: Integrating Cryptography and Continuous Auditing from Scoping',
    slug: 'security-by-design-systemes-critiques',
    category: 'Cybersecurity',
    categories: ['Cybersecurity', 'Software Architecture'],
    tags: ['Pentest', 'Cryptography', 'Hardening', 'Security by Design'],
    publishedAt: '2026-02-14T09:30:00.000Z',
    readingTime: 6,
    status: 'published',
    author: {
      name: 'Bokengi IT Cybersecurity Team',
      role: 'Audit & Defensive Engineering',
    },
    coverImage: {
      url: '/og-image.png',
      alt: 'Security by design and applied cryptography',
    },
    excerpt:
      'Why treating security as an afterthought in production invites disaster. Methodological insights into designing hardened, resilient architectures that withstand threats from day one.',
    content: `In the modern threat landscape, attempting to bolt security onto a software product right before deployment is both ineffective and prohibitively expensive. True cyber resilience must be woven into the very fabric of architecture from the earliest scoping discussions.

1. Threat Modeling at the Inception Stage
Before a single line of application code is written, our security engineers map attack surfaces:
- Identifying critical data assets, operational flows, and ingress points.
- Applying STRIDE threat modeling to anticipate unauthorized privilege escalations and data tampering.
- Enforcing defense-in-depth where every component assumes adjacent services may be compromised.

2. Applied Cryptography Without Compromise
Security relies on mathematics, not obscurity:
- High-grade end-to-end encryption using vetted algorithms (AES-256-GCM, ECDH P-256).
- Zero-knowledge key management where passwords and sensitive secrets are never stored in plaintext.
- Strict hardware-bound cryptographic security where possible.

3. Continuous Verification as Standard Operating Procedure
Security is not a static milestone, but an ongoing discipline:
- Static Application Security Testing (SAST) and automated secret detection integrated into every Pull Request.
- Routine vulnerability scanning across direct and transitive dependency trees.
- Systematic peer reviews with least-privilege principles enforced at every layer.`,
    seo: {
      title: 'Security by Design & Applied Cryptography · Bokengi Group',
      description:
        'Methodology for engineering resilient, secure architectures audited from inception.',
    },
  },
  {
    title: 'Information Systems Modernization: Decoupling, APIs, and Operational Performance',
    slug: 'modernisation-systemes-information-apis',
    category: 'Digital Transformation',
    categories: ['Digital Transformation', 'Software Architecture'],
    tags: ['Microservices', 'APIs', 'IS Modernization', 'Cloudflare Workers'],
    publishedAt: '2026-01-20T10:00:00.000Z',
    readingTime: 4,
    status: 'published',
    author: {
      name: 'Digital Engineering Directorate',
      role: 'Web Solutions & Products',
    },
    coverImage: {
      url: '/og-image.png',
      alt: 'Information systems modernization and API architecture',
    },
    excerpt:
      'How to migrate heterogeneous legacy software fleets toward modular architectures without service disruption. An analysis of gains unlocked by headless decoupling, secure APIs, and Edge computing.',
    content: `Many organizations operate established software assets trapped within rigid monolithic architectures. Adding a new business feature or rolling out a digital channel often demands weeks of regression testing with substantial operational risk.

1. The Strangler Fig Pattern: Modernize Without Disruption
Rather than risking an expensive big-bang rewrite, Bokengi applies the Strangler Fig pattern:
- Introducing a modern API gateway upstream of the legacy monolith.
- Progressively carving out isolated business domains as decoupled services.
- Seamlessly routing user traffic to modern endpoints without downtime.

2. The Power of Headless Architecture and Edge Computing
By strictly separating business logic (Headless CMS, distributed databases) from presentation layers (Next.js App Router, Cloudflare Workers), rendering performance multiplies while infrastructure costs decrease:
- Sub-100ms response times powered by global Edge routing.
- Product teams iterate freely on user interfaces without altering backend transactional core systems.
- Heightened operational resilience: cached fallbacks and ISR ensure high availability even when upstream services fluctuate.`,
    seo: {
      title: 'Information Systems Modernization & API Architecture · Bokengi Group',
      description:
        'Transition strategies towards modular, high-performance, and interoperable software architectures.',
    },
  },
  {
    title: 'Internal Research Note on Mesh Networks (Unpublished Draft)',
    slug: 'brouillon-interne-non-publie',
    category: 'R&D',
    categories: ['R&D', 'Networks'],
    tags: ['Mesh', 'IoT'],
    publishedAt: '2026-03-05T12:00:00.000Z',
    readingTime: 3,
    status: 'draft',
    author: {
      name: 'Bokengi R&D Lab',
      role: 'Applied Research',
    },
    excerpt: 'Preliminary internal scoping document reserved for internal teams.',
    content: 'Work in progress draft. Must not be exposed on the public frontend.',
    seo: {
      title: 'R&D Draft · Bokengi Group',
      description: 'Internal non-public document.',
    },
  },
]

// ============================================================================
// BILINGUAL ACCESS HELPERS
// ============================================================================

export function getPolesSeedData(locale: string = 'fr'): PoleData[] {
  return locale === 'en' ? POLES_SEED_DATA_EN : POLES_SEED_DATA
}

export function getServicesSeedData(locale: string = 'fr'): ServiceData[] {
  return locale === 'en' ? SERVICES_SEED_DATA_EN : SERVICES_SEED_DATA
}

export function getCaseStudiesSeedData(locale: string = 'fr'): CaseStudyData[] {
  return locale === 'en' ? CASE_STUDIES_SEED_DATA_EN : CASE_STUDIES_SEED_DATA
}

export function getPostsSeedData(locale: string = 'fr'): PostData[] {
  return locale === 'en' ? POSTS_SEED_DATA_EN : POSTS_SEED_DATA
}

