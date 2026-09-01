import React from 'react';
import SEO from '../../components/SEO';
import PageHeader from '../../components/PageHeader';
import CTASection from '../../components/CTASection';

const BokengiBusiness = () => {
  const pillars = [
    {
      title: 'Assistance Administrative & Secrétariat',
      desc: 'Déléguer la charge administrative courante pour gagner en sérénité et libérer du temps pour vos clients.',
      services: [
        'Secrétariat externalisé et traitement des courriers/emails',
        'Rédaction, relecture et mise en page de documents professionnels',
        'Gestion des tableaux de suivi et reporting opérationnel',
        'Interface de premier niveau avec vos partenaires et interlocuteurs',
      ],
    },
    {
      title: 'Gestion Documentaire & Archivage Numérique',
      desc: 'Structurer vos archives et vos flux d\'information pour retrouver n\'importe quel document en quelques secondes.',
      services: [
        'Numérisation, indexation et classement méthodique de dossiers',
        'Organisation des espaces partagés sécurisés (Google Drive, Nextcloud, OneDrive)',
        'Mise en place de conventions de nommage et de procédures internes',
        'Contrôle de conformité documentaire et traçabilité des pièces',
      ],
    },
    {
      title: 'Organisation & Gestion de Planning',
      desc: 'Optimiser le temps des dirigeants et coordonner les rendez-vous professionnels sans friction.',
      services: [
        'Gestion d\'agendas complexes et prise de rendez-vous',
        'Préparation des ordres du jour et comptes-rendus de réunions',
        'Organisation logistique des déplacements et réservations',
        'Suivi des échéances critiques et rappels programmés',
      ],
    },
    {
      title: 'Support aux Entrepreneurs & Gestion de Projets',
      desc: 'Un appui opérationnel fiable pour les fondateurs, freelances et petites structures en phase de croissance.',
      services: [
        'Assistance au montage et au suivi de dossiers opérationnels',
        'Coordination des tâches administratives transverses',
        'Aide à la formalisation de processus et check-lists métier',
        'Accompagnement administratif au quotidien',
      ],
    },
  ];

  return (
    <div className="page-pole page-pole-business">
      <SEO 
        title="Bokengi Business — Assistance Administrative & Support Opérationnel" 
        description="Pôle business de Bokengi Group : assistance administrative, gestion documentaire, secrétariat externalisé et support aux entrepreneurs." 
      />

      <PageHeader
        eyebrow="Pôle Services Opérationnels"
        badge="Assistance · Gestion · Organisation"
        title="Bokengi Business"
        subtitle="Simplifier l'organisation pour permettre aux entreprises et aux dirigeants de se concentrer sur leur cœur de métier."
        breadcrumbs={[
          { label: 'Expertises', to: '/expertises' },
          { label: 'Bokengi Business' },
        ]}
      />

      <section className="pole-domains-section">
        <div className="container">
          <div className="pole-domains-grid">
            {pillars.map((pil, idx) => (
              <div key={idx} className="pole-domain-card">
                <div className="pole-domain-header">
                  <span className="pole-domain-idx">0{idx + 1}</span>
                  <h2>{pil.title}</h2>
                </div>
                <p className="pole-domain-desc">{pil.desc}</p>
                <div className="pole-services-box">
                  <h3>Domaines d'intervention :</h3>
                  <ul className="pole-services-list">
                    {pil.services.map((srv, sIdx) => (
                      <li key={sIdx}>{srv}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection 
        pole="business"
        title="Besoin d'alléger votre charge administrative ?"
        text="Expliquez-nous vos besoins en support opérationnel pour définir un accompagnement adapté à votre rythme."
        primaryLabel="Demander un devis Business"
        secondaryLabel="Nous contacter"
      />
    </div>
  );
};

export default BokengiBusiness;
