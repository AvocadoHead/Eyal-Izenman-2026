import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, VolumeX, Monitor, ExternalLink } from 'lucide-react';
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
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
    return null;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        video.muted = !isHovered;
        // Ensure video plays on hover if it was paused
        if (isHovered) {
            video.play().catch(() => {});
        }
    }
  }, [isHovered, activeIndex]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveIndex(index);
  };

  const embedUrl = getYouTubeEmbedUrl(currentSource.fullUrl);

  return (
    <>
        <div 
            onClick={toggleOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full bg-black relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-800"
        >
            <video
                key={activeIndex}
                ref={videoRef}
                src={currentSource.previewUrl}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-700 scale-105 group-hover:scale-100"
                loop
                muted
                playsInline
                autoPlay
            />

            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className={`w-20 h-20 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm transition-all duration-500 ${isHovered ? 'scale-110 bg-white border-white' : 'bg-black/20'}`}>
                    <Play className={`w-8 h-8 ml-1 transition-colors ${isHovered ? 'text-black fill-black' : 'text-white fill-white'}`} />
                </div>
            </div>

            {/* Source Dots for Surrealness */}
            {videoSources.length > 1 && (
                <div className="absolute bottom-6 right-6 z-30 flex gap-2">
                    {videoSources.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => handleDotClick(e, idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 shadow-md ${
                                idx === activeIndex 
                                    ? 'bg-white scale-150' 
                                    : 'bg-white/40 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            )}

            <div className="absolute bottom-6 left-6 text-white flex items-center gap-2 z-20 transition-opacity duration-300">
                {isHovered ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4 opacity-50" />}
                <span className={`text-[10px] font-bold tracking-widest uppercase transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    {isHovered ? 'Sound On' : ''}
                </span>
            </div>

            <div className="absolute top-6 right-6 z-20 text-right mix-blend-difference pointer-events-none">
                <span className="block text-white font-display font-bold text-3xl tracking-tight leading-none">{year}</span>
                <span className="block text-white/70 font-english text-[10px] tracking-widest uppercase">{title}</span>
            </div>
        </div>

        {isOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-[fadeIn_0.5s_ease-out]">
                <div className="absolute inset-0" onClick={toggleOpen}></div>
                
                <button 
                    onClick={toggleOpen} 
                    className="absolute top-6 right-6 md:right-auto md:left-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[110] group"
                >
                    <X className="w-8 h-8 group-hover:rotate-90 transition-transform stroke-1" />
                </button>

                <div className="relative w-[95vw] md:w-[85vw] h-[60vh] md:h-[85vh] max-w-[1600px] bg-black rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col z-20">
                    <div className="flex-grow relative bg-black">
                        {embedUrl ? (
                             <iframe
                                src={embedUrl}
                                className="w-full h-full absolute inset-0"
                                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                                title={title}
                            />
                        ) : (
                             <video 
                                src={currentSource.fullUrl || currentSource.previewUrl} 
                                controls 
                                autoPlay 
                                className="w-full h-full object-contain"
                             />
                        )}
                    </div>

                    <div className="h-16 bg-zinc-900/50 backdrop-blur-md border-t border-zinc-800 flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center gap-4">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            <div className="text-zinc-400 text-[10px] uppercase tracking-widest font-sans">
                                {title} <span className="text-zinc-600 mx-2">|</span> {year}
                                {videoSources.length > 1 && <span className="text-rose-400 ml-2">[{activeIndex + 1}/{videoSources.length}]</span>}
                            </div>
                        </div>
                        <a href={currentSource.fullUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-rose-400 transition-colors text-[10px] font-bold uppercase tracking-widest">
                            <Monitor className="w-4 h-4" />
                            <span className="hidden md:inline">View Source</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
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
