// app/register/page.tsx - UPDATED
'use client';
import { useRouter } from "next/navigation";
import InputComponents from "@/components/UI/InputComponents";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const router = useRouter();
  const { register, verifyEmail, loading, error, message, setError, setMessage } = useAuth();
  
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ Get referral from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if (ref) setReferralCode(ref);
  }, []);

  // ✅ Reset form when showing code input
  useEffect(() => {
    if (showCodeInput) {
      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
    }
  }, [showCodeInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setUserEmail(formData.email);
      await register({
        ...formData,
        referralCode,
      });
      setShowCodeInput(true);
    } catch (err) {
      // Error already handled in context
      console.error("Registration error in component:", err);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setError("Please enter 6-digit verification code");
      return;
    }

    try {
      await verifyEmail(userEmail, verificationCode);
    } catch (err) {
      // Error handled in context
    }
  };

  // ✅ Function to go back to email form
  const handleBackToEmail = () => {
    setShowCodeInput(false);
    setVerificationCode("");
    setMessage("");
    setError("");
  };

  return (
    <div
      className="absolute inset-0 text-gray-800 flex flex-col items-center justify-center z-[9999]"
      style={{
        backgroundImage: `url('https://i.pinimg.com/1200x/b2/83/ff/b283ffd899f9fade0f33eddda227dcba.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 lg:bg-black/30 bg-black/70 bg-opacity-50"></div>
      <div className="relative z-10 w-full max-w-2xl animate-slide-up">
        <div
          className="lg:bg-gray-800/70 rounded-2xl lg:p-8 px-8 
                      lg:shadow-[10px_10px_40px_#d9d9d9,-10px_-10px_40px_#ffffff]"
        >
          <div className="mb-8">
            <h2 className="lg:text-4xl text-2xl font-bold text-gray-100 tracking-wide mb-2">
              Create Account
            </h2>
            <p className="mt-2 text-gray-200 text-sm lg:text-lg font-semibold">
              {showCodeInput ? "Verify your email" : "Create your account right away"}
            </p>
          </div>

          {!showCodeInput ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <InputComponents
                name="name"
                type="text"
                placeholder="Full Name"
                required={true}
                value={formData.name}
                onChange={handleInputChange}
              />

              <InputComponents
                name="email"
                type="email"
                placeholder="Email"
                required={true}
                value={formData.email}
                onChange={handleInputChange}
              />

              <InputComponents
                name="password"
                type="password"
                placeholder="Password (min 6 characters)"
                required={true}
                value={formData.password}
                onChange={handleInputChange}
              />

              <InputComponents
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required={true}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />

              {referralCode && (
                <p className="text-green-400 text-sm font-semibold">
                  Referral Code: {referralCode}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 via-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  loading && "opacity-70 cursor-not-allowed"
                }`}
              >
                {loading ? "Sending Code..." : "Sign Up"}
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleCodeSubmit}>
              <div className="text-center mb-4">
                <p className="text-gray-300 text-sm mb-2">
                  Verification code sent to:
                </p>
                <p className="text-blue-300 font-semibold">{userEmail}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Check your spam folder if you don't see the email
                </p>
              </div>
              
              <InputComponents
                name="verificationCode"
                type="text"
                placeholder="Enter 6-digit Verification Code"
                required={true}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                >
                  Change Email
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 via-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    loading && "opacity-70 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </div>
            </form>
          )}

          {/* Error and Message Display */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg mt-4">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          {message && (
            <div className="p-3 bg-green-500/20 border border-green-400/30 rounded-lg mt-4">
              <p className="text-green-400 text-sm text-center">{message}</p>
            </div>
          )}

          <div className="mt-6 text-center text-gray-300 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-300 cursor-pointer hover:text-blue-500 hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;