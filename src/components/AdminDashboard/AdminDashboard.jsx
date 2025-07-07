import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '../Dashboard/context/SidebarContext';
import AdminSidebar from './components/AdminSidebar';
import TopNav from '../Dashboard/components/navigation/TopNav';
import { useSidebar } from '../Dashboard/context/SidebarContext';

import AdminHome from './pages/AdminHome';
import DoctorManagement from './pages/DoctorManagement';
import UserManagement from './pages/UserManagement';
import AppointmentManagement from './pages/AppointmentManagement';

const MainContent = () => {
    const { isOpen } = useSidebar();
    
    return (
        <div className={`min-h-screen bg-bg-gray transition-all duration-300 ease-in-out
            ${isOpen ? 'md:ml-64' : 'md:ml-0'}
            ${isOpen ? 'md:w-[calc(100%-256px)]' : 'md:w-full'}`}>
            <TopNav userType="admin" />
            <div className="p-6">
                <Routes>
                    {/* Main routes */}
                    <Route path="/" element={<AdminHome />} />
                    
                    {/* Doctor Management routes */}
                    <Route path="/doctors/*" element={<DoctorManagement />} />
                    
                    {/* User Management routes */}
                    <Route path="/users/*" element={<UserManagement />} />
                    
                    {/* Appointment Management routes */}
                    <Route path="/appointments/*" element={<AppointmentManagement />} />
                    
                    {/* Other admin routes can be added here */}
                    <Route path="/settings" element={<div>Settings Page</div>} />
                    <Route path="/reports" element={<div>Reports Page</div>} />
                    <Route path="/support" element={<div>Support Page</div>} />
                    
                    {/* Redirect any unmatched routes to the admin home */}
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-bg-gray">
                <AdminSidebar />
                <MainContent />
            </div>
        </SidebarProvider>
    );
};

export default AdminDashboard;
