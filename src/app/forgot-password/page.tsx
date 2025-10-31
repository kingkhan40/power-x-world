"use client";

import { FaArrowLeft } from "react-icons/fa6";
import InputComponents from "@/components/UI/InputComponents";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext'; // ✅ Import AuthContext

const ForgotPassword = () => {
  const { 
    sendOtp, 
    resetPassword, 
    forgotPasswordLoading, 
    forgotPasswordMessage, 
    otpSent, 
    resetPasswordSuccess,
    clearForgotPasswordState 
  } = useAuth(); // ✅ Use AuthContext
  
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState<string>("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Clear state when component unmounts
  useEffect(() => {
    return () => {
      clearForgotPasswordState();
    };
  }, []);

  // Initialize refs array for OTP boxes
  if (otpRefs.current.length !== otp.length) {
    otpRefs.current = Array(otp.length).fill(null);
  }

  // ✅ Step 1: Send OTP to Email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendOtp(email);
  };

  // ✅ Step 2: Handle OTP Input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only numbers allowed

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace navigation
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      otpRefs.current[index - 1]
    ) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Step 3: Verify OTP + Change Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    await resetPassword(email, enteredOtp, newPassword);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div
      className="absolute inset-0 text-gray-800 flex flex-col items-center justify-center z-[9999]"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-vector/gradient-stock-market-concept_23-2149215737.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 lg:bg-black/30 bg-black/80 bg-opacity-50"></div>

      <div className="relative z-10 w-full max-w-xl animate-slide-up">
        <div className="lg:bg-gray-800/70 backdrop-blur-xs rounded-2xl p-8 shadow-xl">
          <h2 className="lg:text-4xl text-2xl font-bold text-gray-100 tracking-wide mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-300 text-sm mb-6">
            Enter your account email address to reset your password.
          </p>

          {/* Message Display */}
          {forgotPasswordMessage.text && (
            <div
              className={`p-4 rounded-xl border backdrop-blur-sm mb-4 ${
                forgotPasswordMessage.type === "success"
                  ? "bg-green-500/20 border-green-400/30 text-green-400"
                  : "bg-red-500/20 border-red-400/30 text-red-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {forgotPasswordMessage.type === "success" ? "✅" : "❌"}
                {forgotPasswordMessage.text}
              </div>
            </div>
          )}

          {/* Email Input Form */}
          {!otpSent && (
            <form onSubmit={handleEmailSubmit} className="space-y-6 mb-6">
              <InputComponents
                name="email"
                type="email"
                placeholder="Type your Email"
                required={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                type="submit"
                disabled={forgotPasswordLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 via-green-700 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {forgotPasswordLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* OTP + Password Form */}
          {otpSent && !resetPasswordSuccess && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="flex justify-center space-x-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el: HTMLInputElement | null) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-10 lg:w-12 lg:h-12 text-center text-white text-lg border border-gray-200 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                ))}
              </div>

              <InputComponents
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                required={true}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                type="submit"
                disabled={forgotPasswordLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 via-green-700 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {forgotPasswordLoading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          )}

          <button
            onClick={handleBack}
            className="flex items-center cursor-pointer text-gray-300 hover:text-white transition-colors mt-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;