import React, { useState, useEffect } from 'react';
import { X, Monitor, ExternalLink, ChevronLeft, ChevronRight, VolumeX, Maximize2, Play, AlertCircle } from 'lucide-react';
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
  year,
  title,
  videoSources
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [origin, setOrigin] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin);
  }, []);
  
  const currentSource = videoSources[activeIndex];

  // 1. Extract ID
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=))([^?&"'>]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(currentSource.previewUrl);

  // 2. Thumbnail Fallback (mqdefault exists for 100% of videos)
  const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : '';

  // 3. Embed URL
  const getEmbedUrl = (id: string | null, isPreview: boolean) => {
    if (!id) return '';
    const base = `https://www.youtube.com/embed/${id}`;
    // 'origin' fixes the "Unavailable" error on some domains
    const settings = `origin=${origin}&iv_load_policy=3&modestbranding=1&playsinline=1&rel=0&showinfo=0`;
    
    if (isPreview) {
        return `${base}?autoplay=1&mute=1&controls=0&${settings}`;
    } else {
        return `${base}?autoplay=1&mute=0&controls=1&${settings}`;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    setIsOpen(true);
  };

  const handleModalClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
  };

  const navigate = (direction: 'next' | 'prev', e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = direction === 'next' 
      ? (activeIndex + 1) % videoSources.length
      : (activeIndex - 1 + videoSources.length) % videoSources.length;
    setActiveIndex(newIndex);
    setImgError(false);
  };

  return (
    <>
        <div 
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full bg-zinc-800 relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 shadow-lg"
        >
            {/* 1. BACKUP IMAGE */}
            {thumbnailUrl && !imgError && (
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0 scale-110 opacity-60"
                    style={{ backgroundImage: `url(${thumbnailUrl})` }}
                />
            )}

            {/* 2. VIDEO PREVIEW */}
            <div className="absolute inset-0 w-full h-full pointer-events-none scale-[1.35] z-10 transition-opacity duration-500"> 
                {videoId && (
                    <iframe
                        key={`preview-${videoId}`}
                        src={getEmbedUrl(videoId, true)}
                        className="w-full h-full object-cover"
                        allow="autoplay; encrypted-media"
                        tabIndex={-1}
                        title="Preview"
                    />
                )}
            </div>

            {/* 3. INTERACTION LAYERS */}
            <div className="absolute inset-0 z-20 bg-transparent"></div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none z-20"></div>

            {/* Expand Button */}
            <div className={`absolute inset-0 flex items-center justify-center z-30 pointer-events-none transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-2xl">
                    <Maximize2 className="w-4 h-4" />
                    <span className="font-bold tracking-widest text-xs uppercase">Expand</span>
                </div>
            </div>

            {/* Status */}
            <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2 text-white/80 pointer-events-none">
                <VolumeX className="w-4 h-4 drop-shadow-md" />
                <span className="text-[10px] font-bold tracking-widest uppercase drop-shadow-md">Preview</span>
            </div>

            {/* Header */}
            <div className="absolute top-6 right-6 z-30 text-right mix-blend-difference pointer-events-none">
                <span className="block text-white font-display font-bold text-3xl tracking-tight leading-none drop-shadow-md">{year}</span>
                <span className="block text-white/70 font-english text-[10px] tracking-widest uppercase drop-shadow-md">{title}</span>
            </div>

            {/* Navigation Dots */}
            {videoSources.length > 1 && (
                <div className="absolute bottom-6 right-6 z-40 flex gap-2">
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

        {/* MODAL */}
        {isOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]">
                <div className="absolute inset-0" onClick={handleModalClose}></div>
                
                <button onClick={handleModalClose} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-[110] transition-colors border border-white/10">
                    <X className="w-6 h-6" />
                </button>

                <div className="relative w-[95vw] md:w-[85vw] h-[60vh] md:h-[85vh] max-w-[1600px] bg-black rounded-3xl border border-white/10 flex flex-col z-20 overflow-hidden shadow-2xl">
                    <div className="flex-grow relative bg-black flex items-center justify-center">
                        {videoId ? (
                            <iframe 
                                src={getEmbedUrl(videoId, false)}
                                className="w-full h-full absolute inset-0" 
                                allow="autoplay; fullscreen; picture-in-picture" 
                                title={title} 
                            />
                        ) : (
                            <div className="text-white flex flex-col items-center">
                                <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
                                <span>Video Source Error</span>
                            </div>
                        )}
                        
                        {videoSources.length > 1 && (
                            <>
                                <button onClick={(e) => navigate('prev', e)} className="absolute -left-16 md:left-4 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all group">
                                    <ChevronLeft className="w-10 h-10 group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <button onClick={(e) => navigate('next', e)} className="absolute -right-16 md:right-4 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all group">
                                    <ChevronRight className="w-10 h-10 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </>
                        )}
                    </div>
                    
                    <div className="h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-6 shrink-0">
                         <div className="flex flex-col justify-center">
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm">{title}</h3>
                            {videoSources.length > 1 && <span className="text-zinc-500 text-[10px] tracking-widest">{activeIndex + 1} / {videoSources.length}</span>}
                         </div>
                         {currentSource.fullUrl && (
                             <a href={currentSource.fullUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-bold uppercase transition-colors">
                                <Monitor className="w-4 h-4" /> <span className="hidden sm:inline">Watch on YouTube</span> <ExternalLink className="w-3 h-3" />
                             </a>
                         )}
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
