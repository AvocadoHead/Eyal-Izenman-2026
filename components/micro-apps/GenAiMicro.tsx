import React from 'react';
import { Sparkles } from 'lucide-react';

interface GenAiMicroProps {
    lang: 'he' | 'en';
    onToggleLang: () => void;
}

export const GenAiMicro: React.FC<GenAiMicroProps> = ({ lang, onToggleLang }) => {
  const isHe = lang === 'he';

  // Theme: Emerald
  const theme = {
      bg: '#ecfdf5',
      accent: '#10b981', // Emerald 500
      dark: '#064e3b', // Emerald 900
      muted: '#34d399'
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#ecfdf5] to-[#e8fcf3] group font-sans">

      {/* Floating Elements (Abstract Generated Shapes) */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#10b981] rounded-full mix-blend-multiply filter blur-[50px] opacity-15 animate-float"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#34d399] rounded-full mix-blend-multiply filter blur-[50px] opacity-15 animate-float-delayed"></div>

      {/* --- Scanning Laser Line --- */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-[scanDown_5s_linear_infinite] opacity-40 z-0"></div>

      <div className="relative z-10 w-full h-full flex flex-col p-8" dir={isHe ? 'rtl' : 'ltr'}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 opacity-60">
            <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[#064e3b]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#064e3b]">Generative</span>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleLang(); }}
                className="text-[10px] font-bold text-[#064e3b] hover:bg-[#10b981]/10 px-2 py-1 rounded transition-colors z-20"
            >
                {lang === 'he' ? 'HE / EN' : 'EN / HE'}
            </button>
        </div>

        {/* Content: Prompt Bar Simulation */}
        <div className="flex-grow flex flex-col justify-center">
            <div className="inline-block px-3 py-1 mb-4 border border-[#10b981] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#064e3b] w-fit bg-white/50 backdrop-blur-sm">
                Future Skills
            </div>
            
            <h2 className={`text-4xl md:text-5xl font-black text-[#064e3b] leading-[0.9] tracking-tight mb-4 ${isHe ? 'font-sans' : 'font-display'}`}>
                {isHe ? (
                    <>יצירה<br/>ג׳נרטיבית.</>
                ) : (
                    <>Gen<br/>Creation.</>
                )}
            </h2>

            <p className="font-sans text-sm text-[#065f46] max-w-[220px] leading-relaxed font-medium">
                {isHe ? 'לאמנים וצוותי חדשנות שבונים שפה ג׳נרטיבית יציבה ומדידה.' : 'For teams building scalable, consistent generative visuals.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest font-bold">
                <span className="px-2 py-1 rounded-full bg-white/70 border border-[#10b981]/30 text-[#064e3b] transition-transform duration-300 group-hover:-translate-y-1">
                    {isHe ? 'מערכות' : 'Systems'}
                </span>
                <span className="px-2 py-1 rounded-full bg-white/70 border border-[#10b981]/30 text-[#064e3b] transition-transform duration-300 group-hover:-translate-y-1">
                    {isHe ? 'ControlNets' : 'ControlNets'}
                </span>
                <span className="px-2 py-1 rounded-full bg-white/70 border border-[#10b981]/30 text-[#064e3b] transition-transform duration-300 group-hover:-translate-y-1">
                    {isHe ? 'סדרות' : 'Series'}
                </span>
            </div>

            {/* Simulated Prompt Box */}
            <div className="mt-5 p-3 rounded-lg bg-white/60 border border-[#10b981]/30 backdrop-blur-sm max-w-[220px] group-hover:border-[#10b981] transition-colors duration-500">
                <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                    <span className="text-[10px] font-mono text-[#064e3b] opacity-70 whitespace-nowrap overflow-hidden animate-[type_3s_steps(40,end)_infinite]">
                        {isHe ? '/דמיין סיפור ויזואלי...' : '/imagine a visual story...'}
                    </span>
                </div>
            </div>
        </div>

        {/* Footer: Progress Bar */}
        <div className="flex items-center gap-2 mt-auto opacity-50">
            <span className="text-[8px] font-mono text-[#064e3b] uppercase">Processing</span>
            <div className="h-[2px] flex-grow bg-[#a7f3d0] rounded-full overflow-hidden">
                <div className="h-full bg-[#059669] w-[70%] animate-[draw_3s_ease-out_infinite]"></div>
            </div>
        </div>
      </div>

      <style>{`
        @keyframes scanDown {
            0% { top: -5%; opacity: 0; }
            5% { opacity: 0.4; }
            95% { opacity: 0.4; }
            100% { top: 105%; opacity: 0; }
        }
        @keyframes type {
          0% { width: 0; }
          45% { width: 100%; }
          85% { width: 100%; }
          100% { width: 0; }
        }
      `}</style>
    </div>
  );
};
