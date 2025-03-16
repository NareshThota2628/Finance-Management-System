// import { useState } from 'react';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { SparklesIcon } from '@heroicons/react/24/solid';

// import { 
//     AnimatedButton,
//     FloatingCard,
//     ProgressIndicator,
//     ExpenseChart
//   } from '../components';

import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/solid';

import AnimatedButton from '../components/AnimatedButton';
import FloatingCard from '../components/FloatingCard';
import ProgressIndicator from '../components/ProgressIndicator';
import ExpenseChart from '../components/ExpenseChart';



// Floating blob component
const Blob = ({ color, size, position }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1, rotate: [0, 360] }}
    transition={{
      duration: Math.random() * 5 + 10,
      repeat: Infinity,
      repeatType: 'mirror'
    }}
    className={`absolute ${size} ${color} mix-blend-multiply filter blur-xl opacity-30 rounded-full`}
    style={position}
  />
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/onboarding');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-800">
      {/* Animated blobs */}
      <Blob color="bg-pink-500" size="w-64 h-64" position={{ top: '20%', left: '10%' }} />
      <Blob color="bg-blue-400" size="w-80 h-80" position={{ top: '60%', right: '15%' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 min-h-screen flex items-center justify-center p-4"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
          <div className="flex justify-center mb-8">
            <SparklesIcon className="h-16 w-16 text-yellow-400 animate-pulse" />
          </div>
          
          <AnimatePresence mode='wait'>
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h1>
              
              <form onSubmit={handleAuth} className="space-y-6">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30 transition-all duration-300 text-white placeholder-gray-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30 transition-all duration-300 text-white placeholder-gray-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white tracking-wide shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">{isLogin ? 'Login' : 'Sign Up'}</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          <motion.div 
            className="mt-6 text-center text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="hover:text-cyan-400 transition-colors duration-300 underline underline-offset-4 decoration-dotted"
            >
              {isLogin ? 
                'New user? Create account →' : 
                'Already have an account? Login →'
              }
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}



