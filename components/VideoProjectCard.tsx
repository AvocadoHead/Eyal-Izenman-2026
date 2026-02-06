import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, VolumeX, Monitor, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';

interface VideoProjectCardProps {
  id: string;
  year: string;
  title: string;
  previewVideoUrl: string; // Direct MP4 for the card background
  previewEmbedUrl?: string; // Optional iframe preview (YouTube)
  fullVideoEmbedUrl: string; // The iframe URL for the modal
  fullVideoDirectUrl: string; // Link to external site (Drive/YouTube)
}

export const VideoProjectCard: React.FC<VideoProjectCardProps> = ({
  id,
  year,
  title,
  previewVideoUrl,
  previewEmbedUrl,
  fullVideoEmbedUrl,
  fullVideoDirectUrl
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hardened Autoplay Logic for the Card Preview
  useEffect(() => {
    if (previewEmbedUrl) return;
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

  const buildEmbedUrl = (url: string, extraParams?: Record<string, string>) => {
    const embedUrl = new URL(url);
    embedUrl.searchParams.set('autoplay', '1');
    embedUrl.searchParams.set('mute', '1');
    embedUrl.searchParams.set('playsinline', '1');
    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        embedUrl.searchParams.set(key, value);
      });
    }
    return embedUrl.toString();
  };

  const embedUrlWithAutoplay = buildEmbedUrl(fullVideoEmbedUrl);
  const previewEmbedWithAutoplay = previewEmbedUrl
    ? buildEmbedUrl(previewEmbedUrl, { controls: '0', modestbranding: '1', rel: '0' })
    : null;

  return (
    <>
        <div
            onClick={toggleOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full h-full bg-slate-900 relative group cursor-pointer overflow-hidden"
        >
            {/* Video background */}
            {previewEmbedWithAutoplay ? (
              <iframe
                src={previewEmbedWithAutoplay}
                className="w-full h-full absolute inset-0 scale-[1.02] group-hover:scale-100 transition-transform duration-1000 ease-out"
                title={`${title} preview`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                  ref={videoRef}
                  src={previewVideoUrl}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-95 transition-all duration-700 ease-out scale-[1.02] group-hover:scale-100"
                  loop
                  muted
                  playsInline
                  autoPlay
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 group-hover:opacity-40 transition-opacity duration-500"></div>

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${isHovered ? 'scale-110 bg-white shadow-xl shadow-white/20' : 'bg-white/10 backdrop-blur-sm border border-white/20'}`}>
                    <Play className={`w-6 h-6 md:w-8 md:h-8 ml-1 transition-all duration-300 ${isHovered ? 'text-slate-900 fill-slate-900' : 'text-white fill-white'}`} />
                </div>
            </div>

            {/* Sound indicator */}
            <div className="absolute bottom-5 left-5 text-white flex items-center gap-2 z-20">
                <div className={`flex items-center gap-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
                    {isHovered ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span className={`text-[10px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 overflow-hidden ${isHovered ? 'max-w-24 opacity-100' : 'max-w-0 opacity-0'}`}>
                        Sound On
                    </span>
                </div>
            </div>

            {/* Year and title */}
            <div className="absolute top-5 right-5 z-20 text-right pointer-events-none">
                <span className="block text-white/90 font-display font-bold text-2xl md:text-3xl tracking-tight leading-none drop-shadow-lg">{year}</span>
                <span className="block text-white/60 font-english text-[10px] tracking-[0.2em] uppercase mt-1">{title}</span>
            </div>
        </div>

        {isOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-[fadeIn_0.4s_ease-out]">
                <div className="absolute inset-0" onClick={toggleOpen}></div>
                <button onClick={toggleOpen} className="absolute top-5 right-5 md:top-6 md:right-6 p-3 md:p-4 bg-white/5 hover:bg-white/15 rounded-full text-white transition-all duration-300 z-[110] group border border-white/10">
                    <X className="w-6 h-6 md:w-7 md:h-7 group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
                </button>

                <div className="relative w-[95vw] md:w-[88vw] h-[55vh] md:h-[82vh] max-w-[1700px] bg-slate-950 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-white/5 flex flex-col z-20">
                    <div className="flex-grow relative bg-black">
                         <iframe
                            src={embedUrlWithAutoplay}
                            className="w-full h-full absolute inset-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            title={title}
                        />
                    </div>

                    <div className="h-14 md:h-16 bg-slate-900/95 backdrop-blur border-t border-white/5 flex items-center justify-between px-4 md:px-6 shrink-0">
                        <div className="flex items-center gap-3 md:gap-4">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-[pulseSoft_2s_ease-in-out_infinite]"></span>
                            <div className="text-slate-400 text-[10px] md:text-xs uppercase tracking-[0.15em] font-english">{title} <span className="text-slate-600 mx-2">•</span> {year}</div>
                        </div>
                        <a href={fullVideoDirectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-wider group">
                            <Monitor className="w-4 h-4 group-hover:text-violet-400 transition-colors" />
                            <span className="hidden md:inline">Full Quality</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                    </div>
                </div>
                <style>{`
                    @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
                    @keyframes pulseSoft { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                `}</style>
            </div>,
            document.body
        )}
    </>
  );
};
