"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  to?: string | null;
  onClick?: (() => void) | null;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  className = "", 
  to = null, 
  onClick = null 
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (to) {
      router.push(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative inline-block cursor-pointer rounded-md w-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5 overflow-hidden ${className}`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 bg-[length:200%_100%] animate-gradient-shift"></div>
      
      {/* Spinning circle elements */}
      <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-white animate-spin-slow opacity-70"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white animate-spin-slow opacity-70 animation-delay-1000"></div>
      
      <span className="relative block rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:text-blue-200 transition-colors z-10">
        {children}
      </span>

      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </button>
  );
};

export default AnimatedButton;