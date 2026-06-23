import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Hero from '../components/sections/Hero';
import ProjectShowcase from '../components/sections/ProjectShowcase';
import ContactForm from '../components/sections/ContactForm';
import Communities from '../components/sections/Communities';
import Button from '../components/common/Button';
import ProjectCard from '../components/common/ProjectCard';
import { projectsData } from '../data/content';
import { IMAGES } from '../utils/constants';
import './Home.css';

const Home = () => {
  const featuredProject = projectsData[0];
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Handle scroll to contact section on page load
  useEffect(() => {
    const { hash } = window.location;
    if (hash === '#contact') {
      // Small delay to ensure the page has loaded
      setTimeout(() => {
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
          contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, []);
  
  // Define images for each category
  const categoryImages = {
    ARCHITECTURAL: IMAGES.p162_exterior1,
    INTERIOR: IMAGES.kalpesh5,
    LANDSCAPE: IMAGES.p162_exterior3
  };
  
  // Framer Motion variants for animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };



  return (
    <div className="home-page">
      <Hero 
        title="Design with Soul"
        subtitle="Built with Precision"
        backgroundImage={IMAGES.bedroom4}
        communityName=""
        slideImages={[IMAGES.bedroom4]}
      />

      
      {/* About Soule Section */}
      <motion.section 
        className="about-soule"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="about-content">
          <div className="about-header">
            <h2>Soule</h2>
          </div>
          <div className="about-body">
            <div className="about-text-columns">
              <p>Soule Studio is a luxury interior, architecture, and landscape design firm based in the UAE, specializing in high-end residential villas for visionary homeowners,</p>
              <p>developers, and industry leaders. We bring concepts to life with architectural precision, cutting-edge visualisation, and refined materiality.</p>
            </div>
            <div className="about-button">
              <Button variant="dark" to="/about">KNOW MORE</Button>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Three Card Section */}
      <section 
        className="three-cards-section"
        style={{
          backgroundImage: hoveredCategory 
            ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${categoryImages[hoveredCategory]})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.6s ease-in-out'
        }}
      >
        <ProjectCard 
          image={categoryImages.ARCHITECTURAL}
          category="ARCHITECTURAL"
          logo={IMAGES.souleLogo}
          link="/portfolio"
          onMouseEnter={() => setHoveredCategory('ARCHITECTURAL')}
          onMouseLeave={() => setHoveredCategory(null)}
          isHovered={hoveredCategory === 'ARCHITECTURAL'}
        />
        <ProjectCard 
          image={categoryImages.INTERIOR}
          category="INTERIOR"
          logo={IMAGES.souleLogo}
          link="/portfolio"
          onMouseEnter={() => setHoveredCategory('INTERIOR')}
          onMouseLeave={() => setHoveredCategory(null)}
          isHovered={hoveredCategory === 'INTERIOR'}
        />
        <ProjectCard 
          image={categoryImages.LANDSCAPE}
          category="LANDSCAPE"
          logo={IMAGES.souleLogo}
          link="/portfolio"
          onMouseEnter={() => setHoveredCategory('LANDSCAPE')}
          onMouseLeave={() => setHoveredCategory(null)}
          isHovered={hoveredCategory === 'LANDSCAPE'}
        />
      </section>
      
      {/* Project Showcase - Summer House */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <ProjectShowcase 
          title={projectsData[0].title}
          description={projectsData[0].description}
          image={projectsData[0].images[0]}
          dark={true}
          link="/project/1"
        />
      </motion.div>
      
      {/* Project Showcase - The Ultima */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <ProjectShowcase 
          title={projectsData[1].title}
          description={projectsData[1].description}
          image={projectsData[1].images[0]}
          dark={true}
          reverse={true}
          link="/project/2"
        />
      </motion.div>

      {/* Project Showcase - Mansion 27 */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <ProjectShowcase 
          title={projectsData[2].title}
          description={projectsData[2].description}
          image={projectsData[2].images[0]}
          dark={true}
          link="/project/3"
        />
      </motion.div>
      
      {/* Communities Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <Communities />
      </motion.div>
      
      <ContactForm />
    </div>
  );
};

export default Home;
