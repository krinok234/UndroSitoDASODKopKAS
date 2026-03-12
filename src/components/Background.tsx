import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import logo from '../assets/logo.png';

interface BackgroundProps {
  children: React.ReactNode;
}

export const Background: React.FC<BackgroundProps> = ({ children }) => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      
      // Вычисляем смещение от центра экрана
      const x = (e.clientX - window.innerWidth / 2) / 100; // Еще сильнее замедлил движение
      const y = (e.clientY - window.innerHeight / 2) / 100;

      // Используем CSS переменные для смещения, чтобы не переписывать transform целиком
      bgRef.current.style.setProperty('--move-x', `${x}px`);
      bgRef.current.style.setProperty('--move-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen text-glam-text overflow-hidden font-sans selection:bg-glam-primary selection:text-white">
      {/* Solid Background Layer */}
      <div className="fixed inset-0 bg-glam-bg -z-20" />

      {/* Background Pattern - Optimized */}
      <div 
        ref={bgRef}
        className="fixed top-1/2 left-1/2 w-[250vmax] h-[250vmax] pointer-events-none grid grid-cols-[repeat(40,1fr)] place-items-center content-center justify-center gap-x-12 gap-y-24 -z-10 overflow-hidden transform-gpu will-change-transform transition-transform duration-300 ease-out"
        style={{
          // Базовая трансформация + смещение из переменных (по умолчанию 0px)
          transform: 'translate(calc(-50% + var(--move-x, 0px)), calc(-50% + var(--move-y, 0px))) rotate(45deg)',
        }}
      >
        {Array.from({ length: 1600 }).map((_, i) => (
          <img 
            key={i} 
            src={logo}
            alt=""
            loading="lazy"
            className="w-16 h-16 object-contain opacity-15 -rotate-12 rounded-lg"
          />
        ))}
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
