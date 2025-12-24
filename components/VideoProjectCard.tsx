import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, VolumeX, Monitor, ExternalLink, ChevronLeft, ChevronRight, Maximize2, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface VideoSource {
  previewUrl: string; 
  fullUrl: string;    
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
  
  // State for playback control
  const [isInlinePlaying, setIsInlinePlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentSource = videoSources[activeIndex];

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

  // --- Reset state when source changes ---
  useEffect(() => {
    setIsVideoLoaded(false);
    setHasError(false);
    setIsInlinePlaying(false);
  }, [currentSource]);

  // --- Interaction Handlers ---
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasError) return; // Don't interact if broken

    if (!isInlinePlaying) {
      // Click 1: Unmute & Play
      setIsInlinePlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => console.error("Manual play failed:", err));
        }
      }
    } else {
      // Click 2: Open Modal
      setIsOpen(true);
      if (videoRef.current) videoRef.current.pause();
    }
  };

  const handleModalClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
    setIsInlinePlaying(false);
    // Resume background loop muted
    if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
    }
  };

  return (
    <>
        <div 
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full bg-zinc-900 relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 shadow-lg select-none"
        >
            {/* Loading / Error States */}
            {!isVideoLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
            
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-zinc-900 text-zinc-500 p-4 text-center">
                    <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs uppercase tracking-widest">Video Unavailable</span>
                </div>
            )}

            {/* THE VIDEO ELEMENT */}
            <video
                ref={videoRef}
                key={currentSource.previewUrl} // Force remount on URL change
                className={`w-full h-full object-cover transition-all duration-700 
                    ${isHovered ? 'scale-100' : 'scale-105'}
                    ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} 
                    ${isInlinePlaying ? '' : 'group-hover:opacity-90'}
                `}
                loop
                muted={!isInlinePlaying} // React controlled
                playsInline
                autoPlay
                preload="auto"
                crossOrigin="anonymous" // Helps with some CDN blocks
                onLoadedData={() => {
                    setIsVideoLoaded(true);
                    // Ensure autoplay starts when data is ready
                    if(videoRef.current && !isInlinePlaying) {
                        videoRef.current.defaultMuted = true;
                        videoRef.current.muted = true;
                        videoRef.current.play().catch(() => {
                            // Silent catch for autoplay blocks
                        });
                    }
                }}
                onError={(e) => {
                    console.error("Video Error:", e.currentTarget.error);
                    setHasError(true);
                    setIsVideoLoaded(true); // Stop loading spinner
                }}
            >
                {/* Explicit source tag helps browser identify format faster */}
                <source src={currentSource.previewUrl} type="video/mp4" />
            </video>

            {/* Overlays (Only show if loaded and no error) */}
            {isVideoLoaded && !hasError && (
                <>
                    {/* Play Icon */}
                    {!isInlinePlaying && (
                        <div className={`absolute inset-0 bg-black/10 flex items-center justify-center z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                <Play className="w-6 h-6 text-white ml-1 fill-white" />
                            </div>
                        </div>
                    )}

                    {/* Fullscreen Hint */}
                    {isInlinePlaying && isHovered && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in duration-200">
                            <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-xl">
                                <Maximize2 className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Fullscreen</span>
                            </div>
                        </div>
                    )}

                    {/* Audio Status */}
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
                </>
            )}

            {/* Title / Info */}
            <div className="absolute top-6 right-6 z-20 text-right mix-blend-difference pointer-events-none">
                <span className="block text-white font-display font-bold text-3xl tracking-tight leading-none">{year}</span>
                <span className="block text-white/70 font-english text-[10px] tracking-widest uppercase">{title}</span>
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
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${
                                idx === activeIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>

        {/* Modal */}
        {isOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
                <div className="absolute inset-0" onClick={handleModalClose}></div>
                <button onClick={handleModalClose} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-[110]">
                    <X className="w-6 h-6" />
                </button>

                <div className="relative w-full h-full md:w-[85vw] md:h-[85vh] max-w-[1600px] bg-black md:rounded-3xl border border-white/10 flex flex-col z-20 overflow-hidden shadow-2xl">
                    <div className="flex-grow relative bg-black flex items-center justify-center">
                        {getYouTubeEmbedUrl(currentSource.fullUrl) ? (
                             <iframe src={getYouTubeEmbedUrl(currentSource.fullUrl)!} className="w-full h-full absolute inset-0" allow="autoplay; fullscreen" title={title} />
                        ) : (
                             <video src={currentSource.fullUrl || currentSource.previewUrl} controls autoPlay className="w-full h-full object-contain" />
                        )}
                    </div>
                </div>
            </div>,
            document.body
        )}
    </>
  );
};
