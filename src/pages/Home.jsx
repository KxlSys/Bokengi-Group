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

  const itDomains = [
    {
      title: 'Cybersécurité & Résilience',
      desc: 'Protection périmétrique, audit des vulnérabilités, sauvegardes immuables et conformité des accès.',
    },
    {
      title: 'Systèmes & Réseaux',
      desc: 'Architecture réseau local et distant, serveurs haute disponibilité, VPN sécurisés et infogérance.',
    },
    {
      title: 'Ingénierie & Développement',
      desc: 'Conception de logiciels métier, API robustes et intégrations système pérennes.',
    },
    {
      title: 'Maintenance & Support',
      desc: 'Contrats de maintenance proactive, assistance rapide et supervision continue de vos parcs.',
    },
  ];

  const whyPillars = [
    {
      idx: '01',
      title: 'Expertise',
      desc: 'Des compétences pointues adaptées aux enjeux réels des PME et grandes organisations.',
    },
    {
      idx: '02',
      title: 'Sécurité',
      desc: 'La sécurité intégrée nativement à chaque couche d\'infrastructure dès sa conception.',
    },
    {
      idx: '03',
      title: 'Agilité',
      desc: 'Des solutions sur mesure et évolutives qui respectent votre contexte et vos ressources.',
    },
    {
      idx: '04',
      title: 'Accompagnement',
      desc: 'Une relation de partenariat durable avec un support réactif qui continue après le déploiement.',
    },
  ];

  const methodSteps = [
    {
      num: '01',
      title: 'Comprendre',
      desc: 'Audit de votre environnement existant, cadrage précis des besoins et analyse des risques.',
    },
    {
      num: '02',
      title: 'Concevoir',
      desc: 'Élaboration de l\'architecture technique, du cahier des charges et de la feuille de route.',
    },
    {
      num: '03',
      title: 'Déployer',
      desc: 'Mise en production rigoureuse, tests de charge, sécurisation et validation des jalons.',
    },
    {
      num: '04',
      title: 'Accompagner',
      desc: 'Formation des équipes, maintenance proactive et évolutions continues dans le temps.',
    },
  ];

  return (
    <div className="page-home-v2">
      <SEO 
        title="Bokengi Group | Technologie, Digital & Services professionnels" 
        description="Bokengi Group conçoit, sécurise et accompagne les infrastructures, solutions numériques et projets professionnels qui font avancer les organisations." 
      />

      {/* ── 01 HERO SECTION V2 ── */}
      <section className="hero-v2">
        <div className="container-v2">
          <div className="hero-v2-grid">
            <div className="hero-v2-content">
              <span className="kicker-v2">BOKENGI GROUP</span>
              <h1 className="title-display hero-v2-title">
                Construire.<br />
                <span className="accent-protect">Protéger.</span><br />
                Développer.
              </h1>
              <p className="hero-v2-lead">
                Bokengi Group conçoit, sécurise et accompagne les infrastructures, solutions numériques et projets professionnels qui font avancer les organisations.
              </p>
              <div className="hero-v2-actions">
                <Link to="/expertises" className="btn-v2-primary">
                  Découvrir nos expertises
                </Link>
                <Link to="/contact?type=devis" className="btn-v2-ghost">
                  Demander un devis
                </Link>
              </div>
            </div>

            <div className="hero-v2-artwork">
              <div className="hero-artwork-canvas">
                <div className="artwork-technical-grid"></div>
                <div className="artwork-nodes-orbit">
                  <span className="orbit-node node-it">Bokengi IT</span>
                  <span className="orbit-node node-digital">Digital</span>
                  <span className="orbit-node node-business">Business</span>
                  <span className="orbit-node node-consulting">Consulting</span>
                  <span className="orbit-node node-events">Events</span>
                </div>
                <div className="artwork-emblem-center">
                  <img src="/bokengi-mark.png" alt="Emblème Bokengi Group" />
                </div>
                <span className="artwork-caption">
                  Ingénierie & Gouvernance Unifiée
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 PRÉSENTATION DU GROUPE ── */}
      <section className="intro-v2-section">
        <div className="container-v2">
          <div className="intro-v2-grid">
            <div>
              <span className="kicker-v2">Vision Globale</span>
              <h2 className="title-section">
                Une vision globale.<br />
                Des expertises complémentaires.
              </h2>
            </div>
            <div className="intro-v2-text">
              <p>
                Bokengi Group réunit des expertises technologiques, numériques et professionnelles au sein d'une même organisation afin d'accompagner les projets de manière cohérente, sécurisée et durable.
              </p>
              <p>
                De l'administration de systèmes informatiques critiques à la mise en œuvre de plateformes digitales en passant par l'accompagnement opérationnel, nous apportons aux entreprises la solidité d'un partenaire structuré.
              </p>
              <div className="intro-v2-quote">
                « Notre raison d'être : bâtir des fondations technologiques fiables et libérer le potentiel opérationnel de chaque organisation. »
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 NOS PÔLES (SIGNATURE EDITORIAL) ── */}
      <section className="poles-v2-section">
        <div className="container-v2">
          <div className="poles-v2-header">
            <span className="kicker-v2">Architecture Opérationnelle</span>
            <h2 className="title-section">Nos expertises</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--ink-muted)', marginTop: '0.75rem' }}>
              Cinq pôles d'excellence. Une même exigence de rigueur.
            </p>
          </div>

          <div className="poles-v2-list">
            {poles.map((p) => (
              <Link key={p.num} to={p.to} className="pole-v2-row">
                <span className="pole-v2-num">{p.num}</span>
                <span className="pole-v2-title">{p.title}</span>
                <span className="pole-v2-domains">{p.domains}</span>
                <span className="pole-v2-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 FOCUS BOKENGI IT ── */}
      <section className="it-v2-section">
        <div className="container-v2 it-v2-container">
          <div className="it-v2-grid">
            <div className="it-v2-left">
              <span className="kicker-v2" style={{ color: 'var(--blue-glow)' }}>Cœur Technologique</span>
              <h2 className="title-section">Bokengi IT</h2>
              <p className="it-v2-tagline">
                L'infrastructure qui soutient votre activité.<br />
                La sécurité qui la protège.
              </p>
              <p className="it-v2-desc">
                Pôle central du groupe, Bokengi IT garantit la continuité, la performance et l'intégrité de vos parcs informatiques, serveurs et réseaux d'entreprise.
              </p>
              <Link to="/expertises/it" className="btn-v2-primary it-v2-cta">
                Découvrir Bokengi IT
              </Link>
            </div>

            <div className="it-v2-domains-grid">
              {itDomains.map((dom, i) => (
                <div key={i} className="it-domain-card">
                  <h3>{dom.title}</h3>
                  <p>{dom.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 RÉALISATIONS ── */}
      <section className="projects-v2-section">
        <div className="container-v2">
          <div className="projects-v2-header">
            <div>
              <span className="kicker-v2">Cas d'Usage & Réalisations</span>
              <h2 className="title-section">Réalisations récentes</h2>
            </div>
            <Link to="/realisations" className="btn-v2-ghost">
              Voir tous les projets →
            </Link>
          </div>

          <div className="projects-v2-showcase">
            {/* Flagship Case */}
            <div className="project-flagship-card">
              <div>
                <div className="project-flagship-top">
                  <span className="project-flagship-badge">Bokengi IT & Digital</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--ink-faint)' }}>Production active</span>
                </div>
                <h3 className="project-flagship-title">Esiika — Plateforme de Commerce & Logistique</h3>
                <p className="project-flagship-lead">
                  Conception et déploiement d'une architecture e-commerce complète avec gestion des commandes, suivi d'expédition multi-statuts et dispatch transactionnel sécurisé.
                </p>
                <ul className="project-specs-list">
                  <li>Infrastructure cloud haute disponibilité avec sauvegardes continues</li>
                  <li>Système de tracking d'expéditions automatisé par e-mail transactionnel</li>
                  <li>Intégration d'un tunnel de paiement sécurisé et gestion des stocks temps réel</li>
                </ul>
              </div>
              <Link to="/realisations" className="btn-v2-ghost" style={{ alignSelf: 'flex-start' }}>
                Consulter l'étude de cas
              </Link>
            </div>

            {/* Secondary Column */}
            <div className="projects-secondary-column">
              <div className="project-secondary-card">
                <span className="project-flagship-badge">Bokengi Digital</span>
                <h3>Kongama — Gestion de Point de Vente</h3>
                <p>
                  Application de gestion de caisse et de suivi des stocks multi-magasins avec synchronisation hors-ligne et rapports d'activité analytiques.
                </p>
                <Link to="/realisations" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--blue-accent)', textDecoration: 'none', fontWeight: 600 }}>
                  Détails du projet →
                </Link>
              </div>

              <div className="project-secondary-card">
                <span className="project-flagship-badge">Bokengi IT</span>
                <h3>FleetGuard — Télématique & Suivi de Flotte</h3>
                <p>
                  Dispositif de centralisation télématique permettant la surveillance de véhicules, l'optimisation des trajets et la maintenance prédictive.
                </p>
                <Link to="/realisations" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--blue-accent)', textDecoration: 'none', fontWeight: 600 }}>
                  Détails du projet →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 POURQUOI BOKENGI GROUP ── */}
      <section className="why-v2-section">
        <div className="container-v2">
          <div className="why-v2-header">
            <span className="kicker-v2">Engagement & Rigueur</span>
            <h2 className="title-section">Pourquoi choisir Bokengi Group ?</h2>
          </div>

          <div className="why-v2-grid">
            {whyPillars.map((wp) => (
              <div key={wp.idx} className="why-v2-col">
                <span className="why-v2-idx">{wp.idx}</span>
                <h3 className="title-subsection">{wp.title}</h3>
                <p>{wp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 NOTRE MÉTHODE ── */}
      <section className="method-v2-section">
        <div className="container-v2">
          <div className="method-v2-header">
            <span className="kicker-v2">Méthodologie</span>
            <h2 className="title-section">Notre méthode d'intervention</h2>
          </div>

          <div className="method-v2-track">
            {methodSteps.map((s) => (
              <div key={s.num} className="method-v2-step">
                <div className="method-v2-dot">{s.num}</div>
                <h3 className="title-subsection">{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 08 CTA FINAL V2 ── */}
      <section className="cta-v2-section">
        <div className="container-v2">
          <div className="cta-v2-box">
            <span className="kicker-v2" style={{ color: 'var(--blue-glow)', justifyContent: 'center' }}>
              Engagement Professionnel
            </span>
            <h2 className="cta-v2-title">Construisons quelque chose d'utile.</h2>
            <p className="cta-v2-lead">
              Vous avez un projet, un besoin informatique, un enjeu numérique ou une organisation à structurer ? Parlons-en dès aujourd'hui.
            </p>
            <div className="cta-v2-actions">
              <Link to="/contact?type=devis" className="btn-v2-primary">
                Demander un devis
              </Link>
              <Link to="/contact" className="btn-v2-ghost">
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
