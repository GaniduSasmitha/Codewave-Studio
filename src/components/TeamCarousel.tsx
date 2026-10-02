import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  image?: string | null;
  imagePosition?: string;
  imageScale?: string;
  linkedin?: string;
}

interface TeamCarouselProps {
  members: TeamMember[];
}

export default function TeamCarousel({ members }: TeamCarouselProps) {
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
  const prevMember = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + members.length) % members.length);
  }, [members.length]);

  const nextMember = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % members.length);
  }, [members.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevMember();
      } else if (e.key === 'ArrowRight') {
        nextMember();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevMember, nextMember]);

  // Parallax tilt calculation on mouse or touch move
  const updateTilt = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (clientX - rect.left) / rect.width - 0.5;
    const mouseY = (clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: mouseX * 20,
      y: -mouseY * 16
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

  // Handle Drag End for touch / swipe navigation
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 40;
    if (info.offset.x < -threshold || info.velocity.x < -200) {
      nextMember();
    } else if (info.offset.x > threshold || info.velocity.x > 200) {
      prevMember();
    }
    setTimeout(() => {
      setIsHovered(false);
      setTilt({ x: 0, y: 0 });
    }, 100);
  };

  return (
    <div className="w-full relative py-4 sm:py-8 select-none overflow-hidden">
      {/* 3D Stage Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="w-full h-[520px] sm:h-[560px] md:h-[580px] flex items-center justify-center relative touch-pan-y"
        style={{
          perspective: '1200px',
        }}
      >
        {/* Parallax Outer Canvas */}
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
          {members.map((member, i) => {
            const total = members.length;
            let offset = (i - activeIndex) % total;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;

            const maxVisible = isMobile ? 1 : 2;
            const isVisible = absOffset <= maxVisible;

            const xSpacing = isMobile ? 150 : 280;
            const zSpacing = isMobile ? 140 : 200;
            const rotYDegree = isMobile ? 25 : 34;

            const x = offset * xSpacing;
            const z = -absOffset * zSpacing;
            const rotateY = -offset * rotYDegree;
            const scale = isCenter ? 1 : Math.max(0.68, 1 - absOffset * 0.16);
            const opacity = isCenter ? 1 : Math.max(0, 0.7 - (absOffset - 1) * 0.35);
            const zIndex = 30 - absOffset * 10;

            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  x,
                  z,
                  rotateY,
                  scale,
                  opacity: isVisible ? opacity : 0,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.25, 1, 0.5, 1]
                }}
                style={{
                  position: 'absolute',
                  transformStyle: 'preserve-3d',
                  zIndex,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                className={`w-[290px] xs:w-[330px] sm:w-[360px] md:w-[390px] ${isCenter ? 'cursor-default' : 'cursor-pointer hover:opacity-90'
                  }`}
                onClick={() => handleCardClick(i)}
                onKeyDown={(event) => {
                  if (!isCenter && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    handleCardClick(i);
                  }
                }}
                role={!isCenter ? 'button' : undefined}
                tabIndex={isVisible && !isCenter ? 0 : -1}
                aria-label={!isCenter ? `Show ${member.name}` : undefined}
              >
                <GlassCard
                  hoverEffect={false}
                  className={`h-full flex flex-col justify-between items-center text-center p-6 sm:p-8 transition-all duration-300 border ${isCenter
                    ? 'border-[#D4AF37]/70 dark:border-[#D4AF37]/70 shadow-[0_12px_40px_-10px_rgba(212,175,55,0.3)] ring-2 ring-[#D4AF37]/30 dark:ring-[#D4AF37]/30 bg-white/95 dark:bg-[#131B2E]'
                    : 'border-slate-200 dark:border-[#1E3A5F] bg-white/80 dark:bg-[#0B132B]/80 shadow-lg'
                    }`}
                >
                  <div className="flex flex-col items-center text-center w-full">
                    {/* Centered Large Stylized Avatar Display */}
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!isCenter) {
                            e.preventDefault();
                            setActiveIndex(i);
                          }
                        }}
                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-br from-[#D4AF37]/40 via-slate-100 dark:via-[#070D1D] to-[#F3C623]/40 shadow-xl shadow-primary/10 mb-6 mx-auto flex-shrink-0 group hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300 block cursor-pointer"
                        title={`Visit ${member.name}'s LinkedIn profile`}
                      >
                        <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 dark:bg-[#070D1D] flex items-center justify-center border border-slate-200 dark:border-[#1E3A5F] relative">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className={`w-full h-full object-cover ${member.imagePosition || 'object-top'} ${member.imageScale || 'scale-100'} transition-transform duration-500 group-hover:scale-[1.2]`}
                            />
                          ) : (
                            <span className="text-4xl sm:text-5xl select-none filter drop-shadow">
                              {member.avatar}
                            </span>
                          )}
                          {isCenter && (
                            <div className="absolute inset-0 bg-[#070D1D]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[11px] font-bold text-[#0B132B] bg-[#D4AF37] px-2.5 py-1 rounded-full backdrop-blur border border-white/20 shadow-md">
                                LinkedIn ↗
                              </span>
                            </div>
                          )}
                        </div>
                      </a>
                    ) : (
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-br from-[#D4AF37]/40 via-slate-100 dark:via-[#070D1D] to-[#F3C623]/40 shadow-xl shadow-primary/10 mb-6 mx-auto flex-shrink-0">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 dark:bg-[#070D1D] flex items-center justify-center border border-slate-200 dark:border-[#1E3A5F]">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className={`w-full h-full object-cover ${member.imagePosition || 'object-top'} ${member.imageScale || 'scale-100'}`}
                            />
                          ) : (
                            <span className="text-4xl sm:text-5xl select-none filter drop-shadow">
                              {member.avatar}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Member Name */}
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!isCenter) {
                            e.preventDefault();
                            setActiveIndex(i);
                          }
                        }}
                        className="group/name inline-flex items-center gap-1.5 text-xl font-bold text-slate-900 dark:text-[#F9E79F] hover:text-[#D4AF37] dark:hover:text-[#F3C623] transition-colors duration-200 text-center"
                      >
                        <span>{member.name}</span>
                        <span className="text-xs text-[#725700] dark:text-[#F3C623] opacity-70 group-hover/name:opacity-100 transition-opacity">↗</span>
                      </a>
                    ) : (
                      <h4 className="text-xl font-bold text-slate-900 dark:text-[#F9E79F] text-center">
                        {member.name}
                      </h4>
                    )}

                    {/* Role / Title */}
                    <span className="text-xs text-[#725700] dark:text-[#F3C623] font-semibold block mt-1.5 uppercase tracking-wider text-center">
                      {member.role}
                    </span>

                    {/* Bio */}
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mt-4 text-center">
                      {member.bio}
                    </p>

                    {/* LinkedIn Button */}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!isCenter) {
                            e.preventDefault();
                            setActiveIndex(i);
                          }
                        }}
                        className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#F3C623] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0B132B] hover:bg-[#D4AF37]/20 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-[#1E3A5F] hover:border-[#D4AF37]/50 transition-all duration-200 shadow-sm"
                      >
                        <span>LinkedIn Profile</span>
                        <span>↗</span>
                      </a>
                    )}
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
            prevMember();
          }}
          className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-[#0B132B]/90 border border-slate-200 dark:border-[#1E3A5F] text-slate-800 dark:text-[#F3C623] shadow-xl backdrop-blur-md items-center justify-center hover:bg-[#D4AF37] hover:text-[#0B132B] dark:hover:bg-[#D4AF37] dark:hover:text-[#0B132B] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 active:scale-95 cursor-pointer"
          aria-label="Previous team member"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow Button - Hidden on Mobile View, visible on Desktop (md+) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextMember();
          }}
          className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-[#0B132B]/90 border border-slate-200 dark:border-[#1E3A5F] text-slate-800 dark:text-[#F3C623] shadow-xl backdrop-blur-md items-center justify-center hover:bg-[#D4AF37] hover:text-[#0B132B] dark:hover:bg-[#D4AF37] dark:hover:text-[#0B132B] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 active:scale-95 cursor-pointer"
          aria-label="Next team member"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex justify-center items-center gap-2 mt-4 relative z-40">
        {members.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to team member ${idx + 1}`}
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
