import { motion } from "framer-motion";

const Card = ({ 
  children, 
  className = "", 
  hover = true,
  animation = true,
  ...props 
}) => {
  const baseStyles = "bg-white rounded-xl shadow-md overflow-hidden";
  const hoverStyles = hover ? "hover:shadow-lg transition-all duration-300" : "";
  
  if (animation) {
    return (
      <motion.div
        whileHover={hover ? { y: -5 } : {}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${baseStyles} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card; 