// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "../components/AdminCard";
import { useAdmin } from "../context/AdminContext";
import { FaUsers, FaUserPlus, FaDollarSign, FaChartLine } from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { userStats } = useAdmin();

  // Redirect to login if not logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.replace("/admin/login");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.replace("/admin/login");
  };

  const userActivityData = [
    { name: "Mon", "0-4": 20, "4-8": 40, "8-12": 60, "12-16": 80, "16-20": 100, "20-24": 30 },
    { name: "Tue", "0-4": 30, "4-8": 50, "8-12": 70, "12-16": 90, "16-20": 110, "20-24": 40 },
    { name: "Wed", "0-4": 40, "4-8": 60, "8-12": 80, "12-16": 100, "16-20": 120, "20-24": 50 },
    { name: "Thu", "0-4": 50, "4-8": 70, "8-12": 90, "12-16": 110, "16-20": 130, "20-24": 60 },
    { name: "Fri", "0-4": 60, "4-8": 80, "8-12": 100, "12-16": 120, "16-20": 140, "20-24": 70 },
    { name: "Sat", "0-4": 70, "4-8": 90, "8-12": 110, "12-16": 130, "16-20": 150, "20-24": 80 },
    { name: "Sun", "0-4": 80, "4-8": 100, "8-12": 120, "12-16": 140, "16-20": 160, "20-24": 90 },
  ];

  const userGrowthData = [
    { month: "Jan", users: 1000 },
    { month: "Feb", users: 1500 },
    { month: "Mar", users: 2000 },
    { month: "Apr", users: 3000 },
    { month: "May", users: 4000 },
    { month: "Jun", users: 5000 },
  ];

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-100">Overview</h2>
        <p className="text-gray-300 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminCard
          title="Total Users"
          value={userStats.totalUsers.toLocaleString()}
          subtitle="All registered users"
          icon={FaUsers}
          trend={{ value: 12.5, isPositive: true }}
        />
        <AdminCard
          title="Active Users"
          value={userStats.activeUsers.toLocaleString()}
          subtitle="Currently active"
          icon={FaUserPlus}
          trend={{ value: 8.2, isPositive: true }}
        />
        <AdminCard
          title="Total Revenue"
          value={`$${userStats.totalRevenue.toLocaleString()}`}
          subtitle="This month"
          icon={FaDollarSign}
          trend={{ value: 5.7, isPositive: true }}
        />
        <AdminCard
          title="Growth Rate"
          value={`${userStats.growthRate}%`}
          subtitle="User growth"
          icon={FaChartLine}
          trend={{ value: 2.3, isPositive: true }}
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
        <motion.div
          className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-600">
              <span className="text-sm text-gray-300">New user registration</span>
              <span className="text-xs text-gray-400">2 min ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-600">
              <span className="text-sm text-gray-300">Withdrawal request</span>
              <span className="text-xs text-gray-400">5 min ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-600">
              <span className="text-sm text-gray-300">Deposit completed</span>
              <span className="text-xs text-gray-400">10 min ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-600">
              <span className="text-sm text-gray-300">Password changed</span>
              <span className="text-xs text-gray-400">15 min ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300">Profile updated</span>
              <span className="text-xs text-gray-400">20 min ago</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 border border-blue-500/30 transition-colors">
              Manage Users
            </button>
            <button className="w-full text-left px-4 py-3 bg-green-600/20 text-green-300 rounded-lg hover:bg-green-600/30 border border-green-500/30 transition-colors">
              Process Withdrawals
            </button>
            <button className="w-full text-left px-4 py-3 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 border border-purple-500/30 transition-colors">
              View Reports
            </button>
            <button className="w-full text-left px-4 py-3 bg-orange-600/20 text-orange-300 rounded-lg hover:bg-orange-600/30 border border-orange-500/30 transition-colors">
              System Settings
            </button>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white/5 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-100 mb-4">User Activity Heatmap</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(31,41,55,0.9)", borderColor: "#4B5563", color: "#F3F4F6" }}
                  itemStyle={{ color: "#E5E7EB" }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
                <Legend wrapperStyle={{ color: "#9CA3AF" }} />
                <Bar dataKey="0-4" stackId="a" fill="#6366F1" />
                <Bar dataKey="4-8" stackId="a" fill="#8B5CF6" />
                <Bar dataKey="8-12" stackId="a" fill="#EC4899" />
                <Bar dataKey="12-16" stackId="a" fill="#10B981" />
                <Bar dataKey="16-20" stackId="a" fill="#F59E0B" />
                <Bar dataKey="20-24" stackId="a" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-100 mb-4">User Growth</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(31,41,55,0.9)", borderColor: "#4B5563", color: "#F3F4F6" }}
                  itemStyle={{ color: "#E5E7EB" }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
                <Line
                  type="monotone"
                  "
                  strokeWidth={2}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8, fill: "#8B5CF6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
