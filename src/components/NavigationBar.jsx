import { motion } from 'framer-motion';
import { useState } from 'react';
import { HomeIcon, ChartBarIcon, UserIcon, CogIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence } from 'framer-motion'; // Add this line

export const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'Analytics', icon: ChartBarIcon },
    { name: 'Profile', icon: UserIcon },
    { name: 'Settings', icon: CogIcon }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              FinanceAI
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 cursor-pointer"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-4 space-y-4"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium text-gray-700">{item.name}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};


export default NavigationBar;