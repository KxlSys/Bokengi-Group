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
    <header className="page-header">
      <div className="page-header-container">
        {breadcrumbs.length > 0 && (
          <nav className="breadcrumbs" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx}>
                <span className="crumb-sep">/</span>
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span className="crumb-active">{crumb.label}</span>}
              </span>
            ))}
          </nav>
        )}

        <div className="page-header-eyebrow">
          <span>{eyebrow}</span>
          {badge && <span className="page-header-badge">{badge}</span>}
        </div>

        <h1 className="page-header-title">{title}</h1>

        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
};

export default PageHeader;
