import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, VolumeX, Monitor, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface VideoSource {
  previewUrl: string;
  fullEmbedUrl: string;
  fullDirectUrl: string;
}

interface VideoProjectCardProps {
  id: string;
  year: string;
  title: string;
  previewVideoUrl?: string;
  fullVideoEmbedUrl?: string;
  fullVideoDirectUrl?: string;
  videoSources?: VideoSource[];
}

export const VideoProjectCard: React.FC<VideoProjectCardProps> = ({
  id,
  year,
  title,
  previewVideoUrl,
  fullVideoEmbedUrl,
  fullVideoDirectUrl,
  videoSources
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sources = videoSources || [{
    previewUrl: previewVideoUrl || '',
    fullEmbedUrl: fullVideoEmbedUrl || '',
    fullDirectUrl: fullVideoDirectUrl || ''
  }];

  const currentSource = sources[activeIndex];

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveIndex(index);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        video.muted = !isHovered;
    }
  }, [isHovered]);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Construct valid Embed URL
  const safeEmbedUrl = currentSource.fullEmbedUrl || '';
  const embedUrlWithAutoplay = safeEmbedUrl.includes('?') 
    ? `${safeEmbedUrl}&autoplay=1` 
    : `${safeEmbedUrl}?autoplay=1`;

  return (
    <>
        <div 
            onClick={toggleOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full bg-black relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-800"
        >
            <video
                key={activeIndex} // Force remount on switch to fix autoplay issues
                ref={videoRef}
                src={currentSource.previewUrl}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-700 scale-105 group-hover:scale-100"
                loop
                muted={!isHovered}
                playsInline
                autoPlay
            />

            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className={`w-20 h-20 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm transition-all duration-500 ${isHovered ? 'scale-110 bg-white border-white' : 'bg-black/20'}`}>
                    <Play className={`w-8 h-8 ml-1 transition-colors ${isHovered ? 'text-black fill-black' : 'text-white fill-white'}`} />
                </div>
            </div>

            <div className="absolute bottom-6 left-6 text-white flex items-center gap-2 z-20 transition-opacity duration-300">
                {isHovered ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4 opacity-50" />}
                <span className={`text-xs font-medium tracking-widest uppercase transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    {isHovered ? 'Sound On' : ''}
                </span>
            </div>

            {sources.length > 1 && (
                <div className="absolute bottom-6 right-6 z-30 flex gap-2">
                    {sources.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => handleDotClick(e, idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 shadow-md ${
                                idx === activeIndex 
                                    ? 'bg-white scale-125' 
                                    : 'bg-white/40 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            )}

            <div className="absolute top-6 right-6 z-20 text-right mix-blend-difference pointer-events-none">
                <span className="block text-white font-display font-bold text-3xl tracking-tight leading-none">{year}</span>
                <span className="block text-white/70 font-english text-xs tracking-widest uppercase">{title}</span>
            </div>
        </div>

        {isOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-[fadeIn_0.5s_ease-out]">
                <div className="absolute inset-0" onClick={toggleOpen}></div>
                <button onClick={toggleOpen} className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[110] group"><X className="w-8 h-8 group-hover:rotate-90 transition-transform stroke-1" /></button>

                <div className="relative w-[95vw] md:w-[85vw] h-[60vh] md:h-[85vh] max-w-[1600px] bg-black rounded-xl shadow-2xl overflow-hidden border border-white/10 flex flex-col z-20">
                    <div className="flex-grow relative bg-black">
                        {safeEmbedUrl ? (
                             <iframe
                                src={embedUrlWithAutoplay}
                                className="w-full h-full absolute inset-0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                title={title}
                            />
                        ) : (
                             // Fallback for when there isn't a YouTube/Vimeo embed, showing the raw video file
                             <div className="w-full h-full bg-black flex items-center justify-center">
                                 <video 
                                    src={currentSource.previewUrl} 
                                    controls 
                                    autoPlay 
                                    className="max-w-full max-h-full"
                                 />
                             </div>
                        )}
                    </div>

                    <div className="h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center gap-4">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <div className="text-zinc-400 text-xs uppercase tracking-widest font-sans">{title} <span className="text-zinc-600 mx-2">|</span> {year} {sources.length > 1 ? `(${activeIndex + 1}/${sources.length})` : ''}</div>
                        </div>
                        {currentSource.fullDirectUrl && (
                            <a href={currentSource.fullDirectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-rose-400 transition-colors text-xs md:text-sm font-bold uppercase tracking-wide">
                                <Monitor className="w-4 h-4" />
                                <span className="hidden md:inline">View Full Quality</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
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
