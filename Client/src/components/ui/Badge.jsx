const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = "" 
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span className={`
      ${baseStyles} 
      ${variants[variant]} 
      ${sizes[size]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge; 