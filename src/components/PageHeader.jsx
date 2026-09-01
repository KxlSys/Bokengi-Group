import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ 
  eyebrow = 'Bokengi Group', 
  title, 
  subtitle, 
  badge,
  breadcrumbs = []
}) => {
  return (
    <header className="page-header-v2">
      <div className="container-v2">
        {breadcrumbs.length > 0 && (
          <nav className="breadcrumbs-v2" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ opacity: 0.5 }}>/</span>
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span style={{ color: 'var(--blue-accent)', fontWeight: 600 }}>{crumb.label}</span>}
              </span>
            ))}
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
          <span className="kicker-v2" style={{ marginBottom: 0 }}>{eyebrow}</span>
          {badge && (
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.72rem', 
              background: 'var(--blue-subtle)', 
              color: 'var(--blue-accent)', 
              padding: '0.25rem 0.65rem', 
              borderRadius: '999px', 
              fontWeight: 600 
            }}>
              {badge}
            </span>
          )}
        </div>

        <h1 className="title-section page-header-title-v2">{title}</h1>

        {subtitle && <p className="page-header-lead-v2">{subtitle}</p>}
      </div>
    </header>
  );
};

export default PageHeader;
