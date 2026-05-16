import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneCall } from 'lucide-react';
import Magnetic from './Magnetic';

export default function StickyCta() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ opacity: 0, scale: 0.5, y: 100 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.5, y: 100 }}
           className="fixed bottom-6 right-6 z-[999] md:bottom-10 md:right-10"
        >
          <Magnetic strength={0.3}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToContact}
              className="group relative flex items-center gap-3 bg-blue-accent text-white px-6 py-4 rounded-full shadow-[0_15px_35px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(59,130,246,0.7)] overflow-hidden"
            >
              {/* Animated Background Pulse */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="absolute -inset-x-20 -inset-y-4 bg-white/20 skew-x-[35deg] -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              <div className="bg-navy rounded-full p-2 relative z-10">
                <PhoneCall size={18} className="text-white" />
              </div>
              
              <span className="font-bold uppercase tracking-[0.1em] text-sm relative z-10 pr-2">
                Book a call
              </span>

              {/* Status Indicator */}
              <div className="absolute top-2 right-2 flex gap-1 items-center">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                </span>
              </div>
            </motion.button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
