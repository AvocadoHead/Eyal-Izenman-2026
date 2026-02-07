import React, { useEffect, useRef, useState } from 'react';
import { Scissors } from 'lucide-react';

interface EditingMicroProps {
    lang: 'he' | 'en';
    onToggleLang: () => void;
}

export const EditingMicro: React.FC<EditingMicroProps> = ({ lang, onToggleLang }) => {
    const isHe = lang === 'he';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, active: false });
    const animationRef = useRef<number>();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let time = 0;
        let playheadX = 0;

        // Generate waveform data
        const waveformBars = 60;
        const waveforms = [
            Array.from({ length: waveformBars }, () => 0.2 + Math.random() * 0.8),
            Array.from({ length: waveformBars }, () => 0.1 + Math.random() * 0.6),
            Array.from({ length: waveformBars }, () => 0.3 + Math.random() * 0.7)
        ];

        const resize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            width = rect.width;
            height = rect.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.016;

            const mouse = mouseRef.current;
            const hovered = isHovered;
            const speed = hovered ? 1.5 : 0.8;

            // Move playhead
            playheadX += speed;
            if (playheadX > width + 20) {
                playheadX = -20;
            }

            // Mouse Y affects waveform amplitude
            const mouseAmplitude = mouse.active ? 0.5 + (mouse.y / height) * 1.5 : 1;

            // Draw film strip perforations
            const perfSize = 8;
            const perfGap = 20;
            ctx.fillStyle = 'rgba(136, 19, 55, 0.08)';
            for (let x = 0; x < width; x += perfGap) {
                ctx.fillRect(x, 0, perfSize, perfSize);
                ctx.fillRect(x, height - perfSize, perfSize, perfSize);
            }

            // Draw timeline tracks background
            const trackHeight = 40;
            const trackY = height * 0.35;
            const colors = [
                { bg: 'rgba(253, 164, 175, 0.3)', bar: 'rgba(244, 63, 94, 0.6)' },
                { bg: 'rgba(244, 63, 94, 0.25)', bar: 'rgba(225, 29, 72, 0.7)' },
                { bg: 'rgba(136, 19, 55, 0.2)', bar: 'rgba(136, 19, 55, 0.6)' }
            ];

            // Draw waveform tracks
            waveforms.forEach((waveform, trackIndex) => {
                const y = trackY + trackIndex * (trackHeight + 8);
                const color = colors[trackIndex];

                // Track background
                ctx.fillStyle = color.bg;
                ctx.beginPath();
                ctx.roundRect(10, y, width - 20, trackHeight, 6);
                ctx.fill();

                // Waveform bars
                const barWidth = (width - 40) / waveformBars;
                waveform.forEach((amplitude, i) => {
                    const barX = 20 + i * barWidth;

                    // Animate amplitude with time and mouse
                    const animatedAmplitude = amplitude *
                        (0.7 + Math.sin(time * 3 + i * 0.2) * 0.3) *
                        mouseAmplitude;

                    const barHeight = trackHeight * 0.8 * animatedAmplitude;
                    const barY = y + (trackHeight - barHeight) / 2;

                    // Playhead proximity glow
                    const distToPlayhead = Math.abs(barX - playheadX);
                    const glowIntensity = Math.max(0, 1 - distToPlayhead / 50);

                    if (glowIntensity > 0) {
                        ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity * 0.4})`;
                    } else {
                        ctx.fillStyle = color.bar;
                    }

                    ctx.beginPath();
                    ctx.roundRect(barX, barY, barWidth - 2, barHeight, 2);
                    ctx.fill();
                });
            });

            // Draw playhead
            const playheadGlow = ctx.createLinearGradient(playheadX - 20, 0, playheadX + 20, 0);
            playheadGlow.addColorStop(0, 'rgba(244, 63, 94, 0)');
            playheadGlow.addColorStop(0.5, `rgba(244, 63, 94, ${hovered ? 0.4 : 0.2})`);
            playheadGlow.addColorStop(1, 'rgba(244, 63, 94, 0)');

            ctx.fillStyle = playheadGlow;
            ctx.fillRect(playheadX - 20, 0, 40, height);

            // Playhead line
            ctx.strokeStyle = `rgba(244, 63, 94, ${hovered ? 1 : 0.7})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(playheadX, 0);
            ctx.lineTo(playheadX, height);
            ctx.stroke();

            // Playhead triangle top
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.moveTo(playheadX, 0);
            ctx.lineTo(playheadX - 8, 12);
            ctx.lineTo(playheadX + 8, 12);
            ctx.closePath();
            ctx.fill();

            // Cut/slice effect when playhead crosses center
            if (hovered && Math.abs(playheadX - width / 2) < 30) {
                const sliceIntensity = 1 - Math.abs(playheadX - width / 2) / 30;

                // Glitch lines
                for (let i = 0; i < 5; i++) {
                    const y = Math.random() * height;
                    const w = 20 + Math.random() * 40;
                    ctx.fillStyle = `rgba(244, 63, 94, ${sliceIntensity * 0.3})`;
                    ctx.fillRect(width / 2 - w / 2, y, w, 2);
                }

                // Flash effect
                ctx.fillStyle = `rgba(255, 255, 255, ${sliceIntensity * 0.1})`;
                ctx.fillRect(0, 0, width, height);
            }

            // Clips on tracks (decorative)
            const clips = [
                { x: width * 0.1, w: width * 0.25, track: 0 },
                { x: width * 0.4, w: width * 0.35, track: 0 },
                { x: width * 0.2, w: width * 0.4, track: 1 },
                { x: width * 0.05, w: width * 0.6, track: 2 },
                { x: width * 0.7, w: width * 0.25, track: 2 }
            ];

            clips.forEach(clip => {
                const y = trackY + clip.track * (trackHeight + 8);
                const alpha = hovered ? 0.15 : 0.08;

                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(clip.x, y + 2, clip.w, trackHeight - 4, 4);
                ctx.stroke();

                // Clip handles
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fillRect(clip.x, y + 2, 3, trackHeight - 4);
                ctx.fillRect(clip.x + clip.w - 3, y + 2, 3, trackHeight - 4);
            });

            // Mouse cursor as scrubber
            if (mouse.active && hovered) {
                const cursorGlow = ctx.createRadialGradient(
                    mouse.x, mouse.y, 0,
                    mouse.x, mouse.y, 40
                );
                cursorGlow.addColorStop(0, 'rgba(244, 63, 94, 0.2)');
                cursorGlow.addColorStop(1, 'rgba(244, 63, 94, 0)');

                ctx.fillStyle = cursorGlow;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 40, 0, Math.PI * 2);
                ctx.fill();
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        resize();
        draw();

        window.addEventListener('resize', resize);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('resize', resize);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isHovered]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#fff1f2] via-[#ffeef0] to-[#ffe4e6] group font-sans"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Canvas for waveform */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
            />

            {/* Ambient blobs */}
            <div className="absolute -top-20 -left-20 w-56 h-56 bg-rose-300/25 rounded-full blur-[60px] animate-float pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-rose-500/15 rounded-full blur-[80px] animate-float-delayed pointer-events-none" />

            {/* Content overlay */}
            <div className="relative z-10 w-full h-full flex flex-col p-6 md:p-8" dir={isHe ? 'rtl' : 'ltr'}>

                {/* Header */}
                <div className="flex justify-between items-center mb-6 opacity-70">
                    <div className="flex items-center gap-2">
                        <Scissors className="w-3.5 h-3.5 text-[#881337] animate-pulse" />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#881337]">
                            {isHe ? 'פוסט-פרודקשן' : 'Post-Prod'}
                        </span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleLang(); }}
                        className="text-[10px] font-bold text-[#881337] hover:bg-[#f43f5e]/15 px-2 py-1 rounded-full transition-all duration-300 hover:scale-105"
                    >
                        {lang === 'he' ? 'EN' : 'HE'}
                    </button>
                </div>

                {/* Main content */}
                <div className="flex-grow flex flex-col justify-center relative z-10">
                    <div className="inline-block px-4 py-1.5 mb-5 border border-[#f43f5e]/50 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-[#881337] w-fit bg-white/50 backdrop-blur-md shadow-sm group-hover:shadow-lg group-hover:border-[#f43f5e] transition-all duration-500">
                        {isHe ? 'מאסטרקלאס' : 'Masterclass'}
                    </div>

                    <h2 className={`text-4xl md:text-5xl font-black text-[#881337] leading-[0.9] tracking-tight mb-5 transition-transform duration-500 group-hover:translate-x-1 ${isHe ? 'font-sans' : 'font-display'}`}>
                        {isHe ? (
                            <>עריכה<br/>ופוסט.</>
                        ) : (
                            <>Edit<br/>& Post.</>
                        )}
                    </h2>

                    <p className="font-sans text-sm text-[#9f1239] max-w-[240px] leading-relaxed font-medium">
                        {isHe
                            ? 'לעורכים שרוצים קצב קולנועי גם בלי סטודיו כבד.'
                            : 'For editors who want cinematic rhythm without heavy pipelines.'}
                    </p>

                    {/* Tags */}
                    <div className="mt-5 flex flex-wrap gap-2">
                        {(isHe ? ['וידאו קצר', 'פרסומות', 'קולנועי'] : ['Short-form', 'Commercials', 'Cinematic']).map((tag, i) => (
                            <span
                                key={tag}
                                className="px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-[#f43f5e]/25 text-[10px] uppercase tracking-widest font-bold text-[#881337] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-[#f43f5e]/50"
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Footer with progress bar */}
                <div className="pt-5 border-t border-[#f43f5e]/15 flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#f43f5e] animate-pulse shadow-lg shadow-rose-500/30" />
                            <span className="text-[10px] font-mono text-[#881337] opacity-60 uppercase">
                                {isHe ? 'מוכן' : 'Ready'}
                            </span>
                        </div>
                        <div className="h-1.5 flex-1 max-w-[120px] bg-[#fda4af]/30 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#f43f5e] to-[#e11d48] rounded-full animate-[progress_3s_ease-in-out_infinite]" style={{ width: '65%' }} />
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#881337] to-[#be123c] flex items-center justify-center group-hover:scale-110 transition-all duration-500 group-hover:rotate-45 shadow-lg group-hover:shadow-xl group-hover:shadow-rose-500/20">
                        <svg className="w-4 h-4 text-[#fff1f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes progress {
                    0%, 100% { width: 30%; }
                    50% { width: 85%; }
                }
            `}</style>
        </div>
    );
};
