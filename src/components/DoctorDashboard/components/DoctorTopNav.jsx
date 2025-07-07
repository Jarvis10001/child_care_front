import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../Dashboard/context/SidebarContext';

const DoctorTopNav = () => {
    const [doctor, setDoctor] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const { isOpen, setIsOpen } = useSidebar();
    const navigate = useNavigate();
    
    useEffect(() => {
        // Get doctor data from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setDoctor(userData);
                
                // For demonstration, create some sample notifications
                setUnreadNotifications([
                    { 
                        id: 1, 
                        message: 'New appointment request from John D.', 
                        time: '5 min ago',
                        type: 'request'
                    },
                    { 
                        id: 2, 
                        message: 'Your 2:30 PM appointment is starting soon', 
                        time: '10 min ago',
                        type: 'reminder'
                    }
                ]);
            } catch (e) {
                console.error('Error parsing user data', e);
            }
        }
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="sticky top-0 z-10 bg-white py-3 px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {/* Mobile menu toggle */}
                    <button
                        className="block md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <i className="ri-menu-line text-xl"></i>
                    </button>
                    
                    {/* Page title - can be dynamic if needed */}
                    <h2 className="text-xl font-semibold text-gray-800 ml-2 md:ml-0">Doctor Dashboard</h2>
                </div>
                
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="hidden sm:block relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-64 py-2 pl-10 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] text-sm"
                        />
                        <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
                    </div>
                    
                    {/* Notifications */}
                    <div className="relative">
                        <button 
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <i className="ri-notification-2-line text-xl"></i>
                            {unreadNotifications.length > 0 && (
                                <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs">
                                    {unreadNotifications.length}
                                </span>
                            )}
                        </button>
                        
                        {/* Notifications dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-20 border border-gray-100">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                                </div>
                                {unreadNotifications.length > 0 ? (
                                    <div className="max-h-96 overflow-y-auto">
                                        {unreadNotifications.map(notification => (
                                            <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-l-2 border-transparent hover:border-[#4CAF50] transition-colors cursor-pointer">
                                                <p className="text-sm text-gray-800">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-4 py-3 text-center text-gray-500">
                                        <p>No new notifications</p>
                                    </div>
                                )}
                                <div className="px-4 py-2 border-t border-gray-100 text-center">
                                    <button className="text-sm text-[#4CAF50] hover:underline">
                                        Mark all as read
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Profile Menu */}
                    <div className="relative">
                        <button 
                            className="flex items-center space-x-2 focus:outline-none"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <div className="w-9 h-9 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                                <i className="ri-user-3-line text-[#4CAF50]"></i>
                            </div>
                            <div className="hidden md:block text-left">
                                {doctor ? (
                                    <>
                                        <p className="text-sm font-medium text-gray-800">Dr. {doctor.firstName} {doctor.lastName}</p>
                                        <p className="text-xs text-gray-500">{doctor.specialization}</p>
                                    </>
                                ) : (
                                    <p className="text-sm font-medium text-gray-800">Loading...</p>
                                )}
                            </div>
                            <i className={`ri-arrow-down-s-line text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}></i>
                        </button>
                        
                        {/* Profile dropdown */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-20 border border-gray-100">
                                <Link to="/doctor/profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/5 hover:text-[#4CAF50] flex items-center">
                                    <i className="ri-user-line mr-2"></i> My Profile
                                </Link>
                                <Link to="/doctor/settings" className="px-4 py-2 text-sm text-gray-700 hover:bg-[#4CAF50]/5 hover:text-[#4CAF50] flex items-center">
                                    <i className="ri-settings-line mr-2"></i> Settings
                                </Link>
                                <hr className="my-1" />
                                <button 
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left flex items-center"
                                >
                                    <i className="ri-logout-box-line mr-2"></i> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorTopNav;
