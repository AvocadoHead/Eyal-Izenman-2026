import React, { useEffect, useState, useRef, useMemo } from 'react';
import { X, ChevronDown, ArrowRight, Target, Activity, Share2, Music, Scissors, Sparkles, Globe, BrainCircuit, Zap, Layers, Mic, MonitorPlay, Wand2, Fingerprint } from 'lucide-react';

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

interface Theme {
  bg: string;
  bgGradient: string;
  accent: string;
  text: string;
  secondary: string;
  blob1: string;
  blob2: string;
}

// --- VISUALIZERS & MICRO-ANIMATIONS ---

const InteractiveWordCloud: React.FC<{ words: string[], color: string }> = ({ words, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationXRef = useRef(0);
  const rotationYRef = useRef(0);
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
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      const radius = Math.min(rect.width, rect.height) * 0.35;
      const displayWords = [...words, ...words].slice(0, 35);
      
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

    const draw = () => {
      if(!canvas) return;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      // Auto rotate
      if (!isDraggingRef.current) {
        rotationYRef.current += 0.002;
        rotationXRef.current += 0.001;
      }

      particles.forEach(p => {
        // Rotate
        let { x, y, z } = p;
        const cosY = Math.cos(rotationYRef.current);
        const sinY = Math.sin(rotationYRef.current);
        const tx = x * cosY - z * sinY;
        const tz = z * cosY + x * sinY;
        x = tx; z = tz;

        const cosX = Math.cos(rotationXRef.current);
        const sinX = Math.sin(rotationXRef.current);
        const ty = y * cosX - z * sinX;
        z = z * cosX + y * sinX;
        y = ty;

        // Project
        const scale = 400 / (400 + z);
        const screenX = width / 2 + x * scale;
        const screenY = height / 2 + y * scale;
        const alpha = Math.max(0.1, (z + 200) / 300);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.font = `bold ${Math.max(10, 14 * scale)}px sans-serif`; // Heebo-like font
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.word, screenX, screenY);
        ctx.restore();
      });

      animationId = requestAnimationFrame(draw);
    };

    // Events
    const handleStart = (x: number, y: number) => {
      isDraggingRef.current = true;
      lastMouseRef.current = { x, y };
      canvas.style.cursor = 'grabbing';
    };
    const handleMove = (x: number, y: number) => {
      if (!isDraggingRef.current) return;
      const deltaX = x - lastMouseRef.current.x;
      const deltaY = y - lastMouseRef.current.y;
      lastMouseRef.current = { x, y };
      rotationYRef.current += deltaX * 0.005;
      rotationXRef.current += deltaY * 0.005;
    };
    const handleEnd = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('mousedown', e => handleStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('touchstart', e => handleStart(e.touches[0].clientX, e.touches[0].clientY), {passive: false});
    window.addEventListener('touchmove', e => handleMove(e.touches[0].clientX, e.touches[0].clientY), {passive: false});
    window.addEventListener('touchend', handleEnd);

    init();
    draw();
    window.addEventListener('resize', init);
    
    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      cancelAnimationFrame(animationId);
    };
  }, [words, color]);

  return <canvas ref={canvasRef} className="w-full h-full cursor-grab" />;
};

