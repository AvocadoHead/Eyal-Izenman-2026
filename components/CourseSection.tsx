import React from 'react';
import { Course } from '../types';
import { MarketingMicro } from './micro-apps/MarketingMicro';
import { EditingMicro } from './micro-apps/EditingMicro';
import { GenAiMicro } from './micro-apps/GenAiMicro';

interface CourseSectionProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  textDir?: 'rtl' | 'ltr';
  currentLang: 'he' | 'en';
  onToggleLang: () => void;
}

export const CourseSection: React.FC<CourseSectionProps> = ({ 
  courses, 
  onSelectCourse, 
  textDir = 'ltr',
  currentLang,
  onToggleLang
}) => {
  const cardGlows: Record<string, string> = {
      marketing: 'radial-gradient(circle at 20% 20%, rgba(251, 146, 60, 0.35), transparent 50%), radial-gradient(circle at 80% 75%, rgba(234, 88, 12, 0.2), transparent 55%)',
      'video-editing': 'radial-gradient(circle at 30% 20%, rgba(244, 63, 94, 0.3), transparent 50%), radial-gradient(circle at 75% 80%, rgba(236, 72, 153, 0.25), transparent 55%)',
      'gen-ai': 'radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.3), transparent 50%), radial-gradient(circle at 80% 75%, rgba(20, 184, 166, 0.25), transparent 55%)',
  };
  
  const renderMicroApp = (courseId: string) => {
      switch(courseId) {
          case 'marketing':
              return <MarketingMicro lang={currentLang} onToggleLang={onToggleLang} />;
          case 'video-editing':
              return <EditingMicro lang={currentLang} onToggleLang={onToggleLang} />;
          case 'gen-ai':
              return <GenAiMicro lang={currentLang} onToggleLang={onToggleLang} />;
          default:
              return null;
      }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" dir={textDir}>
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => onSelectCourse(course)}
            className="group relative h-[480px] md:h-[520px] cursor-pointer bg-white rounded-[1.75rem] md:rounded-[2rem] border border-slate-200/60 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-slate-300/30 hover:border-slate-300/60 hover:-translate-y-2 overflow-hidden flex flex-col"
          >
            {/* Outer glow effect */}
            <div className="absolute -inset-3 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" style={{ backgroundImage: cardGlows[course.id] }} />

            {/* Inner border highlight */}
            <div className="absolute inset-0 rounded-[1.75rem] md:rounded-[2rem] ring-1 ring-inset ring-white/50 pointer-events-none z-20" />

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

            {/* Render the specific Micro App for the card */}
            <div className="absolute inset-0">
                {renderMicroApp(course.id)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
