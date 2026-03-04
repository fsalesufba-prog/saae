import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'medium',
  shadow = 'medium',
  border = false,
  onClick
}) => {
  const paddingClasses = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md hover:shadow-lg',
    large: 'shadow-lg hover:shadow-xl'
  };

  const borderClass = border ? 'border border-gray-200' : '';

  return (
    <div
      className={`
        bg-white rounded-xl
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${borderClass}
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:translate-y-[-4px]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;