import React, { useEffect, useState, useRef } from 'react';
import { Course } from '../types';
import { X, ChevronDown, ArrowRight, Star, Users, Zap, Globe, Scissors, Sparkles, Target, Activity, Share2, MousePointer2, Music } from 'lucide-react';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  textDir?: 'rtl' | 'ltr';
  currentLang: 'he' | 'en';
  onToggleLang: () => void;
}

// --- CONTEXT ANIMATIONS ---

const MatchCutVisualizer: React.FC = () => (
    <div className="w-full h-32 flex items-center justify-center gap-1 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
        <div className="w-16 h-16 bg-rose-400/20 rounded-lg animate-pulse" />
        <div className="w-px h-24 bg-rose-500/50 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-full blur-sm animate-[ping_2s_infinite]" />
        </div>
        <div className="w-16 h-16 bg-rose-400/40 rounded-lg animate-pulse delay-700" />
    </div>
);

const SeedGrowthVisualizer: React.FC = () => (
    <div className="w-full h-32 relative flex items-center justify-center">
        <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
        <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="1" fill="emerald" className="animate-[scaleUp_4s_infinite]" />
            <path d="M50,50 Q60,30 80,40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500/30 animate-[draw_3s_infinite]" />
            <path d="M50,50 Q40,70 20,60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500/30 animate-[draw_3.5s_infinite]" />
        </svg>
    </div>
);

const AudioWaveVisualizer: React.FC = () => (
    <div className="w-full h-16 flex items-center justify-center gap-1 opacity-40 group-hover:opacity-100 transition-all">
        {Array.from({length: 20}).map((_, i) => (
            <div key={i} className="w-1 bg-rose-500 rounded-full animate-[bounce_1s_infinite]" style={{ height: `${Math.random()*100}%`, animationDelay: `${i*0.05}s` }} />
        ))}
    </div>
);

const ChaosMutationVisualizer: React.FC = () => (
    <div className="w-full h-32 relative flex items-center justify-center overflow-hidden">
        <div className="w-16 h-16 border-2 border-emerald-500/30 rounded-full animate-spin-slow" />
        <div className="absolute w-24 h-24 border border-emerald-500/10 rounded-lg rotate-45 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent animate-[scan_3s_linear_infinite]" />
    </div>
);

// --- 3D WORD CLOUD COMPONENT ---
const WordCloud: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const words = [
        'seeding', 'nurture', 'chaos', 'growth', 'mutation', 'distill',
        'match-cut', 'rhythm', 'hybrid', 'fusion', 'after-effects', 'timeline',
        'story', 'motive', 'theme', 'color', 'emotion', 'texture',
        'prompt', 'vision', 'aesthetic', 'craft', 'form', 'content',
        'capcut', 'filmora', 'adobe', 'invisible'
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: any[] = [];
        let rotationX = 0;
        let rotationY = 0;
        let animationId: number;

        const init = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            ctx.scale(dpr, dpr);
            ctx.font = 'bold 12px Heebo';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const radius = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.35;
            particles = words.map((word) => {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                return {
                    word,
                    x: radius * Math.sin(phi) * Math.cos(theta),
                    y: radius * Math.sin(phi) * Math.sin(theta),
                    z: radius * Math.cos(phi)
                };
            });
        };

        const draw = () => {
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            ctx.clearRect(0, 0, width, height);
            rotationY += 0.003;
            rotationX += 0.002;

            particles.forEach(p => {
                let x = p.x; let y = p.y; let z = p.z;
                let tx = x * Math.cos(rotationY) - z * Math.sin(rotationY);
                let tz = z * Math.cos(rotationY) + x * Math.sin(rotationY);
                x = tx; z = tz;
                let ty = y * Math.cos(rotationX) - z * Math.sin(rotationX);
                z = z * Math.cos(rotationX) + y * Math.sin(rotationX);
                y = ty;

                const scale = 400 / (400 + z);
                const screenX = width / 2 + x * scale;
                const screenY = height / 2 + y * scale;
                const alpha = Math.max(0.1, (z + 150) / 300);

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = '#1e293b'; 
                ctx.font = `${Math.max(8, 14 * scale)}px Heebo`;
                ctx.fillText(p.word, screenX, screenY);
                ctx.restore();
            });
            animationId = requestAnimationFrame(draw);
        };

        init(); draw();
        window.addEventListener('resize', init);
        return () => { window.removeEventListener('resize', init); cancelAnimationFrame(animationId); };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-[300px] md:h-[400px]" />;
};

