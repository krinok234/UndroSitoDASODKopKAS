import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  life: number;
  color: string;
}

export const CursorParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const colors = ['#D8B4FE', '#9333EA', '#F3E8FF', '#FFFFFF'];

    const createParticle = (x: number, y: number) => {
      particlesRef.current.push({
        x,
        y,
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 1 + 0.5, // Падение вниз
        life: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Создаем частицы при движении мыши
      const dx = mouseRef.current.x - lastMouseRef.current.x;
      const dy = mouseRef.current.y - lastMouseRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 2) {
        for (let i = 0; i < 2; i++) { // Количество частиц
             createParticle(
                 mouseRef.current.x + (Math.random() - 0.5) * 10, 
                 mouseRef.current.y + (Math.random() - 0.5) * 10
             );
        }
      }
      lastMouseRef.current = { ...mouseRef.current };

      // Обновляем и рисуем частицы
      particlesRef.current.forEach((p, index) => {
        p.y += p.speedY; // Падение
        p.life -= 0.02;  // Исчезновение
        p.size *= 0.95;  // Уменьшение

        if (p.life <= 0 || p.size < 0.2) {
          particlesRef.current.splice(index, 1);
        } else {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[100]" 
    />
  );
};
