import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Interface for Props ---
export interface CoursePageProps {
  currentLang: 'he' | 'en';
  onClose?: () => void;
}

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Content & Translations (Unchanged) ---
const translations = {
  en: {
    brand: 'Crack the Brief | Multimodal Workshop',
    close: 'Close',
    heroLabel: 'What Now',
    heroTitle: 'Everything happens at once.',
    heroSubtitle: 'Cracking the brief in the multimodal space. A deep-dive workshop in strategy, creative, and visual development in the age of Generative AI.',
    shiftLabel: 'Paradigm',
    shiftTitle: 'The shift: from "copy here, visual there" to one unified canvas.',
    shiftBody1: 'Most of the industry still works in a "divide and fragment" mindset. Copy in one tab, images in another, and the original brief gets lost somewhere in the middle. The result: friction. Too many technical handoffs, not enough continuous creation.',
    shiftBody2: 'This workshop moves you into a unified workflow. Forget ping-ponging between tools. We work on a single generative canvas, where written strategy and visual output evolve side by side.',
    methodLabel: 'Recipe',
    methodTitle: 'The methodology: from brief to video in 4 movements.',
    methodIntro: 'A structured workflow that turns creative chaos into a precise pipeline.',
    steps: [
      { label: 'Movement I', title: 'Decode the brief into story-DNA', body: 'We begin by unpacking the brief into tone, tensions, emotional arc, and core images – before any prompt is written.' },
      { label: 'Movement II', title: 'Build the multimodal sketchbook', body: 'From that story-DNA we generate visual and textual sketches: multiple prompt directions, camera and composition ideas. Everything lives on one canvas.' },
      { label: 'Movement III', title: 'Refine into look & feel', body: 'We sift through the experiments, keep what sings, and shape a clear look & feel: color, texture, motion language. A visual direction everyone can recognize.' },
      { label: 'Movement IV', title: 'Compose the final piece', body: 'Finally we assemble the assets into a coherent flow: sequence of scenes, timing, typographic moments, sound and export strategy.' },
    ],
    outcomeLabel: 'Outcome',
    outcomeTitle: 'What you leave with',
    outcomeIntro: 'The workshop is designed so you don’t just understand the method in theory – you walk out with something concrete.',
    outcomes: [
      { title: 'A practical multimodal workflow', body: 'A repeatable process you can reuse with different tools and briefs, without starting from zero every time.' },
      { title: 'A live project in progress', body: 'A real piece – concept, board, or near-final video – built on top of your own material or an industry-style brief.' },
      { title: 'A shared language for the team', body: 'A vocabulary that connects strategy, copy, design and motion, so the process becomes more fluid.' },
    ],
    bioLabel: 'About me',
    bioName: 'Eyal Izenman',
    bioBody: 'Creator, animator, motion designer, and thought leader in the Generative AI space. With decades of weaving music, design and movement, Eyal works where human intuition meets algorithmic improvisation.',
    bioQuote: '“AI is not a tech trick – it is a full creative space. My goal is to help you surface the idea, refine it, and turn it into a complete visual asset – in one continuous breath.”',
    footerLine: 'The full pipeline: Brief ← Story DNA ← Language & style ← Mutation ← Refinement ← Moodboard ← Look & Feel ← Storyboard ← Video.',
    cta: 'Talk to me about the workshop',
  },
  he: {
    brand: 'לפצח את הבריף | סדנה לעבודה מולטימודלית',
    close: 'סגור',
    heroLabel: 'מה עכשיו',
    heroTitle: 'הכל קורה בבת אחת.',
    heroSubtitle: 'סדנה מעמיקה בפיצוח בריפים במרחב המולטימודלי – אסטרטגיה, קריאייטיב ופיתוח חזותי בעידן ה-AI הגנרטיבי.',
    shiftLabel: 'פרדיגמה',
    shiftTitle: 'המעבר: מטקסט פה וויז׳ואל שם – לקנבס אחד מאוחד.',
    shiftBody1: 'רוב התעשייה עדיין עובדת בפיצול: טקסט בחלון אחד, תמונות באחר, והבריף המקורי הולך לאיבוד באמצע. התוצאה: חיכוך אינסופי, יותר מדי העברות, מעט מדי יצירה רציפה.',
    shiftBody2: 'בסדנה אנחנו עוברים לקנבס גנרטיבי אחד, שבו שפה, רעיון ותמונה מתפתחים יחד – במקום להתרוצץ בין כלים וחלונות שונים.',
    methodLabel: 'מתכון',
    methodTitle: 'המתודולוגיה: מבריף לווידאו בארבעה מהלכים.',
    methodIntro: 'תהליך מובנה שמארגן את הכאוס היצירתי לצינור עבודה ברור.',
    steps: [
      { label: 'מהלך I', title: 'פירוק הבריף ל-DNA של סיפור', body: 'מתחילים בתרגום הבריף לעמוד שדרה סיפורי: טון, מתחים, קשת רגשית ותמונות מרכזיות – עוד לפני שנכתבת מילה אחת של פרומפט.' },
      { label: 'מהלך II', title: 'מחברת הסקיצות המולטימודלית', body: 'מה-DNA הסיפורי אנחנו מייצרים סקיצות – וריאציות של פרומפטים, בחירות מצלמה וקומפוזיציה, קצב וטיפוגרפיה – כולן חיות על אותו קנבס.' },
      { label: 'מהלך III', title: 'ממוּדבורד ללוק & פיל', body: 'מצמצמים את הרעש לאסתטיקה ממוקדת: צבע, טקסטורות, חתימת תנועה. המטרה: לוק & פיל שכולם יכולים לזהות כ״זה שלנו״.' },
      { label: 'מהלך IV', title: 'הלחנת היצירה הסופית', body: 'מסדרים הכול בזמן: סדר סצנות, קצב, רגעים טיפוגרפיים, סאונד ואסטרטגיית אקספורט – מפריים ראשון ועד אחרון.' },
    ],
    outcomeLabel: 'תוצאה',
    outcomeTitle: 'עם מה אתם יוצאים מהסדנה',
    outcomeIntro: 'המטרה היא שלא תצאו רק עם השראה – אלא עם מתודה ועם התחלה של יצירה משלכם.',
    outcomes: [
      { title: 'מתודה מולטימודלית מעשית', body: 'תהליך עבודה שניתן לשחזר על בריפים שונים וכלים משתנים, בלי להתחיל מאפס בכל פעם שיוצאת פלטפורמה חדשה.' },
      { title: 'פרויקט חי בתהליך', body: 'קונספט, סקיצה או וידאו כמעט סופי – שנבנים על בסיס חומר שלכם או בריף משותף שעובדים עליו בסדנה.' },
      { title: 'שפה משותפת לצוות', body: 'שפה שמחברת בין אסטרטגיה, קופי, עיצוב ותנועה – כך שהתהליך הופך זורם יותר ופחות מפוצל.' },
    ],
    bioLabel: 'עליי',
    bioName: 'איל איזנמן',
    bioBody: 'יוצר, מנפיש ומעצב תנועה, מהקולות הבולטים בישראל בשדה ה-AI היצירתי. שוזר יחד מוזיקה, עיצוב ותנועה למרחבים גנרטיביים.',
    bioQuote: '״AI הוא לא טריק טכנולוגי – הוא מרחב יצירתי שלם. המטרה שלי היא לעזור לך לזקק את הרעיון ולהפוך אותו לנכס חזותי שלם, בנשימה אחת רציפה.״',
    footerLine: 'הצינור המלא: בריף ← DNA של סיפור ← שפה וסגנון ← מוטציות ← ליטוש ← מוּדבורד ← לוק & פיל ← סטוריבורד ← וידאו.',
    cta: 'דברו איתי על הסדנה',
  }
};

