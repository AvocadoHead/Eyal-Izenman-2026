import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, VolumeX, Maximize2 } from 'lucide-react';
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
  const [isInlinePlaying, setIsInlinePlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentSource = videoSources[activeIndex];

  // Effect to handle AUTOPLAY on load/source change
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        // Reset state for new video
        setIsInlinePlaying(false);

        video.muted = true;
        video.playsInline = true;

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // This catch is important to prevent crashes if autoplay is blocked
                console.warn("Autoplay was prevented:", error);
            });
        }
    }
  }, [activeIndex]); // Reruns when the active video changes

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    if (!isInlinePlaying) {
      // Step 1: Unmute and play
      setIsInlinePlaying(true);
      video.muted = false;
      video.currentTime = 0;
      video.play();
    } else {
      // Step 2: Open Modal
      setIsOpen(true);
      video.pause(); // Pause background to save resources and prevent audio overlap
    }
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setIsInlinePlaying(false); // Reset to muted state
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play(); // Resume muted autoplay
    }
  };

  const navigate = (direction: 'next' | 'prev', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newIndex = (direction === 'next')
      ? (activeIndex + 1) % videoSources.length
      : (activeIndex - 1 + videoSources.length) % videoSources.length;
    setActiveIndex(newIndex);
  };

  return (
    <>
        <div 
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full bg-zinc-900 relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 shadow-lg select-none"
        >
            <video
                key={currentSource.previewUrl}
                ref={videoRef}
                src={currentSource.previewUrl}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isInlinePlaying ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'}`}
                loop
                muted
                playsInline
                preload="auto"
            />

            {/* OVERLAYS */}
            {!isInlinePlaying && isHovered && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                        <Play className="w-6 h-6 text-white ml-1 fill-white" />
                    </div>
                </div>
            )}

            {isInlinePlaying && isHovered && (
                 <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in fade-in">
                     <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Open</span>
                     </div>
                 </div>
            )}

            <div className="absolute bottom-6 left-6 text-white flex items-center gap-2 z-20">
                {isInlinePlaying ? (
                    <div className="flex items-center gap-2 text-rose-400">
                         <Volume2 className="w-4 h-4" />
                         <span className="text-[10px] font-bold tracking-widest uppercase text-white">Sound On</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 opacity-50">
                        <VolumeX className="w-3 h-3" />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Preview</span>
                    </div>
                )}
            </div>

            {videoSources.length > 1 && (
                <div className="absolute bottom-6 right-6 z-30 flex gap-2">
                    {videoSources.map((_, idx) => (
                        <button key={idx} onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${ idx === activeIndex ? 'bg-white scale-150' : 'bg-white/40 hover:bg-white/80' }`}
                        />
                    ))}
                </div>
            )}

            <div className="absolute top-6 right-6 z-20 text-right mix-blend-difference pointer-events-none">
                <span className="block text-white font-bold text-3xl">{year}</span>
                <span className="block text-white/70 text-[10px] tracking-widest uppercase">{title}</span>
            </div>
        </div>

        {/* MODAL */}
        {isOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
                <div className="absolute inset-0" onClick={handleModalClose}></div>
                <button onClick={handleModalClose} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-[110]">
                    <X className="w-6 h-6" />
                </button>
                <div className="relative w-[90vw] h-[85vh] max-w-[1600px] bg-black rounded-2xl border border-white/10 flex flex-col z-20 overflow-hidden">
                    <video key={currentSource.fullUrl} src={currentSource.fullUrl} controls autoPlay className="w-full h-full object-contain" />
                </div>
            </div>,
            document.body
        )}
    </>
  );
};
