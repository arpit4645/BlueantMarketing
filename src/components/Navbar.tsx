import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { Menu, X } from 'lucide-react';
import Magnetic from './Magnetic';
import Logo from './Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Approach', href: '/#approach' },
    { name: 'Services', href: '/#services' },
    { name: 'Work', href: '/#work' },
    { name: 'Intelligence', href: '/blog' },
    { name: 'About', href: '/#about' },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      if (location.pathname === '/') {
        e.preventDefault();
        const id = href.replace('/#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
      closeMobileMenu();
    } else {
      closeMobileMenu();
    }
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 px-6 md:px-12",
        isScrolled ? "glass-nav py-4" : "bg-transparent"
      )}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-4 group" 
        >
          <Link to="/" className="flex items-center gap-4" aria-label="BlueAnt Home">
            <Logo isScrolled={isScrolled} className="scale-75 md:scale-90" />
            <span className={cn(
              "text-xl font-bold uppercase tracking-[0.2em] transition-colors duration-500",
              isScrolled ? "text-navy" : "text-white"
            )}>
              BlueAnt
            </span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <div className={cn(
            "flex gap-8 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-500",
            isScrolled ? "text-muted" : "text-white/80"
          )}>
            {navLinks.map((link) => (
              <motion.div key={link.name} whileTap={{ scale: 0.95 }}>
                <Link 
                  to={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={cn(
                    "transition-colors",
                    isScrolled ? "hover:text-navy" : "hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
          <Magnetic strength={0.2}>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (location.pathname === '/') {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/#contact';
                }
              }}
              className={cn(
                "px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg",
                isScrolled ? "bg-navy text-white hover:bg-blue-accent" : "bg-white text-navy hover:bg-blue-accent hover:text-white"
              )}
            >
              Book a call
            </motion.button>
          </Magnetic>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 text-white transition-colors hover:text-blue-accent"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} className={cn(isScrolled && "text-navy")} />}
        </motion.button>

        {/* Mobile menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 w-full h-screen bg-navy z-[60] flex flex-col p-12 text-white md:hidden"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-3">
                  <Logo />
                  <span className="text-xl font-bold uppercase tracking-[0.2em] text-white">
                    BlueAnt
                  </span>
                </div>
                <button onClick={closeMobileMenu}>
                  <X size={32} />
                </button>
              </div>

              <div className="flex flex-col gap-8 flex-1">
                {navLinks.map((link, i) => (
                   <motion.div
                     key={link.name}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     whileTap={{ scale: 0.95, x: 10 }}
                     transition={{ delay: i * 0.1 }}
                   >
                    <Link
                      to={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-4xl font-black uppercase tracking-tighter hover:text-blue-accent hover:italic transition-all"
                    >
                      {link.name}
                    </Link>
                   </motion.div>
                ))}
              </div>

              <div className="pt-12 border-t border-white/10 mt-auto">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    closeMobileMenu();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-blue-accent text-white py-6 font-black uppercase tracking-widest text-lg"
                >
                  Book a strategic call
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
