import React from 'react';

const WORDS = ["Create", "Diffuse", "Imagine", "Noise", "Latent", "Space", "Dream", "Pixel", "Flow", "Chaos", "Order", "Member", "Member", "Member"];

export const OptopiaMicro: React.FC = () => {
  return (
    <div className="w-full h-full relative group cursor-pointer flex items-center justify-center">
      {/* The Chaotic Cloud */}
      <div className="relative w-64 h-64 animate-[spin-slow_40s_linear_infinite]">
         {WORDS.map((word, i) => {
             const angle = (i / WORDS.length) * 360;
             const radius = 60 + Math.random() * 60;
             const rotate = Math.random() * 40 - 20;
             
             return (
                 <div
                    key={i}
                    className="absolute top-1/2 left-1/2 text-slate-800 font-display font-bold transition-all duration-500 group-hover:text-purple-600"
                    style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px) rotate(${rotate}deg)`,
                        fontSize: `${Math.random() * 1.5 + 0.5}rem`,
                        opacity: Math.random() * 0.5 + 0.5
                    }}
                 >
                     {/* Scribble effect using text */}
                     {Math.random() > 0.5 ? word : '~~~~~~'}
                 </div>
             )
         })}
         
         {/* Central Dense Scribble */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-20">
             <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                 <path d="M10,50 Q20,5 30,50 T50,50 T70,50 T90,50 M10,30 Q40,80 70,10 M10,70 Q50,10 90,70" stroke="black" fill="none" strokeWidth="2" />
             </svg>
         </div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg z-10">
        <span className="font-bold tracking-widest text-sm">OPTOPIA</span>
      </div>
    </div>
  );
};
