import React from 'react';
import SEO from '../../components/SEO';
import PageHeader from '../../components/PageHeader';
import CTASection from '../../components/CTASection';

const BokengiConsulting = () => {
  const domains = [
    {
      title: 'Audits Informatiques & Diagnostics',
      desc: 'Évaluer avec lucidité et précision l\'état technique, la sécurité et la dette technologique de votre système d\'information.',
      missions: [
        'Audit global d\'infrastructure (serveurs, réseau, postes, cloud)',
        'Diagnostic de sécurité & cartographie des risques numériques',
        'Audit de conformité des sauvegardes et plans de reprise d\'activité',
        'Rapport de diagnostic avec plan de remédiation hiérarchisé',
      ],
    },
    {
      title: 'Conseil en Stratégie IT & Architecture',
      desc: 'Concevoir des architectures pérennes et définir la feuille de route technologique de votre organisation.',
      missions: [
        'Élaboration de schémas directeurs informatiques (SDI)',
        'Conseil indépendant pour le choix de progiciels, cloud et prestataires',
        'Dimensionnement des capacités et optimisation des coûts d\'infrastructure',
        'Cadrage technique et rédaction de cahiers des charges fonctionnels',
      ],
    },
    {
      title: 'Transformation Numérique des PME & Organisations',
      desc: 'Conduire le changement technologique avec méthode, sans désorganiser vos opérations quotidiennes.',
      missions: [
        'Analyse des processus métier et identification des goulots d\'étranglement',
        'Stratégie de modernisation et d\'automatisation des outils internes',
        'Accompagnement au déploiement de nouvelles solutions logicielles',
        'Ateliers de sensibilisation et formation des équipes dirigeantes',
      ],
    },
    {
      title: 'Assistance à Maîtrise d\'Ouvrage (AMOA)',
      desc: 'Défendre les intérêts techniques et budgétaires de votre entreprise dans vos projets d\'envergure.',
      missions: [
        'Pilotage et suivi de projets technologiques complexes',
        'Contrôle qualité des livrables de développement et d\'infrastructure',
        'Gestion des risques et suivi des engagements contractuels tiers',
        'Validation des jalons et recettes techniques préalables à la mise en production',
      ],
    },
  ];

  return (
    <div className="page-pole page-pole-consulting">
      <SEO 
        title="Bokengi Consulting — Conseil Stratégique & Audits IT" 
        description="Pôle consulting de Bokengi Group : conseil IT, audit informatique, cybersécurité, schéma directeur et accompagnement des PME." 
      />

      <PageHeader
        eyebrow="Pôle Conseil & Audit"
        badge="Audit · Stratégie · AMOA"
        title="Bokengi Consulting"
        subtitle="Conseil indépendant, audit et accompagnement stratégique pour faire les bons choix technologiques et organisationnels."
        breadcrumbs={[
          { label: 'Expertises', to: '/expertises' },
          { label: 'Bokengi Consulting' },
        ]}
      />

      <section className="pole-domains-section">
        <div className="container">
          <div className="pole-domains-grid">
            {domains.map((dom, idx) => (
              <div key={idx} className="pole-domain-card">
                <div className="pole-domain-header">
                  <span className="pole-domain-idx">0{idx + 1}</span>
                  <h2>{dom.title}</h2>
                </div>
                <p className="pole-domain-desc">{dom.desc}</p>
                <div className="pole-services-box">
                  <h3>Missions types :</h3>
                  <ul className="pole-services-list">
                    {dom.missions.map((m, mIdx) => (
                      <li key={mIdx}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection 
        pole="consulting"
        title="Besoin d'un avis d'expert ou d'un audit de vos systèmes ?"
        text="Planifions un échange pour cadrer votre problématique et établir un diagnostic préliminaire."
        primaryLabel="Demander un devis Consulting"
        secondaryLabel="Prendre contact"
      />
    </div>
  );
};

export default BokengiConsulting;