const ScrollTraceCanvas: React.FC<{ scrollContainer: React.RefObject<HTMLDivElement>, color: string }> = ({ scrollContainer, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = scrollContainer.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let points: {x: number, y: number}[] = [];
    
    // Generate a snake-like path
    const initPath = () => {
      points = [];
      const segments = 12;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        // Wavy vertical line
        const x = 0.5 + Math.sin(t * Math.PI * 4) * 0.15; // Normalized X (0-1)
        const y = t; // Normalized Y (0-1)
        points.push({ x, y });
      }
    };

    const draw = () => {
      if (!ctx || !canvas || !container) return;
      const dpr = window.devicePixelRatio || 1;
      // Resize check handled by resize observer ideally, but simple check here
      if (canvas.width !== canvas.offsetWidth * dpr) {
         canvas.width = canvas.offsetWidth * dpr;
         canvas.height = canvas.offsetHeight * dpr;
         ctx.scale(dpr, dpr);
      }
      
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = Math.min(1, Math.max(0, container.scrollTop / (scrollHeight || 1)));

      ctx.clearRect(0, 0, width, height);

      // Draw Path
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.3;

      // Calculate path length to show based on scroll
      // We want the line to "grow" as we scroll down
      const visibleSegments = points.length * (progress + 0.2); // +0.2 to show a bit ahead

      // Smooth curve drawing
      if (points.length > 0) {
        ctx.moveTo(points[0].x * width, points[0].y * height);
        for (let i = 0; i < points.length - 1; i++) {
          if (i > visibleSegments) break;
          const p0 = points[i];
          const p1 = points[i + 1];
          const midX = (p0.x + p1.x) / 2 * width;
          const midY = (p0.y + p1.y) / 2 * height;
          ctx.quadraticCurveTo(p0.x * width, p0.y * height, midX, midY);
        }
      }
      ctx.stroke();

      // Draw Head Dot
      if (visibleSegments < points.length) {
         const headIdx = Math.floor(visibleSegments);
         const p = points[Math.min(headIdx, points.length - 1)];
         ctx.beginPath();
         ctx.fillStyle = color;
         ctx.globalAlpha = 1;
         ctx.shadowBlur = 15;
         ctx.shadowColor = color;
         ctx.arc(p.x * width, p.y * height, 6, 0, Math.PI * 2);
         ctx.fill();
         ctx.shadowBlur = 0;
      }
      
      requestAnimationFrame(draw);
    };

    initPath();
    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);

  }, [color, scrollContainer]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ height: '150%' /* Taller than viewport to allow scrolling */ }} />;
};

// --- MICRO VISUALIZERS ---
const StrategyGrid: React.FC<{color: string}> = ({color}) => (
    <div className="w-full h-24 grid grid-cols-8 grid-rows-3 gap-1 opacity-40">
        {Array.from({length: 24}).map((_,i) => (
            <div key={i} className="rounded-sm transition-all duration-500" 
                 style={{ 
                     backgroundColor: Math.random() > 0.8 ? color : 'transparent', 
                     border: `1px solid ${color}`,
                     transform: `scale(${Math.random() > 0.5 ? 1 : 0.8})`
                 }} />
        ))}
    </div>
);

const AudioWaves: React.FC<{color: string}> = ({color}) => (
    <div className="w-full h-24 flex items-center justify-center gap-1 opacity-60">
        {Array.from({length: 16}).map((_,i) => (
            <div key={i} className="w-1.5 rounded-full animate-pulse" 
                 style={{ 
                     backgroundColor: color, 
                     height: `${20 + Math.random() * 80}%`, 
                     animationDelay: `${i * 0.1}s` 
                 }} />
        ))}
    </div>
);

const SeedGrowth: React.FC<{color: string}> = ({color}) => (
    <div className="w-full h-24 flex items-center justify-center opacity-60">
        <div className="relative w-12 h-12">
             <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{backgroundColor: color}} />
             <div className="absolute inset-2 rounded-full animate-pulse" style={{border: `2px solid ${color}`}} />
             <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={16} color={color} />
             </div>
        </div>
    </div>
);


