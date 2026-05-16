import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import Magnetic from './Magnetic';
import Logo from './Logo';
import { useSite } from '../lib/siteContext';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ*&^%$#@!";

interface GlitchLetterProps {
  char: string;
  italic?: boolean;
  key?: string | number;
}

const GlitchLetter = ({ char, italic }: GlitchLetterProps) => {
  const [displayChar, setDisplayChar] = useState(char);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Ambient blink
    const blinkInterval = setInterval(() => {
      if (Math.random() < 0.05) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleHover = () => {
    setIsHovered(true);
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayChar(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
      iterations++;
      if (iterations >= 6) {
        clearInterval(interval);
        setDisplayChar(char);
        setIsHovered(false);
      }
    }, 70);
  };

  return (
    <span 
      onMouseEnter={handleHover}
      className={cn(
        "relative transition-all duration-300 inline-block",
        italic ? "italic text-white/60" : "text-white",
        isBlinking && "opacity-0",
        isHovered && "text-blue-accent"
      )}
    >
      {displayChar}
      {isHovered && (
        <>
          <span className="absolute inset-0 text-red-500 translate-x-[-2px] opacity-70 pointer-events-none">{displayChar}</span>
          <span className="absolute inset-0 text-blue-500 translate-x-[2px] opacity-70 pointer-events-none">{displayChar}</span>
        </>
      )}
    </span>
  );
};

const HeadlineLine = ({ text, delay, italicWords = [] }: { text: string, delay: number, italicWords?: string[], key?: React.Key }) => {
  const words = text.split(" ");
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap gap-x-[0.4em] gap-y-0"
      >
        {words.map((word, wi) => (
          <div key={wi} className="flex whitespace-nowrap">
            {word.split("").map((char, ci) => (
              <GlitchLetter 
                key={ci} 
                char={char} 
                italic={italicWords.includes(word.toLowerCase().replace(/[.,]/g, ''))} 
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function Hero() {
  const [isHovering, setIsHovering] = useState(false);
  const { settings } = useSite();

  const heroHeadline = settings.heroHeadline || "WE DON'T DO\nMARKETING.\nWE BUILD BRANDS\nTHAT DOMINATE.";
  const displayLines = heroHeadline.split('\n');

  const heroSub = settings.heroSubheadline || "From confusion to clarity. Strategy-led brands that attract, convert, and scale — predictably.";

  return (
    <section 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-navy pt-20 border-l-[5px] border-white/20"
    >
      {/* Scanline Overlay */}
      <motion.div 
        animate={{ opacity: isHovering ? 0.05 : 0 }}
        className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"
      />

      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: isHovering ? 1.05 : 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full"
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-50 grayscale-0 brightness-110 transition-all duration-1000"
            poster="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=1600&q=80&auto=format&fit=crop"
          >
            <source src={settings.heroVideoUrl || "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-and-flow-of-data-digital-background-27083-large.mp4"} type="video/mp4" />
          </video>
        </motion.div>
        <div className="absolute inset-0 bg-navy/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 lg:px-14 w-full">
        <div className="flex justify-between items-start mb-8 md:mb-10">
          <div className="max-w-4xl">
            <div className="mb-6 md:mb-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-medium text-blue-accent">// Strategy-Led Brand Building</span>
            </div>
          </div>
          <div className="hidden lg:block opacity-20 hover:opacity-50 transition-opacity duration-1000">
            <Logo className="scale-[2.5]" />
          </div>
        </div>
        
        <div className="max-w-4xl">
          <h1 className="text-clamp-hero text-white">
            {displayLines.map((line, i) => (
              <HeadlineLine 
                key={i} 
                text={line} 
                delay={0.2 + (i * 0.1)} 
                italicWords={["marketing", "dominate", "marketing.", "dominate."]} 
              />
            ))}
          </h1>

          <div className="mt-8 md:mt-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="max-w-lg border-l-[3px] border-white/20 pl-6">
              <p className="text-white/90 text-lg leading-relaxed font-medium">
                {heroSub}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Magnetic strength={0.15}>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-navy btn-geometric flex items-center gap-3 cursor-pointer shadow-xl hover:shadow-2xl transition-all"
                  aria-label="Start your project"
                >
                  Build my brand strategy <span className="text-lg">→</span>
                </button>
              </Magnetic>
              <Magnetic strength={0.1}>
                <button 
                  onClick={() => document.getElementById('approach')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-white/30 text-white btn-geometric cursor-pointer hover:bg-white/5 transition-all"
                  aria-label="View our process"
                >
                  Our Process
                </button>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-14 md:mt-16 lg:mt-20 pt-8 md:pt-10 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {[
            { label: "Brands Transformed", val: "120+" },
            { label: "Strategy Practice", val: "7yrs" },
            { label: "Proprietary Frameworks", val: "2" },
            { label: "Ads Before Positioning", val: "0" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">{stat.label}</span>
              <span className="text-3xl font-black text-white">{stat.val}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
