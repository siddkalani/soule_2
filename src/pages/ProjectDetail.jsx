import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsData } from '../data/content';
import ContactForm from '../components/sections/ContactForm';
import Communities from '../components/sections/Communities';
import FlashlightImage from '../components/common/FlashlightImage';
import './ProjectDetail.css';

/**
 * Row layout tokens used in project.layouts[]:
 *   'left'  -> large image on left  + 2 stacked on right       (3 images)
 *   'right' -> 2 stacked on left    + large image on right     (3 images)
 *   'half'  -> 2 images side-by-side, equal width              (2 images)
 *   'full'  -> single image, full row width                    (1 image)
 *
 * If project.layouts is absent, we fall back to alternating left/right rows
 * of 3 with an auto --half / --full for any short tail.
 */
const SLOTS_PER_LAYOUT = { left: 3, right: 3, half: 2, full: 1 };

function buildRows(images, layouts) {
  // images[0] is the hero (rendered separately in the enhanced-project-hero
  // section). Grid rows consume images[1..].
  const grid = images.slice(1);
  const rows = [];

  if (layouts && layouts.length) {
    let cursor = 0;
    for (const layout of layouts) {
      const need = SLOTS_PER_LAYOUT[layout] ?? 3;
      const slice = grid.slice(cursor, cursor + need);
      if (slice.length === 0) break;
      // Degrade gracefully if tail is short.
      let effective = layout;
      if (slice.length < need) {
        if (slice.length === 2) effective = 'half';
        else if (slice.length === 1) effective = 'full';
      }
      rows.push({ layout: effective, images: slice, startIdx: cursor + 1 });
      cursor += slice.length;
    }
    // Any leftover images we didn't allocate get appended as best-fit tail rows.
    while (cursor < grid.length) {
      const remaining = grid.length - cursor;
      const take = Math.min(3, remaining);
      const slice = grid.slice(cursor, cursor + take);
      const layout = take === 1 ? 'full' : take === 2 ? 'half' : (rows.length % 2 === 0 ? 'left' : 'right');
      rows.push({ layout, images: slice, startIdx: cursor + 1 });
      cursor += take;
    }
  } else {
    // Legacy auto-alternating behaviour.
    for (let cursor = 0, rowIdx = 0; cursor < grid.length; rowIdx++) {
      const remaining = grid.length - cursor;
      const take = Math.min(3, remaining);
      const slice = grid.slice(cursor, cursor + take);
      const layout = take === 1 ? 'full' : take === 2 ? 'half' : (rowIdx % 2 === 0 ? 'left' : 'right');
      rows.push({ layout, images: slice, startIdx: cursor + 1 });
      cursor += take;
    }
  }
  return rows;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectsData.find(p => p.id === parseInt(id)) || projectsData[0];
  const currentIndex = projectsData.findIndex(p => p.id === parseInt(id));
  const prevProject = currentIndex > 0 ? projectsData[currentIndex - 1] : null;
  const nextProject = currentIndex < projectsData.length - 1 ? projectsData[currentIndex + 1] : null;
  const rows = buildRows(project.images, project.layouts);

  // Per-image object-position map (optional). Lets project data steer the crop
  // for portrait shots so the subject stays visible.
  const focusMap = project.focus || {};
  const focusFor = (idx) => focusMap[idx];

  // Per-image object-fit override. Use 'contain' to "zoom out" a specific image
  // so it shows in full inside its cell instead of being cropped by 'cover'.
  const fitMap = project.fit || {};
  const fitFor = (idx) => fitMap[idx];

  // Per-image horizontal flip. Some 3D renders in the PDF are mirrored versions
  // of the source webp files; those indices are listed in project.flip so we
  // apply CSS transform: scaleX(-1) at render time (source assets stay untouched).
  const flipSet = new Set(project.flip || []);
  const flipFor = (idx) => flipSet.has(idx);

  const styleFor = (idx) => {
    const s = {};
    const fp = focusFor(idx);
    const ff = fitFor(idx);
    if (fp) s.objectPosition = fp;
    if (ff) s.objectFit = ff;
    if (flipFor(idx)) s.transform = 'scaleX(-1)';
    return Object.keys(s).length ? s : undefined;
  };

  // Lightbox state: index into project.images, or null when closed.
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const touchStartX = useRef(null);

  const openAt = (idx) => setLightboxIndex(idx);
  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => {
    setLightboxIndex(i => (i == null ? i : (i - 1 + project.images.length) % project.images.length));
  }, [project.images.length]);
  const next = useCallback(() => {
    setLightboxIndex(i => (i == null ? i : (i + 1) % project.images.length));
  }, [project.images.length]);

  // Keyboard navigation + prevent body scroll while lightbox is open.
  useEffect(() => {
    if (lightboxIndex == null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, close, prev, next]);

  // Touch-swipe navigation.
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta > 50) prev();
    else if (delta < -50) next();
  };

  return (
    <div className="project-detail-page">
      {/* Enhanced Hero Section */}
      <section className="enhanced-project-hero">
        <div
          className={`hero-background${flipFor(0) ? ' hero-background--flipped' : ''}`}
        >
          <FlashlightImage src={project.images[0]} alt={project.title} />
        </div>
        <div className="hero-overlay">
          <div className="hero-content-wrapper">
            <div className="project-title-section">
              <h1 className="project-main-title">{project.title}</h1>
            </div>

            {/* Project Details Grid */}
            <div className="project-specs-grid">
              <div className="spec-row">
                <span className="spec-label">LOCATION:</span>
                <span className="spec-value">{project.location}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">PROJECT TYPE:</span>
                <span className="spec-value">{project.type}</span>
              </div>
              {project.area && (
                <div className="spec-row">
                  <span className="spec-label">AREA:</span>
                  <span className="spec-value">{project.area}</span>
                </div>
              )}
              {project.comingSoon && (
                <div className="spec-row">
                  <span className="spec-value">Coming Soon</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Gallery - PDF Grid Layout */}
      <section className="project-gallery-section">
        <div className="gallery-container">
          {rows.map((row, rowIdx) => {
            const { layout, images, startIdx } = row;

            if (layout === 'full') {
              const abs = startIdx;
              const style = styleFor(abs);
              return (
                <div key={rowIdx} className="gallery-row gallery-row--full">
                  <div className="gallery-row__full-img" onClick={() => openAt(abs)}>
                    <img src={images[0]} alt={`${project.title} ${abs}`} loading="lazy" style={style} />
                  </div>
                </div>
              );
            }

            if (layout === 'half') {
              return (
                <div key={rowIdx} className="gallery-row gallery-row--half">
                  {images.map((src, i) => {
                    const abs = startIdx + i;
                    const style = styleFor(abs);
                    return (
                      <div key={i} className="gallery-row__half-img" onClick={() => openAt(abs)}>
                        <img src={src} alt={`${project.title} ${abs}`} loading="lazy" style={style} />
                      </div>
                    );
                  })}
                </div>
              );
            }

            // 'left' or 'right' -- 1 large + 2 stacked
            const rowClass = layout === 'right' ? 'gallery-row gallery-row--right' : 'gallery-row gallery-row--left';
            const [largeSrc, topSrc, botSrc] = images;
            const styleLarge = styleFor(startIdx);
            const styleTop = styleFor(startIdx + 1);
            const styleBot = styleFor(startIdx + 2);
            return (
              <div key={rowIdx} className={rowClass}>
                {largeSrc && (
                  <div className="gallery-row__large" onClick={() => openAt(startIdx)}>
                    <img src={largeSrc} alt={`${project.title} ${startIdx}`} loading="lazy" style={styleLarge} />
                  </div>
                )}
                {(topSrc || botSrc) && (
                  <div className="gallery-row__stack">
                    {topSrc && (
                      <div className="gallery-row__small" onClick={() => openAt(startIdx + 1)}>
                        <img src={topSrc} alt={`${project.title} ${startIdx + 1}`} loading="lazy" style={styleTop} />
                      </div>
                    )}
                    {botSrc && (
                      <div className="gallery-row__small" onClick={() => openAt(startIdx + 2)}>
                        <img src={botSrc} alt={`${project.title} ${startIdx + 2}`} loading="lazy" style={styleBot} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox with prev/next navigation */}
      {lightboxIndex != null && (
        <div
          className="lightbox-overlay"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            className="lightbox-close"
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="Close"
          >✕</button>

          <button
            className="lightbox-nav lightbox-nav--prev"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <img
            src={project.images[lightboxIndex]}
            alt={`${project.title} ${lightboxIndex + 1}`}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
            style={flipFor(lightboxIndex) ? { transform: 'scaleX(-1)' } : undefined}
          />

          <button
            className="lightbox-nav lightbox-nav--next"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="lightbox-counter" onClick={(e) => e.stopPropagation()}>
            {lightboxIndex + 1} / {project.images.length}
          </div>
        </div>
      )}

      {/* Project Navigation - Prev/Next */}
      <section className="project-navigation">
        <div className="project-nav-container">
          {prevProject ? (
            <Link to={`/project/${prevProject.id}`} className="project-nav-link project-nav-prev">
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="project-nav-text">
                <span className="project-nav-label">Previous Project</span>
                <span className="project-nav-title">{prevProject.title}</span>
              </div>
            </Link>
          ) : <div className="project-nav-spacer" />}

          {nextProject ? (
            <Link to={`/project/${nextProject.id}`} className="project-nav-link project-nav-next">
              <div className="project-nav-text">
                <span className="project-nav-label">Next Project</span>
                <span className="project-nav-title">{nextProject.title}</span>
              </div>
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : <div className="project-nav-spacer" />}
        </div>
      </section>

      <Communities />

      <ContactForm />
    </div>
  );
};

export default ProjectDetail;
