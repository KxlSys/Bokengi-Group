import { useEffect } from 'react';

/**
 * Composant SEO pour mettre à jour document.title et les balises meta de description
 */
const SEO = ({ title, description }) => {
  useEffect(() => {
    const baseTitle = 'Bokengi Group · Technology & Services';
    document.title = title ? `${title} · Bokengi Group` : baseTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default SEO;
