import { useEffect, useRef } from 'react';
import './ImageSpotlight.css';

/**
 * Tracks the cursor and exposes --mouse-x / --mouse-y on each .spotlight-image
 * inside the container.
 *
 * The previous implementation called querySelectorAll + getBoundingClientRect
 * for every image on every single mousemove event. With a gallery of 50+ images
 * that is 50 forced layout flushes per event, at up to ~120 events/second —
 * enough to drop frames on its own, before any image had even decoded.
 *
 * Now: the element list and their rects are measured once, reused across
 * moves, and invalidated only on scroll/resize/DOM change. Writes are batched
 * into a single animation frame.
 */
const ImageSpotlight = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    let rafId = null;
    let point = null;
    let cache = null; // [{ el, rect }]

    const invalidate = () => {
      cache = null;
    };

    const measure = () => {
      const els = container.querySelectorAll('.spotlight-image');
      return Array.from(els, (el) => ({ el, rect: el.getBoundingClientRect() }));
    };

    const handleMouseMove = (e) => {
      point = { x: e.clientX, y: e.clientY };
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!point) return;
        cache ??= measure();
        for (const { el, rect } of cache) {
          // Skip anything scrolled out of view — its custom properties cannot
          // be seen, so updating them is wasted style recalculation.
          if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
          el.style.setProperty('--mouse-x', `${point.x - rect.left}px`);
          el.style.setProperty('--mouse-y', `${point.y - rect.top}px`);
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate, { passive: true });

    // Images arriving lazily change the layout, so re-measure when they do.
    const observer = new MutationObserver(invalidate);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className="spotlight-container">
      {children}
    </div>
  );
};

export default ImageSpotlight;
