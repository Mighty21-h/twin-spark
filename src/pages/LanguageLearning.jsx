// src/pages/LanguageLearning.jsx
import { useState } from 'react';
import { FiPlay, FiCheck, FiZap, FiLayout, FiBookOpen, FiStar, FiSettings, FiBriefcase } from 'react-icons/fi';

const LanguageLearning = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('amharic');
    const [streak] = useState(7);
    const [progress] = useState(65);
    const [activeTab] = useState('learning');

    const menuItems = [
        { id: 'overview', icon: <FiLayout />, label: 'Overview', path: '/dashboard' },
        { id: 'learning', icon: <FiBookOpen />, label: 'My Learning', path: '/language' },
        { id: 'opportunities', icon: <FiBriefcase />, label: 'Opportunities', path: '/opportunities' },
        { id: 'favorites', icon: <FiStar />, label: 'Favorites', path: '#' },
        { id: 'settings', icon: <FiSettings />, label: 'Settings', path: '#' },
    ];

    const languages = [
        { id: 'amharic', name: 'አማርኛ (Amharic)', flag: '🇪🇹', level: 'Intermediate', color: 'blue' },
        { id: 'oromo', name: 'Afaan Oromoo', flag: '🇪🇹', level: 'Beginner', color: 'emerald' },
        { id: 'tigrinya', name: 'ትግርኛ (Tigrinya)', flag: '🇪🇹', level: 'Beginner', color: 'purple' },
        { id: 'english', name: 'English', flag: '🇺🇸', level: 'Advanced', color: 'indigo' }
    ];

    const lessons = [
        { title: 'Basic Greetings', completed: true, duration: '10 min' },
        { title: 'Numbers 1-100', completed: true, duration: '15 min' },
        { title: 'Daily Phrases', completed: false, duration: '12 min' },
        { title: 'Food & Shopping', completed: false, duration: '20 min' }
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
                    <main className="flex-1 space-y-8">
                        {/* Header Stats */}
                        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="space-y-2 text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-black">Master <span className="text-blue-600">Translation</span></h1>
                                <p className="text-xl text-gray-500 dark:text-gray-400">Your localized learning journey.</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-3xl font-black text-orange-500 flex items-center gap-2 justify-center">
                                        <FiZap /> {streak}
                                    </p>
                                    <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Day Streak</p>
                                </div>
                                <div className="h-16 w-px bg-gray-200 dark:bg-gray-700 hidden md:block" />
                                <div className="text-center">
                                    <p className="text-3xl font-black text-blue-600">{progress}%</p>
                                    <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Complete</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Language Picker */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black px-4">Choose Language</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.id}
                                            onClick={() => setSelectedLanguage(lang.id)}
                                            className={`p-6 rounded-3xl border-4 transition-all flex items-center gap-6 ${
                                                selectedLanguage === lang.id
                                                    ? 'bg-white dark:bg-gray-800 border-blue-500/50 shadow-2xl'
                                                    : 'bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <span className="text-4xl">{lang.flag}</span>
                                            <div className="flex-1 text-left">
                                                <h4 className="text-xl font-black">{lang.name}</h4>
                                                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{lang.level}</p>
                                            </div>
                                            {selectedLanguage === lang.id && <div className="w-4 h-4 bg-blue-600 rounded-full animate-ping" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Lessons List */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black px-4">Current Curriculum</h3>
                                <div className="space-y-4">
                                    {lessons.map((lesson, idx) => (
                                        <div key={idx} className="glass-card rounded-[2rem] p-6 flex items-center gap-6 hover:scale-[1.02] transition-transform cursor-pointer group">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-lg ${
                                                lesson.completed ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                                            }`}>
                                                {lesson.completed ? <FiCheck /> : <FiPlay />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-black group-hover:text-blue-600 transition-colors">{lesson.title}</h4>
                                                <p className="text-sm text-gray-500 font-bold">{lesson.duration} • Interactive Quiz</p>
                                            </div>
                                            <div className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                {lesson.completed ? 'Review' : 'Locked'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default LanguageLearning;