import React, { useEffect, useRef, useState } from 'react';

interface MarketingMicroProps {
    lang: 'he' | 'en';
    onToggleLang: () => void;
}

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    word: string;
    pulse: number;
    pulseSpeed: number;
}

export const MarketingMicro: React.FC<MarketingMicroProps> = ({ lang, onToggleLang }) => {
    const isHe = lang === 'he';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, active: false });
    const nodesRef = useRef<Node[]>([]);
    const animationRef = useRef<number>();
    const [isHovered, setIsHovered] = useState(false);

    const words = isHe
        ? ['מותג', 'רעיון', 'קונספט', 'סטוריטלינג', 'ויז׳ואל', 'אסטרטגיה', 'קריאייטיב', 'בריף']
        : ['Brand', 'Idea', 'Concept', 'Story', 'Visual', 'Strategy', 'Creative', 'Brief'];

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let time = 0;

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

            // Initialize nodes if empty
            if (nodesRef.current.length === 0) {
                nodesRef.current = words.map((word, i) => ({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: 4 + Math.random() * 3,
                    word,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.02 + Math.random() * 0.02
                }));
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.016;

            const mouse = mouseRef.current;
            const nodes = nodesRef.current;
            const hovered = isHovered;

            // Update nodes
            nodes.forEach((node, i) => {
                // Pulse animation
                node.pulse += node.pulseSpeed;
                const pulseScale = 1 + Math.sin(node.pulse) * 0.3;

                // Mouse attraction when hovered
                if (mouse.active && hovered) {
                    const dx = mouse.x - node.x;
                    const dy = mouse.y - node.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 150) {
                        const force = (1 - dist / 150) * 0.02;
                        node.vx += dx * force;
                        node.vy += dy * force;
                    }
                }

                // Apply velocity
                node.x += node.vx;
                node.y += node.vy;

                // Boundary bounce
                if (node.x < 20) { node.x = 20; node.vx *= -0.8; }
                if (node.x > width - 20) { node.x = width - 20; node.vx *= -0.8; }
                if (node.y < 20) { node.y = 20; node.vy *= -0.8; }
                if (node.y > height - 20) { node.y = height - 20; node.vy *= -0.8; }

                // Friction
                node.vx *= 0.98;
                node.vy *= 0.98;

                // Gentle drift
                node.vx += Math.sin(time + i) * 0.005;
                node.vy += Math.cos(time * 0.7 + i) * 0.005;
            });

            // Draw connections
            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[j].x - nodes[i].x;
                    const dy = nodes[j].y - nodes[i].y;
                    const dist = Math.hypot(dx, dy);
                    const maxDist = hovered ? 180 : 120;

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * (hovered ? 0.6 : 0.3);

                        // Gradient line
                        const gradient = ctx.createLinearGradient(
                            nodes[i].x, nodes[i].y,
                            nodes[j].x, nodes[j].y
                        );
                        gradient.addColorStop(0, `rgba(255, 159, 85, ${alpha})`);
                        gradient.addColorStop(0.5, `rgba(251, 146, 60, ${alpha * 1.5})`);
                        gradient.addColorStop(1, `rgba(255, 159, 85, ${alpha})`);

                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = gradient;
                        ctx.stroke();

                        // Electric spark effect on hover
                        if (hovered && dist < 80) {
                            const midX = (nodes[i].x + nodes[j].x) / 2;
                            const midY = (nodes[i].y + nodes[j].y) / 2;
                            const sparkSize = (1 - dist / 80) * 6;

                            ctx.beginPath();
                            ctx.arc(midX + Math.sin(time * 10) * 3, midY + Math.cos(time * 10) * 3, sparkSize, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
                            ctx.fill();
                        }
                    }
                }
            }

            // Draw nodes
            nodes.forEach((node, i) => {
                const pulseScale = 1 + Math.sin(node.pulse) * 0.3;
                const radius = node.radius * pulseScale;

                // Mouse proximity glow
                let glowIntensity = 0;
                if (mouse.active) {
                    const dist = Math.hypot(mouse.x - node.x, mouse.y - node.y);
                    glowIntensity = Math.max(0, 1 - dist / 100);
                }

                // Outer glow
                const glowRadius = radius * (2 + glowIntensity * 2);
                const glowGradient = ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, glowRadius
                );
                glowGradient.addColorStop(0, `rgba(255, 159, 85, ${0.4 + glowIntensity * 0.4})`);
                glowGradient.addColorStop(0.5, `rgba(251, 146, 60, ${0.15 + glowIntensity * 0.2})`);
                glowGradient.addColorStop(1, 'rgba(255, 159, 85, 0)');

                ctx.beginPath();
                ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
                ctx.fillStyle = glowGradient;
                ctx.fill();

                // Core node
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 159, 85, ${0.9 + glowIntensity * 0.1})`;
                ctx.fill();

                // Inner highlight
                ctx.beginPath();
                ctx.arc(node.x - radius * 0.3, node.y - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.fill();

                // Word label (only on hover or always visible for some)
                if (hovered || i < 3) {
                    ctx.font = `bold ${isHe ? '10px' : '9px'} Heebo, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = `rgba(90, 52, 24, ${0.4 + glowIntensity * 0.6})`;
                    ctx.fillText(node.word, node.x, node.y + radius + 12);
                }
            });

            // Mouse glow trail
            if (mouse.active && hovered) {
                const trailGradient = ctx.createRadialGradient(
                    mouse.x, mouse.y, 0,
                    mouse.x, mouse.y, 60
                );
                trailGradient.addColorStop(0, 'rgba(255, 200, 120, 0.15)');
                trailGradient.addColorStop(0.5, 'rgba(255, 159, 85, 0.08)');
                trailGradient.addColorStop(1, 'rgba(255, 159, 85, 0)');

                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
                ctx.fillStyle = trailGradient;
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
    }, [isHe, isHovered, words]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#fff7e8] via-[#fff4e0] to-[#ffedd5] group font-sans"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Canvas for neural network */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
            />

            {/* Ambient background gradients */}
            <div className="absolute top-[-30%] left-[-20%] w-[70%] h-[70%] bg-[#ffd6a6] rounded-full blur-[100px] opacity-40 animate-float pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] bg-[#ff9f55] rounded-full blur-[120px] opacity-25 animate-float-delayed pointer-events-none" />

            {/* Content overlay */}
            <div className="relative z-10 w-full h-full flex flex-col p-6 md:p-8" dir={isHe ? 'rtl' : 'ltr'}>

                {/* Header */}
                <div className="flex justify-between items-center mb-6 opacity-70">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-gradient-to-br from-[#ff9f55] to-[#f97316] rounded-full animate-pulse shadow-lg shadow-orange-500/30" />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#5a3418]">
                            {isHe ? 'מולטימודלי' : 'Multimodal'}
                        </span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleLang(); }}
                        className="text-[10px] font-bold text-[#5a3418] hover:bg-[#ff9f55]/20 px-2 py-1 rounded-full transition-all duration-300 hover:scale-105"
                    >
                        {lang === 'he' ? 'EN' : 'HE'}
                    </button>
                </div>

                {/* Main content */}
                <div className="flex-grow flex flex-col justify-center">
                    <div className="inline-block px-4 py-1.5 mb-5 border border-[#ff9f55]/60 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-[#5a3418] w-fit bg-white/40 backdrop-blur-md shadow-sm group-hover:shadow-lg group-hover:border-[#ff9f55] transition-all duration-500">
                        {isHe ? 'סדנה 2025' : 'Workshop 2025'}
                    </div>

                    <h2 className={`text-4xl md:text-5xl font-black text-[#301b0f] leading-[0.9] tracking-tight mb-5 transition-transform duration-500 group-hover:translate-x-1 ${isHe ? 'font-sans' : 'font-display'}`}>
                        {isHe ? (
                            <>לפצח<br/>את הבריף.</>
                        ) : (
                            <>Crack<br/>the Brief.</>
                        )}
                    </h2>

                    <p className="font-sans text-sm text-[#6b4c32] max-w-[240px] leading-relaxed opacity-90 font-medium">
                        {isHe
                            ? 'סדנה למנהלי קריאייטיב שרוצים להפוך בריף לקונספט שמזיז אנשים.'
                            : 'For creative leads turning briefs into campaigns that move people.'}
                    </p>

                    {/* Tags */}
                    <div className="mt-5 flex flex-wrap gap-2">
                        {(isHe ? ['מנהלי מותג', 'סטודיו', 'יזמים'] : ['Brand Leads', 'Studios', 'Founders']).map((tag, i) => (
                            <span
                                key={tag}
                                className="px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-[#ff9f55]/30 text-[10px] uppercase tracking-widest font-bold text-[#5a3418] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-[#ff9f55]/60"
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-5 border-t border-[#ff9f55]/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[0, 1, 2].map(i => (
                                <div
                                    key={i}
                                    className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-[#ffd6a6] to-[#ffb366] flex items-center justify-center text-[8px] font-bold text-[#5a3418] shadow-md transition-transform duration-300 hover:-translate-y-1"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    AI
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] text-[#6b4c32] opacity-60">
                            {isHe ? '+50 בוגרים' : '+50 Alumni'}
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#301b0f] to-[#5a3418] flex items-center justify-center group-hover:scale-110 transition-all duration-500 group-hover:rotate-45 shadow-lg group-hover:shadow-xl group-hover:shadow-orange-500/20">
                        <svg className="w-4 h-4 text-[#fff7e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isHe ? "M7 17L17 7M17 7H7M17 7V17" : "M7 17L17 7M17 7H7M17 7V17"} />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
