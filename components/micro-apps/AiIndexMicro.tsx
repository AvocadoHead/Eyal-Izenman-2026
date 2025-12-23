import React from 'react';

// A mix of tools to fill the grid
const TOOLS = Array.from({ length: 24 }).map((_, i) => i);

export const AiIndexMicro: React.FC = () => {
  return (
    <div className="w-full h-full bg-slate-100 rounded-[3rem] border-4 border-slate-300 shadow-2xl overflow-hidden flex flex-col p-4 relative">
      {/* Top Section */}
      <div className="h-12 w-full flex justify-center mb-4">
          <div className="w-16 h-4 bg-slate-300 rounded-full"></div>
      </div>
      
      {/* The "Remote" Buttons Grid */}
      <div className="grid grid-cols-4 gap-3 flex-grow content-start">
         {TOOLS.map((i) => (
             <div 
                key={i}
                className={`aspect-square rounded-full shadow-sm transition-all duration-300 hover:scale-110 cursor-pointer ${
                    i === 4 ? 'col-span-2 aspect-auto rounded-2xl bg-slate-800' :
                    i % 5 === 0 ? 'bg-slate-300 hover:bg-slate-400' : 'bg-white hover:bg-slate-200'
                }`}
             />
         ))}
      </div>

      {/* Screen area at bottom */}
      <div className="mt-4 h-24 bg-slate-900 rounded-2xl p-3 flex items-center justify-center">
          <span className="text-green-400 font-mono text-xs animate-pulse">AI_INDEX_V2.0_INIT...</span>
      </div>
    </div>
  );
};
