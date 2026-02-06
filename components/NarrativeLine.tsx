import React, { useEffect, useRef } from 'react';

interface NarrativeLineProps {
  scrollProgress: number;
}

export const NarrativeLine: React.FC<NarrativeLineProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  // Smoothed blob position for fluid animation
  const smoothBlobRef = useRef({ x: 0, y: 0, radius: 280, initialized: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;
    let animationId: number;

    // Line Configuration
    const POINTS_COUNT = 50;
    const points: { x: number, y: number, baseX: number }[] = [];

    const initPoints = () => {
        points.length = 0;
        const startY = window.innerHeight * 0.5;
        const segmentHeight = (height - startY) / (POINTS_COUNT - 1);
        const center = width < 768 ? width * 0.15 : width * 0.5;

        for (let i = 0; i < POINTS_COUNT; i++) {
            points.push({
                x: center,
                baseX: center,
                y: startY + (i * segmentHeight)
            });
        }

        // Initialize smooth blob position
        if (!smoothBlobRef.current.initialized) {
            smoothBlobRef.current = { x: width * 0.5, y: window.innerHeight * 0.3, radius: 200, initialized: true };
        }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = document.body.scrollHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initPoints();
    };

    // Smooth easing functions
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Lerp with smoothing
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.008; // Slightly slower for smoother feel

      const scrollTop = window.scrollY;
      const viewHeight = window.innerHeight;

      // --- 1. THE LINE (Organic wave simulation) ---

      // Physics Update with smoother waves
      points.forEach((p, i) => {
          const intensity = Math.pow(i / POINTS_COUNT, 1.5); // Non-linear for organic feel
          const wave1 = Math.sin(time * 0.8 + i * 0.12) * 10 * intensity;
          const wave2 = Math.cos(time * 0.5 + i * 0.08) * 18 * intensity;
          const wave3 = Math.sin(time * 0.3 + i * 0.05) * 6 * intensity; // Third subtle wave
          p.x = p.baseX + wave1 + wave2 + wave3;
      });

      // Draw Line with bezier curves for smoothness
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < points.length - 1; i++) {
          const p0 = points[i];
          const p1 = points[i + 1];
          const midX = (p0.x + p1.x) / 2;
          const midY = (p0.y + p1.y) / 2;
          if (i === 0) ctx.lineTo(midX, midY);
          else ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

      // Enhanced gradient with more color stops
      const gradient = ctx.createLinearGradient(0, viewHeight * 0.5, 0, height);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0)'); // Violet transparent
      gradient.addColorStop(0.08, 'rgba(139, 92, 246, 0.25)'); // Violet
      gradient.addColorStop(0.25, 'rgba(99, 102, 241, 0.35)'); // Indigo
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.3)'); // Violet
      gradient.addColorStop(0.75, 'rgba(99, 102, 241, 0.25)'); // Indigo
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)'); // Violet fade

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // --- 2. THE MORPHING BLOB with smooth interpolation ---

      const headerZone = viewHeight * 0.45;
      const transitionZone = viewHeight * 0.15; // Blend zone for smooth transition
      let targetX: number, targetY: number, targetRadius: number;

      if (scrollTop < headerZone) {
          // PHASE 1: Header - Large ambient blob
          const t = Math.min(scrollTop / headerZone, 1);
          const ease = easeOutQuart(t);

          const startX = width * 0.5;
          const startY = viewHeight * 0.32;
          const endX = points[0]?.x ?? startX;
          const endY = points[0]?.y ?? startY;

          targetX = startX + (endX - startX) * ease;
          targetY = startY + (endY - startY) * ease;

          // Smooth radius reduction with breathing effect
          const baseRadius = 200 - (188 * ease); // 200px -> 12px
          const breathe = Math.sin(time * 1.5) * (12 * (1 - ease));
          targetRadius = Math.max(baseRadius + breathe, 8);

          // Gentle organic movement when large
          if (ease < 0.7) {
             const wobbleStrength = (1 - ease) * 0.8;
             targetX += Math.sin(time * 1.2) * 25 * wobbleStrength;
             targetY += Math.cos(time * 0.9) * 20 * wobbleStrength;
          }

      } else if (scrollTop < headerZone + transitionZone) {
          // TRANSITION PHASE: Smooth blend between header and line following
          const transitionT = (scrollTop - headerZone) / transitionZone;
          const ease = easeInOutCubic(transitionT);

          // Blend from end of header phase to start of line phase
          const headerEndX = points[0]?.x ?? width * 0.5;
          const headerEndY = points[0]?.y ?? viewHeight * 0.5;

          targetX = headerEndX;
          targetY = headerEndY;
          targetRadius = lerp(12, 10, ease) + Math.sin(time * 4) * 1.5;

      } else {
          // PHASE 2: Line Following
          const lineStart = headerZone + transitionZone;
          const lineProgress = (scrollTop - lineStart) / Math.max(height - viewHeight - lineStart, 1);
          const clampedProgress = Math.min(Math.max(lineProgress, 0), 1);

          const activeIndex = clampedProgress * (points.length - 1);
          const idx = Math.floor(activeIndex);
          const nextIdx = Math.min(idx + 1, points.length - 1);
          const segmentT = activeIndex - idx;

          // Smooth segment interpolation
          const smoothT = easeInOutCubic(segmentT);

          const p1 = points[idx];
          const p2 = points[nextIdx];

          if (p1 && p2) {
              targetX = lerp(p1.x, p2.x, smoothT);
              targetY = lerp(p1.y, p2.y, smoothT);
          } else {
              targetX = width * 0.5;
              targetY = viewHeight * 0.5;
          }

          const baseRadius = lerp(10, 6, clampedProgress);
          targetRadius = baseRadius + Math.sin(time * 3) * 1.2;
      }

      // Apply smooth interpolation to blob position (prevents jumping)
      const smoothFactor = 0.08; // Lower = smoother but slower response
      const smooth = smoothBlobRef.current;
      smooth.x = lerp(smooth.x, targetX, smoothFactor);
      smooth.y = lerp(smooth.y, targetY, smoothFactor);
      smooth.radius = lerp(smooth.radius, targetRadius, smoothFactor * 1.5);

      let blobX = smooth.x;
      let blobY = smooth.y;
      let blobRadius = smooth.radius;

      // Mouse interaction with smooth response
      const mouse = mouseRef.current;
      let hoverInfluence = 0;
      if (mouse.active) {
          const dx = mouse.x - blobX;
          const dy = mouse.y - blobY;
          const dist = Math.hypot(dx, dy);
          const hoverRange = 180;
          hoverInfluence = Math.max(0, 1 - dist / hoverRange);
          if (hoverInfluence > 0) {
              const pull = hoverInfluence * 0.08;
              blobX += dx * pull;
              blobY += dy * pull;
              blobRadius += hoverInfluence * 8 + Math.sin(time * 5 + dist * 0.02) * 2 * hoverInfluence;
          }
      }

      // Draw outer glow ring
      if (blobRadius > 15) {
          const outerGlow = ctx.createRadialGradient(blobX, blobY, blobRadius * 0.8, blobX, blobY, blobRadius * 1.4);
          outerGlow.addColorStop(0, 'rgba(139, 92, 246, 0)');
          outerGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)');
          outerGlow.addColorStop(1, 'rgba(139, 92, 246, 0)');
          ctx.beginPath();
          ctx.arc(blobX, blobY, blobRadius * 1.4, 0, Math.PI * 2);
          ctx.fillStyle = outerGlow;
          ctx.fill();
      }

      // Draw The Blob with refined gradient
      const blobGrad = ctx.createRadialGradient(blobX, blobY, 0, blobX, blobY, blobRadius);
      blobGrad.addColorStop(0, 'rgba(167, 139, 250, 0.95)'); // Soft violet core
      blobGrad.addColorStop(0.3, 'rgba(139, 92, 246, 0.8)'); // Violet
      blobGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.5)'); // Indigo
      blobGrad.addColorStop(0.85, 'rgba(99, 102, 241, 0.2)');
      blobGrad.addColorStop(1, 'rgba(99, 102, 241, 0)'); // Transparent edge

      ctx.beginPath();
      ctx.arc(blobX, blobY, blobRadius, 0, Math.PI * 2);
      ctx.fillStyle = blobGrad;
      ctx.fill();

      // Hover glow effect
      if (hoverInfluence > 0) {
          ctx.beginPath();
          ctx.arc(blobX, blobY, blobRadius + 16 * hoverInfluence, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${0.12 * hoverInfluence})`;
          ctx.fill();
      }

      // Bright core highlight
      const coreSize = Math.max(blobRadius * 0.25, 3);
      ctx.beginPath();
      ctx.arc(blobX - blobRadius * 0.15, blobY - blobRadius * 0.15, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    const handleMouseMove = (event: MouseEvent) => {
        mouseRef.current = {
            x: event.clientX,
            y: event.clientY + window.scrollY,
            active: true
        };
    };
    const handleMouseLeave = () => {
        mouseRef.current.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 hidden md:block overflow-hidden">
       <canvas ref={canvasRef} />
    </div>
  );
};
