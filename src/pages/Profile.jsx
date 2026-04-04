// src/pages/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiUser, FiBook, FiCamera, FiEdit3, FiLock, FiSettings, FiBell, FiShield, FiMail } from 'react-icons/fi';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        department: user?.department || 'Computer Science'
    });
    
    // For handling profile photo upload
    const [uploading, setUploading] = useState(false);
    const [settings, setSettings] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(`bilih_settings_${user?.username}`)) || { notif: true, privacy: true, newsletter: false };
        } catch {
            return { notif: true, privacy: true, newsletter: false };
        }
    });

    const toggleSetting = (id) => {
        const nextSettings = { ...settings, [id]: !settings[id] };
        setSettings(nextSettings);
        localStorage.setItem(`bilih_settings_${user?.username}`, JSON.stringify(nextSettings));
        toast.success('Setting updated');
    };

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

    const updatePhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation for image type and size (5MB max)
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB.");
            return;
        }

        setUploading(true);
        const reader = new FileReader();
        
        reader.onloadend = async () => {
            const base64String = reader.result;
            try {
                // Unify Auth: Send user object as "token"
                const token = encodeURIComponent(JSON.stringify(user));
                const response = await fetch('http://localhost:5000/api/feedback/update-photo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ photoBase64: base64String })
                });

                const result = await response.json();
                if (result.success) {
                    const updatedUser = { ...user, profile_picture: base64String };
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    toast.success('Photo updated successfully!');
                } else {
                    toast.error(result.message || "Failed to update photo.");
                }
            } catch (error) {
                console.error("Upload Error:", error);
                toast.error("Network error. Could not upload photo.");
            } finally {
                setUploading(false);
            }
        };

        reader.readAsDataURL(file);
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
                                    <div className="absolute bottom-0 right-0">
                                        <label
                                            htmlFor="photo-upload"
                                            className={`p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-blue-600 hover:scale-110 transition-transform cursor-pointer flex items-center justify-center ${uploading ? 'animate-pulse' : ''}`}
                                        >
                                            <FiCamera />
                                            <input 
                                                id="photo-upload"
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={updatePhoto}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
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
                                    <button type="submit" className="w-full premium-gradient text-white font-black py-5 rounded-[2rem] text-xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform">
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>

                        {/* Settings Contents */}
                        <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <span className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><FiSettings /></span> 
                                Account Settings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[ 
                                    { id: 'notif', icon: <FiBell/>, label: 'Push Notifications', desc: 'Receive updates on opportunities' },
                                    { id: 'privacy', icon: <FiShield/>, label: 'Profile Visibility', desc: 'Allow recruiters to find you' },
                                    { id: 'newsletter', icon: <FiMail/>, label: 'Newsletter', desc: 'Study tips directly to inbox' }
                                ].map((setting, i) => (
                                    <div key={setting.id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/50 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 hover:border-blue-500/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="text-gray-400 dark:text-gray-500 text-xl">{setting.icon}</div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white text-sm">{setting.label}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{setting.desc}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => toggleSetting(setting.id)} className={`w-12 h-6 rounded-full relative transition-colors focus:ring-4 focus:ring-blue-500/20 ${settings[setting.id] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings[setting.id] ? 'right-1' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;