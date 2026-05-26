import React from 'react';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  isScrolled?: boolean;
}

export default function Logo({ className, isScrolled }: LogoProps) {
  const color = isScrolled ? "#0D1B3E" : "#FFFFFF";

  // Left gem outer octagon vertices (center: 75, 100)
  const leftOuter = "5,100 30,57 75,40 120,57 150,100 120,143 75,160 30,143";
  // Left gem inner table octagon (35% scale toward center)
  const leftInner = "51,100 59,85 75,79 91,85 101,100 91,115 75,121 59,115";

  // Right gem outer octagon vertices (center: 225, 100)
  const rightOuter = "150,100 180,57 225,40 270,57 295,100 270,143 225,160 180,143";
  // Right gem inner table octagon
  const rightInner = "201,100 209,85 225,79 241,85 251,100 241,115 225,121 209,115";

  return (
    <div className={cn("flex items-center", className)}>
      <svg width="65" height="36" viewBox="0 0 300 165" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-colors duration-500">
        {/* Gold diamond accent above center */}
        <polygon points="150,3 161,17 150,31 139,17" fill="#D97706" />

        {/* ── LEFT GEM ── */}
        {/* Outer boundary */}
        <polygon points={leftOuter} stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        {/* Inner table */}
        <polygon points={leftInner} stroke={color} strokeWidth="1.2" opacity="0.75" />
        {/* Full cross lines through center for facet illusion */}
        <line x1="5"   y1="100" x2="150"  y2="100" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <line x1="75"  y1="40"  x2="75"   y2="160" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <line x1="30"  y1="57"  x2="120"  y2="143" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <line x1="120" y1="57"  x2="30"   y2="143" stroke={color} strokeWidth="0.8" opacity="0.5" />
        {/* Bezel lines: outer vertex → nearest inner table vertex */}
        <line x1="5"   y1="100" x2="51"   y2="100" stroke={color} strokeWidth="1" />
        <line x1="30"  y1="57"  x2="59"   y2="85"  stroke={color} strokeWidth="1" />
        <line x1="75"  y1="40"  x2="75"   y2="79"  stroke={color} strokeWidth="1" />
        <line x1="120" y1="57"  x2="91"   y2="85"  stroke={color} strokeWidth="1" />
        <line x1="150" y1="100" x2="101"  y2="100" stroke={color} strokeWidth="1" />
        <line x1="120" y1="143" x2="91"   y2="115" stroke={color} strokeWidth="1" />
        <line x1="75"  y1="160" x2="75"   y2="121" stroke={color} strokeWidth="1" />
        <line x1="30"  y1="143" x2="59"   y2="115" stroke={color} strokeWidth="1" />

        {/* ── RIGHT GEM ── */}
        {/* Outer boundary */}
        <polygon points={rightOuter} stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        {/* Inner table */}
        <polygon points={rightInner} stroke={color} strokeWidth="1.2" opacity="0.75" />
        {/* Full cross lines through center */}
        <line x1="150" y1="100" x2="295"  y2="100" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <line x1="225" y1="40"  x2="225"  y2="160" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <line x1="180" y1="57"  x2="270"  y2="143" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <line x1="270" y1="57"  x2="180"  y2="143" stroke={color} strokeWidth="0.8" opacity="0.5" />
        {/* Bezel lines */}
        <line x1="150" y1="100" x2="201"  y2="100" stroke={color} strokeWidth="1" />
        <line x1="180" y1="57"  x2="209"  y2="85"  stroke={color} strokeWidth="1" />
        <line x1="225" y1="40"  x2="225"  y2="79"  stroke={color} strokeWidth="1" />
        <line x1="270" y1="57"  x2="241"  y2="85"  stroke={color} strokeWidth="1" />
        <line x1="295" y1="100" x2="251"  y2="100" stroke={color} strokeWidth="1" />
        <line x1="270" y1="143" x2="241"  y2="115" stroke={color} strokeWidth="1" />
        <line x1="225" y1="160" x2="225"  y2="121" stroke={color} strokeWidth="1" />
        <line x1="180" y1="143" x2="209"  y2="115" stroke={color} strokeWidth="1" />
      </svg>
    </div>
  );
}
