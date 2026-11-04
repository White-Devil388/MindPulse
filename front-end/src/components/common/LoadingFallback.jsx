import React from 'react';

export default function LoadingFallback({ message = 'Loading Experience...' }) {
  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        {/* Glowing rings */}
        <div className="w-20 h-20 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        <div className="w-12 h-12 rounded-full border-4 border-blue-400/40 border-b-blue-400 animate-spin absolute" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
        <div className="w-4 h-4 rounded-full bg-cyan-300 animate-pulse shadow-lg shadow-cyan-400" />
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-white font-extrabold text-lg tracking-wider">MindPulse</h3>
        <p className="text-cyan-200/80 text-xs font-medium mt-1 animate-pulse">{message}</p>
      </div>
    </div>
  );
}

