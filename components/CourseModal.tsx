import React, { useEffect, useState, useRef } from 'react';
import { Course } from '../types';
import { X, Globe } from 'lucide-react';
import { MarketingCourse } from './courses/MarketingCourse';
import { VideoEditingCourse } from './courses/VideoEditingCourse';
import { GenAICourse } from './courses/GenAICourse';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  currentLang: 'he' | 'en';
  onToggleLang: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  currentLang,
  onToggleLang,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (course) {
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
  }, [course]);

  if (!course) return null;

  const renderCourse = () => {
    switch (course.id) {
      case 'marketing':
        return <MarketingCourse currentLang={currentLang} />;
      case 'video-editing':
        return <VideoEditingCourse currentLang={currentLang} />;
      case 'gen-ai':
        return <GenAICourse currentLang={currentLang} />;
      default:
        return <MarketingCourse currentLang={currentLang} />;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      } font-sans`}
      dir={currentLang === 'he' ? 'rtl' : 'ltr'}
    >
      {/* Top bar */}
      <div className="w-full px-6 py-6 flex justify-between items-center backdrop-blur-sm sticky top-0 z-40 bg-white/70 border-b border-slate-200">
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 600);
          }}
          className="group flex items-center gap-2 text-slate-900"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">
            {currentLang === 'he' ? 'סגור' : 'Close'}
          </span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-3 py-1 rounded-full border bg-white/50 text-xs font-bold uppercase"
          >
            <Globe className="w-3 h-3" />
            {currentLang === 'he' ? 'EN' : 'HE'}
          </button>
          <span className="font-bold text-lg">{course.title}</span>
        </div>
      </div>

      {/* Scroll area */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto no-scrollbar scroll-smooth">
        {renderCourse()}
      </div>
    </div>
  );
};
