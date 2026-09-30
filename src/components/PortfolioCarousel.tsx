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
                      ? 'border-[#D4AF37]/70 dark:border-[#D4AF37]/70 shadow-[0_12px_40px_-10px_rgba(212,175,55,0.3)] ring-2 ring-[#D4AF37]/30 dark:ring-[#D4AF37]/30 bg-white/95 dark:bg-[#131B2E]'
                      : 'border-slate-200 dark:border-[#1E3A5F] bg-white/80 dark:bg-[#0B132B]/80 shadow-lg'
                    }`}
                >
                  {/* Image Header Area */}
                  <div className="aspect-video w-full overflow-hidden relative border-b border-slate-200 dark:border-[#1E3A5F]">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isCenter ? 'group-hover:scale-105' : ''
                          }`}
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 dark:from-[#070D1D] via-primary/10 to-accent/20 z-0"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-[#1E3A5F] font-black text-3xl sm:text-4xl tracking-widest select-none z-0 opacity-25">
                          CODEWAVE
                        </div>
                      </>
                    )}

                    {/* Project Category / Type Badge */}
                    {project.badge && (
                      <span
                        className={`absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-[#070D1D]/90 backdrop-blur-md shadow-md border ${project.badge === 'Company Project'
                            ? 'text-[#D4AF37] dark:text-[#F3C623] border-[#D4AF37]/50'
                            : 'text-[#F3C623] dark:text-[#F9E79F] border-[#F3C623]/50'
                          }`}
                      >
                        {project.badge}
                      </span>
                    )}

                    {/* Glow highlight overlay for active card */}
                    {isCenter && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none z-10" />
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-[#D4AF37] dark:text-[#F3C623] uppercase tracking-wider block">
                        {project.category}
                      </span>
                      <h3
                        className={`text-xl font-bold transition-colors duration-300 ${isCenter
                            ? 'text-slate-900 dark:text-[#F9E79F]'
                            : 'text-slate-800 dark:text-slate-200'
                          }`}
                      >
                        {project.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Tech Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-semibold text-[#D4AF37] dark:text-[#F3C623] bg-slate-100 dark:bg-[#0B132B] px-2 py-0.5 rounded border border-slate-200 dark:border-[#1E3A5F]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Link section hidden for now for users */}
                      {!isCenter && (
                        <div className="pt-3 border-t border-slate-200 dark:border-[#1E3A5F] flex items-center justify-end">
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400 italic">
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
          className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-[#0B132B]/90 border border-slate-200 dark:border-[#1E3A5F] text-slate-800 dark:text-[#F3C623] shadow-xl backdrop-blur-md items-center justify-center hover:bg-[#D4AF37] hover:text-[#0B132B] dark:hover:bg-[#D4AF37] dark:hover:text-[#0B132B] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 active:scale-95 cursor-pointer"
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
          className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-[#0B132B]/90 border border-slate-200 dark:border-[#1E3A5F] text-slate-800 dark:text-[#F3C623] shadow-xl backdrop-blur-md items-center justify-center hover:bg-[#D4AF37] hover:text-[#0B132B] dark:hover:bg-[#D4AF37] dark:hover:text-[#0B132B] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 active:scale-95 cursor-pointer"
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
                ? 'w-8 h-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3C623] shadow-md'
                : 'w-2.5 h-2.5 bg-slate-300 dark:bg-[#1E3A5F] hover:bg-[#D4AF37]/50 dark:hover:bg-[#D4AF37]/50'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
