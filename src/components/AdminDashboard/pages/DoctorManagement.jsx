import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import api from '../../../services/axiosConfig';
import AddDoctorForm from './doctors/AddDoctorForm';
import DoctorList from './doctors/DoctorList';

const DoctorManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(() => {
        // Determine the active tab based on the current route
        if (location.pathname.includes('/add')) return 'add';
        return 'list';
    });

    useEffect(() => {
        // Update active tab when location changes
        if (location.pathname.includes('/add')) {
            setActiveTab('add');
        } else if (location.pathname.includes('/edit')) {
            // Keep current tab when editing
        } else {
            setActiveTab('list');
        }
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'list') {
            navigate('/admin/doctors');
        } else if (tab === 'add') {
            navigate('/admin/doctors/add');
        }
    };

    // Handler for the Add Doctor button in the header
    const handleAddDoctorClick = () => {
        setActiveTab('add');
        navigate('/admin/doctors/add');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-text-primary">Doctor Management</h2>
                
                <div className="flex items-center gap-3">
                    {/* Tab navigation */}
                    <div className="flex gap-3 p-1 bg-neutral-50 rounded-xl border border-neutral-100">
                        <button
                            onClick={() => handleTabChange('list')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                activeTab === 'list' 
                                    ? 'bg-primary-500 text-white shadow-button' 
                                    : 'text-text-secondary hover:bg-neutral-100'
                            }`}
                        >
                            <i className="ri-list-check mr-1"></i>
                            All Doctors
                        </button>
                        <button
                            onClick={() => handleTabChange('add')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                activeTab === 'add' 
                                    ? 'bg-primary-500 text-white shadow-button' 
                                    : 'text-text-secondary hover:bg-neutral-100'
                            }`}
                        >
                            <i className="ri-user-add-line mr-1"></i>
                            Add Doctor
                        </button>
                    </div>

                    {/* Quick add button that always shows (next to tabs) */}
                    <button
                        onClick={handleAddDoctorClick}
                        className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors duration-300 flex items-center gap-2 shadow-button hover:shadow-button-hover"
                    >
                        <i className="ri-add-line"></i>
                        New Doctor
                    </button>
                </div>
            </div>

            <Routes>
                {/* Show doctor list as default on the main route */}
                <Route path="/" element={<DoctorList onAddClick={handleAddDoctorClick} />} />
                
                {/* Explicitly show doctor list on '/list' */}
                <Route path="/list" element={<DoctorList onAddClick={handleAddDoctorClick} />} />
                
                {/* Add and edit doctor routes */}
                <Route path="/add" element={<AddDoctorForm />} />
                <Route path="/edit/:id" element={
                    <div>
                        <div className="mb-4 flex items-center">
                            <button 
                                onClick={() => navigate('/admin/doctors')}
                                className="flex items-center text-text-secondary hover:text-primary-500 transition-colors"
                            >
                                <i className="ri-arrow-left-line mr-1"></i>
                                Back to Doctor List
                            </button>
                        </div>
                        <AddDoctorForm isEditing={true} />
                    </div>
                } />
                
                {/* Redirect any unmatched routes to the main doctor list */}
                <Route path="*" element={<Navigate to="/admin/doctors" replace />} />
            </Routes>
        </div>
    );
};

export default DoctorManagement;
