import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Ant {
  x: number;
  y: number;
  color: string;
  isBlue: boolean;
  phase: number;
  id: number;
  scale: number;
}

interface LoadingScreenProps {
  onEnter: () => void;
  key?: string | number;
}

export default function LoadingScreen({ onEnter }: LoadingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ripple, setRipple] = useState<{ x: number, y: number, active: boolean }>({ x: 0, y: 0, active: false });
  const antsRef = useRef<Ant[]>([]);
  const requestRef = useRef<number>(null);

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

    // Initial stars
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.7,
      size: Math.random() * 1.5,
      opacity: Math.random(),
      speed: 0.01 + Math.random() * 0.02
    }));

    // Initial ants
    const ANT_COUNT = 18;
    const blueIndex = Math.floor(Math.random() * (ANT_COUNT - 6)) + 3;
    
    antsRef.current = Array.from({ length: ANT_COUNT }, (_, i) => ({
      id: i,
      x: (canvas.width / ANT_COUNT) * i,
      y: canvas.height * 0.52,
      color: i === blueIndex ? '#4A90D9' : '#0a0a0a',
      isBlue: i === blueIndex,
      phase: Math.random() * Math.PI * 2,
      scale: i === blueIndex ? 1.8 : 1,
    }));

    const drawAnt = (ctx: CanvasRenderingContext2D, ant: Ant, time: number) => {
      const { x, y, color, phase, scale } = ant;
      const bob = Math.sin(time * 0.005 + phase) * 2;
      
      ctx.save();
      ctx.translate(x, y + bob);
      ctx.scale(scale, scale);

      // Legs animation (Tripod gait)
      const legCycle = time * 0.01 + phase;
      const drawLeg = (index: number, isRight: boolean) => {
        const offset = (index % 2 === 0 ? 0 : Math.PI);
        const angle = Math.sin(legCycle + offset) * 0.4;
        const lift = Math.max(0, Math.cos(legCycle + offset)) * 3;
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.8;
        ctx.moveTo(0, 0); // Thorax center
        
        const legX = (isRight ? 1 : -1) * (index * 2 - 2);
        const targetX = legX + Math.sin(angle) * 6;
        const targetY = 4 - lift;

        ctx.lineTo(targetX * 0.5, targetY * 0.5);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        
        // Foot dot
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(targetX, targetY, 0.5, 0, Math.PI * 2);
        ctx.fill();
      };

      // 6 Legs
      for(let i=0; i<3; i++) {
        drawLeg(i, true);
        drawLeg(i, false);
      }

      // Abdomen
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.ellipse(-6, 0, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Sheen
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.ellipse(-7, -1, 1.5, 1, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Waist (Petiole)
      ctx.beginPath();
      ctx.arc(-2, 0, 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Thorax
      ctx.beginPath();
      ctx.ellipse(0, -0.5, 2.5, 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.ellipse(3.5, -1, 2.5, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(4.5, -1.8, 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(5.2, -1.2, 0.4, 0, Math.PI * 2); ctx.fill();

      // Antennae
      const antWave = Math.sin(time * 0.008 + phase) * 0.3;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;
      ctx.moveTo(5, -2);
      ctx.quadraticCurveTo(7, -5 + antWave * 5, 9 + antWave * 2, -6);
      ctx.stroke();
      ctx.moveTo(5, -2);
      ctx.quadraticCurveTo(8, -4 - antWave * 5, 10 - antWave * 2, -4);
      ctx.stroke();

      // Blue glow
      if (ant.isBlue) {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
        gradient.addColorStop(0, 'rgba(74, 144, 217, 0.3)');
        gradient.addColorStop(1, 'rgba(74, 144, 217, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = (time: number) => {
      ctx.fillStyle = '#07091a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach(s => {
        s.opacity = 0.3 + Math.abs(Math.sin(time * s.speed)) * 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Moon
      const moonX = canvas.width * 0.85;
      const moonY = canvas.height * 0.15;
      const moonG = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 80);
      moonG.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      moonG.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
      moonG.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = moonG;
      ctx.beginPath(); ctx.arc(moonX, moonY, 80, 0, Math.PI * 2); ctx.fill();

      // Mountains (Silhouettes)
      const drawMountains = (color: string, height: number, freq: number, phase: number) => {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height - height - Math.sin(x * freq + phase) * 40 - Math.sin(x * freq * 2) * 20;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.fill();
      };
      drawMountains('#040510', 150, 0.002, 0);
      drawMountains('#050615', 100, 0.003, 1);

      // Horizon glow
      const horizonG = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height * 0.6);
      horizonG.addColorStop(0, 'rgba(74, 144, 217, 0)');
      horizonG.addColorStop(0.5, 'rgba(74, 144, 217, 0.05)');
      horizonG.addColorStop(1, 'rgba(74, 144, 217, 0)');
      ctx.fillStyle = horizonG;
      ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);

      // Grass
      ctx.strokeStyle = 'rgba(74, 144, 217, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 55; i++) {
        const gx = (canvas.width / 55) * i + Math.sin(i) * 20;
        const gy = canvas.height * 0.52 + 5;
        const gW = Math.sin(time * 0.002 + i) * 10;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.quadraticCurveTo(gx + gW * 0.5, gy - 10, gx + gW, gy - 20);
        ctx.stroke();
      }

      // Ants
      antsRef.current.forEach(ant => {
        ant.x += 1.1;
        if (ant.x > canvas.width + 50) ant.x = -50;
        drawAnt(ctx, ant, time);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      antsRef.current.forEach(ant => {
        if (ant.isBlue) {
          const dx = clickX - ant.x;
          const dy = clickY - ant.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 30) {
            setRipple({ x: clickX, y: clickY, active: true });
            setTimeout(onEnter, 800);
          }
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      let hoverBlue = false;
      antsRef.current.forEach(ant => {
        if (ant.isBlue) {
          const dx = mx - ant.x;
          const dy = my - ant.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 30) hoverBlue = true;
        }
      });
      canvas.style.cursor = hoverBlue ? 'pointer' : 'default';
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if(requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [onEnter]);

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden bg-[#07091a]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      <AnimatePresence>
        {!ripple.active && (
          <motion.button
            type="button"
            onClick={onEnter}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 font-mono text-[11px] uppercase tracking-widest transition-colors hover:text-white focus:outline-none focus:text-white"
          >
            Find the blue ant - click here to enter
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ripple.active && (
          <>
            {/* Brand text overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-[110] pointer-events-none">
              <motion.div
                initial={{ opacity: 0, letterSpacing: '2em', scale: 1.1 }}
                animate={{ opacity: 1, letterSpacing: '0.4em', scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1, duration: 1.2, ease: "easeOut" }}
                className="text-white text-3xl md:text-5xl font-bold uppercase"
              >
                BlueAnt
              </motion.div>
            </div>

            {/* Ripple expander */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 50, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeIn" }}
              style={{ 
                left: ripple.x, 
                top: ripple.y,
                background: 'radial-gradient(circle, #0D1B3E 0%, #0D1B3E 100%)'
              }}
              className="absolute w-20 h-20 -ml-10 -mt-10 rounded-full z-[100]"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
