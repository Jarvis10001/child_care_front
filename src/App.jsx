import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Scheduler from "./components/Scheduler/Scheduler";
// import Navbar from "./components/navbar/Navbar";
// import Form1 from "./components/regidtration form/Form1";
import Steps from "./components/Steps/Steps";
// import Slider from "./components/slider/Slider2";
import Slider2 from "./components/slider/Slider2";
// import AuroraBackground from "./components/aurora/Aurora";
// import GoogleCalendar from "./components/GoogleCalender/Googlecalender";
import Navbar2 from "./components/navbar/Navbar2";
// import FilterHospital from "./components/FilterHospital/FilterHospital";
// import Login from "./components/Login/Login";
// import Login2 from "./components/Login/Login2";
// import Questions from "./components/regidtration form/Questions";
import About2 from "./components/About_Us/about2";
// import About3 from "./components/About_Us/About3";
// import Dashboard from "./components/Dashboard/dashboard";
// import Settings from "./components/Dashboard/pages/Settings";
// import Section1 from "./components/Therapies/Section1";
// import Focus from "./components/Therapies/components/Focus";
// import Comdition from "./components/Therapies/components/Comdition";
// import Vaccination from "./components/Dashboard/pages/Vaccination";
// import WHOGuidelines from "./components/Dashboard/pages/WHOguidelines";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardLayout from './components/Dashboard/components/layout/DashboardLayout';
// import Q1 from "./components/Questions/Q1";
import DoctorDashboard from "./components/DoctorDashboard/DoctorDashboard";
// import Q2 from "./components/Questions/Q2";
import Login from "./components/Log In/LogIn";
import SignUp from "./components/Sign Up/SignUp";
// import Q3 from "./components/Questions/Q3";
// import Q4 from "./components/Questions/Q4";
// import Q5 from "./components/Questions/Q5";
// import Q6 from "./components/Questions/Q6";
// import Q7 from "./components/Questions/Q7";
// import Q8 from "./components/Questions/Q8";
// import Q9 from "./components/Questions/Q9";
// import Q10 from "./components/Questions/Q10";
// import Q11 from "./components/Questions/Q11";
// import Q12 from "./components/Questions/Q12";
// import Q13 from "./components/Questions/Q13";
// import Q14 from "./components/Questions/Q14";
// import Q15 from "./components/Questions/Q15";
// import Q16 from "./components/Questions/Q16";
// import Q17 from "./components/Questions/Q17";
// import Q18 from "./components/Questions/Q18";
// import Q19 from "./components/Questions/Q19";
import QuestionForm from './components/Questions/QuestionForm';
import ProductCards from "./components/Therapies/components/ProductCards";
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import { Toaster } from 'react-hot-toast';
import VideoMeeting from "./components/Meeting/VideoMeeting";
import AssessmentResult from './pages/AssessmentResult';
import FAQ from './components/FAQ/FAQ';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Team from './components/Team/Team';

// Move ProtectedRoute outside of App component and into its own component
const ProtectedRouteWrapper = ({ children, role }) => {
  return (
    <Routes>
      <Route
        path="*"
        element={<ProtectedRoute role={role}>{children}</ProtectedRoute>}
      />
    </Routes>
  );
};

const ProtectedRoute = ({ children, role }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role !== role) {
          navigate('/login');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccess();
  }, [navigate, role]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : null;
};

const App = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      {/* Add Toast notification container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            border: '1px solid #4CAF50',
            padding: '16px',
            color: '#333333',
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Navbar2 />
            <Slider2 />
            <About2 />
            <Steps />
            <Team /> {/* Add the Team component here */}
            {/* <FAQ /> */}
            <Contact />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/vac" element={<DoctorDashboard />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        
        {/* Doctor Dashboard Routes */}
        <Route
          path="/doctor/*"
          element={
            <ProtectedRouteWrapper role="doctor">
              <DoctorDashboard />
            </ProtectedRouteWrapper>
          }
        />
        
        {/* Admin Dashboard Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRouteWrapper role="admin">
              <AdminDashboard />
            </ProtectedRouteWrapper>
          }
        />
        
        {/* Question Routes - these should be inside dashboard */}
        <Route path="/questions/:questionNumber" element={<QuestionForm />} />

        {/* Video Meeting Route */}
        <Route path="/meeting/:appointmentId" element={<VideoMeeting />} />

        {/* Assessment Result Route */}
        <Route path="/assessment-results/:assessmentId" element={<AssessmentResult />} />

        {/* Add FAQ route */}
        <Route path="/faq" element={<FAQ />} />
      </Routes>
      {location.pathname === '/' && <Footer />}
    </div>
  );
};

export default App;
// export default App;
