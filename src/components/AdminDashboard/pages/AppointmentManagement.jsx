import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../services/axiosConfig';

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#333333]">Appointment Management</h2>
                <div className="flex gap-4">
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50]"
                    >
                        <option value="all">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="px-4 py-2 bg-[#4CAF50] text-white rounded-xl hover:bg-[#45a049] transition-colors duration-300">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: "Today's Appointments", count: 12, color: 'blue' },
                    { title: 'Completed', count: 45, color: 'green' },
                    { title: 'Cancelled', count: 8, color: 'red' },
                    { title: 'Revenue', count: '₹24,500', color: 'yellow' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-md"
                    >
                        <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                        <p className="text-2xl font-bold text-[#333333] mt-2">{stat.count}</p>
                    </motion.div>
                ))}
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Patient', 'Doctor', 'Date & Time', 'Type', 'Status', 'Actions'].map((header, i) => (
                                    <th key={i} className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8">Loading...</td>
                                </tr>
                            ) : (
                                // Mock data - replace with actual appointment data
                                [1,2,3,4,5].map(i => (
                                    <motion.tr 
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 transition-colors duration-300"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[#4CAF50]/10 flex items-center justify-center">
                                                    <span className="text-[#4CAF50]">JD</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">John Doe</p>
                                                    <p className="text-sm text-gray-500">ID: #12345</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">Dr. Smith</p>
                                            <p className="text-sm text-gray-500">Speech Therapy</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-800">Mar 15, 2024</p>
                                            <p className="text-sm text-gray-500">10:00 AM</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-800">Initial Consultation</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-sm bg-[#4CAF50]/10 text-[#4CAF50]">
                                                Scheduled
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <i className="ri-eye-line text-blue-500"></i>
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <i className="ri-edit-line text-[#4CAF50]"></i>
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <i className="ri-delete-bin-line text-red-500"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AppointmentManagement;
