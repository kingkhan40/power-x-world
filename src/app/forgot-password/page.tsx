"use client";
import { FaArrowLeft } from "react-icons/fa6";
import InputComponents from "@/components/UI/InputComponents";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Initialize refs array
  if (otpRefs.current.length !== otp.length) {
    otpRefs.current = Array(otp.length).fill(null);
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Simulate sending OTP
    console.log("Sending OTP to:", email);
    alert(`OTP has been sent to ${email}`);

    // Set OTP sent status
    setOtpSent(true);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace to move to previous input
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      otpRefs.current[index - 1]
    ) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate OTP (in a real app, you would verify this with your backend)
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      alert("Please enter the complete 6-digit OTP");
      return;
    }

    // Validate password
    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }

    // Update password in database (simulate API call)
    setTimeout(() => {
      alert("Password reset successfully!");
      // Redirect to login page
      router.push("/login");
    }, 1000);
  };

  const handleBack = () => {
    // Go back to previous page
    router.back();
  };

  return (
    <div
      className="absolute inset-0  text-gray-800 flex flex-col items-center justify-center z-[9999]"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-vector/gradient-stock-market-concept_23-2149215737.jpg?t=st=1758109323~exp=1758112923~hmac=a3d7697261013df3340cbe6029f3528fcf5836020cafac0526d3a6bd6a40e500&w=740')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 lg:bg-black/30 bg-black/80 bg-opacity-50"></div>

      <div className="relative z-10 w-full max-w-xl animate-slide-up">
        <div className="lg:bg-gray-800/70  backdrop-blur-xs rounded-2xl p-8 shadow-xl">
          <h2 className="lg:text-4xl text-2xl font-bold text-gray-100 tracking-wide mb-2">
            Forgot password
          </h2>
          <p className="text-gray-300 text-sm mb-6">
            Enter your account email address to reset your password.
          </p>

          {/* Email Input Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-6 mb-6">
            <InputComponents
              name="email"
              type="email"
              placeholder="Type your Email"
              required={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-x-3 gap-y-4">
              <div className="flex order-1 lg:order-2 justify-between space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el: HTMLInputElement | null) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="lg:w-12 w-10 lg:h-12 h-10 text-center lg:text-lg text-base border border-gray-200 rounded-lg
                              bg-transparent text-white
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 via-green-700 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Send OTP
              </button>
            </div>
          </form>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 via-green-700 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Reset Password
            </button>
          </form>

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
