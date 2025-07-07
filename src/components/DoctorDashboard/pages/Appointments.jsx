import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../../../config/environment';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestsLoading, setRequestsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('today');
    const [declineReason, setDeclineReason] = useState('');
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [activeAppointments, setActiveAppointments] = useState({});
    const [filterDate, setFilterDate] = useState('');
    const [generatingLink, setGeneratingLink] = useState({});
    const [meetingLinks, setMeetingLinks] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Determine which tab is active based on route
    useEffect(() => {
        if (location.pathname.includes('/today')) {
            setActiveTab('today');
        } else if (location.pathname.includes('/upcoming')) {
            setActiveTab('upcoming');
        } else if (location.pathname.includes('/history')) {
            setActiveTab('past');
        } else if (location.pathname === '/doctor/appointments') {
            setActiveTab('requests');
            fetchPendingRequests();
        }
    }, [location.pathname]);

    // Fetch pending appointment requests
    useEffect(() => {
        if (activeTab === 'requests') {
            fetchPendingRequests();
        }
    }, [activeTab]);

    // Fetch appointments based on active tab
    useEffect(() => {
        if (activeTab !== 'requests') {
            fetchAppointments();
        }
    }, [activeTab, filterDate]);

    const fetchPendingRequests = async () => {
        setRequestsLoading(true);
        try {
            console.log('=== FETCHING PENDING REQUESTS ===');
            console.log('Using token:', token ? 'Token exists' : 'No token');
            
            const response = await axios.get(
                `${config.API_BASE_URL}/api/appointments/doctor/pending`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Raw response:', response.data);

            if (response.data.success) {
                const appointments = response.data.appointments;
                console.log('Number of appointments:', appointments.length);
                
                // Debug each appointment
                appointments.forEach((apt, index) => {
                    console.log(`Appointment ${index + 1}:`, {
                        id: apt._id,
                        patient: apt.patient,
                        patientName: apt.patient ? `${apt.patient.firstName || 'No first'} ${apt.patient.lastName || 'No last'}` : 'No patient object',
                        hasPatientData: !!apt.patient,
                        patientType: typeof apt.patient
                    });
                });
                
                setPendingRequests(appointments);
            } else {
                console.error('Server returned success: false');
            }
        } catch (error) {
            console.error('Error fetching pending requests:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Failed to load pending requests');
        } finally {
            setRequestsLoading(false);
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            let endpoint;
            switch (activeTab) {
                case 'today':
                    endpoint = `${config.API_BASE_URL}/api/doctors/appointments/today`;
                    break;
                case 'upcoming':
                    endpoint = `${config.API_BASE_URL}/api/doctors/appointments/upcoming`;
                    break;
                case 'past':
                    endpoint = `${config.API_BASE_URL}/api/doctors/appointments/history`;
                    break;
                default:
                    endpoint = `${config.API_BASE_URL}/api/doctors/appointments`;
            }

            // Add date filter if selected
            if (filterDate && (activeTab === 'upcoming' || activeTab === 'past')) {
                endpoint += `?date=${filterDate}`;
            }

            console.log('Fetching appointments from endpoint:', endpoint); // Debug log

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const appts = response.data.appointments;
                console.log('Received appointments:', appts); // Debug log

                // Validate received data
                const validatedAppointments = appts.map(appointment => {
                    if (!appointment.patient || typeof appointment.patient !== 'object') {
                        console.warn('Invalid patient data found:', appointment);
                        // Create a placeholder patient object
                        appointment.patient = {
                            firstName: 'Unknown',
                            lastName: '',
                            _id: 'missing'
                        };
                    }
                    return appointment;
                });

                setAppointments(validatedAppointments);

                // Check which appointments are active for today's appointments
                if (activeTab === 'today') {
                    for (const appt of validatedAppointments) {
                        checkAppointmentActive(appt._id);
                    }
                }
            }
        } catch (error) {
            console.error(`Error fetching ${activeTab} appointments:`, error);
            toast.error(`Failed to load ${activeTab} appointments`);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (appointmentId) => {
        try {
            const response = await axios.put(
                `${config.API_BASE_URL}/api/appointments/accept/${appointmentId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Appointment request accepted');
                // Update the requests list
                fetchPendingRequests();
            }
        } catch (error) {
            console.error('Error accepting appointment:', error);
            toast.error('Failed to accept appointment request');
        }
    };

    const openDeclineModal = (appointmentId) => {
        setSelectedRequestId(appointmentId);
        setShowDeclineModal(true);
    };

    const handleDeclineRequest = async () => {
        try {
            const response = await axios.put(
                `${config.API_BASE_URL}/api/appointments/decline/${selectedRequestId}`,
                { reason: declineReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Appointment request declined');
                // Close modal and reset
                setShowDeclineModal(false);
                setDeclineReason('');
                setSelectedRequestId(null);
                // Update the requests list
                fetchPendingRequests();
            }
        } catch (error) {
            console.error('Error declining appointment:', error);
            toast.error('Failed to decline appointment request');
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

    // Enhanced Google Meet link generation
    const generateGoogleMeetLink = async (appointmentId) => {
        setGeneratingLink(prev => ({ ...prev, [appointmentId]: true }));

        try {
            toast.loading('Creating real Google Meet room...', { id: 'generate-meet' });

            // First check OAuth status
            try {
                const statusResponse = await axios.get(
                    `${config.API_BASE_URL}/api/meetings/oauth-status`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                
                // If not authorized, get auth URL
                if (!statusResponse.data.isAuthorized || statusResponse.data.isExpired) {
                    const authResponse = await axios.get(
                        `${config.API_BASE_URL}/api/meetings/google/auth`,
                        { 
                            headers: { 'Authorization': `Bearer ${token}` },
                            params: { appointmentId }
                        }
                    );
                    
                    if (authResponse.data.success) {
                        sessionStorage.setItem('pendingMeetingGeneration', appointmentId);
                        window.location.href = authResponse.data.authUrl;
                        return;
                    }
                }
            } catch (statusError) {
                console.error('Error checking OAuth status:', statusError);
            }

            // Generate the meeting link
            const response = await axios.post(
                `${config.API_BASE_URL}/api/meetings/generate/${appointmentId}`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.success) {
                const meetingInfo = response.data.meetingInfo;

                // Update state with meeting info
                setMeetingLinks(prev => ({
                    ...prev,
                    [appointmentId]: meetingInfo
                }));

                toast.success(`Real Google Meet created! Meeting ID: ${meetingInfo.meetingId}`, { 
                    id: 'generate-meet',
                    duration: 5000
                });

                console.log('Real Google Meet created:', {
                    link: meetingInfo.link,
                    meetingId: meetingInfo.meetingId,
                    accessCode: meetingInfo.accessCode
                });

                // Refresh appointments to show updated status
                if (activeTab === 'requests') {
                    fetchPendingRequests();
                } else {
                    fetchAppointments();
                }
            }
        } catch (error) {
            console.error('Error generating Google Meet link:', error);
            
            if (error.response?.data?.requiresAuth) {
                try {
                    const authResponse = await axios.get(
                        `${config.API_BASE_URL}/api/meetings/google/auth`,
                        { 
                            headers: { 'Authorization': `Bearer ${token}` },
                            params: { appointmentId }
                        }
                    );
                    
                    if (authResponse.data.success) {
                        sessionStorage.setItem('pendingMeetingGeneration', appointmentId);
                        window.location.href = authResponse.data.authUrl;
                    }
                } catch (authError) {
                    console.error('Auth error:', authError);
                    toast.error('Failed to setup Google authorization');
                }
            } else {
                toast.error(error.response?.data?.message || 'Failed to create Google Meet', { id: 'generate-meet' });
            }
        } finally {
            setGeneratingLink(prev => ({ ...prev, [appointmentId]: false }));
        }
    };

    // Check if an appointment is active (can be joined) today
    const checkAppointmentActive = async (appointmentId) => {
        try {
            const response = await axios.get(
                `${config.API_BASE_URL}/api/meetings/check/${appointmentId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
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

    // Join meeting as doctor
    const joinMeetingAsDoctor = async (appointmentId) => {
        try {
            toast.loading('Joining meeting...', { id: 'join-meet' });

            // Get meeting details
            const response = await axios.get(
                `${config.API_BASE_URL}/api/meetings/${appointmentId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.success) {
                const meetingInfo = response.data.meetingInfo;

                // Update doctor's join status
                await axios.post(
                    `${config.API_BASE_URL}/api/meetings/join/${appointmentId}`,
                    { role: 'doctor' },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );

                toast.success('Opening Google Meet...', { id: 'join-meet' });
                window.open(meetingInfo.link, '_blank');
            }
        } catch (error) {
            console.error('Error joining meeting:', error);
            toast.error('Failed to join meeting', { id: 'join-meet' });
        }
    };

    // Copy meeting link to clipboard
    const copyMeetingLink = async (appointmentId) => {
        try {
            let meetingInfo = meetingLinks[appointmentId];
            
            // If not in local state, fetch from server
            if (!meetingInfo) {
                const response = await axios.get(
                    `${config.API_BASE_URL}/api/meetings/${appointmentId}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                
                if (response.data.success) {
                    meetingInfo = response.data.meetingInfo;
                }
            }
            
            if (meetingInfo?.link) {
                const meetingDetails = `
Meeting Link: ${meetingInfo.link}
Meeting ID: ${meetingInfo.meetingId || 'N/A'}
Access Code: ${meetingInfo.accessCode || 'N/A'}
Instructions: Click the link to join the video consultation.
                `.trim();
                
                await navigator.clipboard.writeText(meetingDetails);
                toast.success('Meeting details copied to clipboard');
            } else {
                toast.error('No meeting link available');
            }
        } catch (error) {
            console.error('Error copying meeting details:', error);
            toast.error('Failed to copy meeting details');
        }
    };

    const renderAppointmentActions = (appointment) => {
        const appointmentStatus = activeAppointments[appointment._id];
        const hasGeneratedLink = meetingLinks[appointment._id] || appointment.meeting?.isGenerated;

        return (
            <div className="flex space-x-2">
                {appointment.status === 'Confirmed' && (
                    <>
                        {!hasGeneratedLink ? (
                            <button
                                onClick={() => generateGoogleMeetLink(appointment._id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
                                disabled={generatingLink[appointment._id]}
                            >
                                {generatingLink[appointment._id] ? (
                                    <i className="ri-loader-4-line animate-spin"></i>
                                ) : (
                                    <i className="ri-video-add-line"></i>
                                )}
                                Generate Meet Link
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => joinMeetingAsDoctor(appointment._id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <i className="ri-video-chat-line"></i>
                                    Join Meeting
                                </button>

                                <button
                                    onClick={() => copyMeetingLink(appointment._id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    title="Copy meeting link"
                                >
                                    <i className="ri-file-copy-line"></i>
                                </button>
                            </>
                        )}
                    </>
                )}

                <button
                    onClick={() => navigate(`/doctor/appointments/${appointment._id}`)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Details
                </button>
            </div>
        );
    };

    const renderAppointmentsList = () => {
        if (loading) {
            return (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
                </div>
            );
        }

        if (appointments.length === 0) {
            return (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4CAF50]/10 mb-4">
                        <i className="ri-calendar-line text-[#4CAF50] text-3xl"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-[#333333] mb-2">No appointments found</h2>
                    <p className="text-[#6C757D] mb-6">
                        You don't have any {activeTab === 'today' ? 'appointments scheduled for today' :
                            activeTab === 'upcoming' ? 'upcoming appointments' : 'past appointments'}
                    </p>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Patient</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date & Time</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {appointments.map((appointment, index) => (
                                <motion.tr
                                    key={appointment._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors duration-300"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                                                <i className="ri-user-line text-[#4CAF50]"></i>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {appointment.patient && typeof appointment.patient === 'object' ?
                                                        `${appointment.patient.firstName || 'Unknown'} ${appointment.patient.lastName || ''}` :
                                                        'Patient data unavailable'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    ID: #{appointment.patient?._id ?
                                                        appointment.patient._id.substring(0, 6) :
                                                        'Unknown'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                                        {formatDate(appointment.appointmentDate)}<br />
                                        <span className="text-sm text-gray-500">
                                            {appointment.timeSlot?.start || '--'} - {appointment.timeSlot?.end || '--'}
                                            {appointment.timeSlot?.isCustom && " (Custom)"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                                        {appointment.type || 'N/A'}
                                        <br />
                                        <span className="text-sm text-gray-500">
                                            {appointment.mode || 'Not specified'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {renderAppointmentActions(appointment)}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderPendingRequests = () => {
        if (requestsLoading) {
            return (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
                </div>
            );
        }

        if (pendingRequests.length === 0) {
            return (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4CAF50]/10 mb-4">
                        <i className="ri-calendar-check-line text-[#4CAF50] text-3xl"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-[#333333] mb-2">No pending requests</h2>
                    <p className="text-[#6C757D] mb-4">You don't have any appointment requests pending approval</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {pendingRequests.map((request, index) => {
                    console.log(`Rendering request ${index + 1}:`, {
                        id: request._id,
                        patient: request.patient,
                        hasPatient: !!request.patient
                    });

                    return (
                        <motion.div
                            key={request._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-400"
                        >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        {request.patient ? 
                                            `${request.patient.firstName || 'No First Name'} ${request.patient.lastName || ''}`.trim() || 'Unnamed Patient' :
                                            'No Patient Data Available'
                                        }
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Email: {request.patient?.email || 'Not provided'}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Patient ID: {request.patient?._id || 'Not available'}
                                    </p>
                                    <p className="text-gray-500 mt-2">
                                        {formatDate(request.appointmentDate)} • {request.timeSlot?.start || '--'} - {request.timeSlot?.end || '--'}
                                        {request.timeSlot?.isCustom && " (Custom time)"}
                                    </p>
                                    <div className="mt-3">
                                        <span className="font-medium text-gray-700">Type:</span> 
                                        <span className="ml-2 text-gray-600">{request.type || 'Not specified'}</span>
                                    </div>
                                    <div className="mt-1">
                                        <span className="font-medium text-gray-700">Mode:</span> 
                                        <span className="ml-2 text-gray-600">{request.mode || 'Not specified'}</span>
                                    </div>
                                    {request.notes && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-700">Notes:</span>
                                            <p className="text-gray-600 mt-1">{request.notes}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex space-x-3 mt-4 md:mt-0">
                                    <button
                                        onClick={() => handleAcceptRequest(request._id)}
                                        className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => openDeclineModal(request._id)}
                                        className="px-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    // Update appointment status - improved error handling
    const updateAppointmentStatus = async (appointmentId, status) => {
        try {
            console.log(`Updating appointment ${appointmentId} status to ${status}`);
            
            const response = await axios.put(
                `${config.API_BASE_URL}/api/appointments/${appointmentId}`,
                { status },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.success) {
                console.log('Appointment status updated successfully');
                // Optionally refresh appointments list
                // fetchAppointments();
            }
        } catch (error) {
            console.error('Error updating appointment status:', error);
            if (error.response?.data?.message) {
                console.error('Server error message:', error.response.data.message);
            }
        }
    };

    // Check auth callback on component mount - Enhanced with loop prevention
    useEffect(() => {
        // Check if returning from Google auth
        const urlParams = new URLSearchParams(window.location.search);
        const authSuccess = urlParams.get('auth');
        const authError = urlParams.get('error');
        const pendingAppointmentId = sessionStorage.getItem('pendingMeetingGeneration');
        const authStartTime = sessionStorage.getItem('authStartTime');

        // Prevent auth loops by checking if we just started auth recently
        const isRecentAuth = authStartTime && (Date.now() - parseInt(authStartTime)) < 60000; // 1 minute

        if (authSuccess === 'success') {
            toast.success('Google Calendar authorized successfully!');

            if (pendingAppointmentId && !isRecentAuth) {
                // Add longer delay to ensure tokens are properly saved
                setTimeout(() => {
                    generateGoogleMeetLink(pendingAppointmentId);
                    sessionStorage.removeItem('pendingMeetingGeneration');
                    sessionStorage.removeItem('authStartTime');
                }, 3000); // Increased delay to 3 seconds
            } else if (isRecentAuth) {
                console.log('Skipping meeting generation due to recent auth');
                sessionStorage.removeItem('pendingMeetingGeneration');
                sessionStorage.removeItem('authStartTime');
            }

            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        } else if (authError) {
            console.error('Auth error:', authError);
            let errorMessage = 'Google authorization failed. Please try again.';
            
            switch(authError) {
                case 'auth_failed':
                    errorMessage = 'Google authorization failed. Please try again.';
                    break;
                case 'token_exchange_failed':
                    errorMessage = 'Failed to exchange authorization code. Please try again.';
                    break;
                case 'no_code':
                    errorMessage = 'No authorization code received from Google.';
                    break;
                default:
                    errorMessage = `Authorization error: ${authError}`;
            }
            
            toast.error(errorMessage);
            sessionStorage.removeItem('pendingMeetingGeneration');
            sessionStorage.removeItem('authStartTime');

            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
                    <p className="text-gray-500">Manage your upcoming and past appointments</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => navigate('/doctor/appointments')}
                        className={`${activeTab === 'requests'
                                ? 'border-[#4CAF50] text-[#4CAF50]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Pending Requests
                        {pendingRequests.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                                {pendingRequests.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => navigate('/doctor/appointments/today')}
                        className={`${activeTab === 'today'
                                ? 'border-[#4CAF50] text-[#4CAF50]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Today's Schedule
                    </button>
                    <button
                        onClick={() => navigate('/doctor/appointments/upcoming')}
                        className={`${activeTab === 'upcoming'
                                ? 'border-[#4CAF50] text-[#4CAF50]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => navigate('/doctor/appointments/history')}
                        className={`${activeTab === 'past'
                                ? 'border-[#4CAF50] text-[#4CAF50]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Past Appointments
                    </button>
                </nav>
            </div>

            {/* Filters for upcoming and past appointments */}
            {activeTab !== 'requests' && activeTab !== 'today' && (
                <div className="flex space-x-4">
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50]"
                    />
                    {filterDate && (
                        <button
                            onClick={() => setFilterDate('')}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'requests' ? renderPendingRequests() : renderAppointmentsList()}

            {/* Decline Reason Modal */}
            {showDeclineModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Decline Appointment Request</h3>
                        <p className="text-gray-600 mb-4">Please provide a reason for declining this appointment:</p>
                        <textarea
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50]"
                            rows="3"
                            placeholder="Enter reason (optional)"
                        ></textarea>
                        <div className="flex justify-end mt-4 space-x-3">
                            <button
                                onClick={() => setShowDeclineModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeclineRequest}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;
//                                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
//                             } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
//                     >
//                         Upcoming
//                     </button>
//                     <button
//                         onClick={() => navigate('/doctor/appointments/history')}
//                         className={`${activeTab === 'past'
//                                 ? 'border-[#4CAF50] text-[#4CAF50]'
//                                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
//                             } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
//                     >
//                         Past Appointments
//                     </button>
//                 </nav>
//             </div>

//             {/* Filters for upcoming and past appointments */}
//             {activeTab !== 'requests' && activeTab !== 'today' && (
//                 <div className="flex space-x-4">
//                     <input
//                         type="date"
//                         value={filterDate}
//                         onChange={(e) => setFilterDate(e.target.value)}
//                         className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50]"
//                     />
//                     {filterDate && (
//                         <button
//                             onClick={() => setFilterDate('')}
//                             className="px-4 py-2 text-gray-500 hover:text-gray-700"
//                         >
//                             Clear Filter
//                         </button>
//                     )}
//                 </div>
//             )}

//             {/* Content based on active tab */}
//             {activeTab === 'requests' ? renderPendingRequests() : renderAppointmentsList()}

//             {/* Decline Reason Modal */}
//             {showDeclineModal && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//                     <div className="bg-white rounded-xl p-6 w-full max-w-md">
//                         <h3 className="text-xl font-semibold mb-4">Decline Appointment Request</h3>
//                         <p className="text-gray-600 mb-4">Please provide a reason for declining this appointment:</p>
//                         <textarea
//                             value={declineReason}
//                             onChange={(e) => setDeclineReason(e.target.value)}
//                             className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50]"
//                             rows="3"
//                             placeholder="Enter reason (optional)"
//                         ></textarea>
//                         <div className="flex justify-end mt-4 space-x-3">
//                             <button
//                                 onClick={() => setShowDeclineModal(false)}
//                                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleDeclineRequest}
//                                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                             >
//                                 Decline
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Appointments;
    //         </div>
    //     );
    // };

    // Copy meeting link to clipboard
    const copyMeetingLink = async (appointmentId) => {
        try {
            let meetingInfo = meetingLinks[appointmentId];
            
            // If not in local state, fetch from server
            if (!meetingInfo) {
                const response = await axios.get(
                    `${config.API_BASE_URL}/api/meetings/${appointmentId}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                
                if (response.data.success) {
                    meetingInfo = response.data.meetingInfo;
                }
            }
            
            if (meetingInfo?.link) {
                const meetingDetails = `
Meeting Link: ${meetingInfo.link}
Meeting ID: ${meetingInfo.meetingId || 'N/A'}
Access Code: ${meetingInfo.accessCode || 'N/A'}
Instructions: Click the link to join the video consultation.
                `.trim();
                
                await navigator.clipboard.writeText(meetingDetails);
                toast.success('Meeting details copied to clipboard');
            } else {
                toast.error('No meeting link available');
            }
        } catch (error) {
            console.error('Error copying meeting details:', error);
            toast.error('Failed to copy meeting details');
        }
    // };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
                    <p className="text-gray-500">Manage your upcoming and past appointments</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => navigate('/doctor/appointments')}
                        className={`${activeTab === 'requests'
                                ? 'border-[#4CAF50] text-[#4CAF50]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Pending Requests
                        {pendingRequests.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                                {pendingRequests.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => navigate('/doctor/appointments/today')}
                        className={`${activeTab === 'today'
                                ? 'border-[#4CAF50] text-[#4CAF50]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Today's Schedule
                    </button>
                    <button
                        onClick={() => navigate('/doctor/appointments/upcoming')}
                        className={`${activeTab === 'upcoming'
                                ? 'border-[#4CAF50] text-[#4CAF50]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => navigate('/doctor/appointments/history')}
                        className={`${activeTab === 'past'
                                ? 'border-[#4CAF50] text-[#4CAF50]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Past Appointments
                    </button>
                </nav>
            </div>

            {/* Filters for upcoming and past appointments */}
            {activeTab !== 'requests' && activeTab !== 'today' && (
                <div className="flex space-x-4">
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50]"
                    />
                    {filterDate && (
                        <button
                            onClick={() => setFilterDate('')}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'requests' ? renderPendingRequests() : renderAppointmentsList()}

            {/* Decline Reason Modal */}
            {showDeclineModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Decline Appointment Request</h3>
                        <p className="text-gray-600 mb-4">Please provide a reason for declining this appointment:</p>
                        <textarea
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50]"
                            rows="3"
                            placeholder="Enter reason (optional)"
                        ></textarea>
                        <div className="flex justify-end mt-4 space-x-3">
                            <button
                                onClick={() => setShowDeclineModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeclineRequest}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// export default Appointments;
//     <div>



//         {/* Content based on active tab */}
//         {activeTab === 'requests' ? renderPendingRequests() : renderAppointmentsList()}

//         {/* Decline Reason Modal */}
//         {showDeclineModal && (
//             <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//                 <div className="bg-white rounded-xl p-6 w-full max-w-md">
//                     <h3 className="text-xl font-semibold mb-4">Decline Appointment Request</h3>
//                     <p className="text-gray-600 mb-4">Please provide a reason for declining this appointment:</p>
//                     <textarea
//                         value={declineReason}
//                         onChange={(e) => setDeclineReason(e.target.value)}
//                         className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50]"
//                         rows="3"
//                         placeholder="Enter reason (optional)"
//                     ></textarea>
//                     <div className="flex justify-end mt-4 space-x-3">
//                         <button
//                             onClick={() => setShowDeclineModal(false)}
//                             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleDeclineRequest}
//                             className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                         >
//                             Decline
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         )}
//     </div>

// };

// export default Appointments;
//     </div>

// };

// export default Appointments;
