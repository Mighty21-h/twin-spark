// src/components/AISuggestions.jsx
import { FiZap, FiBookOpen, FiStar, FiChevronRight } from 'react-icons/fi';

const AISuggestions = () => {
    const suggestions = [
        {
            id: 1,
            icon: <FiBookOpen className="text-blue-500" />,
            title: "Next Skill: CSS Grid",
            description: "You've mastered Flexbox. Grid will help you build complex layouts.",
            type: "Learning",
            tag: "High Priority"
        },
        {
            id: 2,
            icon: <FiStar className="text-yellow-500" />,
            title: "Hackathon Alert",
            description: "AI Ethiopia matches your Computer Science skills perfectly!",
            type: "Event",
            tag: "Popular"
        }
    ];

    return (
        <div className="space-y-6">
            {suggestions.map((item) => (
                <div key={item.id} className="p-6 rounded-3xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all border-2 border-transparent hover:border-blue-500/20 group cursor-pointer">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center text-xl shadow-sm">
                            {item.icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.type}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">{item.tag}</span>
                            </div>
                            <h4 className="font-black text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{item.description}</p>
                            <button className="flex items-center gap-2 text-xs font-black text-blue-600 group-hover:gap-3 transition-all">
                                TAKE ACTION <FiChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                    <FiZap className="animate-pulse" />
                    <p className="text-xs font-bold">Ask AI for more personalized recommendations</p>
                </div>
            </div>
        </div>
    );
};

export default AISuggestions;