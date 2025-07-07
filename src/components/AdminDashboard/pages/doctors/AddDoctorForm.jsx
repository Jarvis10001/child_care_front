import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../../../services/axiosConfig';
import axios from 'axios'; // Add this import
import toast from 'react-hot-toast'; // Add toast for notifications

const specializations = [
    'Speech Therapy',
    'Occupational Therapy',
    'Clinical Psychology',
    'ABA Therapy',
    'Behavior Therapy',
    'Special Education',
    'Physical Therapy',
    'Early Intervention',
    'Pediatric Neurology',
    'Child Psychiatry'
];

const days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Chandigarh', 'Puducherry'
];

const AddDoctorForm = ({ isEditing = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [qualifications, setQualifications] = useState([
        { degree: '', institution: '', year: new Date().getFullYear() }
    ]);
    const [timeSlots, setTimeSlots] = useState([
        { start: '09:00', end: '17:00' }
    ]);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        specialization: '',
        experience: '',
        licenseNumber: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        daysAvailable: [],
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (isEditing && id) {
            fetchDoctorDetails();
        }
    }, [isEditing, id]);

    const fetchDoctorDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/doctors/${id}`);
            if (response.data.success) {
                const doctor = response.data.data;
                
                // Format data for form
                setFormData({
                    firstName: doctor.name?.firstName || '',
                    lastName: doctor.name?.lastName || '',
                    specialization: doctor.specialization || '',
                    experience: doctor.experience || '',
                    licenseNumber: doctor.licenseNumber || '',
                    email: doctor.contact?.email || '',
                    phone: doctor.contact?.phone || '',
                    street: doctor.address?.street || '',
                    city: doctor.address?.city || '',
                    state: doctor.address?.state || '',
                    pincode: doctor.address?.pincode || '',
                    country: doctor.address?.country || 'India',
                    daysAvailable: doctor.availability?.daysAvailable || [],
                    password: '',
                    confirmPassword: ''
                });
                
                // Set qualifications
                if (doctor.qualifications && doctor.qualifications.length > 0) {
                    setQualifications(doctor.qualifications);
                }
                
                // Set time slots
                if (doctor.availability && doctor.availability.timeSlots && doctor.availability.timeSlots.length > 0) {
                    setTimeSlots(doctor.availability.timeSlots);
                }
            } else {
                setError('Failed to load doctor details.');
            }
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            setError('Failed to load doctor details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDaysChange = (day) => {
        const updatedDays = [...formData.daysAvailable];
        if (updatedDays.includes(day)) {
            setFormData(prev => ({
                ...prev,
                daysAvailable: updatedDays.filter(d => d !== day)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                daysAvailable: [...updatedDays, day]
            }));
        }
    };

    const handleQualificationChange = (index, field, value) => {
        const updatedQualifications = [...qualifications];
        updatedQualifications[index][field] = value;
        setQualifications(updatedQualifications);
    };

    const addQualification = () => {
        setQualifications([...qualifications, { degree: '', institution: '', year: new Date().getFullYear() }]);
    };

    const removeQualification = (index) => {
        const updatedQualifications = [...qualifications];
        updatedQualifications.splice(index, 1);
        setQualifications(updatedQualifications);
    };

    const handleTimeSlotChange = (index, field, value) => {
        const updatedTimeSlots = [...timeSlots];
        updatedTimeSlots[index][field] = value;
        setTimeSlots(updatedTimeSlots);
    };

    const addTimeSlot = () => {
        setTimeSlots([...timeSlots, { start: '09:00', end: '17:00' }]);
    };

    const removeTimeSlot = (index) => {
        const updatedTimeSlots = [...timeSlots];
        updatedTimeSlots.splice(index, 1);
        setTimeSlots(updatedTimeSlots);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setSubmitting(true);

        // Basic form validations 
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            setSubmitting(false);
            return;
        }

        if (!formData.email) {
            setError("Email is required");
            setSubmitting(false);
            return;
        }

        if (!formData.firstName || !formData.lastName) {
            setError("First name and last name are required");
            setSubmitting(false);
            return;
        }

        try {
            // Format the data according to the backend API expectations
            const doctorData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                specialization: formData.specialization,
                experience: parseInt(formData.experience) || 0,
                licenseNumber: formData.licenseNumber,
                email: formData.email,
                phone: formData.phone,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: formData.country
                },
                availability: {
                    days: formData.daysAvailable,
                    slots: timeSlots
                },
                qualifications
            };

            // Only include password if it's provided (required for new doctors)
            if (formData.password) {
                doctorData.password = formData.password;
            }

            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                toast.error('Authentication required. Please login again.');
                navigate('/login');
                return;
            }

            // Log request before sending
            console.log('Sending doctor data:', doctorData);
            console.log('Using token:', token.substring(0, 20) + '...');
            
            let response;
            
            if (isEditing) {
                response = await api.put(`/doctors/admin/${id}`, doctorData);
            } else {
                // Use the api instance directly with proper error handling
                response = await api.post('/doctors/register', doctorData);
            }

            if (response.data.success) {
                setSuccess(true);
                toast.success(isEditing ? 'Doctor updated successfully' : 'Doctor added successfully');
                setTimeout(() => {
                    navigate('/admin/doctors');
                }, 1500);
            } else {
                setError(response.data.message || 'Operation failed. Please try again.');
            }
        } catch (error) {
            console.error('Error saving doctor:', error);
            
            // Handle specific error cases with more detail
            if (error.response?.data?.stack) {
                console.error('Server stack trace:', error.response.data.stack);
            }
            
            if (error.response?.status === 401) {
                setError('Authentication failed. Your session may have expired. Please log in again.');
                // Redirect to login after a short delay
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }, 2000);
            } else if (error.response?.status === 400 && error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.status === 403) {
                setError('You do not have permission to register doctors. Admin access required.');
            } else if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('An unexpected error occurred. Please check the console for details.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-primary-500"></div>
                    <p className="text-primary-500 font-medium">Loading doctor details...</p>
                </div>
            </div>
        );
    }

    const inputClassName = "w-full p-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white shadow-sm transition-all duration-300";
    const labelClassName = "block text-sm font-medium text-text-primary mb-1.5";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-card"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
                    <i className={`ri-${isEditing ? 'edit' : 'user-add'}-line text-2xl`}></i>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">
                        {isEditing ? 'Edit Doctor Profile' : 'Add New Doctor'}
                    </h2>
                    <p className="text-text-secondary">
                        {isEditing 
                            ? 'Update doctor information and credentials' 
                            : 'Enter doctor details to create a new account'
                        }
                    </p>
                </div>
            </div>

            {/* Status Messages */}
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-error/10 border-l-4 border-error text-error rounded-md flex items-center gap-3"
                >
                    <i className="ri-error-warning-line text-xl"></i>
                    <p>{error}</p>
                </motion.div>
            )}

            {success && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-success/10 border-l-4 border-success text-success rounded-md flex items-center gap-3"
                >
                    <i className="ri-checkbox-circle-line text-xl"></i>
                    <p>Doctor {isEditing ? 'updated' : 'added'} successfully! Redirecting...</p>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="border-b border-neutral-100 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 rounded-full bg-primary-500"></div>
                        <h3 className="text-lg font-semibold text-text-primary">Personal Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClassName}>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder="Enter last name"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div className="border-b border-neutral-100 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 rounded-full bg-primary-500"></div>
                        <h3 className="text-lg font-semibold text-text-primary">Professional Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className={labelClassName}>Specialization</label>
                            <select
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClassName}>Experience (Years)</label>
                            <input
                                type="number"
                                name="experience"
                                min="0"
                                value={formData.experience}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder="Years of experience"
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>License Number</label>
                            <input
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder="Medical license number"
                                required
                            />
                        </div>
                    </div>

                    {/* Qualifications */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-base font-medium text-text-primary">Qualifications</label>
                            <button
                                type="button"
                                onClick={addQualification}
                                className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1 px-3 py-1 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                                <i className="ri-add-line"></i> Add More
                            </button>
                        </div>
                        <div className="space-y-4">
                            {qualifications.map((qual, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-bg-light p-4 rounded-xl border border-neutral-100"
                                >
                                    <div>
                                        <label className="text-xs text-text-secondary mb-1 block">Degree/Certificate</label>
                                        <input
                                            type="text"
                                            placeholder="E.g., MBBS, MD"
                                            value={qual.degree}
                                            onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                                            className={inputClassName}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-secondary mb-1 block">Institution</label>
                                        <input
                                            type="text"
                                            placeholder="Institution name"
                                            value={qual.institution}
                                            onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                                            className={inputClassName}
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <label className="text-xs text-text-secondary mb-1 block">Year</label>
                                            <input
                                                type="number"
                                                placeholder="Year of completion"
                                                value={qual.year}
                                                min="1950"
                                                max={new Date().getFullYear()}
                                                onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                                                className={inputClassName}
                                            />
                                        </div>
                                        {qualifications.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQualification(index)}
                                                className="p-3 text-error bg-error/5 hover:bg-error/10 rounded-lg transition-colors"
                                                title="Remove qualification"
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="border-b border-neutral-100 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 rounded-full bg-primary-500"></div>
                        <h3 className="text-lg font-semibold text-text-primary">Contact Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClassName}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder="doctor@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder="+91 98765 43210"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="border-b border-neutral-100 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 rounded-full bg-primary-500"></div>
                        <h3 className="text-lg font-semibold text-text-primary">Address</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <label className={labelClassName}>Street Address</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder="Street address, building"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClassName}>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    placeholder="City"
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClassName}>State</label>
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    required
                                >
                                    <option value="">Select State</option>
                                    {indianStates.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClassName}>Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    pattern="[0-9]{6}"
                                    className={inputClassName}
                                    placeholder="6-digit pincode"
                                    required
                                />
                            </div>
                            <div>
                                <label className={labelClassName}>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={`${inputClassName} bg-neutral-50`}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Availability */}
                <div className="border-b border-neutral-100 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 rounded-full bg-primary-500"></div>
                        <h3 className="text-lg font-semibold text-text-primary">Availability</h3>
                    </div>
                    
                    {/* Days Available */}
                    <div className="mb-8">
                        <label className="text-base font-medium text-text-primary mb-4 block">Days Available</label>
                        <div className="flex flex-wrap gap-3">
                            {days.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDaysChange(day)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        formData.daysAvailable.includes(day)
                                            ? 'bg-primary-500 text-white shadow-button'
                                            : 'bg-neutral-100 text-text-primary hover:bg-neutral-200'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Time Slots */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-base font-medium text-text-primary">Time Slots</label>
                            <button
                                type="button"
                                onClick={addTimeSlot}
                                className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1 px-3 py-1 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                                <i className="ri-time-line"></i> Add Time Slot
                            </button>
                        </div>
                        <div className="space-y-4">
                            {timeSlots.map((slot, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-4 bg-bg-light p-4 rounded-xl border border-neutral-100"
                                >
                                    <div className="w-1/3">
                                        <label className="text-xs text-text-secondary mb-1 block">Start Time</label>
                                        <input
                                            type="time"
                                            value={slot.start}
                                            onChange={(e) => handleTimeSlotChange(index, 'start', e.target.value)}
                                            className={inputClassName}
                                            required
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="text-xs text-text-secondary mb-1 block">End Time</label>
                                        <input
                                            type="time"
                                            value={slot.end}
                                            onChange={(e) => handleTimeSlotChange(index, 'end', e.target.value)}
                                            className={inputClassName}
                                            required
                                        />
                                    </div>
                                    {timeSlots.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTimeSlot(index)}
                                            className="p-3 text-error bg-error/5 hover:bg-error/10 rounded-lg transition-colors"
                                            title="Remove time slot"
                                        >
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Login Credentials */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 rounded-full bg-primary-500"></div>
                        <h3 className="text-lg font-semibold text-text-primary">Login Credentials</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClassName}>Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    required={!isEditing}
                                    placeholder={isEditing ? "Leave blank to keep current password" : "Enter secure password"}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                    <i className="ri-lock-line"></i>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className={labelClassName}>Confirm Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    required={!isEditing}
                                    placeholder={isEditing ? "Leave blank to keep current password" : "Confirm password"}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                                    <i className="ri-check-line"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/doctors')}
                        className="px-6 py-3 text-text-primary border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`px-8 py-3 bg-primary-500 text-white rounded-xl font-medium transition-colors hover:bg-primary-600 
                        shadow-button hover:shadow-button-hover ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-r-2 border-white"></div>
                                <span>{isEditing ? 'Updating...' : 'Adding...'}</span>
                            </div>
                        ) : isEditing ? 'Update Doctor' : 'Add Doctor'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default AddDoctorForm;
