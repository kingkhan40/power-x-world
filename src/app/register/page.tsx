"use client";
import { useRouter } from "next/navigation";
import InputComponents from "@/components/UI/InputComponents";
import { useState, useEffect } from "react";

const Register = () => {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false); // To show code input field
  const [verificationCode, setVerificationCode] = useState(""); // Store verification code input

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

  // ✅ Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle Registration (send code)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          referralCode,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setMessage("Verification code sent to your email!");
        setShowCodeInput(true); // Show verification input
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage("Something went wrong. Please try again.");
    }
  };

  // ✅ Handle Verification Code (use /api/verify)
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setMessage("Email verified successfully! Account created.");
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/login");
      } else {
        setMessage(data.message || "Invalid or expired code");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage("Something went wrong. Please try again.");
    }
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
              Create your account right away
            </p>
          </div>

          {/* ✅ If user hasn't received code yet */}
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
                placeholder="Password"
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
            // ✅ Show verification code input
            <form className="space-y-5" onSubmit={handleCodeSubmit}>
              <InputComponents
                name="verificationCode"
                type="text"
                placeholder="Enter Verification Code"
                required={true}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 via-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  loading && "opacity-70 cursor-not-allowed"
                }`}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}

          {message && (
            <p className="text-center mt-4 text-sm font-medium text-gray-100">
              {message}
            </p>
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
