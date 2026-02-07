import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
}

export const MagneticCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const smoothPos = useRef({ x: -100, y: -100 });
  const trailPoints = useRef<Point[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsActive(true);

      // Add trail point
      trailPoints.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0
      });

      if (trailPoints.current.length > 40) {
        trailPoints.current.shift();
      }
    };

    const handleMouseLeave = () => {
      setIsActive(false);
      mousePos.current = { x: -100, y: -100 };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth follow
      smoothPos.current.x += (mousePos.current.x - smoothPos.current.x) * 0.15;
      smoothPos.current.y += (mousePos.current.y - smoothPos.current.y) * 0.15;

      // Age and filter trail points
      trailPoints.current = trailPoints.current
        .map(p => ({ ...p, age: p.age + 1 }))
        .filter(p => p.age < 25);

      // Draw gradient trail
      if (trailPoints.current.length > 2 && isActive) {
        ctx.beginPath();
        ctx.moveTo(trailPoints.current[0].x, trailPoints.current[0].y);

        for (let i = 1; i < trailPoints.current.length - 1; i++) {
          const p0 = trailPoints.current[i];
          const p1 = trailPoints.current[i + 1];
          const midX = (p0.x + p1.x) / 2;
          const midY = (p0.y + p1.y) / 2;
          ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
        }

        const lastPoint = trailPoints.current[trailPoints.current.length - 1];
        if (lastPoint) {
          const gradient = ctx.createLinearGradient(
            trailPoints.current[0].x,
            trailPoints.current[0].y,
            lastPoint.x,
            lastPoint.y
          );
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
          gradient.addColorStop(0.6, 'rgba(139, 92, 246, 0.4)');
          gradient.addColorStop(1, 'rgba(167, 139, 250, 0.8)');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }
      }

      // Draw cursor glow
      if (isActive) {
        const glowGradient = ctx.createRadialGradient(
          smoothPos.current.x, smoothPos.current.y, 0,
          smoothPos.current.x, smoothPos.current.y, 30
        );
        glowGradient.addColorStop(0, 'rgba(167, 139, 250, 0.4)');
        glowGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.15)');
        glowGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.beginPath();
        ctx.arc(smoothPos.current.x, smoothPos.current.y, 30, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Inner dot
        ctx.beginPath();
        ctx.arc(smoothPos.current.x, smoothPos.current.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
