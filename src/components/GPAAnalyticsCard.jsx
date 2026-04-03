// src/components/GPAAnalyticsCard.jsx
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'react-hot-toast';
import { mockGPAData } from '../utils/mockData';
import { FiTrendingUp, FiActivity, FiTarget } from 'react-icons/fi';

const GPAAnalyticsCard = () => {
    const [formData, setFormData] = useState({
        currentGPA: 3.5,
        targetGPA: 3.8,
        studyHours: 20
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Mock prediction logic
        setTimeout(() => {
            const predicted = Math.min(4.0, formData.currentGPA + (formData.studyHours / 100));
            setPrediction({
                predictedGPA: predicted,
                improvement: (predicted - formData.currentGPA).toFixed(2),
                status: predicted >= formData.targetGPA ? 'On Track' : 'Needs Effort',
                recommendation: predicted >= formData.targetGPA 
                    ? "Excellent consistency! Maintain your current study rhythm."
                    : "To reach your target, consider increasing study hours by 5/week."
            });
            toast.success('Analysis complete!', {
                style: {
                    borderRadius: '15px',
                    background: '#333',
                    color: '#fff',
                },
            });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-8">
            {/* Input Form */}
            <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <FiActivity className="text-blue-500" /> Current GPA
                    </label>
                    <input
                        type="number" step="0.01" max="4"
                        value={formData.currentGPA}
                        onChange={(e) => setFormData({...formData, currentGPA: parseFloat(e.target.value)})}
                        className="w-full px-5 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xl"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <FiTarget className="text-emerald-500" /> Target GPA
                    </label>
                    <input
                        type="number" step="0.01" max="4"
                        value={formData.targetGPA}
                        onChange={(e) => setFormData({...formData, targetGPA: parseFloat(e.target.value)})}
                        className="w-full px-5 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-xl"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-4 text-lg shadow-blue-500/20"
                    >
                        {loading ? 'Analyzing...' : 'Run Analytics'}
                    </button>
                </div>
            </form>

            {/* Visualization Area */}
            <div className="h-72 w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockGPAData}>
                        <defs>
                            <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                            dataKey="semester" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 600}}
                            dy={10}
                        />
                        <YAxis 
                            domain={[2, 4]} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 600}}
                        />
                        <Tooltip 
                            contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="gpa" 
                            stroke="#2563EB" 
                            strokeWidth={4} 
                            fillOpacity={1} 
                            fill="url(#colorGpa)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Prediction Result Overlay */}
            {prediction && (
                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl animate-float">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <FiTrendingUp className="text-3xl" />
                            <div>
                                <p className="text-blue-100 text-xs font-black uppercase tracking-widest leading-none mb-1">Status</p>
                                <p className="text-xl font-black">{prediction.status}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-100 text-xs font-black uppercase tracking-widest leading-none mb-1">Predicted</p>
                            <p className="text-3xl font-black">{prediction.predictedGPA.toFixed(2)}</p>
                        </div>
                    </div>
                    <p className="text-lg opacity-90 font-medium italic">"{prediction.recommendation}"</p>
                </div>
            )}
        </div>
    );
};

export default GPAAnalyticsCard;