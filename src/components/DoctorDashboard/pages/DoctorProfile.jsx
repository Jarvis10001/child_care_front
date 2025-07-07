import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DoctorProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Mock doctor data - replace with actual data fetching
    const [doctorData, setDoctorData] = useState({
        name: {
            firstName: 'Dr. John',
            lastName: 'Doe'
        },
        specialization: 'Pediatric Psychology',
        qualifications: [
            { degree: 'MD Psychology', institution: 'Medical University', year: 2015 },
            { degree: 'Child Development Specialist', institution: 'Child Care Institute', year: 2017 }
        ],
        experience: 8,
        licenseNumber: 'MED12345',
        contact: {
            email: 'dr.john@example.com',
            phone: '+91 98765 43210'
        },
        address: {
            street: '123 Medical Center',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
        },
        availability: {
            daysAvailable: ['Monday', 'Wednesday', 'Friday'],
            timeSlots: [
                { start: '09:00', end: '13:00' },
                { start: '16:00', end: '20:00' }
            ]
        }
    });

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-[#4CAF50] to-[#45a049]">
                    <div className="absolute -bottom-12 left-6">
                        <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                            <div className="w-full h-full rounded-xl bg-[#4CAF50]/10 flex items-center justify-center">
                                <span className="text-3xl font-bold text-[#4CAF50]">
                                    {doctorData.name.firstName[0]}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-16 pb-6 px-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-[#333333]">
                                {`${doctorData.name.firstName} ${doctorData.name.lastName}`}
                            </h1>
                            <p className="text-[#6C757D]">{doctorData.specialization}</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 text-[#4CAF50] bg-[#4CAF50]/10 rounded-xl hover:bg-[#4CAF50] hover:text-white transition-all duration-300"
                        >
                            <i className={`ri-${isEditing ? 'save' : 'edit'}-line mr-2`}></i>
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Navigation */}
            <div className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex space-x-4">
                    {['profile', 'schedule', 'patients', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 
                                ${activeTab === tab 
                                    ? 'bg-[#4CAF50] text-white' 
                                    : 'text-[#6C757D] hover:bg-[#4CAF50]/10'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md"
                >
                    <h2 className="text-xl font-semibold text-[#333333] mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-[#6C757D]">License Number</label>
                                <p className="font-medium text-[#333333]">{doctorData.licenseNumber}</p>
                            </div>
                            <div>
                                <label className="text-sm text-[#6C757D]">Email</label>
                                <p className="font-medium text-[#333333]">{doctorData.contact.email}</p>
                            </div>
                            <div>
                                <label className="text-sm text-[#6C757D]">Phone</label>
                                <p className="font-medium text-[#333333]">{doctorData.contact.phone}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-[#6C757D]">Experience</label>
                                <p className="font-medium text-[#333333]">{doctorData.experience} Years</p>
                            </div>
                            <div>
                                <label className="text-sm text-[#6C757D]">Address</label>
                                <p className="font-medium text-[#333333]">
                                    {`${doctorData.address.street}, ${doctorData.address.city}`}
                                </p>
                                <p className="text-sm text-[#6C757D]">
                                    {`${doctorData.address.state} - ${doctorData.address.pincode}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Availability */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-md"
                >
                    <h2 className="text-xl font-semibold text-[#333333] mb-6">Availability</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-[#6C757D]">Days Available</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {doctorData.availability.daysAvailable.map(day => (
                                    <span key={day} className="px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg text-sm">
                                        {day}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-[#6C757D]">Time Slots</label>
                            <div className="space-y-2 mt-2">
                                {doctorData.availability.timeSlots.map((slot, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-[#333333]">
                                        <i className="ri-time-line text-[#4CAF50]"></i>
                                        <span>{`${slot.start} - ${slot.end}`}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DoctorProfile;
