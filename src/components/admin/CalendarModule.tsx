import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { format, isToday } from 'date-fns';
import { CalendarDays, Clock, Mail, Phone, Plus, Search } from 'lucide-react';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';

interface CalendarLead {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  service?: string;
  status?: string;
  budget?: string;
  createdAt?: { toDate: () => Date };
}

const stages = ['Discovery', 'Proposal', 'Follow-up', 'Decision'];

function getLeadDate(lead: CalendarLead) {
  try {
    return lead.createdAt?.toDate?.() ?? new Date();
  } catch {
    return new Date();
  }
}

export default function CalendarModule() {
  const [leads, setLeads] = useState<CalendarLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const leadQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(leadQuery);
        setLeads(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CalendarLead)));
      } catch (error) {
        console.error('Calendar fetch failed:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCalendar();
  }, []);

  const filteredLeads = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return leads.filter((lead) => {
      const name = `${lead.firstName ?? ''} ${lead.lastName ?? ''}`.toLowerCase();
      return name.includes(search) || lead.email?.toLowerCase().includes(search) || lead.service?.toLowerCase().includes(search);
    });
  }, [leads, searchTerm]);

  const todaysLeads = filteredLeads.filter((lead) => isToday(getLeadDate(lead)));
  const pipeline = stages.map((stage, index) => ({
    stage,
    leads: filteredLeads.filter((_, leadIndex) => leadIndex % stages.length === index),
  }));

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-black uppercase italic tracking-tighter text-navy">Calendar Command.</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-navy/40">// Lead follow-ups, booking rhythm, and active pipeline timing</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={16} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search schedule..."
              className="w-72 rounded-xl border border-navy/5 bg-white py-3 pl-11 pr-5 text-xs font-bold text-navy shadow-sm outline-none transition-all focus:border-blue-accent"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-sm transition-all hover:bg-blue-accent">
            <Plus size={16} />
            Add Slot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-navy/5 bg-white p-8 shadow-sm lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black uppercase italic tracking-widest text-navy">Today</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-navy/30">{format(new Date(), 'EEEE, dd MMM yyyy')}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-accent/10 text-blue-accent">
              <CalendarDays size={24} />
            </div>
          </div>

          <div className="space-y-4">
            {(todaysLeads.length ? todaysLeads : filteredLeads.slice(0, 4)).map((lead, index) => (
              <div key={lead.id} className="grid gap-4 rounded-2xl border border-navy/5 bg-off-white/60 p-5 md:grid-cols-[110px_1fr_auto] md:items-center">
                <div className="flex items-center gap-3 text-navy/50">
                  <Clock size={16} className="text-blue-accent" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest">{format(getLeadDate(lead), 'HH:mm')}</span>
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight text-navy">{lead.firstName || 'New'} {lead.lastName || 'Lead'}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-navy/40">{lead.service || 'Strategy consultation'} / {lead.budget || 'Budget pending'}</p>
                </div>
                <span className={cn(
                  'w-fit rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest',
                  index === 0 ? 'bg-blue-accent text-white' : 'bg-white text-navy/50'
                )}>
                  {lead.status || 'Queued'}
                </span>
              </div>
            ))}

            {!loading && filteredLeads.length === 0 && (
              <div className="rounded-2xl border border-dashed border-navy/10 p-12 text-center">
                <p className="text-sm font-black uppercase italic text-navy/30">No scheduled lead activity yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-navy p-8 text-white shadow-sm">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/40">Booking Load</p>
          <p className="text-5xl font-black italic tracking-tighter">{filteredLeads.length}</p>
          <div className="mt-8 space-y-4">
            {[
              ['Today', todaysLeads.length],
              ['Open pipeline', filteredLeads.filter((lead) => lead.status !== 'Won' && lead.status !== 'Lost').length],
              ['Closed records', filteredLeads.filter((lead) => lead.status === 'Won' || lead.status === 'Lost').length],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/45">{label}</span>
                <span className="text-sm font-black text-blue-accent">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        {pipeline.map((column) => (
          <div key={column.stage} className="rounded-3xl border border-navy/5 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase italic tracking-widest text-navy">{column.stage}</h3>
              <span className="rounded-full bg-navy/5 px-3 py-1 text-[9px] font-black text-navy/40">{column.leads.length}</span>
            </div>
            <div className="space-y-3">
              {column.leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="rounded-2xl bg-off-white p-4">
                  <p className="text-xs font-black uppercase text-navy">{lead.firstName || 'Lead'} {lead.lastName || ''}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-navy/35">{lead.service || 'Consultation'}</p>
                  <div className="mt-4 flex items-center gap-3 text-navy/35">
                    {lead.email && <Mail size={13} />}
                    {lead.phone && <Phone size={13} />}
                    <span className="ml-auto font-mono text-[9px]">{format(getLeadDate(lead), 'dd MMM')}</span>
                  </div>
                </div>
              ))}
              {column.leads.length === 0 && <p className="py-8 text-center text-xs font-bold italic text-navy/25">No records</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
