import Magnetic from './Magnetic';
import Logo from './Logo';
import { useSite } from '../lib/siteContext';

export default function Footer() {
  const { settings } = useSite();
  return (
    <footer className="bg-navy pt-24 pb-12 px-6 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 flex flex-col gap-6">
           <div className="flex items-center gap-6">
             <Logo className="scale-150 origin-left" />
           </div>
           <h2 className="text-[15vw] leading-[0.8] font-bold uppercase tracking-tighter transition-all duration-700 hover:text-blue-accent opacity-90">
            BlueAnt
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 md:mb-16">
          <div>
            <h4 className="font-mono text-[10px] uppercase text-white/60 tracking-[0.22em] mb-6">BlueAnt</h4>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              Strategy-led brand building for high-growth businesses. We help companies think strategically, position powerfully, and grow predictably.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase text-white/60 tracking-[0.22em] mb-6">Navigate</h4>
            <ul className="space-y-4">
              {['Approach', 'Frameworks', 'Services', 'Work', 'About'].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-sm font-bold text-white/80 hover:text-blue-accent transition-colors uppercase">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <h4 className="font-mono text-[10px] uppercase text-white/60 tracking-[0.22em] mb-6">Contact</h4>
             <div className="space-y-4">
               <a href={`mailto:${settings.contactEmail || 'hello@blueant.in'}`} className="text-white font-bold hover:text-blue-accent block transition-colors tracking-tight">{settings.contactEmail || 'hello@blueant.in'}</a>
               <a href={`tel:${settings.contactPhone?.replace(/\s/g, '') || '+919999000000'}`} className="text-white font-bold block transition-colors font-mono">{settings.contactPhone || '+91 99990 00000'}</a>
               <p className="text-white/60 text-[11px] font-mono uppercase tracking-widest mt-4">Bengaluru // India</p>
             </div>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase text-white/60 tracking-[0.22em] mb-6">Follow</h4>
            <ul className="space-y-4">
              {[
                { name: 'Instagram', url: settings.socialLinks?.instagram },
                { name: 'LinkedIn', url: settings.socialLinks?.linkedin },
                { name: 'X / Twitter', url: settings.socialLinks?.twitter }
              ].map(social => (
                <li key={social.name}>
                  <a href={social.url || '#'} className="text-sm font-bold text-white/80 hover:text-white transition-colors uppercase">{social.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
            {settings.footerCopyright || `© ${new Date().getFullYear()} BlueAnt Brand Systems · Strategy · Brand · Growth`}
          </p>
          <div className="flex items-center gap-1">
             <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Made with intention</span>
             <div className="w-1.5 h-1.5 bg-blue-accent rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
