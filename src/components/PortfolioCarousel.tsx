import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  link?: string | null;
  image?: string;
  badge?: string;
}

interface PortfolioCarouselProps {
  projects: Project[];
}

export default function PortfolioCarousel({ projects }: PortfolioCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Screen size check for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation handlers
  const prevCard = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevCard();
      } else if (e.key === 'ArrowRight') {
        nextCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevCard, nextCard]);

  // Parallax tilt calculation on mouse or touch move
  const updateTilt = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const mouseY = (clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setTilt({
      x: mouseX * 20, // rotateY angle shift
      y: -mouseY * 16 // rotateX angle shift
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateTilt(e.clientX, e.clientY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      setIsHovered(true);
      updateTilt(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      setIsHovered(true);
      updateTilt(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Card click handler
  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Handle Drag End for touch / mouse swipe navigation
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 40;
    if (info.offset.x < -threshold || info.velocity.x < -200) {
      nextCard();
    } else if (info.offset.x > threshold || info.velocity.x > 200) {
      prevCard();
    }
    setTimeout(() => {
      setIsHovered(false);
      setTilt({ x: 0, y: 0 });
    }, 100);
  };

  return (
    <div className="w-full relative py-4 sm:py-8 select-none overflow-hidden">
      {/* 3D Perspective Stage Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="w-full h-[520px] sm:h-[560px] md:h-[600px] flex items-center justify-center relative touch-pan-y"
        style={{
          perspective: '1200px',
        }}
      >
        {/* Parallax Rotatable Outer Canvas */}
        <motion.div
          className="w-full h-full flex items-center justify-center relative"
          style={{
            transformStyle: 'preserve-3d',
            touchAction: 'pan-y',
          }}
          animate={{
            rotateX: isHovered ? tilt.y : 0,
            rotateY: isHovered ? tilt.x : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 18,
            mass: 0.5
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={() => setIsHovered(true)}
          onDrag={(_, info) => {
            setTilt({
              x: info.offset.x * 0.08,
              y: -info.offset.y * 0.08
            });
          }}
          onDragEnd={handleDragEnd}
        >
          {projects.map((project, i) => {
            const total = projects.length;
            // Calculate circular offset relative to active card
            let offset = (i - activeIndex) % total;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;

            // Visibility rules
            const maxVisible = isMobile ? 1 : 2;
            const isVisible = absOffset <= maxVisible;

            // Positioning & transformation variables
            const xSpacing = isMobile ? 140 : 280;
            const zSpacing = isMobile ? 130 : 200;
            const rotYDegree = isMobile ? 24 : 35;

            const x = offset * xSpacing;
            const z = -absOffset * zSpacing;
            const rotateY = -offset * rotYDegree;
            const scale = isCenter ? 1 : Math.max(0.65, 1 - absOffset * 0.16);
            const opacity = isCenter ? 1 : Math.max(0, 0.7 - (absOffset - 1) * 0.35);
            const zIndex = 30 - absOffset * 10;

            return (
              <motion.div
                key={project.id}
                initial={false}
                animate={{
                  x,
                  z,
                  rotateY,
                  scale,
                  opacity: isVisible ? opacity : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 1, 0.5, 1]
                }}
                style={{
                  position: 'absolute',
                  transformStyle: 'preserve-3d',
                  zIndex,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                className={`w-[290px] xs:w-[330px] sm:w-[380px] md:w-[410px] ${isCenter ? 'cursor-pointer' : 'cursor-pointer hover:opacity-90'
                  }`}
                onClick={() => handleCardClick(i)}
              >
                <GlassCard
                  hoverEffect={false}
                  className={`h-full flex flex-col justify-between overflow-hidden p-0 transition-all duration-300 border ${isCenter
                      ? 'border-[#85431E]/60 dark:border-[#85431E]/60 shadow-[0_12px_40px_-10px_rgba(133,67,30,0.35)] ring-2 ring-[#85431E]/20 dark:ring-[#85431E]/20 bg-white/95 dark:bg-[#34150F]'
                      : 'border-[#E3D5C5] dark:border-[#54281B] bg-white/70 dark:bg-[#34150F]/70 shadow-lg'
                    }`}
                >
                  {/* Image Header Area */}
                  <div className="aspect-video w-full overflow-hidden relative border-b border-[#E3D5C5] dark:border-[#54281B]">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isCenter ? 'group-hover:scale-105' : ''
                          }`}
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#F8F3ED] dark:from-[#150C0C] to-primary/10 z-0"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-[#B58E78] dark:text-[#54281B] font-black text-3xl sm:text-4xl tracking-widest select-none z-0 opacity-15">
                          CODEWAVE
                        </div>
                      </>
                    )}

                    {/* Project Category / Type Badge */}
                    {project.badge && (
                      <span
                        className={`absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-[#150C0C]/90 backdrop-blur-md shadow-md border ${project.badge === 'Company Project'
                            ? 'text-[#85431E] dark:text-[#D39858] border-[#85431E]/30'
                            : 'text-[#D39858] dark:text-[#EACEAA] border-[#D39858]/30'
                          }`}
                      >
                        {project.badge}
                      </span>
                    )}

                    {/* Glow highlight overlay for active card */}
                    {isCenter && (
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none z-10" />
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-[#85431E] dark:text-[#D39858] uppercase tracking-wider block">
                        {project.category}
                      </span>
                      <h3
                        className={`text-xl font-bold transition-colors duration-300 ${isCenter
                            ? 'text-[#34150F] dark:text-[#EACEAA]'
                            : 'text-[#54281B] dark:text-[#EACEAA]/80'
                          }`}
                      >
                        {project.title}
                      </h3>
                      <p className="text-[#54281B] dark:text-[#B58E78] text-xs leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Tech Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-semibold text-[#54281B] dark:text-[#B58E78] bg-[#F8F3ED] dark:bg-[#150C0C] px-2 py-0.5 rounded border border-[#E3D5C5] dark:border-[#54281B]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Link section hidden for now for users */}
                      {!isCenter && (
                        <div className="pt-3 border-t border-[#E3D5C5] dark:border-[#54281B] flex items-center justify-end">
                          <span className="text-[10px] font-medium text-[#B58E78] dark:text-[#B58E78] italic">
                            Click to inspect
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Left Arrow Button - Hidden on Mobile View, visible on Desktop (md+) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevCard();
          }}
          className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-[#34150F]/90 border border-[#E3D5C5] dark:border-[#54281B] text-[#34150F] dark:text-[#EACEAA] shadow-xl backdrop-blur-md items-center justify-center hover:bg-[#85431E] hover:text-[#EACEAA] dark:hover:bg-[#85431E] dark:hover:border-[#85431E] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#85431E]/50 active:scale-95 cursor-pointer"
          aria-label="Previous project card"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow Button - Hidden on Mobile View, visible on Desktop (md+) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextCard();
          }}
          className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-[#34150F]/90 border border-[#E3D5C5] dark:border-[#54281B] text-[#34150F] dark:text-[#EACEAA] shadow-xl backdrop-blur-md items-center justify-center hover:bg-[#85431E] hover:text-[#EACEAA] dark:hover:bg-[#85431E] dark:hover:border-[#85431E] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#85431E]/50 active:scale-95 cursor-pointer"
          aria-label="Next project card"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Interactive Pagination Dot Indicators */}
      <div className="flex justify-center items-center gap-2 mt-4 relative z-40">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to project ${idx + 1}`}
            className={`transition-all duration-300 rounded-full focus:outline-none cursor-pointer ${idx === activeIndex
                ? 'w-8 h-2.5 bg-gradient-to-r from-primary to-accent shadow-md'
                : 'w-2.5 h-2.5 bg-[#E3D5C5] dark:bg-[#54281B] hover:bg-[#85431E]/50 dark:hover:bg-[#85431E]/50'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
