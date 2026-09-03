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
  seo: {
    title: string
    description: string
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
    publishedDate: '2025-06-15',
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
