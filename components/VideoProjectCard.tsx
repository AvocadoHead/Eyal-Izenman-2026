import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, VolumeX, Monitor, ExternalLink, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface VideoSource {
  previewUrl: string; // Direct MP4 URL
  fullUrl: string;    // YouTube URL or MP4
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
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInlinePlaying, setIsInlinePlaying] = useState(false); // Tracks if user unmuted the card
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentSource = videoSources[activeIndex];

  // Helper: Get YouTube Embed
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
      let videoId = '';
      if (url.includes('shorts/')) videoId = url.split('shorts/')[1].split('?')[0];
      else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
      else if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
      else if (url.includes('embed/')) videoId = url.split('embed/')[1].split('?')[0];
      
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`;
    } catch (e) { return null; }
    return null;
  };

  // --- EFFECT: Manage Video Element Attributes ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 1. Force defaultMuted for browser autoplay policy
    video.defaultMuted = true;
    
    // 2. Sync mute state with React state
    video.muted = !isInlinePlaying;

    // 3. Safe Play Attempt
    const attemptPlay = async () => {
      try {
        if (video.paused) {
            await video.play();
        }
      } catch (err: any) {
        // Only log "NotAllowed" errors (Autoplay blocked), ignore "Abort" (State change)
        if (err.name !== 'AbortError') {
             console.warn("Video playback interrupted:", err.message);
        }
        // If failed and meant to be background, ensure muted
        if (!isInlinePlaying) {
            video.muted = true;
        }
      }
    };

    attemptPlay();

  }, [activeIndex, isInlinePlaying]); 


  // --- HANDLERS ---

  const handleCardClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent "ProjectCard" link from reloading the page
    e.preventDefault();
    e.stopPropagation();

    if (!isInlinePlaying) {
      // Step 1: Unmute and Play Inline
      setIsInlinePlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0; // Restart video
        videoRef.current.muted = false;
        videoRef.current.play().catch(e => console.error("Play failed", e));
      }
    } else {
      // Step 2: Open Modal
      setIsOpen(true);
      // Pause background video to prevent double audio
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  };

  const handleModalClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
    setIsInlinePlaying(false); // Return to muted background loop
    // Resume background video
    if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
    }
  };

  const navigate = (direction: 'next' | 'prev', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsInlinePlaying(false); // Reset to muted state on slide change
    
    if (direction === 'next') {
        setActiveIndex((prev) => (prev + 1) % videoSources.length);
    } else {
        setActiveIndex((prev) => (prev - 1 + videoSources.length) % videoSources.length);
    }
  };

  const embedUrl = getYouTubeEmbedUrl(currentSource.fullUrl);

  return (
    <>
        {/* --- INLINE CARD --- */}
        <div 
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full bg-black relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 shadow-lg select-none"
        >
            {currentSource?.previewUrl ? (
                <video
                    key={`video-${id}-${activeIndex}`} // Forces remount on change to clear buffers
                    ref={videoRef}
                    src={currentSource.previewUrl}
                    className={`w-full h-full object-cover transition-transform duration-700 
                        ${isHovered ? 'scale-100' : 'scale-105'}
                        ${isInlinePlaying ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'}
                    `}
                    loop
                    muted
                    playsInline
                    autoPlay
                    preload="auto"
                />
            ) : (
                // Fallback if URL is missing to prevent crash
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                    No Video Source
                </div>
            )}

            {/* Play Button Overlay (Only when muted) */}
            {!isInlinePlaying && (
                <div className={`absolute inset-0 bg-black/10 flex items-center justify-center z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                        <Play className="w-6 h-6 text-white ml-1 fill-white" />
                    </div>
                </div>
            )}

            {/* Fullscreen Hint (Only when playing) */}
            {isInlinePlaying && isHovered && (
                 <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in duration-200">
                     <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-xl">
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Fullscreen</span>
                     </div>
                 </div>
            )}

            {/* Audio Indicator */}
            <div className="absolute bottom-6 left-6 text-white flex items-center gap-2 z-20 transition-opacity duration-300">
                {isInlinePlaying ? (
                    <div className="flex items-center gap-2 text-rose-500">
                         <Volume2 className="w-4 h-4 animate-pulse" />
                         <span className="text-[10px] font-bold tracking-widest uppercase text-white">Sound On</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 opacity-50">
                        <VolumeX className="w-3 h-3" />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Preview</span>
                    </div>
                )}
            </div>

            {/* Dots Navigation */}
            {videoSources.length > 1 && (
                <div className="absolute bottom-6 right-6 z-30 flex gap-2" onClick={e => e.stopPropagation()}>
                    {videoSources.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveIndex(idx);
                                setIsInlinePlaying(false);
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${
                                idx === activeIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            )}

            <div className="absolute top-6 right-6 z-20 text-right mix-blend-difference pointer-events-none">
                <span className="block text-white font-display font-bold text-3xl tracking-tight leading-none">{year}</span>
                <span className="block text-white/70 font-english text-[10px] tracking-widest uppercase">{title}</span>
            </div>
        </div>

        {/* --- MODAL --- */}
        {isOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
                <div className="absolute inset-0" onClick={handleModalClose}></div>
                
                <button 
                    onClick={handleModalClose} 
                    className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-[110]"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="relative w-full h-full md:w-[85vw] md:h-[85vh] max-w-[1600px] bg-black md:rounded-3xl border border-white/10 flex flex-col z-20 overflow-hidden shadow-2xl">
                    <div className="flex-grow relative bg-black flex items-center justify-center">
                        {embedUrl ? (
                             <iframe
                                key={`modal-iframe-${activeIndex}`}
                                src={embedUrl}
                                className="w-full h-full absolute inset-0"
                                allow="autoplay; fullscreen; encrypted-media"
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

                        {videoSources.length > 1 && (
                            <>
                                <button onClick={(e) => navigate('prev', e)} className="absolute left-4 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full">
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button onClick={(e) => navigate('next', e)} className="absolute right-4 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full">
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>,
            document.body
        )}
    </>
  );
};
