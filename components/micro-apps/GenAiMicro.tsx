import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface GenAiMicroProps {
    lang: 'he' | 'en';
    onToggleLang: () => void;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    hue: number;
    type: 'seed' | 'bloom' | 'spark';
    connections: number[];
}

interface Branch {
    x: number;
    y: number;
    angle: number;
    length: number;
    generation: number;
    progress: number;
    children: Branch[];
}

export const GenAiMicro: React.FC<GenAiMicroProps> = ({ lang, onToggleLang }) => {
    const isHe = lang === 'he';
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, active: false });
    const animationRef = useRef<number>();
    const particlesRef = useRef<Particle[]>([]);
    const branchesRef = useRef<Branch[]>([]);
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
        let lastSpawn = 0;

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

        const spawnSeed = (x: number, y: number) => {
            const particle: Particle = {
                x,
                y,
                vx: (Math.random() - 0.5) * 2,
                vy: -1 - Math.random() * 2,
                life: 0,
                maxLife: 150 + Math.random() * 100,
                size: 2 + Math.random() * 3,
                hue: 140 + Math.random() * 40, // Emerald range
                type: 'seed',
                connections: []
            };
            particlesRef.current.push(particle);
        };

        const spawnBloom = (x: number, y: number) => {
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2;
                const particle: Particle = {
                    x,
                    y,
                    vx: Math.cos(angle) * (1 + Math.random()),
                    vy: Math.sin(angle) * (1 + Math.random()),
                    life: 0,
                    maxLife: 60 + Math.random() * 40,
                    size: 1 + Math.random() * 2,
                    hue: 150 + Math.random() * 30,
                    type: 'bloom',
                    connections: []
                };
                particlesRef.current.push(particle);
            }
        };

        const createBranch = (x: number, y: number, angle: number, gen: number): Branch => {
            return {
                x,
                y,
                angle,
                length: 30 + Math.random() * 20 - gen * 8,
                generation: gen,
                progress: 0,
                children: []
            };
        };

        const growBranch = (branch: Branch) => {
            if (branch.progress < 1) {
                branch.progress += 0.02;
            } else if (branch.generation < 3 && branch.children.length === 0 && Math.random() > 0.3) {
                const endX = branch.x + Math.cos(branch.angle) * branch.length;
                const endY = branch.y + Math.sin(branch.angle) * branch.length;

                if (Math.random() > 0.4) {
                    branch.children.push(
                        createBranch(endX, endY, branch.angle - 0.4 - Math.random() * 0.3, branch.generation + 1)
                    );
                }
                if (Math.random() > 0.4) {
                    branch.children.push(
                        createBranch(endX, endY, branch.angle + 0.4 + Math.random() * 0.3, branch.generation + 1)
                    );
                }
            }

            branch.children.forEach(growBranch);
        };

        const drawBranch = (branch: Branch) => {
            const endX = branch.x + Math.cos(branch.angle) * branch.length * branch.progress;
            const endY = branch.y + Math.sin(branch.angle) * branch.length * branch.progress;

            const alpha = 0.6 - branch.generation * 0.15;
            const width = 3 - branch.generation * 0.7;

            // Glow
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.3})`;
            ctx.lineWidth = width + 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(branch.x, branch.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Main branch
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(branch.x, branch.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Node at end
            if (branch.progress >= 1) {
                ctx.beginPath();
                ctx.arc(endX, endY, 3 - branch.generation * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
                ctx.fill();
            }

            branch.children.forEach(drawBranch);
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.016;

            const mouse = mouseRef.current;
            const hovered = isHovered;
            const particles = particlesRef.current;
            const branches = branchesRef.current;

            // Spawn new seeds periodically
            if (time - lastSpawn > (hovered ? 0.3 : 0.8)) {
                lastSpawn = time;
                spawnSeed(
                    width * 0.3 + Math.random() * width * 0.4,
                    height * 0.8 + Math.random() * height * 0.15
                );
            }

            // Mouse spawns extra particles
            if (mouse.active && hovered && Math.random() > 0.7) {
                spawnSeed(mouse.x + (Math.random() - 0.5) * 30, mouse.y + (Math.random() - 0.5) * 30);
            }

            // Draw DNA helix in background
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
            ctx.lineWidth = 2;
            for (let strand = 0; strand < 2; strand++) {
                ctx.beginPath();
                for (let i = 0; i < height; i += 2) {
                    const phase = strand * Math.PI;
                    const x = width * 0.85 + Math.sin(i * 0.03 + time + phase) * 25;
                    if (i === 0) ctx.moveTo(x, i);
                    else ctx.lineTo(x, i);
                }
                ctx.stroke();
            }

            // Draw connections between strands
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.05)';
            ctx.lineWidth = 1;
            for (let i = 0; i < height; i += 30) {
                const x1 = width * 0.85 + Math.sin(i * 0.03 + time) * 25;
                const x2 = width * 0.85 + Math.sin(i * 0.03 + time + Math.PI) * 25;
                ctx.beginPath();
                ctx.moveTo(x1, i);
                ctx.lineTo(x2, i);
                ctx.stroke();
            }

            // Grow and draw branches
            if (branches.length === 0 || (branches.length < 3 && Math.random() > 0.995)) {
                branches.push(createBranch(
                    width * 0.2 + Math.random() * width * 0.3,
                    height * 0.9,
                    -Math.PI / 2 + (Math.random() - 0.5) * 0.5,
                    0
                ));
            }

            branches.forEach(branch => {
                growBranch(branch);
                drawBranch(branch);
            });

            // Limit branches
            if (branches.length > 5) {
                branches.shift();
            }

            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.life++;

                if (p.life > p.maxLife) {
                    // Bloom on death
                    if (p.type === 'seed' && Math.random() > 0.5) {
                        spawnBloom(p.x, p.y);
                    }
                    particles.splice(i, 1);
                    continue;
                }

                // Physics
                p.vy += 0.02; // Slight gravity
                p.x += p.vx;
                p.y += p.vy;

                // Mouse attraction when hovered
                if (mouse.active && hovered) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 100) {
                        const force = (1 - dist / 100) * 0.1;
                        p.vx += dx * force * 0.1;
                        p.vy += dy * force * 0.1;
                    }
                }

                // Friction
                p.vx *= 0.98;
                p.vy *= 0.98;

                // Draw particle
                const lifeRatio = p.life / p.maxLife;
                const alpha = p.type === 'bloom'
                    ? (1 - lifeRatio) * 0.8
                    : Math.sin(lifeRatio * Math.PI) * 0.9;

                const size = p.type === 'bloom'
                    ? p.size * (1 + lifeRatio * 2)
                    : p.size * (0.5 + Math.sin(lifeRatio * Math.PI) * 0.5);

                // Glow
                const glowGradient = ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, size * 4
                );
                glowGradient.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${alpha * 0.4})`);
                glowGradient.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`);

                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
                ctx.fillStyle = glowGradient;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 70%, 55%, ${alpha})`;
                ctx.fill();

                // Inner bright spot
                ctx.beginPath();
                ctx.arc(p.x - size * 0.2, p.y - size * 0.2, size * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
                ctx.fill();
            }

            // Draw neural connections between nearby particles
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.15)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(
                        particles[i].x - particles[j].x,
                        particles[i].y - particles[j].y
                    );
                    if (dist < 60) {
                        const alpha = (1 - dist / 60) * 0.3;
                        ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Mouse glow
            if (mouse.active && hovered) {
                const mouseGlow = ctx.createRadialGradient(
                    mouse.x, mouse.y, 0,
                    mouse.x, mouse.y, 80
                );
                mouseGlow.addColorStop(0, 'rgba(52, 211, 153, 0.15)');
                mouseGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)');
                mouseGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');

                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
                ctx.fillStyle = mouseGlow;
                ctx.fill();
            }

            // Limit particles
            if (particles.length > 80) {
                particles.splice(0, particles.length - 80);
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
            className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#ecfdf5] via-[#e8fcf3] to-[#d1fae5] group font-sans"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Canvas for particles */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
            />

            {/* Ambient blobs */}
            <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-400/15 rounded-full blur-[60px] animate-float pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-400/10 rounded-full blur-[80px] animate-float-delayed pointer-events-none" />

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            {/* Content overlay */}
            <div className="relative z-10 w-full h-full flex flex-col p-6 md:p-8" dir={isHe ? 'rtl' : 'ltr'}>

                {/* Header */}
                <div className="flex justify-between items-center mb-6 opacity-70">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#064e3b] animate-pulse" />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#064e3b]">
                            {isHe ? 'ג׳נרטיבי' : 'Generative'}
                        </span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleLang(); }}
                        className="text-[10px] font-bold text-[#064e3b] hover:bg-[#10b981]/15 px-2 py-1 rounded-full transition-all duration-300 hover:scale-105"
                    >
                        {lang === 'he' ? 'EN' : 'HE'}
                    </button>
                </div>

                {/* Main content */}
                <div className="flex-grow flex flex-col justify-center">
                    <div className="inline-block px-4 py-1.5 mb-5 border border-[#10b981]/50 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-[#064e3b] w-fit bg-white/50 backdrop-blur-md shadow-sm group-hover:shadow-lg group-hover:border-[#10b981] transition-all duration-500">
                        {isHe ? 'מיומנויות עתיד' : 'Future Skills'}
                    </div>

                    <h2 className={`text-4xl md:text-5xl font-black text-[#064e3b] leading-[0.9] tracking-tight mb-5 transition-transform duration-500 group-hover:translate-x-1 ${isHe ? 'font-sans' : 'font-display'}`}>
                        {isHe ? (
                            <>יצירה<br/>ג׳נרטיבית.</>
                        ) : (
                            <>Gen<br/>Creation.</>
                        )}
                    </h2>

                    <p className="font-sans text-sm text-[#065f46] max-w-[240px] leading-relaxed font-medium">
                        {isHe
                            ? 'לאמנים שבונים שפה ויזואלית עקבית עם AI.'
                            : 'For teams building scalable, consistent generative visuals.'}
                    </p>

                    {/* Tags */}
                    <div className="mt-5 flex flex-wrap gap-2">
                        {(isHe ? ['מערכות', 'ControlNets', 'סדרות'] : ['Systems', 'ControlNets', 'Series']).map((tag, i) => (
                            <span
                                key={tag}
                                className="px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-[#10b981]/25 text-[10px] uppercase tracking-widest font-bold text-[#064e3b] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-[#10b981]/50"
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Prompt simulation */}
                    <div className="mt-5 p-3 rounded-xl bg-white/50 border border-[#10b981]/20 backdrop-blur-md max-w-[220px] group-hover:border-[#10b981]/50 group-hover:shadow-lg transition-all duration-500">
                        <div className="flex gap-2 items-center">
                            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-lg shadow-emerald-500/30" />
                            <span className="text-[10px] font-mono text-[#064e3b] opacity-70 overflow-hidden">
                                <span className="inline-block animate-[typewriter_4s_steps(25)_infinite]">
                                    {isHe ? '/דמיין סיפור ויזואלי...' : '/imagine visual story...'}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-5 border-t border-[#10b981]/15 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#064e3b] opacity-60 uppercase">
                                {isHe ? 'מעבד' : 'Processing'}
                            </span>
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-bounce"
                                        style={{ animationDelay: `${i * 150}ms` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#064e3b] to-[#059669] flex items-center justify-center group-hover:scale-110 transition-all duration-500 group-hover:rotate-45 shadow-lg group-hover:shadow-xl group-hover:shadow-emerald-500/20">
                        <svg className="w-4 h-4 text-[#ecfdf5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes typewriter {
                    0%, 100% { width: 0; }
                    50%, 90% { width: 100%; }
                }
            `}</style>
        </div>
    );
};
