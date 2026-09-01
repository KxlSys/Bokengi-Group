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

      <section className="projects-section" style={{ padding: '6.5rem 0' }}>
        <div className="container-v2">
          {/* Filters */}
          <div className="portfolio-filters-bar" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>
              Filtrer par pôle / domaine :
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} role="tablist">
              {filters.map((f) => (
                <button
                  key={f.id}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    background: activeFilter === f.id ? 'var(--navy-primary)' : 'var(--bg-surface)',
                    color: activeFilter === f.id ? '#FFFFFF' : 'var(--ink-muted)',
                    border: `1px solid ${activeFilter === f.id ? 'var(--navy-primary)' : 'var(--border-medium)'}`,
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem' }}>
            {filteredProjects.map((project) => (
              <article key={project.id} className="project-flagship-card" style={{ padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span className="project-flagship-badge">{project.category}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-faint)' }}>{project.year}</span>
                </div>

                <h2 className="title-subsection" style={{ fontSize: '1.55rem', marginBottom: '0.65rem' }}>{project.title}</h2>
                
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-muted)', marginBottom: '1.25rem' }}>
                  <strong style={{ color: 'var(--ink-heading)' }}>Contexte :</strong> {project.client}
                </p>

                <p style={{ fontSize: '1rem', color: 'var(--ink-body)', lineHeight: 1.65, marginBottom: '2rem', flex: 1 }}>{project.summary}</p>

                <div style={{ background: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--blue-accent)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Défi initial</span>
                    <p style={{ fontSize: '0.88rem', color: 'var(--ink-muted)', lineHeight: 1.55 }}>{project.challenge}</p>
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--blue-accent)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Solution déployée</span>
                    <p style={{ fontSize: '0.88rem', color: 'var(--ink-muted)', lineHeight: 1.55 }}>{project.solution}</p>
                  </div>
                </div>

                {project.results && project.results.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--ink-heading)', fontWeight: 600, display: 'block', marginBottom: '0.6rem' }}>
                      Résultats vérifiés :
                    </span>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {project.results.map((r, i) => (
                        <li key={i} style={{ fontSize: '0.88rem', color: 'var(--ink-muted)', display: 'flex', gap: '0.5rem' }}>
                          <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {project.stack.map((tech) => (
                      <span key={tech} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', background: 'var(--bg-main)', color: 'var(--ink-body)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                        {tech}
                      </span>
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
