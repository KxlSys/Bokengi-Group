import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';

const Group = () => {
  const values = [
    {
      title: 'Excellence',
      desc: 'Exigence de rigueur technique et de qualité dans chaque ligne de code et chaque livrable.',
    },
    {
      title: 'Innovation',
      desc: 'Veille continue et adoption pragmatique des technologies modernes pour répondre à des enjeux réels.',
    },
    {
      title: 'Fiabilité',
      desc: 'Engagement sur la disponibilité, la robustesse des systèmes et le respect des délais convenus.',
    },
    {
      title: 'Sécurité',
      desc: 'Intégration de la cybersécurité et de la protection des données au cœur de toutes nos architectures.',
    },
    {
      title: 'Intégrité',
      desc: 'Transparence totale dans nos recommandations, nos devis et nos choix méthodologiques.',
    },
    {
      title: 'Accompagnement',
      desc: 'Proximité humaine, écoute active et suivi durable pour faire grandir les projets de nos partenaires.',
    },
  ];

  return (
    <div className="page-group">
      <SEO 
        title="Le Groupe" 
        description="Découvrez Bokengi Group, un groupe de services technologiques et professionnels organisé autour de cinq pôles d'expertise." 
      />

      <PageHeader
        eyebrow="Présentation Institutionnelle"
        title="Bokengi Group"
        subtitle="Une vision. Plusieurs expertises."
        breadcrumbs={[{ label: 'Le Groupe' }]}
      />

      {/* ── SECTION VISION & MISSION ── */}
      <section className="group-pillars-section" style={{ padding: '6.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container-v2">
          <div className="group-two-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
            <div className="group-content-box">
              <span className="kicker-v2">01 · Cap stratégique</span>
              <h2 className="title-section" style={{ margin: '0.85rem 0 1.5rem' }}>Notre vision</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                Bokengi Group a été conçu pour bâtir des passerelles solides entre les technologies numériques avancées et les besoins concrets des organisations.
              </p>
              <p style={{ fontSize: '1.1rem', color: 'var(--ink-muted)', lineHeight: 1.7 }}>
                Nous croyons en un modèle d'entreprise structuré, fondé sur l'indépendance technique, l'intégrité et la création d'infrastructures pérennes adaptées aux réalités de chaque marché, en Afrique comme à l'international.
              </p>
            </div>

            <div className="group-content-box">
              <span className="kicker-v2">02 · Engagement opérationnel</span>
              <h2 className="title-section" style={{ margin: '0.85rem 0 1.5rem' }}>Notre mission</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Accompagner les dirigeants, entreprises et institutions à chaque étape critique de leur développement :
              </p>
              <ul className="group-mission-list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '1rem', color: 'var(--ink-body)' }}>
                  <span style={{ color: 'var(--blue-accent)', fontWeight: 700 }}>✓</span> Sécuriser et moderniser leurs infrastructures informatiques.
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '1rem', color: 'var(--ink-body)' }}>
                  <span style={{ color: 'var(--blue-accent)', fontWeight: 700 }}>✓</span> Concevoir des applications et plateformes numériques sur mesure.
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '1rem', color: 'var(--ink-body)' }}>
                  <span style={{ color: 'var(--blue-accent)', fontWeight: 700 }}>✓</span> Structurer leurs processus administratifs et opérationnels.
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '1rem', color: 'var(--blue-accent)', fontWeight: 700 }}>
                  <span style={{ color: 'var(--blue-accent)', fontWeight: 700 }}>✓</span> Fournir un conseil éclairé sans biais technologique commercial.
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '1rem', color: 'var(--ink-body)' }}>
                  <span style={{ color: 'var(--blue-accent)', fontWeight: 700 }}>✓</span> Coordonner des événements d'envergure professionnelle.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION ORGANISATION MULTI-PÔLES ── */}
      <section className="group-structure-section" style={{ padding: '6.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container-v2">
          <div style={{ marginBottom: '4rem' }}>
            <span className="kicker-v2">Organisation</span>
            <h2 className="title-section">Une structure organisée en 5 pôles</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--ink-muted)', marginTop: '0.5rem' }}>
              Pour garantir clarté et excellence, chaque domaine est piloté par des compétences spécialisées :
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="project-secondary-card">
              <span className="project-flagship-badge">Technologie & IT</span>
              <h3 className="title-subsection" style={{ margin: '1rem 0 0.5rem' }}>Bokengi IT</h3>
              <p>Ingénierie systèmes, réseaux, cloud, cybersécurité et maintenance opérationnelle.</p>
              <Link to="/expertises/it" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--blue-accent)', textDecoration: 'none', fontWeight: 600 }}>En savoir plus →</Link>
            </div>
            <div className="project-secondary-card">
              <span className="project-flagship-badge">Digital & Web</span>
              <h3 className="title-subsection" style={{ margin: '1rem 0 0.5rem' }}>Bokengi Digital</h3>
              <p>Développement web, applications métier, plateformes e-commerce et UX/UI.</p>
              <Link to="/expertises/digital" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--blue-accent)', textDecoration: 'none', fontWeight: 600 }}>En savoir plus →</Link>
            </div>
            <div className="project-secondary-card">
              <span className="project-flagship-badge">Support Opérationnel</span>
              <h3 className="title-subsection" style={{ margin: '1rem 0 0.5rem' }}>Bokengi Business</h3>
              <p>Assistance administrative, gestion documentaire et support aux professionnels.</p>
              <Link to="/expertises/business" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--blue-accent)', textDecoration: 'none', fontWeight: 600 }}>En savoir plus →</Link>
            </div>
            <div className="project-secondary-card">
              <span className="project-flagship-badge">Conseil & Audit</span>
              <h3 className="title-subsection" style={{ margin: '1rem 0 0.5rem' }}>Bokengi Consulting</h3>
              <p>Conseil IT, audits d'architecture, analyse des besoins et transformation numérique.</p>
              <Link to="/expertises/consulting" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--blue-accent)', textDecoration: 'none', fontWeight: 600 }}>En savoir plus →</Link>
            </div>
            <div className="project-secondary-card">
              <span className="project-flagship-badge">Événements Pro</span>
              <h3 className="title-subsection" style={{ margin: '1rem 0 0.5rem' }}>Bokengi Events</h3>
              <p>Organisation, logistique et solutions techniques pour événements professionnels.</p>
              <Link to="/expertises/events" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--blue-accent)', textDecoration: 'none', fontWeight: 600 }}>En savoir plus →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION VALEURS ── */}
      <section className="group-values-section" style={{ padding: '6.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container-v2">
          <div style={{ marginBottom: '4rem' }}>
            <span className="kicker-v2">Culture d'entreprise</span>
            <h2 className="title-section">Nos valeurs fondamentales</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {values.map((v, i) => (
              <div key={i} className="project-secondary-card">
                <span className="why-v2-idx">0{i + 1}</span>
                <h3 className="title-subsection" style={{ margin: '0.5rem 0 0.75rem' }}>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION APPROCHE ── */}
      <section className="group-approach-section" style={{ padding: '6.5rem 0' }}>
        <div className="container-v2">
          <div className="project-flagship-card" style={{ textAlign: 'center', maxWidth: '940px', margin: '0 auto' }}>
            <span className="kicker-v2" style={{ justifyContent: 'center' }}>Méthodologie globale</span>
            <h2 className="title-section" style={{ margin: '0.5rem 0 1.25rem' }}>Pragmatisme & proximité</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Nous refusons les modèles standardisés et les solutions génériques prêtes à l'emploi. Chaque organisation possède son historique, ses contraintes budgétaires et ses impératifs de sécurité. Notre rôle est de concevoir la solution la plus sobre, la plus robuste et la plus rentable pour votre contexte.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <Link to="/expertises" className="btn-v2-primary">Explorer nos expertises</Link>
              <Link to="/contact" className="btn-v2-ghost">Échanger avec notre équipe</Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Group;
