import { IMAGES } from '../utils/constants';

export const projectsData = [
  {
    id: 1,
    title: 'Villa 668',
    location: 'Dubai, UAE',
    type: 'Architecture, Landscape & Interiors',
    completionYear: '2025',
    plotArea: '668 sq. mt',
    description: 'A contemporary residential villa blending bold architectural form with lush landscape design and refined interiors. Every space is crafted to balance grandeur with comfort.',
    challenge: 'Harmonizing scale with intimacy in a massive open-plan layout while integrating landscape seamlessly with architecture.',
    solution: 'We introduced zones through furniture, lighting, and bespoke dividers, ensuring distinct functional experiences through neutral palettes and reflective surfaces.',
    technologies: [
      'High-performance frameless glass',
      'Custom marble and stone finishes',
      'Smart lighting + HVAC integration',
      '3D visualizations (pre-construction)',
      'Landscape integration with architecture'
    ],
    images: [
      IMAGES.p668_kalpeshBedroom,
      IMAGES.p668_bedroom,
      IMAGES.p668_office,
      IMAGES.p668_guestBedroom,
      IMAGES.p668_landscape2,
      IMAGES.p668_landscape3,
      IMAGES.p668_exterior1,
      IMAGES.p668_exterior2,
      IMAGES.p668_exterior3,
      IMAGES.p668_landscape1,
      IMAGES.p668_landscape2,
      IMAGES.p668_landscape3,
      IMAGES.p668_powderRoom,
      IMAGES.p668_kidsRoom
    ],
    category: 'residential',
    featured: true
  },
  {
    id: 2,
    title: 'Villa 162',
    location: 'Dubai, UAE',
    type: 'Architecture, Interior & Landscape',
    completionYear: '2025',
    plotArea: '162 sq. mt',
    description: 'An elegant villa showcasing seamless flow between exterior architecture and interior finishes. From grand foyers to intimate bedrooms, every detail reflects luxury living.',
    challenge: 'Creating a cohesive visual language that connects exterior facades with interior spaces across multiple floors.',
    solution: 'A unified material palette of natural stone, warm woods, and subtle metallic accents flows through every room, anchored by consistent lighting design.',
    technologies: [
      'Natural stone cladding',
      'Bespoke joinery and millwork',
      'Integrated ambient lighting',
      'Premium bathroom fixtures',
      'Custom furniture design'
    ],
    images: [
      IMAGES.p162_exterior1,
      IMAGES.p162_exterior2,
      IMAGES.p162_exterior3,
      IMAGES.p162_exterior4,
      IMAGES.p162_exterior5,
      IMAGES.p162_foyer,
      IMAGES.p162_living,
      IMAGES.p162_masterBedroom,
      IMAGES.p162_guestBedroom,
      IMAGES.p162_bedroom,
      IMAGES.p162_lounge
    ],
    category: 'residential',
    featured: true
  },
  {
    id: 3,
    title: 'Villa 507',
    location: 'Dubai, UAE',
    type: 'Residential — Architecture, Interior & Landscape',
    completionYear: '2025',
    plotArea: '507 sq. mt',
    description: 'A luxury residential project with comprehensive interior design spanning multiple floors — from living spaces and bedrooms to a basement spa, salon, and rooftop gym.',
    challenge: 'Designing distinct experiences for each floor while maintaining a cohesive residential identity throughout the villa.',
    solution: 'Each floor has its own character through materiality and mood, unified by a consistent design language of clean lines, warm textures, and curated lighting.',
    technologies: [
      'Spa and wellness integration',
      'Smart home automation',
      'Custom kitchen cabinetry',
      'High-end flooring systems',
      'Rooftop structural engineering'
    ],
    images: [
      IMAGES.p507_living,
      IMAGES.p507_kitchen1,
      IMAGES.p507_kitchen2,
      IMAGES.p507_office,
      IMAGES.p507_dayBedroom,
      IMAGES.p507_guestBedroom1,
      IMAGES.p507_guestBedroom2,
      IMAGES.p507_kalpeshBedroom1,
      IMAGES.p507_kalpeshBedroom2,
      IMAGES.p507_salon,
      IMAGES.p507_spa,
      IMAGES.p507_gym,
      IMAGES.p507_roofToilet
    ],
    category: 'residential',
    featured: true
  }
];

export const communitiesData = [
  {
    id: 2,
    name: 'PALM JUMEIRAH',
    logo: IMAGES.palmJumeirah
  },
  {
    id: 3,
    name: 'DUBAI HILLS ESTATE',
    logo: IMAGES.propertyLogo
  },
  {
    id: 4,
    name: 'JUMEIRAH ISLANDS', 
    logo: IMAGES.tilalLogo
  },
  {
    id: 5,
    name: 'SOBHA HARTLAND',
    logo: IMAGES.original
  },
  {
    id: 7,
    name: 'SOULE STUDIO',
    logo: IMAGES.logo
  }
];

export const servicesData = [
  {
    id: 1,
    title: 'Architectural Design',
    description: 'We create innovative architectural solutions that blend functionality with aesthetic excellence, designing structures that stand the test of time.',
    applications: 'Residential villas, commercial buildings, urban planning.'
  },
  {
    id: 2,
    title: 'Interior Design',
    description: 'From bespoke layouts to handpicked finishes, we curate interiors that speak to our clients\' taste, lifestyle, and legacy. Every detail, from furniture to lighting, is chosen with purpose.',
    applications: 'Turnkey villas, concept homes, investment properties.'
  },
  {
    id: 3,
    title: 'Landscape Design',
    description: 'We integrate nature into architecture—designing gardens, courtyards, terraces, and outdoor features that amplify the experience of space.',
    applications: 'Pool areas, driveways, open-air lounges, villa gardens.'
  },
  {
    id: 4,
    title: 'High-End Project Execution',
    description: 'We translate approved designs into reality with a network of master craftsmen, site specialists, and project managers, ensuring quality and control at every stage of build and fit-out.',
    applications: 'Villa renovations, new constructions, luxury detailing.'
  }
];

export const teamData = [
  {
    id: 1,
    name: 'Sonali Potdar',
    role: 'FOUNDER & CEO',
    phone: '+971502702108',
    image: IMAGES.sonaliPotdar
  },
  {
    id: 2,
    name: 'Siddhesh Mule',
    role: 'MANAGING DIRECTOR',
    phone: '+971504452108',
    image: IMAGES.siddheshMule
  }
];

export const coreValues = [
  {
    title: 'Clarity through Design',
    description: 'Every space starts with intention and ends with harmony.'
  },
  {
    title: 'Innovative Visualisation',
    description: 'We help clients see their space before it\'s built.'
  },
  {
    title: 'Client-Centered Vision',
    description: 'We build relationships, not just residences.'
  },
  {
    title: 'Craft with Integrity',
    description: 'No shortcuts. No compromises.'
  },
  {
    title: 'Elegance in Execution',
    description: 'From drawings to delivery, detail is everything.'
  }
];
