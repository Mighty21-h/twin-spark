// src/pages/Notifications.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiBell, FiTrash2, FiCheckCircle, FiInfo, FiAlertTriangle, FiTarget, FiFilter } from 'react-icons/fi';

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [priorityFilter, setPriorityFilter] = useState('all');

    useEffect(() => {
        // Load default mock notifications
        const defaultNotifs = [
            {
                id: 1,
                title: "Welcome to BILIH!",
                message: "Thank you for joining our mission to empower Ethiopian students. Start exploring opportunities now!",
                date: "2026-04-02T10:00:00Z",
                priority: "general",
                read: false
            },
            {
                id: 2,
                title: "Google Africa Scholarship Deadline Approaching!",
                message: "Your saved scholarship application deadline is in 2 days. Make sure to submit!",
                date: "2026-04-03T08:30:00Z",
                priority: "urgent",
                read: false
            },
            {
                id: 3,
                title: "New AI Study Group",
                message: "A new study group for Artificial Intelligence just opened up. We recommend joining based on your profile.",
                date: "2026-04-01T09:15:00Z",
                priority: "recommended",
                read: true
            }
        ];

        // Load admin notifications from localStorage
        let adminNotifs = [];
        try {
            const stored = JSON.parse(localStorage.getItem('bilih_notifications') || '[]');
            // Filter admin notifications based on user department/year if targeted
            adminNotifs = stored.filter(n => {
                if (n.type === 'global') return true;
                if (!user) return false;
                const matchDept = !n.department || n.department === user.department;
                const matchYear = !n.year || n.year === user.year;
                return matchDept && matchYear;
            });
        } catch { /* ignore */ }

        // Combine and load any user-specific saved state (read status)
        // For simplicity, we just merge them here. In real app, read status would persist mapping ID to boolean.
        setNotifications([...adminNotifs, ...defaultNotifs]);
    }, [user]);

    const filteredNotifications = notifications
        .filter(n => priorityFilter === 'all' || n.priority === priorityFilter)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'urgent': return { icon: <FiAlertTriangle />, colors: 'text-red-500 bg-red-50 dark:bg-red-500/10 ring-red-500/20', badge: 'bg-red-500 text-white', label: '🔴 Urgent' };
            case 'recommended': return { icon: <FiTarget />, colors: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 ring-yellow-500/20', badge: 'bg-yellow-400 text-yellow-900', label: '🟡 Recommended' };
            case 'general':
            default: return { icon: <FiInfo />, colors: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 ring-emerald-500/20', badge: 'bg-emerald-500 text-white', label: '🟢 General' };
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--background))]">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                            <FiBell className="text-blue-600" /> Notifications
                        </h1>
                        <p className="text-xl text-gray-500 font-medium tracking-tight">Stay updated with your academic journey</p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={markAllAsRead}
                            className="text-sm font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-xl transition-all"
                        >
                            Mark all read
                        </button>
                        <button 
                            onClick={() => setNotifications([])}
                            className="text-sm font-black text-red-500 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-all"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <button 
                        onClick={() => setPriorityFilter('all')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${priorityFilter === 'all' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <FiFilter className="inline mr-2" /> All Priorities
                    </button>
                    {['urgent', 'recommended', 'general'].map(p => (
                        <button 
                            key={p}
                            onClick={() => setPriorityFilter(p)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${priorityFilter === p ? getPriorityStyles(p).badge : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                        >
                            {getPriorityStyles(p).label}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => {
                            const styles = getPriorityStyles(notification.priority || 'general');
                            return (
                                <div 
                                    key={notification.id}
                                    className={`glass-card p-6 rounded-[2rem] border-none shadow-lg transition-all duration-300 relative group overflow-hidden ${
                                        !notification.read ? `ring-2 ${styles.colors.split(' ')[2]} ${styles.colors.split(' ')[1]} shadow-xl scale-[1.01]` : 'opacity-80 hover:opacity-100'
                                    }`}
                                >
                                    <div className="flex gap-5 items-start">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md bg-white dark:bg-gray-800 border ${styles.colors.split(' ')[0]}`}>
                                            {styles.icon}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex justify-between items-start gap-4 mb-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className={`text-xl font-bold truncate ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                        {notification.title}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${styles.badge}`}>
                                                        {styles.label.split(' ')[1]}
                                                    </span>
                                                    {notification.fromAdmin && (
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                            Announcement
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                                                    {new Date(notification.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className={`text-base leading-relaxed ${!notification.read ? 'text-gray-600 dark:text-gray-300 font-medium' : 'text-gray-500 dark:text-gray-500'}`}>
                                                {notification.message}
                                            </p>
                                            
                                            <div className="pt-3 flex gap-4">
                                                {!notification.read && (
                                                    <button 
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => deleteNotification(notification.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete notification"
                                        >
                                            <FiTrash2 className="text-lg" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-24 space-y-6 glass-card rounded-[3rem]">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-4xl text-gray-300">
                                <FiBell />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-400">
                                {priorityFilter === 'all' ? 'No new notifications' : `No ${priorityFilter} notifications`}
                            </h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
