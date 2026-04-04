// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUser } from '../utils/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Admin account — hardcoded, cannot be changed
const ADMIN_USER = {
    ...mockUser,
    id: 0,
    name: 'Admin Bilih',
    username: 'Bilih',
    password: '@twinspark1',
    role: 'admin',
    email: 'admin@bilih.edu.et',
    department: 'Administration',
    year: '',
    isActive: true,
    isVerified: true,
    joinDate: '2023-01-01',
    profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminBilih',
};

// Get the users registry from localStorage
const getUsers = () => {
    try {
        return JSON.parse(localStorage.getItem('bilih_users') || '[]');
    } catch {
        return [];
    }
};

// Save users registry to localStorage
const saveUsers = (users) => {
    localStorage.setItem('bilih_users', JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        try {
            const storedSession = localStorage.getItem('bilih_session');
            if (storedSession) {
                setUser(JSON.parse(storedSession));
            }
        } catch {
            // ignore
        }
        setLoading(false);
    };

    const login = async (username, password) => {
        if (!username || !password) {
            throw new Error('Please enter username and password.');
        }

        // Admin login check
        if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
            const sessionUser = { ...ADMIN_USER };
            delete sessionUser.password;
            localStorage.setItem('bilih_session', JSON.stringify(sessionUser));
            setUser(sessionUser);
            return { user: sessionUser };
        }

        // Registered user login — check the users registry
        const users = getUsers();
        const found = users.find(
            (u) => u.username === username && u.password === password
        );

        if (found) {
            if (found.isActive === false) {
                throw new Error('Your account has been deactivated. Please contact admin.');
            }
            const sessionUser = { ...found };
            delete sessionUser.password;
            // Track daily login
            trackLogin(found.id);
            localStorage.setItem('bilih_session', JSON.stringify(sessionUser));
            setUser(sessionUser);
            return { user: sessionUser };
        }

        throw new Error('Invalid username or password.');
    };

    const trackLogin = (userId) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const loginLog = JSON.parse(localStorage.getItem('bilih_login_log') || '{}');
            if (!loginLog[today]) loginLog[today] = [];
            if (!loginLog[today].includes(userId)) {
                loginLog[today].push(userId);
            }
            localStorage.setItem('bilih_login_log', JSON.stringify(loginLog));
        } catch { /* ignore */ }
    };

    const signup = async (userData) => {
        if (!userData.username || !userData.password || !userData.name) {
            throw new Error('Name, username and password are required.');
        }

        // Check if username already taken
        const users = getUsers();
        if (users.find((u) => u.username === userData.username)) {
            throw new Error('Username is already taken. Please choose another.');
        }

        const newUser = {
            ...mockUser,
            ...userData,
            id: Date.now(),
            role: 'user',
            isActive: true,
            isVerified: false,
            joinDate: new Date().toISOString().split('T')[0],
            profile_picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
        };

        // Save to users registry (with password for login later)
        saveUsers([...users, newUser]);

        // Start session (without exposing password)
        const sessionUser = { ...newUser };
        delete sessionUser.password;
        localStorage.setItem('bilih_session', JSON.stringify(sessionUser));
        setUser(sessionUser);
        return { user: sessionUser };
    };

    const logout = () => {
        localStorage.removeItem('bilih_session');
        setUser(null);
        navigate('/');
    };

    // Profile update — also update the users registry
    const updateUser = (updatedData) => {
        const updated = { ...user, ...updatedData };
        localStorage.setItem('bilih_session', JSON.stringify(updated));
        setUser(updated);

        // Also update the registry if not admin
        if (updated.role !== 'admin') {
            const users = getUsers();
            const idx = users.findIndex((u) => u.id === updated.id);
            if (idx !== -1) {
                users[idx] = { ...users[idx], ...updatedData };
                saveUsers(users);
            }
        }
    };

    // ─── Forgot Password / Recovery ─────────────────────────────────────────────

    const recoverPassword = (username, email, newPassword) => {
        const users = getUsers();
        const idx = users.findIndex(u => u.username === username && u.email === email);
        if (idx !== -1) {
            users[idx].password = newPassword;
            saveUsers(users);
            return true;
        }
        return false;
    };

    // ─── Admin-only helpers ────────────────────────────────────────────────────

    const getAllUsers = () => {
        return getUsers();
    };

    const deleteUser = (userId) => {
        const users = getUsers().filter((u) => u.id !== userId);
        saveUsers(users);
    };

    const toggleUserStatus = (userId) => {
        const users = getUsers();
        const idx = users.findIndex((u) => u.id === userId);
        if (idx !== -1) {
            users[idx].isActive = !users[idx].isActive;
            saveUsers(users);
        }
        return users;
    };

    const resetUserPassword = (userId, newPassword) => {
        const users = getUsers();
        const idx = users.findIndex((u) => u.id === userId);
        if (idx !== -1) {
            users[idx].password = newPassword;
            saveUsers(users);
            return true;
        }
        return false;
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
        setUser: updateUser,
        recoverPassword,
        // Admin helpers
        getAllUsers,
        deleteUser,
        toggleUserStatus,
        resetUserPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};