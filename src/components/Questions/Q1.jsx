import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { submitAssessment, checkAssessmentStatus } from '../../services/assessmentService';

const Q1 = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    grossMotor1: '',
    grossMotor2: '',
    fineMotor: '',
    language1: '',
    language2: '',
    cognitive: '',
    socialEmotional: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkAssessmentStatus(1);
        if (status.completed) {
          setIsCompleted(true);
          setSubmitted(true);
          // Optional: Show a message or redirect
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    checkStatus();
  }, [navigate]);

  const handleChange = (event) => {
    setAnswers({
      ...answers,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    if (isCompleted) {
      setError('This assessment has already been completed');
      return;
    }

    const unansweredQuestions = Object.entries(answers)
      .filter(([_, value]) => !value)
      .length;

    if (unansweredQuestions > 0) {
      setError(`Please answer all questions (${unansweredQuestions} remaining)`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await submitAssessment(answers, 1); // 1 for Q1 assessment
      setSubmitted(true);
      
      // Update the user data in localStorage with new completedAssessments count
      const userData = JSON.parse(localStorage.getItem('user'));
      userData.completedAssessments = response.completedAssessments;
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Show success message and redirect after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const questions = [
    {
      category: 'Gross Motor',
      questions: [
        {
          id: 'grossMotor1',
          text: 'Does the baby move arms and legs equally?',
        },
        {
          id: 'grossMotor2',
          text: 'Does the baby lift their head briefly when on their tummy?',
        },
      ],
    },
    {
      category: 'Fine Motor',
      questions: [
        {
          id: 'fineMotor',
          text: 'Does the baby open and shut their hands?',
        },
      ],
    },
    {
      category: 'Language/Communication',
      questions: [
        {
          id: 'language1',
          text: 'Does the baby react to loud sounds?',
        },
        {
          id: 'language2',
          text: 'Does the baby make cooing sounds?',
        },
      ],
    },
    {
      category: 'Cognitive',
      questions: [
        {
          id: 'cognitive',
          text: 'Does the baby focus on faces?',
        },
      ],
    },
    {
      category: 'Social/Emotional',
      questions: [
        {
          id: 'socialEmotional',
          text: 'Does the baby smile when spoken to?',
        },
      ],
    },
  ];

  const calculateProgress = () => {
    const totalQuestions = Object.keys(answers).length;
    const answeredQuestions = Object.values(answers).filter(answer => answer !== '').length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6f8fc] to-[#ffffff]">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-3xl text-[#4CAF50]" />
          </div>
          <h2 className="text-2xl font-bold text-[#333333] mb-2">Assessment Already Completed</h2>
          <p className="text-[#6C757D] mb-6">You have already completed this assessment.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-[#4CAF50] text-white rounded-xl hover:bg-[#45a049] transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8fc] to-[#ffffff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4CAF50]/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4CAF50]/5 rounded-full blur-3xl -z-10" />

          {/* Enhanced Header */}
          <div className="text-center mb-16 relative">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#4CAF50]/10 rounded-full"
            >
              <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
              <span className="text-[#4CAF50] text-sm font-semibold">Development Assessment</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#333333] mb-6 tracking-tight">
              Child Progress
              <span className="block mt-2 bg-gradient-to-r from-[#4CAF50] to-[#45a049] bg-clip-text text-transparent">
                Milestone Check
              </span>
            </h1>
            <p className="text-lg text-[#6C757D] max-w-2xl mx-auto leading-relaxed">
              Track your child's developmental journey through our comprehensive assessment system
            </p>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-100 mb-12 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4CAF50] via-[#45a049] to-[#4CAF50] opacity-20" />
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#333333]">Assessment Progress</h3>
                <p className="text-sm text-[#6C757D]">Complete all questions to proceed</p>
              </div>
              <span className="text-2xl font-bold text-[#4CAF50]">
                {Math.round(calculateProgress())}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress()}%` }}
                className="h-full bg-[#4CAF50]"
              />
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100"
              >
                <i className="ri-error-warning-line mr-2" />
                {error}
              </motion.p>
            )}
          </div>

          {/* Questions Section */}
          <AnimatePresence>
            {questions.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                className="mb-8"
              >
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-100 hover:border-[#4CAF50]/20 transition-all duration-500">
                  {/* Enhanced Section Header */}
                  <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-[#4CAF50]/20 rounded-2xl rotate-6 transition-transform duration-300 group-hover:rotate-12" />
                      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4CAF50] to-[#45a049] text-white font-bold text-2xl shadow-lg">
                        {sectionIndex + 1}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#333333] group-hover:text-[#4CAF50] transition-colors duration-300">
                        {section.category}
                      </h2>
                      <p className="text-[#6C757D] text-sm mt-1">Select the most appropriate answer</p>
                    </div>
                  </div>

                  {/* Enhanced Question Cards */}
                  <div className="space-y-8">
                    {section.questions.map((question) => (
                      <div key={question.id} className="space-y-4 p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
                        <p className="text-[#333333] font-medium text-lg">{question.text}</p>
                        <div className="grid grid-cols-3 gap-4">
                          {['Yes', 'No', 'Not Sure'].map((option) => (
                            <button
                              key={option}
                              onClick={() => handleChange({
                                target: { name: question.id, value: option.toLowerCase() }
                              })}
                              className={`
                                group flex items-center gap-3 p-4 rounded-xl border-2 
                                transition-all duration-300 hover:scale-105
                                ${answers[question.id] === option.toLowerCase() 
                                  ? 'border-[#4CAF50] bg-[#4CAF50]/5 text-[#4CAF50] shadow-lg shadow-[#4CAF50]/10' 
                                  : 'border-gray-200 hover:border-[#4CAF50]/20 hover:bg-white'
                                }
                              `}
                            >
                              <span className={`
                                w-6 h-6 rounded-full flex items-center justify-center text-sm
                                ${answers[question.id] === option.toLowerCase()
                                  ? 'bg-[#4CAF50] text-white'
                                  : 'bg-gray-100 text-[#6C757D]'
                                }
                              `}>
                                {option === 'Yes' ? '✓' : option === 'No' ? '✕' : '?'}
                              </span>
                              <span className="font-medium">{option}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Enhanced Submit Button */}
          <div className="flex justify-center mt-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={submitted || isSubmitting}
              className={`
                group relative px-16 py-5 rounded-2xl text-lg font-semibold text-white
                transition-all duration-500 overflow-hidden shadow-lg
                ${isSubmitting 
                  ? 'bg-gray-400'
                  : submitted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-gradient-to-r from-[#4CAF50] to-[#45a049]'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:shadow-xl hover:shadow-[#4CAF50]/20
              `}
            >
              <span className="flex items-center gap-2">
                {isSubmitting 
                  ? 'Submitting...' 
                  : submitted 
                    ? 'Assessment Completed' 
                    : 'Submit Assessment'
                }
                {!submitted && !isSubmitting && <i className="ri-arrow-right-line" />}
              </span>
            </motion.button>
          </div>

          {/* Enhanced Success Message */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-[#4CAF50]/5 to-[#45a049]/5 border border-[#4CAF50]/20 shadow-xl backdrop-blur-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                  <i className="ri-check-line text-2xl text-[#4CAF50]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#333333]">Assessment Completed</h3>
                  <p className="text-[#6C757D]">Thank you for completing the assessment</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Q1;