const COURSE_DETAILS: Record<string, any> = {
  marketing: {
    theme: { bg: '#fff5e3', accent: '#ff9f55', text: '#2d1c0d', muted: '#6b4c32' },
    he: {
      pill: 'תפיסה',
      heroTitle: 'הכל קורה בבת אחת.',
      heroSubtitle: 'לפצח את הבריף במרחב המולטימודלי. סדנה ליוצרים שרוצים להוביל את הקשר שבין רעיון לוויז׳ואל.',
      methodLabel: 'התהליך',
      methodTitle: 'מבריף ליצירה בארבעה מהלכים.',
      methodSteps: [
        { label: 'שלב 01', title: 'פירוק ה-DNA', body: 'חילוץ המתחים והטון של המותג לפני הפרומפט הראשון.', icon: <Target className="w-6 h-6" /> },
        { label: 'שלב 02', title: 'סקיצות מולטי', body: 'עבודה על קנבס אחד שבו הטקסט והתמונה מתפתחים יחד.', icon: <Activity className="w-6 h-6" /> }
      ]
    },
    en: {
      pill: 'Paradigm',
      heroTitle: 'Everything at once.',
      heroSubtitle: 'Cracking the brief in the multimodal space. A strategy workshop for the modern visual director.',
      methodLabel: 'The Method',
      methodTitle: 'From Brief to Vision.',
      methodSteps: [
        { label: 'Move I', title: 'DNA Decoding', body: 'Extracting brand tension and tone before the first prompt.', icon: <Target className="w-6 h-6" /> },
        { label: 'Move II', title: 'Multimodal Sketches', body: 'Developing ideas where copy and visual grow on the same canvas.', icon: <Activity className="w-6 h-6" /> }
      ]
    }
  },
  'video-editing': {
    theme: { bg: '#fef2f2', accent: '#f43f5e', text: '#881337', muted: '#9f1239' },
    he: {
      pill: 'מאסטרי',
      heroTitle: 'העין, הלב והטיימליין.',
      heroSubtitle: 'המרחק בין After Effects ל-CapCut הוא קטן ממה שחשבתם. קורס עריכה מתקדם שמתמקד ב-Match-Cuts, קצב וביצועים היברידיים.',
      shiftLabel: 'הפילוסופיה',
      shiftTitle: 'הכלי הוא רק מברשת, הקצב הוא הציור.',
      shiftBody: [
        'אני מאמין שהיכולת לערוך ברמה גבוהה לא תלויה במנוי חודשי יקר. השליטה העמוקה שלי ב-After Effects היא הבסיס ללימוד ה"קסם הבלתי נראה" שניתן ליישם היום גם בכלים נגישים כמו CapCut ו-Filmora.',
        'הקורס מיועד לעורכים שרוצים להיות מצוינים מבלי להיות כבולים לתוכנה אחת. נלמד איך המיומנויות הגבוהות של עריכת זמן, מאטץ׳-קאטים מדויקים ועבודה היברידית עם וידאו ג׳נרטיבי הופכות אתכם לאמנים בכל פלטפורמה.'
      ],
      methodLabel: 'הסילבוס',
      methodTitle: 'ארסנל של עורך על.',
      methodSteps: [
        { label: 'מודול 01', title: 'Match-Cuts & Flow', body: 'יצירת המשכיות תנועתית מושלמת בין שוטים שונים לחלוטין.', icon: <Scissors className="w-6 h-6" />, anim: <MatchCutVisualizer /> },
        { label: 'מודול 02', title: 'עריכה מבוססת אודיו', body: 'ניתוח תדרי הקול והקצב כדי להכתיב את הקאט המנצח.', icon: <Music className="w-6 h-6" />, anim: <AudioWaveVisualizer /> },
        { label: 'מודול 03', title: 'עריכה היברידית (AI)', body: 'שילוב אינטליגנטי של וידאו AI בתוך פוטג׳ ריאליסטי.', icon: <Activity className="w-6 h-6" /> },
        { label: 'מודול 04', title: 'מאפקטים לסיפור', body: 'שימוש בלוגיקה של After Effects לייצור לוק יוקרתי גם בכלים פשוטים.', icon: <MousePointer2 className="w-6 h-6" /> }
      ]
    },
    en: {
      pill: 'Mastery',
      heroTitle: 'Eye, Heart, Timeline.',
      heroSubtitle: 'The distance between After Effects and CapCut is smaller than you think. Master Match-Cuts, rhythm, and hybrid Gen-AI workflows.',
      shiftLabel: 'Philosophy',
      shiftTitle: 'The Skill is the Artist, not the Tool.',
      shiftBody: [
        'Great editing doesn’t require an expensive monthly subscription. My deep proficiency in After Effects serves as the foundation for teaching the "invisible magic" that you can now apply in tools like CapCut and Filmora.',
        'This course is for those who want to be master editors without being bound to specific software. We focus on match-cuts, temporal rhythm, and hybrid workflows (Gen-AI + Footage) driven by high-level artistic logic.'
      ],
      methodLabel: 'Syllabus',
      methodTitle: 'The Editor’s Arsenal.',
      methodSteps: [
        { label: 'Mod 01', title: 'Match-Cuts & Flow', body: 'Creating perfect kinetic continuity between disparate scenes.', icon: <Scissors className="w-6 h-6" />, anim: <MatchCutVisualizer /> },
        { label: 'Mod 02', title: 'Audio-Driven Editing', body: 'Letting the waveform and frequency dictate the impact of the cut.', icon: <Music className="w-6 h-6" />, anim: <AudioWaveVisualizer /> },
        { label: 'Mod 03', title: 'Hybrid Workflows', body: 'Seamlessly blending AI-generated chaos into live-action logic.', icon: <Share2 className="w-6 h-6" /> },
        { label: 'Mod 04', title: 'High-End Logic', body: 'Applying professional AE logic inside modern freeware.', icon: <MousePointer2 className="w-6 h-6" /> }
      ]
    }
  },
  'gen-ai': {
    theme: { bg: '#ecfdf5', accent: '#10b981', text: '#064e3b', muted: '#065f46' },
    he: {
      pill: 'גדילה',
      heroTitle: 'לזרוע, לטפח, לגדל.',
      heroSubtitle: 'האלכימיה של היצירה הג׳נרטיבית. איך לקחת רעיון גולמי ולגדל אותו מתוך הכאוס לכדי יצירת מופת מדויקת.',
      shiftLabel: 'מהות',
      shiftTitle: 'המוטציה היא הלב של היצירה.',
      shiftBody: [
        'אנחנו לא רק כותבים פרומפטים; אנחנו זורעים זרעים (Seeding). כל דור של יצירה הוא מוטציה, ואנחנו המגדלים (Nurturers) שבוררים את היופי מתוך הרעש.',
        'הקורס עוסק בשימוש בכאוס ככלי עבודה, ובשליטה בלא-נודע כדי להשיג חזון אמנותי עקבי מתוך "תהליך הצמיחה" של המכונה.'
      ],
      methodLabel: 'מתודה',
      methodTitle: 'שלבי הצמיחה.',
      methodSteps: [
        { label: 'שלב I', title: 'הזרעה (Seeding)', body: 'הנחת היסודות הקונספטואליים והוויזואליים הראשוניים.', icon: <Sparkles className="w-6 h-6" />, anim: <SeedGrowthVisualizer /> },
        { label: 'שלב II', title: 'טיפוח ומוטציה', body: 'הרצה של וריאציות ובחירת ה-DNA הכי חזק לפרויקט.', icon: <Share2 className="w-6 h-6" />, anim: <ChaosMutationVisualizer /> },
        { label: 'שלב III', title: 'גדילה מבוקרת', body: 'שימוש ב-ControlNets וסקיצות ידניות להובלת המכונה.', icon: <Activity className="w-6 h-6" /> }
      ]
    },
    en: {
      pill: 'Growth',
      heroTitle: 'Seed, Nurture, Grow.',
      heroSubtitle: 'The alchemy of generative creation. Planting raw ideas and growing them through chaos into precise visual narratives.',
      shiftLabel: 'Essence',
      shiftTitle: 'Mutation is the Heart of Creation.',
      shiftBody: [
        'We don’t just "prompt"; we plant seeds. Every generation is a mutation, and we are the nurturers selecting beauty from the noise.',
        'This course is about using chaos as a medium, controlling the unknown to achieve a consistent artistic signature through a "natural" growth process.'
      ],
      methodLabel: 'Method',
      methodTitle: 'The Growth Cycle.',
      methodSteps: [
        { label: 'Phase I', title: 'Seeding', body: 'Laying down the conceptual and visual foundation.', icon: <Sparkles className="w-6 h-6" />, anim: <SeedGrowthVisualizer /> },
        { label: 'Phase II', title: 'Mutation & Nurture', body: 'Running variations to find the strongest aesthetic DNA.', icon: <Share2 className="w-6 h-6" />, anim: <ChaosMutationVisualizer /> },
        { label: 'Phase III', title: 'Structured Growth', body: 'Using ControlNets to guide the machine with human intent.', icon: <Activity className="w-6 h-6" /> }
      ]
    }
  }
};

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, currentLang, onToggleLang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (course) {
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
  }, [course]);

  const handleScroll = () => {
    if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setScrollProgress(Math.min(scrollTop / (scrollHeight - clientHeight), 1));
    }
  };

  if (!course) return null;
  const content = COURSE_DETAILS[course.id]?.[currentLang] || COURSE_DETAILS['marketing'][currentLang];
  const theme = COURSE_DETAILS[course.id]?.theme || COURSE_DETAILS['marketing'].theme;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} font-sans`} style={{ backgroundColor: theme.bg }} dir={currentLang === 'he' ? 'rtl' : 'ltr'}>
      <div className="w-full px-6 py-6 flex justify-between items-center backdrop-blur-sm sticky top-0 z-40" style={{ borderBottom: `1px solid ${theme.accent}30` }}>
        <button onClick={() => { setIsVisible(false); setTimeout(onClose, 600); }} className="group flex items-center gap-2 text-slate-900"><X className="w-6 h-6 group-hover:rotate-90 transition-transform" /> <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">{currentLang === 'he' ? 'סגור' : 'Close'}</span></button>
        <div className="flex items-center gap-4">
             <button onClick={onToggleLang} className="flex items-center gap-1 px-3 py-1 rounded-full border bg-white/50 text-xs font-bold uppercase"><Globe className="w-3 h-3" /> {currentLang === 'he' ? 'EN' : 'HE'}</button>
             <span className="font-bold text-lg">{course.title}</span>
        </div>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-grow overflow-y-auto no-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto px-6 pb-32">
            
            <section className="min-h-[80vh] flex flex-col justify-center items-center text-center pt-20">
                <div className="inline-flex px-4 py-2 rounded-full border text-xs font-bold tracking-widest uppercase mb-8" style={{ borderColor: theme.accent, color: theme.text }}>{content.pill}</div>
                <h1 className="text-5xl md:text-8xl font-black mb-8 leading-none tracking-tight">{content.heroTitle}</h1>
                <p className="text-xl md:text-2xl max-w-2xl font-light leading-relaxed">{content.heroSubtitle}</p>
                <div className="mt-12 w-full max-w-md"><WordCloud /></div>
                <div className="mt-12 animate-bounce"><ChevronDown className="w-8 h-8 opacity-40" /></div>
            </section>

            {content.shiftTitle && (
              <section className="py-24 grid md:grid-cols-2 gap-12 border-t" style={{ borderColor: `${theme.accent}30` }}>
                   <div className="space-y-4">
                       <span className="text-sm font-bold tracking-widest uppercase" style={{ color: theme.accent }}>{content.shiftLabel}</span>
                       <h2 className="text-4xl font-black leading-tight">{content.shiftTitle}</h2>
                   </div>
                   <div className="space-y-6 text-lg leading-relaxed text-slate-600 font-light">
                       {content.shiftBody.map((p: string, i: number) => <p key={i}>{p}</p>)}
                   </div>
              </section>
            )}

            <section className="py-24">
                 <div className="text-center mb-16">
                     <span className="text-xs font-bold tracking-widest uppercase mb-4 block">{content.methodLabel}</span>
                     <h2 className="text-4xl md:text-5xl font-black">{content.methodTitle}</h2>
                 </div>
                 <div className="grid md:grid-cols-2 gap-8">
                     {content.methodSteps.map((step: any, i: number) => (
                         <div key={i} className="p-8 rounded-3xl border bg-white/40 backdrop-blur-sm group hover:bg-white/80 transition-all flex flex-col">
                             <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-2xl" style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>{step.icon}</div>
                                <span className="text-[10px] font-bold opacity-30">{step.label}</span>
                             </div>
                             <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                             <p className="text-slate-600 mb-6 font-light">{step.body}</p>
                             {step.anim && <div className="mt-auto pt-6 border-t border-slate-100">{step.anim}</div>}
                         </div>
                     ))}
                 </div>
            </section>

            <section className="py-12 border-t flex flex-col md:flex-row items-center gap-10" style={{ borderColor: `${theme.accent}30` }}>
                <img src="https://lh3.googleusercontent.com/d/1zIWiopYxC_J4r-Ns4VmFvCXaLPZFmK4k=s400?authuser=0" className="w-32 h-40 object-cover rounded-2xl rotate-[-3deg] border-4 border-white shadow-xl" />
                <div className="text-center md:text-left">
                     <h3 className="text-2xl font-bold mb-2">Eyal Izenman</h3>
                     <p className="italic text-slate-500 mb-6 max-w-sm">
                        {currentLang === 'he' ? '"יצירה היא לא עבודה עם כלים, היא עבודה עם רגש וזמן."' : '"Creation is not about tools, it is about emotion and time."'}
                     </p>
                     <a href="https://wa.me/97236030603" className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-xl hover:scale-105 transition-all" style={{ backgroundColor: theme.accent }}>
                        {currentLang === 'he' ? 'דברו איתי על הקורס' : 'Talk to me about the course'} <ArrowRight className="w-5 h-5" />
                     </a>
                </div>
            </section>
        </div>
      </div>
      <style>{`
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        @keyframes scaleUp { 0% { r: 1; opacity: 1; } 100% { r: 50; opacity: 0; } }
        @keyframes draw { 0% { stroke-dasharray: 0 100; } 100% { stroke-dasharray: 100 0; } }
      `}</style>
    </div>
  );
};