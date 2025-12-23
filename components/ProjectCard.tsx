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
  const containerSize = project.type === 'video' ? 'w-full md:w-[500px] h-[300px]' 
    : 'w-full md:w-[500px] h-[350px]';

  return (
    <div 
      ref={cardRef}
      className={`relative w-full md:w-1/2 flex flex-col ${structuralClasses} transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Connection Line to Center */}
      <div className={`hidden md:block absolute top-1/2 w-24 h-px bg-slate-300 ${alignment === 'left' ? 'right-0' : 'left-0'}`} />

      {/* Frame for the Content */}
      <div className={`relative ${containerSize} group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 transition-all duration-500 hover:shadow-xl hover:border-slate-400`}>
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
        className={`mt-4 ${alignment === 'left' ? 'mr-4' : 'ml-4'} ${textAlignmentClass} max-w-sm`} 
        dir={textDir}
      >
          <h3 className="text-2xl font-display font-bold text-slate-900">{project.title}</h3>
          <p className="text-slate-500 font-sans text-sm tracking-wide mt-1 leading-relaxed">{project.description}</p>
          
          {project.type !== 'video' && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">
                <span>Visit Site</span>
                <ExternalLink className="w-3 h-3" />
            </a>
          )}
      </div>
    </div>
  );
};