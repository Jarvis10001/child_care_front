import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import TopNav from '../navigation/TopNav';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';
import DashboardHome from '../../../../pages/DashboardHome';
import Settings from '../../pages/Settings';
import Appointment from '../../pages/Appointment';
import AppointmentHistory from '../../pages/AppointmentHistory';
import Vaccination from '../../pages/Vaccination';
import WHOGuidelines from '../../pages/WHOGuidelines';
import Form1 from '../../../regidtration form/Form1';
import Profile from '../../../Profile/Profile';
import QuestionForm from '../../../Questions/QuestionForm';
import OnlineTherapy from '../../pages/Therapy';
import Services from '../../pages/Services';
import Governments from '../../pages/GovernmentSchemes';
import SchoolEnrollment from '../../pages/SchoolEnrollment';
import Surgerya from '../../pages/SurgeryAssistance';
import config from '../../../../config/environment';



const MainContent = () => {
    const { isOpen } = useSidebar();
    const userData = JSON.parse(localStorage.getItem('user'));
    
    // Redirect to registration if not completed
    if (!userData?.hasCompletedRegistration && window.location.pathname !== '/dashboard/child/registration') {
        return <Navigate to="/dashboard/child/registration" />;
    }
    
    return (
        <div className={`min-h-screen bg-[#f6f8fc] transition-all duration-300 ease-in-out
            ${isOpen ? 'md:ml-64' : 'md:ml-0'}
            ${isOpen ? 'md:w-[calc(100%-256px)]' : 'md:w-full'}`}>
            <TopNav />
            <div className="p-4">
                <Routes>
                    {/* Dashboard Home */}
                    <Route path="/" element={<DashboardHome />} />
                    
                    {/* Profile */}
                    <Route path="/profile" element={<Profile />} />
                    
                    {/* Assessment Routes */}
                    <Route path="/questions/:questionNumber" element={<QuestionForm />} />
                    
                    {/* Appointment Routes */}
                    <Route path="/consultations/schedule" element={<Appointment />} />
                    <Route path="/consultations/history" element={<AppointmentHistory />} />
                    
                    {/* Other Dashboard Routes */}
                    <Route path="/settings/*" element={<Settings />} />
                    <Route path="/health/vaccinations" element={<Vaccination />} />
                    <Route path="/milestones/who-guidelines" element={<WHOGuidelines />} />
                    <Route path="/child/registration" element={<Form1 />} />
                    <Route path="/support/therapy/online" element={<OnlineTherapy />} />
                    <Route path="/support/disability" element={<Services />} />
                    <Route path="/support/government" element={<Governments />} />
                    <Route path="/support/school" element={<SchoolEnrollment />} />
                    <Route path="/support/surgery" element={<Surgerya />} />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<div>Page not found</div>} />
                </Routes>
            </div>
        </div>
    );
};

const DashboardLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Verify token on component mount
        const verifyToken = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/auth/verify`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Token verification failed');
                }
                
                // Token is valid, continue with the dashboard
                const data = await response.json();
                console.log('Token verified:', data);
            } catch (error) {
                console.error('Auth error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        };

        verifyToken();
    }, [navigate]);

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-gray-100">
                <Sidebar />
                <MainContent />
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
