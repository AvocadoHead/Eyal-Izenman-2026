import React, { useEffect, useRef, useState } from 'react';
import { Project } from '../types';
import { ExternalLink, Play, ArrowUpRight } from 'lucide-react';

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
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
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20
    });
  };

  // Determine tile size based on index for visual variety
  const sizeClass = index === 0
    ? 'col-span-2 row-span-2'  // Hero tile
    : index % 5 === 1
    ? 'col-span-2 row-span-1'  // Wide tile
    : 'col-span-1 row-span-1'; // Regular tile

  const heightClass = index === 0
    ? 'h-[500px] md:h-[600px]'
    : index % 5 === 1
    ? 'h-[280px] md:h-[320px]'
    : 'h-[280px] md:h-[360px]';

  return (
    <div
      ref={tileRef}
      className={`${sizeClass} ${heightClass} relative group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      data-magnetic
    >
      <div
        className={`absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${-mousePos.y * 0.5}deg) rotateY(${mousePos.x * 0.5}deg) scale(1.02)`
            : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
        }}
      >
        {/* Background with project component */}
        <div className="absolute inset-0 bg-slate-900">
          {project.component}
        </div>

        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-60' : 'opacity-70'
        }`} />

        {/* Shine effect on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + mousePos.x * 2}% ${50 + mousePos.y * 2}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
          }}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end" dir={textDir}>
          {/* Project type badge */}
          <div className={`mb-auto self-start transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md text-white/80 border border-white/10">
              {project.type === 'video' ? 'Showreel' : project.type}
            </span>
          </div>

          {/* Title and description */}
          <div className={`transition-all duration-500 ${
            isHovered ? 'translate-y-0' : 'translate-y-4'
          }`}>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight leading-tight">
              {project.title}
            </h3>
            <p className={`text-white/60 text-sm md:text-base leading-relaxed max-w-md transition-all duration-500 ${
              isHovered ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0'
            } overflow-hidden`}>
              {project.description}
            </p>
          </div>

          {/* Action button */}
          {project.type !== 'video' && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 text-sm font-bold transition-all duration-500 w-fit ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <span>Explore</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}

          {/* Play indicator for videos */}
          {project.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                isHovered
                  ? 'bg-white scale-110 shadow-2xl shadow-white/30'
                  : 'bg-white/10 backdrop-blur-sm border border-white/20 scale-100'
              }`}>
                <Play className={`w-6 h-6 md:w-8 md:h-8 ml-1 transition-colors duration-300 ${
                  isHovered ? 'text-slate-900 fill-slate-900' : 'text-white fill-white'
                }`} />
              </div>
            </div>
          )}
        </div>

        {/* Border glow on hover */}
        <div className={`absolute inset-0 rounded-2xl md:rounded-3xl border-2 transition-all duration-500 pointer-events-none ${
          isHovered ? 'border-violet-400/50 shadow-[inset_0_0_30px_rgba(139,92,246,0.2)]' : 'border-white/5'
        }`} />
      </div>
    </div>
  );
};

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, textDir }) => {
  return (
    <section className="w-full px-3 md:px-6 py-8">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-auto">
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
