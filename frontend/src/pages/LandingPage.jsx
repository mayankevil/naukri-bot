// src/pages/LandingPage.jsx
import React from 'react';


function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-blue-600">Welcome to Naukri AutoBot 🚀</h1>
      <div className="flex space-x-4">
        <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</a>
        <a href="/register" className="px-4 py-2 bg-green-600 text-white rounded">Register</a>
      </div>
    </div>
  );
}
export default LandingPage;