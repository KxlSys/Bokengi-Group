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

      <section className="expertises-list-section" style={{ padding: '6.5rem 0' }}>
        <div className="container-v2">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {poles.map((pole) => (
              <article key={pole.id} className="project-flagship-card" id={pole.id} style={{ padding: '3.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                  <span className="why-v2-idx" style={{ marginBottom: 0 }}>{pole.number}</span>
                  <span className="project-flagship-badge">{pole.tag}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
                  <div>
                    <h2 className="title-section" style={{ marginBottom: '1rem' }}>{pole.name}</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>{pole.desc}</p>
                    <Link to={pole.to} className="btn-v2-primary">
                      {pole.cta} →
                    </Link>
                  </div>

                  <div style={{ background: 'var(--bg-elevated)', padding: '2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue-accent)', marginBottom: '1.25rem' }}>
                      Domaines d'intervention :
                    </h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {pole.domains.map((domain, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.65rem', fontSize: '0.95rem', color: 'var(--ink-body)' }}>
                          <span style={{ color: 'var(--blue-accent)', fontWeight: 700 }}>→</span> {domain}
                        </li>
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
