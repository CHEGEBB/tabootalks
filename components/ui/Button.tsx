// components/ui/Button.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = 'px-6 py-3 rounded-full font-medium transition-all duration-300';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#ff2e2e] to-[#5e17eb] text-white shadow-md hover:shadow-lg',
    secondary: 'bg-white text-[#5e17eb] shadow-md hover:shadow-lg',
    outline: 'border-2 border-gray-300 hover:border-[#5e17eb] text-gray-700 hover:text-[#5e17eb]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
};

export default Button;