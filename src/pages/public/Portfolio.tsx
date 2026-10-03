import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import PortfolioCarousel, { type Project } from '../../components/PortfolioCarousel';

import fitnessTrackerImg from '../../assets/projects/fitness-tracker.png';
import portfolioPreviewImg from '../../assets/projects/portfolio-preview.jpg';
import evoraImg from '../../assets/projects/evora.png';

const projects: Project[] = [
  {
    id: 2,
    title: 'Personal Fitness Tracker',
    category: 'SAAS APP / FITNESS',
    description: 'Full-stack fitness tracking app with workout logging, streaks, and progress analytics.',
    tags: ['React', 'Supabase', 'Node.js'],
    link: 'https://personal-fitness-tracker-cyan.vercel.app/',
    image: fitnessTrackerImg
  },
  {
    id: 3,
    title: 'Portfolio',
    category: 'PERSONAL PORTFOLIO',
    description: 'A personal portfolio site showcasing projects and skills.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://ganidusasmitha.42web.io/',
    image: portfolioPreviewImg
  },
  {
    id: 6,
    title: 'Evora',
    category: 'EV CHARGING / DESIGNATHON',
    description: 'EV charging station finder concept — designed as curunt problem soliving project',
    tags: ['Figma', 'UX Design', 'Concept'],
    link: null,
    image: evoraImg
  }
];

export default function Portfolio() {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <ScrollReveal>
        <SectionHeading
          title="Our Completed"
          gradientWord="Portfolio"
          subtitle="Discover our history of building high-performance, visually gorgeous web systems."
          align="center"
        />
      </ScrollReveal>

      {/* 3D Circular Arc Carousel Display */}
      <ScrollReveal delay={0.1}>
        <PortfolioCarousel projects={projects} />
      </ScrollReveal>
    </div>
  );
}
