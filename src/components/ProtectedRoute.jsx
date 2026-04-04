// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-based protection
    if (requiredRole) {
        if (user.role !== requiredRole) {
            // Admin trying to access student page
            if (user.role === 'admin') {
                return <Navigate to="/admin" replace />;
            }
            // Student trying to access admin page
            return <Navigate to="/" replace />;
        }
    }

    // Default admin isolation (even if no role specified, admins shouldn't browse student routes)
    if (user.role === 'admin' && !location.pathname.startsWith('/admin')) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
