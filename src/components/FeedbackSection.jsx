import { useState } from 'react';
import { FiThumbsUp, FiThumbsDown, FiSend, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const FeedbackSection = ({ category }) => {
    const { user } = useAuth();
    const [type, setType] = useState(null); // 'like' or 'dislike'
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Please login to submit feedback.");
            return;
        }

        if (!type && !comment) {
            toast.error("Please provide a like/dislike or a comment.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Generate mock token (encoded user object) as used across the platform
            const token = encodeURIComponent(JSON.stringify(user)); 

            const response = await fetch('http://localhost:5000/api/feedback/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ category, type, comment })
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Feedback sent to Admin. Thank you!");
                setSubmitted(true);
                // Clear state
                setComment('');
                setType(null);
            } else {
                toast.error(result.message || "Failed to submit feedback.");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            toast.error("Network error. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="glass-card rounded-2xl p-6 border-dashed border-2 border-emerald-500/20 text-center animate-fade-in mt-8">
                <FiCheckCircle className="text-4xl text-emerald-500 mx-auto mb-3" />
                <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400">Feedback Received!</h4>
                <p className="text-sm text-gray-500 font-medium">The Admin will review your input for {category}.</p>
                <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs font-black text-emerald-500 uppercase tracking-widest hover:underline"
                >
                    Send another?
                </button>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl mt-12 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="relative z-10">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <FiMessageSquare className="text-blue-500" /> Share Your Thoughts
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-6">How was your experience in <span className="text-gray-900 dark:text-white font-bold">{category}</span>?</p>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <button 
                        onClick={() => setType('like')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all ${type === 'like' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                        <FiThumbsUp /> Helpful
                    </button>
                    <button 
                        onClick={() => setType('dislike')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all ${type === 'dislike' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                        <FiThumbsDown /> Not Useful
                    </button>
                </div>

                <div className="space-y-4">
                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What can we improve? (Optional)"
                        className="w-full bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 text-sm font-medium border-none focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[100px] resize-none"
                    />
                    <button 
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black py-4 rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                         {isSubmitting ? 'Submitting...' : 'Send Feedback'} <FiSend className={!isSubmitting ? 'animate-bounce-h' : ''} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackSection;
