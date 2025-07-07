import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SidebarProvider } from '../Dashboard/context/SidebarContext';
import DoctorSidebar from './components/DoctorSidebar';
import DoctorTopNav from './components/DoctorTopNav';
import { useSidebar } from '../Dashboard/context/SidebarContext';

// Import pages
import DoctorHome from './pages/DoctorHome';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetails';
import Consultations from './pages/Consultations';
import DoctorProfile from './pages/DoctorProfile';
import DoctorSettings from './pages/DoctorSettings';

const MainContent = () => {
    const [doctorData, setDoctorData] = useState(null);
    const { isOpen } = useSidebar();
    const location = useLocation();
    
    useEffect(() => {
        // Get doctor data from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setDoctorData(userData);
                
                // Set document title with doctor name
                if (userData.firstName && userData.lastName) {
                    document.title = `Dr. ${userData.firstName} ${userData.lastName} - Dashboard`;
                }
                
                // Log doctor data for debugging
                console.log('Doctor data loaded in dashboard:', userData);
            } catch (e) {
                console.error('Error parsing user data', e);
            }
        }
    }, []);
    
    return (
        <div className={`min-h-screen bg-[#f6f8fc] transition-all duration-300 ease-in-out
            ${isOpen ? 'md:ml-64' : 'md:ml-0'}
            ${isOpen ? 'md:w-[calc(100%-256px)]' : 'md:w-full'}`}>
            <DoctorTopNav doctorData={doctorData} />
            <div className="p-6">
                <Routes>
                    {/* Dashboard Home */}
                    <Route path="/" element={<DoctorHome />} />
                    <Route path="/dashboard" element={<DoctorHome />} />
                    
                    {/* Appointments Routes */}
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/appointments/today" element={<Appointments />} />
                    <Route path="/appointments/upcoming" element={<Appointments />} />
                    <Route path="/appointments/history" element={<Appointments />} />
                    <Route path="/appointments/:id" element={<PatientDetails />} />
                    
                    {/* Patient Routes */}
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/patients/:id" element={<PatientDetails />} />
                    <Route path="/patients/records" element={<Patients />} />
                    <Route path="/patients/cases" element={<Patients />} />
                    <Route path="/patients/progress" element={<Patients />} />
                    
                    {/* Consultation Routes */}
                    <Route path="/consultations/*" element={<Consultations />} />
                    <Route path="/consultations/video" element={<Consultations />} />
                    <Route path="/consultations/prescriptions" element={<Consultations />} />
                    <Route path="/consultations/notes" element={<Consultations />} />
                    
                    {/* Profile & Settings */}
                    <Route path="/profile" element={<DoctorProfile />} />
                    <Route path="/settings" element={<DoctorSettings />} />
                    
                    {/* Redirect for any undefined routes */}
                    <Route path="*" element={<Navigate to="/doctor" replace />} />
                </Routes>
            </div>
        </div>
    );
};

const DoctorDashboard = () => {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-[#f6f8fc]">
                <DoctorSidebar />
                <MainContent />
            </div>
        </SidebarProvider>
    );
};

export default DoctorDashboard;
