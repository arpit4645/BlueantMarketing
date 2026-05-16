import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface SiteSettings {
  heroHeadline?: string;
  heroSubheadline?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  availability?: string;
  footerCopyright?: string;
}

interface SiteContextType {
  settings: SiteSettings;
  loading: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SiteSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error('Site Settings Error:', error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <SiteContext.Provider value={{ settings, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
