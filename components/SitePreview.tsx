import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SitePreviewProps {
  url: string;
}

export const SitePreview: React.FC<SitePreviewProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden group">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 z-10 space-y-4">
          <Loader2 className="w-7 h-7 text-slate-400 animate-spin" strokeWidth={1.5} />
          <div className="text-slate-400 text-[10px] font-medium tracking-[0.2em] uppercase">
             Loading preview...
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>

      {/* Interactive Preview - scaled iframe */}
      <iframe
        src={url}
        className="w-[200%] h-[200%] transform scale-50 origin-top-left border-0 transition-all duration-700 ease-out group-hover:scale-[0.52]"
        style={{ opacity: isLoading ? 0 : 1 }}
        onLoad={() => setIsLoading(false)}
        title="Site Preview"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
};