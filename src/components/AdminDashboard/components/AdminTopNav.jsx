import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../Dashboard/context/SidebarContext';
import axios from 'axios';
import api from '../../../services/axiosConfig';

const AdminTopNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleSidebar } = useSidebar();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [systemStats, setSystemStats] = useState({
        newDoctors: 0,
        pendingApprovals: 0,
        systemAlerts: 0
    });
    
    // Get admin data from localStorage
    const adminData = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // Get current page title based on path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/admin' || path === '/admin/') return 'Admin Dashboard';
        if (path.includes('/doctors')) return 'Doctor Management';
        if (path.includes('/users')) return 'User Management';
        if (path.includes('/appointments')) return 'Appointment Management';
        if (path.includes('/reports')) return 'Analytics & Reports';
        if (path.includes('/settings')) return 'System Settings';
        if (path.includes('/support')) return 'Support Tickets';
        return 'Admin Portal';
    };

    // Fetch system notifications and stats
    useEffect(() => {
        const fetchAdminNotifications = async () => {
            try {
                // In a real app, these would come from API calls
                // Mock notifications for now
                const mockNotifications = [
                    {
                        id: '1',
                        type: 'doctor',
                        title: 'New Doctor Registration',
                        message: 'Dr. Sarah Johnson has registered and needs approval',
                        time: new Date(Date.now() - 30 * 60000), // 30 minutes ago
                        priority: 'high',
                        path: '/admin/doctors'
                    },
                    {
                        id: '2',
                        type: 'user',
                        title: 'User Support Request',
                        message: 'User #2845 needs assistance with account settings',
                        time: new Date(Date.now() - 2 * 3600000), // 2 hours ago
                        priority: 'medium',
                        path: '/admin/support'
                    },
                    {
                        id: '3',
                        type: 'system',
                        title: 'System Alert',
                        message: 'Database backup completed successfully',
                        time: new Date(Date.now() - 5 * 3600000), // 5 hours ago
                        priority: 'low',
                        path: '/admin/settings/backups'
                    }
                ];
                
                setNotifications(mockNotifications);
                
                // Mock system stats - would come from API in real app
                setSystemStats({
                    newDoctors: 3,
                    pendingApprovals: 7,
                    systemAlerts: 2
                });
            } catch (error) {
                console.error('Error fetching admin notifications:', error);
            }
        };
        
        fetchAdminNotifications();
        
        // In a real application, set up interval for periodic refreshes
        const interval = setInterval(fetchAdminNotifications, 2 * 60 * 1000); // Every 2 minutes
        return () => clearInterval(interval);
    }, []);

    // Format relative time for notifications
    const getRelativeTime = (date) => {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.round(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        
        const diffHours = Math.round(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hr ago`;
        
        const diffDays = Math.round(diffHours / 24);
        if (diffDays < 7) return `${diffDays} day ago`;
        
        return new Date(date).toLocaleDateString();
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch(type) {
            case 'doctor': return 'ri-user-star-line';
            case 'user': return 'ri-user-line';
            case 'system': return 'ri-server-line';
            case 'appointment': return 'ri-calendar-check-line';
            default: return 'ri-notification-line';
        }
    };

    // Get notification priority styling
    const getPriorityStyle = (priority) => {
        switch(priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        navigate('/login');
    };

    const handleNotificationClick = (notification) => {
        setShowNotifications(false);
        navigate(notification.path);
    };

    return (
        <div className="sticky top-0 left-0 z-30">
            <div className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Left Section with Toggle and Page Title */}
                    <div className="flex items-center gap-4">
                        <button 
                            type="button" 
                            className="p-2 rounded-xl hover:bg-[#4CAF50]/10 text-[#333333] transition-all duration-300 hover:rotate-180" 
                            onClick={toggleSidebar}
                        >
                            <i className="ri-menu-line text-xl"></i>
                        </button>

                        <div>
                            <h1 className="text-xl font-bold text-[#333333]">
                                {getPageTitle()}
                            </h1>
                            <p className="text-sm text-[#6C757D] hidden md:block">
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                    </div>
                    
                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="hidden md:flex relative">
                            <input 
                                type="text" 
                                placeholder="Search users, doctors, records..."
                                className="pr-10 pl-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm w-72"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D]">
                                <i className="ri-search-line"></i>
                            </button>
                        </div>

                        {/* System Status */}
                        <button 
                            onClick={() => navigate('/admin/doctors')}
                            className="hidden sm:flex items-center gap-1.5 p-1.5 md:px-3 md:py-2 bg-amber-50 text-amber-700 rounded-xl transition-all duration-300 hover:bg-amber-100"
                        >
                            <i className="ri-user-star-line"></i>
                            <span className="font-medium text-sm">
                                {systemStats.pendingApprovals} approvals pending
                            </span>
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                className="p-2 rounded-xl hover:bg-[#4CAF50]/10 text-[#333333] transition-all duration-300 relative"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <i className="ri-notification-line text-xl"></i>
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-[#4CAF50] text-white text-xs rounded-full">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg py-2 z-50 transform transition-all duration-300 origin-top">
                                    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
                                        <h3 className="text-sm font-semibold text-[#333333]">System Notifications</h3>
                                        <span className="text-xs bg-[#4CAF50]/10 text-[#4CAF50] px-2 py-0.5 rounded-full">
                                            {notifications.length} new
                                        </span>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map(notification => (
                                                <div 
                                                    key={notification.id} 
                                                    className="px-4 py-3 hover:bg-[#F8F9F4] transition-colors duration-300 cursor-pointer"
                                                    onClick={() => handleNotificationClick(notification)}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-[#4CAF50]/10 flex items-center justify-center flex-shrink-0">
                                                            <i className={`${getNotificationIcon(notification.type)} text-[#4CAF50]`}></i>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-sm font-medium text-[#333333]">{notification.title}</p>
                                                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${getPriorityStyle(notification.priority)}`}>
                                                                    {notification.priority}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-[#6C757D] mt-1">{notification.message}</p>
                                                            <p className="text-xs text-[#4CAF50] mt-1">{getRelativeTime(notification.time)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-6 text-center">
                                                <p className="text-sm text-[#6C757D]">No new notifications</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-gray-100 p-2 text-center">
                                        <button 
                                            className="text-xs text-[#4CAF50] hover:underline"
                                            onClick={() => navigate('/admin/notifications')}
                                        >
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions Button */}
                        <div className="relative group">
                            <button className="p-2 rounded-xl hover:bg-[#4CAF50]/10 text-[#333333] transition-all duration-300">
                                <i className="ri-add-line text-xl"></i>
                            </button>
                            
                            {/* Quick Actions Tooltip */}
                            <div className="absolute hidden group-hover:block right-0 mt-2 bg-white rounded-lg shadow-lg p-2 min-w-36 z-50">
                                <button 
                                    onClick={() => navigate('/admin/doctors/add')}
                                    className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-[#F8F9F4] text-[#333333]"
                                >
                                    <i className="ri-user-add-line mr-2 text-[#4CAF50]"></i> Add Doctor
                                </button>
                                <button 
                                    onClick={() => navigate('/admin/users/create')}
                                    className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-[#F8F9F4] text-[#333333]"
                                >
                                    <i className="ri-user-add-line mr-2 text-[#4CAF50]"></i> Create User
                                </button>
                                <button 
                                    onClick={() => navigate('/admin/settings')}
                                    className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-[#F8F9F4] text-[#333333]"
                                >
                                    <i className="ri-settings-line mr-2 text-[#4CAF50]"></i> System Settings
                                </button>
                            </div>
                        </div>

                        {/* Full Screen Button */}
                        <button className="p-2 rounded-xl hover:bg-[#4CAF50]/10 text-[#333333] transition-all duration-300">
                            <i className="ri-fullscreen-line text-xl"></i>
                        </button>

                        {/* Admin Profile */}
                        <div className="relative">
                            <button 
                                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#4CAF50]/10 transition-all duration-300"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-lg font-bold text-purple-700">
                                        {adminData?.firstName?.[0] || 'A'}
                                    </span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <h2 className="text-sm font-semibold text-[#333333]">
                                        {adminData?.firstName || 'Admin'} {adminData?.lastName || 'User'}
                                    </h2>
                                    <p className="text-xs text-purple-700">Administrator</p>
                                </div>
                                <i className={`ri-arrow-down-s-line transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`}></i>
                            </button>

                            {/* Profile Dropdown */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-2 z-50 transform transition-all duration-300 origin-top">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-[#333333]">Signed in as</p>
                                        <p className="text-xs text-[#6C757D]">{adminData?.email || 'admin@example.com'}</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            navigate('/admin/profile');
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-[#333333] hover:bg-[#F8F9F4]"
                                    >
                                        <i className="ri-user-line mr-2"></i> Admin Profile
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            navigate('/admin/settings');
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-[#333333] hover:bg-[#F8F9F4] transition-colors duration-300"
                                    >
                                        <i className="ri-settings-line mr-2"></i> System Settings
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            navigate('/admin/activity-logs');
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-[#333333] hover:bg-[#F8F9F4] transition-colors duration-300"
                                    >
                                        <i className="ri-file-list-line mr-2"></i> Activity Logs
                                    </button>
                                    <div className="h-px bg-gray-100 my-2"></div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                                    >
                                        <i className="ri-logout-box-line mr-2"></i> Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTopNav;
