  "use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface Message {
  type: "success" | "error" | "";
  text: string;
}

interface PasswordStrength {
  strength: string;
  color: string;
  width: string;
}

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const checkPasswordStrength = (password: string) => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    checkPasswordStrength(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setIsSubmitting(false);
      return;
    }

    try {
      // 👇 Make sure API path matches your backend route
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({
          type: "error",
          text: data.message || "Password update failed",
        });
        setIsSubmitting(false);
        return;
      }

      setMessage({
        type: "success",
        text: "✅ Password changed successfully!",
      });

      // Clear form
      setEmail("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordCriteria({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
    } catch (err) {
      console.error("Error:", err);
      setMessage({
        type: "error",
        text: "❌ Something went wrong. Try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (): PasswordStrength => {
    const criteriaMet = Object.values(passwordCriteria).filter(Boolean).length;
    if (criteriaMet === 5)
      return {
        strength: "Strong",
        color: "from-green-500 to-emerald-500",
        width: "100%",
      };
    if (criteriaMet >= 3)
      return {
        strength: "Good",
        color: "from-blue-500 to-cyan-500",
        width: "75%",
      };
    if (criteriaMet >= 2)
      return {
        strength: "Fair",
        color: "from-yellow-500 to-orange-500",
        width: "50%",
      };
    return {
      strength: "Weak",
      color: "from-red-500 to-pink-500",
      width: "25%",
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div
      className="min-h-screen py-8 px-4 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/78/d9/af/78d9afa28ea920998acecda1bab23f81.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="container mx-auto max-w-2xl relative z-10">
        <div className="text-center my-6">
          <h1 className="lg:text-4xl text-2xl mb-3 text-white">
            🔒{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Change Password
            </span>
          </h1>
          <p className="text-blue-100 lg:text-lg text-sm">
            Secure your account with a new password
          </p>
        </div>

        <div className="p-6 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-3">
              <label className="text-white font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/20 rounded-xl text-white placeholder-gray-400"
                placeholder="Enter your registered email"
                required
              />
            </div>

            {/* Current Password */}
            <div className="space-y-3">
              <label className="text-white font-semibold flex items-center gap-2">
                <FaLock className="text-blue-400" /> Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/20 rounded-xl text-white placeholder-gray-400 pr-12"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-3">
              <label className="text-white font-semibold flex items-center gap-2">
                <FaLock className="text-green-400" /> New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/20 rounded-xl text-white placeholder-gray-400 pr-12"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password strength bar */}
              <div className="h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${passwordStrength.color}`}
                  style={{ width: passwordStrength.width }}
                ></div>
              </div>
              <p className="text-sm text-gray-400">
                Strength: {passwordStrength.strength}
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-3">
              <label className="text-white font-semibold flex items-center gap-2">
                <FaLock className="text-purple-400" /> Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/20 rounded-xl text-white placeholder-gray-400 pr-12"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div
                className={`p-4 rounded-xl border backdrop-blur-sm ${
                  message.type === "success"
                    ? "bg-green-500/20 border-green-400/30 text-green-400"
                    : "bg-red-500/20 border-red-400/30 text-red-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  {message.type === "success" ? <FaCheck /> : <FaTimes />}
                  {message.text}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating Password...
                </>
              ) : (
                <>
                  <FaLock /> Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
