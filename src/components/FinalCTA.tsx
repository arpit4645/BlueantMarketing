import React from 'react';
import { motion } from 'motion/react';
import { useSite } from '../lib/siteContext';
import SafeImage from './SafeImage';

export default function FinalCTA() {
  const { settings } = useSite();

  const finalCtaHeadline = settings.finalCtaHeadline || "READY TO WIN?";
  const finalCtaSub = settings.finalCtaSub || "Stop competing on price. Start owning your category. Let's engineer your growth architecture.";
  const finalCtaButton = settings.finalCtaButton || "Book a strategy call →";

  return (
    <section className="py-24 md:py-28 lg:py-32 px-5 md:px-6 bg-navy relative overflow-hidden">
       {/* Cinematic Background */}
       <div className="absolute inset-0 z-0">
        <SafeImage 
          initial={{ scale: 1.2, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1600880210839-2f6733235b30?w=1600&q=80&auto=format&fit=crop" 
          alt="Strategic Partnership"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy opacity-40" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-blue-accent text-[11px] uppercase tracking-[0.5em] mb-10 block">Final Step // Transform</span>
          <h2 className="text-6xl md:text-8xl lg:text-9xl leading-[0.82] text-white font-black mb-16 uppercase tracking-tighter">
            {finalCtaHeadline.includes('?') ? (
               <>
                 {finalCtaHeadline.split('?')[0]} <br/>
                 <span className="heading-italic italic text-white/50 font-black">{finalCtaHeadline.split('?')[1] || '?'}</span>
               </>
            ) : finalCtaHeadline}
          </h2>
          <p className="text-white/90 text-xl lg:text-2xl mb-16 max-w-2xl mx-auto italic leading-relaxed">
            {finalCtaSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="bg-white text-navy px-12 py-6 font-black uppercase tracking-widest hover:bg-blue-accent hover:text-white hover:-translate-y-2 transition-all duration-500 shadow-2xl btn-geometric">
              {finalCtaButton}
            </button>
            <button className="text-white font-black uppercase tracking-widest hover:text-blue-accent transition-colors flex items-center gap-4 group">
              <span className="w-12 h-[1px] bg-white/40 group-hover:w-16 group-hover:bg-blue-accent transition-all" />
              Build your system
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Corner Details */}
      <div className="absolute bottom-0 left-0 p-12 opacity-40 hidden lg:block">
         <span className="font-mono text-[10px] text-white tracking-[0.4em] uppercase">BlueAnt Strategy // 2024</span>
      </div>
    </section>
  );
}
