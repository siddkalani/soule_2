import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * On route change:
 *  - If the URL has a #hash, scroll to that element (once it exists in the DOM)
 *  - Otherwise reset to the top of the page
 * The hash lookup is retried briefly so it survives the mount timing of the
 * target section rendering.
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          const navbarOffset = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
          window.scrollTo({ top, left: 0, behavior: 'smooth' });
          return;
        }
        if (attempts++ < 20) {
          setTimeout(tryScroll, 50);
        }
      };
      tryScroll();
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
