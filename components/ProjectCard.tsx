import React, { useEffect, useRef, useState } from 'react';
import { Project } from '../types';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  alignment: 'left' | 'right';
  textDir?: 'rtl' | 'ltr';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, alignment, textDir = 'ltr' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Structural Alignment (Always Left/Right based on index)
  const structuralClasses = alignment === 'left' 
    ? 'md:mr-auto md:pr-24 items-end' 
    : 'md:ml-auto md:pl-24 items-start';
  
  // Text Alignment (Based on Direction)
  const textAlignmentClass = textDir === 'rtl' ? 'text-right' : 'text-left';

  // Sizing for the container
  const containerSize = project.type === 'video' ? 'w-full md:w-[520px] h-[280px] md:h-[320px]'
    : 'w-full md:w-[520px] h-[320px] md:h-[360px]';

  return (
    <div
      ref={cardRef}
      className={`relative w-full md:w-1/2 flex flex-col ${structuralClasses} transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Connection Line to Center - refined gradient */}
      <div className={`hidden md:block absolute top-1/2 w-20 h-px ${alignment === 'left' ? 'right-0' : 'left-0'}`}>
        <div className={`w-full h-full bg-gradient-to-${alignment === 'left' ? 'l' : 'r'} from-slate-300 to-transparent`}></div>
      </div>

      {/* Frame for the Content */}
      <div className={`relative ${containerSize} group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-md shadow-slate-200/50 border border-slate-200/80 transition-all duration-500 ease-out hover:shadow-xl hover:shadow-slate-300/40 hover:border-slate-300/80 hover:-translate-y-1`}>
        {/* Subtle inner glow on hover */}
        <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-inset ring-black/[0.02] pointer-events-none z-10"></div>

        {/* If it's a link-based project, wrap in anchor, otherwise div (for Showreel modal) */}
        {project.type !== 'video' ? (
             <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                {project.component}
             </a>
        ) : (
             <div className="w-full h-full">
                {project.component}
             </div>
        )}
      </div>

      {/* Label (Floating outside) */}
      <div
        className={`mt-5 ${alignment === 'left' ? 'mr-3' : 'ml-3'} ${textAlignmentClass} max-w-md`}
        dir={textDir}
      >
          <h3 className="text-xl md:text-2xl font-display font-bold text-slate-800 tracking-tight">{project.title}</h3>
          <p className="text-slate-500 font-sans text-sm md:text-[15px] mt-2 leading-relaxed">{project.description}</p>

          {project.type !== 'video' && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-[11px] font-semibold text-slate-400 hover:text-violet-500 transition-colors duration-300 uppercase tracking-[0.15em] group">
                <span>Visit Site</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
      </div>
    </div>
  );
};