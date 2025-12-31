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
    bioLabel: 'About me',
    bioName: 'Eyal Izenman',
    bioBody: 'Creator, animator, motion designer, and thought leader in the Generative AI space. With decades of weaving music, design and movement, Eyal works where human intuition meets algorithmic improvisation.',
    bioQuote: '“AI is not a tech trick – it is a full creative space. My goal is to help you surface the idea, refine it, and turn it into a complete visual asset – in one continuous breath.”',
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
    bioLabel: 'עליי',
    bioName: 'איל איזנמן',
    bioBody: 'יוצר, מנפיש ומעצב תנועה, מהקולות הבולטים בישראל בשדה ה-AI היצירתי. שוזר יחד מוזיקה, עיצוב ותנועה למרחבים גנרטיביים.',
    bioQuote: '״AI הוא לא טריק טכנולוגי – הוא מרחב יצירתי שלם. המטרה שלי היא לעזור לך לזקק את הרעיון ולהפוך אותו לנכס חזותי שלם, בנשימה אחת רציפה.״',
    cta: 'לשלוט בעריכה',
  }
};

/**
 * "Timeline" Scroll Trace
 * Draws a professional NLE (Non-Linear Editor) background.
 * Tracks, Timecode markers, and Clips that scroll behind content.
 */
