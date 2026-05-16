import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Mail, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { db } from '../../lib/firebase';

interface TeamMember {
  id: string;
  name?: string;
  displayName?: string;
  email?: string;
  role?: string;
  status?: string;
}

const fallbackMembers: TeamMember[] = [
  {
    id: 'owner',
    name: 'System Owner',
    email: 'arpitjadav765@gmail.com',
    role: 'Super Admin',
    status: 'Active',
  },
];

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>(fallbackMembers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TeamMember));
        if (users.length > 0) {
          setMembers(users);
        }
      } catch (error) {
        console.error('Team fetch failed:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-black uppercase italic tracking-tighter text-navy">Team Control.</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-navy/40">// Access, ownership, and operating roles for BlueAnt OS</p>
        </div>
        <button className="flex w-fit items-center gap-2 rounded-xl bg-navy px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-sm transition-all hover:bg-blue-accent">
          <UserPlus size={16} />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          ['Active Members', members.length],
          ['Admin Roles', members.filter((member) => (member.role || '').toLowerCase().includes('admin')).length],
          ['Pending Invites', 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-navy/5 bg-white p-7 shadow-sm">
            <p className="font-mono text-[10px] uppercase tracking-widest text-navy/35">{label}</p>
            <p className="mt-4 text-4xl font-black tracking-tighter text-navy">{loading ? '--' : value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-navy/5 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-navy/5 p-8">
          <div>
            <h2 className="text-sm font-black uppercase italic tracking-widest text-navy">Members</h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-navy/30">Identity and permissions</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-accent/10 text-blue-accent">
            <Users size={22} />
          </div>
        </div>

        <div className="divide-y divide-navy/5">
          {members.map((member) => (
            <div key={member.id} className="grid gap-5 p-7 md:grid-cols-[1fr_auto_auto] md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-sm font-black uppercase text-white">
                  {(member.displayName || member.name || member.email || 'A').slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight text-navy">{member.displayName || member.name || 'Admin User'}</p>
                  <p className="mt-1 flex items-center gap-2 text-[10px] font-bold lowercase tracking-tight text-navy/40">
                    <Mail size={12} />
                    {member.email || 'email unavailable'}
                  </p>
                </div>
              </div>
              <span className="flex w-fit items-center gap-2 rounded-full bg-blue-accent/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-accent">
                <ShieldCheck size={13} />
                {member.role || 'Admin'}
              </span>
              <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                {member.status || 'Active'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
