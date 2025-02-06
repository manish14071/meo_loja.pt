import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const Alert = ({ 
  type = 'info', 
  message, 
  title,
  onClose,
  className = '' 
}) => {
  const variants = {
    success: {
      icon: FaCheckCircle,
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-800',
      iconColor: 'text-green-400'
    },
    error: {
      icon: FaExclamationCircle,
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-800',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: FaExclamationTriangle,
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: FaInfoCircle,
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-800',
      iconColor: 'text-blue-400'
    }
  };

  const Icon = variants[type].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        rounded-lg border p-4 ${variants[type].bg} ${variants[type].border} ${className}
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${variants[type].iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${variants[type].text}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${variants[type].text} mt-1`}>
            {message}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex ${variants[type].text} hover:bg-opacity-20 focus:outline-none`}
          >
            <span className="sr-only">Dismiss</span>
            <FaExclamationCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Alert; 