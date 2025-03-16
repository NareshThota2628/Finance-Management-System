import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';

export const AnimatedButton = ({ text, onClick }) => {
  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0px 10px 20px rgba(6, 182, 212, 0.3)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400 }}
      className="relative group bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-xl 
                 text-white font-semibold overflow-hidden"
      onClick={onClick}
    >
      <span className="relative z-10 flex items-center gap-2">
        {text}
        <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </span>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );

};
AnimatedButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AnimatedButton;
