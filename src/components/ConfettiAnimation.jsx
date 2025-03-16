import { motion } from 'framer-motion';

const ConfettiPiece = () => (
  <motion.div
    initial={{ 
      y: -1000,
      rotate: 0
    }}
    animate={{ 
      y: 1000,
      rotate: 360,
      x: Math.random() * 400 - 200
    }}
    transition={{
      duration: 2 + Math.random() * 2,
      repeat: Infinity
    }}
    className="absolute w-2 h-2 rounded-full"
    style={{
      background: `hsl(${Math.random() * 360}, 100%, 50%)`
    }}
  />
);

export const ConfettiAnimation = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <ConfettiPiece key={i} />
      ))}
    </div>
  );
};


export default ConfettiAnimation;