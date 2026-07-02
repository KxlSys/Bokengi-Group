import React from 'react';

const About = () => {
  return (
    <section id="about">
      <div className="section-header">
        <span className="section-label" data-num="03">À propos</span>
        <h2>L'alliance de la tech<br/>et du service.</h2>
      </div>
      <div className="about-body">
        <div className="about-text fade-up">
          <p><strong>Bokengi</strong> est une startup technologique et une PME innovante conçue pour offrir un accompagnement à 360° aux entreprises et aux particuliers.</p>
          <p>À travers nos deux entités (Bokengi Services IT et Bokengi-Group), nous allions le développement de solutions numériques de pointe à une assistance administrative et logistique rigoureuse.</p>
          <p>Notre philosophie : <strong>comprendre vos enjeux métiers</strong> avant d'implémenter nos solutions. Nous garantissons une excellence opérationnelle, une sécurité renforcée et un accompagnement de proximité.</p>
        </div>
        <div className="about-tags fade-up" style={{ transitionDelay: '0.1s' }}>
          <div className="tag-row">
            <span className="tag">React</span>
            <span className="tag">Node.js</span>
            <span className="tag">Cybersécurité</span>
            <span className="tag">TypeScript</span>
          </div>
          <div className="tag-row">
            <span className="tag">Docker</span>
            <span className="tag">Cloud AWS</span>
            <span className="tag">Audits Système</span>
            <span className="tag">CI/CD</span>
          </div>
          <div className="tag-row">
            <span className="tag">Campus France</span>
            <span className="tag">Gestion d'Agenda</span>
            <span className="tag">Facturation</span>
          </div>
          <div className="tag-row">
            <span className="tag muted">Linux</span>
            <span className="tag muted">Nginx</span>
            <span className="tag muted">PostgreSQL</span>
            <span className="tag muted">Secrétariat</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
