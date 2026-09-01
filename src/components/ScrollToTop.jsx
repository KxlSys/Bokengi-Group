import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Replace le défilement en haut de page à chaque changement de route
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