const TimelineTraceCanvas = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // Generate a fixed set of "Clips" that look like a timeline project
  const clips = useMemo(() => {
    const list = [];
    const numTracks = 5; // V1, V2, V3, A1, A2
    const totalHeight = 4000; // Virtual height of the timeline in pixels
    
    for (let i = 0; i < 60; i++) {
      const track = Math.floor(Math.random() * numTracks);
      const isAudio = track > 2;
      list.push({
        y: Math.random() * totalHeight,
        height: Math.random() * 200 + 50, // Duration
        track: track,
        color: isAudio ? '#10b981' : (track % 2 === 0 ? '#3b82f6' : '#6366f1'), // Green(Audio), Blue, Indigo
        opacity: Math.random() * 0.15 + 0.05 // Very subtle
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

      // We draw vertical lines for tracks
      // Distributed across the screen width
      const trackWidth = width / 6;
      
      // Draw Track Lines (Subtle Grid)
      ctx.strokeStyle = 'rgba(0,0,0,0.03)';
      ctx.lineWidth = 1;
      for(let t = 1; t <= 5; t++) {
        const x = t * trackWidth;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Parallax scroll for the timeline content
      // It moves slightly faster than the page to feel "deep"
      const scrollY = progress * 2500; 

      // Draw Clips
      clips.forEach(clip => {
        // Calculate screen Y
        const screenY = clip.y - scrollY;
        
        // Culling
        if (screenY + clip.height < -100 || screenY > height + 100) return;

        const x = (clip.track + 0.5) * trackWidth;
        const w = trackWidth * 0.8;
        
        // Draw Clip Box
        ctx.fillStyle = clip.color;
        ctx.globalAlpha = clip.opacity;
        
        // Rounded rect
        ctx.beginPath();
        ctx.roundRect(x, screenY, w, clip.height, 4);
        ctx.fill();

        // Draw "Waveform" or "Thumbnail" lines inside
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        if (clip.track > 2) { // Audio
             // Mock waveform
             const center = x + w/2;
             for(let jy = 0; jy < clip.height; jy+=4) {
                 const amp = Math.random() * (w * 0.8);
                 ctx.fillRect(center - amp/2, screenY + jy, amp, 2);
             }
        } else { // Video
             // Mock thumbnails dividers
             for(let jy = 0; jy < clip.height; jy+=40) {
                 ctx.fillRect(x, screenY + jy, w, 1);
             }
        }
      });
      
      // Draw Timecode-like overlay on the left
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.font = '10px monospace';
      const timeStart = Math.floor(scrollY / 100);
      for(let i=0; i< height/100; i++) {
          const tc = timeStart + i;
          ctx.fillText(`00:00:${tc < 10 ? '0'+tc : tc}:00`, 10, i*100 + 10 - (scrollY % 100));
          ctx.fillRect(0, i*100 - (scrollY % 100), 8, 1);
      }

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

const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-900 uppercase tracking-widest text-xs font-bold mb-4">
    {children}
  </div>
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
        background: '#fafafa', 
        color: '#171717'
      }}
    >
      <TimelineTraceCanvas containerRef={containerRef} />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          {onClose && (
             <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors text-slate-700">
               <X className="w-6 h-6" />
             </button>
          )}
          <div className="flex items-center gap-2 text-slate-900">
             <Aperture className="w-5 h-5" />
             <span className="font-bold text-sm uppercase tracking-wider hidden sm:block">{t.brand}</span>
          </div>
        </div>
        <div className="flex items-center p-1 rounded-full bg-slate-100 border border-slate-200">
          <button onClick={() => setLang('en')} className={cn("px-3 py-1 text-xs font-bold rounded-full transition-all", lang === 'en' ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-white")}>EN</button>
          <button onClick={() => setLang('he')} className={cn("px-3 py-1 text-xs font-bold rounded-full transition-all", lang === 'he' ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-white")}>HE</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* HERO */}
        <section className="min-h-[70vh] flex flex-col justify-center mb-24 relative">
          <FadeIn>
            <div className="border-l-4 border-blue-600 pl-6 mb-8 bg-white/50 backdrop-blur-sm py-2 rounded-r-lg inline-block">
               <span className="text-blue-700 font-mono text-xs font-bold uppercase tracking-widest block mb-2">
                 00:00:00:00 • {t.heroLabel}
               </span>
               <h1 className="text-5xl md:text-8xl font-black leading-none tracking-tighter text-slate-900 uppercase">
                 {t.heroTitle}
               </h1>
            </div>
            <p className="text-xl md:text-3xl text-slate-600 font-light max-w-2xl leading-relaxed bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-100/50">
              {t.heroSubtitle}
            </p>
          </FadeIn>
        </section>

        {/* PHILOSOPHY - Split Screen Visual */}
        <section className="mb-32 grid md:grid-cols-2 gap-12 items-center bg-slate-900 text-white p-8 md:p-12 rounded-3xl overflow-hidden relative shadow-2xl">
            {/* Background Grain */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] pointer-events-none" />
            
            <FadeIn>
                <div className="relative z-10">
                    <Film className="w-12 h-12 text-blue-500 mb-6" />
                    <h2 className="text-4xl font-bold mb-6">{t.philosophyTitle}</h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        {t.philosophyBody}
                    </p>
                </div>
            </FadeIn>
            
            <FadeIn delay={0.2} className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden border-2 border-slate-700 bg-black shadow-inner group">
                 <video 
                    src="https://github.com/AvocadoHead/Eyal-Izenman-2026/raw/main/Assets/Tiny%20Guard.mp4" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                 />
                 <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute bottom-4 left-4 font-mono text-xs text-blue-400">
                    SRC: TINY_GUARD.MP4
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
                        <div className="flex gap-6 items-start p-6 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
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

        {/* BIO & FOOTER */}
        <section className="bg-white/70 rounded-3xl p-8 md:p-12 border border-slate-200 backdrop-blur-xl shadow-lg mb-20">
          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start mb-16">
            <FadeIn>
               <div className="w-32 h-44 md:w-40 md:h-56 rounded-2xl overflow-hidden bg-slate-200 shadow-xl rotate-[-2deg] border-4 border-white">
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
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">{t.bioBody}</p>
              <div className="pl-6 border-l-4 border-blue-500 bg-blue-50/50 p-4 rounded-r-xl italic text-slate-700">
                {t.bioQuote}
              </div>
            </FadeIn>
          </div>

          <FadeIn className="text-center pt-8 border-t border-slate-200">
            <a 
              href="https://api.whatsapp.com/send/?phone=97236030603"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-none uppercase tracking-widest font-bold text-lg hover:bg-blue-600 transition-colors shadow-xl"
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
