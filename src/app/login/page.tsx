"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import InputComponents from "@/components/UI/InputComponents";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Save all login details to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userName", data.userName);
      localStorage.setItem("userEmail", data.userEmail);
      localStorage.setItem("referralLink", data.referralLink);

      // ✅ Redirect to home page after successful login
      router.push("/home");
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Network error. Please try again.");
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
      {/* Overlay */}
      <div className="absolute inset-0 lg:bg-black/30 bg-black/70 bg-opacity-50"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-2xl animate-slide-up">
        <div
          className="lg:bg-gray-800/70 rounded-2xl lg:p-8 px-8 
                      lg:shadow-[10px_10px_40px_#d9d9d9,-10px_-10px_40px_#ffffff]"
        >
          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="lg:text-4xl text-xl font-bold text-gray-100 tracking-wide mb-2">
              Welcome To Power X
            </h2>
            <p className="mt-2 text-gray-200 text-sm lg:text-lg font-semibold">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
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

            {/* Error Message */}
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            {/* Forgot Password */}
            <div className="flex justify-end items-center">
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-blue-200 cursor-pointer hover:text-blue-300 text-sm font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 via-green-700 
                         hover:from-blue-700 hover:to-purple-700 text-white font-semibold 
                         py-3 px-4 rounded-lg transition-all duration-300 transform 
                         hover:scale-105 shadow-lg disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup Redirect */}
          <div className="mt-8 text-center text-gray-100 text-sm">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-blue-300 cursor-pointer hover:text-blue-400 hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
