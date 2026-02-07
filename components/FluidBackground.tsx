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
  pulseSpeed: number;
}

export const FluidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, active: false });
  const blobsRef = useRef<Blob[]>([]);

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
      'rgba(139, 92, 246, 0.5)',   // Violet - more visible
      'rgba(99, 102, 241, 0.45)',   // Indigo
      'rgba(168, 85, 247, 0.4)',    // Purple
      'rgba(79, 70, 229, 0.35)',    // Indigo darker
      'rgba(124, 58, 237, 0.4)',    // Violet darker
      'rgba(67, 56, 202, 0.35)',    // Indigo deep
    ];

    const initBlobs = () => {
      blobsRef.current = [];
      const numBlobs = 6;

      for (let i = 0; i < numBlobs; i++) {
        blobsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: 180 + Math.random() * 250,
          baseRadius: 180 + Math.random() * 250,
          color: colors[i % colors.length],
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.5 + Math.random() * 0.5
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
      const { x, y, radius, color, phase, pulseSpeed } = blob;

      // Pulsing effect
      const pulse = Math.sin(time * pulseSpeed) * 0.15 + 1;
      const currentRadius = radius * pulse;

      // Gradient fill - simple but effective
      const gradient = ctx.createRadialGradient(
        x + mouseInfluence.x * 0.2,
        y + mouseInfluence.y * 0.2,
        0,
        x,
        y,
        currentRadius
      );

      const baseColor = color.replace(/[\d.]+\)$/, '');
      gradient.addColorStop(0, baseColor + '0.7)');
      gradient.addColorStop(0.4, baseColor + '0.4)');
      gradient.addColorStop(0.7, baseColor + '0.15)');
      gradient.addColorStop(1, baseColor + '0)');

      ctx.beginPath();
      ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add a brighter core when mouse is near
      if (mouseInfluence.strength > 0.3) {
        const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, currentRadius * 0.4);
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${mouseInfluence.strength * 0.15})`);
        coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.beginPath();
        ctx.arc(x, y, currentRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const mouse = mouseRef.current;

      // Update and draw blobs
      blobsRef.current.forEach((blob) => {
        // Gentle autonomous movement
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Soft bounce off edges
        const padding = blob.radius * 0.5;
        if (blob.x < padding) { blob.x = padding; blob.vx = Math.abs(blob.vx) * 0.8; }
        if (blob.x > width - padding) { blob.x = width - padding; blob.vx = -Math.abs(blob.vx) * 0.8; }
        if (blob.y < padding) { blob.y = padding; blob.vy = Math.abs(blob.vy) * 0.8; }
        if (blob.y > height - padding) { blob.y = height - padding; blob.vy = -Math.abs(blob.vy) * 0.8; }

        // Mouse attraction
        let mouseInfluence = { x: 0, y: 0, strength: 0 };

        if (mouse.active) {
          const mouseWorldY = mouse.y + scrollY;
          const dx = mouse.x - blob.x;
          const dy = mouseWorldY - blob.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 500;

          if (dist < maxDist) {
            const strength = Math.pow(1 - dist / maxDist, 2); // Quadratic falloff for smoother feel
            mouseInfluence = { x: dx * strength, y: dy * strength, strength };

            // Attract blob toward mouse
            blob.vx += (dx / dist) * strength * 0.25;
            blob.vy += (dy / dist) * strength * 0.25;

            // Expand radius when mouse is near
            blob.radius = blob.baseRadius + strength * 100;
          } else {
            blob.radius += (blob.baseRadius - blob.radius) * 0.03;
          }
        } else {
          blob.radius += (blob.baseRadius - blob.radius) * 0.03;
        }

        // Apply friction
        blob.vx *= 0.97;
        blob.vy *= 0.97;

        // Add organic drift
        blob.vx += Math.sin(time + blob.phase) * 0.03;
        blob.vy += Math.cos(time * 0.7 + blob.phase) * 0.03;

        // Limit velocity
        const maxVel = 2.5;
        const vel = Math.hypot(blob.vx, blob.vy);
        if (vel > maxVel) {
          blob.vx = (blob.vx / vel) * maxVel;
          blob.vy = (blob.vy / vel) * maxVel;
        }

        // Only draw if blob is near viewport (with generous margin)
        if (blob.y > scrollY - blob.radius * 3 && blob.y < scrollY + viewportHeight + blob.radius * 3) {
          drawMetaball(blob, mouseInfluence);
        }
      });

      // Draw mouse glow when active
      if (mouse.active) {
        const mouseWorldY = mouse.y + scrollY;
        const glowRadius = 150 + Math.sin(time * 3) * 30;

        const glowGradient = ctx.createRadialGradient(
          mouse.x, mouseWorldY, 0,
          mouse.x, mouseWorldY, glowRadius
        );
        glowGradient.addColorStop(0, 'rgba(167, 139, 250, 0.12)');
        glowGradient.addColorStop(0.4, 'rgba(139, 92, 246, 0.06)');
        glowGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.beginPath();
        ctx.arc(mouse.x, mouseWorldY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
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
      // Scroll position is read directly in draw() via window.scrollY
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
      className="pointer-events-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 0,
        filter: 'blur(40px)',
      }}
    />
  );
};
