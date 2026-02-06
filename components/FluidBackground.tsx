import React, { useEffect, useRef } from 'react';

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  phase: number;
}

export const FluidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, active: false });
  const blobsRef = useRef<Blob[]>([]);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;
    let animationId: number;

    const colors = [
      'rgba(139, 92, 246, 0.4)',   // Violet
      'rgba(99, 102, 241, 0.35)',   // Indigo
      'rgba(168, 85, 247, 0.3)',    // Purple
      'rgba(59, 130, 246, 0.25)',   // Blue
      'rgba(147, 51, 234, 0.3)',    // Purple darker
    ];

    const initBlobs = () => {
      blobsRef.current = [];
      const numBlobs = 5;

      for (let i = 0; i < numBlobs; i++) {
        blobsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 150 + Math.random() * 200,
          baseRadius: 150 + Math.random() * 200,
          color: colors[i % colors.length],
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = document.documentElement.scrollHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (blobsRef.current.length === 0) {
        initBlobs();
      }
    };

    const drawMetaball = (blob: Blob, mouseInfluence: { x: number; y: number; strength: number }) => {
      const { x, y, radius, color, phase } = blob;

      // Organic shape using multiple overlapping circles
      const numCircles = 6;
      const points: { x: number; y: number; r: number }[] = [];

      for (let i = 0; i < numCircles; i++) {
        const angle = (i / numCircles) * Math.PI * 2 + phase + time * 0.3;
        const wobble = Math.sin(time * 2 + i) * 20;
        const distFromCenter = radius * 0.3 + wobble;

        points.push({
          x: x + Math.cos(angle) * distFromCenter,
          y: y + Math.sin(angle) * distFromCenter,
          r: radius * 0.6 + Math.sin(time + i * 0.5) * 20
        });
      }

      // Draw main blob
      ctx.beginPath();

      // Use bezier curves to create smooth organic shape
      const firstPoint = points[0];
      ctx.moveTo(firstPoint.x + firstPoint.r, firstPoint.y);

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        ctx.quadraticCurveTo(
          p1.x + Math.cos(time + i) * p1.r * 0.5,
          p1.y + Math.sin(time + i) * p1.r * 0.5,
          midX,
          midY
        );
      }

      ctx.closePath();

      // Gradient fill
      const gradient = ctx.createRadialGradient(
        x + mouseInfluence.x * 0.3,
        y + mouseInfluence.y * 0.3,
        0,
        x,
        y,
        radius * 1.5
      );

      const baseColor = color.replace(/[\d.]+\)$/, '');
      gradient.addColorStop(0, baseColor + '0.6)');
      gradient.addColorStop(0.5, baseColor + '0.3)');
      gradient.addColorStop(1, baseColor + '0)');

      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const mouse = mouseRef.current;

      // Update and draw blobs
      blobsRef.current.forEach((blob, i) => {
        // Autonomous movement
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce off edges with padding
        const padding = blob.radius;
        if (blob.x < padding || blob.x > width - padding) blob.vx *= -1;
        if (blob.y < padding || blob.y > height - padding) blob.vy *= -1;

        // Keep in bounds
        blob.x = Math.max(padding, Math.min(width - padding, blob.x));
        blob.y = Math.max(padding, Math.min(height - padding, blob.y));

        // Mouse attraction/repulsion
        let mouseInfluence = { x: 0, y: 0, strength: 0 };

        if (mouse.active) {
          const mouseWorldY = mouse.y + scrollY;
          const dx = mouse.x - blob.x;
          const dy = mouseWorldY - blob.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 400;

          if (dist < maxDist) {
            const strength = 1 - dist / maxDist;
            mouseInfluence = { x: dx * strength, y: dy * strength, strength };

            // Attract blob toward mouse
            blob.vx += (dx / dist) * strength * 0.15;
            blob.vy += (dy / dist) * strength * 0.15;

            // Expand radius when mouse is near
            blob.radius = blob.baseRadius + strength * 80;
          } else {
            blob.radius += (blob.baseRadius - blob.radius) * 0.05;
          }
        } else {
          blob.radius += (blob.baseRadius - blob.radius) * 0.05;
        }

        // Apply friction
        blob.vx *= 0.98;
        blob.vy *= 0.98;

        // Add slight random movement
        blob.vx += (Math.random() - 0.5) * 0.02;
        blob.vy += (Math.random() - 0.5) * 0.02;

        // Limit velocity
        const maxVel = 2;
        const vel = Math.hypot(blob.vx, blob.vy);
        if (vel > maxVel) {
          blob.vx = (blob.vx / vel) * maxVel;
          blob.vy = (blob.vy / vel) * maxVel;
        }

        // Only draw if blob is near viewport
        if (blob.y > scrollY - blob.radius * 2 && blob.y < scrollY + viewportHeight + blob.radius * 2) {
          drawMetaball(blob, mouseInfluence);
        }
      });

      // Draw connecting lines between close blobs
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 1;

      for (let i = 0; i < blobsRef.current.length; i++) {
        for (let j = i + 1; j < blobsRef.current.length; j++) {
          const b1 = blobsRef.current[i];
          const b2 = blobsRef.current[j];
          const dist = Math.hypot(b1.x - b2.x, b1.y - b2.y);
          const maxDist = 400;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(b1.x, b1.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.stroke();
          }
        }
      }

      // Draw mouse interaction ripple
      if (mouse.active) {
        const mouseWorldY = mouse.y + scrollY;
        const rippleRadius = 100 + Math.sin(time * 4) * 20;

        const rippleGradient = ctx.createRadialGradient(
          mouse.x, mouseWorldY, 0,
          mouse.x, mouseWorldY, rippleRadius
        );
        rippleGradient.addColorStop(0, 'rgba(167, 139, 250, 0.15)');
        rippleGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)');
        rippleGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.beginPath();
        ctx.arc(mouse.x, mouseWorldY, rippleRadius, 0, Math.PI * 2);
        ctx.fillStyle = rippleGradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    // Observe body height changes
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.body);

    resize();
    draw();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full pointer-events-none"
      style={{
        zIndex: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        filter: 'blur(40px)',
      }}
    />
  );
};
