// src/app/admin/login/page.tsx
"use client";

import { useState, useEffect } from "react";


export default function AdminLoginPage() {
  const router = useRouter();
  const [email, 
    = useState("");

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) router.replace("/admin/dashboard");
  }, [router]);


  e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "
          = await res.json();

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
  <div: "center",
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

  z - 10 border p - 8 backdrop - blur - md border - gray - 500 rounded - lg shadow - md shadow - white">
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

              
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="relative block w-full p-3 bg-transparent border border-gray-300 placeholder-gray-400 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors duration-200"
            />
          </div>

          <div>

              Password
            </label>
            <input
              id="password"
              name="password"
                type="
              
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="relative block w-full p-3 bg-transparent border border-gray-300 placeholder-gray-400 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors duration-200"
            />
    
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
              hrxxxxxxxxxxxxxxxxxxxef="/adxxxxxxmin"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Homecc
            </Link>
          </div>
      </div>
    </div>
  );
}
