import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronDown, ArrowRight, Target, Activity, Share2, Music, Scissors, Sparkles, Globe, BrainCircuit, Zap, Layers } from 'lucide-react';

// --- TYPES ---
export interface Course {
  id: string;
  title: string;
  description: string;
}

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  currentLang: 'he' | 'en';
  onToggleLang: () => void;
}

// --- ENHANCED INTERACTIVE 3D WORD CLOUD (Fixed & Complete) ---
const InteractiveWordCloud: React.FC<{ words: string[], color: string }> = ({ words, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationXRef = useRef(0);
  const rotationYRef = useRef(0);
  const momentumXRef = useRef(0);
  const momentumYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    let animationId: number;

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const radius = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.35;
      const displayWords = [...words, ...words, ...words].slice(0, 30);
      
      particles = displayWords.map((word) => {
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

    const rotatePoint = (x: number, y: number, z: number) => {
      const cosY = Math.cos(rotationYRef.current);
      const sinY = Math.sin(rotationYRef.current);
      const tempX = x * cosY - z * sinY;
      const tempZ = z * cosY + x * sinY;
      
      const cosX = Math.cos(rotationXRef.current);
      const sinX = Math.sin(rotationXRef.current);
      const tempY = y * cosX - tempZ * sinX;
      const finalZ = tempZ * cosX + y * sinX;
      
      return { x: tempX, y: tempY, z: finalZ };
    };

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      // Apply momentum
      if (!isDraggingRef.current) {
        rotationYRef.current += momentumYRef.current;
        rotationXRef.current += momentumXRef.current;
        momentumXRef.current *= 0.95;
        momentumYRef.current *= 0.95;
        
        // Base rotation
        rotationYRef.current += 0.001;
        rotationXRef.current += 0.0005;
      }

      const sorted = particles
        .map(p => {
          const rotated = rotatePoint(p.x, p.y, p.z);
          return { ...p, ...rotated };
        })
        .sort((a, b) => a.z - b.z);

      sorted.forEach(p => {
        const scale = 600 / (600 + p.z);
        const screenX = width / 2 + p.x * scale;
        const screenY = height / 2 + p.y * scale;
        const alpha = Math.max(0.1, (p.z + 200) / 300);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.font = `bold ${Math.max(10, 16 * scale)}px sans-serif`;
        ctx.fillText(p.word, screenX, screenY);
        ctx.restore();
      });

      animationId = requestAnimationFrame(draw);
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastMouseRef.current.x;
      const deltaY = e.clientY - lastMouseRef.current.y;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      
      rotationYRef.current += deltaX * 0.005;
      rotationXRef.current += deltaY * 0.005;
      momentumYRef.current = deltaX * 0.0005;
      momentumXRef.current = deltaY * 0.0005;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = 'grab';
    };

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true;
      const touch = e.touches[0];
      lastMouseRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastMouseRef.current.x;
      const deltaY = touch.clientY - lastMouseRef.current.y;
      lastMouseRef.current = { x: touch.clientX, y: touch.clientY };
      
      rotationYRef.current += deltaX * 0.005;
      rotationXRef.current += deltaY * 0.005;
      momentumYRef.current = deltaX * 0.0005;
      momentumXRef.current = deltaY * 0.0005;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    canvas.style.cursor = 'grab';
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    init();
    draw();

    window.addEventListener('resize', init);
    
    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, [words, color]);

  // Fixed the typo here: <canvas> instead of anvas
  return <canvas ref={canvasRef} className="w-full h-[300px] md:h-[400px]" />;
};

// --- CONTEXT ANIMATIONS (Fixed SVGs) ---

const MatchCutVisualizer: React.FC<{ color: string }> = ({ color }) => (
  <div className="w-full h-32 flex items-center justify-center gap-1 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
    <div className="w-12 h-20 rounded-md animate-pulse" style={{ backgroundColor: `${color}40` }} />
    <div className="w-px h-24 relative" style={{ backgroundColor: color }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full blur-sm animate-[ping_2s_infinite]" style={{ backgroundColor: color }} />
    </div>
    <div className="w-12 h-20 rounded-md animate-pulse delay-700" style={{ backgroundColor: `${color}60` }} />
  </div>
);

const SeedGrowthVisualizer: React.FC<{ color: string }> = ({ color }) => (
  <div className="w-full h-32 relative flex items-center justify-center overflow-hidden">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      {/* Fixed: <circle> instead of ircle */}
      <circle cx="50" cy="80" r="2" fill={color} className="animate-[ping_3s_infinite]" />
      <path d="M50,80 Q50,60 50,50" fill="none" stroke={color} strokeWidth="1" className="animate-[grow_2s_ease-out_forwards]" />
      <path d="M50,50 Q30,40 20,30" fill="none" stroke={color} strokeWidth="0.5" className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <path d="M50,50 Q70,40 80,30" fill="none" stroke={color} strokeWidth="0.5" className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-300" />
      <circle cx="20" cy="30" r="3" fill={`${color}40`} className="opacity-0 group-hover:opacity-100 animate-bounce delay-500" />
      <circle cx="80" cy="30" r="3" fill={`${color}40`} className="opacity-0 group-hover:opacity-100 animate-bounce delay-700" />
    </svg>
  </div>
);

const AudioWaveVisualizer: React.FC<{ color: string }> = ({ color }) => (
  <div className="w-full h-16 flex items-center justify-center gap-1 opacity-50 group-hover:opacity-100 transition-all">
    {Array.from({length: 12}).map((_, i) => (
      <div key={i} className="w-1 rounded-full animate-[bounce_1s_infinite]" style={{ backgroundColor: color, height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
    ))}
  </div>
);

const StrategyGridVisualizer: React.FC<{ color: string }> = ({ color }) => (
  <div className="w-full h-32 relative flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-1 opacity-20 transform scale-110 group-hover:scale-100 transition-transform duration-700">
      {Array.from({length: 24}).map((_, i) => (
        <div key={i} className="rounded-sm transition-colors duration-300 hover:bg-current" style={{ color: Math.random() > 0.7 ? color : 'transparent', border: `1px solid ${color}` }} />
      ))}
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
  </div>
);

// --- COURSE CONTENT DATA (Completed & Merged) ---
const COURSE_DETAILS: Record<string, any> = {
  marketing: {
    theme: { bg: '#fff7e8', accent: '#ff9f55', text: '#301b0f', secondary: '#ffd6a6' },
    words: ['Strategy', 'Brief', 'AI', 'Concept', 'Brand', 'Insight', 'Values', 'Tone', 'Visuals', 'Prompt', 'Midjourney', 'Flux', 'Agency', 'Pitch', 'Story', 'Logic'],
    he: {
      pill: 'ניהול קריאייטיב',
      heroTitle: 'לפצח את הבריף.',
      heroSubtitle: 'סדנה מעמיקה לאנשי אסטרטגיה ומנהלי סטודיו. איך לתרגם את השפה השיווקית לויזואלית, ולייצר נכסים מולטי-מודאליים במהירות.',
      shiftLabel: 'הבעיה',
      shiftTitle: 'הפער בין המילה לתמונה.',
      shiftBody: [
        'לקוחות מדברים ברגשות ("שיהיה חדשני אבל חם"), ואילו AI עובד בלוגיקה. הפער הזה עולה לסטודיו שלכם בשעות של ניסוי וטעייה, פידבקים אינסופיים וכאב ראש.',
        'בקורס הזה נלמד מתודולוגיה מובנית לפירוק בריף, בניית "לקסיקון מותג" ויזואלי, ושליטה בכלי הייצור (תמונה, וידאו, סאונד) כדי לספר סיפור אחד מדויק – בנשימה אחת רציפה.'
      ],
      methodLabel: 'השיטה',
      methodTitle: 'מסמנטיקה לפיקסלים.',
      methodSteps: [
        { label: 'מודול 01', title: 'ניתוח סמנטי', body: 'תרגום ערכי מותג לפרומפטים לוגיים ומובנים.', icon: <BrainCircuit className="w-6 h-6" />, anim: <StrategyGridVisualizer color="#ff9f55" /> },
        { label: 'מודול 02', title: 'השפה הויזואלית', body: 'יצירת Style Tokens עקביים לתמונות ווידאו.', icon: <Layers className="w-6 h-6" /> },
        { label: 'מודול 03', title: 'סינתזה מולטי-מודאלית', body: 'איחוד של טקסט, תמונה וסאונד לתוצר שלם.', icon: <Zap className="w-6 h-6" /> }
      ]
    },
    en: {
      pill: 'Creative Management',
      heroTitle: 'Crack the Brief.',
      heroSubtitle: 'A deep-dive workshop for strategists and studio managers. Translate marketing speak into visual logic and produce multimodal assets at speed.',
      shiftLabel: 'The Gap',
      shiftTitle: 'Bridging Word and Image.',
      shiftBody: [
        'Clients speak in emotions ("Make it pop, but keep it warm"), while AI works in logic. This gap costs your studio hours of trial and error.',
        'We teach a structured methodology to deconstruct briefs, build visual brand lexicons, and master production tools (Image, Video, Audio) to tell one cohesive story.'
      ],
      methodLabel: 'Methodology',
      methodTitle: 'From Semantics to Pixels.',
      methodSteps: [
        { label: 'Mod 01', title: 'Semantic Analysis', body: 'Translating brand values into logical prompt structures.', icon: <BrainCircuit className="w-6 h-6" />, anim: <StrategyGridVisualizer color="#ff9f55" /> },
        { label: 'Mod 02', title: 'Visual Language', body: 'Creating consistent Style Tokens for imagery and video.', icon: <Layers className="w-6 h-6" /> },
        { label: 'Mod 03', title: 'Multimodal Synthesis', body: 'Unifying text, visual, and sound into a final asset.', icon: <Zap className="w-6 h-6" /> }
      ]
    }
  },
  'video-editing': {
    theme: { bg: '#fdf2f8', accent: '#db2777', text: '#831843', secondary: '#fbcfe8' },
    words: ['Rhythm', 'Cut', 'Flow', 'Beat', 'Timeline', 'Match-Cut', 'Sound', 'Motion', 'Tempo', 'Style', 'Effect', 'Transition', 'Story', 'Frame', 'Keyframe'],
    he: {
      pill: 'עריכה ופוסט',
      heroTitle: 'העין, הלב והטיימליין.',
      heroSubtitle: 'קורס ליוצרים שרוצים לעלות רמה. טכניקות עריכה מתקדמות, קצב, ושילוב AI כדי להפוך חומר גלם לזהב.',
      shiftLabel: 'הפילוסופיה',
      shiftTitle: 'הכלי הוא רק מברשת.',
      shiftBody: [
        'עריכה מעולה לא תלויה בתוכנה, אלא בהבנה של קצב ורגש. אני מביא את הלוגיקה המורכבת של After Effects לכלים נגישים כמו CapCut.',
        'נלמד איך לייצר "קסם בלתי נראה" – מעברים חלקים (Match-cuts), עריכה מוזיקלית מדויקת, ושילוב אלמנטים ג׳נרטיביים בתוך וידאו מצולם.'
      ],
      methodLabel: 'הסילבוס',
      methodTitle: 'ארסנל העורך ההיברידי.',
      methodSteps: [
        { label: 'מודול 01', title: 'Flow & Match-Cuts', body: 'יצירת המשכיות תנועתית בין שוטים שונים.', icon: <Scissors className="w-6 h-6" />, anim: <MatchCutVisualizer color="#db2777" /> },
        { label: 'מודול 02', title: 'עריכה וסאונד', body: 'לתת לגל הקול להכתיב את הקאט.', icon: <Music className="w-6 h-6" />, anim: <AudioWaveVisualizer color="#db2777" /> },
        { label: 'מודול 03', title: 'עולם ה-Hybrid', body: 'שילוב וידאו AI בתוך פוטג׳ מצולם.', icon: <Share2 className="w-6 h-6" /> }
      ]
    },
    en: {
      pill: 'Edit & Post',
      heroTitle: 'Eye, Heart, Timeline.',
      heroSubtitle: 'For Creators ready to level up. Advanced editing techniques, rhythm mastery, and AI integration to turn raw footage into gold.',
      shiftLabel: 'Philosophy',
      shiftTitle: 'The Tool is just a Brush.',
      shiftBody: [
        'Great editing isn\'t about software complexity; it\'s about rhythm and emotion. I bring high-end After Effects logic into accessible tools like CapCut.',
        'Learn the art of "Invisible Magic"—seamless match-cuts, precision audio-driven editing, and blending generative elements into live-action footage.'
      ],
      methodLabel: 'Syllabus',
      methodTitle: 'The Hybrid Editor Arsenal.',
      methodSteps: [
        { label: 'Mod 01', title: 'Flow & Match-Cuts', body: 'Creating kinetic continuity between disparate shots.', icon: <Scissors className="w-6 h-6" />, anim: <MatchCutVisualizer color="#db2777" /> },
        { label: 'Mod 02', title: 'Audio-Driven Edit', body: 'Letting the waveform dictate the impact of the cut.', icon: <Music className="w-6 h-6" />, anim: <AudioWaveVisualizer color="#db2777" /> },
        { label: 'Mod 03', title: 'Hybrid Workflows', body: 'Seamlessly blending AI video into real footage.', icon: <Share2 className="w-6 h-6" /> }
      ]
    }
  },
  'gen-ai': {
    theme: { bg: '#f0fdf4', accent: '#059669', text: '#064e3b', secondary: '#a7f3d0' },
    words: ['Seed', 'Growth', 'Chaos', 'Nurture', 'Prompt', 'Latent', 'Space', 'Diffusion', 'Control', 'Upscale', 'Dream', 'Imagine', 'Iterate', 'Form', 'Style'],
    he: {
      pill: 'יצירה ג׳נרטיבית',
      heroTitle: 'לזרוע, לטפח, לגדל.',
      heroSubtitle: 'כניסה לעומק המכונה למתחילים. איך להפוך רעיון מופשט ליצירה ויזואלית עשירה ומדויקת.',
      shiftLabel: 'המהות',
      shiftTitle: 'אלכימיה דיגיטלית.',
      shiftBody: [
        'אנחנו לא סתם כותבים פקודות; אנחנו זורעים זרעים. כל יצירה היא דיאלוג עם הכאוס, ואנחנו המגדלים שבוררים את היופי מתוך הרעש.',
        'הקורס הזה מלמד את יסודות ה-Generative AI בצורה עמוקה: הבנה של איך המודל "חושב", שליטה במוטציות, והובלת המכונה לחזון שלכם.'
      ],
      methodLabel: 'תהליך הצמיחה',
      methodTitle: 'משליטה לכאוס ובחזרה.',
      methodSteps: [
        { label: 'שלב I', title: 'הזרעה (Seeding)', body: 'יסודות הפרומפטינג והקומפוזיציה.', icon: <Sparkles className="w-6 h-6" />, anim: <SeedGrowthVisualizer color="#059669" /> },
        { label: 'שלב II', title: 'מוטציה וטיפוח', body: 'ניהול וריאציות ובחירת ה-DNA הנכון.', icon: <Activity className="w-6 h-6" /> },
        { label: 'שלב III', title: 'שליטה (Control)', body: 'שימוש ברפרנסים וכלים מתקדמים לדיוק.', icon: <Target className="w-6 h-6" /> }
      ]
    },
    en: {
      pill: 'Generative Creation',
      heroTitle: 'Seed, Nurture, Grow.',
      heroSubtitle: 'Deep dive for beginners. Transform abstract ideas into rich, precise visual art through the latent space.',
      shiftLabel: 'Essence',
      shiftTitle: 'Digital Alchemy.',
      shiftBody: [
        'We don\'t just write commands; we plant seeds. Every generation is a dialogue with chaos, and we are the nurturers selecting beauty from the noise.',
        'This course teaches the fundamentals of Generative AI deeply: understanding how the model "thinks", mastering mutations, and guiding the machine to your specific vision.'
      ],
      methodLabel: 'Growth Process',
      methodTitle: 'From Chaos to Control.',
      methodSteps: [
        { label: 'Phase I', title: 'Seeding', body: 'Fundamentals of prompting and composition.', icon: <Sparkles className="w-6 h-6" />, anim: <SeedGrowthVisualizer color="#059669" /> },
        { label: 'Phase II', title: 'Mutation & Nurture', body: 'Managing variations and selecting the right DNA.', icon: <Activity className="w-6 h-6" /> },
        { label: 'Phase III', title: 'Control', body: 'Using references and advanced tools for precision.', icon: <Target className="w-6 h-6" /> }
      ]
    }
  }
};

// --- MAIN MODAL COMPONENT ---
export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, currentLang, onToggleLang }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Safe default fallback
  const courseId = course?.id && COURSE_DETAILS[course.id] ? course.id : 'marketing';
  const content = COURSE_DETAILS[courseId][currentLang];
  const theme = COURSE_DETAILS[courseId].theme;
  const words = COURSE_DETAILS[courseId].words;

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

  return (
    <div 
        className={`fixed inset-0 z-[100] flex flex-col transition-all duration-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} font-sans`} 
        style={{ backgroundColor: theme.bg, color: theme.text }} 
        dir={currentLang === 'he' ? 'rtl' : 'ltr'}
    >
      {/* --- HEADER --- */}
      <div className="w-full px-4 md:px-8 py-4 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 bg-opacity-80 border-b" style={{ borderColor: `${theme.accent}20`, backgroundColor: `${theme.bg}cc` }}>
        <button 
            onClick={() => { setIsVisible(false); setTimeout(onClose, 500); }} 
            className="group flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
            <div className="p-1 rounded-full border border-current"><X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /></div>
            <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">{currentLang === 'he' ? 'סגור' : 'Close'}</span>
        </button>
        
        <div className="flex items-center gap-4">
             <button 
                onClick={onToggleLang} 
                className="flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase hover:bg-black/5 transition-colors"
                style={{ borderColor: theme.accent }}
            >
                <Globe className="w-3 h-3" /> {currentLang === 'he' ? 'English' : 'עברית'}
            </button>
        </div>
      </div>

      {/* --- SCROLL CONTENT --- */}
      <div className="flex-grow overflow-y-auto no-scrollbar scroll-smooth">
        <div className="max-w-5xl mx-auto px-6 pb-32">
            
            {/* HERO */}
            <section className="min-h-[85vh] flex flex-col justify-center items-center text-center pt-12 relative">
                <div className="inline-flex px-4 py-1.5 rounded-full border text-[10px] font-bold tracking-[0.2em] uppercase mb-8 shadow-sm backdrop-blur-sm" 
                     style={{ borderColor: theme.accent, backgroundColor: `${theme.bg}ee`, color: theme.text }}>
                    {content.pill}
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter z-10 relative">
                    {content.heroTitle}
                </h1>
                
                <p className="text-lg md:text-2xl max-w-2xl font-medium leading-relaxed opacity-80 z-10 relative">
                    {content.heroSubtitle}
                </p>

                {/* 3D Interactive Cloud */}
                <div className="w-full max-w-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 md:opacity-40 pointer-events-auto mix-blend-multiply hover:mix-blend-normal transition-all duration-300 cursor-grab active:cursor-grabbing">
                    <InteractiveWordCloud words={words} color={theme.text} />
                </div>

                <div className="mt-auto pb-12 animate-bounce opacity-40">
                    <ChevronDown className="w-8 h-8" />
                </div>
            </section>

            {/* PHILOSOPHY / SHIFT */}
            <section className="py-24 grid md:grid-cols-12 gap-12 border-t" style={{ borderColor: `${theme.accent}30` }}>
                   <div className="md:col-span-4 space-y-4">
                       <span className="text-xs font-bold tracking-widest uppercase flex items-center gap-2" style={{ color: theme.accent }}>
                           <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }}/>
                           {content.shiftLabel}
                       </span>
                       <h2 className="text-4xl md:text-5xl font-black leading-none">{content.shiftTitle}</h2>
                   </div>
                   <div className="md:col-span-8 space-y-6 text-lg md:text-xl leading-relaxed opacity-80 font-light">
                       {content.shiftBody.map((p: string, i: number) => <p key={i}>{p}</p>)}
                   </div>
            </section>

            {/* SYLLABUS / METHOD */}
            <section className="py-12">
                 <div className="text-center mb-16 relative">
                     <span className="text-xs font-bold tracking-widest uppercase mb-4 block opacity-50">{content.methodLabel}</span>
                     <h2 className="text-4xl md:text-6xl font-black">{content.methodTitle}</h2>
                 </div>
                 
                 <div className="grid md:grid-cols-3 gap-6">
                     {content.methodSteps.map((step: any, i: number) => (
                         <div key={i} 
                              className="group p-8 rounded-3xl border bg-white/40 backdrop-blur-sm hover:bg-white transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col relative overflow-hidden"
                              style={{ borderColor: `${theme.accent}20` }}
                         >
                             {/* Hover Gradient Background */}
                             <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/0 group-hover:to-white/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                             
                             <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="p-3 rounded-2xl shadow-sm transition-colors group-hover:text-white" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                                    {React.cloneElement(step.icon, { className: "w-6 h-6" })}
                                </div>
                                <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{step.label}</span>
                             </div>
                             
                             <h3 className="text-2xl font-bold mb-3 relative z-10">{step.title}</h3>
                             <p className="text-sm opacity-70 mb-8 leading-relaxed relative z-10">{step.body}</p>
                             
                             {/* Embedded Visualizer */}
                             <div className="mt-auto pt-6 border-t border-dashed w-full" style={{ borderColor: `${theme.accent}30` }}>
                                {step.anim ? step.anim : <div className="h-12 w-full rounded bg-current opacity-5" />}
                             </div>
                         </div>
                     ))}
                 </div>
            </section>

            {/* CTA / FOOTER */}
            <section className="mt-24 py-16 px-8 md:px-16 rounded-[3rem] text-center md:text-left flex flex-col md:flex-row items-center gap-10 shadow-lg relative overflow-hidden group">
                {/* Background color block */}
                <div className="absolute inset-0 opacity-10 transition-transform duration-700 group-hover:scale-105" style={{ backgroundColor: theme.accent }} />
                
                <div className="relative z-10 shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                        {/* Placeholder for your image */}
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate-400">Your Img</div>
                    </div>
                </div>

                <div className="relative z-10 flex-grow">
                     <p className="text-2xl md:text-3xl font-bold mb-2 italic">
                        {currentLang === 'he' ? '"יצירה היא לא עבודה עם כלים, היא עבודה עם רגש."' : '"Creation is not about tools, it is about emotion."'}
                     </p>
                     <p className="text-sm uppercase tracking-widest opacity-60 font-bold mb-6">Eyal Izenman</p>
                     
                     <a href="https://wa.me/97236030603" target="_blank" rel="noreferrer" 
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all" 
                        style={{ backgroundColor: theme.accent }}
                     >
                        {currentLang === 'he' ? 'דברו איתי על הקורס' : 'Talk to me about the course'} 
                        <ArrowRight className="w-5 h-5" />
                     </a>
                </div>
            </section>
        </div>
      </div>
      
      {/* GLOBAL ANIMATIONS */}
      <style>{`
        @keyframes grow { from { stroke-dasharray: 0 100; } to { stroke-dasharray: 100 0; } }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
