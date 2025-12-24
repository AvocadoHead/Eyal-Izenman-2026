import React, { useEffect, useRef, useState } from 'react';
import { Project, Course } from './types';
import { ProjectCard } from './components/ProjectCard';
import { CourseSection } from './components/CourseSection';
import { CourseModal } from './components/CourseModal';
import { SitePreview } from './components/SitePreview';
import { VideoProjectCard } from './components/VideoProjectCard';
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
        surreal: { title: 'Surrealness', desc: 'מחקר ויזואלי בתנועה וחלום. יצירה אבסטרקטית הבוחנת את הגבול בין המציאותי למחולל.' },
        aiIndex: { title: 'AI Index', desc: 'אינדקס כלי בינה מלאכותית. מאגר חי ונושם של הכלים הכי חדשים בתעשייה.' },
        optopia: { title: 'Optopia Collective', desc: 'קהילת אמנות גנרטיבית. המקום שבו יוצרים נפגשים כדי לחקור, לשתף וליצור ביחד.' },
        aether: { title: 'Aether Gallery', desc: 'גלריה במרחב תלת-ממדי. חווית צפייה אימרסיבית בעבודות נבחרות.' }
    },
    courses: {
        marketing: { 
            title: 'שיווק קריאייטיבי', 
            subtitle: 'פיצוח הבריף', 
            desc: 'הפסיכולוגיה שמאחורי קמפיינים מנצחים.' 
        },
        editing: { 
            title: 'עריכה ופוסט', 
            subtitle: 'Skill over Tool', 
            desc: 'המרחק בין After Effects ל-CapCut.' 
        },
        genai: { 
            title: 'יצירה ג׳נרטיבית', 
            subtitle: 'לזרוע, לטפח, לגדל', 
            desc: 'האלכימיה של היצירה מהכאוס.' 
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
        surreal: { title: 'Surrealness', desc: 'Visual research in motion and dreams. An abstract piece exploring the boundary between real and generated.' },
        aiIndex: { title: 'AI Index', desc: 'Curated AI Tools Index. A living database of the newest industry tools.' },
        optopia: { title: 'Optopia Collective', desc: 'Generative Art Community. Where creators meet to explore, share, and build together.' },
        aether: { title: 'Aether Gallery', desc: '3D Spatial Gallery. Immersive viewing experience of selected artworks.' }
    },
    courses: {
        marketing: { 
            title: 'Creative Marketing', 
            subtitle: 'Cracking the Brief', 
            desc: 'The psychology behind winning campaigns.' 
        },
        editing: { 
            title: 'Editing & Post', 
            subtitle: 'Skill over Tool', 
            desc: 'From After Effects to free tools like CapCut.' 
        },
        genai: { 
            title: 'Generative Creation', 
            subtitle: 'Seed, Nurture, Grow', 
            desc: 'The alchemy of growing ideas from chaos.' 
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
                    // Standard single video props
                    previewVideoUrl="https://assets.mixkit.co/videos/preview/mixkit-abstract-texture-of-black-and-white-lines-and-dots-33479-large.mp4"
                    fullVideoEmbedUrl="#"
                    fullVideoDirectUrl="#"
                 />
    },
    {
      id: 'surreal',
      title: t.projects.surreal.title,
      description: t.projects.surreal.desc,
      link: '#',
      type: 'video',
      component: <VideoProjectCard 
                    id="surreal"
                    year="2025"
                    title="Surrealness"
                    // New multi-video prop. 
                    // IMPORTANT: Replace the INSERT_ strings below with your actual URLs.
                    videoSources={[
                      {
                        previewUrl: "INSERT_VIDEO_1_PREVIEW_URL.mp4",
                        fullEmbedUrl: "INSERT_VIDEO_1_EMBED_URL",
                        fullDirectUrl: "INSERT_VIDEO_1_DIRECT_URL"
                      },
                      {
                        previewUrl: "INSERT_VIDEO_2_PREVIEW_URL.mp4",
                        fullEmbedUrl: "INSERT_VIDEO_2_EMBED_URL",
                        fullDirectUrl: "INSERT_VIDEO_2_DIRECT_URL"
                      },
                      {
                        previewUrl: "INSERT_VIDEO_3_PREVIEW_URL.mp4",
                        fullEmbedUrl: "INSERT_VIDEO_3_EMBED_URL",
                        fullDirectUrl: "INSERT_VIDEO_3_DIRECT_URL"
                      },
                      {
                        previewUrl: "INSERT_VIDEO_4_PREVIEW_URL.mp4",
                        fullEmbedUrl: "INSERT_VIDEO_4_EMBED_URL",
                        fullDirectUrl: "INSERT_VIDEO_4_DIRECT_URL"
                      }
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative font-sans selection:bg-rose-200 overflow-x-hidden" dir="ltr">
      {/* Texture Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Language Toggle */}
      <button onClick={toggleLanguage} className="fixed top-6 right-6 md:right-auto md:left-6 z-50 bg-white/50 hover:bg-white backdrop-blur-sm border border-slate-200 p-2 rounded-full shadow-sm transition-all group flex items-center gap-2">
        <Globe className="w-5 h-5 text-slate-600" />
        <span className="text-[10px] font-bold font-english uppercase tracking-widest text-slate-500 w-0 overflow-hidden group-hover:w-auto group-hover:px-1 transition-all duration-300">
            {lang === 'he' ? 'EN' : 'HE'}
        </span>
      </button>

      {/* Floating Contact */}
      <a href="https://wa.me/97236030603" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center">
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>

      <main className="relative z-10" ref={containerRef}>
        {/* Hero Section */}
        <section className="pt-32 pb-40 px-6 md:px-12 flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16 relative z-20">
            <div className="relative group shrink-0">
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-[1px] border-slate-200 shadow-2xl relative z-10 bg-white">
                    <img src={PROFILE_IMAGE_URL} alt="Eyal Izenman" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[2s]" />
                </div>
            </div>
            <div className="text-center md:text-left pt-2 relative" dir={textDir}>
                <h1 className="font-sans font-black text-6xl md:text-8xl text-slate-900 mb-1 tracking-tight leading-none">{t.name}</h1>
                <div className={`font-english text-sm md:text-base text-slate-400 flex flex-col md:flex-row gap-1 md:gap-3 items-center ${lang === 'he' ? 'md:items-start md:flex-row-reverse' : 'md:items-start'} font-normal tracking-tighter mt-3 uppercase`}>
                    {t.roles.map((role, index) => (
                        <React.Fragment key={index}>
                            <span className="text-slate-500 font-medium tracking-widest">{role}</span>
                            {index < t.roles.length - 1 && <span className="hidden md:inline text-slate-300 opacity-50">/</span>}
                        </React.Fragment>
                    ))}
                </div>
                <p className="mt-6 max-w-lg text-slate-600 leading-relaxed font-light text-xl">{t.bio}</p>
            </div>
        </section>

        {/* The Generative Line / Background Animation */}
        <NarrativeLine scrollProgress={scrollProgress} />

        {/* Projects Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-48 pt-0 relative">
            <div className="flex flex-col w-full gap-56">
                {currentProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} alignment={index % 2 === 0 ? 'right' : 'left'} textDir={textDir} />
                ))}
            </div>
        </section>

        {/* Courses Section */}
        <section className="relative pt-32 pb-32">
             <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#f8fafc] via-white to-transparent z-10"></div>
             <div className="text-center mb-24 relative z-20" dir={textDir}>
                <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">{t.coursesTitle}</h2>
                <p className="text-slate-500 font-light text-xl">{t.coursesSubtitle}</p>
             </div>
             <CourseSection courses={currentCourses} onSelectCourse={handleCourseSelect} textDir={textDir} currentLang={lang} onToggleLang={toggleLanguage} />
        </section>

        {/* Footer */}
        <footer className="py-20 bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6" dir="ltr">
                <p className="font-english opacity-60">&copy; {new Date().getFullYear()} {t.footerRights} Eyal Izenman.</p>
                <div className="flex items-center gap-8">
                    <a href="mailto:eyalizenman@gmail.com" className="hover:text-white transition-colors font-medium text-base flex items-center gap-2">
                        <Mail className="w-4 h-4" /> eyalizenman@gmail.com
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
