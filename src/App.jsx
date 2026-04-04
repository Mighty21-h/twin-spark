// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';
import GPAPrediction from './pages/GPAPrediction';
import Opportunities from './pages/Opportunities';
import AdminDashboard from './pages/AdminDashboard';
import VerifyEmail from './pages/VerifyEmail';
import LanguageLearning from './pages/LanguageLearning';
import LanguageTutor from './pages/LanguageTutor';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Notifications from './pages/Notifications';
import StudyPlanner from './pages/StudyPlanner';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        {!isAdminRoute && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route
            path="/gpa-prediction"
            element={
              <ProtectedRoute requiredRole="user">
                <GPAPrediction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities"
            element={
              <ProtectedRoute requiredRole="user">
                <Opportunities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/language"
            element={
              <ProtectedRoute requiredRole="user">
                <LanguageLearning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/language-tutor"
            element={
              <ProtectedRoute requiredRole="user">
                <LanguageTutor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute requiredRole="user">
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-planner"
            element={
              <ProtectedRoute requiredRole="user">
                <StudyPlanner />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute requiredRole="user">
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
        <Toaster position="top-right" />
        {!isAdminRoute && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;