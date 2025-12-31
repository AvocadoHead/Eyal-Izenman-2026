// components/courses/VideoEditingCourse.tsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Film, ArrowRight, X, Scissors, Music, MonitorPlay, Zap, Aperture } from 'lucide-react';
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
    brand: 'Pro Video Editing',
    close: 'Close',
    heroLabel: 'Crafting Time',
    heroTitle: 'The invisible art.',
    heroSubtitle: 'Master the rhythm, structure, and polish of professional video editing. Move beyond software basics to storytelling mastery.',
    philosophyLabel: 'Philosophy',
    philosophyTitle: 'Sculpting in Time',
    philosophyBody: 'Great editing is not just about cutting footage; it is about manipulating time and emotion. In this course for small groups, we deconstruct the "Invisible Cut"—learning how to guide the viewer\'s eye and heart without them ever noticing your hand.',
    modulesLabel: 'The Toolkit',
    modulesTitle: 'Precision & Flow',
    modules: [
      { icon: Scissors, title: 'The Grammar of the Cut', body: 'J-cuts, L-cuts, matching action, and pacing. When to hold, when to cut.' },
      { icon: Music, title: 'Sound Design & Rhythm', body: 'Editing to the beat. Soundscapes, foley, and mixing as narrative tools.' },
      { icon: MonitorPlay, title: 'Visual Storytelling', body: 'Structuring a narrative arc. Montage theory and Kuleshov effect applied to modern content.' },
      { icon: Zap, title: 'The Polish', body: 'Color grading basics, motion graphics integration, and export standards.' },
    ],
    cta: 'Master the Cut',
  },
  he: {
    brand: 'עריכת וידאו מקצועית',
    close: 'סגור',
    heroLabel: 'לפסל בזמן',
    heroTitle: 'האמנות הבלתי נראית.',
    heroSubtitle: 'שליטה בקצב, במבנה ובליטוש של עריכת וידאו מקצועית. מעבר לתוכנה – אל תוך הלב של הסיפור.',
    philosophyLabel: 'פילוסופיה',
    philosophyTitle: 'פיסול בזמן',
    philosophyBody: 'עריכה מעולה היא לא רק חיתוך חומרי גלם; היא מניפולציה של זמן ורגש. בקורס זה לקבוצות קטנות, נפרק לגורמים את "החיתוך הבלתי נראה" – נלמד איך להוביל את העין והלב של הצופה מבלי שהוא ירגיש את יד העורך.',
    modulesLabel: 'ארגז הכלים',
    modulesTitle: 'דיוק וזרימה',
    modules: [
      { icon: Scissors, title: 'דקדוק העריכה', body: 'J-cuts, L-cuts, חיתוך בתנועה וקצב. מתי להחזיק שוט ומתי לחתוך.' },
      { icon: Music, title: 'עיצוב סאונד וקצב', body: 'עריכה על הביט. סאונדסקייפ, פולי, ומיקס ככלי סיפורי.' },
      { icon: MonitorPlay, title: 'סיפור חזותי', body: 'בניית קשת עלילתית. תיאוריית המונטאז׳ ואפקט קולשוב בתוכן מודרני.' },
      { icon: Zap, title: 'הליטוש הסופי', body: 'יסודות תיקוני הצבע (Color), שילוב מושן גרפיקס וסטנדרטים לייצוא.' },
    ],
    cta: 'לשלוט בעריכה',
  }
};

/**
 * "Timeline" Scroll Trace
 * A vertical playhead with clips appearing on tracks.
 */
