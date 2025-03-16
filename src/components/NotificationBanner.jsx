import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

export const NotificationBanner = ({ type, message }) => {
  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircleIcon,
          color: 'bg-green-100 border-green-500 text-green-700'
        };
      case 'warning':
        return {
          icon: ExclamationTriangleIcon,
          color: 'bg-yellow-100 border-yellow-500 text-yellow-700'
        };
      case 'error':
        return {
          icon: InformationCircleIcon,
          color: 'bg-red-100 border-red-500 text-red-700'
        };
      default:
        return {
          icon: InformationCircleIcon,
          color: 'bg-blue-100 border-blue-500 text-blue-700'
        };
    }
  };

  const { icon: Icon, color } = getConfig();

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-4 rounded-xl border-l-4 ${color} shadow-lg`}
    >
      <Icon className="h-6 w-6" />
      <span className="font-medium">{message}</span>
    </motion.div>
  );
};


export default NotificationBanner;