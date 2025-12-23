import React from 'react';

export const AetherGalleryMicro: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center perspective-[800px] group">
       <div className="relative w-40 h-40 transform-style-3d animate-[spin-slow_15s_linear_infinite] group-hover:animate-[spin-slow_5s_linear_infinite]">
          {/* Creating a cluster of CSS cubes */}
          {[...Array(8)].map((_, i) => {
              const x = (i % 2 === 0 ? 1 : -1) * 30;
              const y = (i < 4 ? 1 : -1) * 30;
              const z = (i % 3 === 0 ? 1 : -1) * 30;
              
              return (
                  <div 
                    key={i}
                    className="absolute top-1/2 left-1/2 w-16 h-16 bg-white border border-slate-300 opacity-90 shadow-lg transform-style-3d transition-transform duration-500 group-hover:scale-110"
                    style={{
                        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${i * 45}deg) rotateY(${i * 45}deg)`
                    }}
                  >
                      {/* Face decoration */}
                      <div className="w-full h-full bg-slate-50 opacity-50"></div>
                  </div>
              )
          })}
       </div>
       <div className="absolute bottom-0 text-xs font-mono text-slate-400">
           AETHER.3D
       </div>
    </div>
  );
};
