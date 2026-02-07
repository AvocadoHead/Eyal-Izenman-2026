import React, { useEffect, useRef, useState } from 'react';
import { Project, Course } from './types';
import { CourseSection } from './components/CourseSection';
import { CourseModal } from './components/CourseModal';
import { SitePreview } from './components/SitePreview';
import { VideoProjectCard } from './components/VideoProjectCard';
import { MultiVideoProjectCard } from './components/MultiVideoProjectCard';
import { MagneticCursor } from './components/MagneticCursor';
import { FluidBackground } from './components/FluidBackground';
import { ProjectGrid } from './components/ProjectGrid';
import { Globe, MessageCircle, Mail, ArrowDown, Sparkles } from 'lucide-react';

const PROFILE_IMAGE_URL = "https://lh3.googleusercontent.com/d/1zIWiopYxC_J4r-Ns4VmFvCXaLPZFmK4k=s2000?authuser=0";

type Language = 'he' | 'en';

const CONTENT = {
  he: {
    name: 'איל איזנמן',
    roles: ['Motion Artist', 'בינאי', 'Educator'],
    bio: 'אני מחבר בין סיפורים לטכנולוגיה. יוצר חוויות ויזואליות שמשלבות רגש אנושי עם הקצה של הבינה המלאכותית.',
    scrollPrompt: 'גלול לגלות',
    projectsTitle: 'עבודות נבחרות',
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
      marketing: { title: 'אסטרטגיית קריאייטיב', subtitle: 'פיצוח הבריף', desc: 'למנהלי קריאייטיב ומותגים שרוצים להפוך בריף לקונספט מנצח.' },
      editing: { title: 'עריכה קולנועית', subtitle: 'Skill over Tool', desc: 'לעורכים ויוצרי תוכן שמחפשים קצב, זרימה וסיפור בכל תוכנה.' },
      genai: { title: 'מערכות יצירה ג׳נרטיביות', subtitle: 'לזרוע, לטפח, לגדל', desc: 'לאמנים וצוותי חדשנות שבונים שפה ויזואלית עקבית עם AI.' }
    }
  },
  en: {
    name: 'Eyal Izenman',
    roles: ['Motion Artist', 'Generative AI Enthusiast', 'Educator'],
    bio: 'Bridging stories and technology. Creating visual experiences that fuse human emotion with the cutting edge of Artificial Intelligence.',
    scrollPrompt: 'Scroll to discover',
    projectsTitle: 'Selected Works',
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
      marketing: { title: 'Creative Strategy', subtitle: 'Cracking the Brief', desc: 'For creative leads who turn briefs into magnetic campaigns.' },
      editing: { title: 'Cinematic Editing', subtitle: 'Skill over Tool', desc: 'For editors who want rhythm, flow, and story in any tool.' },
      genai: { title: 'Generative Systems', subtitle: 'Seed, Nurture, Grow', desc: 'For teams building consistent visual language with AI.' }
    }
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('he');
  const [isLoaded, setIsLoaded] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [scrollY, setScrollY] = useState(0);

  const t = CONTENT[lang];
  const textDir = lang === 'he' ? 'rtl' : 'ltr';

  // Initial load animation
  useEffect(() => {
    setIsLoaded(true);
    setTimeout(() => setHeroVisible(true), 300);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => setLang(prev => prev === 'he' ? 'en' : 'he');

  const currentCourses: Course[] = [
    { id: 'marketing', title: t.courses.marketing.title, subtitle: t.courses.marketing.subtitle, description: t.courses.marketing.desc, color: 'bg-indigo-600', content: null },
    { id: 'video-editing', title: t.courses.editing.title, subtitle: t.courses.editing.subtitle, description: t.courses.editing.desc, color: 'bg-rose-500', content: null },
    { id: 'gen-ai', title: t.courses.genai.title, subtitle: t.courses.genai.subtitle, description: t.courses.genai.desc, color: 'bg-emerald-600', content: null }
  ];

  const currentProjects: Project[] = [
    {
      id: 'showreel', title: t.projects.showreel.title, description: t.projects.showreel.desc, link: '#', type: 'video',
      component: <VideoProjectCard id="showreel" year="2025" title="Showreel" previewVideoUrl="" previewEmbedUrl="https://www.youtube.com/embed/mkjYn2cRhrI" fullVideoEmbedUrl="https://www.youtube.com/embed/mkjYn2cRhrI" fullVideoDirectUrl="https://youtube.com/shorts/mkjYn2cRhrI" />
    },
    {
      id: 'surrealness', title: t.projects.surreal.title, description: t.projects.surreal.desc, link: '#', type: 'video',
      component: <MultiVideoProjectCard year="2025" videos={[
        { id: 'Re2V2zprjNo', title: 'Surreal Dreams 1', embedUrl: 'https://www.youtube.com/embed/Re2V2zprjNo', directUrl: 'https://youtube.com/shorts/Re2V2zprjNo' },
        { id: 'fLYQgmPzBP0', title: 'Surreal Dreams 2', embedUrl: 'https://www.youtube.com/embed/fLYQgmPzBP0', directUrl: 'https://youtube.com/shorts/fLYQgmPzBP0' },
        { id: '4vwRzAcKvz4', title: 'Surreal Dreams 3', embedUrl: 'https://www.youtube.com/embed/4vwRzAcKvz4', directUrl: 'https://youtube.com/shorts/4vwRzAcKvz4' },
        { id: 'rPRcQ4bYEYk', title: 'Surreal Dreams 4', embedUrl: 'https://www.youtube.com/embed/rPRcQ4bYEYk', directUrl: 'https://youtube.com/shorts/rPRcQ4bYEYk' }
      ]} />
    },
    { id: 'ai-index', title: t.projects.aiIndex.title, description: t.projects.aiIndex.desc, link: 'https://avocadohead.github.io/AI-Index/', type: 'interactive', component: <SitePreview url="https://avocadohead.github.io/AI-Index/" /> },
    { id: 'optopia', title: t.projects.optopia.title, description: t.projects.optopia.desc, link: 'https://optopia-collective-hub.vercel.app/', type: 'community', component: <SitePreview url="https://optopia-collective-hub.vercel.app/" /> },
    { id: 'aether', title: t.projects.aether.title, description: t.projects.aether.desc, link: 'https://gallery3-d.vercel.app/', type: 'gallery', component: <SitePreview url="https://gallery3-d.vercel.app/" /> }
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

  const heroParallax = Math.min(scrollY * 0.3, 200);
  const heroOpacity = Math.max(1 - scrollY / 600, 0);

  return (
    <div className={`min-h-screen bg-[#0a0a0f] text-white relative font-sans overflow-x-hidden transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} dir="ltr">
      {/* Fluid Background */}
      <FluidBackground />

      {/* Custom Cursor (desktop only) */}
      <div className="hidden md:block">
        <MagneticCursor />
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[1]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* Top navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <span className="font-bold text-sm tracking-wider">EI</span>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-300 group"
          data-magnetic
        >
          <Globe className="w-4 h-4 text-white/60 group-hover:text-violet-400 transition-colors" />
          <span className="text-xs font-semibold uppercase tracking-wider text-white/60 group-hover:text-white transition-colors">
            {lang === 'he' ? 'EN' : 'עב'}
          </span>
        </button>
      </nav>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/97236030603"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-110 transition-all duration-300"
        data-magnetic
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>

      <main className="relative z-10" ref={containerRef}>
        {/* Hero Section - Full viewport, immersive */}
        <section
          className="min-h-screen flex flex-col items-center justify-center relative px-6"
          style={{ transform: `translateY(${heroParallax}px)`, opacity: heroOpacity }}
        >
          <div className={`flex flex-col items-center text-center transition-all duration-1000 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* Profile image with glow */}
            <div className="relative mb-8 group" data-magnetic>
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
                <img src={PROFILE_IMAGE_URL} alt="Eyal Izenman" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Name with dramatic typography */}
            <h1 className="font-black text-5xl md:text-7xl lg:text-9xl tracking-tighter leading-none mb-4" dir={textDir}>
              <span className="bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
                {t.name}
              </span>
            </h1>

            {/* Roles */}
            <div className={`flex flex-wrap justify-center gap-3 md:gap-4 mt-4 ${lang === 'he' ? 'flex-row-reverse' : ''}`}>
              {t.roles.map((role, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-xs md:text-sm font-medium uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-white/70 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100 + 500}ms` }}
                >
                  {role}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p className="mt-8 max-w-xl text-white/50 text-lg md:text-xl leading-relaxed font-light" dir={textDir}>
              {t.bio}
            </p>
          </div>

          {/* Scroll indicator */}
          <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000 delay-1000 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-white/30 text-xs uppercase tracking-[0.3em]">{t.scrollPrompt}</span>
            <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* Projects Section - Dense grid */}
        <section className="relative py-20 md:py-32">
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16 px-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {t.projectsTitle}
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 mx-auto rounded-full" />
          </div>

          <ProjectGrid projects={currentProjects} textDir={textDir} />
        </section>

        {/* Courses Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
          <div className="text-center mb-16 md:mb-24 px-6" dir={textDir}>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
              {t.coursesTitle}
            </h2>
            <p className="text-white/50 text-lg md:text-xl">{t.coursesSubtitle}</p>
          </div>
          <CourseSection courses={currentCourses} onSelectCourse={handleCourseSelect} textDir={textDir} currentLang={lang} onToggleLang={toggleLanguage} />
        </section>

        {/* Footer */}
        <footer className="py-16 md:py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span className="text-white/30 text-sm">&copy; {new Date().getFullYear()} Eyal Izenman</span>
            </div>
            <a
              href="mailto:eyalizenman@gmail.com"
              className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
              data-magnetic
            >
              <Mail className="w-5 h-5 group-hover:text-violet-400 transition-colors" />
              <span className="text-sm">eyalizenman@gmail.com</span>
            </a>
          </div>
        </footer>
      </main>

      {/* Course Modal */}
      <CourseModal course={selectedCourse} onClose={handleCourseClose} textDir={textDir} currentLang={lang} onToggleLang={toggleLanguage} />
    </div>
  );
};

export default App;
