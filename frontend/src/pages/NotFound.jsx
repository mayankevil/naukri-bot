// src/pages/NotFound.jsx
import React from 'react';

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-700 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <a href="/" className="text-blue-600 underline">Go back to Home</a>
    </div>
  );
}

