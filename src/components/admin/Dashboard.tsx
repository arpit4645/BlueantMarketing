import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { 
  Users, MessageSquare, TrendingUp, Clock, 
  ArrowUpRight, ArrowDownRight, Search, Filter 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { format } from 'date-fns';

interface Lead {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  service?: string;
  status?: string;
  score?: number;
  createdAt?: {
    toDate: () => Date;
  };
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    conversion: 12.5,
    growth: 15
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      console.log('Dashboard: Fetching data...');
      try {
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
        setLeads(data);
        
        // Stats
        const [leadsSnap, projSnap, blogSnap, serviceSnap, testSnap] = await Promise.all([
          getDocs(collection(db, 'leads')),
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'blogs')),
          getDocs(collection(db, 'services')),
          getDocs(collection(db, 'testimonials'))
        ]);

        const newToday = data.filter(l => {
           try {
             const d = l.createdAt?.toDate?.();
             if (!d) return false;
             return d > new Date(new Date().setHours(0,0,0,0));
           } catch {
             return false;
           }
        }).length;

        setStats(prev => ({ 
          ...prev, 
          total: leadsSnap.size, 
          new: newToday,
          projects: projSnap.size,
          blogs: blogSnap.size,
          services: serviceSnap.size,
          testimonials: testSnap.size
        }));
      } catch (err: any) {
        console.error('Dashboard Fetch Error:', err);
        setError(err.message || 'Failed to sync intelligence data.');
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const chartData = [
    { name: 'Week 1', leads: 12 },
    { name: 'Week 2', leads: 19 },
    { name: 'Week 3', leads: 25 },
    { name: 'Week 4', leads: 32 },
  ];

  const pieData = [
    { name: 'Strategy', value: 400 },
    { name: 'Branding', value: 300 },
    { name: 'Growth', value: 300 },
    { name: 'Web', value: 200 },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-12">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
             <ArrowDownRight className="rotate-45" size={20} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-tight">System Sync Interrupted</p>
            <p className="text-[10px] font-mono uppercase tracking-widest opacity-70">{error}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-navy italic mb-2">Systems Overview.</h1>
          <p className="text-muted font-mono text-[10px] uppercase tracking-widest text-navy/40">// Pulse of the BlueAnt engine</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 bg-white px-4 py-2 border border-navy/5 rounded-xl shadow-sm">
              <Clock size={16} className="text-blue-accent" />
              <span className="text-xs font-black uppercase tracking-tight text-navy">{format(new Date(), 'dd MMM yyyy')}</span>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Intelligence Depth', value: (stats as any).total, icon: MessageSquare, change: `+${(stats as any).new} today`, color: 'blue' },
          { label: 'Portfolio Assets', value: (stats as any).projects, icon: TrendingUp, change: 'Active', color: 'purple' },
          { label: 'Engineered Services', value: (stats as any).services, icon: Clock, change: 'Ready', color: 'emerald' },
          { label: 'Intellectual Capital', value: (stats as any).blogs, icon: Users, change: 'Insights', color: 'amber' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-3xl border border-navy/5 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2`} />
            <div className="flex items-start justify-between relative z-10 mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono font-black text-emerald-500 flex items-center gap-1">
                  <ArrowUpRight size={12} /> {stat.change}
                </span>
                <span className="text-[8px] font-mono text-navy/30 uppercase tracking-widest mt-1">vs last month</span>
              </div>
            </div>
            <p className="text-3xl font-black text-navy mb-1 tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-navy/40 font-bold">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-3xl border border-navy/5 shadow-sm">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-sm font-black uppercase tracking-widest text-navy italic">Lead Velocity // 30 Days</h3>
             <select className="bg-navy/5 border-none rounded-lg text-[10px] font-black uppercase px-3 py-1 outline-none text-navy">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
             </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#94a3b8' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#94a3b8' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', textTransform: 'uppercase', fontStyle: 'italic', fontWeight: 'bold' }}
                />
                <Bar dataKey="leads" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-navy/5 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-navy italic mb-10">Service Demand</h3>
          <div className="h-[250px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
             {pieData.map((item, i) => (
               <div key={i} className="flex justify-between items-center text-xs">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="font-bold text-navy/70 uppercase tracking-tight">{item.name}</span>
                 </div>
                 <span className="font-black text-navy">{item.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-navy/5 flex items-center justify-between">
           <h3 className="text-sm font-black uppercase tracking-widest text-navy italic">Incoming Intelligence // Latest Leads</h3>
           <button className="text-[10px] font-black uppercase text-blue-accent hover:underline tracking-widest">View All Leads →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-navy/5">
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-navy/40">Timestamp</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-navy/40">Entity</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-navy/40">Service</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-navy/40">Status</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-navy/40">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {leads.map((lead, i) => (
                <tr key={lead.id} className="hover:bg-navy/[0.02] transition-colors group cursor-pointer">
                  <td className="px-10 py-6 text-[10px] font-mono text-navy/40 italic">
                    {lead.createdAt?.toDate ? format(lead.createdAt.toDate(), 'HH:mm // dd MMM') : 'Just now'}
                  </td>
                  <td className="px-10 py-6">
                    <p className="font-black uppercase text-navy group-hover:text-blue-accent transition-colors">{lead.firstName} {lead.lastName}</p>
                    <p className="text-[10px] font-mono text-navy/40 lowercase">{lead.email}</p>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-[10px] font-black uppercase tracking-tight text-navy/70 border border-navy/10 px-3 py-1 rounded-full">{lead.service}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-blue-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                       <span className="text-[10px] font-black uppercase text-blue-accent">{lead.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(s => (
                         <div key={s} className={`w-3 h-1 rounded-full ${s <= (lead.score || 1) ? 'bg-amber-400' : 'bg-navy/5'}`} />
                       ))}
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-navy/30 italic">No incoming intelligence recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
