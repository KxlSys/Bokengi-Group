import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';

const Expertises = () => {
  const poles = [
    {
      id: 'it',
      number: '01',
      tag: 'Technologie & Sécurité',
      name: 'Bokengi IT',
      to: '/expertises/it',
      desc: 'Le pôle technologique principal : concevoir, administrer, sécuriser et maintenir des architectures et parcs informatiques robustes.',
      domains: [
        'Cybersécurité & audits de vulnérabilités',
        'Systèmes & réseaux (Linux, Windows Server, VLAN, VPN)',
        'Développement d\'applications & API sécurisées',
        'Maintenance préventive, corrective & support utilisateur',
      ],
      cta: 'Découvrir Bokengi IT',
    },
    {
      id: 'digital',
      number: '02',
      tag: 'Solutions Web',
      name: 'Bokengi Digital',
      to: '/expertises/digital',
      desc: 'Des solutions numériques modernes et performantes pour consolider votre visibilité en ligne et automatiser vos processus métier.',
      domains: [
        'Création de sites web vitrines & e-commerce',
        'Design d\'interfaces UX/UI & identité digitale',
        'Automatisation de flux & intégration d\'outils',
        'SEO, hébergement & maintenance évolutive',
      ],
      cta: 'Découvrir Bokengi Digital',
    },
    {
      id: 'business',
      number: '03',
      tag: 'Services Opérationnels',
      name: 'Bokengi Business',
      to: '/expertises/business',
      desc: 'Un accompagnement structuré pour alléger votre gestion quotidienne et permettre à votre organisation de se focaliser sur sa croissance.',
      domains: [
        'Assistance administrative & secrétariat externalisé',
        'Gestion documentaire & classement sécurisé',
        'Organisation professionnelle & gestion de plannings',
        'Support opérationnel aux dirigeants & entrepreneurs',
      ],
      cta: 'Découvrir Bokengi Business',
    },
    {
      id: 'consulting',
      number: '04',
      tag: 'Conseil Stratégique',
      name: 'Bokengi Consulting',
      to: '/expertises/consulting',
      desc: 'Conseil indépendant et audits approfondis pour aligner vos choix technologiques avec vos ambitions organisationnelles.',
      domains: [
        'Conseil en stratégie IT & schéma directeur',
        'Audits d\'infrastructure & conformité sécurité',
        'Études de faisabilité & recommandations techniques',
        'Accompagnement à la transformation numérique des PME',
      ],
      cta: 'Découvrir Bokengi Consulting',
    },
    {
      id: 'events',
      number: '05',
      tag: 'Événementiel Professionnel',
      name: 'Bokengi Events',
      to: '/expertises/events',
      desc: 'Conception, coordination logistique et intégration technologique pour vos événements professionnels et corporate.',
      domains: [
        'Organisation de séminaires, conférences & cérémonies',
        'Coordination logistique & gestion des prestataires',
        'Solutions techniques (streaming, audiovisuel, régie)',
        'Communication événementielle & dispositifs digitaux',
      ],
      cta: 'Découvrir Bokengi Events',
    },
  ];

  return (
    <div className="page-expertises">
      <SEO 
        title="Nos expertises" 
        description="Découvrez les 5 pôles d'expertise de Bokengi Group : Bokengi IT, Bokengi Digital, Bokengi Business, Bokengi Consulting et Bokengi Events." 
      />

      <PageHeader
        eyebrow="Pôles d'Activité"
        title="Nos expertises"
        subtitle="Cinq pôles spécialisés et complémentaires pour répondre à vos besoins techniques, digitaux et organisationnels."
        breadcrumbs={[{ label: 'Expertises' }]}
      />

      <section className="expertises-list-section">
        <div className="container">
          <div className="expertises-blocks-list">
            {poles.map((pole) => (
              <article key={pole.id} className="expertise-block-card" id={pole.id}>
                <div className="expertise-block-header">
                  <span className="expertise-block-number">{pole.number}</span>
                  <span className="expertise-block-tag">{pole.tag}</span>
                </div>

                <div className="expertise-block-body">
                  <div className="expertise-block-info">
                    <h2 className="expertise-block-title">{pole.name}</h2>
                    <p className="expertise-block-desc">{pole.desc}</p>
                    <Link to={pole.to} className="btn-primary expertise-block-cta">
                      {pole.cta} →
                    </Link>
                  </div>

                  <div className="expertise-block-domains">
                    <h3 className="domains-heading">Principaux domaines d'intervention :</h3>
                    <ul className="domains-list">
                      {pole.domains.map((domain, i) => (
                        <li key={i}>{domain}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Expertises;
