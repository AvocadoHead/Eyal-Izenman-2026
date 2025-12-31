// components/courses/MarketingCourse.tsx
import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

export interface CoursePageProps {
  currentLang: 'he' | 'en';
}

const theme = {
  bg: '#fff5e3',
  accent: '#ff9f55',
  text: '#2d1c0d',
  muted: '#6b4c32',
};

export const MarketingCourse: React.FC<CoursePageProps> = ({ currentLang }) => {
  const isHe = currentLang === 'he';

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div className="max-w-4xl mx-auto px-6 pb-32">
        {/* HERO */}
        <section className="min-h-[80vh] flex flex-col justify-center pt-20">
          <div
            className="inline-flex px-4 py-2 rounded-full border text-xs font-bold tracking-widest uppercase mb-6 self-start"
            style={{ borderColor: theme.accent }}
          >
            {isHe ? 'סדנת מולטימודאל' : 'Multimodal Workshop'}
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
            {isHe ? 'הכל קורה בבת אחת.' : 'Everything happens at once.'}
          </h1>

          <p className="text-lg md:text-2xl max-w-2xl font-light leading-relaxed mb-10"
            style={{ color: theme.muted }}
          >
            {isHe
              ? 'סדנה מעמיקה בפיצוח בריפים במרחב המולטימודלי – אסטרטגיה, קריאייטיב ופיתוח חזותי בעידן ה-AI הגנרטיבי.'
              : 'An in-depth workshop on cracking briefs in the multimodal space – strategy, creative, and visual development in the age of generative AI.'}
          </p>

          <div className="mt-4 animate-bounce opacity-40">
            <ChevronDown className="w-7 h-7" />
          </div>
        </section>

        {/* Content coming soon */}
        <section className="py-16">
          <p className="text-xl text-center" style={{ color: theme.muted }}>
            {isHe ? 'תוכן מפורט בקרוב...' : 'Detailed content coming soon...'}
          </p>
        </section>
      </div>
    </div>
  );
};
