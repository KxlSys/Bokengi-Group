import React from 'react';

const About = () => {
  return (
    <section id="about">
      <div className="section-header">
        <span className="section-label" data-num="03">Le Groupe</span>
        <h2>Une vision commune,<br/>des expertises complémentaires.</h2>
      </div>
      <div className="about-body">
        <div className="about-text fade-up">
          <p><strong>Bokengi Group</strong> est un groupe de services qui place la technologie, la fiabilité et la proximité au cœur de son accompagnement.</p>
          <p>Notre pôle <strong>Bokengi IT</strong> constitue le socle technologique du groupe : développement web, systèmes et réseaux, cybersécurité, cloud, maintenance et support informatique.</p>
          <p>Autour de cette expertise, <strong>Bokengi Digital, Business, Consulting et Events</strong> répondent à des besoins complémentaires : digitalisation, assistance opérationnelle, conseil et organisation d'événements professionnels.</p>
          <p>Notre ambition est simple : <strong>transformer des besoins concrets en solutions utiles, sécurisées et durables</strong>, avec une approche adaptée aux réalités de chaque client.</p>
        </div>
        <div className="about-tags fade-up" style={{ transitionDelay: '0.1s' }}>
          <div className="tag-row"><span className="tag">IT & Cybersécurité</span><span className="tag">Développement Web</span></div>
          <div className="tag-row"><span className="tag">Systèmes & Réseaux</span><span className="tag">Cloud</span><span className="tag">Maintenance</span></div>
          <div className="tag-row"><span className="tag">Digital</span><span className="tag">Consulting</span><span className="tag">Business Services</span></div>
          <div className="tag-row"><span className="tag muted">Gestion de projets</span><span className="tag muted">Événementiel</span><span className="tag muted">Support</span></div>
        </div>
      </div>
    </section>
  );
};

export default About;
