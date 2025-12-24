import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, VolumeX, Monitor, ExternalLink, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface VideoSource {
  previewUrl: string; // Direct MP4 (Cloudinary)
  fullUrl: string;    // YouTube URL
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
  
  // State to track if the user has clicked once to unmute the card
  const [isInlineActive, setIsInlineActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentSource = videoSources[activeIndex];

  // --- YouTube Helper ---
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = '';
    try {
        if (url.includes('shorts/')) videoId = url.split('shorts/')[1].split('?')[0];
        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
        else if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
        else if (url.includes('embed/')) videoId = url.split('embed/')[1].split('?')[0];
        
        if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`;
    } catch (e) { console.error("Error parsing YouTube URL", e); }
    return null;
  };

  // --- 1. Robust Autoplay Setup ---
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        // Crucial for React/Chrome: defaultMuted allows autoplay to start
        video.defaultMuted = true;
        video.muted = !isInlineActive; 
        
        // Try to play immediately on mount/change
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // If autoplay fails, force mute and try again (browser policy fallback)
                console.log("Autoplay recovered by muting");
                video.muted = true;
                video.play();
            });
        }
    }
  }, [activeIndex, currentSource]); // Re-run when video changes

  // --- 2. The Interaction Logic ---
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // PHASE 1: User clicks to hear sound (Inline)
    if (!isInlineActive) {
        setIsInlineActive(true);
        if(videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.currentTime = 0; // Restart for better experience
            videoRef.current.play();
        }
    } 
    // PHASE 2: User clicks again to open big player (Modal)
    else {
        setIsOpen(true);
        // We pause/mute the background card so audio doesn't overlap
        if(videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.pause();
        }
    }
  };

  const closeModal = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setIsOpen(false);
    // When closing modal, return card to background loop state
    setIsInlineActive(false);
    if(videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play();
    }
  };

  const navigate = (direction: 'next' | 'prev', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Reset inline state when switching videos
    setIsInlineActive(false);
    
    if (direction === 'next') {
        setActiveIndex((prev) => (prev + 1) % videoSources.length);
    } else {
        setActiveIndex((prev) => (prev - 1 + videoSources.length) % videoSources.length);
    }
  };

  const embedUrl = getYouTubeEmbedUrl(currentSource.fullUrl);

  return (
    <>
        {/* --- CARD COMPONENT --- */}
        <div 
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full bg-black relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 shadow-lg select-none transform transition-transform"
        >
            {/* The MP4 Preview */}
            <video
                key={`${id}-video-${activeIndex}`}
                ref={videoRef}
                src={currentSource.previewUrl}
                className={`w-full h-full object-cover transition-all duration-700 
                    ${isHovered ? 'scale-100 opacity-100' : 'scale-105 opacity-60'}
                    ${isInlineActive ? 'opacity-100 scale-100' : ''}
                `}
                loop
                playsInline
                autoPlay
                muted // Initial state handled by ref, but good for SSR
            />

            {/* Overlay: Play Icon (Only shows if NOT playing sound yet) */}
            {!isInlineActive && (
                <div className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'} flex items-center justify-center z-10 pointer-events-none`}>
                    <div className={`w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform duration-500 ${isHovered ? 'scale-100' : 'scale-50'}`}>
                        <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                </div>
            )}

            {/* Overlay: Expand Hint (Only shows if ALREADY playing sound) */}
            {isInlineActive && isHovered && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in fade-in duration-300">
                    <div className="bg-black/60 backdrop-blur-md text-white px-5 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-xl">
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Fullscreen</span>
                    </div>
                </div>
            )}

            {/* Navigation Dots (If multiple videos) */}
            {videoSources.length > 1 && (
                <div className="absolute bottom-6 right-6 z-30 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {videoSources.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsInlineActive(false); // Reset to muted loop on switch
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

            {/* Sound Status Indicator */}
            <div className="absolute bottom-6 left-6 text-white flex items-center gap-2 z-20 pointer-events-none">
                {isInlineActive ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <Volume2 className="w-4 h-4 text-rose-500" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white">Playing</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 opacity-50">
                        <VolumeX className="w-4 h-4" />
                        <span className="text-[10px] font-bold tracking-widest uppercase">Preview</span>
                    </div>
                )}
            </div>

            {/* Title / Year */}
            <div className="absolute top-6 right-6 z-20 text-right mix-blend-difference pointer-events-none">
                <span className="block text-white font-display font-bold text-3xl tracking-tight leading-none">{year}</span>
                <span className="block text-white/70 font-english text-[10px] tracking-widest uppercase">{title}</span>
            </div>
        </div>

        {/* --- MODAL COMPONENT (YouTube / Full View) --- */}
        {isOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
                {/* Backdrop Click */}
                <div className="absolute inset-0" onClick={closeModal}></div>
                
                <button 
                    onClick={closeModal} 
                    className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[110] border border-white/10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Main Modal Container */}
                <div className="relative w-full h-full md:w-[90vw] md:h-[90vh] max-w-[1600px] bg-black md:rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col z-20">
                    
                    {/* Video Area */}
                    <div className="flex-grow relative bg-black flex items-center justify-center">
                        {embedUrl ? (
                             <iframe
                                key={`modal-frame-${activeIndex}`}
                                src={embedUrl}
                                className="w-full h-full absolute inset-0"
                                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                                title={title}
                            />
                        ) : (
                            // Fallback if fullUrl is actually a direct file and not YouTube
                             <video 
                                src={currentSource.fullUrl} 
                                controls 
                                autoPlay 
                                className="w-full h-full object-contain"
                             />
                        )}
                        
                        {/* Modal Navigation Arrows */}
                        {videoSources.length > 1 && (
                            <>
                                <button onClick={(e) => navigate('prev', e)} className="absolute left-4 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                    <ChevronLeft className="w-10 h-10" />
                                </button>
                                <button onClick={(e) => navigate('next', e)} className="absolute right-4 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                    <ChevronRight className="w-10 h-10" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Modal Footer Bar */}
                    <div className="h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-6 shrink-0">
                         <div className="flex flex-col">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">{title}</h3>
                            <span className="text-zinc-500 text-xs">{activeIndex + 1} / {videoSources.length}</span>
                         </div>

                         <a href={currentSource.fullUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                            <Monitor className="w-4 h-4" />
                            <span className="hidden sm:inline">Open Source</span>
                            <ExternalLink className="w-3 h-3" />
                         </a>
                    </div>
                </div>
            </div>,
            document.body
        )}
    </>
  );
};
