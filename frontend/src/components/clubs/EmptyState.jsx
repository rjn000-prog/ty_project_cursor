import React from 'react';

const EmptyState = ({ 
  title = "No data found", 
  message = "There's nothing to display here yet.",
  actionLabel,
  onAction 
}) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;