// --- COURSE CONTENT DATA ---
const COURSE_DETAILS: Record<string, any> = {
  marketing: {
    theme: { 
      bg: '#fff7e8', 
      bgGradient: 'linear-gradient(135deg, #fff7e8 0%, #ffe8c7 100%)',
      accent: '#ff9f55', 
      text: '#4a2c1d', 
      secondary: '#ffd6a6',
      blob1: 'rgba(255, 214, 166, 0.6)',
      blob2: 'rgba(255, 159, 85, 0.3)'
    },
    words: ['Strategy', 'Brief', 'AI', 'Brand', 'Insight', 'Values', 'Tone', 'Visuals', 'Prompt', 'Midjourney', 'Flux', 'Pitch', 'Story', 'Logic', 'Emotion'],
    he: {
      pill: 'ניהול קריאייטיב',
      heroTitle: 'לפצח את הבריף.',
      heroSubtitle: 'הכל קורה בבת אחת. סדנה לפיצוח בריפים במרחב המולטימודלי. אסטרטגיה ופיתוח חזותי בעידן ה-Generative AI.',
      shiftLabel: 'הפרדיגמה',
      shiftTitle: 'מ"טקסט פה, תמונה שם" לקנבס אחד מאוחד.',
      shiftBody: [
        'רוב התעשייה עובדת בפיצול: טקסט בחלון אחד, תמונות באחר. התוצאה היא חיכוך ואיבוד המהות.',
        'בסדנה נעבור לקנבס גנרטיבי אחד, שבו שפה, רעיון ותמונה מתפתחים יחד בזמן אמת.'
      ],
      methodLabel: 'השיטה',
      methodTitle: 'מבריף לווידאו בארבעה מהלכים.',
      methodSteps: [
        { label: 'מהלך 01', title: 'Story DNA', body: 'פירוק הבריף לקשת רגשית ותמונות מפתח לפני כתיבת הפרומפט הראשון.', icon: <BrainCircuit />, anim: <StrategyGrid color="#ff9f55"/> },
        { label: 'מהלך 02', title: 'הסקצ\'בוק המולטימודלי', body: 'יצירת וריאציות של קומפוזיציה, סגנון וטקסט על קנבס אחד.', icon: <Layers /> },
        { label: 'מהלך 03', title: 'Look & Feel', body: 'זיקוק הרעש לשפה ויזואלית מובחנת וברורה.', icon: <Target /> },
        { label: 'מהלך 04', title: 'הלחנה (Composing)', body: 'איחוד הנכסים לסיקוונס וידאו זורם ומהודק.', icon: <Zap /> }
      ],
      outcomeLabel: 'תוצאה',
      outcomeTitle: 'עם מה יוצאים',
      outcomes: [
        { title: 'תהליך עבודה סדור', body: 'מתודה שניתנת לשחזור על כל בריף וכל כלי עתידי.' },
        { title: 'פרויקט חי', body: 'קונספט או וידאו כמעט סופי שנבנה בסדנה.' },
        { title: 'שפה משותפת', body: 'אוצר מילים שמחבר בין אסטרטגיה לקריאייטיב.' }
      ]
    },
    en: {
      pill: 'Creative Management',
      heroTitle: 'Crack the Brief.',
      heroSubtitle: 'Everything happens at once. A multimodal workshop for strategy and visual development in the age of Generative AI.',
      shiftLabel: 'Paradigm',
      shiftTitle: 'From "Text Here, Image There" to One Unified Canvas.',
      shiftBody: [
        'Most of the industry works in silos: copy in one tab, visuals in another. The result is friction and lost essence.',
        'We move to a single generative canvas where language, concept, and image evolve together in real-time.'
      ],
      methodLabel: 'Methodology',
      methodTitle: 'From Brief to Video in 4 Movements.',
      methodSteps: [
        { label: 'Move 01', title: 'Story DNA', body: 'Decoding the brief into emotional arcs and key imagery before writing a single prompt.', icon: <BrainCircuit />, anim: <StrategyGrid color="#ff9f55"/> },
        { label: 'Move 02', title: 'Multimodal Sketchbook', body: 'Generating variations of composition, style, and text on one canvas.', icon: <Layers /> },
        { label: 'Move 03', title: 'Look & Feel', body: 'Refining the noise into a distinct, recognizable visual language.', icon: <Target /> },
        { label: 'Move 04', title: 'Composing', body: 'Assembling assets into a tight, flowing video sequence.', icon: <Zap /> }
      ],
      outcomeLabel: 'Outcome',
      outcomeTitle: 'What You Leave With',
      outcomes: [
        { title: 'Structured Workflow', body: 'A repeatable method applicable to any brief and future tools.' },
        { title: 'Live Project', body: 'A concept or near-final video built during the workshop.' },
        { title: 'Shared Language', body: 'Vocabulary bridging the gap between strategy and creative.' }
      ]
    }
  },
  'video-editing': {
    theme: { 
      bg: '#fdf2f8', 
      bgGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%)',
      accent: '#db2777', 
      text: '#831843', 
      secondary: '#f9a8d4',
      blob1: 'rgba(249, 168, 212, 0.6)',
      blob2: 'rgba(219, 39, 119, 0.3)'
    },
    words: ['Rhythm', 'Cut', 'Flow', 'Beat', 'Timeline', 'Match-Cut', 'Sound', 'Motion', 'Tempo', 'Style', 'Effect', 'Transition', 'Story', 'Frame', 'Keyframe'],
    he: {
      pill: 'עריכה ופוסט',
      heroTitle: 'העין, הלב והטיימליין.',
      heroSubtitle: 'הכלי הוא רק מברשת. סדנה ליוצרים שרוצים לעלות רמה: טכניקות עריכה מתקדמות, קצב, ושילוב AI כדי להפוך חומר גלם לזהב.',
      shiftLabel: 'הפילוסופיה',
      shiftTitle: 'עריכה היא מוזיקה ויזואלית.',
      shiftBody: [
        'עורך טוב לא סתם "חותך" קליפים; הוא מלחין רגש. הטעות הנפוצה היא התמקדות בטכניקה במקום בקצב.',
        'בסדנה נלמד את ה"קסם הבלתי נראה": איך לגרום לצופה להרגיש את הקאט לפני שהוא רואה אותו, ואיך לשלב אלמנטים גנרטיביים בתוך וידאו מצולם.'
      ],
      methodLabel: 'הסילבוס',
      methodTitle: 'ארסנל העורך ההיברידי.',
      methodSteps: [
        { label: 'מודול 01', title: 'Flow & Match-Cuts', body: 'יצירת המשכיות תנועתית בין שוטים שונים.', icon: <Scissors />, anim: <MatchCutIcon color="#db2777"/> },
        { label: 'מודול 02', title: 'עריכה מונחית סאונד', body: 'לתת לגל הקול להכתיב את אימפקט החיתוך.', icon: <Music />, anim: <AudioWaves color="#db2777"/> },
        { label: 'מודול 03', title: 'עולם ה-Hybrid', body: 'שילוב וידאו AI בתוך פוטג׳ מצולם בצורה חלקה.', icon: <Share2 /> },
        { label: 'מודול 04', title: 'Color & Mood', body: 'שימוש בצבע ככלי סיפורי לשינוי האווירה.', icon: <Wand2 /> }
      ],
      outcomeLabel: 'תוצאה',
      outcomeTitle: 'ארגז הכלים החדש',
      outcomes: [
        { title: 'שליטה בקצב', body: 'הבנה עמוקה של טיימינג ורגש בעריכה.' },
        { title: 'טכניקות מתקדמות', body: 'יכולת ליצור מעברים מורכבים במינימום מאמץ.' },
        { title: 'תיק עבודות משודרג', body: 'תוצרים שנראים כמו הפקה גדולה.' }
      ]
    },
    en: {
      pill: 'Edit & Post',
      heroTitle: 'Eye, Heart, Timeline.',
      heroSubtitle: 'The tool is just a brush. Advanced editing techniques, rhythm mastery, and AI integration to turn raw footage into gold.',
      shiftLabel: 'Philosophy',
      shiftTitle: 'Editing is Visual Music.',
      shiftBody: [
        'A great editor doesn\'t just "cut" clips; they compose emotion. The common mistake is focusing on tech instead of rhythm.',
        'We learn the "Invisible Magic": making the viewer feel the cut before seeing it, and blending generative elements into live action.'
      ],
      methodLabel: 'Syllabus',
      methodTitle: 'The Hybrid Editor Arsenal.',
      methodSteps: [
        { label: 'Mod 01', title: 'Flow & Match-Cuts', body: 'Creating kinetic continuity between disparate shots.', icon: <Scissors />, anim: <MatchCutIcon color="#db2777"/> },
        { label: 'Mod 02', title: 'Audio-Driven Edit', body: 'Letting the waveform dictate the impact of the cut.', icon: <Music />, anim: <AudioWaves color="#db2777"/> },
        { label: 'Mod 03', title: 'Hybrid Workflows', body: 'Seamlessly blending AI video into real footage.', icon: <Share2 /> },
        { label: 'Mod 04', title: 'Color & Mood', body: 'Using color grading as a narrative tool.', icon: <Wand2 /> }
      ],
      outcomeLabel: 'Outcome',
      outcomeTitle: 'Your New Toolkit',
      outcomes: [
        { title: 'Rhythm Mastery', body: 'Deep understanding of timing and emotion.' },
        { title: 'Advanced Tech', body: 'Creating complex transitions with minimal friction.' },
        { title: 'Leveled-Up Portfolio', body: 'Assets that look like high-budget productions.' }
      ]
    }
  },
  'gen-ai': {
    theme: { 
      bg: '#f0fdf4', 
      bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      accent: '#059669', 
      text: '#064e3b', 
      secondary: '#86efac',
      blob1: 'rgba(134, 239, 172, 0.6)',
      blob2: 'rgba(5, 150, 105, 0.3)'
    },
    words: ['Seed', 'Growth', 'Chaos', 'Nurture', 'Prompt', 'Latent', 'Space', 'Diffusion', 'Control', 'Upscale', 'Dream', 'Imagine', 'Iterate', 'Form', 'Style'],
    he: {
      pill: 'יצירה ג׳נרטיבית',
      heroTitle: 'לזרוע, לטפח, לגדל.',
      heroSubtitle: 'אלכימיה דיגיטלית. כניסה לעומק המכונה למתחילים. איך להפוך רעיון מופשט ליצירה ויזואלית עשירה ומדויקת.',
      shiftLabel: 'המהות',
      shiftTitle: 'אנחנו לא כותבים, אנחנו מגדלים.',
      shiftBody: [
        'הטעות הגדולה היא לחשוב ש-AI הוא מכונת פקודות. הוא שותף כאוטי. כל יצירה היא דיאלוג עם רעש.',
        'אנחנו לא "יוצרים יש מאין", אלא מנווטים בתוך ה-Latent Space (המרחב הסמוי) כדי למצוא את הזהב שמסתתר שם.'
      ],
      methodLabel: 'תהליך הצמיחה',
      methodTitle: 'משליטה לכאוס ובחזרה.',
      methodSteps: [
        { label: 'שלב I', title: 'הזרעה (Seeding)', body: 'יסודות הפרומפטינג והקומפוזיציה. שתילת הרעיון.', icon: <Sparkles />, anim: <SeedGrowth color="#059669"/> },
        { label: 'שלב II', title: 'מוטציה וטיפוח', body: 'ניהול וריאציות ובחירת ה-DNA הנכון מתוך הכאוס.', icon: <Activity /> },
        { label: 'שלב III', title: 'שליטה (Control)', body: 'שימוש ברפרנסים וכלים מתקדמים לדיוק התוצאה.', icon: <Target /> },
        { label: 'שלב IV', title: 'Upscale & Finish', body: 'הבאת התוצר לאיכות שידור מקצועית.', icon: <MonitorPlay /> }
      ],
      outcomeLabel: 'תוצאה',
      outcomeTitle: 'שליטה במכונה',
      outcomes: [
        { title: 'הבנת המודל', body: 'לדעת איך ה-AI "חושב" ולא לנחש.' },
        { title: 'דיוק ויזואלי', body: 'היכולת להגיע בדיוק לתמונה שדמיינתם.' },
        { title: 'זרימת עבודה', body: 'מעבר מהיר מרעיון לביצוע איכותי.' }
      ]
    },
    en: {
      pill: 'Generative Creation',
      heroTitle: 'Seed, Nurture, Grow.',
      heroSubtitle: 'Digital Alchemy. Deep dive for beginners. Transform abstract ideas into rich, precise visual art through the latent space.',
      shiftLabel: 'Essence',
      shiftTitle: 'We Don\'t Write, We Cultivate.',
      shiftBody: [
        'The biggest mistake is treating AI as a command line. It is a chaotic partner. Every creation is a dialogue with noise.',
        'We don\'t create from nothing; we navigate the Latent Space to discover the gold hidden within.'
      ],
      methodLabel: 'Growth Process',
      methodTitle: 'From Chaos to Control.',
      methodSteps: [
        { label: 'Phase I', title: 'Seeding', body: 'Fundamentals of prompting. Planting the core idea.', icon: <Sparkles />, anim: <SeedGrowth color="#059669"/> },
        { label: 'Phase II', title: 'Mutation & Nurture', body: 'Managing variations and selecting the right DNA from chaos.', icon: <Activity /> },
        { label: 'Phase III', title: 'Control', body: 'Using references and advanced tools for precision.', icon: <Target /> },
        { label: 'Phase IV', title: 'Upscale & Finish', body: 'Bringing the asset to broadcast quality.', icon: <MonitorPlay /> }
      ],
      outcomeLabel: 'Outcome',
      outcomeTitle: 'Mastering the Machine',
      outcomes: [
        { title: 'Model Intuition', body: 'Knowing how the AI "thinks" rather than guessing.' },
        { title: 'Visual Precision', body: 'Ability to generate exactly what you imagined.' },
        { title: 'Workflow Speed', body: 'Rapid transition from concept to high-res execution.' }
      ]
    }
  }
};

