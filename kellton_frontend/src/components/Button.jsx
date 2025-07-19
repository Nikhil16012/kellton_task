import React from 'react';

const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow-card hover:bg-primary-dark transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 