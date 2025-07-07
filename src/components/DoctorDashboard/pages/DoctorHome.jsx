import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../../config/environment';

const DoctorHome = () => {
    const [stats, setStats] = useState({
        todayAppointments: 0,
        activePatients: 0,
        pendingRequests: 0
    });
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctorInfo, setDoctorInfo] = useState(null);
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const colorMap = {
        blue: 'bg-blue-100 text-blue-500',
        green: 'bg-[#4CAF50]/10 text-[#4CAF50]',
        yellow: 'bg-amber-100 text-amber-500'
    };

    // Load doctor info from local storage
    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                setDoctorInfo(userData);
                console.log('Doctor data loaded:', userData);
            }
        } catch (error) {
            console.error('Error loading doctor info from localStorage:', error);
        }
    }, []);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            
            try {
                // Fetch today's appointments
                const todayResponse = await axios.get(
                    `${config.API_BASE_URL}/api/doctors/appointments/today`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                // Fetch pending requests
                const requestsResponse = await axios.get(
                    `${config.API_BASE_URL}/api/appointments/requests`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                // Fetch upcoming appointments
                const upcomingResponse = await axios.get(
                    `${config.API_BASE_URL}/api/doctors/appointments/upcoming`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                // Fetch patients (to get count)
                const patientsResponse = await axios.get(
                    `${config.API_BASE_URL}/api/doctors/patients`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                // Update stats
                setStats({
                    todayAppointments: todayResponse.data.count || 0,
                    activePatients: patientsResponse.data.count || 0,
                    pendingRequests: requestsResponse.data.count || 0
                });
                
                // Update upcoming appointments
                setUpcomingAppointments(upcomingResponse.data.appointments?.slice(0, 3) || []);
                
                // Generate recent activity
                const activities = [];
                
                // Add pending requests to activity
                if (requestsResponse.data.appointments?.length > 0) {
                    requestsResponse.data.appointments.forEach(req => {
                        activities.push({
                            type: 'request',
                            message: `New appointment request from ${req.patient?.firstName || 'Patient'} ${req.patient?.lastName || ''}`,
                            time: formatActivityTime(new Date(req.createdAt))
                        });
                    });
                }
                
                // Add today's appointments to activity
                if (todayResponse.data.appointments?.length > 0) {
                    todayResponse.data.appointments.forEach(apt => {
                        activities.push({
                            type: 'appointment',
                            message: `${apt.type} with ${apt.patient?.firstName || 'Patient'} ${apt.patient?.lastName || ''}`,
                            time: formatActivityTime(new Date(apt.appointmentDate))
                        });
                    });
                }
                
                setRecentActivity(activities.slice(0, 3)); // Only show first 3 activities
                
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDashboardData();
    }, [token]);
    
    // Format relative time for activity feed
    const formatActivityTime = (date) => {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.round(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        
        const diffHours = Math.round(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        
        const diffDays = Math.round(diffHours / 24);
        if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    };
    
    // Format appointment date
    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Add this function to handle joining meetings
    const joinMeeting = async (appointmentId) => {
        try {
            // Check if appointment is active
            const response = await axios.get(
                `${config.API_BASE_URL}/api/meetings/${appointmentId}/check`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            if (!response.data.success || !response.data.canJoin) {
                toast.error('This meeting is not active right now');
                return;
            }
            
            // Get meeting details if it exists
            let meetingInfo;
            
            if (response.data.hasLink) {
                const detailsResponse = await axios.get(
                    `${config.API_BASE_URL}/api/meetings/${appointmentId}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                
                if (detailsResponse.data.success) {
                    meetingInfo = detailsResponse.data.meetingInfo;
                    
                    // Mark as joined
                    await axios.post(`${config.API_BASE_URL}/api/meetings/${appointmentId}/join`, {}, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    // Open Google Meet in a new tab
                    window.open(meetingInfo.link, '_blank');
                }
            } else {
                // Generate a new meeting link
                const generateResponse = await axios.post(
                    `${config.API_BASE_URL}/api/meetings/${appointmentId}/generate`,
                    {},
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                
                if (generateResponse.data.success) {
                    meetingInfo = generateResponse.data.meetingInfo;
                    
                    // Mark as joined
                    await axios.post(`${config.API_BASE_URL}/api/meetings/${appointmentId}/join`, {}, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    // Open Google Meet in a new tab
                    window.open(meetingInfo.link, '_blank');
                }
            }
        } catch (error) {
            console.error('Error joining meeting:', error);
            toast.error('Failed to join meeting');
        }
    };

    return (
        <div className="space-y-6">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
                </div>
            ) : (
                <>
                    {/* Welcome message with doctor name */}
                    {doctorInfo && (
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Welcome, Dr. {doctorInfo.firstName} {doctorInfo.lastName}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {doctorInfo.specialization} • {doctorInfo.experience} years of experience
                            </p>
                        </div>
                    )}
                
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { 
                                title: 'Today\'s Appointments', 
                                count: stats.todayAppointments, 
                                icon: 'ri-calendar-check-line', 
                                color: 'blue',
                                onClick: () => navigate('/doctor/appointments/today') 
                            },
                            { 
                                title: 'Active Patients', 
                                count: stats.activePatients, 
                                icon: 'ri-user-heart-line', 
                                color: 'green',
                                onClick: () => navigate('/doctor/patients')  
                            },
                            { 
                                title: 'Pending Requests', 
                                count: stats.pendingRequests, 
                                icon: 'ri-file-list-3-line', 
                                color: 'yellow',
                                onClick: () => navigate('/doctor/appointments')
                            }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                                onClick={stat.onClick}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}>
                                        <i className={`${stat.icon} text-2xl`}></i>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
                                        <p className="text-3xl font-bold text-[#4CAF50]">{stat.count}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Upcoming Appointments */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-md"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Upcoming Appointments</h3>
                                <button 
                                    onClick={() => navigate('/doctor/appointments/upcoming')}
                                    className="text-sm text-[#4CAF50] hover:underline flex items-center"
                                >
                                    View all <i className="ri-arrow-right-line ml-1"></i>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {upcomingAppointments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                                ) : (
                                    upcomingAppointments.map((appointment) => (
                                        <div 
                                            key={appointment._id} 
                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 border border-transparent hover:border-gray-100 cursor-pointer"
                                            onClick={() => navigate(`/doctor/appointments/${appointment._id}`)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center justify-center min-w-[50px]">
                                                    <span className="font-bold text-[#4CAF50]">
                                                        {formatDate(appointment.appointmentDate)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {appointment.timeSlot.start}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{appointment.type}</p>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1.5 text-sm rounded-xl bg-[#4CAF50]/10 text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors duration-300">
                                                View
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-md"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {recentActivity.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                                ) : (
                                    recentActivity.map((activity, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 border border-transparent hover:border-gray-100">
                                            <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === 'request' ? 'bg-amber-500' : 'bg-[#4CAF50]'}`}></div>
                                            <div>
                                                <p className="text-gray-800">{activity.message}</p>
                                                <p className="text-sm text-gray-500">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DoctorHome;
