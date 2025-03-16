import { motion } from 'framer-motion';
import { ShareIcon, LightBulbIcon, ChartPieIcon } from '@heroicons/react/24/solid';

import { 
    AnimatedButton,
    FloatingCard,
    ProgressIndicator,
    ExpenseChart
  } from '../components';

const GaugeMeter = ({ percentage }) => (
  <div className="relative w-64 h-64">
    {/* Add your custom SVG gauge implementation here */}
  </div>
);

export default function FinancialHealthScore() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Financial Health Score
          </h1>
          <div className="flex justify-center">
            <GaugeMeter percentage={75} />
          </div>
        </div>

        {/* Improvement Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-cyan-50 p-6 rounded-xl border-l-4 border-cyan-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <LightBulbIcon className="h-6 w-6 text-cyan-600" />
              <h3 className="text-xl font-semibold">Savings Tip</h3>
            </div>
            <p className="text-gray-700">
              Automate 15% of your income to savings each month to build 
              emergency funds faster.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <ChartPieIcon className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Investment Advice</h3>
            </div>
            <p className="text-gray-700">
              Consider allocating 20% of your savings to low-risk index funds
              for long-term growth.
            </p>
          </motion.div>
        </div>

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold"
        >
          <ShareIcon className="h-5 w-5" />
          Share Progress
        </motion.button>
      </motion.div>
    </div>
  );
}