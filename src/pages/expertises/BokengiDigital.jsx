import React from 'react';
import SEO from '../../components/SEO';
import PageHeader from '../../components/PageHeader';
import CTASection from '../../components/CTASection';

const BokengiDigital = () => {
  const offerings = [
    {
      title: 'Création de Sites Web & Portails',
      desc: 'Des sites vitrines et corporate conçus pour valoriser votre positionnement, inspirer confiance et convertir vos visiteurs.',
      features: ['Design sur mesure & responsive mobile-first', 'Performances de chargement ultra-rapides', 'Structure sémantique & accessibilité', 'Autonomie de gestion de contenu'],
    },
    {
      title: 'Plateformes E-Commerce & Vente en Ligne',
      desc: 'Des boutiques en ligne fluides, adaptées aux réalités de paiement locales (Mobile Money, Airtel Money, cartes bancaires).',
      features: ['Gestion de catalogue, stocks et commandes', 'Tunnels de commande optimisés anti-abandon', 'Passerelles de paiement sécurisées intégrées', 'Tableaux de bord d\'administration clairs'],
    },
    {
      title: 'Applications Web & Outils Métier',
      desc: 'Digitaliser vos processus internes pour supprimer les tâches manuelles et faire gagner du temps à vos équipes.',
      features: ['Interfaces intranet et portails clients', 'Outils de gestion d\'inventaire ou de suivi', 'Espaces membres et dashboards interactifs', 'Architecture cloud sécurisée et évolutive'],
    },
    {
      title: 'Design d\'Expérience UX/UI & Identité',
      desc: 'Une identité visuelle claire et une ergonomie soignée qui simplifient l\'utilisation de vos services numériques.',
      features: ['Conception de maquettes & prototypes interactifs', 'Design systems et chartes graphiques digitales', 'Optimisation des parcours utilisateurs (UX)', 'Refonte graphique de plateformes existantes'],
    },
    {
      title: 'Automatisation, SEO & Maintenance',
      desc: 'Faire vivre vos outils dans la durée avec un accompagnement technique continu et une visibilité naturelle renforcée.',
      features: ['Référencement naturel (SEO technique et local)', 'Connexion d\'outils et automatisations (Zapier, Webhooks, API)', 'Hébergement haute disponibilité & sauvegardes', 'Maintenance préventive, correctrice et évolutive'],
    },
  ];

  return (
    <div className="page-pole page-pole-digital">
      <SEO 
        title="Bokengi Digital — Solutions Web & Transformation Numérique" 
        description="Pôle digital de Bokengi Group : création de sites web, e-commerce, UX/UI, applications web et automatisation de processus." 
      />

      <PageHeader
        eyebrow="Pôle Digital & Web"
        badge="Web · E-commerce · Automatisation"
        title="Bokengi Digital"
        subtitle="Des solutions numériques pensées pour votre activité, centrées sur l'efficacité opérationnelle et la conversion."
        breadcrumbs={[
          { label: 'Expertises', to: '/expertises' },
          { label: 'Bokengi Digital' },
        ]}
      />

      <section className="pole-domains-section" style={{ padding: '6.5rem 0' }}>
        <div className="container-v2">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            {offerings.map((off, idx) => (
              <div key={idx} className="project-secondary-card" style={{ padding: '2.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="why-v2-idx" style={{ marginBottom: 0 }}>0{idx + 1}</span>
                  <span className="project-flagship-badge">Bokengi Digital</span>
                </div>
                <h2 className="title-subsection" style={{ margin: '0.5rem 0 0.85rem' }}>{off.title}</h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--ink-muted)', lineHeight: 1.65, marginBottom: '2rem' }}>{off.desc}</p>
                <div style={{ background: 'var(--bg-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue-accent)', marginBottom: '1rem' }}>
                    Solutions & livrables :
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {off.features.map((feat, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.92rem', color: 'var(--ink-body)' }}>
                        <span style={{ color: 'var(--blue-accent)', fontWeight: 700 }}>•</span> {feat}
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
        pole="digital"
        title="Vous avez un projet de site ou d'application web ?"
        text="Discutons de vos objectifs et construisons un dispositif numérique performant et sur mesure."
        primaryLabel="Demander un devis Digital"
        secondaryLabel="Nous contacter"
      />
    </div>
  );
};

export default BokengiDigital;
