import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Monitor, ExternalLink, ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface VideoSource {
  previewUrl: string; // YouTube URL
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
  
  const currentSource = videoSources[activeIndex];

  // --- YouTube Helper ---
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getPreviewEmbed = (url: string) => {
    const id = getYouTubeId(url);
    if (!id) return null;
    // Parameters for a clean, muted, looping background video
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0`;
  };

  const getFullEmbed = (url: string) => {
    const id = getYouTubeId(url);
    if (!id) return null;
    // Parameters for the full viewing experience (Sound ON)
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`;
  };

  // --- Click Handler ---
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop bubbling to prevent parent link navigation
    setIsOpen(true);
  };

  const handleModalClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
  };

  const nextVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % videoSources.length);
  };

  const prevVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + videoSources.length) % videoSources.length);
  };

  return (
    <>
        <div 
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full bg-zinc-900 relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 shadow-lg"
        >
            {/* --- YOUTUBE PREVIEW LAYER --- */}
            <div className="absolute inset-0 w-full h-full pointer-events-none scale-[1.35]"> 
                {/* Scale 1.35 removes black bars and YouTube UI from edges */}
                <iframe
                    key={currentSource.previewUrl}
                    src={getPreviewEmbed(currentSource.previewUrl) || ''}
                    className="w-full h-full object-cover"
                    allow="autoplay; encrypted-media"
                    tabIndex={-1}
                    title="Background Preview"
                />
            </div>

            {/* --- OVERLAYS --- */}
            {/* Darken overlay that lightens on hover */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500"></div>

            {/* Centered Play Button (Appears on Hover) */}
            <div className={`absolute inset-0 flex items-center justify-center z-10 transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl">
                    <Maximize2 className="w-5 h-5" />
                    <span className="font-bold tracking-widest text-sm uppercase">Expand</span>
                </div>
            </div>

            {/* Bottom Status */}
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 text-white/60">
                <VolumeX className="w-4 h-4" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Muted Preview</span>
            </div>

            {/* Title Info */}
            <div className="absolute top-6 right-6 z-20 text-right mix-blend-difference pointer-events-none">
                <span className="block text-white font-display font-bold text-3xl tracking-tight leading-none">{year}</span>
                <span className="block text-white/70 font-english text-[10px] tracking-widest uppercase">{title}</span>
            </div>

            {/* Navigation Dots (Only if multiple videos) */}
            {videoSources.length > 1 && (
                <div className="absolute bottom-6 right-6 z-30 flex gap-2" onClick={e => e.stopPropagation()}>
                    {videoSources.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${
                                idx === activeIndex ? 'bg-white scale-150' : 'bg-white/40 hover:bg-white'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>

        {/* --- MODAL --- */}
        {isOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]">
                <div className="absolute inset-0" onClick={handleModalClose}></div>
                
                {/* Close Button */}
                <button onClick={handleModalClose} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-[110] transition-colors border border-white/10">
                    <X className="w-6 h-6" />
                </button>

                <div className="relative w-[95vw] md:w-[85vw] h-[60vh] md:h-[85vh] max-w-[1600px] bg-black rounded-3xl border border-white/10 flex flex-col z-20 overflow-hidden shadow-2xl">
                    <div className="flex-grow relative bg-black flex items-center justify-center">
                        {/* THE MAIN VIDEO */}
                        <iframe 
                            src={getFullEmbed(currentSource.fullUrl) || ''}
                            className="w-full h-full absolute inset-0" 
                            allow="autoplay; fullscreen; picture-in-picture" 
                            title={title} 
                        />
                        
                        {/* Navigation Arrows */}
                        {videoSources.length > 1 && (
                            <>
                                <button onClick={prevVideo} className="absolute -left-16 md:left-4 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all group">
                                    <ChevronLeft className="w-10 h-10 group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <button onClick={nextVideo} className="absolute -right-16 md:right-4 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all group">
                                    <ChevronRight className="w-10 h-10 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </>
                        )}
                    </div>
                    
                    {/* Modal Footer */}
                    <div className="h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-6 shrink-0">
                         <div className="flex flex-col justify-center">
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm">{title}</h3>
                            {videoSources.length > 1 && <span className="text-zinc-500 text-[10px] tracking-widest">{activeIndex + 1} / {videoSources.length}</span>}
                         </div>
                         <a href={currentSource.fullUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-bold uppercase transition-colors">
                            <Monitor className="w-4 h-4" /> <span className="hidden sm:inline">Watch on YouTube</span> <ExternalLink className="w-3 h-3" />
                         </a>
                    </div>
                </div>
            </div>,
            document.body
        )}
        <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
    </>
  );
};
