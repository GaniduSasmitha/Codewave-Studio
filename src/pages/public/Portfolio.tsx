import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import PortfolioCarousel, { type Project } from '../../components/PortfolioCarousel';

import beadoriaImg from '../../assets/projects/beadoria.png';
import fitnessTrackerImg from '../../assets/projects/fitness-tracker.png';
import portfolioPreviewImg from '../../assets/projects/portfolio-preview.jpg';
import gaming4worldImg from '../../assets/projects/gaming4world.png';
import nestleCommHubImg from '../../assets/projects/nestle-commhub.jpg';
import evoraImg from '../../assets/projects/evora.png';

const projects: Project[] = [
  {
    id: 1,
    title: "Beadoria",
    category: "E-COMMERCE / JEWELRY",
    description: "A jewelry e-commerce storefront with product browsing and a polished shopping experience.",
    tags: ["React", "Tailwind", "E-Commerce"],
    link: "https://ganidusasmitha.github.io/Beadoria/",
    image: beadoriaImg,
    badge: "Personal Project"
  },
  {
    id: 2,
    title: "Personal Fitness Tracker",
    category: "SAAS APP / FITNESS",
    description: "Full-stack fitness tracking app with workout logging, streaks, and progress analytics.",
    tags: ["React", "Supabase", "Node.js"],
    link: "https://personal-fitness-tracker-cyan.vercel.app/",
    image: fitnessTrackerImg,
    badge: "Personal Project"
  },
  {
    id: 3,
    title: "Portfolio",
    category: "PERSONAL PORTFOLIO",
    description: "A personal portfolio site showcasing projects and skills.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://ganidusasmitha.42web.io/",
    image: portfolioPreviewImg,
    badge: "Personal Project"
  },
  {
    id: 4,
    title: "Gamig4World",
    category: "GAMING / COMMUNITY",
    description: "A gaming community platform built around game discovery and player engagement.",
    tags: ["JavaScript", "Web Design"],
    link: "https://ganidusasmitha.github.io/gamig4world/",
    image: gaming4worldImg,
    badge: "Personal Project"
  },
  {
    id: 5,
    title: "Nestlé CommHub",
    category: "INTERNAL PLATFORM",
    description: "An internal communication hub platform built as a university group project, covering team collaboration and workflow tracking.",
    tags: ["React", "QA Automation", "Sprint Delivery"],
    link: "https://github.com/nestle-commhub-group1/nestle-commhub.git",
    image: nestleCommHubImg,
    badge: "Company Project"
  },
  {
    id: 6,
    title: "Evora",
    category: "EV CHARGING / DESIGNATHON",
    description: "EV charging station finder concept — designed as curunt problem soliving project",
    tags: ["Figma", "UX Design", "Concept"],
    link: null,
    image: evoraImg,
    badge: "Personal Project"
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
