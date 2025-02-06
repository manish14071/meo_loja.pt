import React from 'react';

const Logo = () => {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="100" cy="100" r="90" fill="url(#gradient)" />

      {/* Animated Lines */}
      <line x1="50" y1="50" x2="150" y2="150" stroke="white" strokeWidth="10" strokeLinecap="round">
        <animate attributeName="stroke-dasharray" from="0, 200" to="200, 0" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="50" y1="150" x2="150" y2="50" stroke="white" strokeWidth="10" strokeLinecap="round">
        <animate attributeName="stroke-dasharray" from="0, 200" to="200, 0" dur="2s" repeatCount="indefinite" />
      </line>

      {/* ML Text with Hover Effect */}
      <text x="50%" y="55%" fontSize="50" fontWeight="bold" fill="white" textAnchor="middle" alignmentBaseline="middle">
        <animate attributeName="fill" values="white;yellow;white" dur="2s" repeatCount="indefinite" />
        ML
      </text>

      {/* Interactive Pulsing Effect */}
      <circle cx="100" cy="100" r="85" fill="none" stroke="white" strokeWidth="5" opacity="0.5">
        <animate attributeName="r" values="85;95;85" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Gradient Definition */}
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2196F3" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;