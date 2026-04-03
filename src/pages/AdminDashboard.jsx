// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid
} from 'recharts';
import {
  FiUsers, FiSearch, FiTrash2, FiLock, FiCheck, FiX,
  FiPlus, FiEdit2, FiStar, FiBell, FiSend, FiLogOut,
  FiThumbsUp, FiThumbsDown, FiMessageSquare, FiTrendingUp,
  FiToggleLeft, FiToggleRight, FiShield, FiCalendar,
  FiMapPin, FiLink, FiFilter, FiBarChart2, FiPieChart,
  FiChevronDown, FiAlertCircle, FiInfo, FiCheckCircle,
  FiActivity, FiGrid, FiRefreshCw
} from 'react-icons/fi';

// ─── Shared localStorage helpers ─────────────────────────────────────────────
const loadEvents = () => {
  try { return JSON.parse(localStorage.getItem('bilih_events') || '[]'); }
  catch { return []; }
};
const saveEvents = (events) => localStorage.setItem('bilih_events', JSON.stringify(events));

const loadAdminNotifs = () => {
  try { return JSON.parse(localStorage.getItem('bilih_notifications') || '[]'); }
  catch { return []; }
};
const saveAdminNotifs = (n) => localStorage.setItem('bilih_notifications', JSON.stringify(n));

const getLoginLog = () => {
  try { return JSON.parse(localStorage.getItem('bilih_login_log') || '{}'); }
  catch { return {}; }
};

// ─── Seed Events if empty ─────────────────────────────────────────────────────
const SEED_EVENTS = [
  { id: 1, title: 'AI & ML Hackathon', description: 'Build creative AI solutions in 48 hours.', type: 'Hackathon', startDate: '2026-05-01', deadline: '2026-04-25', location: 'AAU Hall', link: '', skills: 'Python, TensorFlow', featured: 'Trending', likes: 142, dislikes: 8, comments: 23 },
  { id: 2, title: 'React Workshop', description: 'Hands-on React + Vite workshop for beginners.', type: 'Workshop', startDate: '2026-04-20', deadline: '2026-04-18', location: '', link: 'https://meet.google.com/xyz', skills: 'HTML, JavaScript', featured: '', likes: 98, dislikes: 3, comments: 11 },
  { id: 3, title: 'CS Club Meetup', description: 'Monthly meetup for Computer Science students.', type: 'Club', startDate: '2026-04-15', deadline: '2026-04-14', location: 'CS Building Room 201', link: '', skills: '', featured: 'Recommended', likes: 74, dislikes: 5, comments: 17 },
];
if (!localStorage.getItem('bilih_events')) saveEvents(SEED_EVENTS);

// Seed feedback comments
const FEEDBACK_DATA = {
  likes: 1567, dislikes: 234, comments: [
    { id: 1, user: 'Abebe T.', text: 'The GPA tracker is super helpful!', rating: 'like', date: '2026-04-01' },
    { id: 2, user: 'Sara M.', text: 'Notifications could be clearer.', rating: 'dislike', date: '2026-03-30' },
    { id: 3, user: 'Dawit K.', text: 'Love the opportunities section!', rating: 'like', date: '2026-03-29' },
    { id: 4, user: 'Helen B.', text: 'Please add more language options.', rating: 'dislike', date: '2026-03-28' },
    { id: 5, user: 'Yonas G.', text: 'AI suggestions are spot on 🔥', rating: 'like', date: '2026-03-27' },
  ],
};
const FEATURE_POPULARITY = [
  { feature: 'GPA Tracker', usage: 89, likes: 420 },
  { feature: 'Opportunities', usage: 94, likes: 380 },
  { feature: 'Language', usage: 62, likes: 210 },
  { feature: 'Study Planner', usage: 77, likes: 310 },
  { feature: 'Notifications', usage: 55, likes: 180 },
];

