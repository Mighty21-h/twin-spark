// src/components/OpportunitiesGrid.jsx
import { useState, useEffect } from 'react';
import { FiCalendar, FiMapPin, FiArrowRight, FiX, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { mockOpportunities } from '../utils/mockData';

const OpportunitiesGrid = ({ limit }) => {
    // Combine mock opportunities with any events from localStorage to get Hackathons
    const [allOpps, setAllOpps] = useState([]);
    
    useEffect(() => {
        let localEvents = [];
        try {
            localEvents = JSON.parse(localStorage.getItem('bilih_events') || '[]');
        } catch { /* ignore */ }
        
        // Map localStorage events to match opportunity structure
        const mappedEvents = localEvents.map(ev => ({
            ...ev,
            organization: 'Bilih Admin',
            category: ev.type,
        }));

        setAllOpps([...mockOpportunities, ...mappedEvents]);
    }, []);

    const displayOpps = limit ? allOpps.slice(0, limit) : allOpps;

    const [selectedOpp, setSelectedOpp] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        age: '',
        gender: 'Male',
        // Hackathon
        department: '',
        yearOfStudy: '',
        // Job
        skillLevel: 'Beginner',
        cv: null,
        // Scholarship
        university: '',
        faculty: '',
        graduatedAt: 'BSc',
        offerUniversityEmail: ''
    });

    const handleOpenDetail = (opp) => {
        setSelectedOpp(opp);
        setShowForm(false);
    };

    const handleClose = () => {
        setSelectedOpp(null);
        setShowForm(false);
        // Reset form data
        setFormData({
            fullName: '', email: '', age: '', gender: 'Male',
            department: '', yearOfStudy: '',
            skillLevel: 'Beginner', cv: null,
            university: '', faculty: '', graduatedAt: 'BSc', offerUniversityEmail: ''
        });
    };

    const handleApplyClick = () => {
        setShowForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Mock API call
        setTimeout(() => {
            setIsSubmitting(false);
            handleClose();
            toast.success('Your application has been submitted successfully!', {
                icon: '🎉',
                style: { borderRadius: '20px', background: '#333', color: '#fff' }
            });
        }, 1500);
    };

    // Determine the form type based on opportunity type
    const getFormCategory = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('hackathon')) return 'hackathon';
        if (t.includes('scholarship')) return 'scholarship';
        return 'job'; // default for Internships, Full-time, etc.
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayOpps.map((opp) => (
                    <div key={opp.id} className="glass-card rounded-3xl p-6 hover:scale-[1.02] transition-all duration-300 group border-transparent hover:border-blue-500/30">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                opp.type?.toLowerCase().includes('internship') ? 'bg-blue-500/10 text-blue-600' :
                                opp.type?.toLowerCase().includes('scholarship') ? 'bg-purple-500/10 text-purple-600' :
                                opp.type?.toLowerCase().includes('hackathon') ? 'bg-orange-500/10 text-orange-600' :
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
                                {opp.location || 'Online / Default'}
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
                            <button 
                                onClick={() => handleOpenDetail(opp)}
                                className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-500/20"
                            >
                                <FiArrowRight />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Application Modal */}
            {selectedOpp && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 w-full max-w-2xl space-y-6 my-8 animate-slide-in-left shadow-2xl relative">
                        
                        {/* Close button */}
                        <button onClick={handleClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors">
                            <FiX className="text-xl" />
                        </button>

                        {!showForm ? (
                            /* Detail View */
                            <div className="space-y-6 pr-8">
                                <div className="space-y-2">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-600">
                                        {selectedOpp.type}
                                    </span>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">{selectedOpp.title}</h2>
                                    <p className="text-gray-500 font-bold text-sm">{selectedOpp.organization}</p>
                                </div>

                                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4 shadow-inner">
                                    <h4 className="font-black text-gray-900 dark:text-white text-lg border-b border-gray-200 dark:border-gray-700 pb-2">Opportunity Details</h4>
                                    
                                    {getFormCategory(selectedOpp.type) === 'job' && (
                                        <div className="flex flex-wrap items-center gap-6 mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Job Title</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedOpp.jobTitle || selectedOpp.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Job Type</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedOpp.type}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Applicant Need</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedOpp.applicantNeed || 'Both'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Salary</span>
                                                <span className="text-sm font-bold text-emerald-600">{selectedOpp.salary || 'Not Specified'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Skills Required</span>
                                                <span className="text-sm font-bold text-blue-600">{selectedOpp.skillRequired || selectedOpp.skills || 'General Skills'}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Description</p>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                            {selectedOpp.description}
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Work Location</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                                <FiMapPin className="text-blue-500" /> {selectedOpp.location || 'Online'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Deadline</span>
                                            <span className="text-sm font-black text-red-500 flex items-center gap-1">
                                                <FiCalendar /> {new Date(selectedOpp.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button onClick={handleClose} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl font-bold transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={handleApplyClick} className="flex-1 py-4 btn-primary rounded-2xl text-lg shadow-blue-500/30">
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Application Form View */
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Application Form</h2>
                                    <p className="text-sm text-gray-500 font-medium">Applying for: <span className="text-blue-600 font-bold">{selectedOpp.title}</span></p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Common Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                            <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-sm" placeholder="Abebe Bikila" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                                            <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-sm" placeholder="abebe@example.com" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Age</label>
                                            <input required type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-sm" placeholder="21" min="15" max="100" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gender</label>
                                            <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-sm">
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* conditional fields based on type */}
                                    {getFormCategory(selectedOpp.type) === 'hackathon' && (
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">Department</label>
                                                <input required name="department" value={formData.department} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white text-sm" placeholder="e.g. Computer Science" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">Year of Study</label>
                                                <input required name="yearOfStudy" value={formData.yearOfStudy} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white text-sm" placeholder="e.g. 3rd Year" />
                                            </div>
                                        </div>
                                    )}

                                    {getFormCategory(selectedOpp.type) === 'job' && (
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Skill Level</label>
                                                <select required name="skillLevel" value={formData.skillLevel} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-sm">
                                                    <option>Beginner</option>
                                                    <option>Intermediate</option>
                                                    <option>Advanced</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Upload CV (PDF)</label>
                                                <input required type="file" accept=".pdf" name="cv" onChange={handleInputChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
                                            </div>
                                        </div>
                                    )}

                                    {getFormCategory(selectedOpp.type) === 'scholarship' && (
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">University</label>
                                                <input required name="university" value={formData.university} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white text-sm" placeholder="Current University" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">Faculty</label>
                                                <input required name="faculty" value={formData.faculty} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">Department</label>
                                                <input required name="department" value={formData.department} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white text-sm" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">Graduated At</label>
                                                <select required name="graduatedAt" value={formData.graduatedAt} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white text-sm">
                                                    <option>BSc</option>
                                                    <option>MSc</option>
                                                    <option>PhD</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">Scholarship Offer University Email</label>
                                                <input required type="email" name="offerUniversityEmail" value={formData.offerUniversityEmail} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white text-sm" placeholder="admission@target-uni.edu" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-4 mt-8 border-t border-gray-200 dark:border-gray-800">
                                        <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl font-bold transition-colors">
                                            ← Back to Details
                                        </button>
                                        <button type="submit" disabled={isSubmitting} className="flex-1 py-4 btn-primary rounded-2xl text-lg shadow-blue-500/30 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isSubmitting ? (
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>Submit Application <FiCheckCircle /></>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default OpportunitiesGrid;