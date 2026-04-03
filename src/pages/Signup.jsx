// src/pages/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiBook, FiArrowRight } from 'react-icons/fi';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        department: 'Computer Science'
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(formData);
            toast.success('Account created! Welcome to BILIH.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-12 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-600/10 -z-10" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse" />

            <div className="max-w-md w-full space-y-8 glass-card rounded-[3rem] p-10 md:p-14 shadow-2xl relative z-10">
                <div className="text-center">
                    <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                        Get Started
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Join the next generation of learners</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative group">
                            <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors opacity-50" />
                            <input
                                type="text"
                                name="username"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative group">
                            <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative group">
                            <FiBook className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <select
                                name="department"
                                className="w-full pl-14 pr-6 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium appearance-none"
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option>Computer Science</option>
                                <option>Engineering</option>
                                <option>Medicine</option>
                                <option>Business</option>
                            </select>
                        </div>
                        <div className="relative group">
                            <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                placeholder="Create Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 group mt-4 shadow-blue-500/20"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-black hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