const words = [
  'ferment', 'distill', 'dream', 'style', 'composition', 'palette',
  'story', 'motive', 'theme', 'color', 'emotion', 'texture',
  'draft', 'mutation', 'refinement', 'prompt', 'camera', 'lens',
  'sound', 'motion', 'layout', 'cut', 'transition', 'timing',
  'vision', 'aesthetic', 'craft', 'form', 'content', 'meaning',
  'intention', 'expression', 'detail', 'gesture', 'spirit'
];

// --- Sub-Components ---

// Simple Pseudo-Random Number Generator for consistent vine patterns
const seedRandom = (seed: number) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 1D Noise for organic wandering
const noise = (x: number, seed: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const mix = (a: number, b: number, t: number) => a * (1 - t) + b * t;
  return mix(seedRandom(i + seed), seedRandom(i + 1 + seed), f * f * (3 - 2 * f));
};

interface Branch {
  points: {x: number, y: number}[];
  color: string;
  width: number;
  startProgress: number; // When does this branch start drawing (0-1)
  endProgress: number;   // When does it finish (0-1)
}

/** 
 * Fractal Vine Scroll Trace 
 */
const ScrollTraceCanvas = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use scroll of the specific container, not window
  const { scrollYProgress } = useScroll({ container: containerRef });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 });
  
  // Memoize tree structure to prevent regeneration on re-render
  const branches = useMemo(() => {
    const list: Branch[] = [];
    const colors = [
      'rgba(255, 159, 85, 0.65)', // Orange
      'rgba(244, 114, 182, 0.55)', // Rose
      'rgba(34, 211, 238, 0.5)'    // Cyan
    ];

    // Helper to generate a path
    const generatePath = (
      startX: number, 
      startY: number, 
      length: number, 
      angleBase: number, 
      startP: number,
      endP: number,
      width: number,
      color: string,
      seed: number
    ) => {
      const points = [];
      const segments = 100;
      
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const y = startY + t * length;
        
        // Organic wander using noise
        const drift = (noise(t * 3, seed) - 0.5) * 150; 
        const wave = Math.sin(t * 10 + seed) * 20;
        
        // Bias towards angle
        const xOffset = Math.sin(angleBase) * (t * length * 0.3);
        
        points.push({ x: startX + drift + wave + xOffset, y: y });
      }
      return { points, color, width, startProgress: startP, endProgress: endP };
    };

    // 1. Main Root (Thick)
    list.push(generatePath(200, 0, 2500, 0, 0, 1, 4, colors[0], 100));

    // 2. Splits
    // Split 1 at 15%
    list.push(generatePath(220, 300, 1000, 0.5, 0.15, 0.6, 2.5, colors[1], 200));
    // Split 2 at 35%
    list.push(generatePath(180, 800, 1200, -0.4, 0.35, 0.85, 2.5, colors[2], 300));
    // Split 3 at 60%
    list.push(generatePath(240, 1400, 800, 0.8, 0.6, 1.0, 2, colors[0], 400));
    
    // 3. Micro splits (Details)
    list.push(generatePath(200, 500, 400, -0.8, 0.2, 0.4, 1.5, colors[2], 500));
    list.push(generatePath(250, 1100, 500, 0.6, 0.45, 0.65, 1.5, colors[1], 600));

    return list;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const progress = smoothScroll.get(); // 0 to 1 based on container scroll

      // Global scale to fit the "virtual height" of paths into current screen if needed
      // But we want them to stay fixed relative to content? 
      // User requested "advances as we scroll".
      // We translate the canvas up slightly to simulate camera movement or keep it fixed?
      // Best effect: Fixed background, drawing progressively.
      
      // Center the coordinate system roughly
      ctx.save();
      // Optional: Parallax shift. const yShift = -progress * 200; 
      // ctx.translate(width * 0.1, yShift); // Shift slightly left

      // For responsivity, ensure startX matches screen width somewhat
      const xBase = width < 768 ? width * 0.1 : width * 0.15;
      
      branches.forEach(branch => {
        // Calculate how much of THIS branch is visible
        // Map global progress to branch's specific timeline
        if (progress < branch.startProgress) return;

        const branchDuration = branch.endProgress - branch.startProgress;
        const branchLocalProgress = Math.min(1, (progress - branch.startProgress) / branchDuration);
        
        const visiblePointsCount = Math.floor(branchLocalProgress * branch.points.length);
        if (visiblePointsCount < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = branch.color;
        ctx.lineWidth = branch.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw path
        // Offset X dynamically based on screen size
        const p0 = branch.points[0];
        ctx.moveTo(p0.x + xBase - 200, p0.y); // -200 to offset the hardcoded generation X

        for (let i = 1; i < visiblePointsCount; i++) {
          const p = branch.points[i];
          ctx.lineTo(p.x + xBase - 200, p.y);
        }
        ctx.stroke();

        // Draw Glowing Tip
        if (branchLocalProgress < 1.0) {
           const tip = branch.points[visiblePointsCount - 1];
           ctx.shadowBlur = 15;
           ctx.shadowColor = branch.color;
           ctx.fillStyle = '#fff';
           ctx.beginPath();
           ctx.arc(tip.x + xBase - 200, tip.y, branch.width * 1.5, 0, Math.PI * 2);
           ctx.fill();
           ctx.shadowBlur = 0;
        }
      });

      ctx.restore();
      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    const animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [branches, smoothScroll]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[-1]" />;
};

/** 3D Word Cloud (Canvas) */
const WordCloud = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    
    let particles = words.map(() => ({ x: 0, y: 0, z: 0, word: '' }));
    let rotX = 0;
    let rotY = 0;
    
    const initParticles = () => {
      const baseRadius = Math.min(width, height) * 0.35;
      const aspectRatio = width / height;
      const xSpread = aspectRatio > 1.2 ? 1.3 : 1.0; 

      particles = words.map(word => {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        return {
          word,
          x: (baseRadius * Math.sin(phi) * Math.cos(theta)) * xSpread,
          y: baseRadius * Math.sin(phi) * Math.sin(theta),
          z: baseRadius * Math.cos(phi)
        };
      });
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement?.clientWidth || 300;
      height = canvas.parentElement?.clientHeight || 400;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    let isDragging = false;
    let lastMouse = { x: 0, y: 0 };
    let momentum = { x: 0.0005, y: 0.001 };

    const rotatePoint = (p: typeof particles[0], rx: number, ry: number) => {
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const tx = p.x * cosY - p.z * sinY;
      const tz = p.z * cosY + p.x * sinY;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const ty = p.y * cosX - tz * sinX;
      const fz = tz * cosX + p.y * sinX;

      return { ...p, x: tx, y: ty, z: fz };
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      if (!isDragging) {
        rotY += momentum.y;
        rotX += momentum.x;
        momentum.x *= 0.98; 
        momentum.y *= 0.98;
        rotY += 0.002; 
        rotX += 0.001;
      }

      const sorted = particles.map(p => rotatePoint(p, rotX, rotY)).sort((a, b) => a.z - b.z);

      sorted.forEach(p => {
        const scale = 600 / (600 + p.z);
        const alpha = 0.3 + scale * 0.6;
        const fontSize = 14 + scale * 8;
        
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.font = `${fontSize}px Heebo, sans-serif`;
        ctx.fillStyle = '#5a3418';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.word, width / 2 + p.x * scale, height / 2 + p.y * scale);
        ctx.restore();
      });

      requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    
    const onDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const c = 'touches' in e ? e.touches[0] : e;
      lastMouse = { x: c.clientX, y: c.clientY };
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const c = 'touches' in e ? e.touches[0] : e;
      const dx = c.clientX - lastMouse.x;
      const dy = c.clientY - lastMouse.y;
      lastMouse = { x: c.clientX, y: c.clientY };
      rotY += dx * 0.005;
      rotX += dy * 0.005;
      momentum = { x: dy * 0.0005, y: dx * 0.0005 };
    };
    const onUp = () => isDragging = false;

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown);
    canvas.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);

    const raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" style={{ width: '100%', height: '100%' }} />;
};

