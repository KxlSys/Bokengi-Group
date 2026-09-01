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
                  <h3>Dispositifs & prestations :</h3>
                  <ul className="pole-services-list">
                    {dom.items.map((item, iIdx) => (
                      <li key={iIdx}>{item}</li>
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
