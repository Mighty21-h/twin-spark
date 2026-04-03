// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiSun, FiMoon, FiSearch, FiLogOut, FiChevronDown, FiTrendingUp, FiGlobe, FiX, FiLayout, FiBookOpen, FiBriefcase, FiStar, FiSettings } from 'react-icons/fi';
import { MdNotifications } from 'react-icons/md';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isDark, setIsDark] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [notifications] = useState(5);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        setIsDark(document.documentElement.classList.contains('dark'));
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        setIsDark(!isDark);
    };

    const navLinks = [
        { label: 'Language Learning', to: '/language', icon: <FiGlobe /> },
        { label: 'GPA Prediction', to: '/gpa-prediction', icon: <FiTrendingUp /> },
        { label: 'Study Planner', to: '/study-planner', icon: <FiBookOpen /> },
        { label: 'Opportunities', to: '/opportunities', icon: <FiSearch /> },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled ? 'py-3' : 'py-5'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`glass-card rounded-3xl px-6 py-3 flex justify-between items-center transition-all duration-500 ${
                    scrolled ? 'shadow-2xl translate-y-0' : 'shadow-none'
                }`}>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsDrawerOpen(true)}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"
                        >
                            <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>

                        <Link to="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
                            BILIH
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center space-x-8">
                        <Link to="/" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Home</Link>
                        
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                                Service <FiChevronDown className="group-hover:rotate-180 transition-transform" />
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <div className="glass-card rounded-2xl shadow-2xl p-4 space-y-1">
                                    {navLinks.map((item) => (
                                        <Link
                                            key={item.label}
                                            to={item.to}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-all"
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link to="/about" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">About Us</Link>
                        <Link to="/contact" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Contact Us</Link>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="flex items-center gap-1">
                            {user && (
                                <Link 
                                    to="/notifications"
                                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl relative transition-colors"
                                >
                                    <MdNotifications className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                                        {notifications}
                                    </span>
                                </Link>
                            )}

                            <button
                                onClick={toggleDarkMode}
                                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors"
                            >
                                {isDark ? <FiSun className="w-5 h-5 text-yellow-500" /> : <FiMoon className="w-5 h-5 text-blue-600" />}
                            </button>
                        </div>

                        {user ? (
                            <div className="relative group pl-4 border-l border-gray-200 dark:border-gray-700">
                                {/* Profile Avatar - Click Target */}
                                <div className="flex items-center gap-3 cursor-pointer">
                                    <div className="hidden xl:block text-right">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-0.5">{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">@{user.username}</p>
                                    </div>
                                    <img
                                        src={user?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.name}`}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-2xl object-cover ring-2 ring-blue-500/20 hover:ring-blue-500 transition-all"
                                    />
                                </div>

                                {/* Dropdown Menu */}
                                <div className="absolute top-full right-0 mt-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                                    <div className="glass-card rounded-2xl shadow-2xl p-4 space-y-1 border border-gray-100 dark:border-gray-800">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-2">
                                            <p className="text-sm font-black text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-gray-400 font-medium">@{user.username}</p>
                                        </div>
                                        {[
                                            { label: 'My Learning', to: '/language', icon: <FiBookOpen /> },
                                            { label: 'Opportunities', to: '/opportunities', icon: <FiBriefcase /> },
                                            { label: 'Favorites', to: '/profile', icon: <FiStar /> },
                                            { label: 'Settings', to: '/profile', icon: <FiSettings /> },
                                        ].map((item) => (
                                            <Link
                                                key={item.label}
                                                to={item.to}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-all"
                                            >
                                                <span className="text-base">{item.icon}</span>
                                                {item.label}
                                            </Link>
                                        ))}
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                                            <button
                                                onClick={logout}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold text-red-500 transition-all"
                                            >
                                                <FiLogOut className="text-base" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary py-2.5 px-8 text-sm">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Drawer */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-[100] flex">
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsDrawerOpen(false)}
                    />
                    
                    {/* Drawer Content */}
                    <div className="relative w-80 bg-white dark:bg-gray-900 h-full shadow-2xl p-8 space-y-12 animate-slide-in-left">
                        <div className="flex justify-between items-center">
                            <Link to="/" onClick={() => setIsDrawerOpen(false)} className="text-3xl font-black bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                                BILIH
                            </Link>
                            <button 
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-4">Services</p>
                            <div className="space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        to={link.to}
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 font-bold transition-all group"
                                    >
                                        <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-4">
                            <Link to="/about" onClick={() => setIsDrawerOpen(false)} className="block px-6 py-2 text-gray-500 font-bold hover:text-blue-600 transition-colors uppercase tracking-widest text-sm">About Us</Link>
                            <Link to="/contact" onClick={() => setIsDrawerOpen(false)} className="block px-6 py-2 text-gray-500 font-bold hover:text-blue-600 transition-colors uppercase tracking-widest text-sm">Contact Us</Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;