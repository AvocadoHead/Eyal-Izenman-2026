import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Course } from '../types';
import { X, ChevronDown, ArrowRight, Globe, Scissors, Sparkles, Target, Activity, Share2, MousePointer2, Music } from 'lucide-react';

interface CourseModalProps {
    course: Course | null;
    onClose: () => void;
    textDir?: 'rtl' | 'ltr';
    currentLang: 'he' | 'en';
    onToggleLang: () => void;
}

// --- AMBIENT PARTICLES CANVAS ---
const AmbientParticles: React.FC<{ color: string }> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const init = () => {
            particles = Array.from({ length: 30 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: 1 + Math.random() * 2,
                alpha: 0.1 + Math.random() * 0.3
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = color.replace('1)', `${p.alpha})`);
                ctx.fill();
            });

            animationId = requestAnimationFrame(draw);
        };

        resize();
        init();
        draw();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [color]);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40" />;
};

// --- SCROLL REVEAL WRAPPER ---
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
        >
            {children}
        </div>
    );
};

// --- CONTEXT ANIMATIONS (Enhanced) ---
const MatchCutVisualizer: React.FC = () => {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setFrame(f => (f + 1) % 100), 50);
        return () => clearInterval(interval);
    }, []);

    const progress = frame / 100;
    const cutProgress = Math.abs(Math.sin(progress * Math.PI));

    return (
        <div className="w-full h-32 flex items-center justify-center gap-4 overflow-hidden">
            <div
                className="w-20 h-20 bg-gradient-to-br from-rose-300 to-rose-400 rounded-xl shadow-lg"
                style={{
                    transform: `scale(${0.9 + cutProgress * 0.1}) translateX(${cutProgress * 10}px)`,
                    opacity: 0.7 + cutProgress * 0.3
                }}
            />
            <div className="relative">
                <div
                    className="w-1 h-28 bg-gradient-to-b from-transparent via-rose-500 to-transparent rounded-full"
                    style={{ opacity: 0.5 + cutProgress * 0.5 }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-rose-500 rounded-full blur-md"
                    style={{ opacity: cutProgress, transform: `translate(-50%, -50%) scale(${0.5 + cutProgress})` }}
                />
            </div>
            <div
                className="w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl shadow-lg"
                style={{
                    transform: `scale(${0.9 + cutProgress * 0.1}) translateX(${-cutProgress * 10}px)`,
                    opacity: 0.7 + cutProgress * 0.3
                }}
            />
        </div>
    );
};

const SeedGrowthVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let time = 0;
        let animationId: number;

        const draw = () => {
            const w = canvas.width = canvas.offsetWidth * 2;
            const h = canvas.height = canvas.offsetHeight * 2;
            ctx.scale(2, 2);

            ctx.clearRect(0, 0, w / 2, h / 2);
            time += 0.02;

            const centerX = w / 4;
            const centerY = h / 4;

            // Growing rings
            for (let i = 0; i < 5; i++) {
                const phase = (time + i * 0.5) % 3;
                const radius = phase * 30;
                const alpha = Math.max(0, 1 - phase / 3);

                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.5})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Center seed
            ctx.beginPath();
            ctx.arc(centerX, centerY, 4 + Math.sin(time * 2) * 2, 0, Math.PI * 2);
            ctx.fillStyle = '#10b981';
            ctx.fill();

            // Branches
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + time * 0.3;
                const length = 20 + Math.sin(time * 2 + i) * 10;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(angle) * length,
                    centerY + Math.sin(angle) * length
                );
                ctx.strokeStyle = `rgba(52, 211, 153, ${0.3 + Math.sin(time + i) * 0.2})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // End node
                ctx.beginPath();
                ctx.arc(
                    centerX + Math.cos(angle) * length,
                    centerY + Math.sin(angle) * length,
                    2,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = '#34d399';
                ctx.fill();
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, []);

    return <canvas ref={canvasRef} className="w-full h-32" />;
};

const AudioWaveVisualizer: React.FC = () => {
    const [bars, setBars] = useState<number[]>(Array(24).fill(0.5));

    useEffect(() => {
        const interval = setInterval(() => {
            setBars(prev => prev.map((_, i) => 0.2 + Math.random() * 0.8));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-20 flex items-center justify-center gap-[3px]">
            {bars.map((height, i) => (
                <div
                    key={i}
                    className="w-2 bg-gradient-to-t from-rose-500 to-rose-400 rounded-full transition-all duration-100"
                    style={{ height: `${height * 100}%` }}
                />
            ))}
        </div>
    );
};

const ChaosMutationVisualizer: React.FC = () => {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setRotation(r => r + 2), 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-32 relative flex items-center justify-center overflow-hidden">
            <div
                className="absolute w-24 h-24 border-2 border-emerald-500/40 rounded-full"
                style={{ transform: `rotate(${rotation}deg)` }}
            />
            <div
                className="absolute w-16 h-16 border-2 border-emerald-400/30 rounded-lg"
                style={{ transform: `rotate(${-rotation * 1.5}deg)` }}
            />
            <div
                className="absolute w-32 h-32 border border-emerald-500/10 rounded-xl"
                style={{ transform: `rotate(${rotation * 0.5}deg)` }}
            />
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
        </div>
    );
};

// --- 3D WORD CLOUD (Enhanced) ---
const WordCloud: React.FC<{ theme: { accent: string } }> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const words = [
        'seeding', 'nurture', 'chaos', 'growth', 'mutation', 'distill',
        'match-cut', 'rhythm', 'hybrid', 'fusion', 'after-effects', 'timeline',
        'story', 'motive', 'theme', 'color', 'emotion', 'texture',
        'prompt', 'vision', 'aesthetic', 'craft', 'form', 'content'
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
            rotationY += 0.002;
            rotationX += 0.001;

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
                const alpha = Math.max(0.15, (z + 150) / 300);

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = theme.accent;
                ctx.font = `${Math.max(10, 16 * scale)}px Heebo`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.word, screenX, screenY);
                ctx.restore();
            });
            animationId = requestAnimationFrame(draw);
        };

        init();
        draw();
        window.addEventListener('resize', init);
        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationId);
        };
    }, [theme.accent]);

    return <canvas ref={canvasRef} className="w-full h-[250px] md:h-[350px]" />;
};

// --- COURSE CONTENT DATA ---
const COURSE_DETAILS: Record<string, any> = {
    marketing: {
        theme: { bg: '#fffbf5', accent: '#f97316', text: '#431407', muted: '#9a3412', particle: 'rgba(249, 115, 22, 1)' },
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
        theme: { bg: '#fef7f7', accent: '#e11d48', text: '#881337', muted: '#9f1239', particle: 'rgba(225, 29, 72, 1)' },
        he: {
            pill: 'מאסטרי',
            heroTitle: 'העין, הלב והטיימליין.',
            heroSubtitle: 'המרחק בין After Effects ל-CapCut הוא קטן ממה שחשבתם. קורס עריכה מתקדם שמתמקד ב-Match-Cuts, קצב וביצועים היברידיים.',
            shiftLabel: 'הפילוסופיה',
            shiftTitle: 'הכלי הוא רק מברשת, הקצב הוא הציור.',
            shiftBody: [
                'אני מאמין שהיכולת לערוך ברמה גבוהה לא תלויה במנוי חודשי יקר. השליטה העמוקה שלי ב-After Effects היא הבסיס ללימוד ה"קסם הבלתי נראה".',
                'הקורס מיועד לעורכים שרוצים להיות מצוינים מבלי להיות כבולים לתוכנה אחת.'
            ],
            methodLabel: 'הסילבוס',
            methodTitle: 'ארסנל של עורך על.',
            methodSteps: [
                { label: 'מודול 01', title: 'Match-Cuts & Flow', body: 'יצירת המשכיות תנועתית מושלמת בין שוטים שונים לחלוטין.', icon: <Scissors className="w-6 h-6" />, anim: <MatchCutVisualizer /> },
                { label: 'מודול 02', title: 'עריכה מבוססת אודיו', body: 'ניתוח תדרי הקול והקצב כדי להכתיב את הקאט המנצח.', icon: <Music className="w-6 h-6" />, anim: <AudioWaveVisualizer /> },
                { label: 'מודול 03', title: 'עריכה היברידית (AI)', body: 'שילוב אינטליגנטי של וידאו AI בתוך פוטג׳ ריאליסטי.', icon: <Activity className="w-6 h-6" /> },
                { label: 'מודול 04', title: 'מאפקטים לסיפור', body: 'שימוש בלוגיקה של After Effects לייצור לוק יוקרתי.', icon: <MousePointer2 className="w-6 h-6" /> }
            ]
        },
        en: {
            pill: 'Mastery',
            heroTitle: 'Eye, Heart, Timeline.',
            heroSubtitle: 'The distance between After Effects and CapCut is smaller than you think. Master Match-Cuts, rhythm, and hybrid Gen-AI workflows.',
            shiftLabel: 'Philosophy',
            shiftTitle: 'The Skill is the Artist, not the Tool.',
            shiftBody: [
                'Great editing doesn\'t require an expensive monthly subscription. My deep proficiency in After Effects serves as the foundation for teaching the "invisible magic".',
                'This course is for those who want to be master editors without being bound to specific software.'
            ],
            methodLabel: 'Syllabus',
            methodTitle: 'The Editor\'s Arsenal.',
            methodSteps: [
                { label: 'Mod 01', title: 'Match-Cuts & Flow', body: 'Creating perfect kinetic continuity between disparate scenes.', icon: <Scissors className="w-6 h-6" />, anim: <MatchCutVisualizer /> },
                { label: 'Mod 02', title: 'Audio-Driven Editing', body: 'Letting the waveform and frequency dictate the impact of the cut.', icon: <Music className="w-6 h-6" />, anim: <AudioWaveVisualizer /> },
                { label: 'Mod 03', title: 'Hybrid Workflows', body: 'Seamlessly blending AI-generated chaos into live-action logic.', icon: <Share2 className="w-6 h-6" /> },
                { label: 'Mod 04', title: 'High-End Logic', body: 'Applying professional AE logic inside modern freeware.', icon: <MousePointer2 className="w-6 h-6" /> }
            ]
        }
    },
    'gen-ai': {
        theme: { bg: '#f0fdf9', accent: '#059669', text: '#064e3b', muted: '#065f46', particle: 'rgba(5, 150, 105, 1)' },
        he: {
            pill: 'גדילה',
            heroTitle: 'לזרוע, לטפח, לגדל.',
            heroSubtitle: 'האלכימיה של היצירה הג׳נרטיבית. איך לקחת רעיון גולמי ולגדל אותו מתוך הכאוס.',
            shiftLabel: 'מהות',
            shiftTitle: 'המוטציה היא הלב של היצירה.',
            shiftBody: [
                'אנחנו לא רק כותבים פרומפטים; אנחנו זורעים זרעים. כל דור של יצירה הוא מוטציה.',
                'הקורס עוסק בשימוש בכאוס ככלי עבודה, ובשליטה בלא-נודע כדי להשיג חזון אמנותי עקבי.'
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
                'We don\'t just "prompt"; we plant seeds. Every generation is a mutation.',
                'This course is about using chaos as a medium, controlling the unknown to achieve a consistent artistic signature.'
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

    const handleScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            setScrollProgress(Math.min(scrollTop / (scrollHeight - clientHeight), 1));
        }
    }, []);

    if (!course) return null;

    const content = COURSE_DETAILS[course.id]?.[currentLang] || COURSE_DETAILS['marketing'][currentLang];
    const theme = COURSE_DETAILS[course.id]?.theme || COURSE_DETAILS['marketing'].theme;

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col transition-all duration-700 ease-out font-sans ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundColor: theme.bg }}
            dir={currentLang === 'he' ? 'rtl' : 'ltr'}
        >
            {/* Ambient particles */}
            <AmbientParticles color={theme.particle} />

            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-black/5">
                <div
                    className="h-full transition-all duration-150"
                    style={{ width: `${scrollProgress * 100}%`, backgroundColor: theme.accent }}
                />
            </div>

            {/* Header */}
            <div
                className="w-full px-4 md:px-8 py-4 md:py-5 flex justify-between items-center backdrop-blur-xl sticky top-0 z-40 transition-all duration-300"
                style={{
                    backgroundColor: scrollProgress > 0.05 ? `${theme.bg}ee` : 'transparent',
                    borderBottom: scrollProgress > 0.05 ? `1px solid ${theme.accent}20` : 'none'
                }}
            >
                <button
                    onClick={() => { setIsVisible(false); setTimeout(onClose, 500); }}
                    className="group flex items-center gap-2 hover:opacity-70 transition-all duration-300"
                    style={{ color: theme.text }}
                >
                    <div className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center group-hover:bg-black/5 transition-all">
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] hidden md:inline">
                        {currentLang === 'he' ? 'סגור' : 'Close'}
                    </span>
                </button>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleLang}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] font-semibold uppercase tracking-wide transition-all duration-300 hover:scale-105"
                        style={{ borderColor: `${theme.accent}40`, color: theme.text }}
                    >
                        <Globe className="w-3.5 h-3.5" />
                        {currentLang === 'he' ? 'EN' : 'HE'}
                    </button>
                </div>
            </div>

            {/* Scrollable content */}
            <div ref={scrollRef} onScroll={handleScroll} className="flex-grow overflow-y-auto scroll-smooth">
                <div className="max-w-4xl mx-auto px-5 md:px-8 pb-24 md:pb-32">

                    {/* Hero Section */}
                    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center pt-12 md:pt-16">
                        <ScrollReveal>
                            <div
                                className="inline-flex px-5 py-2.5 rounded-full border text-[11px] font-bold tracking-[0.25em] uppercase mb-8"
                                style={{ borderColor: theme.accent, color: theme.accent, backgroundColor: `${theme.accent}10` }}
                            >
                                {content.pill}
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={100}>
                            <h1
                                className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.92] tracking-tight"
                                style={{ color: theme.text }}
                            >
                                {content.heroTitle}
                            </h1>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <p
                                className="text-lg md:text-xl lg:text-2xl max-w-2xl font-normal leading-relaxed mb-12"
                                style={{ color: theme.muted }}
                            >
                                {content.heroSubtitle}
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={300}>
                            <div className="w-full max-w-md">
                                <WordCloud theme={theme} />
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={400}>
                            <div className="mt-8 animate-bounce" style={{ color: theme.muted }}>
                                <ChevronDown className="w-8 h-8 opacity-40" />
                            </div>
                        </ScrollReveal>
                    </section>

                    {/* Philosophy Section */}
                    {content.shiftTitle && (
                        <section className="py-20 md:py-28">
                            <div
                                className="grid md:grid-cols-2 gap-10 md:gap-16 p-8 md:p-12 rounded-3xl"
                                style={{ backgroundColor: `${theme.accent}08`, border: `1px solid ${theme.accent}15` }}
                            >
                                <ScrollReveal>
                                    <div className="space-y-4">
                                        <span
                                            className="text-xs font-bold tracking-[0.2em] uppercase"
                                            style={{ color: theme.accent }}
                                        >
                                            {content.shiftLabel}
                                        </span>
                                        <h2
                                            className="text-3xl md:text-4xl font-black leading-tight"
                                            style={{ color: theme.text }}
                                        >
                                            {content.shiftTitle}
                                        </h2>
                                    </div>
                                </ScrollReveal>

                                <div className="space-y-6">
                                    {content.shiftBody.map((p: string, i: number) => (
                                        <ScrollReveal key={i} delay={i * 100}>
                                            <p
                                                className="text-base md:text-lg leading-relaxed"
                                                style={{ color: theme.muted }}
                                            >
                                                {p}
                                            </p>
                                        </ScrollReveal>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Syllabus Section */}
                    <section className="py-16 md:py-24">
                        <ScrollReveal>
                            <div className="text-center mb-14 md:mb-20">
                                <span
                                    className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4 block"
                                    style={{ color: theme.muted }}
                                >
                                    {content.methodLabel}
                                </span>
                                <h2
                                    className="text-3xl md:text-5xl font-black"
                                    style={{ color: theme.text }}
                                >
                                    {content.methodTitle}
                                </h2>
                            </div>
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                            {content.methodSteps.map((step: any, i: number) => (
                                <ScrollReveal key={i} delay={i * 100}>
                                    <div
                                        className="group p-7 md:p-9 rounded-2xl md:rounded-3xl border backdrop-blur-sm flex flex-col transition-all duration-500 hover:shadow-xl"
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.6)',
                                            borderColor: `${theme.accent}20`
                                        }}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div
                                                className="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110"
                                                style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}
                                            >
                                                {step.icon}
                                            </div>
                                            <span
                                                className="text-[10px] font-bold tracking-wider uppercase opacity-50"
                                                style={{ color: theme.text }}
                                            >
                                                {step.label}
                                            </span>
                                        </div>

                                        <h3
                                            className="text-xl md:text-2xl font-bold mb-3"
                                            style={{ color: theme.text }}
                                        >
                                            {step.title}
                                        </h3>

                                        <p
                                            className="text-sm md:text-base mb-6"
                                            style={{ color: theme.muted }}
                                        >
                                            {step.body}
                                        </p>

                                        {step.anim && (
                                            <div
                                                className="mt-auto pt-6 border-t opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                                style={{ borderColor: `${theme.accent}20` }}
                                            >
                                                {step.anim}
                                            </div>
                                        )}
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </section>

                    {/* Instructor Section */}
                    <section className="py-16 md:py-20">
                        <ScrollReveal>
                            <div
                                className="flex flex-col md:flex-row items-center gap-10 p-8 md:p-12 rounded-3xl"
                                style={{ backgroundColor: `${theme.accent}08`, border: `1px solid ${theme.accent}15` }}
                            >
                                <div className="relative">
                                    <div
                                        className="absolute inset-0 rounded-2xl blur-xl opacity-30"
                                        style={{ backgroundColor: theme.accent }}
                                    />
                                    <img
                                        src="https://lh3.googleusercontent.com/d/1zIWiopYxC_J4r-Ns4VmFvCXaLPZFmK4k=s400?authuser=0"
                                        className="relative w-32 h-40 md:w-36 md:h-44 object-cover rounded-2xl border-4 border-white shadow-2xl"
                                        style={{ transform: 'rotate(-3deg)' }}
                                        alt="Eyal Izenman"
                                    />
                                </div>

                                <div className="text-center md:text-start flex-1">
                                    <h3
                                        className="text-2xl md:text-3xl font-black mb-3"
                                        style={{ color: theme.text }}
                                    >
                                        Eyal Izenman
                                    </h3>
                                    <p
                                        className="italic text-base md:text-lg mb-8 max-w-md"
                                        style={{ color: theme.muted }}
                                    >
                                        {currentLang === 'he'
                                            ? '"יצירה היא לא עבודה עם כלים, היא עבודה עם רגש וזמן."'
                                            : '"Creation is not about tools, it is about emotion and time."'}
                                    </p>

                                    <a
                                        href="https://wa.me/97236030603"
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-base md:text-lg shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
                                        style={{ backgroundColor: theme.accent }}
                                    >
                                        {currentLang === 'he' ? 'דברו איתי על הקורס' : 'Talk to me about the course'}
                                        <ArrowRight className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </ScrollReveal>
                    </section>
                </div>
            </div>
        </div>
    );
};