const TimelineTraceCanvas = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // Pre-generate "Clips"
  const clips = useMemo(() => {
    const list = [];
    const count = 40;
    for (let i = 0; i < count; i++) {
      list.push({
        y: i * 0.03 + 0.05, // Vertical position
        width: Math.random() * 0.3 + 0.1, // Clip length
        track: i % 3, // 0 = Video 1, 1 = Video 2, 2 = Audio
        color: i % 3 === 2 ? '#10b981' : (i % 2 === 0 ? '#3b82f6' : '#6366f1') // Green (audio), Blue, Indigo
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

      // Timeline Center Line (Playhead)
      const centerX = width * 0.15; // Left aligned timeline
      
      // Draw Tracks Background
      ctx.fillStyle = 'rgba(0,0,0,0.02)';
      ctx.fillRect(centerX - 10, 0, 100, height);

      // Draw Center Line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      // Draw Clips based on scroll
      // We shift the whole timeline UP as we scroll
      const scrollOffset = progress * height * 3;

      clips.forEach((clip) => {
        const yPos = (clip.y * height * 4) - scrollOffset + (height * 0.5); // Start lower down
        
        // Don't draw if off screen
        if (yPos < -100 || yPos > height + 100) return;

        // Animate clip width based on if it passed the "playhead" (center screen)
        // Actually let's just show them fixed
        const clipX = centerX + 10 + (clip.track * 15);
        const clipW = clip.width * width * 0.5;
        const clipH = clip.track === 2 ? 8 : 20; // Audio thin, Video thick

        ctx.fillStyle = clip.color;
        
        // Rounded rect logic simplified
        ctx.globalAlpha = 0.8;
        ctx.fillRect(clipX, yPos, clipW, clipH);
        
        // Add "waveform" lines for audio track
        if (clip.track === 2) {
             ctx.fillStyle = 'rgba(255,255,255,0.5)';
             for(let k=0; k<clipW; k+=4) {
                 const h = Math.random() * 6;
                 ctx.fillRect(clipX + k, yPos + 1 + (3-h/2), 2, h);
             }
        }
      });
      
      // Draw Red Playhead (Fixed at center vertically?)
      // Or maybe strictly at the top like a real timeline?
      // Let's make a "Current Time" indicator
      // ctx.strokeStyle = '#ef4444';
      // ctx.lineWidth = 2;
      // ctx.beginPath();
      // ctx.moveTo(centerX - 20, height/2);
      // ctx.lineTo(width, height/2);
      // ctx.stroke();

      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    const anim = requestAnimationFrame(draw);
    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(anim);
    }
  }, [clips, smoothScroll]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[-1]" />;
};

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export const VideoEditingCourse: React.FC<CoursePageProps> = ({ currentLang, onClose }) => {
  const [lang, setLang] = useState<'en' | 'he'>(currentLang || 'he');
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { if (currentLang) setLang(currentLang); }, [currentLang]);
  
  const t = translations[lang];
  const isRtl = lang === 'he';

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900 isolate",
        isRtl ? "rtl" : "ltr"
      )}
      dir={isRtl ? "rtl" : "ltr"}
      style={{
        background: '#fafafa', // Clean, sharp background
        color: '#171717'
      }}
    >
      <TimelineTraceCanvas containerRef={containerRef} />

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          {onClose && (
             <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-700">
               <X className="w-6 h-6" />
             </button>
          )}
          <div className="flex items-center gap-2 text-slate-900">
             <Aperture className="w-5 h-5" />
             <span className="font-bold text-sm uppercase tracking-wider">{t.brand}</span>
          </div>
        </div>
        <div className="flex items-center p-1 rounded-full bg-slate-100 border border-slate-200">
          <button onClick={() => setLang('en')} className={cn("px-3 py-1 text-xs font-bold rounded-full transition-all", lang === 'en' ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-white")}>EN</button>
          <button onClick={() => setLang('he')} className={cn("px-3 py-1 text-xs font-bold rounded-full transition-all", lang === 'he' ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-white")}>HE</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20 relative z-10">
        
        {/* HERO */}
        <section className="min-h-[70vh] flex flex-col justify-center mb-24 relative">
          <FadeIn>
            <div className="border-l-4 border-blue-500 pl-6 mb-8">
               <span className="text-blue-600 font-mono text-xs font-bold uppercase tracking-widest block mb-2">
                 00:00:00:00 • {t.heroLabel}
               </span>
               <h1 className="text-5xl md:text-8xl font-black leading-none tracking-tighter text-slate-900 uppercase">
                 {t.heroTitle}
               </h1>
            </div>
            <p className="text-xl md:text-3xl text-slate-500 font-light max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>
          </FadeIn>
        </section>

        {/* PHILOSOPHY - Split Screen Visual */}
        <section className="mb-32 grid md:grid-cols-2 gap-12 items-center bg-slate-900 text-white p-12 rounded-3xl overflow-hidden relative">
            {/* Background Grain */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] pointer-events-none" />
            
            <FadeIn>
                <div className="relative">
                    <Film className="w-12 h-12 text-blue-500 mb-6" />
                    <h2 className="text-4xl font-bold mb-6">{t.philosophyTitle}</h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        {t.philosophyBody}
                    </p>
                </div>
            </FadeIn>
            <FadeIn delay={0.2} className="relative h-64 md:h-full min-h-[300px] border-2 border-slate-700 rounded-xl overflow-hidden flex items-center justify-center bg-black">
                 {/* Abstract visual of a cut */}
                 <div className="w-full h-1 bg-blue-500 absolute top-1/2 -translate-y-1/2 animate-pulse" />
                 <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-mono text-4xl font-bold opacity-30">
                    [CUT]
                 </div>
            </FadeIn>
        </section>

        {/* MODULES (Grid) */}
        <section className="mb-32">
            <FadeIn>
                 <div className="flex items-end gap-4 mb-12 border-b-2 border-slate-200 pb-4">
                    <h2 className="text-3xl font-bold text-slate-900 uppercase">{t.modulesTitle}</h2>
                    <span className="text-slate-400 font-mono text-sm mb-1">/ TRACKS</span>
                 </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-8">
                {t.modules.map((mod, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <div className="flex gap-6 items-start p-6 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                            <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-lg flex-shrink-0">
                                <mod.icon size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{mod.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{mod.body}</p>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </section>

        {/* CTA */}
        <section className="text-center py-20 border-t border-slate-200">
            <FadeIn>
                <a 
                  href="https://api.whatsapp.com/send/?phone=97236030603"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-none uppercase tracking-widest font-bold text-lg hover:bg-blue-600 transition-colors"
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
