// src/pages/StudyPlanner.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiCalendar, FiClock, FiBook, FiTarget, FiPlus, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

const COURSES = [
  "Data Structures and Algorithms", "Database Management Systems", "Software Engineering",
  "Computer Networks", "Operating Systems", "Artificial Intelligence", "Web Development",
  "Mobile App Development", "Calculus I", "Calculus II", "Linear Algebra", "Physics I",
  "Physics II", "Introduction to Programming", "Object Oriented Programming"
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => `${((i + 12) % 12) || 12}:00 LT`); // Ethiopian Time formatting

const COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500", "bg-fuchsia-500"
];

const StudyPlanner = () => {
  const { user } = useAuth();
  
  // Inputs
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState('');
  
  const [freeTime, setFreeTime] = useState({}); // { Monday: ["8:00", "9:00"], Tuesday: [...] }
  
  const [deadlines, setDeadlines] = useState([]);
  const [newDeadline, setNewDeadline] = useState({ task: '', date: '', completed: false });
  
  // Output
  const [schedule, setSchedule] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ─── Course Selection ────────────────────────────────────────────────────────
  const filteredCourses = COURSES.filter(c => c.toLowerCase().includes(courseSearch.toLowerCase()) && !selectedCourses.includes(c));

  const addCourse = (c) => {
    if (selectedCourses.length >= 7) { toast.error("Maximum 7 courses allowed."); return; }
    setSelectedCourses([...selectedCourses, { name: c, color: COLORS[selectedCourses.length] }]);
    setCourseSearch('');
  };

  const removeCourse = (name) => {
    setSelectedCourses(selectedCourses.filter(c => c.name !== name));
  };

  // ─── Free Time Selection ─────────────────────────────────────────────────────
  const toggleTimeSlot = (day, time) => {
    setFreeTime(prev => {
      const daySlots = prev[day] || [];
      if (daySlots.includes(time)) {
        return { ...prev, [day]: daySlots.filter(t => t !== time) };
      } else {
        return { ...prev, [day]: [...daySlots, time] };
      }
    });
  };

  const isSlotSelected = (day, time) => (freeTime[day] || []).includes(time);

  // ─── Deadlines ───────────────────────────────────────────────────────────────
  const addDeadline = () => {
    if (!newDeadline.task || !newDeadline.date) { toast.error("Both task and date are required."); return; }
    setDeadlines([...deadlines, { ...newDeadline, id: Date.now() }]);
    setNewDeadline({ task: '', date: '', completed: false });
  };

  const removeDeadline = (id) => {
    setDeadlines(deadlines.filter(d => d.id !== id));
  };
  
  const toggleDeadlineStatus = (id) => {
    setDeadlines(deadlines.map(d => d.id === id ? { ...d, completed: !d.completed } : d));
  };

  // ─── Generate Schedule Algorithm ─────────────────────────────────────────────
  const generateSchedule = () => {
    if (selectedCourses.length === 0) { toast.error("Please add at least one course."); return; }
    
    setIsGenerating(true);
    
    setTimeout(() => {
      // Mock Scheduling Algorithm
      // In reality, this would distribute study hours based on credits/difficulty + deadlines
      // We will place course blocks into available free time slots
      
      const newSchedule = { ...freeTime }; // Start with all free slots
      for (const day in newSchedule) {
        newSchedule[day] = newSchedule[day].map((time, index) => { // Map time strings to objects
           // Only assign study blocks to roughly 60% of free time, round robin through courses
           if (Math.random() > 0.4) {
               const course = selectedCourses[index % selectedCourses.length];
               return { time, ...course, type: 'study' };
           }
           // Assign deadline work if close (mock logic)
           if (deadlines.length > 0 && Math.random() > 0.8) {
               const dl = deadlines[Math.floor(Math.random() * deadlines.length)];
               return { time, name: dl.task, color: 'bg-red-500', type: 'deadline' };
           }
           return { time, type: 'free' };
        });
        
        // Fill in non-free slots as unavailable
        const fullDaySchedule = [];
        for (const time of TIME_SLOTS) {
            const scheduledSlot = newSchedule[day].find(s => s.time === time);
            if (scheduledSlot) fullDaySchedule.push(scheduledSlot);
            else fullDaySchedule.push({ time, type: 'unavailable' });
        }
        newSchedule[day] = fullDaySchedule;
      }
      
      setSchedule(newSchedule);
      setIsGenerating(false);
      toast.success("Smart schedule generated successfully! 🧠");
    }, 1500); // Fake delay for UX
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--background))]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white flex items-center gap-4">
            <FiCalendar className="text-blue-600" /> Study Planner
          </h1>
          <p className="text-xl text-gray-500 font-medium tracking-tight">AI-powered weekly schedule generation based on your availability and deadlines.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Inputs Panel ── */}
          <div className="space-y-6">
            
            {/* Step 1: Courses */}
            <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-xl font-black flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">1</span>
                Courses
              </h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      value={courseSearch} 
                      onChange={e => setCourseSearch(e.target.value)} 
                      onKeyDown={e => {
                        if (e.key === 'Enter' && courseSearch.trim()) {
                          addCourse(courseSearch.trim());
                        }
                      }}
                      placeholder="Search or add custom course..." 
                      className="w-full pl-11 pr-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium dark:text-white" 
                    />
                    {courseSearch && filteredCourses.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto p-2">
                        {filteredCourses.map(c => (
                          <button key={c} onClick={() => addCourse(c)} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium dark:text-gray-200">
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={() => { if(courseSearch.trim()) addCourse(courseSearch.trim()) }} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors min-w-[3rem] flex items-center justify-center"><FiPlus /></button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedCourses.map(c => (
                    <span key={c.name} className={`${c.color} text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2`}>
                      {c.name}
                      <button onClick={() => removeCourse(c.name)} className="hover:bg-black/20 rounded-full p-0.5 transition-colors"><FiTrash2 className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {selectedCourses.length === 0 && <p className="text-gray-400 text-sm font-medium">No courses added yet.</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Deadlines */}
            <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-xl font-black flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">2</span>
                Deadlines
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input value={newDeadline.task} onChange={e => setNewDeadline({ ...newDeadline, task: e.target.value })} placeholder="Task (e.g. Project Phase 1)" className="flex-1 px-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-xl focus:ring-2 focus:ring-violet-500 font-medium text-sm dark:text-white" />
                  <input type="date" value={newDeadline.date} onChange={e => setNewDeadline({ ...newDeadline, date: e.target.value })} className="w-36 px-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-xl focus:ring-2 focus:ring-violet-500 font-medium text-sm dark:text-white" />
                  <button onClick={addDeadline} className="bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-xl transition-colors"><FiPlus /></button>
                </div>
                
                <div className="space-y-3">
                  {deadlines.map(d => {
                    const isOverdue = new Date(d.date) < new Date(new Date().setHours(0,0,0,0)) && !d.completed;
                    return (
                      <div key={d.id} className={`flex justify-between items-center p-3 rounded-xl border transition-colors ${d.completed ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/30 opacity-70' : isOverdue ? 'bg-red-50 dark:bg-red-900/10 border-red-500/50 scale-105 shadow-xl shadow-red-500/10' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 hover:border-violet-500/30'}`}>
                        <div>
                          <p className={`font-bold text-sm transition-all ${d.completed ? 'line-through text-gray-400' : isOverdue ? 'text-red-700 dark:text-red-400' : 'dark:text-white'}`}>{d.task}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className={`text-xs font-bold ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>{new Date(d.date).toLocaleDateString()}</p>
                            {isOverdue && <span className="text-[10px] text-white font-black uppercase tracking-widest px-2 py-0.5 bg-red-500 rounded whitespace-nowrap animate-pulse">Uncompleted Task</span>}
                            {d.completed && <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500/20 rounded">Completed</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => toggleDeadlineStatus(d.id)} className={`p-2 rounded-lg transition-colors ${d.completed ? 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10'}`}>
                            <FiCheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => removeDeadline(d.id)} className={`transition-colors p-2 rounded-lg ${isOverdue ? 'text-red-400 hover:text-red-600 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'}`}><FiTrash2 className="w-5 h-5" /></button>
                        </div>
                      </div>
                    );
                  })}
                  {deadlines.length === 0 && <p className="text-gray-400 text-sm font-medium">No impending deadlines.</p>}
                </div>
              </div>
            </div>

          </div>

          {/* ── Main Planner Area ── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 3: Free Time Matrix */}
            <div className="glass-card rounded-[2.5rem] p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">3</span>
                  Available Study Hours
                </h3>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500" /> Free</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-800" /> Busy</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                  <thead>
                    <tr>
                      <th className="w-16 p-2"></th>
                      {DAYS.map(day => (
                        <th key={day} className="p-2 text-sm font-bold text-gray-500 uppercase tracking-wider">{day.slice(0,3)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map(time => (
                      <tr key={time}>
                        <td className="p-2 text-xs font-bold text-gray-400 text-right whitespace-nowrap">{time}</td>
                        {DAYS.map(day => (
                          <td key={`${day}-${time}`} className="p-1">
                            <button
                              onClick={() => toggleTimeSlot(day, time)}
                              className={`w-full h-8 rounded-md transition-all ${
                                isSlotSelected(day, time)
                                  ? 'bg-blue-500/20 border border-blue-500'
                                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 flex justify-end gap-4 border-t border-gray-100 dark:border-gray-800">
                <button onClick={() => setFreeTime({})} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Clear</button>
                <button 
                  onClick={generateSchedule} 
                  disabled={isGenerating || selectedCourses.length === 0}
                  className="premium-gradient px-8 py-3 rounded-xl text-white font-black hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiTarget />}
                  GENERATE SCHEDULE
                </button>
              </div>
            </div>

            {/* Step 4: Generated Schedule */}
            {schedule && (
              <div className="glass-card rounded-[2.5rem] p-8 space-y-6 animate-slide-in-left">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  🪄 Your Smart Schedule
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] border-separate border-spacing-y-2 border-spacing-x-1">
                    <thead>
                      <tr>
                        <th className="w-16 p-2"></th>
                        {DAYS.map(day => (
                          <th key={`th-${day}`} className="p-2 text-sm font-bold text-gray-900 dark:text-white w-[14%]">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TIME_SLOTS.map(time => (
                        <tr key={`row-${time}`}>
                          <td className="p-2 text-xs font-bold text-gray-400 text-right whitespace-nowrap align-top pt-3">{time}</td>
                          {DAYS.map(day => {
                            const slot = schedule[day]?.find(s => s.time === time);
                            if (!slot) return <td key={`null-${day}-${time}`} />;
                            
                            return (
                              <td key={`td-${day}-${time}`} className="h-14">
                                {slot.type === 'unavailable' ? (
                                  <div className="w-full h-full bg-repeating-linear-gradient-45 from-gray-50 to-gray-50 dark:from-gray-800/20 dark:to-gray-800/20 rounded-lg opacity-50" />
                                ) : slot.type === 'free' ? (
                                  <div className="w-full h-full border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Free</span>
                                  </div>
                                ) : (
                                  <div className={`w-full h-full ${slot.color} text-white rounded-lg p-2 shadow-md relative group flex flex-col justify-center`}>
                                    <p className="text-xs font-bold truncate">{slot.name}</p>
                                    {slot.type === 'deadline' && <FiTarget className="absolute top-1 right-1 opacity-50 text-xs" />}
                                    
                                    <div className="absolute inset-x-0 bottom-full mb-2 bg-black text-white text-xs p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none">
                                      {slot.name}
                                    </div>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
