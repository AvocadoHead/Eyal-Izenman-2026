import React, { useState, useRef, useEffect } from 'react';
import { Play, X, Volume2, Monitor, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';

export const ShowreelCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // High Quality Stock Abstract Loop
  const cardVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-abstract-texture-of-black-and-white-lines-and-dots-33479-large.mp4";
  
  // The User's Actual Drive Link
  const driveEmbedUrl = "https://drive.google.com/file/d/1JznGln7GePzQnsm-6jrBAffBBOfqxvka/preview";
  const driveViewUrl = "https://drive.google.com/file/d/1JznGln7GePzQnsm-6jrBAffBBOfqxvka/view?usp=sharing";

  useEffect(() => {
    // Aggressive autoplay check
    const video = videoRef.current;
    if (video) {
        // Ensure muted is set before play (browser policy)
        video.muted = true;
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.warn("Auto-play was prevented:", error);
                // Attempt to play again if user interacts (optional fallback)
            });
        }
    }
  }, []);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
        {/* Inline Card Version */}
        <div 
            onClick={toggleOpen}
            className="w-full h-full bg-black relative group cursor-pointer overflow-hidden"
        >
            <video
                ref={videoRef}
                src={cardVideoUrl}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 scale-105 group-hover:scale-100 transition-transform duration-[2s]"
                loop
                muted
                playsInline
                autoPlay
                onCanPlay={() => videoRef.current?.play()}
            />

            {/* Minimalist Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-white group-hover:border-white transition-all duration-500 group-hover:scale-110">
                    <Play className="w-8 h-8 text-white fill-white group-hover:text-black group-hover:fill-black transition-colors ml-1" />
                </div>
            </div>

            <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span className="text-xs font-medium tracking-widest uppercase">Sound On</span>
            </div>

            {/* Label */}
            <div className="absolute top-6 right-6 z-20 text-right mix-blend-difference">
                <span className="block text-white font-display font-bold text-3xl tracking-tight">2025</span>
                <span className="block text-white/70 font-english text-xs tracking-widest uppercase">Showreel</span>
            </div>
        </div>

        {/* Expanded Modal Version */}
        {isOpen && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-[fadeIn_0.5s_ease-out]">
                {/* Close Button */}
                <button 
                    onClick={toggleOpen}
                    className="absolute top-6 right-6 md:right-auto md:left-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-30 group"
                >
                    <X className="w-8 h-8 group-hover:rotate-90 transition-transform stroke-1" />
                </button>

                {/* Video Container */}
                <div className="relative w-full h-full md:w-[90vw] md:h-[90vh] max-w-[1920px] bg-black rounded-lg shadow-2xl overflow-hidden border border-white/10 flex flex-col">
                    
                    <div className="flex-grow relative">
                         <iframe
                            src={driveEmbedUrl}
                            className="w-full h-full absolute inset-0"
                            allow="autoplay; fullscreen"
                            title="Showreel"
                        />
                    </div>

                    {/* Footer Controls */}
                    <div className="h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-6 z-20">
                        <div className="text-zinc-500 text-xs uppercase tracking-widest">
                            Portfolio Showreel 2025
                        </div>
                        <a 
                            href={driveViewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white hover:text-rose-400 transition-colors text-sm font-bold uppercase tracking-wide"
                        >
                            <Monitor className="w-4 h-4" />
                            <span>View Original 4K</span>
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