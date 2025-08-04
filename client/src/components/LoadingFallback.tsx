import React from 'react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-[200px] flex items-center justify-center bg-white rounded-lg shadow-sm">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500"></div>
    </div>
  );
};

export default LoadingFallback;
