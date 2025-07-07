import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../../../config/environment'; // Assuming you have a config file for API base URL

const DoctorSettings = () => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        qualifications: []
    });
    const [activeTab, setActiveTab] = useState('profile');
    const [newPassword, setNewPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [notificationSettings, setNotificationSettings] = useState({
        email: true,
        sms: false,
        appointment: true,
        cancelation: true,
        reminder: true
    });

    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Fetch doctor profile on component mount
    useEffect(() => {
        const fetchDoctorProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${config.API_BASE_URL}/api/doctors/profile`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.data.success) {
                    const { doctor } = response.data;
                    setProfile({
                        firstName: doctor.name.firstName,
                        lastName: doctor.name.lastName,
                        email: doctor.contact.email,
                        phone: doctor.contact.phone,
                        specialization: doctor.specialization,
                        experience: doctor.experience,
                        qualifications: doctor.qualifications || []
                    });
                }
            } catch (error) {
                console.error('Error fetching doctor profile:', error);
                toast.error('Failed to load profile information');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDoctorProfile();
    }, [token]);
    
    // Handle profile form changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handle password form changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setNewPassword(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handle notification settings changes
    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotificationSettings(prev => ({
            ...prev,
            [name]: checked
        }));
    };
    
    // Update profile information
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.put(
                `${config.API_BASE_URL}/api/doctors/profile`,
                {
                    name: {
                        firstName: profile.firstName,
                        lastName: profile.lastName
                    },
                    contact: {
                        email: profile.email,
                        phone: profile.phone
                    },
                    specialization: profile.specialization,
                    experience: profile.experience
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };
    
    // Update password
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        
        if (newPassword.new !== newPassword.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await axios.put(
                `${config.API_BASE_URL}/api/doctors/profile/password`,
                {
                    currentPassword: newPassword.current,
                    newPassword: newPassword.new
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                toast.success('Password updated successfully');
                setNewPassword({ current: '', new: '', confirm: '' });
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };
    
    // Update notification settings
    const handleNotificationUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // This would be implemented in a real backend
            // For now just show success message
            toast.success('Notification settings updated');
        } catch (error) {
            console.error('Error updating notifications:', error);
            toast.error('Failed to update notification settings');
        } finally {
            setLoading(false);
        }
    };
    
    // Tabs for different settings sections
    const tabs = [
        { id: 'profile', label: 'Profile Information' },
        { id: 'security', label: 'Security & Password' },
        { id: 'notifications', label: 'Notifications' }
    ];
    
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
                
                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                    ${activeTab === tab.id
                                        ? 'border-[#4CAF50] text-[#4CAF50]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                
                {/* Content based on active tab */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
                    </div>
                ) : (
                    <>
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileUpdate}>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={profile.firstName}
                                                onChange={handleProfileChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={profile.lastName}
                                                onChange={handleProfileChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profile.email}
                                                onChange={handleProfileChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                                disabled  // Email typically shouldn't be changed directly
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Contact admin to change email address</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={profile.phone}
                                                onChange={handleProfileChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Specialization
                                            </label>
                                            <select
                                                name="specialization"
                                                value={profile.specialization}
                                                onChange={handleProfileChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                            >
                                                <option value="">Select Specialization</option>
                                                <option value="Speech Therapy">Speech Therapy</option>
                                                <option value="Occupational Therapy">Occupational Therapy</option>
                                                <option value="Clinical Psychology">Clinical Psychology</option>
                                                <option value="ABA Therapy">ABA Therapy</option>
                                                <option value="Behavior Therapy">Behavior Therapy</option>
                                                <option value="Special Education">Special Education</option>
                                                <option value="Physical Therapy">Physical Therapy</option>
                                                <option value="Early Intervention">Early Intervention</option>
                                                <option value="Pediatric Neurology">Pediatric Neurology</option>
                                                <option value="Child Psychiatry">Child Psychiatry</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Years of Experience
                                            </label>
                                            <input
                                                type="number"
                                                name="experience"
                                                value={profile.experience}
                                                onChange={handleProfileChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-[#4CAF50] text-white rounded-xl hover:bg-[#45a049] transition-colors"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                        
                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordUpdate}>
                                <div className="space-y-6 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="current"
                                            value={newPassword.current}
                                            onChange={handlePasswordChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="new"
                                            value={newPassword.new}
                                            onChange={handlePasswordChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                            required
                                            minLength={8}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Password must be at least 8 characters long
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirm"
                                            value={newPassword.confirm}
                                            onChange={handlePasswordChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50]"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-[#4CAF50] text-white rounded-xl hover:bg-[#45a049] transition-colors"
                                            disabled={loading}
                                        >
                                            {loading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                        
                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <form onSubmit={handleNotificationUpdate}>
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-gray-900">Notification Channels</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Email Notifications</p>
                                                <p className="text-sm text-gray-500">Receive notifications via email</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    name="email"
                                                    className="sr-only peer" 
                                                    checked={notificationSettings.email}
                                                    onChange={handleNotificationChange}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4CAF50] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                            </label>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">SMS Notifications</p>
                                                <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    name="sms"
                                                    className="sr-only peer" 
                                                    checked={notificationSettings.sms}
                                                    onChange={handleNotificationChange}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4CAF50] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <hr className="my-6" />
                                    
                                    <h3 className="text-lg font-medium text-gray-900">Notification Types</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">New Appointment</p>
                                                <p className="text-sm text-gray-500">When a new appointment is scheduled</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    name="appointment"
                                                    className="sr-only peer" 
                                                    checked={notificationSettings.appointment}
                                                    onChange={handleNotificationChange}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4CAF50] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                            </label>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Cancellations</p>
                                                <p className="text-sm text-gray-500">When an appointment is cancelled</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    name="cancelation"
                                                    className="sr-only peer" 
                                                    checked={notificationSettings.cancelation}
                                                    onChange={handleNotificationChange}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4CAF50] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                            </label>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Appointment Reminder</p>
                                                <p className="text-sm text-gray-500">Reminder before upcoming appointments</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    name="reminder"
                                                    className="sr-only peer" 
                                                    checked={notificationSettings.reminder}
                                                    onChange={handleNotificationChange}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4CAF50] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-[#4CAF50] text-white rounded-xl hover:bg-[#45a049] transition-colors"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save Preferences'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DoctorSettings;