const MatchCutIcon = ({color}: {color:string}) => (
    <div className="flex gap-1 justify-center items-center h-20 opacity-50">
        <div className="w-8 h-12 border-2 rounded" style={{borderColor: color}}></div>
        <ArrowRight size={16} color={color} />
        <div className="w-8 h-12 bg-current rounded" style={{color: color}}></div>
    </div>
);

// --- MAIN MODAL COMPONENT ---

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, currentLang, onToggleLang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Safe default fallback
  const courseId = course?.id && COURSE_DETAILS[course.id] ? course.id : 'marketing';
  const content = COURSE_DETAILS[courseId][currentLang];
  const theme = COURSE_DETAILS[courseId].theme;
  const words = COURSE_DETAILS[courseId].words;

  useEffect(() => {
    if (course) {
      setTimeout(() => setIsVisible(true), 50);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
  }, [course]);

  if (!course) return null;

  return (
    <div 
        className={`fixed inset-0 z-[100] flex flex-col font-sans transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        dir={currentLang === 'he' ? 'rtl' : 'ltr'}
    >
      {/* Background with animated blobs */}
      <div className="absolute inset-0 transition-opacity duration-1000" style={{ background: theme.bgGradient }}>
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-70 animate-[blob_10s_infinite]" style={{ backgroundColor: theme.blob1 }}></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-60 animate-[blob_15s_infinite_reverse]" style={{ backgroundColor: theme.blob2 }}></div>
      </div>

      {/* --- HEADER --- */}
      <div className="w-full px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md border-b" 
           style={{ borderColor: `${theme.accent}20`, backgroundColor: `${theme.bg}cc` }}>
        <button 
            onClick={() => { setIsVisible(false); setTimeout(onClose, 600); }} 
            className="group flex items-center gap-2 px-4 py-2 rounded-full border bg-white/50 hover:bg-white transition-all shadow-sm hover:shadow-md"
            style={{ color: theme.text, borderColor: `${theme.accent}40` }}
        >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">{currentLang === 'he' ? 'סגור' : 'Close'}</span>
        </button>
        
        <div className="text-sm font-bold tracking-widest uppercase opacity-40 hidden md:block" style={{ color: theme.text }}>
            {courseId.replace('-', ' ')} Workshop
        </div>

        <button 
            onClick={onToggleLang} 
            className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white/50 hover:bg-white transition-all shadow-sm hover:shadow-md text-xs font-bold uppercase"
            style={{ color: theme.text, borderColor: `${theme.accent}40` }}
        >
            <Globe className="w-3 h-3" /> {currentLang === 'he' ? 'English' : 'עברית'}
        </button>
      </div>

      {/* --- SCROLL CONTENT CONTAINER --- */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto no-scrollbar scroll-smooth relative z-10">
        
        {/* Scroll Trace Canvas (Behind content, follows scroll) */}
        <ScrollTraceCanvas scrollContainer={scrollRef} color={theme.accent} />

        <div className="max-w-6xl mx-auto px-6 pb-32 pt-12 md:pt-20">
            
            {/* --- HERO SECTION (Grid Layout) --- */}
            <section className="min-h-[85vh] grid md:grid-cols-2 gap-12 items-center mb-24 relative">
                
                {/* Text Side */}
                <div className={`flex flex-col items-start text-left z-10 ${currentLang === 'he' ? 'md:order-last text-right items-end' : ''}`}>
                    <div className="inline-flex px-4 py-1.5 rounded-full border text-[10px] font-bold tracking-[0.2em] uppercase mb-8 shadow-sm backdrop-blur-sm bg-white/30" 
                         style={{ borderColor: theme.accent, color: theme.text }}>
                        {content.pill}
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tighter" style={{ color: theme.text }}>
                        {content.heroTitle}
                    </h1>
                    
                    <p className="text-xl md:text-2xl font-medium leading-relaxed opacity-80 max-w-xl" style={{ color: theme.text }}>
                        {content.heroSubtitle}
                    </p>

                    <div className="mt-12 animate-bounce opacity-40">
                         <ChevronDown className="w-8 h-8" style={{color: theme.text}} />
                    </div>
                </div>

                {/* Visual Side (Word Cloud Card) */}
                <div className={`relative w-full aspect-square md:aspect-[4/5] rounded-[2rem] border overflow-hidden shadow-2xl z-10 
                     bg-white/10 backdrop-blur-sm`} 
                     style={{ borderColor: `${theme.accent}30` }}>
                    
                    {/* Inner glowing orb */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-[50px] animate-pulse" 
                         style={{ backgroundColor: theme.accent }} />
                    
                    {/* The Interactive Cloud */}
                    <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
                        <InteractiveWordCloud words={words} color={theme.text} />
                    </div>
                </div>
            </section>

            {/* --- SHIFT SECTION --- */}
            <section className="py-24 grid md:grid-cols-12 gap-12 border-t relative overflow-hidden" style={{ borderColor: `${theme.accent}20` }}>
                   <div className="md:col-span-5 space-y-6 z-10">
                       <span className="text-xs font-bold tracking-widest uppercase flex items-center gap-2" style={{ color: theme.accent }}>
                           <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }}/>
                           {content.shiftLabel}
                       </span>
                       <h2 className="text-4xl md:text-5xl font-black leading-none" style={{ color: theme.text }}>{content.shiftTitle}</h2>
                   </div>
                   <div className="md:col-span-7 space-y-6 text-lg md:text-xl leading-relaxed opacity-80 font-light border-l pl-8 z-10" style={{ borderColor: theme.accent, color: theme.text }}>
                       {content.shiftBody.map((p: string, i: number) => <p key={i}>{p}</p>)}
                   </div>
            </section>

            {/* --- METHODOLOGY CARDS --- */}
            <section className="py-12">
                 <div className="mb-16 relative z-10">
                     <span className="text-xs font-bold tracking-widest uppercase mb-4 block opacity-50" style={{ color: theme.text }}>{content.methodLabel}</span>
                     <h2 className="text-4xl md:text-6xl font-black" style={{ color: theme.text }}>{content.methodTitle}</h2>
                 </div>
                 
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {content.methodSteps.map((step: any, i: number) => (
                         <div key={i} 
                              className="group p-6 rounded-2xl border bg-white/60 backdrop-blur-md hover:bg-white transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col relative overflow-hidden h-[320px]"
                              style={{ borderColor: `${theme.accent}20` }}
                         >
                             <div className="flex justify-between items-start mb-4 z-10">
                                <div className="p-2 rounded-xl bg-white shadow-sm text-current" style={{ color: theme.accent }}>
                                    {React.cloneElement(step.icon, { className: "w-5 h-5" })}
                                </div>
                                <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest px-2 py-1 rounded bg-black/5">{step.label}</span>
                             </div>
                             
                             <h3 className="text-xl font-bold mb-2 leading-tight z-10" style={{ color: theme.text }}>{step.title}</h3>
                             <p className="text-sm opacity-70 mb-4 leading-relaxed z-10" style={{ color: theme.text }}>{step.body}</p>
                             
                             {/* Bottom Visualizer Area */}
                             <div className="mt-auto w-full pt-4 border-t border-dashed opacity-50 group-hover:opacity-100 transition-opacity" style={{ borderColor: theme.accent }}>
                                {step.anim}
                             </div>
                         </div>
                     ))}
                 </div>
            </section>

            {/* --- OUTCOMES (Value) --- */}
            <section className="py-24">
                <div className="inline-flex px-3 py-1 rounded border text-[10px] font-bold tracking-widest uppercase mb-8" 
                     style={{ borderColor: theme.accent, color: theme.accent }}>
                    {content.outcomeLabel}
                </div>
                <h2 className="text-4xl font-black mb-12" style={{ color: theme.text }}>{content.outcomeTitle}</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {content.outcomes.map((item: any, i: number) => (
                        <div key={i} className="bg-white/40 border p-8 rounded-2xl backdrop-blur-sm" style={{borderColor: `${theme.accent}30`}}>
                            <h3 className="text-xl font-bold mb-3" style={{color: theme.text}}>{item.title}</h3>
                            <p className="opacity-70 leading-relaxed" style={{color: theme.text}}>{item.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- BIO & CTA --- */}
            <section className="mt-12 py-16 px-6 md:px-12 rounded-[2.5rem] bg-white/70 backdrop-blur-lg border shadow-xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
                     style={{ borderColor: `${theme.accent}30` }}>
                
                <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden border-4 shadow-lg rotate-3" style={{borderColor: '#fff'}}>
                    {/* Placeholder for bio image */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">Eyal Img</div> 
                </div>

                <div className="flex-grow text-center md:text-start">
                     <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Eyal Izenman</div>
                     <p className="text-xl md:text-2xl font-medium italic mb-8 leading-relaxed" style={{ color: theme.text }}>
                        {currentLang === 'he' 
                            ? '"AI הוא לא טריק טכנולוגי – הוא מרחב יצירתי שלם. המטרה שלי היא לעזור לך להפוך רעיון לנכס ויזואלי שלם בנשימה אחת."' 
                            : '"AI is not a tech trick – it is a full creative space. My goal is to help you turn an idea into a complete visual asset in one breath."'}
                     </p>
                     
                     <a href="https://wa.me/97236030603" target="_blank" rel="noreferrer" 
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" 
                        style={{ background: theme.accent }}
                     >
                        {currentLang === 'he' ? 'דברו איתי על הסדנה' : 'Talk to me about the workshop'} 
                        <ArrowRight className="w-5 h-5" />
                     </a>
                </div>
            </section>

            {/* --- FOOTER PIPELINE TEXT --- */}
            <div className="text-center mt-20 opacity-40 text-xs font-mono uppercase tracking-widest" style={{ color: theme.text }}>
                Brief → Concept → Style → Mutation → Refinement → Video
            </div>

        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
};
