import React from 'react';
import SEO from '../../components/SEO';
import PageHeader from '../../components/PageHeader';
import CTASection from '../../components/CTASection';

const BokengiEvents = () => {
  const domains = [
    {
      title: 'Organisation d\'Événements Corporate',
      desc: 'Planifier et orchestrer vos temps forts d\'entreprise avec rigueur, sérénité et sens du détail.',
      items: [
        'Séminaires d\'entreprise & journées d\'études',
        'Conférences institutionnelles, tables rondes & colloques',
        'Cérémonies officielles & soirées d\'inauguration',
        'Lancements de produits et rencontres partenaires',
      ],
    },
    {
      title: 'Coordination Logistique & Régie Générale',
      desc: 'Superviser l\'ensemble des prestataires et du déroulement opérationnel sur le terrain.',
      items: [
        'Recherche et contractualisation de lieux d\'exception',
        'Coordination des traiteurs, accueil, sécurité et hôtesses',
        'Gestion des plannings de montage, répétitions et déroulé minute',
        'Supervision sur site pour une fluidité sans accroc',
      ],
    },
    {
      title: 'Solutions Techniques & Audiovisuelles (Synergie IT)',
      desc: 'Bénéficiez de la synergie naturelle avec Bokengi IT pour sécuriser vos dispositifs techniques.',
      items: [
        'Installation de régies son, lumière, projection et écrans LED',
        'Diffusion en direct / live streaming sécurisé et interactif',
        'Mise en place de réseaux Wi-Fi temporaires haute densité pour événements',
        'Captation vidéo, enregistrement et archivage numérique',
      ],
    },
    {
      title: 'Communication & Dispositifs Digitaux',
      desc: 'Valoriser l\'événement avant, pendant et après auprès de vos invités et de votre écosystème.',
      items: [
        'Création de pages d\'inscription et billetterie en ligne',
        'Badges d\'accès personnalisés avec QR code / contrôle d\'accès',
        'Supports de communication digitaux et signalétique',
        'Enquêtes de satisfaction et restitution post-événement',
      ],
    },
  ];

  return (
    <div className="page-pole page-pole-events">
      <SEO 
        title="Bokengi Events — Organisation & Solutions Événementielles" 
        description="Pôle événementiel de Bokengi Group : organisation de séminaires, conférences, coordination logistique et solutions audiovisuelles." 
      />

      <PageHeader
        eyebrow="Pôle Événementiel Professionnel"
        badge="Événements · Logistique · Audiovisuel"
        title="Bokengi Events"
        subtitle="Concevoir, coordonner et digitaliser des événements professionnels mémorables et maîtrisés de bout en bout."
        breadcrumbs={[
          { label: 'Expertises', to: '/expertises' },
          { label: 'Bokengi Events' },
        ]}
      />

      <section className="pole-domains-section" style={{ padding: '6.5rem 0' }}>
        <div className="container-v2">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            {domains.map((dom, idx) => (
              <div key={idx} className="project-secondary-card" style={{ padding: '2.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="why-v2-idx" style={{ marginBottom: 0 }}>0{idx + 1}</span>
                  <span className="project-flagship-badge">Bokengi Events</span>
                </div>
                <h2 className="title-subsection" style={{ margin: '0.5rem 0 0.85rem' }}>{dom.title}</h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--ink-muted)', lineHeight: 1.65, marginBottom: '2rem' }}>{dom.desc}</p>
                <div style={{ background: 'var(--bg-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue-accent)', marginBottom: '1rem' }}>
                    Dispositifs & prestations :
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {dom.items.map((item, iIdx) => (
                      <li key={iIdx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.92rem', color: 'var(--ink-body)' }}>
                        <span style={{ color: 'var(--blue-accent)', fontWeight: 700 }}>•</span> {item}
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
        pole="events"
        title="Vous préparez un événement professionnel ?"
        text="Partagez-nous la date, le format et le public visé pour concevoir un dispositif logistique et technique sur mesure."
        primaryLabel="Demander un devis Events"
        secondaryLabel="Nous contacter"
      />
    </div>
  );
};

export default BokengiEvents;
