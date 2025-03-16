// import { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { NavigationBar, AnimatedModal, NotificationBanner, ConfettiAnimation } from './components';
// import { Login, OnboardingQuestions, Dashboard, FinancialHealthScore } from './pages';
// import { motion } from 'framer-motion'; // Add this line


// import { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { NavigationBar, AnimatedModal, NotificationBanner, ConfettiAnimation } from './components';
// import Login from './pages/Login';
// import OnboardingQuestions from './pages/OnboardingQuestions';
// import Dashboard from './pages/Dashboard';
// import FinancialHealthScore from './pages/FinancialHealthScor';
// import { motion } from 'framer-motion';


import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import AnimatedModal from './components/AnimatedModal';
import NotificationBanner from './components/NotificationBanner';
import ConfettiAnimation from './components/ConfettiAnimation';
import Login from './pages/Login';
import OnboardingQuestions from './pages/OnboardingQuestions';
import Dashboard from './pages/Dashboard';
import FinancialHealthScore from './pages/FinancialHealthScor';
import { motion } from 'framer-motion';




function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <Router>
      {/* Global Components */}
      <ConfettiAnimation />
      {notification && (
        <NotificationBanner type={notification.type} message={notification.message} />
      )}

      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/onboarding" element={<OnboardingQuestions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/financial-health" element={<FinancialHealthScore />} />
        </Routes>
      </motion.main>

      {/* Modal Example */}
      <AnimatedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <p className="text-gray-600">Customize your financial preferences here.</p>
        <button
          onClick={() => {
            setIsModalOpen(false);
            showNotification('success', 'Settings saved successfully!');
          }}
          className="mt-6 w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors"
        >
          Save Changes
        </button>
      </AnimatedModal>
    </Router>
  );
}

export default App;