import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, VolumeX, Monitor, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';

interface VideoProjectCardProps {
  id: string;
  year: string;
  title: string;
  previewVideoUrl: string; // Direct MP4 for the card background
  fullVideoEmbedUrl: string; // The iframe URL for the modal
  fullVideoDirectUrl: string; // Link to external site (Drive/YouTube)
}

export const VideoProjectCard: React.FC<VideoProjectCardProps> = ({
  id,
  year,
  title,
  previewVideoUrl,
  fullVideoEmbedUrl,
  fullVideoDirectUrl
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hardened Autoplay Logic for the Card Preview
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        video.muted = !isHovered;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay was prevented - usually fine as it's muted
            });
        }
    }
  }, [isHovered]);

  const toggleOpen = () => setIsOpen(!isOpen);

  // We append &autoplay=1 to the Google Drive preview link
  const embedUrlWithAutoplay = fullVideoEmbedUrl.includes('?') 
    ? `${fullVideoEmbedUrl}&autoplay=1` 
    : `${fullVideoEmbedUrl}?autoplay=1`;

  return (
    <>
        <div 
            onClick={toggleOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full bg-black relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-800"
        >
            <video
                ref={videoRef}
                src={previewVideoUrl}
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

            <div className="absolute bottom-6 left-6 text-white flex items-center gap-2 z-20 transition-opacity duration-300">
                {isHovered ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4 opacity-50" />}
                <span className={`text-xs font-medium tracking-widest uppercase transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    {isHovered ? 'Sound On' : ''}
                </span>
            </div>

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
                         <iframe
                            src={embedUrlWithAutoplay}
                            className="w-full h-full absolute inset-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            title={title}
                        />
                    </div>

                    <div className="h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center gap-4">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <div className="text-zinc-400 text-xs uppercase tracking-widest font-sans">{title} <span className="text-zinc-600 mx-2">|</span> {year}</div>
                        </div>
                        <a href={fullVideoDirectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-rose-400 transition-colors text-xs md:text-sm font-bold uppercase tracking-wide">
                            <Monitor className="w-4 h-4" />
                            <span className="hidden md:inline">View Full Quality</span>
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