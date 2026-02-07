import React, { useEffect, useRef, useState } from 'react';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
  textDir: 'rtl' | 'ltr';
}

interface ProjectTileProps {
  project: Project;
  index: number;
  textDir: 'rtl' | 'ltr';
}

const ProjectTile: React.FC<ProjectTileProps> = ({ project, index, textDir }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Determine aspect ratio based on project type
  // Videos use a taller aspect ratio to accommodate Shorts (9:16), other content uses 16:9
  const isVideoProject = project.type === 'video';
  // Use aspect-[3/4] as a compromise between full 9:16 and 16:9 for a balanced grid
  const aspectClass = isVideoProject ? 'aspect-[3/4]' : 'aspect-video';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 80);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (tileRef.current) observer.observe(tileRef.current);
    return () => observer.disconnect();
  }, [index]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tileRef.current) return;
    const rect = tileRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 15,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 15
    });
  };

  return (
    <div
      ref={tileRef}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        className={`relative rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 ease-out ${aspectClass} ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${-mousePos.y * 0.3}deg) rotateY(${mousePos.x * 0.3}deg) scale(1.02)`
            : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
          transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.4s ease-out',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Project component - FULLY INTERACTIVE */}
        <div className="absolute inset-0 bg-slate-900">
          {project.component}
        </div>

        {/* Shine effect - pointer-events-none so it doesn't block */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${50 + mousePos.x * 3}% ${50 + mousePos.y * 3}%, rgba(255,255,255,0.1) 0%, transparent 60%)`
          }}
        />

        {/* Bottom info bar - appears on hover, doesn't block content */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-500 pointer-events-none z-20 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          dir={textDir}
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400 mb-1 block">
                {project.type}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight">
                {project.title}
              </h3>
            </div>

            {project.type !== 'video' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white hover:text-slate-900 transition-all pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Visit</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Border glow on hover */}
        <div className={`absolute inset-0 rounded-2xl md:rounded-3xl border-2 transition-all duration-500 pointer-events-none z-30 ${
          isHovered ? 'border-violet-500/40 shadow-[0_0_40px_rgba(139,92,246,0.15)]' : 'border-white/10'
        }`} />
      </div>

      {/* Description below the tile */}
      <div className={`mt-4 px-1 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} dir={textDir}>
        <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>
    </div>
  );
};

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, textDir }) => {
  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projects.map((project, index) => (
            <ProjectTile
              key={project.id}
              project={project}
              index={index}
              textDir={textDir}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
