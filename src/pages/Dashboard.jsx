// import { useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { auth, db } from '../firebase';
// import { motion } from 'framer-motion';
// import { Chart } from 'chart.js';
// import { ArrowTrendingUpIcon, CurrencyDollarIcon, WalletIcon, ChartBarIcon } from '@heroicons/react/24/solid';
// import { 
//     AnimatedButton,
//     FloatingCard,
//     ProgressIndicator,
//     ExpenseChart
//   } from '../components';


import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon, CurrencyDollarIcon, WalletIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import AnimatedButton from '../components/AnimatedButton';
import FloatingCard from '../components/FloatingCard';
import ProgressIndicator from '../components/ProgressIndicator';
import ExpenseChart from '../components/ExpenseChart';


const RadialProgress = ({ percentage }) => (
  <div className="relative w-48 h-48">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle
        className="text-gray-200"
        strokeWidth="8"
        stroke="currentColor"
        fill="transparent"
        r="40"
        cx="50"
        cy="50"
      />
      <motion.circle
        className="text-cyan-500"
        strokeWidth="8"
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r="40"
        cx="50"
        cy="50"
        initial={{ strokeDasharray: '0 251' }}
        animate={{ 
          strokeDasharray: `${(percentage / 100) * 251} 251`,
          rotate: -90
        }}
        transition={{ duration: 1.5, type: 'spring' }}
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-4xl font-bold text-cyan-600">{percentage}%</span>
    </div>
  </div>
);

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [score, setScore] = useState(75); // Default score

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        // Calculate score (example formula)
        const calculatedScore = Math.min(
          (data.income / (data.expenses || 1)) * 40 + 60,
          100
        );
        setScore(Math.round(calculatedScore));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <WalletIcon className="h-10 w-10 text-cyan-600" />
          Financial Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-cyan-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
              <h3 className="text-xl font-semibold">Monthly Income</h3>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              ${userData?.income || 0}
            </div>
          </motion.div>

          {/* Expenses Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-pink-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <ChartBarIcon className="h-8 w-8 text-pink-500" />
              <h3 className="text-xl font-semibold">Monthly Expenses</h3>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              ${userData?.expenses || 0}
            </div>
          </motion.div>

          {/* Financial Health Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <ArrowTrendingUpIcon className="h-8 w-8 text-purple-500" />
              <h3 className="text-xl font-semibold">Financial Health</h3>
            </div>
            <div className="flex justify-center">
              <RadialProgress percentage={score} />
            </div>
          </motion.div>
        </div>

        {/* Expense Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-2xl font-semibold mb-4">Expense Breakdown</h3>
          <div className="h-96">
            <canvas id="expenseChart"></canvas>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}