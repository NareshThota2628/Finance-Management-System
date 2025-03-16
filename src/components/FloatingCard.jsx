import { motion } from 'framer-motion';

export const FloatingCard = ({ children }) => {
  return (
    <motion.div
      whileHover={{ 
        y: -10,
        rotate: Math.random() * 2 - 1 // Slight random rotation
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300,
        damping: 10
      }}
      className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20
                shadow-2xl overflow-hidden"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute -inset-24 animate-gradient-x bg-gradient-to-r from-cyan-500/30 via-transparent to-blue-600/30" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};


export default FloatingCard;