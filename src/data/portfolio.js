export const portfolioProjects = [
  {
    id: 'cloud-migration-pme',
    category: 'Administration Systèmes',
    title: 'Migration cloud d\'une PME logistique',
    summary:
      'Sortie d\'un hébergement mutualisé obsolète vers une infra AWS containerisée, sans interruption de service.',
    challenge:
      'Déploiements manuels, temps d\'indisponibilité récurrents et absence de sauvegardes testées.',
    solution:
      'Architecture Docker sur ECS, pipeline CI/CD GitHub Actions, monitoring et procédure de rollback documentée.',
    results: [
      '99,9 % de disponibilité atteinte',
      '-60 % sur le temps de déploiement',
      'Sauvegardes automatisées quotidiennes',
    ],
    stack: ['AWS', 'Docker', 'GitHub Actions', 'Nginx'],
    year: '2025',
    client: 'PME logistique · 35 collaborateurs',
  },
  {
    id: 'security-audit-vpn',
    category: 'Cybersécurité',
    title: 'Audit sécurité & déploiement VPN',
    summary:
      'Durcissement de l\'infrastructure réseau et mise en place d\'un accès distant sécurisé pour une équipe hybride.',
    challenge:
      'Accès RDP exposés, mots de passe partagés et absence de segmentation réseau entre services critiques.',
    solution:
      'Audit complet, durcissement des serveurs Linux, VPN WireGuard avec MFA et politique de moindre privilège.',
    results: [
      '12 failles critiques corrigées',
      'Accès distant chiffré pour 20 utilisateurs',
      'Rapport d\'audit livré en 5 jours',
    ],
    stack: ['WireGuard', 'Linux', 'Nginx', 'Fail2ban'],
    year: '2025',
    client: 'Cabinet comptable · remote-first',
  },
  {
    id: 'fullstack-saas',
    category: 'Full-Stack',
    title: 'Application web de gestion métier',
    summary:
      'Conception et développement d\'un outil sur mesure remplaçant des tableurs Excel éclatés entre 4 services.',
    challenge:
      'Processus manuels chronophages, données incohérentes et aucune visibilité temps réel pour la direction.',
    solution:
      'SPA React + API Node.js, authentification JWT, tableau de bord temps réel et exports automatisés.',
    results: [
      '-4 h/semaine de saisie manuelle',
      'Données centralisées en temps réel',
      'Livraison en 6 semaines',
    ],
    stack: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    year: '2024',
    client: 'Startup B2B · 12 collaborateurs',
  },
  {
    id: 'cicd-automation',
    category: 'DevOps',
    title: 'Automatisation CI/CD & conteneurisation',
    summary:
      'Industrialisation des déploiements d\'une application legacy avec tests automatisés et environnements reproductibles.',
    challenge:
      'Releases mensuelles stressantes, environnements dev/prod divergents et rollbacks impossibles.',
    solution:
      'Conteneurisation Docker, pipeline CI/CD avec tests E2E, staging automatique et déploiement blue-green.',
    results: [
      'Déploiements hebdomadaires sans stress',
      'Rollbacks en moins de 2 minutes',
      '3 environnements iso-prod',
    ],
    stack: ['Docker', 'Kubernetes', 'GitLab CI', 'Jest'],
    year: '2024',
    client: 'ESN · équipe de 8 développeurs',
  },
];