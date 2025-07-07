import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import axios from 'axios';

const TopNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleSidebar } = useSidebar();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // Get current page title based on path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard' || path === '/dashboard/') return 'Dashboard';
        if (path.includes('/profile')) return 'My Profile';
        if (path.includes('/consultations')) return 'Consultations';
        if (path.includes('/health')) return 'Health Records';
        if (path.includes('/milestones')) return 'Milestones';
        if (path.includes('/child/registration')) return 'Child Registration';
        if (path.includes('/settings')) return 'Settings';
        return 'Patient Dashboard';
    };

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // In a real app, this would fetch from an API endpoint
                // For now, we'll use mock notifications
                const mockNotifications = [
                    {
                        id: '1',
                        type: 'appointment',
                        title: 'Upcoming Appointment',
                        message: 'You have an appointment with Dr. Smith tomorrow at 10:00 AM',
                        time: new Date(Date.now() - 30 * 60000), // 30 minutes ago
                        read: false,
                        path: '/dashboard/consultations/history'
                    },
                    {
                        id: '2',
                        type: 'milestone',
                        title: 'Milestone Completed',
                        message: 'Your child has reached a new development milestone!',
                        time: new Date(Date.now() - 2 * 3600000), // 2 hours ago
                        read: false,
                        path: '/dashboard/milestones/timeline'
                    },
                    {
                        id: '3',
                        type: 'reminder',
                        title: 'Vaccination Reminder',
                        message: 'Your child is due for vaccination next week',
                        time: new Date(Date.now() - 24 * 3600000), // 1 day ago
                        read: true,
                        path: '/dashboard/health/vaccinations'
                    }
                ];
                
                setNotifications(mockNotifications);
                setUnreadNotifications(mockNotifications.filter(n => !n.read).length);
                
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        
        fetchNotifications();
        
        // Refresh notifications every 5 minutes in a real app
        // const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
        // return () => clearInterval(interval);
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

    const handleProfileClick = () => {
        setShowProfileMenu(false);
        navigate('/dashboard/profile');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleNotificationClick = (notification) => {
        // Mark notification as read (in a real app, would send API request)
        setNotifications(prev => prev.map(n => 
            n.id === notification.id ? {...n, read: true} : n
        ));
        
        // Update unread count
        setUnreadNotifications(prev => Math.max(0, prev - 1));
        
        setShowNotifications(false);
        navigate(notification.path);
    };

    // Get icon for notification type
    const getNotificationIcon = (type) => {
        switch(type) {
            case 'appointment': return 'ri-calendar-check-line';
            case 'milestone': return 'ri-flag-line';
            case 'reminder': return 'ri-notification-3-line';
            case 'message': return 'ri-message-2-line';
            default: return 'ri-notification-line';
        }
    };

    return (
        <div className="sticky top-0 left-0 z-30">
            <div className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Left Section with Title and Toggle */}
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
                        {/* <div className="hidden md:flex relative">
                            <input 
                                type="text" 
                                placeholder="Search..."
                                className="pr-10 pl-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50] text-sm w-64"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D]">
                                <i className="ri-search-line"></i>
                            </button>
                        </div> */}

                        {/* Schedule Appointment Button */}
                        <button 
                            onClick={() => navigate('/dashboard/consultations/schedule')}
                            className="hidden sm:flex items-center gap-1.5 p-1.5 md:px-3 md:py-2 bg-[#4CAF50]/10 text-[#4CAF50] rounded-xl transition-all duration-300 hover:bg-[#4CAF50]/20"
                        >
                            <i className="ri-calendar-line"></i>
                            <span className="font-medium text-sm hidden md:block">Schedule Appointment</span>
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                className="p-2 rounded-xl hover:bg-[#4CAF50]/10 text-[#333333] transition-all duration-300 relative"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <i className="ri-notification-line text-xl"></i>
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-[#4CAF50] text-white text-xs rounded-full">
                                        {unreadNotifications}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg py-2 z-50 transform transition-all duration-300 origin-top">
                                    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
                                        <h3 className="text-sm font-semibold text-[#333333]">Notifications</h3>
                                        {unreadNotifications > 0 && (
                                            <span className="text-xs bg-[#4CAF50]/10 text-[#4CAF50] px-2 py-0.5 rounded-full">
                                                {unreadNotifications} new
                                            </span>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map(notification => (
                                                <div 
                                                    key={notification.id} 
                                                    className={`px-4 py-3 hover:bg-[#F8F9F4] transition-colors duration-300 cursor-pointer ${
                                                        !notification.read ? 'bg-[#F8F9F4]/50' : ''
                                                    }`}
                                                    onClick={() => handleNotificationClick(notification)}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`w-9 h-9 rounded-full bg-[#4CAF50]/10 flex items-center justify-center flex-shrink-0 ${
                                                            !notification.read ? 'bg-[#4CAF50]/20' : ''
                                                        }`}>
                                                            <i className={`${getNotificationIcon(notification.type)} text-[#4CAF50]`}></i>
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-medium ${!notification.read ? 'text-[#333333]' : 'text-[#6C757D]'}`}>
                                                                {notification.title}
                                                            </p>
                                                            <p className="text-xs text-[#6C757D] mt-1">{notification.message}</p>
                                                            <p className="text-xs text-[#4CAF50] mt-1">{getRelativeTime(notification.time)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-6 text-center">
                                                <p className="text-sm text-[#6C757D]">No notifications</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-gray-100 p-2 text-center">
                                        <button 
                                            className="text-xs text-[#4CAF50] hover:underline"
                                            onClick={() => {
                                                // Mark all as read (in a real app, would send API request)
                                                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                                setUnreadNotifications(0);
                                                setShowNotifications(false);
                                            }}
                                        >
                                            Mark all as read
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Full Screen Button */}
                        {/* <button className="p-2 rounded-xl hover:bg-[#4CAF50]/10 text-[#333333] transition-all duration-300">
                            <i className="ri-fullscreen-line text-xl"></i>
                        </button> */}

                        {/* Patient Profile */}
                        <div className="relative">
                            <button 
                                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#4CAF50]/10 transition-all duration-300"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <div className="w-9 h-9 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                                    <span className="text-lg font-bold text-[#4CAF50]">
                                        {userData?.firstName?.[0] || 'U'}
                                    </span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <h2 className="text-sm font-semibold text-[#333333]">
                                        {userData?.firstName || ''} {userData?.lastName || ''}
                                    </h2>
                                    <p className="text-xs text-[#6C757D]">Parent</p>
                                </div>
                                <i className={`ri-arrow-down-s-line transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`}></i>
                            </button>

                            {/* Profile Dropdown */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 transform transition-all duration-300 origin-top">
                                    <button 
                                        onClick={handleProfileClick}
                                        className="w-full flex items-center px-4 py-2 text-sm text-[#333333] hover:bg-[#F8F9F4]"
                                    >
                                        <i className="ri-user-line mr-2"></i> My Profile
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            navigate('/dashboard/child/registration');
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-[#333333] hover:bg-[#F8F9F4] transition-colors duration-300"
                                    >
                                        <i className="ri-user-smile-line mr-2"></i> Child Profile
                                    </button>
                                    {/* <button 
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            navigate('/dashboard/settings');
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-[#333333] hover:bg-[#F8F9F4] transition-colors duration-300"
                                    >
                                        <i className="ri-settings-line mr-2"></i> Settings
                                    </button> */}
                                    <div className="h-px bg-gray-100 my-2"></div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-4 py-2 text-sm text-[#4CAF50] hover:bg-[#F8F9F4] transition-colors duration-300"
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

export default TopNav;
