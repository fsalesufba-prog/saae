import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  color = '#0066b3',
  fullScreen = false
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const loader = (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizeClasses[size]}
          border-4 border-t-4 border-gray-200 rounded-full
          animate-spin
        `}
        style={{ borderTopColor: color }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;