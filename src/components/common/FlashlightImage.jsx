import { useEffect, useRef } from 'react';
import ResponsiveImage from './ResponsiveImage';
import './FlashlightImage.css';

/**
 * FlashlightImage - A reusable component that wraps images with a flashlight reveal effect
 * Like hilight.design - shows full brightness image with dark overlay that reveals via cursor
 */
const FlashlightImage = ({
  src,
  alt = '',
  className = '',
  style = {},
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  ...props
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Touch devices never show the effect (see the CSS media queries), so there
    // is no reason to attach the listener or run layout work for them.
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    let rafId = null;
    let rect = null;
    let point = null;

    // getBoundingClientRect() forces a layout flush. Reading it on every
    // mousemove, across every card on the page, is the single biggest source of
    // scroll/hover jank here. Cache it and invalidate only when it can change.
    const invalidate = () => {
      rect = null;
    };

    const handleMouseMove = (e) => {
      point = { x: e.clientX, y: e.clientY };
      if (rafId) return; // a frame is already scheduled
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!point) return;
        rect ??= container.getBoundingClientRect();
        container.style.setProperty('--mouse-x', `${point.x - rect.left}px`);
        container.style.setProperty('--mouse-y', `${point.y - rect.top}px`);
      });
    };

    container.addEventListener('mouseenter', invalidate, { passive: true });
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate, { passive: true });

    return () => {
      container.removeEventListener('mouseenter', invalidate);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`flashlight-image-container ${className}`}
      style={style}
    >
      {/* Full brightness base image */}
      <ResponsiveImage
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className="flashlight-image-base"
        {...props}
      />
      {/* Dark overlay with flashlight cutout */}
      <div className="flashlight-image-reveal"></div>
    </div>
  );
};

export default FlashlightImage;
