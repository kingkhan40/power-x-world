// src/app/admin/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaLock, FaUserShield, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) router.replace("/admin/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // ✅ On successful login: store token and redirect to dashboard
      localStorage.setItem("adminToken", data.token);
      router.replace("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error — try again later");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-2 lg:px-8 relative"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://i.pinimg.com/1200x/7a/df/dd/7adfdd71e41449d41ebb7a5557971168.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Top Back Button */}
      <Link
        href="/admin"
        className="absolute top-6 left-6 z-20 flex items-center text-white hover:text-gray-300 transition-colors duration-200"
      >
        <FaArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Back</span>
      </Link>

      <div className="max-w-xl w-full space-y-8 relative z-10 border p-8 backdrop-blur-md border-gray-500 rounded-lg shadow-md shadow-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaUserShield className="w-7 h-7 text-gray-600" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-white">
            Admin Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Access the administration panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="relative block w-full p-3 bg-transparent border border-gray-300 placeholder-gray-400 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors duration-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="relative block w-full p-3 bg-transparent border border-gray-300 placeholder-gray-400 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors duration-200"
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="space-y-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FaLock className="w-4 h-4 mr-2" />
              Sign in
            </button>

            {/* Bottom Back Button */}
            <Link
              href="/admin"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
