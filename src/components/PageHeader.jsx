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
    <header style={{ paddingTop: '140px', paddingBottom: '70px', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container-v4">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Fil d'Ariane" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-faint)', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ color: 'var(--ink-muted)' }}>Accueil</Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ opacity: 0.4 }}>/</span>
                {crumb.to ? <Link to={crumb.to} style={{ color: 'var(--ink-muted)' }}>{crumb.label}</Link> : <span style={{ color: 'var(--blue-cyan)', fontWeight: 600 }}>{crumb.label}</span>}
              </span>
            ))}
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span className="kicker-v4" style={{ marginBottom: 0 }}>{eyebrow}</span>
          {badge && (
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.72rem', 
              background: 'var(--blue-subtle)', 
              color: 'var(--blue-cyan)', 
              padding: '0.2rem 0.65rem', 
              borderRadius: 'var(--radius-xs)', 
              fontWeight: 600,
              border: '1px solid var(--border-subtle)'
            }}>
              {badge}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, marginBottom: '1.25rem' }}>{title}</h1>

        {subtitle && <p style={{ fontSize: '1.2rem', color: 'var(--ink-muted)', maxWidth: '780px', lineHeight: 1.65 }}>{subtitle}</p>}
      </div>
    </header>
  );
};

export default PageHeader;
