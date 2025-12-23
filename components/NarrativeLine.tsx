import React, { useEffect, useRef } from 'react';

interface NarrativeLineProps {
  scrollProgress: number;
}

export const NarrativeLine: React.FC<NarrativeLineProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
    const POINTS_COUNT = 40; 
    const points: { x: number, y: number, baseX: number }[] = [];

    const initPoints = () => {
        points.length = 0;
        // The line starts lower now, to allow the "Header Blob" to merge into it
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
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = document.body.scrollHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      
      ctx.scale(dpr, dpr);
      initPoints();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      const scrollTop = window.scrollY;
      const viewHeight = window.innerHeight;
      
      // --- 1. THE LINE (Sea-grass simulation) ---
      
      // Physics Update
      points.forEach((p, i) => {
          // Bottom points move more
          const intensity = i / POINTS_COUNT; 
          const wave1 = Math.sin(time + i * 0.15) * 8 * intensity;
          const wave2 = Math.cos(time * 0.7 + i * 0.1) * 15 * intensity;
          p.x = p.baseX + wave1 + wave2;
      });

      // Draw Line
      ctx.beginPath();
      // Start slightly off-screen top if needed, or at the first point
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

      // Line Style
      const gradient = ctx.createLinearGradient(0, viewHeight * 0.5, 0, height);
      gradient.addColorStop(0, 'rgba(167, 139, 250, 0)'); // Purple-ish transparent start
      gradient.addColorStop(0.1, 'rgba(147, 197, 253, 0.4)'); // Blue
      gradient.addColorStop(0.5, 'rgba(167, 139, 250, 0.4)'); // Purple
      gradient.addColorStop(1, 'rgba(147, 197, 253, 0)'); // Blue fade out
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // --- 2. THE MORPHING BLOB (The "Cursor") ---
      
      // Logic:
      // When scroll is 0, blob is HUGE and centered in the header area.
      // As we scroll to viewHeight * 0.5, it shrinks and moves to points[0].
      // After that, it follows the curve.

      const headerZone = viewHeight * 0.4;
      let blobX, blobY, blobRadius, blobAlpha;

      if (scrollTop < headerZone) {
          // PHASE 1: Header Animation
          const t = scrollTop / headerZone; // 0 to 1
          
          // Position: Center Screen -> Line Start
          const startX = width * 0.5; // Always center screen initially
          const startY = viewHeight * 0.3; // Behind title
          
          const endX = points[0].x;
          const endY = points[0].y;

          // Ease out cubic
          const ease = 1 - Math.pow(1 - t, 3);

          blobX = startX + (endX - startX) * ease;
          blobY = startY + (endY - startY) * ease + scrollTop; // +scrollTop to keep it fixed relative to viewport during scroll

          // Radius: Giant -> Tiny
          // INCREASED SIZE FROM 150 to 280 for more amorphous impact
          blobRadius = 280 - (272 * ease); // 280px -> 8px
          
          // Pulse effect (stronger when big)
          // Add extra waviness to x/y when big
          const pulse = Math.sin(time * 2) * (15 * (1-ease));
          blobRadius += pulse;
          
          // Make it wobble when big
          if(t < 0.5) {
             blobX += Math.sin(time * 1.5) * 20 * (1-ease);
             blobY += Math.cos(time * 1.2) * 20 * (1-ease);
          }

      } else {
          // PHASE 2: Line Following
          const lineProgress = (scrollTop - headerZone) / (height - viewHeight - headerZone);
          const clampedProgress = Math.min(Math.max(lineProgress, 0), 1);
          
          const activeIndex = clampedProgress * (points.length - 1);
          const idx = Math.floor(activeIndex);
          const nextIdx = Math.min(idx + 1, points.length - 1);
          const t = activeIndex - idx;

          const p1 = points[idx];
          const p2 = points[nextIdx];
          
          blobX = p1.x + (p2.x - p1.x) * t;
          blobY = p1.y + (p2.y - p1.y) * t;
          blobRadius = 8 + Math.sin(time * 5) * 1.5;
      }

      // Draw The Blob
      const blobGrad = ctx.createRadialGradient(blobX, blobY, blobRadius * 0.2, blobX, blobY, blobRadius);
      blobGrad.addColorStop(0, 'rgba(192, 132, 252, 0.9)'); // Bright Purple core
      blobGrad.addColorStop(0.6, 'rgba(96, 165, 250, 0.5)'); // Blue mid
      blobGrad.addColorStop(1, 'rgba(96, 165, 250, 0)'); // Transparent edge

      ctx.beginPath();
      ctx.arc(blobX, blobY, blobRadius, 0, Math.PI * 2);
      ctx.fillStyle = blobGrad;
      ctx.fill();

      // Core of blob
      ctx.beginPath();
      ctx.arc(blobX, blobY, blobRadius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.6;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      animationId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 hidden md:block overflow-hidden">
       <canvas ref={canvasRef} />
    </div>
  );
};