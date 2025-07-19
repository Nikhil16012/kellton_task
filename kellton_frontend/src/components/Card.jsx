import React from 'react';

const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white rounded-2xl shadow-card p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card; 