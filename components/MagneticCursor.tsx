import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
}

export const MagneticCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const trailPoints = useRef<Point[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const hoveredElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const canvas = trailCanvasRef.current;
    if (!cursor || !cursorDot || !canvas) return;

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

      // Add trail point
      trailPoints.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0
      });

      // Keep trail length manageable
      if (trailPoints.current.length > 50) {
        trailPoints.current.shift();
      }

      // Check for magnetic elements
      const target = e.target as HTMLElement;
      const magneticEl = target.closest('[data-magnetic]') as HTMLElement;

      if (magneticEl) {
        hoveredElement.current = magneticEl;
        setIsHovering(true);
      } else {
        hoveredElement.current = null;
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => {
      setIsHovering(false);
      hoveredElement.current = null;
    };

    const animate = () => {
      // Smooth cursor following with spring physics
      const dx = mousePos.current.x - cursorPos.current.x;
      const dy = mousePos.current.y - cursorPos.current.y;

      velocity.current.x += dx * 0.15;
      velocity.current.y += dy * 0.15;
      velocity.current.x *= 0.75;
      velocity.current.y *= 0.75;

      cursorPos.current.x += velocity.current.x;
      cursorPos.current.y += velocity.current.y;

      // Magnetic effect on hovered elements
      if (hoveredElement.current) {
        const rect = hoveredElement.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const pullStrength = 0.3;
        const magnetX = centerX + (mousePos.current.x - centerX) * pullStrength;
        const magnetY = centerY + (mousePos.current.y - centerY) * pullStrength;

        hoveredElement.current.style.transform = `translate(${(mousePos.current.x - centerX) * 0.1}px, ${(mousePos.current.y - centerY) * 0.1}px)`;
      }

      // Update cursor position
      const scale = isPressed ? 0.8 : isHovering ? 1.5 : 1;
      cursor.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) scale(${scale})`;
      cursorDot.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;

      // Draw trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Age and filter trail points
      trailPoints.current = trailPoints.current
        .map(p => ({ ...p, age: p.age + 1 }))
        .filter(p => p.age < 30);

      // Draw gradient trail
      if (trailPoints.current.length > 2) {
        ctx.beginPath();
        ctx.moveTo(trailPoints.current[0].x, trailPoints.current[0].y);

        for (let i = 1; i < trailPoints.current.length - 1; i++) {
          const p0 = trailPoints.current[i];
          const p1 = trailPoints.current[i + 1];
          const midX = (p0.x + p1.x) / 2;
          const midY = (p0.y + p1.y) / 2;
          ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
        }

        const gradient = ctx.createLinearGradient(
          trailPoints.current[0].x,
          trailPoints.current[0].y,
          trailPoints.current[trailPoints.current.length - 1].x,
          trailPoints.current[trailPoints.current.length - 1].y
        );
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
        gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.6)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = isHovering ? 3 : 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Draw particles at trail points
      trailPoints.current.forEach((point, i) => {
        const alpha = 1 - point.age / 30;
        const size = (1 - point.age / 30) * 4;

        if (i % 3 === 0 && alpha > 0.1) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.5})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [isHovering, isPressed]);

  return (
    <>
      <canvas
        ref={trailCanvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{ mixBlendMode: 'screen' }}
      />
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background] duration-300 ease-out ${
          isHovering
            ? 'w-16 h-16 bg-violet-500/20 backdrop-blur-sm border border-violet-400/50'
            : 'w-10 h-10 bg-violet-500/10 border border-violet-400/30'
        } rounded-full mix-blend-difference`}
        style={{ willChange: 'transform' }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      <style>{`
        @media (pointer: coarse) {
          .cursor-custom { display: none; }
        }
        body { cursor: none; }
        a, button, [data-magnetic] { cursor: none; }
      `}</style>
    </>
  );
};
