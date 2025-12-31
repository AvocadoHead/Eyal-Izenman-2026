import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { ChevronDown, ArrowRight, Video, Globe } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Content & Translations ---
const translations = {
  en: {
    brand: 'Crack the Brief | Multimodal Workshop',
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

/** Background Scroll Trace (Canvas) */
const ScrollTraceCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  // Smooth out the scroll value
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 15, mass: 0.5 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate random path points once
    const generatePoints = () => {
      const segments = 9;
      const pts = [];
      for (let i = 0; i < segments; i++) {
        const t = i / (segments - 1);
        let y = t + (Math.random() - 0.5) * 0.08;
        y = Math.min(1, Math.max(0, y));
        // Snake bias
        const bias = i % 2 === 0 ? 0.75 : 0.25;
        let x = bias + (Math.random() - 0.5) * 0.25;
        x = Math.min(0.95, Math.max(0.05, x));
        pts.push({ x, y });
      }
      return pts;
    };
    
    let tracePoints = generatePoints();
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight * 1.5; // taller than viewport
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const progress = smoothScroll.get();
      
      // Pastel paths config
      const paths = [
        { color: 'rgba(255, 200, 210, 0.6)', offset: -25 },
        { color: 'rgba(200, 220, 255, 0.55)', offset: 0 },
        { color: 'rgba(240, 210, 255, 0.5)', offset: 25 }
      ];

      const points = tracePoints.map(p => ({ x: p.x * width, y: p.y * height }));
      const totalSegs = points.length - 1;
      const visible = Math.min(progress * 1.2, 1);
      const segPos = visible * totalSegs;
      const fullSegs = Math.floor(segPos);
      const partialT = segPos - fullSegs;

      paths.forEach((pConf, idx) => {
        ctx.save();
        ctx.strokeStyle = pConf.color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = pConf.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(points[0].x + pConf.offset, points[0].y);

        for (let i = 0; i < totalSegs; i++) {
          if (i >= fullSegs + 1) break;
          
          const p0 = points[i];
          const p1 = points[i+1];
          const dx = p1.x - p0.x;
          const dy = p1.y - p0.y;
          const dist = Math.sqrt(dx*dx + dy*dy) || 1;
          
          // Slight wave
          const wave = Math.sin((i/totalSegs)*Math.PI*2 + idx) * dist * 0.1;
          const perpX = -dy/dist * wave;
          const perpY = dx/dist * wave;

          const cp1x = p0.x + dx*0.33 + perpX + pConf.offset;
          const cp1y = p0.y + dy*0.33 + perpY;
          const cp2x = p0.x + dx*0.66 + perpX + pConf.offset;
          const cp2y = p0.y + dy*0.66 + perpY;

          if (i < fullSegs) {
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1.x + pConf.offset, p1.y);
          } else {
             // Partial segment logic simplified for React perf
             const qx = p0.x + dx * partialT;
             const qy = p0.y + dy * partialT;
             ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, qx + pConf.offset, qy);
          }
        }
        ctx.stroke();
        ctx.restore();
      });
      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    const animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-80 mix-blend-multiply" />;
};

/** 3D Word Cloud (Canvas) */
const WordCloud = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // Cloud state
    let particles = words.map(() => ({ x: 0, y: 0, z: 0, word: '' }));
    let rotX = 0;
    let rotY = 0;
    
    const initParticles = () => {
      const radius = Math.min(width, height) * 0.35;
      particles = words.map(word => {
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

      // Auto rotation + momentum
      if (!isDragging) {
        rotY += momentum.y;
        rotX += momentum.x;
        momentum.x *= 0.98; // friction
        momentum.y *= 0.98;
        // base speed
        rotY += 0.002; 
        rotX += 0.001;
      }

      // Sort by Z for depth
      const sorted = particles.map(p => rotatePoint(p, rotX, rotY)).sort((a, b) => a.z - b.z);

      sorted.forEach(p => {
        const scale = 600 / (600 + p.z);
        const alpha = 0.3 + scale * 0.6;
        const fontSize = 14 + scale * 8;
        
        ctx.save();
        ctx.globalAlpha = alpha;
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
    
    // Interactions
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

  return <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
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
export const MultimodalWorkshop = () => {
  const [lang, setLang] = useState<'en' | 'he'>('he');
  const t = translations[lang];
  const isRtl = lang === 'he';

  return (
    <div 
      className={cn(
        "min-h-screen font-sans text-[#2d1c0d] overflow-x-hidden selection:bg-orange-200 selection:text-orange-900",
        isRtl ? "rtl" : "ltr"
      )}
      dir={isRtl ? "rtl" : "ltr"}
      style={{
        background: 'linear-gradient(135deg, #fff7e8 0%, #ffe8c7 50%, #fff4d9 100%)'
      }}
    >
      {/* Background Blobs (Amorphous Shapes) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
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

      <ScrollTraceCanvas />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 bg-[#fff7e8]/80 backdrop-blur-md border-b border-orange-200/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/10 relative">
             <video src="https://assets.codepen.io/t-1/optopia-eye.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" /> 
             {/* Fallback visual if video fails */}
             <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-rose-400 opacity-50 mix-blend-overlay" />
          </div>
          <span className="font-bold text-sm tracking-wide uppercase hidden sm:block">{t.brand}</span>
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

          <FadeIn delay={0.2} className="h-[50vh] lg:h-[600px] w-full relative">
            {/* Visual Container */}
            <div className="w-full h-full rounded-3xl border border-white/20 shadow-2xl bg-gradient-to-br from-cyan-50/20 to-white/10 backdrop-blur-sm relative overflow-hidden group">
              {/* Glowing orbs inside visual */}
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
               {/* Placeholder for Eyal's Image */}
               <div className="w-32 h-44 md:w-40 md:h-56 rounded-2xl overflow-hidden bg-stone-200 shadow-xl rotate-[-2deg] border-4 border-white">
                  <img src="https://assets.codepen.io/t-1/eyal.jpg" alt={t.bioName} className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500" />
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
