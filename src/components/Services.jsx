import React from 'react';

const services = [
  {
    number: '01',
    category: 'Technology',
    title: 'Bokengi IT',
    description: "Le pôle technologique du groupe : concevoir, administrer, sécuriser et maintenir des infrastructures et solutions informatiques fiables.",
    items: ['Développement Web & applications', 'Systèmes, réseaux & cloud', 'Cybersécurité & audits', 'Maintenance & support IT'],
  },
  {
    number: '02',
    category: 'Digital',
    title: 'Bokengi Digital',
    description: "Des expériences numériques utiles et performantes pour renforcer la présence, les outils et les processus digitaux de votre organisation.",
    items: ['Sites vitrines & e-commerce', 'UX/UI & identité digitale', 'Automatisation & intégrations', 'SEO & maintenance web'],
  },
  {
    number: '03',
    category: 'Business Services',
    title: 'Bokengi Business',
    description: "Un accompagnement opérationnel pour alléger la charge administrative et permettre aux professionnels de se concentrer sur leur activité.",
    items: ['Assistance administrative', 'Gestion documentaire', 'Planification & agendas', 'Support aux entrepreneurs'],
  },
  {
    number: '04',
    category: 'Advisory',
    title: 'Bokengi Consulting',
    description: "Conseil et accompagnement pour transformer un besoin métier en plan d'action concret, mesurable et évolutif.",
    items: ['Conseil IT & transformation', 'Audit infrastructure & sécurité', 'Études & recommandations', 'Accompagnement de projets'],
  },
  {
    number: '05',
    category: 'Events',
    title: 'Bokengi Events',
    description: "Organisation et coordination d'événements professionnels, avec la possibilité d'intégrer des solutions digitales et techniques.",
    items: ['Séminaires & conférences', 'Coordination logistique', 'Événements corporate', 'Solutions digitales événementielles'],
  },
];

const Services = () => {
  return (
    <>
      <section id="services">
        <div className="section-header">
          <span className="section-label" data-num="01">Nos expertises</span>
          <h2>Un groupe.<br/>Plusieurs expertises.</h2>
        </div>

        <div className="services-intro fade-up visible">
          <p>Nous réunissons des compétences complémentaires pour répondre aux besoins techniques, numériques et opérationnels de nos clients.</p>
        </div>

        <div className="services-grid services-group-grid">
          {services.map((service, index) => (
            <article className="service-card service-group-card fade-up visible" key={service.number} style={{ transitionDelay: `${index * 0.08}s` }}>
              <div className="service-card-top">
                <span className="service-number">{service.number}</span>
                <span className="service-category">{service.category}</span>
              </div>
              <h3>{service.title}</h3>
              <p className="service-desc">{service.description}</p>
              <ul className="service-items">
                {service.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <div className="ticker-wrap">
        <div className="ticker-label"><span>Expertises</span></div>
        <div className="ticker-track-outer">
          <div className="ticker-track" id="ticker">
            {[...services.flatMap(service => service.items), 'Infrastructure', 'Cloud', 'Automatisation', 'Gestion de projets'].map((skill, index) => (
              <div className="ticker-item" key={`${skill}-${index}`}><span className="ticker-dot"></span>{skill}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
