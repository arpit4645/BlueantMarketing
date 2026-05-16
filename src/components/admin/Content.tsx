import React, { useState } from 'react';
import { Briefcase, Layers, FileText, Quote, Target } from 'lucide-react';
import { cn } from '../../lib/utils';
import ProjectsManager from './ProjectsManager';
import ServicesManager from './ServicesManager';
import BlogsManager from './BlogsManager';
import TestimonialsManager from './TestimonialsManager';
import ResultsManager from './ResultsManager';

type Tab = 'projects' | 'services' | 'blogs' | 'testimonials' | 'results';

export default function Content() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'projects', label: 'Portfolio', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'blogs', label: 'Blog', icon: FileText },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'results', label: 'Results', icon: Target },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap gap-4 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all",
              activeTab === tab.id 
                ? "bg-navy text-white shadow-xl translate-y-[-2px]" 
                : "bg-white text-navy/40 hover:bg-white/80 border border-navy/5"
            )}
          >
            <tab.icon size={14} className={activeTab === tab.id ? "text-blue-accent" : "text-navy/20"} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="transition-all duration-500">
        {activeTab === 'projects' && <ProjectsManager />}
        {activeTab === 'services' && <ServicesManager />}
        {activeTab === 'blogs' && <BlogsManager />}
        {activeTab === 'testimonials' && <TestimonialsManager />}
        {activeTab === 'results' && <ResultsManager />}
      </div>
    </div>
  );
}
