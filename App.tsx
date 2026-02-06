
import React, { useEffect, useRef, useState } from 'react';
import { Project, Course } from './types';
import { ProjectCard } from './components/ProjectCard';
import { CourseSection } from './components/CourseSection';
import { CourseModal } from './components/CourseModal';
import { SitePreview } from './components/SitePreview';
import { VideoProjectCard } from './components/VideoProjectCard';
import { MultiVideoProjectCard } from './components/MultiVideoProjectCard';
import { NarrativeLine } from './components/NarrativeLine';
import { Globe, MessageCircle, Mail } from 'lucide-react';

const PROFILE_IMAGE_URL = "https://lh3.googleusercontent.com/d/1zIWiopYxC_J4r-Ns4VmFvCXaLPZFmK4k=s2000?authuser=0";

type Language = 'he' | 'en';

const CONTENT = {
  he: {
    name: 'איל איזנמן',
    roles: ['Motion Artist', 'בינאי', 'Educator'], 
    bio: 'אני מחבר בין סיפורים לטכנולוגיה. יוצר חוויות ויזואליות שמשלבות רגש אנושי עם הקצה של הבינה המלאכותית.',
    coursesTitle: 'ללמוד מהניסיון שלי',
    coursesSubtitle: 'קורסים מעשיים לשנת 2025.',
    footerRights: 'כל הזכויות שמורות',
    contact: 'צור קשר',
    projects: {
        showreel: { title: 'Showreel 2025', desc: 'Motion & Visual Effects. מסע ויזואלי בין פרויקטים נבחרים.' },
        surreal: { title: 'Surreal Dreams', desc: 'מחקר ויזואלי בתנועה וחלום. יצירה אבסטרקטית הבוחנת את הגבול בין המציאותי למחולל.' },
        aiIndex: { title: 'AI Index', desc: 'אינדקס כלי בינה מלאכותית. מאגר חי ונושם של הכלים הכי חדשים בתעשייה.' },
        optopia: { title: 'Optopia Collective', desc: 'קהילת אמנות גנרטיבית. המקום שבו יוצרים נפגשים כדי לחקור, לשתף וליצור ביחד.' },
        aether: { title: 'Aether Gallery', desc: 'גלריה במרחב תלת-ממדי. חווית צפייה אימרסיבית בעבודות נבחרות.' }
    },
    courses: {
        marketing: { 
            title: 'אסטרטגיית קריאייטיב', 
            subtitle: 'פיצוח הבריף', 
            desc: 'למנהלי קריאייטיב ומותגים שרוצים להפוך בריף לקונספט מנצח.' 
        },
        editing: { 
            title: 'עריכה קולנועית', 
            subtitle: 'Skill over Tool', 
            desc: 'לעורכים ויוצרי תוכן שמחפשים קצב, זרימה וסיפור בכל תוכנה.' 
        },
        genai: { 
            title: 'מערכות יצירה ג׳נרטיביות', 
            subtitle: 'לזרוע, לטפח, לגדל', 
            desc: 'לאמנים וצוותי חדשנות שבונים שפה ויזואלית עקבית עם AI.' 
        }
    }
  },
  en: {
    name: 'Eyal Izenman',
    roles: ['Motion Artist', 'Generative AI Enthusiast', 'Educator'],
    bio: 'Bridging stories and technology. Creating visual experiences that fuse human emotion with the cutting edge of Artificial Intelligence.',
    coursesTitle: 'Learn from Experience',
    coursesSubtitle: 'Practical courses for 2025.',
    footerRights: 'All rights reserved',
    contact: 'Contact',
    projects: {
        showreel: { title: 'Showreel 2025', desc: 'Motion & Visual Effects. A visual journey through selected works.' },
        surreal: { title: 'Surreal Dreams', desc: 'Visual research in motion and dreams. An abstract piece exploring the boundary between real and generated.' },
        aiIndex: { title: 'AI Index', desc: 'Curated AI Tools Index. A living database of the newest industry tools.' },
        optopia: { title: 'Optopia Collective', desc: 'Generative Art Community. Where creators meet to explore, share, and build together.' },
        aether: { title: 'Aether Gallery', desc: '3D Spatial Gallery. Immersive viewing experience of selected artworks.' }
    },
    courses: {
        marketing: { 
            title: 'Creative Strategy', 
            subtitle: 'Cracking the Brief', 
            desc: 'For creative leads who turn briefs into magnetic campaigns.' 
        },
        editing: { 
            title: 'Cinematic Editing', 
            subtitle: 'Skill over Tool', 
            desc: 'For editors who want rhythm, flow, and story in any tool.' 
        },
        genai: { 
            title: 'Generative Systems', 
            subtitle: 'Seed, Nurture, Grow', 
            desc: 'For teams building consistent visual language with AI.' 
        }
    }
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('he');
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const t = CONTENT[lang];
  const textDir = lang === 'he' ? 'rtl' : 'ltr';

  const toggleLanguage = () => {
    setLang(prev => prev === 'he' ? 'en' : 'he');
  };

  const currentCourses: Course[] = [
    {
      id: 'marketing',
      title: t.courses.marketing.title,
      subtitle: t.courses.marketing.subtitle,
      description: t.courses.marketing.desc,
      color: 'bg-indigo-600',
      content: null
    },
    {
      id: 'video-editing',
      title: t.courses.editing.title,
      subtitle: t.courses.editing.subtitle,
      description: t.courses.editing.desc,
      color: 'bg-rose-500',
      content: null
    },
    {
      id: 'gen-ai',
      title: t.courses.genai.title,
      subtitle: t.courses.genai.subtitle,
      description: t.courses.genai.desc,
      color: 'bg-emerald-600',
      content: null
    }
  ];

  const currentProjects: Project[] = [
    {
      id: 'showreel',
      title: t.projects.showreel.title,
      description: t.projects.showreel.desc,
      link: '#',
      type: 'video',
      component: <VideoProjectCard
                    id="showreel"
                    year="2025"
                    title="Showreel"
                    previewVideoUrl="https://www.youtube.com/embed/mkjYn2cRhrI?autoplay=1&mute=1&loop=1&playlist=mkjYn2cRhrI&controls=0&modestbranding=1&rel=0"
                    fullVideoEmbedUrl="https://www.youtube.com/embed/mkjYn2cRhrI"
                    fullVideoDirectUrl="https://youtube.com/shorts/mkjYn2cRhrI"
                 />
    },
    {
    id: 'surrealness',
      title: t.projects.surreal.title,
      description: t.projects.surreal.desc,
      link: '#',
      type: 'video',
      component: <MultiVideoProjectCard
            year="2025"
            videos={[
              { id: 'Re2V2zprjNo', title: 'Surreal Dreams 1', embedUrl: 'https://www.youtube.com/embed/Re2V2zprjNo', directUrl: 'https://youtube.com/shorts/Re2V2zprjNo' },
              { id: 'fLYQgmPzBP0', title: 'Surreal Dreams 2', embedUrl: 'https://www.youtube.com/embed/fLYQgmPzBP0', directUrl: 'https://youtube.com/shorts/fLYQgmPzBP0' },
              { id: '4vwRzAcKvz4', title: 'Surreal Dreams 3', embedUrl: 'https://www.youtube.com/embed/4vwRzAcKvz4', directUrl: 'https://youtube.com/shorts/4vwRzAcKvz4' },
              { id: 'rPRcQ4bYEYk', title: 'Surreal Dreams 4', embedUrl: 'https://www.youtube.com/embed/rPRcQ4bYEYk', directUrl: 'https://youtube.com/shorts/rPRcQ4bYEYk' }
            ]}
                 />
    },
    {
      id: 'ai-index',
      title: t.projects.aiIndex.title,
      description: t.projects.aiIndex.desc,
      link: 'https://avocadohead.github.io/AI-Index/',
      type: 'interactive',
      component: <SitePreview url="https://avocadohead.github.io/AI-Index/" />
    },
    {
      id: 'optopia',
      title: t.projects.optopia.title,
      description: t.projects.optopia.desc,
      link: 'https://optopia-collective-hub.vercel.app/',
      type: 'community',
      component: <SitePreview url="https://optopia-collective-hub.vercel.app/" />
    },
    {
      id: 'aether',
      title: t.projects.aether.title,
      description: t.projects.aether.desc,
      link: 'https://gallery3-d.vercel.app/',
      type: 'gallery',
      component: <SitePreview url="https://gallery3-d.vercel.app/" />
    }
  ];

  // Logic to handle URL parameters for deep-linking (v2: Handles GH Pages subdirs)
  useEffect(() => {
    const handleUrlChange = () => {
        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('course');
        if (courseId) {
            const course = currentCourses.find(c => c.id === courseId);
            if (course) setSelectedCourse(course);
        } else {
            setSelectedCourse(null);
        }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleCourseSelect = (course: Course) => {
      setSelectedCourse(course);
      const url = new URL(window.location.href);
      url.searchParams.set('course', course.id);
      // We use only the pathname and the new search to avoid full domain issues
      window.history.pushState({}, '', window.location.pathname + url.search);
  };

  const handleCourseClose = () => {
      setSelectedCourse(null);
      const url = new URL(window.location.href);
      url.searchParams.delete('course');
      window.history.pushState({}, '', window.location.pathname + url.search);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(window.scrollY / (totalHeight || 1), 0), 1);
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 relative font-sans overflow-x-hidden" dir="ltr">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-slate-50 via-white to-slate-50/80"></div>

      {/* Texture Layer - more subtle */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Language Toggle - refined */}
      <button onClick={toggleLanguage} className="fixed top-6 right-6 md:right-auto md:left-6 z-50 bg-white/70 hover:bg-white backdrop-blur-md border border-slate-200/80 p-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group flex items-center gap-2">
        <Globe className="w-5 h-5 text-slate-500 group-hover:text-violet-500 transition-colors" />
        <span className="text-[10px] font-semibold font-english uppercase tracking-wider text-slate-400 w-0 overflow-hidden group-hover:w-auto group-hover:px-1 group-hover:text-violet-500 transition-all duration-300">
            {lang === 'he' ? 'EN' : 'HE'}
        </span>
      </button>

      {/* Floating Contact - refined */}
      <a href="https://wa.me/97236030603" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center">
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>

      <main className="relative z-10" ref={containerRef}>
        {/* Hero Section */}
        <section className="pt-28 md:pt-36 pb-36 md:pb-44 px-6 md:px-12 flex flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-20 relative z-20">
            <div className="relative group shrink-0">
                {/* Decorative ring */}
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-violet-200/40 via-transparent to-indigo-200/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
                <div className="w-44 h-44 md:w-60 md:h-60 rounded-full overflow-hidden border border-slate-200/60 shadow-xl shadow-slate-200/50 relative z-10 bg-white ring-1 ring-white/50">
                    <img src={PROFILE_IMAGE_URL} alt="Eyal Izenman" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out" />
                </div>
            </div>
            <div className="text-center md:text-left pt-2 relative max-w-xl" dir={textDir}>
                <h1 className="font-sans font-black text-5xl md:text-7xl lg:text-8xl text-slate-900 mb-2 tracking-tight leading-[0.95]">{t.name}</h1>
                <div className={`font-english text-xs md:text-sm text-slate-400 flex flex-col md:flex-row gap-2 md:gap-3 items-center ${lang === 'he' ? 'md:items-start md:flex-row-reverse' : 'md:items-start'} mt-4 uppercase`}>
                    {t.roles.map((role, index) => (
                        <React.Fragment key={index}>
                            <span className="text-slate-500 font-medium tracking-[0.15em]">{role}</span>
                            {index < t.roles.length - 1 && <span className="hidden md:inline text-violet-300">•</span>}
                        </React.Fragment>
                    ))}
                </div>
                <p className="mt-8 text-slate-600 leading-[1.75] font-normal text-lg md:text-xl tracking-wide">{t.bio}</p>
            </div>
        </section>

        {/* The Generative Line / Background Animation */}
        <NarrativeLine scrollProgress={scrollProgress} />

        {/* Projects Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-40 md:pb-52 pt-0 relative">
            <div className="flex flex-col w-full gap-32 md:gap-48">
                {currentProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} alignment={index % 2 === 0 ? 'right' : 'left'} textDir={textDir} />
                ))}
            </div>
        </section>

        {/* Courses Section */}
        <section className="relative pt-28 md:pt-36 pb-28 md:pb-36">
             <div className="absolute top-0 left-0 w-full h-56 bg-gradient-to-b from-[#fafbfc] via-white/90 to-transparent z-10"></div>
             <div className="text-center mb-20 md:mb-28 relative z-20" dir={textDir}>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 tracking-tight">{t.coursesTitle}</h2>
                <p className="text-slate-500 font-normal text-lg md:text-xl tracking-wide">{t.coursesSubtitle}</p>
             </div>
             <CourseSection courses={currentCourses} onSelectCourse={handleCourseSelect} textDir={textDir} currentLang={lang} onToggleLang={toggleLanguage} />
        </section>

        {/* Footer */}
        <footer className="py-16 md:py-20 bg-slate-900 text-slate-400 text-sm border-t border-slate-800/50">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6" dir="ltr">
                <p className="font-english text-slate-500 text-sm">&copy; {new Date().getFullYear()} {t.footerRights} Eyal Izenman.</p>
                <div className="flex items-center gap-8">
                    <a href="mailto:eyalizenman@gmail.com" className="text-slate-400 hover:text-white transition-colors duration-300 font-medium text-base flex items-center gap-2.5 group">
                        <Mail className="w-4 h-4 group-hover:text-violet-400 transition-colors" />
                        <span>eyalizenman@gmail.com</span>
                    </a>
                </div>
            </div>
        </footer>
      </main>

      {/* Modals */}
      <CourseModal course={selectedCourse} onClose={handleCourseClose} textDir={textDir} currentLang={lang} onToggleLang={toggleLanguage} />
    </div>
  );
};

export default App;
