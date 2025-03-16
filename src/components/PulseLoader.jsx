import { motion } from 'framer-motion';

const PulseLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {[0, 0.3, 0.6].map((delay) => (
        <motion.div
          key={delay}
          initial={{ y: 0 }}
          animate={{ 
            y: [-10, 10, -10],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: delay
          }}
          className="w-4 h-4 bg-cyan-500 rounded-full"
        />
      ))}
    </div>
  );
};

export default PulseLoader;