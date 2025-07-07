import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/axiosConfig'; // Make sure this path is correct

const QuestionNavigator = ({ childDOB }) => {
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const navigate = useNavigate();

  const calculateAvailableQuestions = () => {
    const today = new Date();
    const dob = new Date(childDOB);
    const monthsDiff = (today.getFullYear() - dob.getFullYear()) * 12 + 
                      (today.getMonth() - dob.getMonth());
    
    // Each question is for a 3-month period
    const availableQuestionsCount = Math.floor(monthsDiff / 3) + 1;
    return Array.from({ length: availableQuestionsCount }, (_, i) => ({
      id: i + 1,
      ageRange: `${i * 3}-${(i + 1) * 3} Months`,
      isCompleted: false // Default value, will be updated from API
    }));
  };

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        // First calculate available assessments based on age
        const available = calculateAvailableQuestions();
        
        // Then get completed assessments from API
        const response = await api.get('/assessments/history');
        if (response.data.success) {
          const completedData = response.data.assessments;
          setCompletedAssessments(completedData);
          
          // Mark completed assessments and add risk data
          const updatedQuestions = available.map(q => {
            const completed = completedData.find(a => a.assessmentNumber === q.id);
            if (completed) {
              return {
                ...q,
                isCompleted: true,
                assessmentId: completed._id,
                riskLevel: completed.riskAssessment?.riskLevel || 'none',
                isAtRisk: completed.riskAssessment?.isAtRisk || false
              };
            }
            return q;
          });
          
          setAvailableQuestions(updatedQuestions);
        }
      } catch (error) {
        console.error('Error loading assessments:', error);
        // Fallback to basic calculation if API fails
        setAvailableQuestions(calculateAvailableQuestions());
      }
    };

    if (childDOB) {
      loadAssessments();
    }
  }, [childDOB]);

  const getRiskBadge = (riskLevel) => {
    if (!riskLevel || riskLevel === 'none') return null;
    
    const riskColors = {
      low: 'bg-yellow-100 text-yellow-800',
      moderate: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${riskColors[riskLevel]}`}>
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
      </span>
    );
  };

  const handleAssessmentClick = (assessment) => {
    if (assessment.isCompleted) {
      // Navigate to assessment results page
      navigate(`/assessment-results/${assessment.assessmentId}`);
    } else {
      // Navigate to assessment questions
      navigate(`/questions/q${assessment.id}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-[#333333] mb-6">Available Assessments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {availableQuestions.map((assessment) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => handleAssessmentClick(assessment)}
                className={`
                  w-full p-6 rounded-2xl text-left
                  transition-all duration-300
                  ${assessment.isCompleted 
                    ? assessment.isAtRisk 
                      ? 'bg-rose-50 border-rose-200' 
                      : 'bg-[#4CAF50]/10 border-[#4CAF50]' 
                    : 'bg-white hover:shadow-xl hover:border-[#4CAF50]/20'
                  }
                  border shadow-lg
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#333333] mb-2">
                      {assessment.isCompleted && '✓ '}Assessment {assessment.id}
                    </h3>
                    <p className="text-[#6C757D]">{assessment.ageRange}</p>
                    {assessment.isCompleted && assessment.isAtRisk && (
                      <div className="mt-2">
                        {getRiskBadge(assessment.riskLevel)}
                      </div>
                    )}
                  </div>
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${assessment.isCompleted 
                      ? assessment.isAtRisk
                        ? 'bg-rose-500 text-white'
                        : 'bg-[#4CAF50] text-white' 
                      : 'bg-[#4CAF50]/10 text-[#4CAF50]'
                    }
                  `}>
                    {assessment.isCompleted ? (
                      assessment.isAtRisk ? <i className="ri-alert-line" /> : <i className="ri-check-line" />
                    ) : (
                      <i className="ri-arrow-right-line" />
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {availableQuestions.length === 0 && (
        <div className="text-center py-12 text-[#6C757D]">
          <p className="text-lg">No assessments are available yet.</p>
          <p className="text-sm mt-2">The first assessment will be available at 3 months.</p>
        </div>
      )}
    </div>
  );
};

export default QuestionNavigator;
