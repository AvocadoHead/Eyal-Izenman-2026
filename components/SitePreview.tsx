import React, { useState } from 'react';
import { Clock } from 'lucide-react';

interface SitePreviewProps {
  url: string;
}

export const SitePreview: React.FC<SitePreviewProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full relative bg-slate-100 overflow-hidden group">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 space-y-3">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium tracking-widest uppercase animate-pulse">
             <Clock className="w-3 h-3" />
             <span>Patience... It's worth the wait</span>
          </div>
        </div>
      )}
      {/* 
        Interactive Preview:
        We scale the iframe to fit the card, but allow events so it feels like a mini browser tab.
      */}
      <iframe
        src={url}
        className="w-[200%] h-[200%] transform scale-50 origin-top-left border-0 transition-opacity duration-500"
        style={{ opacity: isLoading ? 0 : 1 }}
        onLoad={() => setIsLoading(false)}
        title="Site Preview"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
};