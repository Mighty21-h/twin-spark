// src/pages/AboutUs.jsx
import { FiCheckCircle, FiCode, FiDatabase } from 'react-icons/fi';

const AboutUs = () => {
    return (
        <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--background))]">
            <div className="max-w-7xl mx-auto space-y-24">
                {/* Benefits Section */}
                <section className="text-center space-y-8 animate-float">
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white">
                        The Future of <span className="text-blue-600">Ethiopian Education</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
                        Bilih Smart Link is more than just a platform—it's an ecosystem designed to bridge the gap between academic potential and real-world opportunities.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                        {[
                            {
                                title: "Predictive Analytics",
                                desc: "Advanced algorithms to track your GPA and predict future performance based on real-time data.",
                                icon: <FiCheckCircle className="text-blue-500" />
                            },
                            {
                                title: "Master Local Languages",
                                desc: "Bilih makes mastering Ethiopia's rich linguistic diversity accessible and engaging.",
                                icon: <FiCheckCircle className="text-emerald-500" />
                            },
                            {
                                title: "Smart Matching",
                                desc: "Connect with scholarships, hackathons, and clubs tailored specifically to your profile.",
                                icon: <FiCheckCircle className="text-purple-500" />
                            }
                        ].map((benefit, i) => (
                            <div key={i} className="glass-card p-10 rounded-[2.5rem] space-y-6 text-left border-none shadow-xl hover:scale-105 transition-transform duration-500">
                                <div className="text-4xl">{benefit.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{benefit.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Section */}
                <section className="space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black">Meet the <span className="text-blue-600">Visionaries</span></h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">The talented developers behind Bilih</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Mignotie - Frontend */}
                        <div className="glass-card rounded-[3rem] overflow-hidden group">
                            <div className="relative h-[400px] overflow-hidden bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center">
                                <img
                                    src="/mignotie.jpg"
                                    alt="Mignotie Muluken"
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                                <div className="absolute bottom-8 left-8 space-y-2">
                                    <h3 className="text-3xl font-black text-white">Mignotie Muluken</h3>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white font-bold text-sm">
                                        <FiCode /> Lead Frontend Developer
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 space-y-4">
                                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                    Mignotie is the architect of Bilih's premium user experience. With a sharp eye for modern aesthetics and a passion for performance, she ensures that every interaction on the platform feels as smart as it looks.
                                </p>
                            </div>
                        </div>

                        {/* Elham - Backend */}
                        <div className="glass-card rounded-[3rem] overflow-hidden group">
                            <div className="relative h-[400px] overflow-hidden bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center">
                                <img
                                    src="/elham.jpg"
                                    alt="Elham Million"
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                                <div className="absolute bottom-8 left-8 space-y-2">
                                    <h3 className="text-3xl font-black text-white">Elham Million</h3>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-sm">
                                        <FiDatabase /> Lead Backend Specialist
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 space-y-4">
                                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                    Elham is the mastermind behind the intelligent logic that powers Bilih. From robust data management to localized analytics, she ensures the platform operates at peak performance for thousands of users.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission Statement */}
                <section className="premium-gradient rounded-[3.5rem] p-12 md:p-20 text-white text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">Our Mission</h2>
                    <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed mb-12 relative z-10">
                        "To empower the next generation of Ethiopian leaders by providing them with the tools, knowledge, and connections they need to transcend traditional educational boundaries."
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
