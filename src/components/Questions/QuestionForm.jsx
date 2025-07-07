import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { submitAssessment, checkAssessmentStatus } from '../../services/assessmentService';

const questionSets = {
  1: [ // 0-3 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Does the baby move arms and legs equally?' },
        { id: 'grossMotor2', text: 'Does the baby lift their head briefly when on their tummy?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Does the baby open and shut their hands?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Does the baby react to loud sounds?' },
        { id: 'language2', text: 'Does the baby make cooing sounds?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Does the baby focus on faces?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the baby smile when spoken to?' }
      ]
    }
  ],
  2: [ // 3-6 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Does the baby bring hands together?' },
        { id: 'grossMotor2', text: 'Does the baby roll from tummy to back?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Does the baby reach for objects?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Does the baby babble?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Does the baby respond to familiar voices?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the baby smile spontaneously?' }
      ]
    }
  ],
  3: [ // 6-9 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Does the baby sit without support?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Does the baby transfer objects from one hand to another?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Does the baby respond to their name?' },
        { id: 'language2', text: 'Does the baby understand "no?"' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Does the baby look for objects that are out of sight (peek-a-boo)?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the baby show affection to familiar people?' }
      ]
    }
  ],
  4: [ // 9-12 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Does the baby crawl?' },
        { id: 'grossMotor2', text: 'Can they pull themselves up to stand?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Does the baby use their fingers to point?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Does the baby imitate sounds?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Does the baby put objects in a container?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the baby wave bye-bye?' }
      ]
    }
  ],
  5: [ // 12-15 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Does the child walk independently?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Does the child scribble?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child say "mama" and "dada?"' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Does the child imitate actions?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child show affection to familiar people?' }
      ]
    }
  ],
  6: [ // 15-18 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Does the child walk up stairs with help?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Does the child drink from a cup?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child say at least three words besides "mama" or "dada?"' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Does the child follow one-step directions?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child point to show you something interesting?' }
      ]
    }
  ],
  7: [ // 18-21 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child walk backward?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child turn pages in a book?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child point to objects when named?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Does the child copy you doing chores?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child copy other children?' }
      ]
    }
  ],
  8: [ // 21-24 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child run?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child build a tower of four blocks?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child name at least five body parts?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child complete simple puzzles?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child show defiant behavior?' }
      ]
    }
  ],
  9: [ // 24-27 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child jump with both feet?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child draw straight lines and circles?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child use two-word sentences?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child sort objects by shape and color?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child play alongside other children?' }
      ]
    }
  ],
  10: [ // 27-30 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child stand on one foot for a few seconds?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child turn door handles?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child follow two-step instructions?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child name most familiar things?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child show a wide range of emotions?' }
      ]
    }
  ],
  11: [ // 30-33 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child walk on tiptoes?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child use scissors?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child say their first name, age, and sex?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child complete sentences and rhymes in familiar books?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child get upset with major changes in routine?' }
      ]
    }
  ],
  12: [ // 33-36 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child ride a tricycle?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child draw a person with three parts?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child carry on a conversation using two to three sentences?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child play make-believe with dolls, animals, and people?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child show concern for a crying friend?' }
      ]
    }
  ],
  13: [ // 36-39 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child hop and stand on one foot for up to five seconds?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child screw and unscrew jar lids or turn door handles?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child use four- to five-word sentences?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child understand the concept of "same" and "different?"' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child play cooperatively with other children?' }
      ]
    }
  ],
  14: [ // 39-42 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child catch a bounced ball most of the time?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child draw a person with at least six body parts?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child tell stories?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child name some colors and some numbers?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child understand the idea of "mine" and "his" or "hers?"' }
      ]
    }
  ],
  15: [ // 42-45 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child stand on one foot for 10 seconds or longer?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child print some letters or numbers?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child speak clearly enough for strangers to understand?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child count 10 or more things?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child want to please friends?' }
      ]
    }
  ],
  16: [ // 45-48 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child hop on one foot?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child use a fork and spoon?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child use future tense?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child understand the concept of time?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child prefer to play with other children than by themselves?' }
      ]
    }
  ],
  17: [ // 48-51 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child do a somersault?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child copy a triangle and other geometric shapes?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child tell you what they think is going to happen next in a story?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child understand the concept of counting and know some numbers?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child like to sing, dance, and act?' }
      ]
    }
  ],
  18: [ // 51-54 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child skip?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child draw a person with at least eight body parts?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child use past tense correctly?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child name at least four colors?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Does the child enjoy playing board games?' }
      ]
    }
  ],
  19: [ // 54-60 months
    {
      category: 'Gross Motor',
      questions: [
        { id: 'grossMotor1', text: 'Can the child ride a bicycle?' }
      ]
    },
    {
      category: 'Fine Motor',
      questions: [
        { id: 'fineMotor1', text: 'Can the child write their name?' }
      ]
    },
    {
      category: 'Language/Communication',
      questions: [
        { id: 'language1', text: 'Can the child retell a story in detail?' }
      ]
    },
    {
      category: 'Cognitive',
      questions: [
        { id: 'cognitive1', text: 'Can the child count to 20?' }
      ]
    },
    {
      category: 'Social/Emotional',
      questions: [
        { id: 'socialEmotional1', text: 'Can the child play fairly in group games?' }
      ]
    }
  ]
};

const QuestionForm = () => {
  const navigate = useNavigate();
  const { questionNumber } = useParams(); // Get question number from URL
  const assessmentNumber = parseInt(questionNumber.replace('q', ''));
  
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize empty answers for all questions
  useEffect(() => {
    const currentQuestions = questionSets[assessmentNumber] || [];
    const initialAnswers = {};
    currentQuestions.forEach(section => {
      section.questions.forEach(question => {
        initialAnswers[question.id] = '';
      });
    });
    setAnswers(initialAnswers);
  }, [assessmentNumber]);

  // Check if assessment was already completed
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkAssessmentStatus(assessmentNumber);
        if (status.completed) {
          setIsCompleted(true);
          setSubmitted(true);
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    checkStatus();
  }, [assessmentNumber, navigate]);

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
      const response = await submitAssessment(answers, assessmentNumber);
      setSubmitted(true);
      
      // Update user data in localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      userData.completedAssessments = response.completedAssessments;
      localStorage.setItem('user', JSON.stringify(userData));
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const currentQuestions = questionSets[assessmentNumber] || [];
  const ageRange = `${(assessmentNumber - 1) * 3}-${assessmentNumber * 3}`;

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
              <span className="text-[#4CAF50] text-sm font-semibold">{`${ageRange} Months Assessment`}</span>
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
            {currentQuestions.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                className="mb-8"
              >
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-100 hover:border-[#4CAF50]/20 transition-all duration-500">
                  {/* Section Header */}
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

                  {/* Questions */}
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

          {/* Submit Button */}
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

          {/* Success Message */}
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

export default QuestionForm;
