import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Globe, MessageSquare, Shield, Mail, Phone, Instagram, Linkedin, Twitter, Layout, Target, Zap, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

type SettingsTab = 'general' | 'about' | 'mission' | 'contact';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settings, setSettings] = useState<any>({
    heroHeadline: '',
    heroSubheadline: '',
    heroVideoUrl: '',
    aboutQuote: '',
    aboutText: '',
    aboutCombines: [],
    problemHeadline: '',
    problemSub: '',
    problemPills: [],
    problemSmallPills: [],
    strategyHeadline: '',
    visionStatement: '',
    missionStatement: '',
    finalCtaHeadline: '',
    finalCtaSub: '',
    finalCtaButton: '',
    contactEmail: '',
    contactPhone: '',
    socialLinks: {
      instagram: '',
      linkedin: '',
      twitter: ''
    },
    availability: '',
    footerCopyright: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({
            ...settings,
            ...docSnap.data()
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      toast.success('Site architecture updated');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/global');
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const addListItem = (field: string) => {
    setSettings({
      ...settings,
      [field]: [...(settings[field] || []), '']
    });
  };

  const updateListItem = (field: string, index: number, value: string) => {
    const newList = [...settings[field]];
    newList[index] = value;
    setSettings({ ...settings, [field]: newList });
  };

  const removeListItem = (field: string, index: number) => {
    const newList = [...settings[field]];
    newList.splice(index, 1);
    setSettings({ ...settings, [field]: newList });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const tabs = [
    { id: 'general', label: 'Hero Section', icon: Layout },
    { id: 'about', label: 'About & Problem', icon: MessageSquare },
    { id: 'mission', label: 'Vision & Mission', icon: Target },
    { id: 'contact', label: 'Contact & Legal', icon: Mail },
  ];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-navy mb-2">Site Architect</h1>
          <p className="text-navy/60 font-mono text-xs uppercase tracking-widest">Global content & structural configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-blue-accent text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-accent/90 transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {saving ? 'Syncing...' : <><Save size={16} /> Update Site</>}
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-navy/5 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all whitespace-nowrap",
              activeTab === tab.id ? "bg-white text-navy shadow-sm" : "text-navy/40 hover:text-navy hover:bg-white/50"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Section */}
            <div className="bg-white p-8 rounded-2xl border border-navy/5 shadow-sm space-y-6 col-span-full">
              <div className="flex items-center gap-3 mb-6">
                <Layout className="text-blue-accent" size={20} />
                <h3 className="font-black uppercase tracking-tighter text-navy">Hero Configuration</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">Main Headline</label>
                  <textarea
                    value={settings.heroHeadline}
                    onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                    className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">Subheadline</label>
                  <textarea
                    value={settings.heroSubheadline}
                    onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                    className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">Background Video URL (MP4)</label>
                  <input
                    type="text"
                    value={settings.heroVideoUrl || ''}
                    onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value })}
                    className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* About Subsection */}
            <div className="bg-white p-8 rounded-2xl border border-navy/5 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-blue-accent" size={20} />
                <h3 className="font-black uppercase tracking-tighter text-navy">About Section</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">Core Quote</label>
                  <textarea
                    value={settings.aboutQuote}
                    onChange={(e) => setSettings({ ...settings, aboutQuote: e.target.value })}
                    className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">About Description</label>
                  <textarea
                    value={settings.aboutText}
                    onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                    className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all min-h-[120px]"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-3">Core Expertise (List)</label>
                  <div className="space-y-2">
                    {(settings.aboutCombines || []).map((item: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={item}
                          onChange={(e) => updateListItem('aboutCombines', i, e.target.value)}
                          className="flex-1 bg-navy/5 border-none rounded-lg p-2 text-xs font-bold"
                        />
                        <button onClick={() => removeListItem('aboutCombines', i)} className="p-2 text-navy/20 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button onClick={() => addListItem('aboutCombines')} className="text-[10px] font-mono uppercase tracking-widest text-blue-accent hover:underline flex items-center gap-1 mt-2">
                      <Plus size={12} /> Add Expertise
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Section */}
            <div className="bg-white p-8 rounded-2xl border border-navy/5 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-blue-accent" size={20} />
                <h3 className="font-black uppercase tracking-tighter text-navy">Problem Solving</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">Problem Headline</label>
                  <textarea
                    value={settings.problemHeadline}
                    onChange={(e) => setSettings({ ...settings, problemHeadline: e.target.value })}
                    className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">Problem Sub-text</label>
                  <textarea
                    value={settings.problemSub}
                    onChange={(e) => setSettings({ ...settings, problemSub: e.target.value })}
                    className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all min-h-[80px]"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-3">Challenge Markers (Pills)</label>
                  <div className="space-y-2">
                    {(settings.problemPills || []).map((item: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={item}
                          onChange={(e) => updateListItem('problemPills', i, e.target.value)}
                          className="flex-1 bg-navy/5 border-none rounded-lg p-2 text-xs font-bold"
                        />
                        <button onClick={() => removeListItem('problemPills', i)} className="p-2 text-navy/20 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button onClick={() => addListItem('problemPills')} className="text-[10px] font-mono uppercase tracking-widest text-blue-accent hover:underline flex items-center gap-1 mt-2">
                      <Plus size={12} /> Add Marker
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mission' && (
          <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-2xl border border-navy/5 shadow-sm space-y-8">
              <div className="flex items-center gap-3">
                <Target className="text-blue-accent" size={20} />
                <h3 className="font-black uppercase tracking-tighter text-navy text-xl">Core Directives</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <span className="font-mono text-[10px] uppercase text-navy/40 tracking-widest font-bold">Strategic Vision</span>
                  <textarea
                    value={settings.visionStatement}
                    onChange={(e) => setSettings({ ...settings, visionStatement: e.target.value })}
                    className="w-full bg-navy/5 border-none rounded-xl p-6 text-xl font-black tracking-tight text-navy focus:ring-2 focus:ring-blue-accent transition-all min-h-[150px]"
                    placeholder='"To build brands that create impact..."'
                  />
                </div>
                <div className="space-y-4">
                  <span className="font-mono text-[10px] uppercase text-navy/40 tracking-widest font-bold">Operational Mission</span>
                  <textarea
                    value={settings.missionStatement}
                    onChange={(e) => setSettings({ ...settings, missionStatement: e.target.value })}
                    className="w-full bg-navy/5 border-none rounded-xl p-6 text-xl font-black tracking-tight text-navy focus:ring-2 focus:ring-blue-accent transition-all min-h-[150px]"
                    placeholder='"Help businesses move from confusion to clarity..."'
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-navy/5">
                <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-4 font-bold">Execution Strategy Headline</label>
                <input
                  value={settings.strategyHeadline}
                  onChange={(e) => setSettings({ ...settings, strategyHeadline: e.target.value })}
                  className="w-full bg-navy/5 border-none rounded-xl p-4 text-2xl font-black uppercase tracking-tighter text-navy focus:ring-2 focus:ring-blue-accent transition-all"
                  placeholder="STRATEGY IS THE ONLY UNFAIR ADVANTAGE."
                />
              </div>

              <div className="pt-8 border-t border-navy/5 space-y-6">
                <div className="flex items-center gap-3">
                  <Zap className="text-blue-accent" size={18} />
                  <h4 className="font-black uppercase tracking-tighter text-navy">Final CTA Section</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2 font-bold">CTA Headline</label>
                    <textarea 
                      value={settings.finalCtaHeadline}
                      onChange={(e) => setSettings({ ...settings, finalCtaHeadline: e.target.value })}
                      className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all min-h-[80px]"
                      placeholder="READY TO WIN?"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2 font-bold">CTA Description</label>
                    <textarea 
                      value={settings.finalCtaSub}
                      onChange={(e) => setSettings({ ...settings, finalCtaSub: e.target.value })}
                      className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all min-h-[80px]"
                      placeholder="Stop competing on price..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2 font-bold">Button Text</label>
                    <input 
                      type="text"
                      value={settings.finalCtaButton}
                      onChange={(e) => setSettings({ ...settings, finalCtaButton: e.target.value })}
                      className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all"
                      placeholder="Book a strategy call →"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Contact info */}
            <div className="bg-white p-8 rounded-2xl border border-navy/5 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="text-blue-accent" size={20} />
                <h3 className="font-black uppercase tracking-tighter text-navy">Contact & Social</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full bg-navy/5 border-none rounded-xl p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full bg-navy/5 border-none rounded-xl p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">Social Profiles</label>
                  <div className="relative">
                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
                    <input
                      type="text"
                      value={settings.socialLinks?.instagram}
                      onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                      className="w-full bg-navy/5 border-none rounded-xl p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all"
                      placeholder="Instagram URL"
                    />
                  </div>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
                    <input
                      type="text"
                      value={settings.socialLinks?.linkedin}
                      onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })}
                      className="w-full bg-navy/5 border-none rounded-xl p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all"
                      placeholder="LinkedIn URL"
                    />
                  </div>
                  <div className="relative">
                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
                    <input
                      type="text"
                      value={settings.socialLinks?.twitter}
                      onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })}
                      className="w-full bg-navy/5 border-none rounded-xl p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all"
                      placeholder="Twitter URL"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability & Legal */}
            <div className="bg-white p-8 rounded-2xl border border-navy/5 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-blue-accent" size={20} />
                <h3 className="font-black uppercase tracking-tighter text-navy">Legal & Operations</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">Availability Status</label>
                  <input
                    type="text"
                    value={settings.availability}
                    onChange={(e) => setSettings({ ...settings, availability: e.target.value })}
                    className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all"
                    placeholder="e.g. Q3 2024 // 2 SLOTS OPEN"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-navy/40 uppercase tracking-widest mb-2">Copyright Line</label>
                  <input
                    type="text"
                    value={settings.footerCopyright}
                    onChange={(e) => setSettings({ ...settings, footerCopyright: e.target.value })}
                    className="w-full bg-navy/5 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-accent transition-all"
                    placeholder="© 2026 BlueAnt Brand Systems"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

