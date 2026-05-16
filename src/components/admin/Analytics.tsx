import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, BarChart3, Briefcase, MessageSquare, Target } from 'lucide-react';
import { db } from '../../lib/firebase';

interface LeadRecord {
  id: string;
  service?: string;
  status?: string;
  budget?: string;
  createdAt?: { toDate: () => Date };
}

const palette = ['#4A90D9', '#0D1B3E', '#10B981', '#F59E0B', '#8B5CF6'];

function getMonthLabel(lead: LeadRecord) {
  try {
    return (lead.createdAt?.toDate?.() ?? new Date()).toLocaleDateString('en-US', { month: 'short' });
  } catch {
    return 'Now';
  }
}

export default function Analytics() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [counts, setCounts] = useState({ projects: 0, blogs: 0, services: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [leadSnap, projectSnap, blogSnap, serviceSnap, testimonialSnap] = await Promise.all([
          getDocs(collection(db, 'leads')),
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'blogs')),
          getDocs(collection(db, 'services')),
          getDocs(collection(db, 'testimonials')),
        ]);

        setLeads(leadSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as LeadRecord)));
        setCounts({
          projects: projectSnap.size,
          blogs: blogSnap.size,
          services: serviceSnap.size,
          testimonials: testimonialSnap.size,
        });
      } catch (error) {
        console.error('Analytics fetch failed:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const serviceData = useMemo(() => {
    const serviceMap = new Map<string, number>();
    leads.forEach((lead) => serviceMap.set(lead.service || 'Unspecified', (serviceMap.get(lead.service || 'Unspecified') || 0) + 1));
    return Array.from(serviceMap, ([name, value]) => ({ name, value })).slice(0, 5);
  }, [leads]);

  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, number>();
    leads.forEach((lead) => monthMap.set(getMonthLabel(lead), (monthMap.get(getMonthLabel(lead)) || 0) + 1));
    return Array.from(monthMap, ([month, leads]) => ({ month, leads })).slice(-6);
  }, [leads]);

  const won = leads.filter((lead) => lead.status === 'Won').length;
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0;

  const metrics = [
    { label: 'Lead Records', value: leads.length, icon: MessageSquare, note: `${conversion}% won` },
    { label: 'Case Studies', value: counts.projects, icon: Briefcase, note: 'Portfolio depth' },
    { label: 'Service Lines', value: counts.services, icon: Target, note: 'Offer clarity' },
    { label: 'Trust Assets', value: counts.testimonials, icon: BarChart3, note: `${counts.blogs} insights` },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-2 text-4xl font-black uppercase italic tracking-tighter text-navy">System Analytics.</h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-navy/40">// Performance view across demand, content, and brand proof</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-3xl border border-navy/5 bg-white p-7 shadow-sm">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-accent/10 text-blue-accent">
                <metric.icon size={22} />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-500">
                <ArrowUpRight size={12} />
                Live
              </span>
            </div>
            <p className="text-4xl font-black tracking-tighter text-navy">{loading ? '--' : metric.value}</p>
            <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-navy/40">{metric.label}</p>
            <p className="mt-5 border-t border-navy/5 pt-4 text-[10px] font-bold uppercase tracking-widest text-navy/30">{metric.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="rounded-3xl border border-navy/5 bg-white p-8 shadow-sm xl:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase italic tracking-widest text-navy">Lead Velocity</h2>
            <span className="rounded-full bg-navy/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-navy/40">Monthly</span>
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData.length ? monthlyData : [{ month: 'No data', leads: 0 }]}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip cursor={{ fill: 'rgba(74,144,217,0.08)' }} />
                <Bar dataKey="leads" fill="#4A90D9" radius={[6, 6, 0, 0]} barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-navy p-8 text-white shadow-sm">
          <h2 className="mb-8 text-sm font-black uppercase italic tracking-widest text-white">Demand Mix</h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={serviceData.length ? serviceData : [{ name: 'No data', value: 1 }]} innerRadius={55} outerRadius={84} paddingAngle={4} dataKey="value">
                  {(serviceData.length ? serviceData : [{ name: 'No data', value: 1 }]).map((entry, index) => (
                    <Cell key={entry.name} fill={palette[index % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-7 space-y-3">
            {(serviceData.length ? serviceData : [{ name: 'No demand yet', value: 0 }]).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/55">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
                  {item.name}
                </span>
                <span className="text-xs font-black text-blue-accent">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
