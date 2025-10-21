import React from "react";

interface ButtonsProps {
  text: string;
  onClick: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const Buttons: React.FC<ButtonsProps> = ({ 
  text, 
  onClick, 
  type = "button",
  className = "",
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`w-full py-3 px-6 cursor-pointer rounded-xl font-semibold 
                bg-gradient-to-r from-gray-200 to-blue-200 via-emerald-200
                active:scale-95 transition-all duration-300 text-black font-poppins
                disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {text}
    </button>
  );
};

export default Buttons;