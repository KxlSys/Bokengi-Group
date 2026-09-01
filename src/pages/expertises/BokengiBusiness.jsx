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
        title="Bokengi Business · Assistance Administrative & Support Opérationnel" 
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

      <section style={{ padding: '90px 0' }}>
        <div className="container-v4">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            {pillars.map((pil, idx) => (
              <div key={idx} style={{ padding: '2.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--blue-cyan)', fontWeight: 700 }}>0{idx + 1}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--blue-cyan)', fontWeight: 700 }}>Bokengi Business</span>
                </div>
                <h2 style={{ fontSize: '1.45rem', margin: '0.5rem 0 0.85rem' }}>{pil.title}</h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--ink-muted)', lineHeight: 1.65, marginBottom: '2rem' }}>{pil.desc}</p>
                <div style={{ background: 'var(--bg-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue-cyan)', marginBottom: '1rem', fontWeight: 700 }}>
                    Domaines d'intervention :
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {pil.services.map((srv, sIdx) => (
                      <li key={sIdx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.92rem', color: 'var(--ink-body)' }}>
                        <span style={{ color: 'var(--blue-cyan)', fontWeight: 700 }}>•</span> {srv}
                      </li>
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
