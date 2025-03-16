import { motion } from 'framer-motion';

export const FinancialHealthMeter = ({ score }) => {
  const getColor = (score) => {
    if (score < 40) return 'red';
    if (score < 70) return 'orange';
    return 'green';
  };

  return (
    <div className="relative w-64 h-64">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <motion.circle
          initial={{ strokeDasharray: '0 251' }}
          animate={{ 
            strokeDasharray: `${(score / 100) * 251} 251`,
            rotate: -90
          }}
          transition={{ duration: 1.5, type: 'spring' }}
          className={`stroke-${getColor(score)}-500`}
          strokeWidth="8"
          strokeLinecap="round"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold"
          style={{ color: `var(--color-${getColor(score)})` }}
        >
          {score}%
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialHealthMeter;