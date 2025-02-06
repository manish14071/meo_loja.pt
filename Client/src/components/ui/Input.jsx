import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  icon: Icon,
  className = "",
  containerClassName = "",
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200";
  const variants = {
    default: "border-gray-200 focus:border-blue-500 focus:ring-blue-200",
    error: "border-red-500 focus:border-red-500 focus:ring-red-200",
  };

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            ${baseStyles}
            ${variants[error ? 'error' : 'default']}
            ${Icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 