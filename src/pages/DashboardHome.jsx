import React, { useState, useEffect } from 'react';
import QuestionNavigator from '../components/QuestionNavigator';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosConfig';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [childStats, setChildStats] = useState(null);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateAge = (dob) => {
    try {
      if (!dob) return 0;
      
      // Parse and validate date
      const birthDate = new Date(dob);
      if (isNaN(birthDate.getTime())) {
        console.error('Invalid date format:', dob);
        return 0;
      }

      const today = new Date();
      const yearDiff = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      let ageInMonths = (yearDiff * 12) + monthDiff;
      if (today.getDate() < birthDate.getDate()) {
        ageInMonths--;
      }

      return Math.max(0, ageInMonths);
    } catch (error) {
      console.error('Error calculating age:', error);
      return 0;
    }
  };

  const getAssessmentDetails = (ageInMonths, completedCount) => {
    const latestPossibleAssessment = Math.ceil(ageInMonths / 3);
    
    // If completed all possible assessments for current age
    if (completedCount >= latestPossibleAssessment) {
      const nextAssessmentDue = latestPossibleAssessment + 1;
      const nextDueDate = nextAssessmentDue * 3;
      
      return {
        number: nextAssessmentDue,
        period: `${(nextAssessmentDue - 1) * 3}-${nextAssessmentDue * 3} months`,
        route: `/questions/q${nextAssessmentDue}`,
        isOverdue: false,
        allCompleted: ageInMonths < nextDueDate,
        nextDueDate
      };
    }

    // Return next incomplete assessment
    const currentAssessmentNumber = completedCount + 1;
    return {
      number: currentAssessmentNumber,
      period: `${(currentAssessmentNumber - 1) * 3}-${currentAssessmentNumber * 3} months`,
      route: `/questions/q${currentAssessmentNumber}`,
      isOverdue: ageInMonths > currentAssessmentNumber * 3,
      allCompleted: false,
      nextDueDate: currentAssessmentNumber * 3
    };
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        
        // Get user data from local storage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!storedUser || !token) {
          navigate('/login');
          return;
        }
        
        const user = JSON.parse(storedUser);
        
        // Format DOB properly
        if (user.dob) {
          try {
            user.dob = new Date(user.dob).toISOString();
          } catch (e) {
            console.error('Error formatting DOB:', e);
          }
        } else {
          console.warn('No DOB found in user data');
        }
        
        setUserData(user);
        
        // Get completed assessment count - use local data if API fails
        try {
          const assessmentResponse = await api.get('/assessments/completed-count');
          if (assessmentResponse.data.success) {
            setCompletedCount(assessmentResponse.data.completedAssessments);
          }
        } catch (error) {
          console.warn('Using local user data for completed assessments');
          // Fallback to user data stored locally
          setCompletedCount(user.completedAssessments || 0);
        }
        
        // Calculate current assessment details using local data
        const childAge = calculateAge(user.dob);
        const assessmentDetails = getAssessmentDetails(
          childAge,
          user.completedAssessments || 0
        );
        setCurrentAssessment(assessmentDetails);
        
      } catch (error) {
        console.error('Dashboard loading error:', error);
        setError('Failed to load dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#4CAF50] text-white rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  // No user data
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <p className="text-[#6C757D] mb-4">User data not available</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-[#4CAF50] text-white rounded-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-[#333333] mb-2">Child's Age</h3>
          <p className="text-3xl font-bold text-[#4CAF50]">
            {calculateAge(userData?.dob)} months
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-[#333333] mb-2">Completed Assessments</h3>
          <p className="text-3xl font-bold text-[#4CAF50]">
            {completedCount}/19
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-[#333333] mb-2">Next Assessment</h3>
          <p className="text-lg text-[#6C757D]">
            {currentAssessment?.allCompleted 
              ? `Next assessment available at ${currentAssessment.nextDueDate} months`
              : `Due at ${currentAssessment?.nextDueDate} months`
            }
          </p>
        </motion.div>
      </div>

      {/* Assessment Alert */}
      {currentAssessment && !currentAssessment.allCompleted && (
        <motion.div
          key={currentAssessment.number}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`border-l-4 p-4 rounded-r-xl shadow-lg ${
            currentAssessment.isOverdue 
              ? 'bg-red-50 border-red-400' 
              : 'bg-amber-50 border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <i className={`text-2xl ${
                  currentAssessment.isOverdue 
                    ? 'ri-error-warning-line text-red-400' 
                    : 'ri-notification-3-line text-amber-400'
                }`} />
              </div>
              <div>
                <h3 className={`text-lg font-medium ${
                  currentAssessment.isOverdue ? 'text-red-800' : 'text-amber-800'
                }`}>
                  {currentAssessment.isOverdue ? 'Overdue Assessment' : 'Assessment Due'}
                </h3>
                <p className={currentAssessment.isOverdue ? 'text-red-700' : 'text-amber-700'}>
                  {currentAssessment.isOverdue 
                    ? `Assessment ${currentAssessment.number} (${currentAssessment.period}) is overdue` 
                    : `Complete Assessment ${currentAssessment.number} for ${currentAssessment.period}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(currentAssessment.route)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 
                        flex items-center space-x-2 ${
                          currentAssessment.isOverdue
                            ? 'bg-red-100 hover:bg-red-200 text-red-800'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                        }`}
            >
              <span>Start Assessment {currentAssessment.number}</span>
              <i className="ri-arrow-right-line" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Question Navigator */}
      <QuestionNavigator childDOB={userData.dob} completedAssessments={completedCount} />
    </div>
  );
};

export default DashboardHome;
