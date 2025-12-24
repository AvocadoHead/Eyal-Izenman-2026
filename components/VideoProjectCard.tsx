import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, VolumeX, Monitor, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface VideoSource {
  previewUrl: string; // Direct MP4 for card background
  fullUrl: string;    // YouTube URL or direct MP4 for Modal
}

interface VideoProjectCardProps {
  id: string;
  year: string;
  title: string;
  videoSources: VideoSource[];
}

export const VideoProjectCard: React.FC<VideoProjectCardProps> = ({
  id,
  year,
  title,
  videoSources
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentSource = videoSources[activeIndex];

  // Helper to extract YouTube ID and create embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('shorts/')) {
        videoId = url.split('shorts/')[1].split('?')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    }
    
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0`;
    }
    return null;
  };

  // Aggressive Play Logic for Background Cards
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        video.muted = true;
        video.defaultMuted = true;
        
        const playVideo = () => {
          video.play().catch(err => {
            console.warn("Autoplay blocked or failed:", err);
          });
        };

        if (video.readyState >= 3) {
            playVideo();
        } else {
            video.addEventListener('canplay', playVideo);
            return () => video.removeEventListener('canplay', playVideo);
        }
    }
  }, [activeIndex, isHovered]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const navigate = (direction: 'next' | 'prev', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (direction === 'next') {
        setActiveIndex((prev) => (prev + 1) % videoSources.length);
    } else {
        setActiveIndex((prev) => (prev - 1 + videoSources.length) % videoSources.length);
    }
  };

  const embedUrl = getYouTubeEmbedUrl(currentSource.fullUrl);

  return (
    <>
        <div 
            onClick={toggleOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full bg-black relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 shadow-lg"
        >
            <video
                key={`${id}-preview-${activeIndex}`}
                ref={videoRef}
                src={currentSource.previewUrl}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-700 scale-105 group-hover:scale-100"
                loop
                muted
                playsInline
                autoPlay
            />

            {/* Hover Info Overlay */}
            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'} flex items-center justify-center z-10`}>
                <div className={`w-16 h-16 rounded-full bg-white flex items-center justify-center transition-transform duration-500 ${isHovered ? 'scale-100' : 'scale-50'}`}>
                    <Play className="w-6 h-6 text-black fill-black ml-1" />
                </div>
            </div>

            {/* Navigation Dots on Main Page */}
            {videoSources.length > 1 && (
                <div className="absolute bottom-6 right-6 z-30 flex gap-2">
                    {videoSources.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveIndex(idx);
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 shadow-md ${
                                idx === activeIndex 
                                    ? 'bg-white scale-150 shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                                    : 'bg-white/40 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Sound Indicator */}
            <div className="absolute bottom-6 left-6 text-white flex items-center gap-2 z-20 transition-opacity duration-300">
                <VolumeX className="w-3 h-3 opacity-50" />
                <span className="text-[9px] font-bold tracking-widest uppercase opacity-50">Autoplay Muted</span>
            </div>

            <div className="absolute top-6 right-6 z-20 text-right mix-blend-difference pointer-events-none">
                <span className="block text-white font-display font-bold text-3xl tracking-tight leading-none">{year}</span>
                <span className="block text-white/70 font-english text-[10px] tracking-widest uppercase">{title}</span>
            </div>
        </div>

        {isOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-[fadeIn_0.4s_ease-out]">
                <div className="absolute inset-0" onClick={toggleOpen}></div>
                
                {/* Close Button */}
                <button 
                    onClick={toggleOpen} 
                    className="absolute top-8 right-8 md:right-auto md:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[110] group border border-white/10"
                >
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>

                {/* Modal Navigation - Arrows */}
                {videoSources.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => navigate('prev', e)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-4 bg-white/5 hover:bg-white/10 rounded-full text-white border border-white/5 backdrop-blur-md transition-all group hidden md:flex"
                        >
                            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button 
                            onClick={(e) => navigate('next', e)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-4 bg-white/5 hover:bg-white/10 rounded-full text-white border border-white/5 backdrop-blur-md transition-all group hidden md:flex"
                        >
                            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </>
                )}

                <div className="relative w-[95vw] md:w-[85vw] h-[65vh] md:h-[85vh] max-w-[1600px] bg-black rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col z-20">
                    <div className="flex-grow relative bg-black">
                        {embedUrl ? (
                             <iframe
                                key={`modal-frame-${activeIndex}`}
                                src={embedUrl}
                                className="w-full h-full absolute inset-0"
                                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                                title={title}
                            />
                        ) : (
                             <video 
                                key={`modal-video-${activeIndex}`}
                                src={currentSource.fullUrl || currentSource.previewUrl} 
                                controls 
                                autoPlay 
                                className="w-full h-full object-contain"
                             />
                        )}
                    </div>

                    {/* Bottom Toolbar */}
                    <div className="h-20 bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-800 flex items-center justify-between px-8 shrink-0">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                <span className="text-white text-xs font-bold uppercase tracking-widest">{title}</span>
                                <span className="text-zinc-600 text-xs tracking-widest">| {year}</span>
                            </div>
                            
                            {/* Mobile/Small Screen dots inside modal */}
                            {videoSources.length > 1 && (
                                <div className="flex gap-2 mt-1">
                                    {videoSources.map((_, idx) => (
                                        <div 
                                            key={idx}
                                            className={`h-1 transition-all duration-300 rounded-full ${idx === activeIndex ? 'w-6 bg-rose-500' : 'w-2 bg-zinc-700'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            {videoSources.length > 1 && (
                                <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5">
                                     <button onClick={(e) => navigate('prev', e)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft className="w-4 h-4 text-white" /></button>
                                     <span className="text-[10px] text-zinc-400 font-mono px-2">{activeIndex + 1} / {videoSources.length}</span>
                                     <button onClick={(e) => navigate('next', e)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronRight className="w-4 h-4 text-white" /></button>
                                </div>
                            )}
                            <a href={currentSource.fullUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-rose-400 transition-colors text-[10px] font-bold uppercase tracking-widest">
                                <Monitor className="w-4 h-4" />
                                <span className="hidden sm:inline">Source</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                `}</style>
            </div>,
            document.body
        )}
    </>
  );
};
