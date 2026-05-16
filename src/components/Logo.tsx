import React from 'react';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  isScrolled?: boolean;
}

export default function Logo({ className, isScrolled }: LogoProps) {
  const color = isScrolled ? "#0D1B3E" : "#FFFFFF";
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg width="48" height="24" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-500">
        {/* Accent dot */}
        <circle cx="50" cy="5" r="3" fill="#D97706" /> {/* Orange/Gold dot */}
        
        {/* Left Diamond Wireframe */}
        <path d="M5 25 L30 10 L55 25 L30 40 Z" stroke={color} strokeWidth="1.5" />
        <path d="M5 25 L55 25" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <path d="M30 10 L30 40" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <path d="M5 25 L30 20 L55 25" stroke={color} strokeWidth="0.5" />
        <path d="M5 25 L30 30 L55 25" stroke={color} strokeWidth="0.5" />
        
        {/* Right Diamond Wireframe */}
        <path d="M45 25 L70 10 L95 25 L70 40 Z" stroke={color} strokeWidth="1.5" />
        <path d="M45 25 L95 25" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <path d="M70 10 L70 40" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <path d="M45 25 L70 20 L95 25" stroke={color} strokeWidth="0.5" />
        <path d="M45 25 L70 30 L95 25" stroke={color} strokeWidth="0.5" />
      </svg>
    </div>
  );
}
