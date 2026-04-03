// src/components/OpportunitiesGrid.jsx
import { FiCalendar, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { mockOpportunities } from '../utils/mockData';

const OpportunitiesGrid = ({ limit }) => {
    const opportunities = limit ? mockOpportunities.slice(0, limit) : mockOpportunities;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
                <div key={opp.id} className="glass-card rounded-3xl p-6 hover:scale-[1.02] transition-all duration-300 group cursor-pointer border-transparent hover:border-blue-500/30">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                            opp.type === 'Internship' ? 'bg-blue-500/10 text-blue-600' :
                            opp.type === 'Scholarship' ? 'bg-purple-500/10 text-purple-600' :
                            'bg-emerald-500/10 text-emerald-600'
                        }`}>
                            {opp.type}
                        </span>
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{opp.category}</span>
                    </div>
                    
                    <h3 className="text-xl font-black mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{opp.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2">{opp.description}</p>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <FiMapPin className="text-blue-500" />
                            </div>
                            {opp.location}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <FiCalendar className="text-emerald-500" />
                            </div>
                            Deadline: {new Date(opp.deadline).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{opp.organization}</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                            <FiArrowRight />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OpportunitiesGrid;