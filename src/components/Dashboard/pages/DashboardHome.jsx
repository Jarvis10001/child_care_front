import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardHome = ({ userData }) => {
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.child?.dob) {
      const assessments = calculateAvailableQuestions(userData.child.dob);
      setAvailableQuestions(assessments);
    }
  }, [userData]);

  const calculateAvailableQuestions = (dob) => {
    const today = new Date();
    const childDob = new Date(dob);
    const monthsDiff = (today.getFullYear() - childDob.getFullYear()) * 12 + 
                      (today.getMonth() - childDob.getMonth());
    
    const availableQuestionsCount = Math.floor(monthsDiff / 3) + 1;
    return Array.from({ length: 19 }, (_, i) => ({
      id: i + 1,
      available: i < availableQuestionsCount,
      ageRange: `${i * 3}-${(i + 1) * 3} Months`,
      completed: false, // You can add completion status from userData if available
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#4CAF50]/5 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#333333] mb-4">
            Welcome back, {userData?.name || 'Parent'}!
          </h1>
          <p className="text-lg text-[#6C757D]">
            Track {userData?.child?.name || 'your child'}'s developmental milestones
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-[#333333] mb-2">Child's Age</h3>
            <p className="text-3xl font-bold text-[#4CAF50]">
              {userData?.child?.ageInMonths || '0'} months
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-[#333333] mb-2">Completed Assessments</h3>
            <p className="text-3xl font-bold text-[#4CAF50]">
              {availableQuestions.filter(q => q.completed).length}/{availableQuestions.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-[#333333] mb-2">Next Assessment</h3>
            <p className="text-[#6C757D]">
              {availableQuestions.find(q => !q.completed)?.ageRange || 'All completed!'}
            </p>
          </div>
        </div>

        {/* Assessments Grid */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-[#333333] mb-6">Development Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableQuestions.map(({ id, available, ageRange, completed }) => (
              <motion.div
                key={id}
                whileHover={available ? { scale: 1.02 } : {}}
                whileTap={available ? { scale: 0.98 } : {}}
                className={`relative ${!available && 'opacity-50'}`}
              >
                <button
                  onClick={() => available && navigate(`/questions/q${id}`)}
                  disabled={!available}
                  className={`
                    w-full p-6 rounded-2xl text-left
                    transition-all duration-300
                    ${available 
                      ? 'bg-white shadow-lg hover:shadow-xl hover:border-[#4CAF50]/20' 
                      : 'bg-gray-50 cursor-not-allowed'
                    }
                    ${completed ? 'border-[#4CAF50] border-2' : 'border border-gray-100'}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-[#333333] mb-2">
                        {completed ? '✓ ' : ''}Assessment {id}
                      </h3>
                      <p className="text-[#6C757D]">{ageRange}</p>
                    </div>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${completed
                        ? 'bg-[#4CAF50] text-white'
                        : available 
                          ? 'bg-[#4CAF50]/10 text-[#4CAF50]' 
                          : 'bg-gray-100 text-gray-400'
                      }
                    `}>
                      {completed ? (
                        <i className="ri-check-line" />
                      ) : available ? (
                        <i className="ri-arrow-right-line" />
                      ) : (
                        <i className="ri-lock-line" />
                      )}
                    </div>
                  </div>
                  
                  {!available && (
                    <p className="mt-4 text-sm text-[#6C757D]">
                      Available when your child reaches {ageRange}
                    </p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
