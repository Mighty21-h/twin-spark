// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { FiMail, FiPhone } from 'react-icons/fi';
import { FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="relative mt-24 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="space-y-6 lg:col-span-1">
                        <Link to="/" className="text-3xl font-black bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                            BILIH
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            Empowering Ethiopian students with smart tools for learning, growth, and opportunity discovery.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-blue-600/20"
                            >
                                <FaLinkedin className="text-lg" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20"
                            >
                                <FaWhatsapp className="text-lg" />
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Services</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Track Opportunities', to: '/opportunities' },
                                { label: 'GPA Prediction', to: '/dashboard' },
                                { label: 'Language Learning', to: '/language' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        to={item.to}
                                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Company</h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'About Us', to: '/about' },
                                { label: 'Contact Us', to: '/contact' },
                                { label: 'Sign Up', to: '/signup' },
                                { label: 'Login', to: '/login' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        to={item.to}
                                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                <FiMail className="text-blue-500 shrink-0" />
                                hello@bilih.edu.et
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                <FiPhone className="text-emerald-500 shrink-0" />
                                +251 987 654 321
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400 font-medium">
                        © {year} <span className="font-black text-gray-600 dark:text-gray-300">BILIH Smart Link</span>. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-400 font-medium">
                        Built by{' '}
                        <span className="font-black text-blue-600">Mignotie Muluken</span>
                        {' '}&amp;{' '}
                        <span className="font-black text-emerald-600">Elham Million</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
