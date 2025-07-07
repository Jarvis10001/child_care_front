import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../../../config/environment'; // Assuming you have a config file for API base URL

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Fetch patients
    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${config.API_BASE_URL}/api/doctors/patients`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.data.success) {
                    setPatients(response.data.patients);
                }
            } catch (error) {
                console.error('Error fetching patients:', error);
                toast.error('Failed to load patients');
            } finally {
                setLoading(false);
            }
        };
        
        fetchPatients();
    }, [token]);
    
    // Format date of birth
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Calculate age from DOB
    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} years`;
    };
    
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">My Patients</h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Search patients..."
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50] text-sm"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <i className="ri-search-line"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Patients List */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading patients...</p>
                    </div>
                ) : patients.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                            <i className="ri-user-search-line text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No patients found</h3>
                        <p className="mt-1 text-gray-500">You don't have any patients yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Appointment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {patients.map((patient) => (
                                    <motion.tr 
                                        key={patient._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-[#4CAF50]/10 rounded-full flex items-center justify-center">
                                                    <i className="ri-user-line text-[#4CAF50]"></i>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {patient.firstName} {patient.lastName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {calculateAge(patient.dob)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {patient.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            Not available
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-[#4CAF50] hover:text-[#45a049] font-medium">
                                                View Details
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Patients;
