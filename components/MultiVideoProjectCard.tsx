import React, { useState } from 'react';
import { Play, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';

interface VideoEntry {
  id: string;
  title: string;
  embedUrl: string;  // YouTube embed URL
  directUrl: string; // Direct link to YouTube
}

interface MultiVideoProjectCardProps {
  year: string;
  videos: VideoEntry[];
}

export const MultiVideoProjectCard: React.FC<MultiVideoProjectCardProps> = ({ year, videos }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const currentVideo = videos[currentVideoIndex];

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <div
        onClick={toggleOpen}
        className="group relative w-full h-full overflow-hidden cursor-pointer bg-slate-900"
      >
        {/* Autoplaying iframe background */}
        <iframe
          src={`${currentVideo.embedUrl}?autoplay=1&mute=1&loop=1&playlist=${currentVideo.id}&controls=0&modestbranding=1&rel=0&enablejsapi=1`}
          className="absolute inset-0 w-full h-full border-0 scale-[1.02] group-hover:scale-100 transition-transform duration-1000 ease-out"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ pointerEvents: 'none' }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 opacity-90 group-hover:opacity-50 transition-opacity duration-500"></div>

        {/* Play button - centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-out bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-white/20`}>
            <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1 group-hover:text-slate-900 group-hover:fill-slate-900 transition-colors duration-300" />
          </div>
        </div>

        {/* Video info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-english text-[10px] md:text-xs font-semibold tracking-[0.2em] text-white/50 uppercase mb-1">
                {year}
              </div>
              <div className="font-english text-sm md:text-base font-bold tracking-wide text-white/90 uppercase">
                {currentVideo.title}
              </div>
            </div>

            {/* Video switcher dots */}
            {videos.length > 1 && (
              <div className="flex gap-1.5 md:gap-2">
                {videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentVideoIndex(index);
                    }}
                    className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                      index === currentVideoIndex
                        ? 'bg-white w-6 md:w-8'
                        : 'bg-white/30 hover:bg-white/50 w-1.5 md:w-2'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full screen modal */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.4s_ease-out]">
          {/* Close button */}
          <button
            onClick={toggleOpen}
            className="absolute top-5 right-5 md:top-6 md:right-6 z-50 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all duration-300 group"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
          </button>

          {/* Navigation arrows */}
          {videos.length > 1 && (
            <>
              <button
                onClick={prevVideo}
                className="absolute left-3 md:left-8 z-50 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all duration-300 group"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={nextVideo}
                className="absolute right-3 md:right-8 z-50 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all duration-300 group"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}

          {/* Video container */}
          <div className="w-full h-full max-w-7xl max-h-full flex flex-col items-center justify-center">
            <div className="relative w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-white/5">
              <iframe
                src={`${currentVideo.embedUrl}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            </div>

            {/* Video info and link */}
            <div className="mt-5 md:mt-6 flex items-center justify-between w-full max-w-7xl px-2 md:px-4">
              <div>
                <div className="font-english text-[10px] md:text-xs font-semibold tracking-[0.15em] text-white/40 uppercase">
                  {currentVideo.title} <span className="text-white/20 mx-2">•</span> {year}
                </div>
              </div>
              <a
                href={currentVideo.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs md:text-sm text-slate-400 hover:text-white transition-colors duration-300 font-english font-semibold uppercase tracking-wider group"
              >
                <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:text-violet-400 transition-colors" />
                <span className="hidden sm:inline">Full Quality</span>
              </a>
            </div>

            {/* Video dots indicator */}
            {videos.length > 1 && (
              <div className="mt-4 flex gap-2 md:gap-3">
                {videos.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentVideoIndex
                        ? 'w-2.5 h-2.5 md:w-3 md:h-3 bg-white'
                        : 'w-1.5 h-1.5 md:w-2 md:h-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
};
