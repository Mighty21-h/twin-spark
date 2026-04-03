// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
    const [username, setUsername] = useState('abebe');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(username, password);
            toast.success('Welcome back!');
            navigate('/gpa-prediction');
        } catch (error) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-12 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-500/10 -z-10" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse" />

            <div className="max-w-md w-full space-y-8 glass-card rounded-[3rem] p-10 md:p-14 shadow-2xl relative z-10">
                <div className="text-center">
                    <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Continue your learning journey</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="relative group">
                            <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="password"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end mt-2">
                            <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 group"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 font-black hover:underline">
                            Join BILIH
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
