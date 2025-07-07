import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/axiosConfig';

const AdminHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalUsers: 0,
        totalAppointments: 0,
        completedAssessments: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                // In a real application, you would fetch this data from your backend
                // For now, we'll use mock data with a small delay to simulate API calls
                setTimeout(() => {
                    setStats({
                        totalDoctors: 24,
                        totalUsers: 145,
                        totalAppointments: 78,
                        completedAssessments: 230
                    });
                    
                    setRecentActivities([
                        { type: 'user_registration', user: 'Rajesh Kumar', time: '10 minutes ago' },
                        { type: 'appointment_created', doctor: 'Dr. Sharma', patient: 'Anil Singh', time: '25 minutes ago' },
                        { type: 'assessment_completed', patient: 'Meera Patel', time: '1 hour ago' },
                        { type: 'doctor_registered', doctor: 'Dr. Mehta', time: '2 hours ago' },
                        { type: 'appointment_completed', doctor: 'Dr. Reddy', patient: 'Suresh Kumar', time: '3 hours ago' }
                    ]);
                    
                    setLoading(false);
                }, 800);
                
                // In production, you would use API calls like:
                // const statsResponse = await api.get('/admin/dashboard/stats');
                // const activitiesResponse = await api.get('/admin/dashboard/activities');
                // setStats(statsResponse.data);
                // setRecentActivities(activitiesResponse.data.activities);
                
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'user_registration': return 'ri-user-add-line';
            case 'appointment_created': return 'ri-calendar-check-line';
            case 'assessment_completed': return 'ri-file-list-3-line';
            case 'doctor_registered': return 'ri-user-star-line';
            case 'appointment_completed': return 'ri-video-chat-line';
            default: return 'ri-notification-3-line';
        }
    };
    
    const getActivityColor = (type) => {
        switch (type) {
            case 'user_registration': return 'bg-primary-50 text-primary-500';
            case 'appointment_created': return 'bg-secondary-50 text-secondary-500';
            case 'assessment_completed': return 'bg-info/10 text-info';
            case 'doctor_registered': return 'bg-success/10 text-success';
            case 'appointment_completed': return 'bg-purple-50 text-purple-500';
            default: return 'bg-neutral-50 text-neutral-500';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-primary-500"></div>
                    <p className="text-primary-500 font-medium">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Message */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
                    <p className="text-text-secondary">Welcome to the administrator control panel</p>
                </div>
                <div className="text-sm text-text-secondary">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        title: 'Total Doctors', 
                        value: stats.totalDoctors, 
                        icon: 'ri-user-star-line',
                        color: 'primary',
                        path: '/admin/doctors'
                    },
                    { 
                        title: 'Registered Users', 
                        value: stats.totalUsers, 
                        icon: 'ri-team-line',
                        color: 'success',
                        path: '/admin/users'
                    },
                    { 
                        title: 'Appointments', 
                        value: stats.totalAppointments, 
                        icon: 'ri-calendar-check-line',
                        color: 'secondary',
                        path: '/admin/appointments'
                    },
                    { 
                        title: 'Assessments', 
                        value: stats.completedAssessments, 
                        icon: 'ri-file-list-3-line',
                        color: 'info',
                        path: '/admin/assessments'
                    },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-neutral-100 group cursor-pointer"
                        onClick={() => navigate(stat.path)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-text-secondary text-sm font-medium">{stat.title}</p>
                                <h3 className={`text-3xl font-bold mt-2 text-${stat.color}-500`}>{stat.value.toLocaleString()}</h3>
                            </div>
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-500 group-hover:bg-${stat.color}-500 group-hover:text-white transition-colors duration-300`}>
                                <i className={`${stat.icon} text-xl`}></i>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-neutral-100">
                            <span className={`text-sm text-${stat.color}-500 group-hover:text-${stat.color}-600 flex items-center gap-1`}>
                                View details
                                <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1"></i>
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Registration Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-card"
                >
                    <h3 className="text-lg font-semibold text-text-primary mb-6">User Registration</h3>
                    <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-xl">
                        <p className="text-text-secondary">User registration chart placeholder</p>
                        {/* In a real application, you would use a chart library like Chart.js or Recharts */}
                    </div>
                </motion.div>

                {/* Appointments Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 shadow-card"
                >
                    <h3 className="text-lg font-semibold text-text-primary mb-6">Appointments</h3>
                    <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-xl">
                        <p className="text-text-secondary">Appointments chart placeholder</p>
                        {/* In a real application, you would use a chart library like Chart.js or Recharts */}
                    </div>
                </motion.div>
            </div>

            {/* Recent Activities */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-card"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Recent Activities</h3>
                    <button className="text-primary-500 text-sm hover:text-primary-600 transition-colors duration-200">
                        View All
                    </button>
                </div>
                <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + (index * 0.1) }}
                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
                        >
                            <div className={`${getActivityColor(activity.type)} p-2 rounded-lg`}>
                                <i className={getActivityIcon(activity.type)}></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-text-primary font-medium">
                                    {activity.type === 'user_registration' && `New user registered: ${activity.user}`}
                                    {activity.type === 'appointment_created' && `New appointment scheduled: ${activity.doctor} with ${activity.patient}`}
                                    {activity.type === 'assessment_completed' && `Assessment completed by ${activity.patient}`}
                                    {activity.type === 'doctor_registered' && `New doctor registered: ${activity.doctor}`}
                                    {activity.type === 'appointment_completed' && `Appointment completed: ${activity.doctor} with ${activity.patient}`}
                                </p>
                                <p className="text-text-secondary text-sm">{activity.time}</p>
                            </div>
                            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                                <i className="ri-more-2-fill text-neutral-500"></i>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-2xl p-6 shadow-card"
            >
                <h3 className="text-lg font-semibold text-text-primary mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { title: 'Add Doctor', icon: 'ri-user-add-line', color: 'primary', path: '/admin/doctors/add' },
                        { title: 'View Reports', icon: 'ri-line-chart-line', color: 'success', path: '/admin/reports' },
                        { title: 'System Settings', icon: 'ri-settings-line', color: 'secondary', path: '/admin/settings' },
                        { title: 'User Support', icon: 'ri-customer-service-line', color: 'info', path: '/admin/support' }
                    ].map((action, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(action.path)}
                            className="p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-all duration-300 flex flex-col items-center gap-3 group"
                        >
                            <div className={`p-3 rounded-xl bg-${action.color}-100 text-${action.color}-500 group-hover:bg-${action.color}-500 group-hover:text-white transition-colors duration-300`}>
                                <i className={`${action.icon} text-xl`}></i>
                            </div>
                            <span className="text-text-primary font-medium text-sm">{action.title}</span>
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminHome;
