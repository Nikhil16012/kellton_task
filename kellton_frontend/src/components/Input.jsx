import React from 'react';

const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-3 py-2 border border-secondary-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light shadow-card ${className}`}
    {...props}
  />
));

export default Input; 