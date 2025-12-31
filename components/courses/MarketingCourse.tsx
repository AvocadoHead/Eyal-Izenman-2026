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
            {isHe ? 'לפצח את הבריף.' : 'Crack the Brief.'}
          </h1>

          <p className="text-lg md:text-2xl max-w-2xl font-light leading-relaxed mb-10 text-slate-700">
            {isHe
              ? 'סדנה מעמיקה בפיצוח בריפים במרחב המולטימודלי – אסטרטגיה, קריאייטיב ופיתוח חזותי בעידן ה-AI הג׳נרטיבי.'
              : 'An in-depth workshop on cracking briefs in the multimodal space – strategy, creative, and visual development in the age of generative AI.'}
          </p>

          <div className="mt-4 animate-bounce text-slate-500">
            <ChevronDown className="w-7 h-7" />
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

          <h2 className="text-3xl md:text-4xl font-black mb-6">
            {isHe
              ? 'המעבר: מטקסט פה וויז׳ואל שם – לקנבס אחד מאוחד.'
              : 'The shift: from siloed text & visuals to a single generative canvas.'}
          </h2>

          <p className="text-lg leading-relaxed text-slate-700 mb-4">
            {isHe
              ? 'רוב התעשייה עדיין עובדת בפיצול: טקסט בחלון אחד, תמונות באחר, והבריף המקורי הולך לאיבוד באמצע.'
              : 'Most teams still work in split mode: copy in one window, visuals in another, and the original brief gets lost in between.'}
          </p>

          <p className="text-lg leading-relaxed text-slate-700">
            {isHe
              ? 'בסדנה עוברים לקנבס ג׳נרטיבי אחד, שבו שפה, רעיון ותמונה מתפתחים יחד – במקום להתרוצץ בין כלים וחלונות.'
              : 'In this workshop everything moves onto one generative canvas where language, concept, and image evolve together instead of being scattered across tools.'}
          </p>
        </section>

        {/* METHOD – 4 MOVES */}
        <section className="py-16 border-t" style={{ borderColor: `${theme.accent}30` }}>
          <span className="text-sm font-bold tracking-widest uppercase mb-4 block">
            {isHe ? 'המתודולוגיה' : 'The Method'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            {isHe
              ? 'מבריף לווידאו בארבעה מהלכים.'
              : 'From brief to video in four moves.'}
          </h2>
          <p className="text-lg text-slate-700 mb-10">
            {isHe
              ? 'תהליך מובנה שמארגן את הכאוס היצירתי לצינור עבודה ברור.'
              : 'A structured pipeline that turns creative chaos into a clear workflow.'}
          </p>

          <div className="space-y-10">
            {/* Move I */}
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase opacity-60">
                {isHe ? 'מהלך I' : 'Move I'}
              </span>
              <h3 className="text-2xl font-bold">
                {isHe
                  ? 'פירוק הבריף ל-DNA של סיפור'
                  : 'Translating the brief into story DNA'}
              </h3>
              <p className="text-lg text-slate-700">
                {isHe
                  ? 'מתחילים בתרגום הבריף לעמוד שדרה סיפורי: טון, מתחים, קשת רגשית ותמונות מרכזיות – עוד לפני שנכתבת מילה אחת של פרומפט.'
                  : 'We begin by translating the brief into narrative backbone: tone, tensions, emotional arc, and key images – before a single prompt is written.'}
              </p>
            </div>

            {/* Move II */}
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase opacity-60">
                {isHe ? 'מהלך II' : 'Move II'}
              </span>
              <h3 className="text-2xl font-bold">
                {isHe
                  ? 'מחברת הסקיצות המולטימודלית'
                  : 'The multimodal sketchbook'}
              </h3>
              <p className="text-lg text-slate-700">
                {isHe
                  ? 'מה-DNA הסיפורי מייצרים סקיצות – וריאציות של פרומפטים, שוטים, קומפוזיציה, קצב וטיפוגרפיה – כולן חיות על אותו קנבס.'
                  : 'From the story DNA we generate sketches: prompt variations, shots, composition, rhythm, and type – all living on the same canvas.'}
              </p>
            </div>

            {/* Move III */}
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase opacity-60">
                {isHe ? 'מהלך III' : 'Move III'}
              </span>
              <h3 className="text-2xl font-bold">
                {isHe
                  ? 'ממודבורד ללוק & פיל'
                  : 'From moodboard to look & feel'}
              </h3>
              <p className="text-lg text-slate-700">
                {isHe
                  ? 'מצמצמים את הרעש לאסתטיקה ממוקדת: צבע, טקסטורות, חתימת תנועה. בונים לוק & פיל שאפשר לזהות כ״זה שלנו״.'
                  : 'We distill the noise into a focused aesthetic: color, textures, motion signature – until the team can point and say “this is us”.'}
              </p>
            </div>

            {/* Move IV */}
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase opacity-60">
                {isHe ? 'מהלך IV' : 'Move IV'}
              </span>
              <h3 className="text-2xl font-bold">
                {isHe
                  ? 'הלחנת היצירה הסופית'
                  : 'Composing the final piece'}
              </h3>
              <p className="text-lg text-slate-700">
                {isHe
                  ? 'מסדרים הכול בזמן: סצנות, קצב, רגעים טיפוגרפיים וסאונד – מפריים ראשון ועד אחרון.'
                  : 'We arrange everything in time: scenes, pacing, typographic beats, and sound – from the first frame to the last.'}
              </p>
            </div>
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="py-16 border-t" style={{ borderColor: `${theme.accent}30` }}>
          <span className="text-sm font-bold tracking-widest uppercase mb-4 block">
            {isHe ? 'תוצאה' : 'Outcomes'}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            {isHe
              ? 'עם מה יוצאים מהסדנה'
              : 'What you leave the workshop with'}
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-1">
                {isHe
                  ? 'מתודה מולטימודלית מעשית'
                  : 'A practical multimodal method'}
              </h3>
              <p className="text-lg text-slate-700">
                {isHe
                  ? 'תהליך עבודה שניתן לשחזר על בריפים וכלים שונים, בלי להתחיל מאפס בכל פעם שיוצאת פלטפורמה חדשה.'
                  : 'A repeatable workflow you can apply across briefs and tools without starting from scratch whenever a new platform appears.'}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-1">
                {isHe ? 'פרויקט חי בתהליך' : 'A live project in motion'}
              </h3>
              <p className="text-lg text-slate-700">
                {isHe
                  ? 'קונספט, סקיצה או וידאו כמעט סופי – שנבנים על בסיס חומר שלכם או בריף משותף מהסדנה.'
                  : 'A concept, sketch, or near-final video built from your own material or a shared workshop brief.'}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-1">
                {isHe ? 'שפה משותפת לצוות' : 'A shared team language'}
              </h3>
              <p className="text-lg text-slate-700">
                {isHe
                  ? 'שפה שמחברת בין אסטרטגיה, קופי, עיצוב ותנועה – שהופכת את התהליך לזורם ופחות מפוצל.'
                  : 'A language that connects strategy, copy, design, and motion so the process becomes more fluid and less fragmented.'}
              </p>
            </div>
          </div>
        </section>

        {/* ABOUT + CTA */}
        <section className="py-16 border-t flex flex-col md:flex-row items-center gap-10"
          style={{ borderColor: `${theme.accent}30` }}
        >
          <img
            src="https://lh3.googleusercontent.com/d/1zIWiopYxC_J4r-Ns4VmFvCXaLPZFmK4k=s400?authuser=0"
            className="w-32 h-40 object-cover rounded-2xl rotate-[-3deg] border-4 border-white shadow-xl"
          />
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Eyal Izenman</h3>
            <p className="italic text-slate-500 mb-6 max-w-sm">
              {isHe
                ? '״AI הוא לא טריק טכנולוגי – הוא מרחב יצירתי שלם.״'
                : '“AI is not a trick, it is an entire creative space.”'}
            </p>
            <a
              href="https://wa.me/97236030603"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-xl hover:scale-105 transition-all"
              style={{ backgroundColor: theme.accent }}
            >
              {isHe ? 'דברו איתי על הסדנה' : 'Talk to me about the workshop'}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

