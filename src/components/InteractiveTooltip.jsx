import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const InteractiveTooltip = ({ text, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 
                      bg-gray-800 text-white rounded-lg text-sm shadow-xl"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default InteractiveTooltip;