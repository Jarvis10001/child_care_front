import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import config from '../../../config/environment';

function Appointment() {
    const [selectedService, setSelectedService] = useState('initial');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [reason, setReason] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [useCustomTime, setUseCustomTime] = useState(false);
    const [customTime, setCustomTime] = useState({
        start: '',
        end: ''
    });

    const services = [
        { id: 'initial', name: 'Initial Assessment', duration: '45 Minutes', icon: 'ri-stethoscope-line' },
        { id: 'followup', name: 'Follow-up Session', duration: '30 Minutes', icon: 'ri-heart-pulse-line' },
        { id: 'therapy', name: 'Therapy Session', duration: '60 Minutes', icon: 'ri-mental-health-line' }
    ];

    // Map service IDs to appointment types
    const serviceTypeMap = {
        'initial': 'Initial Consultation',
        'followup': 'Follow Up',
        'therapy': 'Therapy Session'
    };

    // Load available doctors when component mounts
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(
                    `${config.API_BASE_URL}/api/appointments/doctors`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                
                if (response.data.success) {
                    setDoctors(response.data.doctors);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

    // Load patient's appointment history
    useEffect(() => {
        const fetchAppointmentHistory = async () => {
            setLoadingHistory(true);
            try {
                const response = await axios.get(
                    `${config.API_BASE_URL}/api/appointments/patient`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                
                if (response.data.success) {
                    setAppointmentHistory(response.data.appointments);
                }
            } catch (error) {
                console.error('Error fetching appointment history:', error);
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchAppointmentHistory();
    }, []);

    const handleCustomTimeChange = (e) => {
        const { name, value } = e.target;
        setCustomTime(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedDoctor) {
            toast.error('Please select a doctor');
            return;
        }
        
        if (!selectedDate) {
            toast.error('Please select a date');
            return;
        }
        
        if (!selectedTime && !useCustomTime) {
            toast.error('Please select a time');
            return;
        }

        if (useCustomTime && (!customTime.start || !customTime.end || customTime.start >= customTime.end)) {
            toast.error('Please select a valid custom time');
            return;
        }

        setLoading(true);

        try {
            console.log('=== PATIENT APPOINTMENT SUBMISSION ===');
            console.log('Selected doctor:', selectedDoctor);
            console.log('Selected date:', selectedDate);
            console.log('Reason/notes:', reason);

            // Prepare appointment data
            const appointmentData = {
                doctorId: selectedDoctor,
                appointmentDate: selectedDate,
                timeSlot: useCustomTime ? customTime : {
                    start: selectedTime,
                    end: calculateEndTime(selectedTime, selectedService)
                },
                type: serviceTypeMap[selectedService] || 'Initial Consultation',
                mode: 'Video Call',
                notes: reason // Send as notes field
            };
            
            console.log('Appointment data being sent:', appointmentData);
            
            // Submit appointment request
            const response = await axios.post(
                `${config.API_BASE_URL}/api/appointments/request`,
                appointmentData,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            
            console.log('Response received:', response.data);
            
            if (response.data.success) {
                toast.success('Appointment requested successfully');
                
                // Reset form
                setSelectedService('initial');
                setSelectedDoctor(null);
                setSelectedDate('');
                setSelectedTime('');
                setReason('');
                setUseCustomTime(false);
                setCustomTime({ start: '', end: '' });
                
                // Refresh appointment history
                const historyResponse = await axios.get(
                    `${config.API_BASE_URL}/api/appointments/patient`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                
                if (historyResponse.data.success) {
                    setAppointmentHistory(historyResponse.data.appointments);
                }
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to schedule appointment');
        } finally {
            setLoading(false);
        }
    };

    // Calculate end time based on service duration
    const calculateEndTime = (startTime, serviceId) => {
        const hours = parseInt(startTime.split(':')[0]);
        let minutes = parseInt(startTime.split(':')[1]);
        
        // Determine duration based on service
        const durationMap = {
            'initial': 45,
            'followup': 30,
            'therapy': 60
        };
        
        const duration = durationMap[serviceId] || 30;
        
        // Calculate end time
        minutes += duration;
        const newHours = hours + Math.floor(minutes / 60);
        const newMinutes = minutes % 60;
        
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    };

    // Format appointment date for display
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

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-[#333333] mb-2">Book an Appointment</h1>
                    <p className="text-[#6C757D]">Schedule a consultation with our healthcare professionals</p>
                </div>

                <div className="space-y-8">
                    <form onSubmit={handleSubmit}>
                        {/* Service Selection */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#4CAF50]/20 transition-all duration-300 mb-6">
                            <h2 className="text-xl font-semibold text-[#333333] mb-4">Select a service</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {services.map((service) => (
                                    <div className="relative" key={service.id}>
                                        <input 
                                            className="peer hidden" 
                                            id={service.id} 
                                            type="radio" 
                                            name="service"
                                            checked={selectedService === service.id}
                                            onChange={() => setSelectedService(service.id)}
                                        />
                                        <label 
                                            className="flex flex-col rounded-xl p-4 cursor-pointer border border-gray-100
                                                hover:border-[#4CAF50]/20 transition-all duration-300
                                                peer-checked:border-[#4CAF50] peer-checked:bg-[#4CAF50]/5" 
                                            htmlFor={service.id}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <i className={`${service.icon} text-2xl text-[#4CAF50]`}></i>
                                                <span className="h-4 w-4 rounded-full border-2 border-gray-300 
                                                    peer-checked:border-[#4CAF50] peer-checked:bg-[#4CAF50]"></span>
                                            </div>
                                            <span className="font-medium text-[#333333]">{service.name}</span>
                                            <span className="text-xs text-[#6C757D] mt-1">{service.duration}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Doctor Selection */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#4CAF50]/20 transition-all duration-300 mb-6">
                            <h2 className="text-xl font-semibold text-[#333333] mb-4">Select a doctor</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {doctors.map((doctor) => (
                                    <div className="relative" key={doctor._id}>
                                        <input 
                                            className="peer hidden" 
                                            id={`doctor-${doctor._id}`} 
                                            type="radio" 
                                            name="doctor"
                                            checked={selectedDoctor === doctor._id}
                                            onChange={() => setSelectedDoctor(doctor._id)}
                                        />
                                        <label 
                                            className="flex items-start p-4 cursor-pointer border border-gray-100 rounded-xl
                                                hover:border-[#4CAF50]/20 transition-all duration-300
                                                peer-checked:border-[#4CAF50] peer-checked:bg-[#4CAF50]/5" 
                                            htmlFor={`doctor-${doctor._id}`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-[#4CAF50]/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                <i className="ri-user-3-line text-xl text-[#4CAF50]"></i>
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#333333]">
                                                    Dr. {doctor.name.firstName} {doctor.name.lastName}
                                                </p>
                                                <p className="text-sm text-[#6C757D]">{doctor.specialization}</p>
                                                <p className="text-xs text-[#6C757D] mt-1">{doctor.experience} years experience</p>
                                            </div>
                                            <div className="ml-auto">
                                                <span className="h-4 w-4 rounded-full border-2 border-gray-300 
                                                    peer-checked:border-[#4CAF50] peer-checked:bg-[#4CAF50]"></span>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#4CAF50]/20 transition-all duration-300 mb-6">
                            <h2 className="text-xl font-semibold text-[#333333] mb-4">Select a date</h2>
                            <div className="relative w-64">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <i className="ri-calendar-line text-[#4CAF50]"></i>
                                </div>
                                <input 
                                    type="date" 
                                    className="block w-full rounded-xl border border-gray-200 bg-transparent p-2.5 pl-10 
                                        text-[#333333] outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20
                                        transition-all duration-300"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        {/* Time Selection */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#4CAF50]/20 transition-all duration-300 mb-6">
                            <h2 className="text-xl font-semibold text-[#333333] mb-4">Select a time</h2>
                            <div className="flex items-center mb-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={useCustomTime}
                                        onChange={() => {
                                            setUseCustomTime(!useCustomTime);
                                            if (!useCustomTime) {
                                                setSelectedTime(null);
                                            }
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4CAF50] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                        Use custom time
                                    </span>
                                </label>
                            </div>

                            {useCustomTime ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            name="start"
                                            value={customTime.start}
                                            onChange={handleCustomTimeChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4CAF50]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <input
                                            type="time"
                                            name="end"
                                            value={customTime.end}
                                            onChange={handleCustomTimeChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4CAF50]"
                                            required
                                        />
                                    </div>
                                    {customTime.start && customTime.end && customTime.start >= customTime.end && (
                                        <div className="col-span-2">
                                            <p className="text-red-500 text-sm">End time must be after start time</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(time => (
                                        <button 
                                            type="button"
                                            key={time}
                                            className={`rounded-xl px-4 py-3 font-medium border
                                                ${selectedTime === time 
                                                    ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-[#4CAF50]' 
                                                    : 'border-gray-200 text-[#333333] hover:border-[#4CAF50] hover:bg-[#4CAF50]/5 hover:text-[#4CAF50]'
                                                }
                                                active:scale-95 transition-all duration-300`}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Reason for Visit */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#4CAF50]/20 transition-all duration-300 mb-8">
                            <h2 className="text-xl font-semibold text-[#333333] mb-4">Reason for visit</h2>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-transparent p-2.5 
                                    text-[#333333] outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20
                                    transition-all duration-300"
                                rows="3"
                                placeholder="Briefly describe the reason for your appointment..."
                            ></textarea>
                        </div>

                        {/* Book Button */}
                        <div className="flex justify-end">
                            <button 
                                type="submit"
                                className={`rounded-xl bg-[#4CAF50] px-8 py-3 text-lg font-semibold text-white
                                    hover:bg-[#45a049] focus:ring-4 focus:ring-[#4CAF50]/20
                                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                                disabled={loading || (!selectedTime && !useCustomTime) || (useCustomTime && (!customTime.start || !customTime.end || customTime.start >= customTime.end))}
                            >
                                {loading ? 'Booking...' : 'Book Appointment'}
                            </button>
                        </div>
                    </form>
                    
                    {/* Appointment History */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mt-12">
                        <h2 className="text-xl font-semibold text-[#333333] mb-4">My Appointments</h2>
                        {loadingHistory ? (
                            <p className="text-center py-4 text-[#6C757D]">Loading appointment history...</p>
                        ) : appointmentHistory.length === 0 ? (
                            <p className="text-center py-4 text-[#6C757D]">No appointment history found</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {appointmentHistory.map((appointment) => (
                                            <tr key={appointment._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    Dr. {appointment.doctor.name.firstName} {appointment.doctor.name.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(appointment.appointmentDate)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {appointment.timeSlot.start} - {appointment.timeSlot.end}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {appointment.type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Appointment;