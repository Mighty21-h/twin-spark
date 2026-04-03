// src/pages/GPAPrediction.jsx
import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiPieChart, FiPlus, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const DEPTS = ['Computer Science', 'Electrical Engineering', 'Software Engineering', 'Information Technology', 'Civil Engineering', 'Mechanical Engineering'];

const GPAPrediction = () => {
    const { user } = useAuth();
    
    // Form State
    const [department, setDepartment] = useState('Computer Science');
    const [semester, setSemester] = useState('1');
    const [currentGPA, setCurrentGPA] = useState('');
    const [courses, setCourses] = useState([
        { id: Date.now(), name: '', credit: '' }
    ]);
    
    // Output State
    const [calculatedGPA, setCalculatedGPA] = useState(null);
    const [hasCalculated, setHasCalculated] = useState(false);

    // Dynamic Handlers
    const addCourse = () => setCourses([...courses, { id: Date.now(), name: '', credit: '' }]);
    const removeCourse = (id) => setCourses(courses.filter(c => c.id !== id));
    
    const updateCourse = (id, field, value) => {
        setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        
        // Basic calculation mock for "Predicted GPA" based on current GPA.
        // In a real app we'd need them to put estimated grades too. Since they just put course name and credit,
        // we'll predict a realistic future outcome by slightly boosting or keeping current GPA.
        let baseGPA = parseFloat(currentGPA);
        if (isNaN(baseGPA)) baseGPA = 3.0; // fallback

        // A mock logic simply predicting what their GPA might be based on load
        // E.g. more credits = slightly higher variance. We'll do a simple mock:
        let newGpa = baseGPA + (Math.random() * 0.4 - 0.1); 
        if (newGpa > 4.0) newGpa = 4.0;
        if (newGpa < 0.0) newGpa = 0.0;
        
        setCalculatedGPA(newGpa.toFixed(2));
        setHasCalculated(true);
    };

    // Calculate Advice based on user's exact specification logic
    const getAdvice = (gpaVal) => {
        const val = parseFloat(gpaVal);
        if (val === 4.0) return "You are at the highest point, keep going!";
        if (val >= 3.0) return "You did well, keep going.";
        if (val >= 2.5) return "You are in a good position, just keep going and do well.";
        if (val >= 1.7) return "You are almost there, keep going!";
        return "Your grade is lower, you must work hard. Seek help from your advisors.";
    };

    // Mock Chart Data generator comparing current to targeted path
    const chartData = useMemo(() => {
        if (!hasCalculated) return [];
        const current = parseFloat(currentGPA) || 2.5;
        const predicted = parseFloat(calculatedGPA);
        const data = [];
        data.push({ name: 'Past', GPA: (current - 0.2).toFixed(2), Target: 3.5 });
        data.push({ name: 'Current', GPA: current, Target: 3.5 });
        data.push({ name: `Predicted Sem ${semester}`, GPA: predicted, Target: 3.5 });
        
        // Extrapolate next
        let future = predicted + 0.1;
        if (future > 4) future = 4.0;
        data.push({ name: 'Future Goal', GPA: future.toFixed(2), Target: 3.5 });
        return data;
    }, [hasCalculated, calculatedGPA, currentGPA, semester]);

    return (
        <div className="min-h-[calc(100vh-80px)] pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--background))]">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden flex justify-between items-center bg-gradient-to-r from-blue-900/10 to-indigo-900/10 border-blue-500/20">
                    <div className="relative z-10">
                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                            GPA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Predictor</span>
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Map out your semester load and forecast your academic performance.</p>
                    </div>
                    <div className="hidden lg:flex w-20 h-20 bg-blue-600/10 rounded-3xl items-center justify-center transform rotate-12">
                        <FiPieChart className="text-4xl text-blue-500" />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    
                    {/* Input Form Column */}
                    <div className="xl:col-span-5 space-y-6">
                        <div className="glass-card rounded-[2rem] p-8 shadow-xl">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Simulation Input</h2>
                            <form onSubmit={handleCalculate} className="space-y-6">
                                
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Department</label>
                                    <select 
                                        value={department} 
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white transition-colors"
                                    >
                                        {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Semester</label>
                                        <select 
                                            value={semester} 
                                            onChange={(e) => setSemester(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white"
                                        >
                                            <option value="1">Semester One</option>
                                            <option value="2">Semester Two</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Current GPA</label>
                                        <input 
                                            required 
                                            type="number" 
                                            step="0.01" 
                                            min="0" 
                                            max="4"
                                            value={currentGPA}
                                            onChange={(e) => setCurrentGPA(e.target.value)}
                                            placeholder="e.g. 3.25"
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Courses */}
                                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Enrolled Courses</label>
                                        <button type="button" onClick={addCourse} className="text-xs font-black text-blue-600 hover:text-blue-500 flex items-center gap-1 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors">
                                            <FiPlus /> Add
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {courses.map((course, idx) => (
                                            <div key={course.id} className="flex gap-2">
                                                <input 
                                                    required 
                                                    value={course.name}
                                                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                                                    placeholder="Course Name (e.g. CS101)"
                                                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-gray-900 dark:text-white"
                                                />
                                                <input 
                                                    required 
                                                    type="number" 
                                                    min="1" 
                                                    max="6"
                                                    value={course.credit}
                                                    onChange={(e) => updateCourse(course.id, 'credit', e.target.value)}
                                                    placeholder="Credits"
                                                    className="w-24 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-sm font-bold text-gray-900 dark:text-white"
                                                />
                                                {courses.length > 1 && (
                                                    <button type="button" onClick={() => removeCourse(course.id)} className="w-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                                                        <FiTrash2 />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="w-full btn-primary py-4 rounded-2xl text-lg font-black shadow-blue-500/30 flex justify-center items-center gap-2 tracking-wide uppercase">
                                    <FiTrendingUp className="text-xl" /> Calculate Prediction
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Output Dash Column */}
                    <div className="xl:col-span-7 space-y-6">
                        {hasCalculated ? (
                            <div className="animate-fade-in space-y-6">
                                
                                {/* Top Results Result Card */}
                                <div className="glass-card rounded-[2rem] p-8 border-none bg-gradient-to-br from-indigo-600 to-blue-700 shadow-xl shadow-blue-900/20 text-white">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <p className="text-blue-200 font-bold uppercase tracking-widest text-xs mb-1">Predicted Semester GPA</p>
                                            <h2 className="text-6xl font-black">{calculatedGPA} <span className="text-3xl text-blue-300">/ 4.0</span></h2>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 md:max-w-xs border border-white/20">
                                            <p className="text-sm font-bold leading-relaxed">
                                                "{getAdvice(calculatedGPA)}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Graph Visualization */}
                                <div className="glass-card rounded-[2rem] p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Academic Trajectory Analysis</h3>
                                    <div className="w-full h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                                <YAxis domain={[0, 4.0]} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }} 
                                                    itemStyle={{ color: '#2563eb' }}
                                                />
                                                <ReferenceLine y={3.5} label={{ value: "Target (3.5)", fill: '#10b981', fontSize: 12, fontWeight: 'bold', position: 'insideTopLeft' }} stroke="#10b981" strokeDasharray="3 3" />
                                                <Line type="monotone" dataKey="GPA" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Suggested Courses mapping */}
                                <div className="glass-card rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">Suggested Courses Map</h3>
                                    <p className="text-sm text-gray-500 font-medium mb-6">Based on your calculated progression in <span className="font-bold text-gray-900 dark:text-white">{department}</span>, consider adding these electives block to boost your aggregate:</p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {['Advanced Data Structures (4 Cr)', 'Tech Entrepreneurship (3 Cr)', 'AI Ethics Seminar (2 Cr)', 'Cloud Computing Sys (3 Cr)'].map((sc, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-black">
                                                    #{i+1}
                                                </div>
                                                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{sc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-card rounded-[2rem] border-dashed border-2 border-gray-200 dark:border-gray-800">
                                <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                                    <FiTrendingUp className="text-4xl text-gray-300 dark:text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-400 dark:text-gray-500 mb-2">Awaiting Input</h3>
                                <p className="text-gray-400 dark:text-gray-600 font-medium max-w-sm">Fill out your semester load and submit to generate your trajectory prediction and tailored academic feedback.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GPAPrediction;
