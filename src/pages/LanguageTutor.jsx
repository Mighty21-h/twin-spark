import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiCpu, FiUser, FiGlobe, FiMessageSquare, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const LanguageTutor = () => {
    const { user } = useAuth();
    const [sourceLanguage, setSourceLanguage] = useState('English');
    const [targetLanguage, setTargetLanguage] = useState('Amharic');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    // Languages supported
    const languages = [
        { id: 'Amharic', name: 'Amharic (አማርኛ)', flag: '🇪🇹' },
        { id: 'Afaan Oromo', name: 'Afaan Oromoo', flag: '🇪🇹' },
        { id: 'English', name: 'English', flag: '🇬🇧' }
    ];

    // Load History from DB on mount
    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                // For Hackathon/Mock: Send the user object as a "token"
                const token = encodeURIComponent(JSON.stringify(user));
                const response = await fetch('http://localhost:5000/api/languages/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (result.success) {
                    const formatted = result.history.reverse().flatMap(h => [
                        { role: 'user', content: h.input_text, timestamp: h.timestamp, from: h.from_lang, to: h.to_lang },
                        { role: 'assistant', content: h.ai_response, timestamp: h.timestamp }
                    ]);
                    setMessages(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch history");
            }
        };
        fetchHistory();
    }, [user]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || isLoading || !user) return;

        const userMsg = { role: 'user', content: inputText, timestamp: new Date(), from: sourceLanguage, to: targetLanguage };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            // For Hackathon/Mock: Send the user object as a "token"
            const token = encodeURIComponent(JSON.stringify(user));
            const response = await fetch('http://localhost:5000/api/languages/practice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sourceLanguage,
                    targetLanguage,
                    inputText: userMsg.content
                })
            });

            const result = await response.json();

            if (result.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: result.reply, timestamp: new Date() }]);
            } else {
                toast.error(result.message || "Failed to get response");
            }
        } catch (error) {
            toast.error("Network Error: Could not reach the tutor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--background))]">
            <div className="max-w-5xl mx-auto h-[calc(100vh-180px)] flex flex-col gap-6">
                
                {/* Header with Dual Language Selector */}
                <div className="glass-card rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-3">
                            <FiCpu className="text-indigo-600 animate-pulse" /> AI <span className="text-indigo-600">Translator</span>
                        </h1>
                        <p className="text-gray-500 font-bold text-sm">Select language pair and start practicing.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-3xl border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">From</span>
                            <select 
                                value={sourceLanguage}
                                onChange={(e) => setSourceLanguage(e.target.value)}
                                className="bg-white dark:bg-gray-700 border-none rounded-xl text-xs font-black px-4 py-2 outline-none"
                            >
                                {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        
                        <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg">
                            <FiArrowRight />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">To</span>
                            <select 
                                value={targetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                                className="bg-white dark:bg-gray-700 border-none rounded-xl text-xs font-black px-4 py-2 outline-none"
                            >
                                {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Chat Section */}
                <div className="flex-1 flex flex-col glass-card rounded-[2.5rem] overflow-hidden shadow-2xl relative border-none">
                    
                    {/* Message Area */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gray-50/30 dark:bg-gray-900/10"
                    >
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-40">
                                <FiMessageSquare className="text-7xl mb-4" />
                                <h3 className="text-xl font-bold">Try translating!</h3>
                                <p className="max-w-xs mx-auto">Selected: {sourceLanguage} to {targetLanguage}.</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-indigo-600'}`}>
                                        {msg.role === 'user' ? <FiUser /> : <FiGlobe />}
                                    </div>
                                    <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl shadow-sm border ${msg.role === 'user' ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' : 'bg-white dark:bg-gray-800 dark:text-white border-gray-100 dark:border-gray-700 rounded-tl-none font-medium'}`}>
                                        {msg.role === 'user' && (
                                            <span className="text-[10px] font-black uppercase opacity-60 block mb-1">
                                                {msg.from} &rarr; {msg.to}
                                            </span>
                                        )}
                                        <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                                        <span className="text-[10px] opacity-60 mt-2 block font-bold text-right italic">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex items-start gap-4 animate-pulse">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 text-indigo-600 flex items-center justify-center">
                                    <FiGlobe />
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <input 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                disabled={isLoading}
                                placeholder={`Translate from ${sourceLanguage}...`}
                                className="flex-1 bg-gray-100 dark:bg-gray-800 border-none px-6 py-4 rounded-2xl font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                            />
                            <button 
                                disabled={!inputText.trim() || isLoading}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white h-14 w-14 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/25 transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                            >
                                <FiSend className="text-xl" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LanguageTutor;
