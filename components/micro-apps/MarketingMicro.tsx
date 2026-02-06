import React from 'react';

interface MarketingMicroProps {
    lang: 'he' | 'en';
    onToggleLang: () => void;
}

export const MarketingMicro: React.FC<MarketingMicroProps> = ({ lang, onToggleLang }) => {
  const isHe = lang === 'he';

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#fff7e8] to-[#fff4e0] group font-sans">
      {/* --- Ambient Background Blobs --- */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#ffd6a6] rounded-full blur-[80px] opacity-50 animate-float" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[70%] h-[70%] bg-[#ff9f55] rounded-full blur-[100px] opacity-30 animate-float-delayed" />

      {/* --- Animated Connector Line --- */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" preserveAspectRatio="none">
             {/* A path that meanders through the card */}
             <path 
                d="M-10,50 Q100,100 200,50 T400,150 T600,50"
                fill="none" 
                stroke="#ff9f55" 
                strokeWidth="1.5"
                className="opacity-50"
             />
             <path 
                d="M-10,50 Q100,100 200,50 T400,150 T600,50"
                fill="none" 
                stroke="#5a3418" 
                strokeWidth="2"
                strokeDasharray="10, 20"
                className="animate-[dash_20s_linear_infinite]"
             />
        </svg>
      </div>

      {/* --- Content Layout --- */}
      <div className="relative z-10 w-full h-full flex flex-col p-8" dir={isHe ? 'rtl' : 'ltr'}>
        
        {/* Header mimic */}
        <div className="flex justify-between items-center mb-8 opacity-60">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#301b0f] rounded-sm animate-spin-slow"></div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#5a3418]">Multimodal</span>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleLang(); }}
                className="text-[10px] font-bold text-[#5a3418] hover:bg-[#ff9f55]/20 px-2 py-1 rounded transition-colors z-20"
            >
                {lang === 'he' ? 'HE / EN' : 'EN / HE'}
            </button>
        </div>

        {/* Main Title Typography */}
        <div className="flex-grow flex flex-col justify-center">
            <div className="inline-block px-3 py-1 mb-4 border border-[#ff9f55] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#5a3418] w-fit bg-[#fffbf2]/50 backdrop-blur-sm shadow-sm group-hover:shadow-md transition-shadow">
                Workshop 2025
            </div>
            
            <h2 className={`text-4xl md:text-5xl font-black text-[#301b0f] leading-[0.9] tracking-tight mb-4 ${isHe ? 'font-sans' : 'font-display'}`}>
                {isHe ? (
                    <>לפצח<br/>את<br/>הבריף.</>
                ) : (
                    <>Crack<br/>the<br/>Brief.</>
                )}
            </h2>
            
            <p className="font-sans text-sm text-[#6b4c32] max-w-[220px] leading-relaxed opacity-80 font-medium">
                {isHe ? 'סדנה למנהלי קריאייטיב ומותגים שרוצים להפוך בריף לקונספט שמזיז אנשים.' : 'For creative leads turning briefs into campaigns that move people.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest font-bold">
                <span className="px-2 py-1 rounded-full bg-white/70 border border-[#ff9f55]/40 text-[#5a3418] transition-transform duration-300 group-hover:-translate-y-1">
                    {isHe ? 'מנהלי מותג' : 'Brand Leads'}
                </span>
                <span className="px-2 py-1 rounded-full bg-white/70 border border-[#ff9f55]/40 text-[#5a3418] transition-transform duration-300 group-hover:-translate-y-1">
                    {isHe ? 'סטודיו/סוכנות' : 'Agency'}
                </span>
                <span className="px-2 py-1 rounded-full bg-white/70 border border-[#ff9f55]/40 text-[#5a3418] transition-transform duration-300 group-hover:-translate-y-1">
                    {isHe ? 'יזמים' : 'Founders'}
                </span>
            </div>
        </div>

        {/* Footer mimic */}
        <div className="pt-6 border-t border-[#ff9f55]/30 flex justify-between items-end">
            <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border border-white bg-[#ffd6a6] flex items-center justify-center text-[8px] font-bold text-[#5a3418] transition-transform hover:-translate-y-1">
                        AI
                    </div>
                ))}
            </div>
            <div className="w-8 h-8 rounded-full bg-[#301b0f] flex items-center justify-center group-hover:scale-110 transition-transform group-hover:rotate-45 duration-300">
                <svg className="w-4 h-4 text-[#fff7e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isHe ? "M7 8l-4 4m0 0l4 4m-4-4H21" : "M17 8l4 4m0 0l-4 4m4-4H3"} />
                </svg>
            </div>
        </div>
      </div>

      {/* --- Interactive Overlay Effect --- */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
      
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  );
};
