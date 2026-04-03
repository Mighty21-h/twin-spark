// src/pages/VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.post(`/auth/verify-email/${token}`);
                localStorage.setItem('token', res.data.token);
                toast.success('Email verified successfully!');
                setStatus('success');
                setTimeout(() => navigate('/dashboard'), 3000);
            } catch (error) {
                setStatus('error');
                toast.error(error.response?.data?.error || 'Verification failed');
            }
        };
        verify();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl text-center">
                {status === 'verifying' && (
                    <div className="space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
                        <h2 className="text-2xl font-bold dark:text-white">Verifying your email...</h2>
                    </div>
                )}
                {status === 'success' && (
                    <div className="space-y-4 text-green-500">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h2 className="text-2xl font-bold dark:text-white">Welcome! Your email has been verified.</h2>
                        <p className="text-gray-600 dark:text-gray-400">Redirecting to your dashboard...</p>
                    </div>
                )}
                {status === 'error' && (
                    <div className="space-y-4 text-red-500">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <h2 className="text-2xl font-bold dark:text-white">Verification Failed!</h2>
                        <p className="text-gray-600 dark:text-gray-400">The link may have expired or is invalid.</p>
                        <Link to="/login" className="bg-primary text-white py-2 px-6 rounded-xl inline-block mt-4">
                            Try Logging In
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
