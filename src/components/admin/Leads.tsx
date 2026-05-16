import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Search, Filter, MoreHorizontal, User, Mail, Phone, Calendar as CalendarIcon, Tag, Star, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(data);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'leads'));
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const leadRef = doc(db, 'leads', id);
    await updateDoc(leadRef, { status, updatedAt: new Date() });
  };

  const filteredLeads = leads.filter(l => 
    l.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-navy italic mb-2">Lead Intelligence.</h1>
          <p className="text-muted font-mono text-[10px] uppercase tracking-widest text-navy/40">// {leads.length} Records Detected</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={16} />
              <input 
                type="text" 
                placeholder="Search entities..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-navy/5 rounded-xl shadow-sm outline-none focus:border-blue-accent transition-all text-xs font-bold text-navy w-64" 
              />
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Table View */}
        <div className="flex-1 bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden flex flex-col">
           <div className="overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="bg-navy/[0.02] border-b border-navy/5">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-navy/40">Timestamp</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-navy/40">Entity</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-navy/40">Service</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-navy/40">Status</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/5">
                  {filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className={cn(
                        "hover:bg-navy/[0.02] transition-all cursor-pointer group",
                        selectedLead?.id === lead.id ? "bg-blue-accent/5" : ""
                      )}
                    >
                      <td className="px-8 py-5 text-[10px] font-mono text-navy/40 italic">
                        {lead.createdAt?.toDate ? format(lead.createdAt.toDate(), 'dd MMM // HH:mm') : 'Just now'}
                      </td>
                      <td className="px-8 py-5">
                         <p className="font-black uppercase text-navy text-sm">{lead.firstName} {lead.lastName}</p>
                         <p className="text-[10px] font-mono text-navy/40 lowercase">{lead.email}</p>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-[9px] font-black uppercase tracking-tight text-navy/60 bg-navy/5 px-3 py-1 rounded-full">{lead.service}</span>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                            <span className={cn(
                              "text-[10px] font-black uppercase",
                              lead.status === 'New' ? "text-blue-accent" : "text-navy/60"
                            )}>{lead.status}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <ChevronRight size={16} className={cn("inline-block transition-transform", selectedLead?.id === lead.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100")} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Detail Panel */}
        <div className={cn(
          "w-96 bg-navy text-white rounded-3xl p-10 flex flex-col transition-all duration-500 overflow-y-auto",
          selectedLead ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
        )}>
          {selectedLead && (
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-blue-accent border border-white/10">
                    <User size={32} />
                 </div>
                 <button onClick={() => setSelectedLead(null)} className="text-white/40 hover:text-white"><ChevronRight size={24} className="rotate-180" /></button>
              </div>

              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-1">{selectedLead.firstName} {selectedLead.lastName}</h2>
                <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] italic">// Intelligence Record ID: {selectedLead.id.slice(0, 8)}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-white/80">
                  <Mail size={16} className="text-blue-accent" />
                  <span className="text-sm font-bold">{selectedLead.email}</span>
                </div>
                <div className="flex items-center gap-4 text-white/80">
                  <Phone size={16} className="text-blue-accent" />
                  <span className="text-sm font-bold">{selectedLead.phone}</span>
                </div>
                <div className="flex items-center gap-4 text-white/80">
                  <CalendarIcon size={16} className="text-blue-accent" />
                  <span className="text-sm font-bold">{selectedLead.createdAt?.toDate ? format(selectedLead.createdAt.toDate(), 'eeee, dd MMMM yyyy') : 'Recently'}</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-6">
                <div>
                   <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 font-bold">Selected Service</p>
                   <p className="text-lg font-black italic text-blue-accent">{selectedLead.service}</p>
                </div>
                <div>
                   <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 font-bold">Budget Tier</p>
                   <p className="text-lg font-black italic">{selectedLead.budget}</p>
                </div>
                <div>
                   <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 font-bold">Inquiry Brief</p>
                   <p className="text-sm italic leading-relaxed text-white/80 bg-white/5 p-6 rounded-2xl border border-white/5">{selectedLead.message || "No message provided."}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-6">
                <div>
                   <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-4 font-bold">Change Status</p>
                   <div className="grid grid-cols-2 gap-3">
                      {["New", "Contacted", "Follow-up", "Won", "Lost"].map(s => (
                        <button 
                          key={s}
                          onClick={() => updateStatus(selectedLead.id, s)}
                          className={cn(
                            "text-[10px] font-black uppercase py-2 px-3 rounded-lg border transition-all",
                            selectedLead.status === s ? "bg-blue-accent border-blue-accent text-white" : "border-white/10 hover:border-white/40"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
              
              <button className="w-full bg-white text-navy font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-blue-accent hover:text-white transition-all shadow-2xl mt-8">
                Initialize Reply →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
