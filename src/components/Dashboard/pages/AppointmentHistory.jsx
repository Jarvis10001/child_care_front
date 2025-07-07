import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import config from '../../../config/environment';

const AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeAppointments, setActiveAppointments] = useState({});
    const [meetingLinks, setMeetingLinks] = useState({});
    const [joiningMeeting, setJoiningMeeting] = useState({});
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchAppointments();
    }, [activeFilter]);
    
    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login again');
                navigate('/login');
                return;
            }

            console.log('Fetching appointments with token:', token);
            const response = await axios.get(
                `${config.API_BASE_URL}/api/appointments/patient`,
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Appointments response:', response.data);
            if (response.data.success) {
                setAppointments(response.data.appointments);
            }
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to load appointments');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Format appointment date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Get status badge color
    const getStatusColor = (status) => {
        const statusColors = {
            'Requested': 'bg-yellow-100 text-yellow-800',
            'Scheduled': 'bg-blue-100 text-blue-800',
            'Confirmed': 'bg-green-100 text-green-800',
            'Completed': 'bg-purple-100 text-purple-800',
            'Cancelled': 'bg-red-100 text-red-800',
            'No Show': 'bg-gray-100 text-gray-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };
    
    // Calculate time remaining until appointment
    const getTimeRemaining = (dateString) => {
        const appointmentDate = new Date(dateString);
        const now = new Date();
        
        if (appointmentDate < now) {
            return { isPast: true };
        }
        
        const diffTime = appointmentDate - now;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        return {
            isPast: false,
            days: diffDays,
            hours: diffHours
        };
    };
    
    // Determine if appointment is cancellable (only if more than 24 hours away)
    const isCancellable = (appointment) => {
        if (appointment.status === 'Cancelled' || appointment.status === 'Completed') {
            return false;
        }
        
        const timeRemaining = getTimeRemaining(appointment.appointmentDate);
        return !timeRemaining.isPast && (timeRemaining.days > 0 || timeRemaining.hours >= 24);
    };
    
    const handleCancel = async (appointmentId) => {
        try {
            const response = await axios.put(
                `${config.API_BASE_URL}/api/appointments/cancel/${appointmentId}`,
                {},
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            
            if (response.data.success) {
                toast.success('Appointment cancelled successfully');
                fetchAppointments();
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    // Check if an appointment is active (can be joined) today
    const checkAppointmentActive = async (appointmentId) => {
        try {
            const response = await axios.get(
                `${config.API_BASE_URL}/api/meetings/check/${appointmentId}`,
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            
            if (response.data.success) {
                setActiveAppointments(prev => ({
                    ...prev,
                    [appointmentId]: response.data
                }));
                
                return response.data;
            }
        } catch (error) {
            console.error('Error checking appointment status:', error);
            return { canJoin: false, hasLink: false };
        }
    };
    
    // Generate meeting link for an appointment
    const generateMeetingLink = async (appointmentId) => {
        try {
            const response = await axios.post(
                `${config.API_BASE_URL}/api/appointments/meeting/${appointmentId}/generate`,
                {},
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            
            if (response.data.success) {
                toast.success('Meeting link generated successfully');
                
                // Update active appointments state
                checkAppointmentActive(appointmentId);
                
                return response.data.meetingInfo;
            }
        } catch (error) {
            console.error('Error generating meeting link:', error);
            toast.error(error.response?.data?.message || 'Failed to generate meeting link');
            return null;
        }
    };
    
    // Join meeting as patient
    const joinMeetingAsPatient = async (appointmentId) => {
        try {
            setJoiningMeeting(prev => ({ ...prev, [appointmentId]: true }));
            toast.loading('Joining meeting room...', { id: 'join-meeting' });

            // Get meeting details
            const response = await axios.get(
                `${config.API_BASE_URL}/api/meetings/${appointmentId}`,
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.success) {
                const meetingInfo = response.data.meetingInfo;
                
                toast.success(`Joining room: ${meetingInfo.meetingId || 'Meeting room'}`, { id: 'join-meeting' });

                // Record patient joining the meeting - FIXED ENDPOINT
                try {
                    await axios.post(
                        `${config.API_BASE_URL}/api/meetings/join/${appointmentId}`,
                        { role: 'patient' },
                        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
                    );
                } catch (joinError) {
                    console.error('Error recording patient join:', joinError);
                }

                // Open the meeting room
                window.open(meetingInfo.link, '_blank');
            } else {
                toast.error('Meeting room not available. Please ask your doctor to create the meeting room.', { id: 'join-meeting' });
            }
        } catch (error) {
            console.error('Error joining meeting:', error);
            toast.error('Failed to join meeting room', { id: 'join-meeting' });
        } finally {
            setJoiningMeeting(prev => ({ ...prev, [appointmentId]: false }));
        }
    };

    // Join a meeting
    const joinMeeting = async (appointmentId) => {
        try {
            // First check if appointment is active
            const status = await checkAppointmentActive(appointmentId);
            
            if (!status.canJoin) {
                toast.error('This appointment cannot be joined at this time');
                return;
            }
            
            let meetingInfo;
            
            // If link already exists, get it using correct endpoint
            if (status.hasLink) {
                const response = await axios.get(
                    `${config.API_BASE_URL}/api/meetings/${appointmentId}`,
                    { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
                );
                
                if (response.data.success) {
                    meetingInfo = response.data.meetingInfo;
                    // Join the meeting using correct endpoint - FIXED ENDPOINT
                    await axios.post(`${config.API_BASE_URL}/api/meetings/join/${appointmentId}`, {}, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    
                    // Open the Google Meet link in a new tab
                    window.open(meetingInfo.link, '_blank');
                }
            } else {
                // Generate new link using correct endpoint
                const response = await axios.post(
                    `${config.API_BASE_URL}/api/meetings/generate/${appointmentId}`,
                    {},
                    { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
                );
                
                if (response.data.success) {
                    meetingInfo = response.data.meetingInfo;
                    // Join the meeting - FIXED ENDPOINT
                    await axios.post(`${config.API_BASE_URL}/api/meetings/join/${appointmentId}`, {}, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    // Open the Google Meet link in a new tab
                    window.open(meetingInfo.link, '_blank');
                }
            }
            
            if (!meetingInfo) {
                toast.error('Failed to retrieve meeting link');
            }
            
        } catch (error) {
            console.error('Error joining meeting:', error);
            toast.error('Failed to join meeting');
        }
    };
    
    const handleGenerateLink = async (appointmentId) => {
        try {
            // For patients, they cannot generate links - only doctors can
            toast.info('Only doctors can generate meeting links. Please wait for your doctor to create the meeting room.');
        } catch (error) {
            console.error('Error generating meeting:', error);
            toast.error(error.response?.data?.message || 'Error generating meeting link');
        }
    };

    // Check if today's appointments are active when the component loads
    useEffect(() => {
        const checkTodaysAppointments = async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Filter today's confirmed appointments
            const todaysAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.appointmentDate);
                aptDate.setHours(0, 0, 0, 0);
                return aptDate.getTime() === today.getTime() && apt.status === 'Confirmed';
            });
            
            // Check each appointment's active status
            for (const apt of todaysAppointments) {
                checkAppointmentActive(apt._id);
            }
        };
        
        if (appointments.length > 0) {
            checkTodaysAppointments();
        }
    }, [appointments]);
    
    // Check for meeting notifications
    const checkMeetingNotifications = async () => {
        try {
            const response = await axios.get(
                `${config.API_BASE_URL}/api/notifications/meeting-updates`,
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.success && response.data.notifications.length > 0) {
                response.data.notifications.forEach(notification => {
                    if (notification.type === 'meeting_ready') {
                        toast.success(`Meeting link ready for appointment on ${formatDate(notification.appointmentDate)}`);
                    }
                });
            }
        } catch (error) {
            console.error('Error checking notifications:', error);
        }
    };

    // Check for notifications on component mount
    useEffect(() => {
        checkMeetingNotifications();
    }, []);

    const renderMeetingActions = (appointment) => {
        const timeRemaining = getTimeRemaining(appointment.appointmentDate);
        const hasMeetingLink = appointment.meeting?.isGenerated;
        const isJoining = joiningMeeting[appointment._id];

        if (appointment.status !== 'Confirmed' || timeRemaining.isPast) {
            return null;
        }

        return (
            <div className="mt-4 space-y-2">
                {hasMeetingLink ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-800">
                                    <i className="ri-video-chat-line mr-1"></i>
                                    Meeting link is ready
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    Access Code: {appointment.meeting?.accessCode || 'N/A'}
                                </p>
                            </div>
                            <button
                                onClick={() => joinMeetingAsPatient(appointment._id)}
                                disabled={isJoining}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {isJoining ? (
                                    <i className="ri-loader-4-line animate-spin"></i>
                                ) : (
                                    <>
                                        <i className="ri-video-chat-line mr-1"></i>
                                        Join Meeting
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <i className="ri-time-line mr-1"></i>
                            Waiting for doctor to generate meeting link
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-[#333333] mb-2">My Appointments</h1>
                    <p className="text-[#6C757D]">View and manage your upcoming and past appointments</p>
                </div>
                
                {/* Filter Tabs */}
                <div className="flex mb-6 border-b border-gray-200">
                    {[
                        { id: 'all', label: 'All Appointments' },
                        { id: 'Confirmed', label: 'Confirmed' },
                        { id: 'Requested', label: 'Pending' },
                        { id: 'Completed', label: 'Completed' },
                        { id: 'Cancelled', label: 'Cancelled' }
                    ].map(filter => (
                        <button 
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`mr-4 py-3 px-1 font-medium border-b-2 transition-colors ${
                                activeFilter === filter.id
                                ? 'border-[#4CAF50] text-[#4CAF50]'
                                : 'border-transparent text-[#6C757D] hover:text-gray-700'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
                
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4CAF50]/10 mb-4">
                            <i className="ri-calendar-line text-[#4CAF50] text-3xl"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-[#333333] mb-2">No appointments found</h2>
                        <p className="text-[#6C757D] mb-6">You don't have any {activeFilter !== 'all' ? activeFilter.toLowerCase() : ''} appointments</p>
                        <button 
                            onClick={() => navigate('/dashboard/consultations/schedule')}
                            className="px-6 py-3 bg-[#4CAF50] text-white rounded-xl shadow-md hover:bg-[#45a049] transition-colors"
                        >
                            Schedule an Appointment
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {appointments.map(appointment => {
                            const timeRemaining = getTimeRemaining(appointment.appointmentDate);
                            return (
                                <motion.div
                                    key={appointment._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                                >
                                    {/* Appointment Card Header */}
                                    <div className={`p-4 flex justify-between items-center ${appointment.status === 'Confirmed' ? 'bg-[#4CAF50]/5' : appointment.status === 'Cancelled' ? 'bg-red-50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-[#4CAF50]/20 flex items-center justify-center mr-3">
                                                <i className="ri-stethoscope-line text-[#4CAF50]"></i>
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#333333]">{appointment.type}</p>
                                                <p className="text-sm text-[#6C757D]">{appointment.mode}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                    
                                    {/* Appointment Card Content */}
                                    <div className="p-6">
                                        {/* Doctor Info */}
                                        <div className="mb-5">
                                            <h3 className="text-sm font-medium text-[#6C757D] mb-1">DOCTOR</h3>
                                            <p className="font-medium text-[#333333]">
                                                Dr. {appointment.doctor.name.firstName} {appointment.doctor.name.lastName}
                                            </p>
                                            <p className="text-[#6C757D]">{appointment.doctor.specialization}</p>
                                        </div>
                                        
                                        {/* Schedule Info */}
                                        <div className="mb-5">
                                            <h3 className="text-sm font-medium text-[#6C757D] mb-1">SCHEDULE</h3>
                                            <p className="font-medium text-[#333333]">{formatDate(appointment.appointmentDate)}</p>
                                            <p className="text-[#6C757D]">{appointment.timeSlot.start} - {appointment.timeSlot.end}</p>
                                            
                                            {/* Time Remaining */}
                                            {appointment.status !== 'Cancelled' && !timeRemaining.isPast && (
                                                <div className="mt-2 text-sm">
                                                    {appointment.status === 'Confirmed' ? (
                                                        timeRemaining.days > 0 ? (
                                                            <p className="text-blue-600">
                                                                <i className="ri-time-line"></i> {timeRemaining.days} days, {timeRemaining.hours} hours remaining
                                                            </p>
                                                        ) : (
                                                            <p className="text-amber-600">
                                                                <i className="ri-time-line"></i> {timeRemaining.hours} hours remaining
                                                            </p>
                                                        )
                                                    ) : (
                                                        <p className="text-gray-500">
                                                            <i className="ri-time-line"></i> Appointment {appointment.status.toLowerCase()}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Meeting Actions */}
                                        {renderMeetingActions(appointment)}
                                        
                                        {/* Actions */}
                                        <div className="mt-6 flex space-x-3">
                                            {appointment.status === 'Confirmed' && !timeRemaining.isPast && (
                                                <button 
                                                    onClick={() => handleGenerateLink(appointment._id)}
                                                    className="flex-1 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <i className="ri-video-chat-line"></i>
                                                    Generate Meeting Link
                                                </button>
                                            )}
                                            
                                            {isCancellable(appointment) && (
                                                <button 
                                                    onClick={() => handleCancel(appointment._id)}
                                                    className="flex-1 px-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            
                                            {appointment.status === 'Completed' && (
                                                <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                                    View Summary
                                                </button>
                                            )}
                                            
                                            <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                                                <i className="ri-more-2-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentHistory;
