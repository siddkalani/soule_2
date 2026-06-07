import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsData } from '../../data/content';
import './ProjectsOverlay.css';

const ProjectsOverlay = ({ isOpen, onClose, isDarkTheme }) => {
  useEffect(() => {
    if (isOpen) {
      // Disable body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when overlay is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    // Close when clicking on the overlay background (not the content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`projects-overlay ${isOpen ? 'overlay-open' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>
          <span></span>
          <span></span>
        </button>
        
        <div className="overlay-menu">
          <div className="menu-section">
            <h2>PROJECTS</h2>
            <div className="menu-links">
              {projectsData.map((project, index) => (
                <Link key={project.id} to={`/project/${project.id}`} onClick={onClose}>
                  <span className="link-number">{String(index + 1).padStart(2, '0')}</span>
                  <div className="link-content">
                    <span className="link-title">{project.title.toUpperCase()}</span>
                    <span className="link-desc">{project.type}</span>
                  </div>
                </Link>
              ))}
              <Link to="/portfolio" onClick={onClose}>
                <span className="link-number">{String(projectsData.length + 1).padStart(2, '0')}</span>
                <div className="link-content">
                  <span className="link-title">VIEW ALL PROJECTS</span>
                  <span className="link-desc">Complete portfolio showcase</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="overlay-footer">
          <p>Crafting luxury spaces with soul and precision</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsOverlay;