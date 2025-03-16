import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { CheckCircleIcon, CurrencyDollarIcon, ChartBarIcon, GiftIcon } from '@heroicons/react/24/solid';
import { 
    AnimatedButton,
    FloatingCard,
    ProgressIndicator,
    ExpenseChart
  } from '../components';


const questions = [
  {
    id: 'income',
    text: 'Monthly Income',
    icon: CurrencyDollarIcon,
    type: 'number',
    min: 0
  },
  {
    id: 'expenses',
    text: 'Monthly Expenses',
    icon: ChartBarIcon,
    type: 'number',
    min: 0
  },
  {
    id: 'goal',
    text: 'Primary Financial Goal',
    icon: GiftIcon,
    type: 'select',
    options: [
      { value: 'emergency', label: 'Build Emergency Fund' },
      { value: 'debt', label: 'Pay Off Debt' },
      { value: 'invest', label: 'Invest for Future' }
    ]
  }
];

const ProgressStep = ({ active, completed }) => (
  <div className="relative flex-1 h-2 bg-gray-200 rounded-full mx-1">
    <motion.div
      className={`absolute inset-0 rounded-full ${completed ? 'bg-green-500' : 'bg-cyan-500'}`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: active || completed ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    />
  </div>
);

export default function OnboardingQuestions() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const user = auth.currentUser;
      await setDoc(doc(db, 'users', user.uid), {
        ...answers,
        createdAt: new Date()
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="flex mb-8">
          {questions.map((_, index) => (
            <ProgressStep
              key={index}
              active={index === currentStep}
              completed={index < currentStep}
            />
          ))}
        </div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <div className="flex items-center mb-8">
              {React.createElement(questions[currentStep].icon, { className: "h-12 w-12 text-cyan-600 mr-4" })}
              <h2 className="text-3xl font-bold text-gray-800">
                {questions[currentStep].text}
              </h2>
            </div>

            {questions[currentStep].type === 'select' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentStep].options.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      answers[questions[currentStep].id] === option.value
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-cyan-300'
                    }`}
                    onClick={() => setAnswers(prev => ({
                      ...prev,
                      [questions[currentStep].id]: option.value
                    }))}
                  >
                    <span className="text-lg font-medium text-gray-800">
                      {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <input
                  type={questions[currentStep].type}
                  min={questions[currentStep].min}
                  className="w-full p-4 text-2xl border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                  onChange={(e) => setAnswers(prev => ({
                    ...prev,
                    [questions[currentStep].id]: e.target.value
                  }))}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                  $
                </span>
              </motion.div>
            )}

            <div className="mt-8 flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-lg font-semibold ${
                  currentStep === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-cyan-500 text-white hover:bg-cyan-600'
                }`}
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 0}
              >
                Back
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg flex items-center gap-2"
                onClick={handleNext}
                disabled={
                  questions[currentStep].type === 'number' && 
                  !answers[questions[currentStep].id]
                }
              >
                {currentStep === questions.length - 1 ? 'Finish' : 'Next'}
                <CheckCircleIcon className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}