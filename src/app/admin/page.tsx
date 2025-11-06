// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "./context/AdminContext"; 
export default function AdminDashboard() {
  const router = useRouter();
  const { userStats } = useAdmin();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      // Not logged in → redirect to login
      router.replace("/admin/login");
    } else {
      // Logged in → allow dashboard access
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    // Show nothing or a loader during redirect
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Checking authorization...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-500 text-white p-4 rounded">
          <h2>Total Users</h2>
          <p className="text-3xl font-bold">{userStats.totalUsers}</p>
        </div>

        {/* Future cards for activeUsers, revenue, etc. */}
        <div className="bg-green-500 text-white p-4 rounded">
          <h2>Active Users</h2>
          <p className="text-3xl font-bold">{userStats.activeUsers}</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded">
          <h2>New Users</h2>
          <p className="text-3xl font-bold">{userStats.newUsers}</p>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded">
          <h2>Total Revenue</h2>
          <p className="text-3xl font-bold">${userStats.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
}
