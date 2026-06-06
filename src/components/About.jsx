import React from 'react';

const About = () => {
  return (
    <section id="about">
      <div className="section-header">
        <span className="section-label" data-num="02">À propos</span>
        <h2>La distance n'est<br/>jamais un frein.</h2>
      </div>
      <div className="about-body">
        <div className="about-text fade-up">
          <p>Ingénieur informatique polyvalent, j'ai choisi l'indépendance pour offrir une <strong>réactivité et une flexibilité</strong> qu'une grande structure ne peut pas toujours garantir.</p>
          <p>Chez Kal-Cooperation, chaque mission est traitée avec l'exigence d'un partenaire technique dédié — pas comme un prestataire parmi d'autres.</p>
          <p>Mon approche : <strong>comprendre votre métier</strong> avant de toucher au code. Livrer vite, livrer bien, documenter proprement.</p>
        </div>
        <div className="about-tags fade-up" style={{ transitionDelay: '0.1s' }}>
          <div className="tag-row">
            <span className="tag">React</span>
            <span className="tag">Node.js</span>
            <span className="tag">Python</span>
            <span className="tag">TypeScript</span>
          </div>
          <div className="tag-row">
            <span className="tag">Docker</span>
            <span className="tag">Kubernetes</span>
            <span className="tag">AWS</span>
            <span className="tag">Azure</span>
            <span className="tag">GCP</span>
          </div>
          <div className="tag-row">
            <span className="tag">VPN</span>
            <span className="tag">Pentest</span>
            <span className="tag">CI/CD</span>
            <span className="tag">No-code</span>
          </div>
          <div className="tag-row">
            <span className="tag muted">Linux</span>
            <span className="tag muted">Nginx</span>
            <span className="tag muted">PostgreSQL</span>
            <span className="tag muted">Redis</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
