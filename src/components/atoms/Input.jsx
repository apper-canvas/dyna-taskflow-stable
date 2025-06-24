import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}, ref) => {
  const filterProps = (props) => {
    const { label, error, ...domProps } = props;
    return domProps;
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-3 py-2 border rounded-lg transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          ${error 
            ? 'border-error text-error' 
            : 'border-gray-300 hover:border-gray-400 focus:border-primary'
          }
          ${className}
        `}
        {...filterProps(props)}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;