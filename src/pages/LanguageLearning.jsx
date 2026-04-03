import { useState } from 'react';
import { FiPlay, FiCheck, FiZap, FiBookOpen, FiStar, FiSettings, FiBriefcase, FiVolume2, FiMessageCircle, FiArrowRight, FiArrowLeft, FiHash } from 'react-icons/fi';
import { NUMBERS_DATA } from '../data/numbers';
import FeedbackSection from '../components/FeedbackSection';

const TRANSLATIONS = {
    'amharic': [
        { english: 'Hello', translated: 'ሰላም (Selam)' },
        { english: 'Thank you', translated: 'አመሰግናለሁ (Ameseginalehu)' },
        { english: 'How are you?', translated: 'እንዴት ነህ? / እንዴት ነሽ? (Endet neh / nesh)' },
        { english: 'Good morning', translated: 'እንደምን አደርክ / አደርሽ (Endemn Aderk / Adersh)' },
        { english: 'Goodbye', translated: 'ቻው (Chaw)' }
    ],
    'oromo': [
        { english: 'Hello', translated: 'Akkam (How are you?)' },
        { english: 'Thank you', translated: 'Galatoomaa' },
        { english: 'How are you?', translated: 'Akkam jirtu?' },
        { english: 'Good morning', translated: 'Akkam bultan' },
        { english: 'Goodbye', translated: 'Nagaatti' }
    ],
    'english': [
        { english: 'Hello', translated: 'Hello' },
        { english: 'Thank you', translated: 'Thank you' },
        { english: 'How are you?', translated: 'How are you?' },
        { english: 'Good morning', translated: 'Good morning' },
        { english: 'Goodbye', translated: 'Goodbye' }
    ]
};

const LanguageLearning = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('amharic');
    const [activeLesson, setActiveLesson] = useState(null); // 'Basic Greetings'
    const [streak] = useState(7);
    const [progress] = useState(65);
    const [numberPage, setNumberPage] = useState(0); // 0: 1-20, 1: 21-30, 2: 31-40...

    const languages = [
        { id: 'amharic', name: 'አማርኛ (Amharic)', flag: '🇪🇹', level: 'Intermediate', color: 'blue' },
        { id: 'oromo', name: 'Afaan Oromoo', flag: '🇪🇹', level: 'Beginner', color: 'emerald' },
        { id: 'english', name: 'English', flag: '🇺🇸', level: 'Advanced', color: 'indigo' }
    ];

    const lessons = [
        { title: 'Basic Greetings', completed: true, duration: '10 min', clickable: true },
        { title: 'Numbers 1-100', completed: true, duration: '15 min', clickable: true },
        { title: 'Daily Phrases', completed: false, duration: '12 min', clickable: false },
        { title: 'Food & Shopping', completed: false, duration: '20 min', clickable: false }
    ];

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--background))]">
            <div className="max-w-6xl mx-auto">
                <main className="space-y-8">
                    {/* Header Stats */}
                    <div className="glass-card rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 space-y-2 text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-black">Master <span className="text-emerald-500">Multilingualism</span></h1>
                            <p className="text-xl text-gray-500 dark:text-gray-400">Expand your cultural reach securely.</p>
                        </div>
                        <div className="flex items-center gap-6 relative z-10 bg-white/50 dark:bg-gray-800/50 p-6 rounded-3xl backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-xl">
                            <div className="text-center">
                                <p className="text-4xl font-black text-orange-500 flex items-center gap-2 justify-center drop-shadow-sm">
                                    <FiZap /> {streak}
                                </p>
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mt-1">Day Streak</p>
                            </div>
                            <div className="h-16 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block" />
                            <div className="text-center">
                                <p className="text-4xl font-black text-emerald-500 drop-shadow-sm">{progress}%</p>
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mt-1">Complete</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* Language Picker Column */}
                        <div className="xl:col-span-5 space-y-6">
                            <h3 className="text-2xl font-black px-2 flex items-center gap-3">
                                <span className="bg-emerald-500/20 text-emerald-500 p-2 rounded-xl"><FiVolume2 /></span> Language 
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.id}
                                        onClick={() => { setSelectedLanguage(lang.id); setActiveLesson(null); }}
                                        className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-6 group ${
                                            selectedLanguage === lang.id
                                                ? 'bg-white dark:bg-gray-800 border-emerald-500 shadow-xl shadow-emerald-500/20'
                                                : 'bg-transparent border-transparent hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                        }`}
                                    >
                                        <span className="text-4xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                                        <div className="flex-1 text-left">
                                            <h4 className="text-xl font-black text-gray-900 dark:text-white">{lang.name}</h4>
                                            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{lang.level}</p>
                                        </div>
                                        {selectedLanguage === lang.id && <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 space-y-4">
                                <h3 className="text-xl font-black px-2">Select a Lesson</h3>
                                {lessons.map((lesson, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => lesson.clickable && setActiveLesson(lesson.title)}
                                        disabled={!lesson.clickable}
                                        className={`w-full glass-card rounded-2xl p-5 flex items-center transition-all group ${!lesson.clickable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] cursor-pointer hover:border-emerald-500/50'} ${activeLesson === lesson.title ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : ''}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-md mr-5 transition-colors ${
                                            activeLesson === lesson.title ? 'bg-emerald-500 text-white' : (lesson.completed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-200 dark:bg-gray-700 text-gray-500')
                                        }`}>
                                            {lesson.completed ? <FiCheck /> : <FiPlay />}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h4 className={`text-base font-black transition-colors ${activeLesson === lesson.title ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>{lesson.title}</h4>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">{lesson.duration}</p>
                                        </div>
                                        {lesson.clickable && <FiArrowRight className={`text-xl transition-all ${activeLesson === lesson.title ? 'text-emerald-500 translate-x-1' : 'text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1'}`} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interactive View Column */}
                        <div className="xl:col-span-7">
                            {!activeLesson ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-card rounded-[2.5rem] border-dashed border-2 border-gray-200 dark:border-gray-800 relative overflow-hidden group">
                                    <div className="w-24 h-24 rounded-full bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <FiMessageCircle className="text-4xl text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Begin Learning</h3>
                                    <p className="text-gray-500 font-medium max-w-sm">Select a language on the left and click "Basic Greetings" to start your immersive translation session.</p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-fade-in relative">
                                    <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-600/30">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-2xl font-black flex items-center gap-2"><FiMessageCircle /> {activeLesson}</h3>
                                            <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest">{selectedLanguage}</span>
                                        </div>
                                        <p className="text-emerald-100 font-medium">Click on the English phrases below to see the exact {languages.find(l=>l.id===selectedLanguage)?.name} translation.</p>
                                    </div>

                                    <div className="space-y-4">
                                        {activeLesson === 'Basic Greetings' ? (
                                            TRANSLATIONS[selectedLanguage]?.map((item, idx) => (
                                                <div key={idx} className="glass-card rounded-[2rem] p-6 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-colors group flex items-center justify-between">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 font-black text-xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs uppercase tracking-widest font-black text-emerald-500 mb-1">English</p>
                                                            <p className="text-lg font-black text-gray-900 dark:text-white">{item.english}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <FiArrowRight className="text-gray-300 dark:text-gray-700 text-2xl hidden md:block" />

                                                    <div className="text-right">
                                                        <p className="text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Translation</p>
                                                        <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl inline-block border border-emerald-100 dark:border-emerald-800/30">
                                                            {item.translated}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {NUMBERS_DATA.slice(numberPage === 0 ? 0 : 20 + (numberPage - 1) * 10, numberPage === 0 ? 20 : 20 + numberPage * 10).map((num) => (
                                                        <div key={num.id} className="glass-card rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/30 transition-all flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 font-black flex items-center justify-center border border-emerald-500/20">
                                                                {num.id}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="text-xs font-bold uppercase text-gray-400 tracking-tighter">English</span>
                                                                    <span className="text-sm font-black text-gray-900 dark:text-white">{num.english}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs font-bold uppercase text-emerald-500/60 tracking-tighter">
                                                                        {selectedLanguage === 'amharic' ? 'Amharic' : (selectedLanguage === 'oromo' ? 'Afaan Oromo' : 'Translation')}
                                                                    </span>
                                                                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                                                                        {selectedLanguage === 'amharic' ? num.amharic : (selectedLanguage === 'oromo' ? num.oromo : num.english)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                <div className="flex items-center justify-between pt-6">
                                                    <button 
                                                        onClick={() => setNumberPage(p => Math.max(0, p - 1))}
                                                        disabled={numberPage === 0}
                                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all ${numberPage === 0 ? 'opacity-30 cursor-not-allowed grayscale' : 'bg-white dark:bg-gray-800 hover:scale-105 active:scale-95 shadow-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white'}`}
                                                    >
                                                        <FiArrowLeft /> Previous
                                                    </button>
                                                    <div className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">
                                                        {numberPage === 0 ? 'Showing 1-20' : `Showing ${21 + (numberPage - 1) * 10}-${Math.min(100, 20 + numberPage * 10)}`}
                                                    </div>
                                                    <button 
                                                        onClick={() => setNumberPage(p => Math.min(8, p + 1))}
                                                        disabled={numberPage === 8}
                                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all ${numberPage === 8 ? 'opacity-30 cursor-not-allowed grayscale' : 'bg-emerald-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30'}`}
                                                    >
                                                        Next <FiArrowRight />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Universal Feedback Section per Phase */}
                                    <FeedbackSection 
                                        category={`${languages.find(l=>l.id===selectedLanguage)?.name} ${activeLesson || 'Basics'}`} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LanguageLearning;