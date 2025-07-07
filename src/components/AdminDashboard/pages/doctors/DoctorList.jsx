import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../../../services/axiosConfig';

const DoctorList = ({ onAddClick }) => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [confirmText, setConfirmText] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/doctors');
            if (response.data.success) {
                setDoctors(response.data.data || []);
            } else {
                setError('Failed to fetch doctors');
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setError('An error occurred while fetching doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleEditDoctor = (doctorId) => {
        navigate(`/admin/doctors/edit/${doctorId}`);
    };

    const handleDeleteClick = (doctor) => {
        setSelectedDoctor(doctor);
        setShowDeleteModal(true);
        setConfirmText('');
    };

    const confirmDelete = async () => {
        if (confirmText !== 'DELETE') return;

        try {
            setLoading(true);
            const response = await api.delete(`/doctors/${selectedDoctor._id}`);
            if (response.data.success) {
                setDoctors(doctors.filter(doc => doc._id !== selectedDoctor._id));
                setShowDeleteModal(false);
                setSelectedDoctor(null);
            }
        } catch (error) {
            console.error('Error deleting doctor:', error);
            setError('Failed to delete doctor');
        } finally {
            setLoading(false);
        }
    };

    // Filter and search functionality
    const filteredDoctors = doctors.filter(doctor => {
        const fullName = `${doctor.name?.firstName || ''} ${doctor.name?.lastName || ''}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
            (doctor.specialization || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doctor.contact?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
            
        if (filter === 'all') return matchesSearch;
        return matchesSearch && doctor.isActive === (filter === 'active');
    });

    // Use onAddClick for consistent navigation
    const handleAddDoctorClick = () => {
        if (onAddClick) {
            onAddClick();
        } else {
            navigate('/admin/doctors/add');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300"
        >
            {/* Header and Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-text-primary">All Doctors</h2>
                    <p className="text-sm text-text-secondary mt-1">Manage doctors and their information</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 w-full md:w-64 transition-all duration-300"
                        />
                        <i className="ri-search-line absolute left-3 top-3 text-neutral-400"></i>
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239e9e9e%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_1rem] bg-[length:20px_20px] pr-10"
                    >
                        <option value="all">All Doctors</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button
                        onClick={handleAddDoctorClick}
                        className="px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors flex items-center gap-2"
                    >
                        <i className="ri-user-add-line"></i>
                        Add Doctor
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-error/10 border-l-4 border-error text-error rounded-md"
                >
                    <div className="flex items-center">
                        <i className="ri-error-warning-line mr-2 text-lg"></i>
                        <span>{error}</span>
                    </div>
                </motion.div>
            )}

            {loading && doctors.length === 0 ? (
                <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-neutral-200">
                    {filteredDoctors.length === 0 ? (
                        <div className="text-center py-16 px-6 bg-bg-light">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                                <i className="ri-search-line text-2xl text-neutral-500"></i>
                            </div>
                            <h3 className="text-xl font-medium text-text-primary mb-2">No doctors found</h3>
                            <p className="text-text-secondary mb-6 max-w-md mx-auto">Try adjusting your search or filter criteria, or add a new doctor to get started</p>
                            <button 
                                onClick={() => navigate('/admin/doctors/add')}
                                className="px-5 py-2.5 bg-primary-500 text-text-light rounded-xl hover:bg-primary-600 transition-all duration-300 shadow-button hover:shadow-button-hover flex items-center gap-2 mx-auto"
                            >
                                <i className="ri-user-add-line"></i>
                                Add New Doctor
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-bg-light">
                                    <tr>
                                        {['Doctor', 'Specialization', 'Experience', 'Contact', 'Status', 'Actions'].map((header, i) => (
                                            <th key={i} className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {filteredDoctors.map((doctor, idx) => (
                                        <motion.tr 
                                            key={doctor._id || idx} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-bg-light transition-colors duration-300"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary-100 flex items-center justify-center">
                                                        <span className="text-primary-700 font-medium">
                                                            {doctor.name?.firstName?.[0] || '?'}
                                                            {doctor.name?.lastName?.[0] || ''}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-text-primary">
                                                            {doctor.name?.firstName} {doctor.name?.lastName}
                                                        </div>
                                                        <div className="text-xs text-text-secondary">
                                                            {doctor.licenseNumber}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1.5 inline-flex text-xs font-semibold rounded-full bg-primary-50 text-primary-700 border border-primary-100">
                                                    {doctor.specialization}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-text-primary font-medium">{doctor.experience} years</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-text-primary">{doctor.contact?.email}</div>
                                                <div className="text-xs text-text-secondary">{doctor.contact?.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    doctor.isActive 
                                                        ? 'bg-success/10 text-success border border-success/20' 
                                                        : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                                                }`}>
                                                    {doctor.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditDoctor(doctor._id)}
                                                        className="px-2.5 py-1.5 text-xs rounded-lg text-primary-700 hover:bg-primary-50 transition-colors duration-200 flex items-center gap-1"
                                                    >
                                                        <i className="ri-edit-line"></i> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(doctor)}
                                                        className="px-2.5 py-1.5 text-xs rounded-lg text-error hover:bg-error/10 transition-colors duration-200 flex items-center gap-1"
                                                    >
                                                        <i className="ri-delete-bin-line"></i> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal - Enhanced design */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                                <i className="ri-delete-bin-line text-xl text-error"></i>
                            </div>
                            <h3 className="text-xl font-bold text-text-primary">Delete Doctor</h3>
                        </div>
                        
                        <p className="text-text-secondary mb-6">
                            Are you sure you want to delete <span className="font-medium text-text-primary">{selectedDoctor?.name?.firstName} {selectedDoctor?.name?.lastName}</span>?<br/>
                            <span className="text-sm">This action cannot be undone.</span>
                        </p>
                        
                        <div className="mb-6">
                            <label className="block text-sm text-text-secondary mb-2 font-medium">
                                Type "DELETE" to confirm:
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-error focus:ring-2 focus:ring-error/20"
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-text-primary transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={confirmText !== 'DELETE'}
                                className={`px-4 py-2.5 rounded-xl text-white transition-colors duration-300 ${
                                    confirmText === 'DELETE' 
                                        ? 'bg-error hover:bg-error/90'
                                        : 'bg-error/40 cursor-not-allowed'
                                }`}
                            >
                                Delete Doctor
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default DoctorList;
