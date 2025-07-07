import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardHome from '../../pages/DashboardHome';
import Appointment from './pages/Appointment';
import AssessmentResult from '../../pages/AssessmentResult';

const DashboardLayout = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/assessment-results/:assessmentId" element={<AssessmentResult />} />
      </Routes>
    </div>
  );
};

export default DashboardLayout;