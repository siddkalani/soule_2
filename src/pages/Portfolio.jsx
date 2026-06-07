import { Link } from 'react-router-dom';
import { projectsData } from '../data/content';
import ContactForm from '../components/sections/ContactForm';
import Communities from '../components/sections/Communities';
import FlashlightImage from '../components/common/FlashlightImage';
import './Portfolio.css';

const Portfolio = () => {
  const allProjects = projectsData.map(project => ({
    id: project.id,
    title: project.title,
    type: project.type,
    image: project.images[0],
    category: project.category
  }));
  
  return (
    <div className="portfolio-page">
      {/* Projects Grid */}
      <section className="portfolio-grid">
        {allProjects.map((project, index) => (
          <Link 
            key={index} 
            to={`/project/${project.id}`} 
            className="portfolio-item"
          >
            <FlashlightImage src={project.image} alt={project.title} />
            <div className="portfolio-overlay">
              <h3>{project.title.toUpperCase()}</h3>
              <p className="portfolio-item-type">{project.type}</p>
            </div>
          </Link>
        ))}
      </section>
      
      <Communities />
      
      <ContactForm />
    </div>
  );
};

export default Portfolio;
