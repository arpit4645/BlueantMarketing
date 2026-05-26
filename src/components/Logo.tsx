import React from 'react';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  isScrolled?: boolean;
}

export default function Logo({ className, isScrolled }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/logo.png"
        alt="BlueAnt Logo"
        className={cn(
          "h-16 w-auto transition-all duration-500",
          isScrolled && "brightness-0"
        )}
      />
    </div>
  );
}
