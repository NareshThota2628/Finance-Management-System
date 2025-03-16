import { motion } from 'framer-motion';

export const ProgressIndicator = ({ percentage }) => {
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, type: 'spring' }}
        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full relative"
      >
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </motion.div>
    </div>
  );
};

export default ProgressIndicator;