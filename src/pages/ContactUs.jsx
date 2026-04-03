// src/pages/ContactUs.jsx
import { FiMail, FiPhone, FiLinkedin, FiArrowRight, FiSmile, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ContactUs = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Sending your message...',
                success: 'Message sent successfully! We\'ll be in touch soon.',
                error: 'Failed to send message. Please try again.',
            }
        );
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--background))]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                
                {/* Contact Info Section */}
                <div className="space-y-12 animate-float">
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white">
                            Let's <span className="text-blue-600">Connect</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-lg">
                            Have questions about Bilih? We're here to help you navigate your educational journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="glass-card p-8 rounded-3xl space-y-4 border-none shadow-xl">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 text-2xl">
                                <FiMail />
                            </div>
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Email Us</h3>
                            <p className="text-xl font-bold text-gray-900 dark:text-white truncate">hello@bilih.edu.et</p>
                        </div>

                        <div className="glass-card p-8 rounded-3xl space-y-4 border-none shadow-xl">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 text-2xl">
                                <FiPhone />
                            </div>
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Call Us</h3>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">+251 987 654 321</p>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-[3rem] space-y-8 border-none shadow-xl">
                        <h3 className="text-2xl font-black flex items-center gap-3">
                            <FiSmile className="text-amber-500" /> Follow the Journey
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="#"
                                className="flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-2xl text-white font-black hover:scale-105 transition-all shadow-lg shadow-blue-600/20"
                            >
                                <FiLinkedin className="text-xl" /> LinkedIn
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-3 px-8 py-4 bg-emerald-500 rounded-2xl text-white font-black hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <FaWhatsapp className="text-xl" /> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="glass-card rounded-[3.5rem] p-10 md:p-16 border-none shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[100%] -mr-8 -mt-8 transition-all group-hover:scale-150" />
                    
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black">Send a Message</h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">We usually respond within 24 hours</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest px-2">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold transition-all"
                                    placeholder="Abebe Bikila"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest px-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-6 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold transition-all"
                                    placeholder="abebe@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest px-2">Message</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full px-6 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold transition-all"
                                    placeholder="What can we help you with?"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full premium-gradient py-5 rounded-[2rem] text-white font-black text-xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group"
                        >
                            Send Message <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