/** Animated Section Wrapper */
const FadeIn = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/** Pill Component */
const Pill = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/50 border border-orange-300/40 text-[#5a3418] uppercase tracking-widest text-xs font-medium mb-4">
    {children}
  </div>
);

// --- Main Component ---
export const MarketingCourse: React.FC<CoursePageProps> = ({ currentLang, onClose }) => {
  const [lang, setLang] = useState<'en' | 'he'>(currentLang || 'he');
  // New ref for the scrollable container
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (currentLang) setLang(currentLang);
  }, [currentLang]);

  const t = translations[lang];
  const isRtl = lang === 'he';

  return (
    // FULLSCREEN WRAPPER FOR SCROLL ISOLATION
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto font-sans text-[#2d1c0d] selection:bg-orange-200 selection:text-orange-900 isolate",
        isRtl ? "rtl" : "ltr"
      )}
      dir={isRtl ? "rtl" : "ltr"}
      style={{
        background: 'linear-gradient(135deg, #fff7e8 0%, #ffe8c7 50%, #fff4d9 100%)',
      }}
    >
      {/* Background Blobs - z-index -2 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-2]">
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-orange-200/40 rounded-full blur-[80px]" 
        />
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] bg-rose-200/40 rounded-full blur-[80px]" 
        />
      </div>

      {/* Scroll Trace - z-index -1 - Passing containerRef to link scroll logic! */}
      <ScrollTraceCanvas containerRef={containerRef} />

      {/* Header - z-index 50 */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#fff7e8]/80 backdrop-blur-md border-b border-orange-200/30">
        <div className="flex items-center gap-4">
          {onClose && (
             <button 
               onClick={onClose} 
               className="p-2 rounded-full hover:bg-black/5 transition-colors text-stone-700"
               aria-label={t.close}
             >
               <X className="w-6 h-6" />
             </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/10 relative">
               <video src="https://assets.codepen.io/t-1/optopia-eye.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" /> 
               <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-rose-400 opacity-50 mix-blend-overlay" />
            </div>
            <span className="font-bold text-sm tracking-wide uppercase hidden sm:block">{t.brand}</span>
          </div>
        </div>

        <div className="flex items-center p-1 rounded-full bg-white/50 border border-orange-200/40 shadow-sm backdrop-blur-sm">
          <button 
            onClick={() => setLang('en')}
            className={cn("px-3 py-1 text-xs font-bold rounded-full transition-all", lang === 'en' ? "bg-gradient-to-br from-orange-300 to-orange-400 text-white shadow-md" : "text-stone-600 hover:bg-orange-50")}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('he')}
            className={cn("px-3 py-1 text-xs font-bold rounded-full transition-all", lang === 'he' ? "bg-gradient-to-br from-orange-300 to-orange-400 text-white shadow-md" : "text-stone-600 hover:bg-orange-50")}
          >
            HE
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* HERO SECTION */}
        <section className="min-h-[85vh] grid lg:grid-cols-2 gap-12 items-center mb-24">
          <FadeIn>
            <Pill>{t.heroLabel}</Pill>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[0.95] tracking-tight text-[#301b0f]">
              {t.heroTitle}
            </h1>
            <p className="text-xl text-[#6b4c32] leading-relaxed max-w-lg">
              {t.heroSubtitle}
            </p>
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-12 opacity-40"
            >
              <ChevronDown className="w-8 h-8" />
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.2} className="h-[50vh] lg:h-[600px] w-full relative z-30">
            {/* Visual Container */}
            <div className="w-full h-full rounded-3xl border border-white/20 shadow-2xl bg-gradient-to-br from-cyan-50/20 to-white/10 backdrop-blur-md relative overflow-hidden group z-30">
              <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-cyan-200/40 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-[20%] right-[20%] w-40 h-40 bg-orange-200/30 rounded-full blur-2xl animate-pulse delay-700" />
              <WordCloud />
            </div>
          </FadeIn>
        </section>

        {/* SHIFT SECTION */}
        <section className="mb-32">
          <FadeIn className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <Pill>{t.shiftLabel}</Pill>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#301b0f]">
                {t.shiftTitle}
              </h2>
            </div>
            <div className="space-y-6 text-lg text-[#6b4c32] relative pl-8 border-l-2 border-orange-300/50">
              <p>{t.shiftBody1}</p>
              <p>{t.shiftBody2}</p>
            </div>
          </FadeIn>
        </section>

        {/* METHODOLOGY */}
        <section className="mb-32">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <Pill>{t.methodLabel}</Pill>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#301b0f]">{t.methodTitle}</h2>
            <p className="text-xl text-[#6b4c32]">{t.methodIntro}</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1} className="group">
                <div className="h-full bg-[#fff5e3]/80 backdrop-blur-md p-6 rounded-2xl border border-orange-200/30 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-200/30 text-orange-900 text-xs font-bold mb-4">
                    {step.label}
                  </span>
                  <h3 className="text-xl font-bold mb-3 leading-tight">{step.title}</h3>
                  <p className="text-[#6b4c32] text-sm leading-relaxed">{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="mb-32">
          <FadeIn>
            <Pill>{t.outcomeLabel}</Pill>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#301b0f]">{t.outcomeTitle}</h2>
            <p className="text-xl text-[#6b4c32] mb-12 max-w-2xl">{t.outcomeIntro}</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {t.outcomes.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} className="bg-white/60 p-8 rounded-2xl border border-white/40 shadow-sm">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-[#6b4c32]">{item.body}</p>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* BIO & FOOTER */}
        <section className="bg-white/40 rounded-3xl p-8 md:p-12 border border-white/50 backdrop-blur-lg">
          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start mb-16">
            <FadeIn>
               <div className="w-32 h-44 md:w-40 md:h-56 rounded-2xl overflow-hidden bg-stone-200 shadow-xl rotate-[-2deg] border-4 border-white">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1zIWiopYxC_J4r-Ns4VmFvCXaLPZFmK4k=s2000?authuser=0" 
                    alt={t.bioName} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                  />
               </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Pill>{t.bioLabel}</Pill>
              <h2 className="text-3xl font-bold mb-4">{t.bioName}</h2>
              <p className="text-lg text-[#6b4c32] mb-6 leading-relaxed">{t.bioBody}</p>
              <div className="pl-6 border-l-4 border-orange-400 bg-[#fff8e8] p-4 rounded-r-xl italic text-[#5a3418]">
                {t.bioQuote}
              </div>
            </FadeIn>
          </div>

          <FadeIn className="text-center pt-8 border-t border-orange-200/30">
            <p className="text-sm font-medium text-orange-900/60 mb-8 max-w-3xl mx-auto">
              {t.footerLine}
            </p>
            
            <a 
              href="https://api.whatsapp.com/send/?phone=97236030603"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-400 to-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-300/40 hover:scale-105 hover:shadow-orange-300/60 transition-all duration-300 group"
            >
              {t.cta}
              {isRtl ? <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </a>
          </FadeIn>
        </section>
      </main>
    </div>
  );
};
