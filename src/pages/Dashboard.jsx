// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GPAAnalyticsCard from '../components/GPAAnalyticsCard';
import AISuggestions from '../components/AISuggestions';
import OpportunitiesGrid from '../components/OpportunitiesGrid';
import { FiLayout, FiBookOpen, FiStar, FiSettings, FiBriefcase } from 'react-icons/fi';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    const menuItems = [
        { id: 'overview', icon: <FiLayout />, label: 'Overview' },
        { id: 'learning', icon: <FiBookOpen />, label: 'My Learning' },
        { id: 'opportunities', icon: <FiBriefcase />, label: 'Opportunities' },
        { id: 'favorites', icon: <FiStar />, label: 'Favorites' },
        { id: 'settings', icon: <FiSettings />, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--background))]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="lg:w-64 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                                    activeTab === item.id
                                        ? 'premium-gradient text-white shadow-lg shadow-blue-500/25'
                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-8">
                        {/* Welcome Header */}
                        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                            <div className="relative z-10">
                                <h1 className="text-4xl md:text-5xl font-black mb-4">
                                    Welcome back, <span className="text-blue-600">{user.name}</span>!
                                </h1>
                                <p className="text-xl text-gray-500 dark:text-gray-400">
                                    You've completed <span className="text-emerald-500 font-bold">85%</span> of your weekly goals. Keep it up!
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <div className="glass-card rounded-[2.5rem] p-8">
                                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                    <span className="p-2 bg-blue-500/10 text-blue-600 rounded-xl"><FiLayout /></span>
                                    Academic Analytics
                                </h2>
                                <GPAAnalyticsCard />
                            </div>
                            <div className="glass-card rounded-[2.5rem] p-8">
                                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                    <FiStar className="text-yellow-500" />
                                    AI Recommendations
                                </h2>
                                <AISuggestions />
                            </div>
                        </div>

                        {/* Recent Opportunities */}
                        <section>
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-3xl font-black">Tailored for You</h2>
                                    <p className="text-gray-500 dark:text-gray-400">Opportunities based on your profile</p>
                                </div>
                                <button className="text-blue-600 font-bold hover:underline">View All</button>
                            </div>
                            <OpportunitiesGrid limit={2} />
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;