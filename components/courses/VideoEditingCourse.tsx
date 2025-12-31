import React from 'react';

export interface CoursePageProps {
  currentLang: 'he' | 'en';
}

export const VideoEditingCourse: React.FC<CoursePageProps> = ({ currentLang }) => {
  return (
    <div className="min-h-screen w-full bg-rose-50 text-rose-900">
      <div className="max-w-4xl mx-auto px-6 pb-32 pt-20">
        <h1 className="text-5xl font-black mb-6">
          {currentLang === 'he' ? 'עריכת וידאו' : 'Video Editing'}
        </h1>
        <p className="text-xl">
          {currentLang === 'he' 
            ? 'תוכן בקרוב...'
            : 'Content coming soon...'}
        </p>
      </div>
    </div>
  );
};
