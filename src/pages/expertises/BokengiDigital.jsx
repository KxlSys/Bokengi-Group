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

      <section className="pole-domains-section">
        <div className="container">
          <div className="pole-domains-grid">
            {offerings.map((off, idx) => (
              <div key={idx} className="pole-domain-card">
                <div className="pole-domain-header">
                  <span className="pole-domain-idx">0{idx + 1}</span>
                  <h2>{off.title}</h2>
                </div>
                <p className="pole-domain-desc">{off.desc}</p>
                <div className="pole-services-box">
                  <h3>Ce que nous apportons :</h3>
                  <ul className="pole-services-list">
                    {off.features.map((feat, fIdx) => (
                      <li key={fIdx}>{feat}</li>
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
