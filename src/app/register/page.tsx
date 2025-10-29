"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputComponents from "@/components/UI/InputComponents";

const Register: React.FC = () => {
  const router = useRouter();

  // State
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Fetch referrer from URL + backend (your exact version)
  useEffect(() => {
    const fetchReferrer = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      if (ref) {
        setReferralCode(ref);

        try {
          const res = await fetch(`/api/referrer?code=${ref}`);
          const data = await res.json();
          if (data.success && data.name) {
            setMessage(`You were referred by ${data.name}`);
          } else {
            setMessage("Invalid referral link");
          }
        } catch (err) {
          console.error("Error fetching referrer:", err);
        }
      }
    };

    fetchReferrer();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle registration
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        setShowCodeInput(true);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage("Something went wrong. Please try again.");
    }
  };

  // Handle verification code
  const handleCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        setMessage("Email verified! Redirecting to login...");
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage(data.message || "Invalid or expired code");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="absolute inset-0 text-gray-800 flex flex-col items-center justify-center z-[9999]"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/b2/83/ff/b283ffd899f9fade0f33eddda227dcba.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 lg:bg-black/30 bg-black/70 bg-opacity-50"></div>

      <div className="relative z-10 w-full max-w-2xl animate-slide-up">
        <div className="lg:bg-gray-800/70 rounded-2xl lg:p-8 px-8 lg:shadow-[10px_10px_40px_#d9d9d9,-10px_-10px_40px_#ffffff]">
          <div className="mb-8">
            <h2 className="lg:text-4xl text-2xl font-bold text-gray-100 tracking-wide mb-2">
              Create Account
            </h2>
            <p className="mt-2 text-gray-200 text-sm lg:text-lg font-semibold">
              Create your account right away
            </p>
          </div>

          {/* New message-based referral display */}
          {message && (
            <p className="text-green-400 text-sm font-semibold text-center mb-5">
              {message}
            </p>
          )}

          {/* Registration Form */}
          {!showCodeInput ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <InputComponents
                name="name"
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
              <InputComponents
                name="email"
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
              <InputComponents
                name="password"
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
              <InputComponents
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
              />
              <button
                type="submit"
                disabled={loading}
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleCodeSubmit}>
                name="verificationCode"
                type="text"
                placeholder="Enter 6-digit Code"
                required
                onChange={(e) => setVerificationCode(e.target.value)}
              />

              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 via-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}

          {/* General message (below form) */}
          {message && !referralCode && (
            <p
                message.includes("sent") ||
                message.includes("verified") ||
                message.includes("Redirecting")
                  ? "text-green-400"
                  : "text-red-400"
              }`              {message}
            </p>
          )}

          <div className="mt-6 text-center text-gray-300 text-sm">
            Already cursor-pointer hover:text-blue-500 hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
    </div>
  );
};

export default Register;