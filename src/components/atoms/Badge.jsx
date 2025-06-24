import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-amber-800',
    error: 'bg-error/10 text-error',
    high: 'bg-gradient-to-r from-red-500 to-red-400 text-white shadow-sm',
    medium: 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-sm',
    low: 'bg-gradient-to-r from-green-500 to-green-400 text-white shadow-sm'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const filterProps = (props) => {
    const { variant, size, ...domProps } = props;
    return domProps;
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...filterProps(props)}
    >
      {children}
    </motion.span>
  );
};

export default Badge;