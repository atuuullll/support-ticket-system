import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        </div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}
