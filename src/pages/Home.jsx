import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Home = () => {
  const poles = [
    {
      num: '01',
      title: 'BOKENGI IT',
      domains: 'Technologie · Infrastructure · Cybersécurité',
      to: '/expertises/it',
    },
    {
      num: '02',
      title: 'BOKENGI DIGITAL',
      domains: 'Web · Produits numériques · Transformation',
      to: '/expertises/digital',
    },
    {
      num: '03',
      title: 'BOKENGI BUSINESS',
      domains: 'Administration · Organisation · Support',
      to: '/expertises/business',
    },
    {
      num: '04',
      title: 'BOKENGI CONSULTING',
      domains: 'Conseil · Audit · Accompagnement',
      to: '/expertises/consulting',
    },
    {
      num: '05',
      title: 'BOKENGI EVENTS',
      domains: 'Événementiel · Coordination · Solutions techniques',
      to: '/expertises/events',
    },
  ];

  const itServices = [
    {
      title: 'Cybersécurité & Résilience',
      desc: 'Protection périmétrique, audit des vulnérabilités, sauvegardes immuables et gouvernance des accès.',
    },
    {
      title: 'Systèmes & Réseaux',
      desc: 'Architecture réseau local et distant, serveurs haute disponibilité, VPN sécurisés et infogérance.',
    },
    {
      title: 'Ingénierie & Développement',
      desc: 'Conception de logiciels métier, API robustes, architecture de bases de données et intégrations pérennes.',
    },
    {
      title: 'Maintenance & Support IT',
      desc: 'Contrats de maintenance proactive, assistance technique réactive et supervision continue de vos parcs.',
    },
  ];

  const realisations = [
    {
      tag: 'Bokengi Digital & IT',
      name: 'Plateforme Esiika',
      context: 'Pôle Échange & Services Collaboratifs',
      summary: 'Conception et déploiement d\'une plateforme web moderne à haute disponibilité avec authentification sécurisée et architecture découplée.',
      techs: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Nginx'],
    },
    {
      tag: 'Bokengi Digital & Business',
      name: 'Portail Kongama',
      context: 'Système de Gestion Opérationnelle',
      summary: 'Digitalisation des flux documentaires et automatisation des processus administratifs internes.',
      techs: ['TypeScript', 'Express', 'Redis', 'TailwindCSS'],
    },
    {
      tag: 'Bokengi IT & Infrastructure',
      name: 'Supervision FleetGuard',
      context: 'Monitoring & Continuité Système',
      summary: 'Infrastructure de télémétrie et monitoring d\'actifs avec alertes en temps réel et résilience réseau.',
      techs: ['Linux Server', 'Python', 'MQTT', 'Grafana'],
    },
  ];

  return (
    <div className="page-home-v4">
      <SEO 
        title="Bokengi Group — Technology & Services" 
        description="Bokengi Group accompagne les organisations dans leurs projets technologiques, numériques et professionnels : IT, cybersécurité, développement, infrastructure, conseil, assistance et événementiel." 
      />

      {/* ── 01 HERO V4 (ÉDITORIAL ASYMÉTRIQUE SANS CARTES) ── */}
      <section className="hero-v4">
        <div className="container-v4">
          <div className="hero-v4-grid">
            
            {/* Left Column: Typographic Focus */}
            <div className="hero-v4-left">
              <span className="kicker-v4">BOKENGI GROUP</span>
              
              <h1 className="hero-v4-title">
                <span className="hero-title-white">Construire.</span>
                <span className="hero-title-blue">Protéger.</span>
                <span className="hero-title-white">Développer.</span>
              </h1>

              <p className="hero-v4-lead">
                Technologie, sécurité et services pour faire avancer les organisations.
              </p>

              <p className="hero-v4-sub">
                Bokengi Group conçoit, sécurise et accompagne les infrastructures, les solutions numériques et les projets professionnels.
              </p>

              <div className="hero-v4-actions">
                <Link to="/contact?type=devis" className="btn-v4-primary">
                  Parler de votre projet →
                </Link>
                <Link to="/expertises" className="btn-v4-secondary">
                  Découvrir nos expertises
                </Link>
              </div>
            </div>

            {/* Right Column: Master Brand Symbol & Technical Lines */}
            <div className="hero-v4-brand-art">
              <svg className="hero-art-lines" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="250" cy="250" r="210" stroke="var(--blue-cyan)" strokeWidth="1" strokeDasharray="4 8" opacity="0.25" />
                <circle cx="250" cy="250" r="140" stroke="var(--blue-accent)" strokeWidth="1" opacity="0.15" />
                <line x1="250" y1="20" x2="250" y2="480" stroke="var(--border-medium)" strokeWidth="1" opacity="0.3" />
                <line x1="20" y1="250" x2="480" y2="250" stroke="var(--border-medium)" strokeWidth="1" opacity="0.3" />
                
                {/* Subtle Coordinate Crosses */}
                <path d="M40 40H60M50 30V50" stroke="var(--blue-cyan)" strokeWidth="1" opacity="0.4"/>
                <path d="M440 440H460M450 430V450" stroke="var(--blue-cyan)" strokeWidth="1" opacity="0.4"/>
                
                {/* Technical Micro Typography */}
                <text x="260" y="45" fill="var(--ink-faint)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.15em">LAT // 04.250</text>
                <text x="260" y="470" fill="var(--ink-faint)" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.15em">CORE // INFRA</text>
              </svg>

              <img 
                src="/bokengi-mark.png" 
                alt="Emblème Bokengi Group" 
                className="hero-brand-symbol"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── 02 SECTION LE GROUPE V4 (ÉDITORIALE) ── */}
      <section className="section-groupe-v4">
        <div className="container-v4">
          <div className="groupe-v4-grid">
            <div>
              <span className="kicker-v4">LE GROUPE</span>
              <h2 className="groupe-v4-title">Une même vision. Plusieurs expertises.</h2>
              <p className="groupe-v4-text">
                Bokengi Group rassemble des compétences technologiques, numériques et professionnelles au sein d'une même structure, afin d'accompagner les organisations dans leurs projets.
              </p>
              <p className="groupe-v4-text">
                Fondé sur l'exigence technique et la rigueur méthodologique, notre modèle intègre la cybersécurité, l'ingénierie logicielle et le support opérationnel pour apporter des solutions fiables et durables.
              </p>
            </div>

            <div className="groupe-v4-right-art">
              <div className="groupe-art-word">TECHNOLOGY</div>
              <div className="groupe-art-plus">+</div>
              <div className="groupe-art-word accent">SERVICES</div>
              <div className="groupe-art-plus">+</div>
              <div className="groupe-art-word">EXPERTISE</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 SECTION NOS EXPERTISES V4 (LISTE ÉDITORIALE PLEINE LARGEUR) ── */}
      <section className="section-expertises-v4">
        <div className="container-v4">
          <div className="expertises-v4-header">
            <span className="kicker-v4">NOS EXPERTISES</span>
            <h2 className="expertises-v4-title">Des compétences complémentaires. Une même exigence.</h2>
          </div>

          <div className="expertises-v4-list">
            {poles.map((pole) => (
              <Link key={pole.num} to={pole.to} className="expertises-v4-row">
                <span className="row-v4-num">{pole.num}</span>
                <strong className="row-v4-name">{pole.title}</strong>
                <span className="row-v4-domains">{pole.domains}</span>
                <span className="row-v4-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 FOCUS BOKENGI IT V4 (CŒUR TECHNOLOGIQUE INSTITUTIONNEL) ── */}
      <section className="section-it-v4">
        <div className="pattern-dotted-radial-right" aria-hidden="true" />
        <div className="container-v4">
          <div className="it-v4-grid">
            <div className="it-v4-left">
              <span className="kicker-v4">PÔLE TECHNOLOGIQUE PRINCIPAL</span>
              <h2 className="it-v4-title">BOKENGI IT</h2>
              <p className="it-v4-sub">
                Infrastructures, cybersécurité et systèmes au service de la continuité de vos activités.
              </p>
              <Link to="/expertises/it" className="btn-v4-primary" style={{ background: '#0055D4', borderColor: '#0055D4' }}>
                Découvrir Bokengi IT →
              </Link>
            </div>

            <div className="it-v4-services-grid">
              {itServices.map((srv, idx) => (
                <div key={idx} className="it-v4-service-item">
                  <h3 className="it-service-title">{srv.title}</h3>
                  <p className="it-service-desc">{srv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 RÉALISATIONS V4 (PORTFOLIO CRÉDIBLE & VÉRIFIÉ) ── */}
      <section className="section-projects-v4">
        <div className="container-v4">
          <div className="projects-v4-header">
            <div>
              <span className="kicker-v4">RÉALISATIONS & ÉTUDES DE CAS</span>
              <h2 className="projects-v4-title">Des architectures déployées avec rigueur.</h2>
            </div>
            <Link to="/realisations" className="btn-v4-secondary">
              Voir tous les projets →
            </Link>
          </div>

          <div className="projects-v4-grid">
            {realisations.map((p, idx) => (
              <div key={idx} className="project-v4-item">
                <div className="project-v4-top">
                  <span className="project-v4-tag">{p.tag}</span>
                </div>
                <h3 className="project-v4-name">{p.name}</h3>
                <p className="project-v4-context"><strong>Contexte :</strong> {p.context}</p>
                <p className="project-v4-summary">{p.summary}</p>
                <div className="project-v4-techs">
                  {p.techs.map((t) => (
                    <span key={t} className="project-tech-pill">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 CTA FINAL V4 ── */}
      <section className="section-cta-v4">
        <div className="container-v4">
          <div className="cta-v4-box">
            <div className="pattern-dotted-radial-right" aria-hidden="true" />
            <span className="kicker-v4" style={{ justifyContent: 'center' }}>BOKENGI GROUP · ENGAGEMENT PROFESSIONNEL</span>
            <h2 className="cta-v4-title">Construisons une infrastructure solide pour votre organisation.</h2>
            <p className="cta-v4-lead">
              Discutons de vos besoins technologiques, digitaux ou opérationnels afin de structurer une solution sur mesure.
            </p>
            <div className="cta-v4-actions">
              <Link to="/contact?type=devis" className="btn-v4-primary">
                Demander un devis →
              </Link>
              <Link to="/contact" className="btn-v4-secondary">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
