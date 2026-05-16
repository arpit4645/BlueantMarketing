import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { 
  BarChart3, Users, LayoutDashboard, Settings, LogOut, 
  Menu, X, MessageSquare, Calendar, FileText, Bell
} from 'lucide-react';
import { cn } from '../../lib/utils';
import SafeImage from '../SafeImage';

export default function AdminLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('AdminLayout: Monitoring auth state...');
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('AdminLayout: Auth initialization taking longer than expected...');
        setLoading(false); // Safety net
      }
    }, 8000);

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      console.log('AdminLayout: Auth state transitioned. User:', u?.email);
      try {
        if (u) {
          const isOwner = u.email === 'arpitjadav765@gmail.com';
          
          try {
            const userDoc = await getDoc(doc(db, 'users', u.uid));
            if (userDoc.exists()) {
              setUser({ ...u, ...userDoc.data() });
            } else if (isOwner) {
              console.log('AdminLayout: Owner detected without profile doc. Using bootstrap profile.');
              setUser({ ...u, role: 'Super Admin', name: 'System Owner' });
            } else {
              console.warn('AdminLayout: Non-owner user without profile doc.');
              navigate('/admin/login');
              return;
            }
          } catch (docError) {
            console.error('AdminLayout: Error fetching user doc:', docError);
            if (isOwner) {
              console.log('AdminLayout: Owner recovery mode active.');
              setUser({ ...u, role: 'Super Admin', name: 'System Owner' });
            } else {
              throw docError;
            }
          }
        } else {
          console.log('AdminLayout: No user authenticated. Redirecting...');
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('AdminLayout Catch:', error);
        navigate('/admin/login');
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-blue-accent border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] animate-pulse italic">Initializing BlueAnt OS // Authentication check...</p>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Leads', icon: MessageSquare, path: '/admin/leads' },
    { name: 'Calendar', icon: Calendar, path: '/admin/calendar' },
    { name: 'Content', icon: FileText, path: '/admin/content' },
    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { name: 'Team', icon: Users, path: '/admin/team' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-off-white flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-navy text-white transition-transform duration-300 transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-8 bg-blue-accent rounded-lg flex items-center justify-center font-black italic">B</div>
            <span className="font-black uppercase tracking-tighter text-xl italic">BlueAnt <span className="text-blue-accent/60">OS</span></span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all group",
                  location.pathname === item.path ? "bg-white/10 text-blue-accent shadow-xl" : "hover:bg-white/5 text-white/60 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(location.pathname === item.path ? "text-blue-accent" : "text-white/40 group-hover:text-white")} />
                <span className="font-bold text-sm uppercase tracking-widest">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-blue-accent/20 flex items-center justify-center text-blue-accent border border-blue-accent/20 overflow-hidden">
                {user?.photoURL ? <SafeImage src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : user?.name?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black uppercase truncate">{user?.displayName || user?.name || 'Admin User'}</p>
                <p className="text-[10px] font-mono text-white/40 truncate uppercase tracking-widest">{user?.role || 'Super Admin'}</p>
              </div>
            </div>
            <button 
              onClick={() => signOut(auth)}
              className="w-full flex items-center gap-4 p-4 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm uppercase tracking-widest"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-navy/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-navy hover:bg-navy/5 rounded-lg"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>

          <div className="flex items-center gap-6 ml-auto">
             <button className="p-2 text-navy/40 hover:text-navy transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
             </button>
             <div className="h-6 w-[1px] bg-navy/10" />
             <div className="hidden md:block">
               <p className="text-[10px] font-mono text-navy/40 uppercase tracking-widest">Logged in as</p>
               <p className="text-xs font-black uppercase text-navy">{user?.email}</p>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
