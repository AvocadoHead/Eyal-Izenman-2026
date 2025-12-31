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

        {/* WORD CLOUD SECTION */}
        <section className="py-16 min-h-[60vh] flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center max-w-3xl">
            {[
              { he: 'סיפור', en: 'story', size: 'text-3xl' },
              { he: 'מרקם', en: 'texture', size: 'text-2xl' },
              { he: 'צבע', en: 'color', size: 'text-4xl' },
              { he: 'מוטציה', en: 'mutation', size: 'text-2xl' },
              { he: 'משמעות', en: 'meaning', size: 'text-3xl' },
              { he: 'מצלמה', en: 'camera', size: 'text-2xl' },
              { he: 'יצירתי', en: 'creative', size: 'text-4xl' },
              { he: 'צורה', en: 'form', size: 'text-2xl' },
              { he: 'כוונה', en: 'intention', size: 'text-3xl' },
              { he: 'תסיסה', en: 'ferment', size: 'text-2xl' },
              { he: 'תוכן', en: 'content', size: 'text-3xl' },
              { he: 'מוסח', en: 'draft', size: 'text-2xl' },
              { he: 'פריסה', en: 'layout', size: 'text-4xl' },
              { he: 'פלטה', en: 'palette', size: 'text-3xl' },
              { he: 'ערכה', en: 'theme', size: 'text-2xl' },
              { he: 'קול', en: 'sound', size: 'text-3xl' },
              { he: 'אסתטי', en: 'aesthetic', size: 'text-2xl' },
            ].map((word, idx) => (
              <div
                key={idx}
                className={`${word.size} font-bold opacity-70 hover:opacity-100 transition-opacity`}
                style={{ 
                  transform: `rotate(${Math.random() * 10 - 5}deg)`,
                  color: idx % 3 === 0 ? theme.accent : theme.text 
                }}
              >
                {isHe ? word.he : word.en}
              </div>
            ))}
          </div>
        </section>

        {/* PARADIGM / WHAT CHANGES */}
        <section className="py-16 border-t" style={{ borderColor: `${theme.accent}30` }}>
          <span
            className="text-sm font-bold tracking-widest uppercase mb-4 block"
            style={{ color: theme.accent }}
          >
            {isHe ? 'פרדיגמה' : 'Paradigm'}
          </span>

          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
            {isHe
              ? 'המעבר: מטקסט פה וויז׳ואל שם – לקנבס אחד מאוחד.'
              : 'The shift: from siloed text & visuals to a single unified canvas.'}
          </h2>

          <p className="text-lg md:text-xl leading-relaxed mb-6" style={{ color: theme.muted }}>
            {isHe
              ? 'רוב התעשייה עדיין עובדת בפיצול: טקסט בחלון אחד, תמונות באחר, והבריף המקורי הולך לאיבוד באמצע. התוצאה: חיכוך אינסופי, יותר מדי העברות, מעט מדי יצירה רציפה.'
              : 'Most teams still work in split mode: copy in one window, visuals in another, and the original brief gets lost in between. The result: endless friction, too many handoffs, too little continuous creation.'}
          </p>

          <p className="text-lg md:text-xl leading-relaxed" style={{ color: theme.muted }}>
            {isHe
              ? 'בסדנה אנחנו עוברים לקנבס גנרטיבי אחד, שבו שפה, רעיון ותמונה מתפתחים יחד – במקום להתרוצץ בין כלים וחלונות שונים.'
              : 'In this workshop everything moves onto one generative canvas where language, concept, and image evolve together instead of being scattered across tools.'}
          </p>
        </section>

        {/* METHOD – 4 MOVES */}
        <section className="py-16 border-t" style={{ borderColor: `${theme.accent}30` }}>
          <span className="text-sm font-bold tracking-widest uppercase mb-4 block"
            style={{ color: theme.accent }}
          >
            {isHe ? 'מתכון' : 'Recipe'}
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            {isHe
              ? 'המתודולוגיה: מבריף לווידאו בארבעה מהלכים.'
              : 'The methodology: from brief to video in four moves.'}
          </h2>
          <p className="text-lg md:text-xl mb-12" style={{ color: theme.muted }}>
            {isHe
              ? 'תהליך מובנה שמארגן את הכאוס היצירתי לצינור עבודה ברור.'
              : 'A structured pipeline that turns creative chaos into a clear workflow.'}
          </p>

          <div className="space-y-16">
            {/* Move I */}
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest uppercase opacity-50">
                {isHe ? 'מהלך I' : 'Move I'}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                {isHe
                  ? 'פירוק הבריף ל-DNA של סיפור'
                  : 'Translating the brief into story DNA'}
              </h3>
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: theme.muted }}>
                {isHe
                  ? 'מתחילים בתרגום הבריף לעמוד שדרה סיפורי: טון, מתחים, קשת רגשית ותמונות מרכזיות – עוד לפני שנכתבת מילה אחת של פרומפט.'
                  : 'We begin by translating the brief into narrative backbone: tone, tensions, emotional arc, and key images – before a single prompt is written.'}
              </p>
            </div>

            {/* Move II */}
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest uppercase opacity-50">
                {isHe ? 'מהלך II' : 'Move II'}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                {isHe
                  ? 'מחברת הסקיצות המולטימודלית'
                  : 'The multimodal sketchbook'}
              </h3>
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: theme.muted }}>
                {isHe
                  ? 'מה-DNA הסיפורי אנחנו מייצרים סקיצות – וריאציות של פרומפטים, בחירות מצלמה וקומפוזיציה, קצב וטיפוגרפיה – כולן חיות על אותו קנבס.'
                  : 'From the story DNA we generate sketches: prompt variations, camera choices and composition, rhythm and typography – all living on the same canvas.'}
              </p>
            </div>

            {/* Move III */}
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest uppercase opacity-50">
                {isHe ? 'מהלך III' : 'Move III'}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                {isHe
                  ? 'ממוּדבורד ללוק & פיל'
                  : 'From moodboard to look & feel'}
              </h3>
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: theme.muted }}>
                {isHe
                  ? 'מצמצמים את הרעש לאסתטיקה ממוקדת: צבע, טקסטורות, חתימת תנועה. המטרה: לוק & פיל שכולם יכולים לזהות כ״זה שלנו״.'
                  : 'We distill the noise into a focused aesthetic: color, textures, motion signature. The goal: a look & feel everyone can identify as "this is us".'}
              </p>
            </div>

            {/* Move IV */}
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest uppercase opacity-50">
                {isHe ? 'מהלך IV' : 'Move IV'}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                {isHe
                  ? 'הלחנת היצירה הסופית'
                  : 'Composing the final piece'}
              </h3>
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: theme.muted }}>
                {isHe
                  ? 'מסדרים הכול בזמן: סדר סצנות, קצב, רגעים טיפוגרפיים, סאונד ואסטרטגיית אקספורט – מפריים ראשון ועד אחרון.'
                  : 'We arrange everything in time: scene order, pacing, typographic beats, sound and export strategy – from the first frame to the last.'}
              </p>
            </div>
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="py-16 border-t" style={{ borderColor: `${theme.accent}30` }}>
          <span className="text-sm font-bold tracking-widest uppercase mb-4 block"
            style={{ color: theme.accent }}
          >
            {isHe ? 'תוצאה' : 'Outcomes'}
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            {isHe
              ? 'עם מה אתם יוצאים מהסדנה'
              : 'What you leave the workshop with'}
          </h2>

          <p className="text-lg md:text-xl mb-10" style={{ color: theme.muted }}>
            {isHe
              ? 'המטרה היא שלא תצאו רק עם השראה – אלא עם מתודה ועם התחלה של יצירה משלכם.'
              : 'The goal is that you don\'t leave just with inspiration – but with a method and the beginning of your own creation.'}
          </p>

          <div className="space-y-10">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                {isHe
                  ? 'מתודה מולטימודלית מעשית'
                  : 'A practical multimodal method'}
              </h3>
              <p className="text-lg md:text-xl leading-relaxed" style={{ color: theme.muted }}>
                {isHe
                  ? 'תהליך עבודה שניתן לשחזר על בריפים שונים וכל
