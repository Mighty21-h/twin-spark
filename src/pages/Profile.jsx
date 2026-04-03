// src/pages/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiUser, FiBook, FiCamera, FiEdit3, FiLock } from 'react-icons/fi';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        department: user?.department || 'Computer Science'
    });

    const handleSave = (e) => {
        e.preventDefault();
        const updatedUser = {
            ...user,
            ...formData,
            profile_picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username || formData.name}`
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully!');
        setEditing(false);
    };

    const updatePhoto = () => {
        const newSeed = Math.random().toString(36).substring(7);
        const updatedUser = {
            ...user,
            profile_picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Photo updated!');
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--background))]">
            <div className="max-w-4xl mx-auto">
                <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl">
                    {/* Banner */}
                    <div className="h-48 premium-gradient relative">
                        <div className="absolute -bottom-16 left-12">
                            <div className="relative">
                                <img
                                    src={user?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl object-cover"
                                />
                                {editing && (
                                    <button
                                        onClick={updatePhoto}
                                        type="button"
                                        className="absolute bottom-0 right-0 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-blue-600 hover:scale-110 transition-transform"
                                    >
                                        <FiCamera />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info & Form */}
                    <div className="pt-20 pb-12 px-8 md:px-12">
                        <div className="flex justify-between items-start mb-10">
                            <div className="space-y-1">
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white">{user?.name}</h2>
                                <p className="text-xl text-gray-500 font-medium">@{user?.username} • {user?.department}</p>
                            </div>
                            <button
                                onClick={() => setEditing(!editing)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all ${
                                    editing
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                <FiEdit3 /> {editing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest px-2">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        disabled={!editing}
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-bold disabled:opacity-60"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest px-2">Username</label>
                                <div className="relative">
                                    <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 opacity-50" />
                                    <input
                                        type="text"
                                        disabled={!editing}
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-bold disabled:opacity-60"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>



                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest px-2">Department</label>
                                <div className="relative">
                                    <FiBook className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        disabled={!editing}
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-bold appearance-none disabled:opacity-60"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    >
                                        <option>Computer Science</option>
                                        <option>Engineering</option>
                                        <option>Medicine</option>
                                        <option>Business</option>
                                    </select>
                                </div>
                            </div>

                            {editing && (
                                <div className="md:col-span-2 pt-4">
                                    <button type="submit" className="w-full premium-gradient text-white font-black py-5 rounded-[2rem] text-xl shadow-xl shadow-blue-500/20">
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;