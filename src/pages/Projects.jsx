import React, { useState, useMemo } from 'react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import { portfolioProjects } from '../data/portfolio';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'it', label: 'IT' },
    { id: 'digital', label: 'Digital' },
    { id: 'security', label: 'Cybersécurité' },
    { id: 'infra', label: 'Infrastructure' },
    { id: 'business', label: 'Business' },
    { id: 'events', label: 'Events' },
  ];

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return portfolioProjects;

    return portfolioProjects.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      const stack = (p.stack || []).join(' ').toLowerCase();

      if (activeFilter === 'it') return cat.includes('it') || cat.includes('stack') || cat.includes('devops');
      if (activeFilter === 'digital') return cat.includes('full-stack') || stack.includes('react') || stack.includes('tailwind');
      if (activeFilter === 'security') return cat.includes('cybersécurité') || stack.includes('chiffr') || cat.includes('security');
      if (activeFilter === 'infra') return cat.includes('devops') || cat.includes('systèmes') || stack.includes('redis');
      if (activeFilter === 'business') return cat.includes('business') || cat.includes('métier');
      if (activeFilter === 'events') return cat.includes('events') || cat.includes('événement');
      return true;
    });
  }, [activeFilter]);

  return (
    <div className="page-projects">
      <SEO 
        title="Nos réalisations" 
        description="Découvrez les réalisations, architectures et plateformes développées par Bokengi Group pour ses clients et projets fondateurs." 
      />

      <PageHeader
        eyebrow="Portfolio & Études de cas"
        title="Nos réalisations"
        subtitle="Découvrez des projets concrets, architectures déployées et plateformes opérationnelles conçues avec rigueur."
        breadcrumbs={[{ label: 'Réalisations' }]}
      />

      <section className="projects-section">
        <div className="container">
          {/* Filters */}
          <div className="portfolio-filters-bar">
            <span className="filters-label">Filtrer par domaine :</span>
            <div className="filters-list" role="tablist">
              {filters.map((f) => (
                <button
                  key={f.id}
                  className={ilter-btn }
                  onClick={() => setActiveFilter(f.id)}
                  role="tab"
                  aria-selected={activeFilter === f.id}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="projects-cards-grid">
            {filteredProjects.map((project) => (
              <article key={project.id} className="project-item-card">
                <div className="project-item-header">
                  <span className="project-item-badge">{project.category}</span>
                  <span className="project-item-year">{project.year}</span>
                </div>

                <h2 className="project-item-title">{project.title}</h2>
                
                <p className="project-item-client">
                  <strong>Contexte :</strong> {project.client}
                </p>

                <p className="project-item-summary">{project.summary}</p>

                <div className="project-item-highlights">
                  <div className="highlight-block">
                    <span className="highlight-label">Défi initial</span>
                    <p className="highlight-text">{project.challenge}</p>
                  </div>
                  <div className="highlight-block">
                    <span className="highlight-label">Solution déployée</span>
                    <p className="highlight-text">{project.solution}</p>
                  </div>
                </div>

                {project.results && project.results.length > 0 && (
                  <div className="project-item-results">
                    <span className="results-label">Résultats vérifiés :</span>
                    <ul className="results-list">
                      {project.results.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="project-item-footer">
                  <div className="project-stack-tags">
                    {project.stack.map((tech) => (
                      <span key={tech} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="empty-projects-notice">
              <p>Aucune réalisation ne correspond à ce filtre pour le moment.</p>
              <button onClick={() => setActiveFilter('all')} className="btn-ghost">
                Afficher toutes les réalisations
              </button>
            </div>
          )}
        </div>
      </section>

      <CTASection 
        title="Vous avez un projet similaire ?"
        text="Bénéficiez de notre retour d'expérience et d'une ingénierie éprouvée sur le terrain."
        primaryLabel="Demander un devis"
        secondaryLabel="Nous contacter"
      />
    </div>
  );
};

export default Projects;
