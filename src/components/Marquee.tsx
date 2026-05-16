import React from 'react';
import { motion } from 'motion/react';

export default function Marquee() {
  const items = [
    "Strategy first",
    "Positioning before promotion",
    "System before scale",
    "Brands people trust",
    "Brands people remember",
    "Brands people choose"
  ];

  const content = items.map((item, i) => (
    <React.Fragment key={i}>
      <span>{item}</span>
      <span className="text-blue-accent opacity-60">◆</span>
    </React.Fragment>
  ));

  return (
    <div className="bg-navy-2 h-12 flex items-center overflow-hidden border-y border-white/10 relative z-20">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-12 whitespace-nowrap text-white/80 font-mono text-[10px] uppercase tracking-[0.3em]"
      >
        <div className="flex items-center gap-12 px-6">
          {content}
          {content}
          {content}
          {content}
        </div>
      </motion.div>
    </div>
  );
}
