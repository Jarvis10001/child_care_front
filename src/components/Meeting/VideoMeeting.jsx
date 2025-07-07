import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../../config/environment'; // Assuming you have a config file for API base URL

const VideoMeeting = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [meetingInfo, setMeetingInfo] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [user, setUser] = useState(null);
    const [remainingTime, setRemainingTime] = useState('');
    
    useEffect(() => {
        // Get user data from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        
        fetchMeetingInfo();
        
        // Clean up function
        return () => {
            // Notify backend that we've left the meeting
            leaveMeeting();
        };
    }, [appointmentId]);

    // Calculate and update remaining time
    useEffect(() => {
        if (!appointment) return;
        
        const timer = setInterval(() => {
            const now = new Date();
            const endTime = getAppointmentEndTime();
            
            if (endTime <= now) {
                clearInterval(timer);
                setRemainingTime('Meeting ended');
                toast.error('Meeting time has ended');
                setTimeout(() => {
                    navigate('/dashboard/consultations/history');
                }, 5000);
            } else {
                const diff = Math.floor((endTime - now) / 1000);
                const mins = Math.floor(diff / 60);
                const secs = diff % 60;
                setRemainingTime(`${mins}:${secs < 10 ? '0' + secs : secs}`);
            }
        }, 1000);
        
        return () => clearInterval(timer);
    }, [appointment]);
    
    const getAppointmentEndTime = () => {
        if (!appointment) return new Date();
        
        const [hours, minutes] = appointment.timeSlot.end.split(':').map(Number);
        const endTime = new Date(appointment.date);
        endTime.setHours(hours, minutes, 0, 0);
        return endTime;
    };
    
    const fetchMeetingInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // First check if meeting is active
            const activeResponse = await axios.get(
                `${config.API_BASE_URL}/api/meetings/${appointmentId}/check`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            if (!activeResponse.data.success || !activeResponse.data.canJoin) {
                setError('This meeting is not active or cannot be joined at this time');
                setLoading(false);
                return;
            }
            
            // Get meeting details
            let meetingResponse;
            
            if (activeResponse.data.hasLink) {
                meetingResponse = await axios.get(
                    `http://localhost:2006/api/meetings/${appointmentId}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
            } else {
                // Generate meeting link
                meetingResponse = await axios.post(
                    `http://localhost:2006/api/meetings/${appointmentId}/generate`,
                    {},
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
            }
            
            if (meetingResponse.data.success) {
                setMeetingInfo(meetingResponse.data.meetingInfo);
                setAppointment(meetingResponse.data.appointmentInfo);
                
                // Join the meeting
                await joinMeeting(meetingResponse.data.meetingInfo);
            } else {
                setError('Failed to retrieve meeting information');
            }
        } catch (error) {
            console.error('Error fetching meeting info:', error);
            setError(error.response?.data?.message || 'An error occurred loading the meeting');
        } finally {
            setLoading(false);
        }
    };
    
    const joinMeeting = async (meetingInfo) => {
        try {
            // Mark the meeting as joined in the backend
            await axios.post(
                `http://localhost:2006/api/meetings/${appointmentId}/join`, 
                {},
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            
            // Redirect to Google Meet automatically
            if (meetingInfo?.link) {
                window.location.href = meetingInfo.link;
            } else {
                setError('No meeting link available');
            }
        } catch (error) {
            console.error('Error joining meeting:', error);
            setError('Failed to join the meeting');
        }
    };
    
    const leaveMeeting = async () => {
        try {
            await axios.post(
                `http://localhost:2006/api/meetings/${appointmentId}/leave`,
                {},
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
        } catch (error) {
            console.error('Error leaving meeting:', error);
        }
    };
    
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4CAF50]"></div>
                <p className="mt-4 text-lg text-gray-600">Setting up your meeting...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-red-100 text-red-600 p-6 rounded-lg max-w-md text-center">
                    <i className="ri-error-warning-line text-4xl mb-4"></i>
                    <p className="text-lg font-medium mb-4">{error}</p>
                    <p className="text-sm text-gray-600 mb-6">
                        The meeting might not be available yet or has already ended.
                        You can only join meetings on the scheduled appointment day.
                    </p>
                    <button 
                        onClick={() => navigate('/dashboard/consultations/history')}
                        className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
                    >
                        Go to Appointments
                    </button>
                </div>
            </div>
        );
    }
    
    // This should never show up as we redirect to Google Meet
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg max-w-md text-center shadow-lg">
                <i className="ri-video-chat-line text-4xl text-[#4CAF50] mb-4"></i>
                <h1 className="text-2xl font-bold mb-4">Redirecting to Google Meet...</h1>
                <p className="text-gray-600 mb-6">
                    You will be redirected to Google Meet for your appointment with{' '}
                    {user?.role === 'doctor' ? appointment?.patient?.firstName : `Dr. ${appointment?.doctor?.name?.firstName}`}.
                </p>
                <p className="text-gray-600 mb-6">
                    If you're not redirected automatically, click the button below.
                </p>
                
                <button 
                    className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
                    onClick={() => window.location.href = meetingInfo?.link}
                >
                    Join Google Meet
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                    Meeting ID: {meetingInfo?.meetingId}
                </p>
            </div>
        </div>
    );
};

export default VideoMeeting;
