// components/courses/GenAICourse.tsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, X, Brain, Wand2, Layers, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CoursePageProps {
  currentLang: 'he' | 'en';
  onClose?: () => void;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const translations = {
  en: {
    brand: 'Gen AI Masterclass',
    close: 'Close',
    heroLabel: 'The New Literacy',
    heroTitle: 'Dream with open eyes.',
    heroSubtitle: 'A journey into the Generative AI revolution. Master the tools that transform text into worlds, and ideas into reality.',
    introLabel: 'The Shift',
    introTitle: 'From Creator to Director',
    introBody: 'Generative AI is not about replacing the artist; it is about expanding the canvas. In this course, we move beyond basic prompting into the "Latent Space"—learning how to steer these powerful models to create exactly what is in your mind.',
    modulesLabel: 'Curriculum',
    modulesTitle: 'Taming the Machine',
    modules: [
      { icon: Brain, title: 'The LLM Mindset', body: 'Understanding how models think. Advanced prompt engineering, context windows, and dialogue strategy.' },
      { icon: Wand2, title: 'Visual Alchemy', body: 'generative tools mastery. Composition, lighting, styling, and consistent character generation.' },
      { icon: Layers, title: 'Motion & Video', body: 'Bringing statics to life. Runway, Pika, and the emerging workflow of AI cinematography.' },
      { icon: Zap, title: 'The Synthesis', body: 'Combining tools. Text-to-Image-to-Video-to-Sound. Building complete multimedia assets.' },
    ],
    audienceLabel: 'Who is this for?',
    audienceTitle: 'For Visionaries',
    audienceBody: 'Designed for beginners ready to dive deep, and intermediate creators looking to professionalize their workflow. Perfect for 1:1 mentorship or small creative teams.',
    cta: 'Start your Journey',
  },
  he: {
    brand: 'כיתת אמן Gen AI',
    close: 'סגור',
    heroLabel: 'השפה החדשה',
    heroTitle: 'לחלום בעיניים פקוחות.',
    heroSubtitle: 'מסע אל מהפכת ה-Generative AI. שליטה בכלים שהופכים טקסט לעולמות, ורעיונות למציאות חזותית.',
    introLabel: 'השינוי',
    introTitle: 'מיוצר לבמאי',
    introBody: 'בינה מלאכותית גנרטיבית לא מחליפה את האמן – היא מרחיבה את הקנבס. בקורס הזה נצלול אל מעבר לפרומפטים בסיסיים, אל תוך ה"Latent Space", ונלמד איך לכוון את המודלים העוצמתיים הללו כדי לייצר בדיוק את מה שיש לכם בראש.',
    modulesLabel: 'תוכנית הלימודים',
    modulesTitle: 'לאלף את המכונה',
    modules: [
      { icon: Brain, title: 'תודעת ה-LLM', body: 'להבין איך המודל חושב. הנדסת פרומפטים מתקדמת, חלונות הקשר ואסטרטגיית דיאלוג.' },
      { icon: Wand2, title: 'אלכימיה חזותית', body: 'שליטה ב-כלים ג'נרטיביים. קומפוזיציה, תאורה, סגנון ושמירה על עקביות דמויות.' },
      { icon: Layers, title: 'תנועה ווידאו', body: 'להפיח חיים בסטילס. Runway, Pika, וזרימת העבודה החדשה של סינמטוגרפיה מבוססת AI.' },
      { icon: Zap, title: 'הסינתזה', body: 'שילוב כלים. מטקסט לתמונה, לווידאו, לסאונד. בניית נכסים מולטימדיה שלמים.' },
    ],
    audienceLabel: 'למי זה מתאים?',
    audienceTitle: 'לאנשי חזון',
    audienceBody: 'מיועד למתחילים שרוצים לצלול לעומק, וליוצרים בינוניים שרוצים למקצע את תהליך העבודה. מושלם לליווי 1:1 או צוותים קריאייטיביים קטנים.',
    cta: 'בואו נדבר על הקורס',
  }
};

/**
 * "Neural Network" Scroll Trace
 * Nodes appear and connect as you scroll.
 */
const NeuralTraceCanvas = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // Generate fixed nodes
  const nodes = useMemo(() => {
    const list = [];
    // Zig zag pattern down the screen
    for (let i = 0; i < 25; i++) {
      list.push({
        x: (i % 2 === 0 ? 0.2 : 0.8) + (Math.random() - 0.5) * 0.2, // normalized x
        y: i * 0.04 + 0.05, // normalized y (spread over vertical space)
        size: Math.random() * 3 + 2
      });
    }
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
      const progress = smoothScroll.get();

      // We interpret scroll progress as "how deep into the network we are"
      // We scale the network so it scrolls WITH the content roughly
      // But purely for visual effect, let's keep nodes fixed relative to viewport 
      // and light them up based on scroll, OR have them scroll up.
      // Let's have them Fixed, but "activate" sequence based on scroll.

      const activeIndex = Math.floor(progress * nodes.length * 1.2); 

      // Draw connections first
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)'; // Violet
      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length - 1; i++) {
        const curr = nodes[i];
        const next = nodes[i+1];
        
        // Convert normalized to pixels
        const cx = curr.x * width;
        const cy = curr.y * height * 3 - (progress * height * 2); // Parallax scroll up
        const nx = next.x * width;
        const ny = next.y * height * 3 - (progress * height * 2);

        // Only draw connection if both are "active" or close to active
        if (i < activeIndex) {
            ctx.moveTo(cx, cy);
            ctx.lineTo(nx, ny);
        }
      }
      ctx.stroke();

      // Draw Nodes
      nodes.forEach((node, i) => {
        const nx = node.x * width;
        const ny = node.y * height * 3 - (progress * height * 2);
        
        const isActive = i <= activeIndex;
        const alpha = isActive ? 1 : 0.2;
        
        ctx.beginPath();
        ctx.fillStyle = isActive ? `rgba(255, 100, 200, ${alpha})` : `rgba(167, 139, 250, ${alpha})`;
        ctx.arc(nx, ny, node.size, 0, Math.PI * 2);
        ctx.fill();

        if (isActive) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 100, 200, 0.8)';
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
      });

      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    const anim = requestAnimationFrame(draw);
    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(anim);
    }
  }, [nodes, smoothScroll]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[-1]" />;
};

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export const GenAICourse: React.FC<CoursePageProps> = ({ currentLang, onClose }) => {
  const [lang, setLang] = useState<'en' | 'he'>(currentLang || 'he');
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { if (currentLang) setLang(currentLang); }, [currentLang]);
  
  const t = translations[lang];
  const isRtl = lang === 'he';

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto font-sans text-slate-900 selection:bg-purple-200 selection:text-purple-900 isolate",
        isRtl ? "rtl" : "ltr"
      )}
      dir={isRtl ? "rtl" : "ltr"}
      style={{
        background: 'linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 50%, #fae8ff 100%)', // Light Purple/Indigo mix
      }}
    >
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-2]">
         <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-300/30 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-300/30 rounded-full blur-[100px]" />
      </div>

      <NeuralTraceCanvas containerRef={containerRef} />

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-indigo-100">
        <div className="flex items-center gap-4">
          {onClose && (
             <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-700">
               <X className="w-6 h-6" />
             </button>
          )}
          <div className="flex items-center gap-2 text-indigo-900">
             <Sparkles className="w-5 h-5" />
             <span className="font-bold text-sm uppercase tracking-wider">{t.brand}</span>
          </div>
        </div>
        <div className="flex items-center p-1 rounded-full bg-white/50 border border-indigo-100">
          <button onClick={() => setLang('en')} className={cn("px-3 py-1 text-xs font-bold rounded-full transition-all", lang === 'en' ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-indigo-50")}>EN</button>
          <button onClick={() => setLang('he')} className={cn("px-3 py-1 text-xs font-bold rounded-full transition-all", lang === 'he' ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-indigo-50")}>HE</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-20 relative z-10">
        
        {/* HERO */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center mb-20">
          <FadeIn>
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-widest mb-6 border border-purple-200">
              {t.heroLabel}
            </span>
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 pb-2">
              {t.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>
          </FadeIn>
        </section>

        {/* INTRO */}
        <section className="mb-32 grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                     <video autoPlay muted loop playsInline 
                        src="https://github.com/AvocadoHead/Eyal-Izenman-2026/raw/main/Assets/Puzzlement.mp4" 
                        className="w-full h-full object-cover"
                    ></video>                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent" />
                </div>
            </FadeIn>
            <FadeIn delay={0.2}>
                <h2 className="text-3xl font-bold mb-6 text-slate-800">{t.introTitle}</h2>
                <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-indigo-400 pl-6">
                    {t.introBody}
                </p>
            </FadeIn>
        </section>

        {/* CURRICULUM */}
        <section className="mb-32">
            <FadeIn>
                <div className="text-center mb-16">
                    <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm">{t.modulesLabel}</span>
                    <h2 className="text-4xl font-black text-slate-900 mt-2">{t.modulesTitle}</h2>
                </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-6">
                {t.modules.map((mod, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <div className="group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                                <mod.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">{mod.title}</h3>
                            <p className="text-slate-600">{mod.body}</p>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </section>

        {/* AUDIENCE & CTA */}
        <section className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <FadeIn>
                <h2 className="text-3xl font-bold mb-4">{t.audienceTitle}</h2>
                <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-10">{t.audienceBody}</p>
                <a 
                  href="https://api.whatsapp.com/send/?phone=97236030603"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform"
                >
                    {t.cta}
                    {isRtl ? <ArrowRight className="rotate-180" /> : <ArrowRight />}
                </a>
            </FadeIn>
        </section>

      </main>
    </div>
  );
};
