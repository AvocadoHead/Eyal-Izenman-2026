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
    <div className="w-full max-w-7xl mx-auto py-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" dir={textDir}>
        {courses.map((course) => (
          <div 
            key={course.id}
            onClick={() => onSelectCourse(course)}
            className="group relative h-[500px] cursor-pointer bg-white rounded-[2rem] border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:border-slate-200 hover:-translate-y-2 overflow-hidden flex flex-col"
          >
            {/* Render the specific Micro App for the card */}
            <div className="absolute inset-0 z-0">
                {renderMicroApp(course.id)}
            </div>
            
            {/* Click overlay to ensure the whole card is clickable but buttons inside might need z-index handling if we want them to work without opening modal */}
            {/* Note: In this design, clicking anywhere usually opens the modal. The language toggle inside needs e.stopPropagation() */}
          </div>
        ))}
      </div>
    </div>
  );
};