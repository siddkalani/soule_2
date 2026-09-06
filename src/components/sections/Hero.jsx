import { useState, useEffect, useCallback, useRef } from 'react';
import './Hero.css';
import Button from '../common/Button';
import ResponsiveImage from '../common/ResponsiveImage';

const Hero = ({ title, subtitle, backgroundImage, communityName = '', slideImages = [] }) => {
  const [imageLoadError, setImageLoadError] = useState(false);
  const heroRef = useRef(null);
  
  // Use only the first image as the hero background
  const baseImage = (slideImages && slideImages.length > 0 ? slideImages[0] : backgroundImage) || '';

  // Handle image load errors
  const handleImageError = useCallback(() => {
    setImageLoadError(true);
  }, []);

  // Flashlight effect (desktop only)
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // Check if device is mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 
                     window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    
    if (isMobile) return; // Don't add flashlight on mobile

    let rafId = null;
    let rect = null;
    let point = null;
    const invalidate = () => { rect = null; };

    // Batched into one frame and with the rect cached, so moving the cursor
    // across the hero no longer forces a layout flush per event.
    const handleMouseMove = (e) => {
      point = { x: e.clientX, y: e.clientY };
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!point) return;
        rect ??= hero.getBoundingClientRect();
        hero.style.setProperty('--mouse-x', `${point.x - rect.left}px`);
        hero.style.setProperty('--mouse-y', `${point.y - rect.top}px`);
      });
    };

    hero.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate, { passive: true });

    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);



  // Don't render if no image available
  if (!baseImage && !imageLoadError) {
    return (
      <section className="hero" style={{ backgroundColor: '#333' }}>
        <div className="hero-content">
          <h1>{title}</h1>
          {subtitle && <h2>{subtitle}</h2>}
          <Button variant="primary">DISCOVER NOW</Button>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={heroRef}
      className="hero"
      style={
        imageLoadError
          ? { backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
          : undefined
      }
    >
      {/* A real <img> rather than a CSS background: background-image cannot use
          srcset, so every device was downloading the same full-size render for
          what is the largest element on the page. This is the LCP image. */}
      {!imageLoadError && baseImage && (
        <ResponsiveImage
          src={baseImage}
          alt=""
          aria-hidden="true"
          sizes="100vw"
          priority
          className="hero-bg-image"
          onError={handleImageError}
        />
      )}
      <div className="hero-scrim" aria-hidden="true" />
      {communityName && (
        <div className="hero-community-name">
          {communityName}
        </div>
      )}
      <div className="hero-content">
        <h1>{title}</h1>
        {subtitle && <h2>{subtitle}</h2>}
        <Button 
          variant="primary" 
          onClick={() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              contactSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
              });
            }
          }}
        >
          DISCOVER NOW
        </Button>
      </div>
    </section>
  );
};

export default Hero;
