"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputComponentsProps {
  name: string;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputComponents: React.FC<InputComponentsProps> = ({ 
  name, 
  type = "text", 
  placeholder, 
  required = false,
  value,
  onChange 
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div>
      <div className="mt-1 relative">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className="appearance-none block w-full px-3 lg:py-4 py-3 rounded text-white pr-10 text-base lg:bg-transparent bg-gray-700 border border-gray-300 placeholder-gray-300 focus:outline-none focus:border-green-500 sm:text-sm transition-all duration-300"
        />
        
        {/* Eye icon for password fields */}
        {isPasswordField && (
          <button
            type="button"
            className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-gray-300 hover:text-gray-700 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 transform origin-left scale-x-0 transition-transform duration-300 focus-within:scale-x-100"></div>
      </div>
    </div>
  );
};

export default InputComponents;