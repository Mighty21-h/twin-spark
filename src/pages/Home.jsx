// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiTarget, FiGlobe } from 'react-icons/fi';
import GPAAnalyticsCard from '../components/GPAAnalyticsCard';
import OpportunitiesGrid from '../components/OpportunitiesGrid';

const Home = () => {
    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-4 sm:px-6 lg:px-8">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-500/10 via-transparent to-transparent -z-10 blur-3xl opacity-50" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
                
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm tracking-wide animate-bounce">
                            <FiZap /> AI-POWERED LEARNING PLATFORM
                        </div>
                        
                        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-tight">
                            Elevate Your <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">Potential</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            The all-in-one ecosystem for Ethiopian students. Track your GPA, master local languages, and unlock life-changing opportunities.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                            <Link to="/signup" className="btn-primary flex items-center gap-3 text-lg group">
                                Get Started Free <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/opportunities" className="px-8 py-4 rounded-2xl font-bold border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-lg">
                                Explore Opportunities
                            </Link>
                        </div>
                    </div>

                    {/* Visual Preview */}
                    <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-float">
                            <div className="glass-card rounded-[3rem] p-8 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <GPAAnalyticsCard />
                            </div>
                        </div>
                        
                        <div className="space-y-12 pl-0 lg:pl-12">
                            <div className="flex gap-6">
                                <div className="w-14 h-14 shrink-0 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                                    <FiTarget className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">Goal Tracking</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">Set academic targets and visualize your progress with our advanced GPA analytics engine.</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                                    <FiGlobe className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">Cultural Mastery</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">Master Amharic, Afaan Oromoo, and more with our localized language learning modules.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Opportunities Preview */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-16">Latest Opportunities</h2>
                    <OpportunitiesGrid limit={3} />
                    <div className="mt-16">
                        <Link to="/opportunities" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all">
                            View all opportunities <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto premium-gradient rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Join the Future of Education in Ethiopia</h2>
                    <p className="text-xl md:text-2xl mb-12 opacity-90 relative z-10">Over 10,000 students are already leveling up their careers with BILIH.</p>
                    <Link to="/signup" className="inline-block bg-white text-blue-600 px-12 py-5 rounded-2xl text-xl font-black hover:scale-110 shadow-3xl transition-transform relative z-10">
                        Create Your Free Account
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;