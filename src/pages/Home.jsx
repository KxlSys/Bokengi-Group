import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import CTASection from '../components/CTASection';
import { portfolioProjects } from '../data/portfolio';

const Home = () => {
  const featuredProjects = portfolioProjects.slice(0, 4);

  const expertises = [
    {
      name: 'BOKENGI IT',
      summary: 'Technologie, infrastructure et cybersécurité.',
      to: '/expertises/it',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      )
    },
    {
      name: 'BOKENGI DIGITAL',
      summary: 'Solutions web et transformation numérique.',
      to: '/expertises/digital',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      )
    },
    {
      name: 'BOKENGI BUSINESS',
      summary: 'Assistance administrative et accompagnement professionnel.',
      to: '/expertises/business',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      )
    },
    {
      name: 'BOKENGI CONSULTING',
      summary: 'Conseil, audit et accompagnement stratégique.',
      to: '/expertises/consulting',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      )
    },
    {
      name: 'BOKENGI EVENTS',
      summary: 'Organisation et solutions pour événements.',
      to: '/expertises/events',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      )
    }
  ];

  return (
    <div className="page-home">
      <SEO 
        title="Accueil" 
        description="Bokengi Group accompagne les entreprises, organisations et entrepreneurs dans leurs projets technologiques, numériques et professionnels." 
      />

      {/* ── SECTION 01 — HERO ── */}
      <section className="home-hero">
        <div className="home-hero-container">
          <div className="home-hero-content">
            <span className="home-hero-eyebrow">BOKENGI GROUP</span>
            <h1 className="home-hero-title">
              Construire. <em>Protéger.</em> Développer.
            </h1>
            <p className="home-hero-text">
              Bokengi Group accompagne les entreprises, organisations et entrepreneurs dans leurs projets technologiques, numériques et professionnels.
            </p>
            <div className="home-hero-actions">
              <Link to="/expertises" className="btn-primary">
                Découvrir nos expertises
              </Link>
              <Link to="/contact?type=devis" className="btn-ghost">
                Demander un devis
              </Link>
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="home-hero-card">
              <div className="home-hero-card-header">
                <img src="/bokengi-mark.svg" alt="" className="home-hero-badge-img" aria-hidden="true" />
                <div>
                  <span className="home-hero-card-brand">BOKENGI GROUP</span>
                  <strong>Structure d'ingénierie & services</strong>
                </div>
              </div>
              <p className="home-hero-card-desc">
                Des pôles d'expertise complémentaires réunis sous une gouvernance unifiée pour délivrer des solutions sécurisées, pérennes et à fort impact.
              </p>
              <div className="home-hero-pillars-preview">
                <span>IT & Infra</span>
                <span>Digital</span>
                <span>Business</span>
                <span>Consulting</span>
                <span>Events</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 02 — INTRODUCTION ── */}
      <section className="home-intro-section">
        <div className="container-narrow">
          <div className="section-heading-center">
            <span className="section-kicker">Positionnement</span>
            <h2 className="section-title">Un groupe. Plusieurs expertises.</h2>
            <p className="section-lead">
              Bokengi Group réunit plusieurs expertises complémentaires pour accompagner ses clients dans leurs enjeux technologiques, numériques, organisationnels et événementiels.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 03 — EXPERTISES (5 CARTES) ── */}
      <section className="home-expertises-section">
        <div className="container">
          <div className="expertises-cards-grid">
            {expertises.map((exp, idx) => (
              <div key={idx} className="expertise-card">
                <div className="expertise-card-icon">{exp.icon}</div>
                <h3 className="expertise-card-title">{exp.name}</h3>
                <p className="expertise-card-summary">{exp.summary}</p>
                <Link to={exp.to} className="expertise-card-link">
                  Découvrir {exp.name.split(' ')[0]} {exp.name.split(' ')[1]} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 04 — BOKENGI IT FOCUS ── */}
      <section className="home-it-section">
        <div className="container">
          <div className="home-it-box">
            <div className="home-it-left">
              <span className="it-kicker">Pôle Technologique Principal</span>
              <h2 className="it-title">Bokengi IT</h2>
              <p className="it-subtitle">Technologie. Infrastructure. Sécurité.</p>
              <p className="it-text">
                Nous concevons, déployons et maintenons des solutions informatiques adaptées aux besoins des organisations.
              </p>
              <Link to="/expertises/it" className="btn-primary it-cta">
                Découvrir Bokengi IT
              </Link>
            </div>
            <div className="home-it-right">
              <ul className="it-categories-list">
                <li>
                  <strong>Cybersécurité</strong>
                  <span>Audits, protection des postes, gestion des accès et continuité.</span>
                </li>
                <li>
                  <strong>Systèmes & réseaux</strong>
                  <span>Architectures serveurs, VPN, segmentation VLAN et supervision.</span>
                </li>
                <li>
                  <strong>Développement</strong>
                  <span>Applications web sécurisées, API et automatisation des flux.</span>
                </li>
                <li>
                  <strong>Cloud & infrastructure</strong>
                  <span>Déploiements hybrides, virtualisation et sauvegardes résilientes.</span>
                </li>
                <li>
                  <strong>Maintenance & support</strong>
                  <span>Maintien en conditions opérationnelles et assistance technique.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 05 — RÉALISATIONS ── */}
      <section className="home-projects-section">
        <div className="container">
          <div className="section-heading-flex">
            <div>
              <span className="section-kicker">Portfolio & Cas concrets</span>
              <h2 className="section-title">Nos réalisations</h2>
            </div>
            <Link to="/realisations" className="btn-ghost">
              Voir toutes nos réalisations
            </Link>
          </div>

          <div className="projects-grid-home">
            {featuredProjects.map((p) => (
              <article key={p.id} className="project-card-home">
                <div className="project-card-top">
                  <span className="project-badge">{p.category}</span>
                  <span className="project-year">{p.year}</span>
                </div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-summary">{p.summary}</p>
                <div className="project-stack">
                  {p.stack.map((tech) => (
                    <span key={tech} className="tech-pill">{tech}</span>
                  ))}
                </div>
                <div className="project-footer">
                  <Link to="/realisations" className="project-link">
                    Consulter l'étude de cas →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 06 — POURQUOI BOKENGI GROUP ── */}
      <section className="home-why-section">
        <div className="container">
          <div className="section-heading-center">
            <span className="section-kicker">Engagements & Valeur ajoutée</span>
            <h2 className="section-title">Pourquoi Bokengi Group ?</h2>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <span className="why-num">01</span>
              <h3>Expertise</h3>
              <p>Des compétences techniques et opérationnelles adaptées aux besoins réels.</p>
            </div>
            <div className="why-card">
              <span className="why-num">02</span>
              <h3>Solutions sur mesure</h3>
              <p>Des solutions pensées selon le contexte, les objectifs et les contraintes du client.</p>
            </div>
            <div className="why-card">
              <span className="why-num">03</span>
              <h3>Accompagnement</h3>
              <p>Une approche qui ne s'arrête pas au déploiement initial.</p>
            </div>
            <div className="why-card">
              <span className="why-num">04</span>
              <h3>Vision long terme</h3>
              <p>Des solutions conçues pour évoluer avec la maturité des organisations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 07 — NOTRE MÉTHODE ── */}
      <section className="home-method-section">
        <div className="container">
          <div className="section-heading-center">
            <span className="section-kicker">Processus opérationnel</span>
            <h2 className="section-title">Notre méthode</h2>
          </div>

          <div className="method-steps-grid">
            <div className="method-step">
              <div className="step-num">01</div>
              <h3>Comprendre</h3>
              <p>Analyser le besoin, les contraintes et le contexte spécifique.</p>
            </div>
            <div className="method-step">
              <div className="step-num">02</div>
              <h3>Concevoir</h3>
              <p>Définir une architecture et un plan de déploiement adapté.</p>
            </div>
            <div className="method-step">
              <div className="step-num">03</div>
              <h3>Déployer</h3>
              <p>Mettre en œuvre la solution avec rigueur et contrôle qualité.</p>
            </div>
            <div className="method-step">
              <div className="step-num">04</div>
              <h3>Accompagner</h3>
              <p>Assurer le suivi, le transfert de compétences et l'amélioration continue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 08 — CTA FINAL ── */}
      <CTASection />
    </div>
  );
};

export default Home;
