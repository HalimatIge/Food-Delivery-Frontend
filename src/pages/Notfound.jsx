import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF5EB] text-center px-6">
      <h1 className="text-5xl font-bold text-[#FF4C29] mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-[#FF4C29] text-white px-4 py-2 rounded hover:bg-[#e64524]">Go Home</Link>
    </div>
  );
};

export default NotFound;
