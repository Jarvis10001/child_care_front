import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../../../config/environment'; // Assuming you have a config file for API base URL

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);
    const [patient, setPatient] = useState(null);
    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [notes, setNotes] = useState('');
    const [canJoinMeeting, setCanJoinMeeting] = useState(false);
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            setLoading(true);
            try {
                // Check if this is an appointment ID
                const appointmentResponse = await axios.get(
                    `${config.API_BASE_URL}/api/doctors/appointments/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (appointmentResponse.data.success) {
                    setAppointment(appointmentResponse.data.appointment);
                    
                    // Also fetch patient details
                    const patientResponse = await axios.get(
                        `${config.API_BASE_URL}/api/doctors/patients/${appointmentResponse.data.appointment.patient._id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    
                    if (patientResponse.data.success) {
                        setPatient(patientResponse.data.patient);
                        
                        // Fetch patient appointment history
                        const historyResponse = await axios.get(
                            `${config.API_BASE_URL}/api/doctors/patients/${patientResponse.data.patient._id}/history`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        
                        if (historyResponse.data.success) {
                            setAppointmentHistory(historyResponse.data.appointments);
                        }
                    }
                    
                    // Check if the meeting can be joined
                    if (appointmentResponse.data.appointment.status === 'Confirmed') {
                        const meetingStatusResponse = await axios.get(
                            `${config.API_BASE_URL}/api/meetings/${id}/check`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        
                        if (meetingStatusResponse.data.success) {
                            setCanJoinMeeting(meetingStatusResponse.data.canJoin);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching details:', error);
                toast.error('Could not load appointment or patient details');
                navigate('/doctor/appointments');
            } finally {
                setLoading(false);
            }
        };
        
        fetchAppointmentDetails();
    }, [id, token, navigate]);
    
    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Add consultation notes
    const handleAddNotes = async () => {
        if (!notes.trim()) {
            toast.error('Please enter notes first');
            return;
        }
        
        try {
            const response = await axios.post(
                `${config.API_BASE_URL}/api/doctors/consultations/${appointment._id}/notes`,
                { notes },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                toast.success('Notes added successfully');
                setNotes('');
                
                // Update appointment with the new notes
                setAppointment(prev => ({
                    ...prev,
                    notes: response.data.appointment.notes
                }));
            }
        } catch (error) {
            console.error('Error adding notes:', error);
            toast.error('Failed to add notes');
        }
    };
    
    // Join meeting
    const joinMeeting = async () => {
        try {
            toast.loading('Preparing meeting...', { id: 'meeting-loading' });
            
            // Check if meeting is active
            const status = await axios.get(
                `${config.API_BASE_URL}/api/meetings/${id}/check`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (!status.data.success || !status.data.canJoin) {
                toast.error('This meeting is not available at this time', { id: 'meeting-loading' });
                return;
            }
            
            let meetingUrl;
            
            if (status.data.hasLink) {
                // Get existing link
                const meetingResponse = await axios.get(
                    `${config.API_BASE_URL}/api/meetings/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (meetingResponse.data.success) {
                    meetingUrl = meetingResponse.data.meetingInfo.link;
                }
            } else {
                // Generate new link
                const response = await axios.post(
                    `${config.API_BASE_URL}/api/meetings/${id}/generate`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.data.success) {
                    meetingUrl = response.data.meetingInfo.link;
                }
            }
            
            if (meetingUrl) {
                // Notify that we're joining
                await axios.post(
                    `${config.API_BASE_URL}/api/meetings/${id}/join`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                toast.success('Opening Google Meet', { id: 'meeting-loading' });
                window.open(meetingUrl, '_blank');
            } else {
                toast.error('Failed to get meeting link', { id: 'meeting-loading' });
            }
        } catch (error) {
            console.error('Error joining meeting:', error);
            toast.error('Failed to join meeting', { id: 'meeting-loading' });
        }
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
            </div>
        );
    }
    
    if (!appointment || !patient) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Details not found</h2>
                <button 
                    onClick={() => navigate('/doctor/appointments')}
                    className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg"
                >
                    Back to Appointments
                </button>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded-xl p-6 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{patient.firstName} {patient.lastName}</h1>
                    <p className="text-gray-500">{appointment.type} • {formatDate(appointment.appointmentDate)}</p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                    <button 
                        onClick={() => navigate('/doctor/appointments')}
                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                    >
                        Back
                    </button>
                    {appointment.status === 'Confirmed' && canJoinMeeting && (
                        <button 
                            onClick={joinMeeting}
                            className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049]"
                        >
                            <i className="ri-video-chat-line mr-1"></i> Join Meeting
                        </button>
                    )}
                </div>
            </div>
            
            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Patient info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Patient card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{patient.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date of Birth</p>
                                <p className="font-medium">{patient.dob ? formatDate(patient.dob) : 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Appointment History */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Appointment History</h2>
                        <div className="space-y-3">
                            {appointmentHistory.length > 0 ? (
                                appointmentHistory.map(apt => (
                                    <div 
                                        key={apt._id} 
                                        className={`p-3 rounded-lg ${apt._id === appointment._id ? 'bg-[#4CAF50]/10 border-l-4 border-[#4CAF50]' : 'bg-gray-50'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{apt.type}</p>
                                                <p className="text-sm text-gray-500">{formatDate(apt.appointmentDate)}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                apt.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                                                apt.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                apt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No previous appointments</p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Right column - Appointment details and notes */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Appointment details */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium">{formatDate(appointment.appointmentDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-medium">{appointment.timeSlot.start} - {appointment.timeSlot.end}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Mode</p>
                                <p className="font-medium">{appointment.mode}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    appointment.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                                    appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                    appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {appointment.status}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">Reason for appointment</p>
                            <p className="font-medium">{appointment.notes || 'No reason specified'}</p>
                        </div>
                    </div>
                    
                    {/* Consultation Notes */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Consultation Notes</h2>
                        {appointment.notes ? (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="whitespace-pre-line">{appointment.notes}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500 mb-4">No consultation notes added yet.</p>
                        )}
                        
                        <div className="mt-6">
                            <h3 className="font-medium mb-2">Add/Update Notes</h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#4CAF50]"
                                rows={5}
                                placeholder="Enter consultation notes here..."
                            ></textarea>
                            <div className="mt-3 flex justify-end">
                                <button 
                                    onClick={handleAddNotes}
                                    className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] disabled:opacity-50"
                                    disabled={!notes.trim()}
                                >
                                    Save Notes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;
