import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({ 
  label, 
  error, 
  options = [], 
  placeholder,
  className = '', 
  ...props 
}, ref) => {
  const filterProps = (props) => {
    const { label, error, options, placeholder, ...domProps } = props;
    return domProps;
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-lg appearance-none transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${error 
              ? 'border-error text-error' 
              : 'border-gray-300 hover:border-gray-400 focus:border-primary'
            }
            ${className}
          `}
          {...filterProps(props)}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;