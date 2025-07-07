import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import React from 'react';

const Q5 = () => {
  const [answers, setAnswers] = useState({
    grossMotor: '',
    fineMotor: '',
    language: '',
    cognitive: '',
    socialEmotional: '',
  });
  
    const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setAnswers({
      ...answers,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = () => {
    const unansweredQuestions = Object.entries(answers)
      .filter(([_, value]) => !value)
      .length;

    if (unansweredQuestions > 0) {
      setError(`Please answer all questions (${unansweredQuestions} remaining)`);
      return;
    }

    setSubmitted(true);
    setError('');
  };

  const calculateProgress = () => {
    const totalQuestions = Object.keys(answers).length;
    const answeredQuestions = Object.values(answers).filter(answer => answer !== '').length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const questions = [
    {
      category: 'Gross Motor',
      questions: [
        {
          id: 'grossMotor',
          text: 'Does the child walk independently?',
        },
      ],
    },
    {
      category: 'Fine Motor',
      questions: [
        {
          id: 'fineMotor',
          text: 'Does the child Scribble?',
        },
      ],
    },
    {
      category: 'Language/Communication',
      questions: [
        {
          id: 'language',
          text: 'Can the child say "mama" and "dada?"',
        },
      ],
    },
    {
      category: 'Cognitive',
      questions: [
        {
          id: 'cognitive',
          text: 'Does the child imitate actions?',
        },
      ],
    },
    {
      category: 'Social/Emotional',
      questions: [
        {
          id: 'socialEmotional',
          text: 'Does the child show affection to familiar people?',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#4CAF50]/5 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          {/* Header */}
          <div className="text-center mb-16 relative">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#4CAF50]/10 rounded-full"
            >
              <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
              <span className="text-[#4CAF50] text-sm font-semibold">12-15 Months Assessment</span>
            </motion.div>
            {/* ...rest of the header... */}
          </div>

          {/* ...rest of the component structure (progress bar, questions, submit button)... */}
        </motion.div>
      </div>
    </div>
  );
};

export default Q5;
