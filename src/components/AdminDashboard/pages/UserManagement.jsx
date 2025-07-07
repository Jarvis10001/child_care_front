import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../services/axiosConfig';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#333333]">User Management</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CAF50]"
                    />
                    <button className="px-4 py-2 bg-[#4CAF50] text-white rounded-xl hover:bg-[#45a049] transition-colors duration-300">
                        Export Data
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {['User', 'Contact', 'Registration', 'Status', 'Actions'].map((header, i) => (
                                    <th key={i} className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8">Loading...</td>
                                </tr>
                            ) : (
                                // Mock data - replace with actual user data
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
                                                    <span className="text-[#4CAF50] font-medium">JD</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">John Doe</p>
                                                    <p className="text-sm text-gray-500">Parent</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-800">john@example.com</p>
                                            <p className="text-sm text-gray-500">+91 98765 43210</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-800">March 15, 2024</p>
                                            <p className="text-sm text-gray-500">via Email</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">
                                                Active
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

export default UserManagement;
