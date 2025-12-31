import React from 'react';

export interface CoursePageProps {
  currentLang: 'he' | 'en';
}

export const GenAICourse: React.FC<CoursePageProps> = ({ currentLang }) => {
  return (
    <div className="min-h-screen w-full bg-emerald-50 text-emerald-900">
      <div className="max-w-4xl mx-auto px-6 pb-32 pt-20">
        <h1 className="text-5xl font-black mb-6">
          {currentLang === 'he' ? 'AI גנרטיבי' : 'Generative AI'}
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