const DEPTS = ['Computer Science', 'Electrical Engineering', 'Business', 'Medicine', 'Law', 'Architecture', 'Physics'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate'];

// ─── Sidebar Item Component ────────────────────────────────────────────────────
const SidebarItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
      active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
        : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">{badge}</span>
    )}
  </button>
);

// ─── Stat Card Component ──────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, sub }) => {
  const colors = {
    indigo: 'from-indigo-600 to-violet-600 shadow-indigo-500/30',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/30',
    amber: 'from-amber-500 to-orange-600 shadow-amber-500/30',
    red: 'from-red-500 to-rose-600 shadow-red-500/30',
    blue: 'from-blue-500 to-cyan-600 shadow-blue-500/30',
  };
  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 flex items-center gap-4 hover:border-slate-600 transition-colors">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[color]} shadow-lg flex items-center justify-center text-white text-2xl flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">{label}</p>
        {sub && <p className="text-emerald-400 text-xs font-semibold mt-1">{sub}</p>}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user, logout, getAllUsers, deleteUser, toggleUserStatus, resetUserPassword } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  // User Management state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [resetModal, setResetModal] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  // Event Management state
  const [events, setEvents] = useState([]);
  const [eventModal, setEventModal] = useState(null); // null | 'add' | {event}
  const [eventForm, setEventForm] = useState({ title: '', description: '', type: 'Hackathon', startDate: '', deadline: '', location: '', link: '', skills: '', featured: '' });

  // Notification state
  const [notifForm, setNotifForm] = useState({ title: '', message: '', type: 'global', department: '', year: '', priority: 'general' });
  const [sentNotifs, setSentNotifs] = useState([]);

  // Auth guard
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'admin') { navigate('/gpa-prediction'); return; }
  }, [user, navigate]);

  useEffect(() => {
    setUsers(getAllUsers ? getAllUsers() : []);
    setEvents(loadEvents());
    setSentNotifs(loadAdminNotifs());
  }, [tab]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <FiShield className="text-red-500 text-7xl mx-auto" />
          <h1 className="text-4xl font-black text-white">403 — Admin Only</h1>
          <Link to="/gpa-prediction" className="inline-block mt-4 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors">
            Go to User Services
          </Link>
        </div>
      </div>
    );
  }

  // ─── Overview Data ──────────────────────────────────────────────────────────
  const loginLog = getLoginLog();
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive !== false).length;
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), logins: (loginLog[key] || []).length };
  });

  // ─── User Management ────────────────────────────────────────────────────────
  const filteredUsers = users.filter(u => {
    const matchSearch = !userSearch || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()) || u.username?.toLowerCase().includes(userSearch.toLowerCase());
    const matchFilter = userFilter === 'all' || (userFilter === 'active' && u.isActive !== false) || (userFilter === 'inactive' && u.isActive === false) || (userFilter === 'verified' && u.isVerified) || (userFilter === 'unverified' && !u.isVerified);
    return matchSearch && matchFilter;
  });

  const handleDeleteUser = (u) => { setDeleteModal(u); };
  const confirmDelete = () => {
    deleteUser(deleteModal.id);
    setUsers(getAllUsers());
    setDeleteModal(null);
    toast.success('User deleted.', { style: { background: '#1e293b', color: '#fff' } });
  };
  const handleToggle = (userId) => {
    toggleUserStatus(userId);
    setUsers(getAllUsers());
    toast.success('Status updated.', { style: { background: '#1e293b', color: '#fff' } });
  };
  const handleReset = () => {
    if (!newPassword || newPassword.length < 4) { toast.error('Password too short'); return; }
    resetUserPassword(resetModal.id, newPassword);
    setResetModal(null); setNewPassword('');
    toast.success('Password reset successfully.', { style: { background: '#1e293b', color: '#fff' } });
  };

  // ─── Event Management ───────────────────────────────────────────────────────
  const openAddEvent = () => {
    setEventForm({ title: '', description: '', type: 'Hackathon', startDate: '', deadline: '', location: '', link: '', skills: '', featured: '' });
    setEventModal('add');
  };
  const openEditEvent = (ev) => { setEventForm({ ...ev }); setEventModal(ev); };
  const handleEventSave = () => {
    if (!eventForm.title || !eventForm.deadline) { toast.error('Title and deadline required.'); return; }
    let updated;
    if (eventModal === 'add') {
      updated = [...events, { ...eventForm, id: Date.now(), likes: 0, dislikes: 0, comments: 0 }];
      toast.success('Event created! ✅', { style: { background: '#1e293b', color: '#fff' } });
    } else {
      updated = events.map(e => e.id === eventModal.id ? { ...e, ...eventForm } : e);
      toast.success('Event updated! ✏️', { style: { background: '#1e293b', color: '#fff' } });
    }
    saveEvents(updated); setEvents(updated); setEventModal(null);
  };
  const handleDeleteEvent = (id) => {
    const updated = events.filter(e => e.id !== id);
    saveEvents(updated); setEvents(updated);
    toast.success('Event removed.', { style: { background: '#1e293b', color: '#fff' } });
  };
  const handleFeature = (id, badge) => {
    const updated = events.map(e => e.id === id ? { ...e, featured: e.featured === badge ? '' : badge } : e);
    saveEvents(updated); setEvents(updated);
    toast.success(`${badge} badge toggled!`, { style: { background: '#1e293b', color: '#fff' } });
  };

  // ─── Notifications ──────────────────────────────────────────────────────────
  const handleSendNotif = () => {
    if (!notifForm.title || !notifForm.message) { toast.error('Title and message required.'); return; }
    const notif = {
      id: Date.now(),
      ...notifForm,
      date: new Date().toISOString(),
      read: false,
      fromAdmin: true,
    };
    const updated = [notif, ...sentNotifs];
    saveAdminNotifs(updated); setSentNotifs(updated);
    setNotifForm({ title: '', message: '', type: 'global', department: '', year: '', priority: 'general' });
    toast.success('Notification sent! 🔔', { style: { background: '#1e293b', color: '#fff' } });
  };

  const priorityColors = { urgent: 'text-red-400 bg-red-500/10 border-red-500/30', recommended: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', general: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  const priorityEmoji = { urgent: '🔴', recommended: '🟡', general: '🟢' };

  const SIDEBAR_ITEMS = [
    { id: 'overview', icon: <FiGrid />, label: 'Overview' },
    { id: 'users', icon: <FiUsers />, label: 'User Management', badge: users.filter(u => !u.isVerified).length || null },
    { id: 'events', icon: <FiCalendar />, label: 'Event Management' },
    { id: 'feedback', icon: <FiMessageSquare />, label: 'Feedback Analytics' },
    { id: 'notifications', icon: <FiBell />, label: 'Notifications' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* ── Admin Sidebar ── */}
      <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col min-h-[calc(100vh-80px)]">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <FiShield className="text-white text-lg" />
            </div>
            <div>
              <p className="text-white font-black text-sm">Control Panel</p>
              <p className="text-indigo-400 text-xs font-semibold">Administrator</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
            <img src={user.profile_picture} alt="admin" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <p className="text-white text-xs font-bold leading-none">{user.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">@{user.username}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="px-4 text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Admin Tasks</p>
          {SIDEBAR_ITEMS.map(item => (
            <SidebarItem key={item.id} {...item} active={tab === item.id} onClick={() => setTab(item.id)} />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/gpa-prediction" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-700/60 hover:text-white font-semibold text-sm transition-all">
            <FiGrid /> User Services
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-semibold text-sm transition-all mt-1">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto">
      
        {/* Welcome Header Card */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 border-b border-indigo-500/20 px-8 py-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
           <div className="relative z-10 flex justify-between items-center">
               <div>
                   <h1 className="text-3xl font-black text-white">Welcome, {user.name}! 👋</h1>
                   <p className="text-indigo-200 mt-2">Here is what is happening with the Bilih platform today.</p>
               </div>
               <div className="text-right hidden md:block">
                   <p className="text-sm font-bold text-slate-300">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
               </div>
           </div>
        </div>

        {/* ════════ OVERVIEW ════════ */}
        {tab === 'overview' && (
          <div className="p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-black text-white">Platform <span className="text-indigo-400">Overview</span></h1>
              <p className="text-slate-400 mt-1">Real-time platform health and engagement metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard label="Total Users" value={totalUsers + 1247} icon={<FiUsers />} color="indigo" />
              <StatCard label="Active Users" value={activeUsers + 892} icon={<FiActivity />} color="emerald" sub="+12 this week" />
              <StatCard label="Daily Logins" value={(last7Days.reduce((a, b) => a + b.logins, 0)) + 48} icon={<FiTrendingUp />} color="amber" />
              <StatCard label="Total Events" value={events.length} icon={<FiCalendar />} color="blue" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><FiBarChart2 className="text-indigo-400" /> Daily Logins (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={last7Days.map(d => ({ ...d, logins: d.logins + Math.floor(Math.random() * 40 + 10) }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} />
                    <Line type="monotone" dataKey="logins" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><FiTrendingUp className="text-emerald-400" /> Most Popular Features</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={FEATURE_POPULARITY}>
                    <XAxis dataKey="feature" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} />
                    <Bar dataKey="usage" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Platform Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Server Uptime', value: '99.9%', ok: true },
                  { label: 'API Latency', value: '< 120ms', ok: true },
                  { label: 'DB Cluster', value: 'Healthy', ok: true },
                  { label: 'Pending Reports', value: '2', ok: false },
                ].map(s => (
                  <div key={s.label} className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${s.ok ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <div>
                      <p className="text-white font-bold text-sm">{s.value}</p>
                      <p className="text-slate-400 text-xs">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════ USER MANAGEMENT ════════ */}
        {tab === 'users' && (
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-white">User <span className="text-indigo-400">Management</span></h1>
              <p className="text-slate-400 mt-1">View, search, filter and manage all registered users.</p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name, email, or username..." className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'active', 'inactive', 'verified', 'unverified'].map(f => (
                  <button key={f} onClick={() => setUserFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${userFilter === f ? 'bg-indigo-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-white">{users.length}</p>
                <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Total</p>
              </div>
              <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-emerald-400">{users.filter(u => u.isActive !== false).length}</p>
                <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Active</p>
              </div>
              <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-red-400">{users.filter(u => u.isActive === false).length}</p>
                <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Inactive</p>
              </div>
            </div>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
              <div className="bg-slate-800 rounded-2xl p-12 text-center">
                <FiUsers className="text-5xl text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-semibold">No users found</p>
                {users.length === 0 && <p className="text-slate-500 text-sm mt-2">Users appear here when they sign up.</p>}
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wider">User</th>
                        <th className="text-left px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wider hidden md:table-cell">Department</th>
                        <th className="text-left px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Verified</th>
                        <th className="text-left px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Joined</th>
                        <th className="text-right px-6 py-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={u.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt="" className="w-9 h-9 rounded-xl object-cover" />
                              <div>
                                <p className="text-white font-bold text-sm">{u.name}</p>
                                <p className="text-slate-400 text-xs">@{u.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className="text-slate-300 text-sm">{u.department || '—'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${u.isActive !== false ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                              {u.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            {u.isVerified ? <FiCheckCircle className="text-emerald-400 text-lg" /> : <FiAlertCircle className="text-amber-400 text-lg" />}
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <span className="text-slate-400 text-xs">{u.joinDate || '—'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleToggle(u.id)} title={u.isActive !== false ? 'Deactivate' : 'Activate'} className={`p-2 rounded-lg transition-all ${u.isActive !== false ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-slate-700 text-slate-400 hover:text-emerald-400'}`}>
                                {u.isActive !== false ? <FiToggleRight className="text-lg" /> : <FiToggleLeft className="text-lg" />}
                              </button>
                              <button onClick={() => setResetModal(u)} title="Reset Password" className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all">
                                <FiLock className="text-lg" />
                              </button>
                              <button onClick={() => handleDeleteUser(u)} title="Delete" className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                                <FiTrash2 className="text-lg" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════ EVENT MANAGEMENT ════════ */}
        {tab === 'events' && (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-white">Event <span className="text-indigo-400">Management</span></h1>
                <p className="text-slate-400 mt-1">Create, edit, delete and feature events & hackathons.</p>
              </div>
              <button onClick={openAddEvent} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30">
                <FiPlus /> Add Event
              </button>
            </div>

            <div className="space-y-4">
              {events.map(ev => (
                <div key={ev.id} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="text-white font-bold text-lg">{ev.title}</h3>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${ev.type === 'Hackathon' ? 'bg-violet-500/20 text-violet-400' : ev.type === 'Workshop' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {ev.type}
                        </span>
                        {ev.featured && (
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 ${ev.featured === 'Trending' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                            <FiStar className="text-xs" /> {ev.featured}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{ev.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><FiCalendar /> Start: {ev.startDate || '—'}</span>
                        <span className="flex items-center gap-1"><FiAlertCircle /> Deadline: {ev.deadline}</span>
                        {ev.location && <span className="flex items-center gap-1"><FiMapPin /> {ev.location}</span>}
                        {ev.link && <span className="flex items-center gap-1"><FiLink /> Online</span>}
                        {ev.skills && <span className="flex items-center gap-1">🛠 {ev.skills}</span>}
                      </div>
                      <div className="flex gap-4 mt-3 text-xs text-slate-500">
                        <span>👍 {ev.likes || 0}</span>
                        <span>👎 {ev.dislikes || 0}</span>
                        <span>💬 {ev.comments || 0} comments</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => handleFeature(ev.id, 'Trending')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${ev.featured === 'Trending' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-amber-500/20 hover:text-amber-400'}`}>
                        🔥 Trending
                      </button>
                      <button onClick={() => handleFeature(ev.id, 'Recommended')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${ev.featured === 'Recommended' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400'}`}>
                        ⭐ Recommended
                      </button>
                      <button onClick={() => openEditEvent(ev)} className="p-2 bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 rounded-lg transition-all">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="bg-slate-800 rounded-2xl p-12 text-center">
                  <FiCalendar className="text-5xl text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-semibold">No events yet. Add one!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════ FEEDBACK ANALYTICS ════════ */}
        {tab === 'feedback' && (
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-white">Feedback <span className="text-indigo-400">Analytics</span></h1>
              <p className="text-slate-400 mt-1">Understand user satisfaction and identify areas to improve.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 text-center">
                <FiThumbsUp className="text-emerald-400 text-3xl mx-auto mb-2" />
                <p className="text-3xl font-black text-white">{FEEDBACK_DATA.likes.toLocaleString()}</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Total Likes</p>
              </div>
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 text-center">
                <FiThumbsDown className="text-red-400 text-3xl mx-auto mb-2" />
                <p className="text-3xl font-black text-white">{FEEDBACK_DATA.dislikes.toLocaleString()}</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Total Dislikes</p>
              </div>
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 text-center">
                <FiMessageSquare className="text-blue-400 text-3xl mx-auto mb-2" />
                <p className="text-3xl font-black text-white">{FEEDBACK_DATA.comments.length}</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Comments</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><FiPieChart className="text-indigo-400" /> User Satisfaction</h3>
                <div className="flex items-center gap-6">
                  <PieChart width={180} height={180}>
                    <Pie data={[{ name: 'Satisfied', value: FEEDBACK_DATA.likes }, { name: 'Dissatisfied', value: FEEDBACK_DATA.dislikes }]} cx={85} cy={85} innerRadius={55} outerRadius={80} dataKey="value">
                      <Cell fill="#22c55e" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} />
                  </PieChart>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-white font-bold text-sm">Satisfied</span>
                      <span className="text-emerald-400 font-black ml-auto">{Math.round(FEEDBACK_DATA.likes / (FEEDBACK_DATA.likes + FEEDBACK_DATA.dislikes) * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-white font-bold text-sm">Dissatisfied</span>
                      <span className="text-red-400 font-black ml-auto">{Math.round(FEEDBACK_DATA.dislikes / (FEEDBACK_DATA.likes + FEEDBACK_DATA.dislikes) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><FiBarChart2 className="text-violet-400" /> Feature Popularity</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={FEATURE_POPULARITY} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="feature" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} />
                    <Bar dataKey="usage" fill="#6366f1" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-slate-800 border border-amber-500/20 rounded-2xl p-6">
              <h3 className="text-amber-400 font-bold text-lg mb-4 flex items-center gap-2"><FiAlertCircle /> Improvement Insights</h3>
              <div className="space-y-3">
                {[
                  { issue: 'Notification clarity is flagged by users', action: 'Improve priority labeling and grouping' },
                  { issue: 'Language learning usage is the lowest (62%)', action: 'Add more Ethiopian language content' },
                  { issue: 'Event overload reported in feedback', action: 'Increase gap between events, limit to 3/week' },
                ].map((insight, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-700/50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm">⚠ {insight.issue}</p>
                      <p className="text-slate-400 text-xs mt-1">→ {insight.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Recent Comments</h3>
              <div className="space-y-3">
                {FEEDBACK_DATA.comments.map(c => (
                  <div key={c.id} className="flex items-start gap-4 p-4 bg-slate-700/40 rounded-xl">
                    <div className={`text-xl ${c.rating === 'like' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {c.rating === 'like' ? '👍' : '👎'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-white font-bold text-sm">{c.user}</p>
                        <p className="text-slate-500 text-xs">{c.date}</p>
                      </div>
                      <p className="text-slate-300 text-sm">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════ NOTIFICATIONS ════════ */}
        {tab === 'notifications' && (
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-white">Notification <span className="text-indigo-400">Management</span></h1>
              <p className="text-slate-400 mt-1">Send global announcements or target specific groups.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Send Form */}
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2"><FiSend className="text-indigo-400" /> Compose Notification</h3>

                {/* Type */}
                <div className="flex gap-3">
                  {[['global', '🌍 Global'], ['targeted', '🎯 Targeted']].map(([val, label]) => (
                    <button key={val} onClick={() => setNotifForm(f => ({ ...f, type: val }))} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${notifForm.type === val ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Targeted filters */}
                {notifForm.type === 'targeted' && (
                  <div className="grid grid-cols-2 gap-3">
                    <select value={notifForm.department} onChange={e => setNotifForm(f => ({ ...f, department: e.target.value }))} className="bg-slate-700 border border-slate-600 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500">
                      <option value="">All Departments</option>
                      {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={notifForm.year} onChange={e => setNotifForm(f => ({ ...f, year: e.target.value }))} className="bg-slate-700 border border-slate-600 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500">
                      <option value="">All Years</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                )}

                {/* Priority */}
                <div className="flex gap-2">
                  {[['urgent', '🔴 Urgent'], ['recommended', '🟡 Recommended'], ['general', '🟢 General']].map(([val, label]) => (
                    <button key={val} onClick={() => setNotifForm(f => ({ ...f, priority: val }))} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${notifForm.priority === val ? priorityColors[val] : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                      {label}
                    </button>
                  ))}
                </div>

                <input value={notifForm.title} onChange={e => setNotifForm(f => ({ ...f, title: e.target.value }))} placeholder="Notification title..." className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm transition-colors" />
                <textarea value={notifForm.message} onChange={e => setNotifForm(f => ({ ...f, message: e.target.value }))} placeholder="Write your message..." rows={4} className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm resize-none transition-colors" />

                <button onClick={handleSendNotif} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30">
                  <FiSend /> Send Notification
                </button>
              </div>

              {/* Sent History */}
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2"><FiBell className="text-indigo-400" /> Sent Notifications ({sentNotifs.length})</h3>
                {sentNotifs.length === 0 ? (
                  <div className="text-center py-12">
                    <FiBell className="text-4xl text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No notifications sent yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {sentNotifs.map(n => (
                      <div key={n.id} className={`p-4 rounded-xl border ${priorityColors[n.priority] || priorityColors.general}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm">{priorityEmoji[n.priority]} {n.title}</span>
                          <span className="text-xs opacity-60">{new Date(n.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs opacity-80 leading-relaxed">{n.message}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs opacity-60 bg-white/5 px-2 py-0.5 rounded">{n.type === 'global' ? '🌍 Global' : `🎯 ${n.department || 'All'} · ${n.year || 'All years'}`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ════════ MODALS ════════ */}

      {/* Reset Password Modal */}
      {resetModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md space-y-5">
            <div>
              <h3 className="text-white font-black text-xl">Reset Password</h3>
              <p className="text-slate-400 text-sm mt-1">Set new password for <span className="text-indigo-400 font-bold">{resetModal.name}</span></p>
            </div>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 4 chars)" className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm" />
            <div className="flex gap-3">
              <button onClick={() => { setResetModal(null); setNewPassword(''); }} className="flex-1 py-3 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-xl font-bold text-sm transition-colors"><FiX className="inline mr-2" />Cancel</button>
              <button onClick={handleReset} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-600/30"><FiCheck className="inline mr-2" />Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 w-full max-w-md space-y-5">
            <div className="text-center">
              <FiTrash2 className="text-red-500 text-4xl mx-auto mb-3" />
              <h3 className="text-white font-black text-xl">Delete User?</h3>
              <p className="text-slate-400 text-sm mt-2">This will permanently remove <span className="text-red-400 font-bold">{deleteModal.name}</span> from the platform. This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-3 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-xl font-bold text-sm transition-colors"><FiX className="inline mr-2" />Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm transition-colors"><FiTrash2 className="inline mr-2" />Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {eventModal !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-lg space-y-5 my-8">
            <h3 className="text-white font-black text-xl">{eventModal === 'add' ? '➕ Add New Event' : '✏️ Edit Event'}</h3>
            <input value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} placeholder="Event Title *" className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm" />
            <textarea value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm resize-none" />
            <select value={eventForm.type} onChange={e => setEventForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm">
              <option>Hackathon</option><option>Workshop</option><option>Club</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 block">Start Date</label>
                <input type="date" value={eventForm.startDate} onChange={e => setEventForm(f => ({ ...f, startDate: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm" />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 block">Deadline *</label>
                <input type="date" value={eventForm.deadline} onChange={e => setEventForm(f => ({ ...f, deadline: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm" />
              </div>
            </div>
            <input value={eventForm.location} onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))} placeholder="Location (leave blank if online)" className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm" />
            <input value={eventForm.link} onChange={e => setEventForm(f => ({ ...f, link: e.target.value }))} placeholder="Online Link (optional)" className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm" />
            <input value={eventForm.skills} onChange={e => setEventForm(f => ({ ...f, skills: e.target.value }))} placeholder="Required Skills (e.g. Python, React)" className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm" />
            <div className="flex gap-3">
              <button onClick={() => setEventModal(null)} className="flex-1 py-3 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-xl font-bold text-sm transition-colors">Cancel</button>
              <button onClick={handleEventSave} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-600/30">
                {eventModal === 'add' ? 'Create Event' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;