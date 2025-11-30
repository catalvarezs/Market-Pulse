import React from 'react';

export const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 w-6 bg-gray-200 rounded-md"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
      <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
    </div>
  );
};