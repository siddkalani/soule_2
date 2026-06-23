import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { projectsData } from '../data/content';
import ContactForm from '../components/sections/ContactForm';
import Communities from '../components/sections/Communities';
import FlashlightImage from '../components/common/FlashlightImage';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projectsData.find(p => p.id === parseInt(id)) || projectsData[0];
  const [lightboxImage, setLightboxImage] = useState(null);
  
  return (
    <div className="project-detail-page">
      {/* Enhanced Hero Section */}
      <section className="enhanced-project-hero">
        <div className="hero-background">
          <FlashlightImage src={project.images[0]} alt={project.title} />
        </div>
        <div className="hero-overlay">
          <div className="hero-content-wrapper">
            <div className="project-title-section">
              <h1 className="project-main-title">{project.title}</h1>
              <p className="project-subtitle">{project.description}</p>
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
              <div className="spec-row">
                <span className="spec-label">COMPLETION YEAR:</span>
                <span className="spec-value">{project.completionYear}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">PLOT AREA:</span>
                <span className="spec-value">{project.plotArea}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Project Gallery - PDF Grid Layout */}
      <section className="project-gallery-section">
        <div className="gallery-container">
          {/* Group images into rows of 3: 1 large + 2 stacked */}
          {Array.from({ length: Math.ceil((project.images.length - 1) / 3) }, (_, rowIdx) => {
            const startIdx = 1 + rowIdx * 3;
            const rowImages = project.images.slice(startIdx, startIdx + 3);
            const isEvenRow = rowIdx % 2 === 0;
            const isLastRow = startIdx + 3 >= project.images.length;
            const isIncompleteRow = rowImages.length < 3;
            
            // If last row has only 1 image, make it full width
            if (isIncompleteRow && rowImages.length === 1) {
              return (
                <div key={rowIdx} className="gallery-row gallery-row--full">
                  <div className="gallery-row__full-img" onClick={() => setLightboxImage(rowImages[0])}>
                    <img src={rowImages[0]} alt={`${project.title} ${startIdx}`} loading="lazy" />
                  </div>
                </div>
              );
            }
            
            // If last row has 2 images, show side by side
            if (isIncompleteRow && rowImages.length === 2) {
              return (
                <div key={rowIdx} className="gallery-row gallery-row--half">
                  <div className="gallery-row__half-img" onClick={() => setLightboxImage(rowImages[0])}>
                    <img src={rowImages[0]} alt={`${project.title} ${startIdx}`} loading="lazy" />
                  </div>
                  <div className="gallery-row__half-img" onClick={() => setLightboxImage(rowImages[1])}>
                    <img src={rowImages[1]} alt={`${project.title} ${startIdx + 1}`} loading="lazy" />
                  </div>
                </div>
              );
            }
            
            return (
              <div key={rowIdx} className={`gallery-row ${isEvenRow ? 'gallery-row--left' : 'gallery-row--right'}`}>
                {rowImages[0] && (
                  <div className="gallery-row__large" onClick={() => setLightboxImage(rowImages[0])}>
                    <img src={rowImages[0]} alt={`${project.title} ${startIdx}`} loading="lazy" />
                  </div>
                )}
                {rowImages.length > 1 && (
                  <div className="gallery-row__stack">
                    {rowImages[1] && (
                      <div className="gallery-row__small" onClick={() => setLightboxImage(rowImages[1])}>
                        <img src={rowImages[1]} alt={`${project.title} ${startIdx + 1}`} loading="lazy" />
                      </div>
                    )}
                    {rowImages[2] && (
                      <div className="gallery-row__small" onClick={() => setLightboxImage(rowImages[2])}>
                        <img src={rowImages[2]} alt={`${project.title} ${startIdx + 2}`} loading="lazy" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImage(null)}>✕</button>
          <img src={lightboxImage} alt="Zoomed view" className="lightbox-image" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      
      <Communities />
      
      <ContactForm />
    </div>
  );
};

export default ProjectDetail;
