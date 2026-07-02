import React, { useState, useEffect, useRef } from 'react';
import { portfolioProjects } from '../data/portfolio';

const PortfolioCard = ({ project, index, isExpanded, onToggle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className={`portfolio-card fade-up ${isVisible ? 'visible' : ''} ${isExpanded ? 'expanded' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="portfolio-card-header">
        <span className="portfolio-category">{project.category}</span>
        <span className="portfolio-year">{project.year}</span>
      </div>

      <h3>{project.title}</h3>
      <p className="portfolio-summary">{project.summary}</p>

      <ul className="portfolio-results">
        {project.results.map((result) => (
          <li key={result}>{result}</li>
        ))}
      </ul>

      <div className="portfolio-stack">
        {project.stack.map((tech) => (
          <span key={tech} className="portfolio-tag">
            {tech}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="portfolio-toggle"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`portfolio-detail-${project.id}`}
      >
        {isExpanded ? 'Réduire' : 'Voir le détail'}
        <span className="portfolio-toggle-icon" aria-hidden="true">
          {isExpanded ? '−' : '+'}
        </span>
      </button>

      {isExpanded && (
        <div
          id={`portfolio-detail-${project.id}`}
          className="portfolio-detail"
        >
          <div className="portfolio-detail-block">
            <h4>Contexte</h4>
            <p>{project.challenge}</p>
          </div>
          <div className="portfolio-detail-block">
            <h4>Approche</h4>
            <p>{project.solution}</p>
          </div>
          <p className="portfolio-client">
            <span>Client</span> {project.client}
          </p>
        </div>
      )}
    </article>
  );
};

const Portfolio = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleProject = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="portfolio">
      <div className="section-header">
        <span className="section-label" data-num="02">Portfolio</span>
        <h2>
          Des résultats concrets,
          <br />
          pas des promesses.
        </h2>
      </div>

      <div className="portfolio-grid">
        {portfolioProjects.map((project, index) => (
          <PortfolioCard
            key={project.id}
            project={project}
            index={index}
            isExpanded={expandedId === project.id}
            onToggle={() => toggleProject(project.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default Portfolio;