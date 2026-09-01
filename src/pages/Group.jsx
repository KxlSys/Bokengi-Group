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
      <section className="group-pillars-section">
        <div className="container">
          <div className="group-two-cols">
            <div className="group-content-box">
              <span className="section-kicker">01 · Cap stratégique</span>
              <h2>Notre vision</h2>
              <p>
                Bokengi Group a été conçu pour bâtir des passerelles solides entre les technologies numériques avancées et les besoins concrets des organisations.
              </p>
              <p>
                Nous croyons en un modèle d'entreprise structuré, fondé sur l'indépendance technique, l'intégrité et la création d'infrastructures pérennes adaptées aux réalités de chaque marché, en Afrique comme à l'international.
              </p>
            </div>

            <div className="group-content-box">
              <span className="section-kicker">02 · Engagement opérationnel</span>
              <h2>Notre mission</h2>
              <p>
                Accompagner les dirigeants, entreprises et institutions à chaque étape critique de leur développement :
              </p>
              <ul className="group-mission-list">
                <li>Sécuriser et moderniser leurs infrastructures informatiques.</li>
                <li>Concevoir des applications et plateformes numériques sur mesure.</li>
                <li>Structurer leurs processus administratifs et opérationnels.</li>
                <li>Fournir un conseil éclairé sans biais technologique commercial.</li>
                <li>Coordonner des événements d'envergure professionnelle.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION ORGANISATION MULTI-PÔLES ── */}
      <section className="group-structure-section">
        <div className="container">
          <div className="section-heading-center">
            <span className="section-kicker">Organisation</span>
            <h2 className="section-title">Une structure organisée en 5 pôles</h2>
            <p className="section-lead">
              Pour garantir clarté et excellence, chaque domaine est piloté par des compétences spécialisées :
            </p>
          </div>

          <div className="group-poles-grid">
            <div className="group-pole-card">
              <span className="pole-tag">Technologie</span>
              <h3>Bokengi IT</h3>
              <p>Ingénierie systèmes, réseaux, cloud, cybersécurité et maintenance opérationnelle.</p>
              <Link to="/expertises/it" className="pole-link">En savoir plus →</Link>
            </div>
            <div className="group-pole-card">
              <span className="pole-tag">Digital</span>
              <h3>Bokengi Digital</h3>
              <p>Développement web, applications métier, plateformes e-commerce et UX/UI.</p>
              <Link to="/expertises/digital" className="pole-link">En savoir plus →</Link>
            </div>
            <div className="group-pole-card">
              <span className="pole-tag">Business</span>
              <h3>Bokengi Business</h3>
              <p>Assistance administrative, gestion documentaire et support aux professionnels.</p>
              <Link to="/expertises/business" className="pole-link">En savoir plus →</Link>
            </div>
            <div className="group-pole-card">
              <span className="pole-tag">Advisory</span>
              <h3>Bokengi Consulting</h3>
              <p>Conseil IT, audits d'architecture, analyse des besoins et transformation numérique.</p>
              <Link to="/expertises/consulting" className="pole-link">En savoir plus →</Link>
            </div>
            <div className="group-pole-card">
              <span className="pole-tag">Events</span>
              <h3>Bokengi Events</h3>
              <p>Organisation, logistique et solutions techniques pour événements professionnels.</p>
              <Link to="/expertises/events" className="pole-link">En savoir plus →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION VALEURS ── */}
      <section className="group-values-section">
        <div className="container">
          <div className="section-heading-center">
            <span className="section-kicker">Culture d'entreprise</span>
            <h2 className="section-title">Nos valeurs fondamentales</h2>
          </div>

          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <span className="value-index">0{i + 1}</span>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION APPROCHE ── */}
      <section className="group-approach-section">
        <div className="container">
          <div className="group-approach-card">
            <span className="section-kicker">Méthodologie globale</span>
            <h2>Notre approche : pragmatisme & proximité</h2>
            <p>
              Nous refusons les modèles standardisés et les solutions génériques prêtes à l'emploi. Chaque organisation possède son historique, ses contraintes budgétaires et ses impératifs de sécurité. Notre rôle est de concevoir la solution la plus sobre, la plus robuste et la plus rentable pour votre contexte.
            </p>
            <div className="approach-actions">
              <Link to="/expertises" className="btn-primary">Explorer nos expertises</Link>
              <Link to="/contact" className="btn-ghost">Échanger avec notre équipe</Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Group;
