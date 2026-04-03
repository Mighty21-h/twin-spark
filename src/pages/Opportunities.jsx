// src/pages/Opportunities.jsx
import { useState } from 'react';
import OpportunitiesGrid from '../components/OpportunitiesGrid';
import { FiSearch, FiFilter, FiBriefcase, FiLayout, FiBookOpen, FiStar, FiSettings } from 'react-icons/fi';

const Opportunities = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('opportunities');

    const menuItems = [
        { id: 'overview', icon: <FiLayout />, label: 'Overview', path: '/dashboard' },
        { id: 'learning', icon: <FiBookOpen />, label: 'My Learning', path: '/language' },
        { id: 'opportunities', icon: <FiBriefcase />, label: 'Opportunities', path: '/opportunities' },
        { id: 'favorites', icon: <FiStar />, label: 'Favorites', path: '#' },
        { id: 'settings', icon: <FiSettings />, label: 'Settings', path: '#' },
    ];

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--background))]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Navigation Sidebar */}
                    <aside className="lg:w-64 space-y-2">
                        {menuItems.map((item) => (
                            <a
                                key={item.id}
                                href={item.path}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                                    activeTab === item.id
                                        ? 'premium-gradient text-white shadow-lg shadow-blue-500/25'
                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {item.label}
                            </a>
                        ))}
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black">Explore <span className="text-blue-600">Opportunities</span></h1>
                            <p className="text-xl text-gray-500 dark:text-gray-400">Unlock your next big career or academic milestone in Ethiopia.</p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative group">
                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by role, company, or skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-8 py-5 bg-white dark:bg-gray-800 border-none rounded-[2rem] shadow-xl focus:ring-4 focus:ring-blue-500/10 transition-all text-lg"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <FiFilter className="text-xl" />
                            </button>
                        </div>

                        {/* Grid */}
                        <OpportunitiesGrid limit={10} />

                        {/* CTA */}
                        <div className="premium-gradient rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group text-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
                            <h2 className="text-3xl font-black mb-4">Can't find what you're looking for?</h2>
                            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Subscribe to our weekly digest and be the first to know about new scholarships and internships.</p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 px-6 py-4 rounded-2xl text-gray-900 bg-white/90 backdrop-blur-sm border-none focus:ring-4 focus:ring-blue-400/30"
                                />
                                <button className="px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:scale-105 transition-transform shadow-xl">
                                    Join Us
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Opportunities;
