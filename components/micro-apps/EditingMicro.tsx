import React from 'react';
import { Scissors } from 'lucide-react';

interface EditingMicroProps {
    lang: 'he' | 'en';
    onToggleLang: () => void;
}

export const EditingMicro: React.FC<EditingMicroProps> = ({ lang, onToggleLang }) => {
  const isHe = lang === 'he';
  
  // Theme: Rose / Red
  const theme = {
      bg: '#fff1f2',
      accent: '#f43f5e', // Rose 500
      dark: '#881337', // Rose 900
      line: '#fda4af'
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#fff1f2] group font-sans">
      
      {/* Background Grid */}
      <div className="absolute top-0 right-0 w-full h-full opacity-10" 
           style={{ backgroundImage: `linear-gradient(${theme.line} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      {/* Moving Vertical Line (Scanline) */}
      <div className="absolute top-0 bottom-0 w-[1px] bg-rose-500/30 blur-[1px] left-[20%] animate-[scan_4s_linear_infinite]"></div>

      <div className="relative z-10 w-full h-full flex flex-col p-8" dir={isHe ? 'rtl' : 'ltr'}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 opacity-60">
            <div className="flex items-center gap-2">
                <Scissors className="w-3 h-3 text-[#881337]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#881337]">Post-Prod</span>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleLang(); }}
                className="text-[10px] font-bold text-[#881337] hover:bg-[#f43f5e]/10 px-2 py-1 rounded transition-colors z-20"
            >
                {lang === 'he' ? 'HE / EN' : 'EN / HE'}
            </button>
        </div>

        {/* Centerpiece: The Cut */}
        <div className="flex-grow flex flex-col justify-center relative">
            {/* Stylized Timeline Tracks */}
            <div className="absolute right-0 left-0 top-1/2 -translate-y-1/2 space-y-3 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                <div className="h-4 bg-[#fda4af] w-[80%] rounded-r-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/30 skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                </div>
                <div className="h-4 bg-[#f43f5e] w-[60%] rounded-r-md translate-x-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/30 skew-x-12 translate-x-[-100%] animate-[shimmer_2.5s_infinite]"></div>
                </div>
                <div className="h-4 bg-[#881337] w-[90%] rounded-r-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/30 skew-x-12 translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
                </div>
            </div>

            <div className="relative z-10">
                <div className="inline-block px-3 py-1 mb-4 border border-[#f43f5e] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#881337] w-fit bg-white/50 backdrop-blur-sm">
                    Masterclass
                </div>
                <h2 className={`text-4xl md:text-5xl font-black text-[#881337] leading-[0.9] tracking-tight mb-4 ${isHe ? 'font-sans' : 'font-display'}`}>
                    {isHe ? (
                        <>עריכה<br/>ופוסט.</>
                    ) : (
                        <>Edit<br/>& Post.</>
                    )}
                </h2>
                <p className="font-sans text-sm text-[#9f1239] max-w-[200px] leading-relaxed font-medium">
                    {isHe ? 'קצב, רגש וקומפוזיטינג מתקדם.' : 'Rhythm, emotion & advanced compositing.'}
                </p>
            </div>
        </div>

        {/* Footer: Playhead */}
        <div className="relative h-1 w-full bg-[#fda4af] mt-4 rounded-full overflow-hidden">
            <div className="absolute top-0 bottom-0 bg-[#f43f5e] w-1/3 animate-[draw_2s_ease-in-out_infinite_alternate]"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
};