"use client";

import React, { useEffect, useState } from "react";
import {
  FaHistory,
  FaMoneyBillWave,
  FaClock,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

interface Withdraw {
  _id: string;
  amount: number;
  method: string;
  walletAddress: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
}

interface Tab {
  id: string;
  label: string;
  icon: JSX.Element;
  count: number;
}

const WithdrawalHistoryPage = () => {
  const [withdrawData, setWithdrawData] = useState<Withdraw[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch user-specific withdrawals using userId
  const fetchWithdraws = async () => {
    try {
      const userId =
        typeof window !== "undefined" ? localStorage.getItem("userId") : null;

      if (!userId) {
        console.error("No userId found in localStorage");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/withdraw/history?userId=${userId}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch withdraw history");

      const data: Withdraw[] = await res.json();
      setWithdrawData(data);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdraws();
    const interval = setInterval(fetchWithdraws, 10000);
    return () => clearInterval(interval);
  }, []);

  const tabs: Tab[] = [
    { id: "all", label: "All Withdrawals", icon: <FaHistory />, count: withdrawData.length },
    { id: "completed", label: "Completed", icon: <FaCheck />, count: withdrawData.filter(d => d.status === "completed").length },
    { id: "pending", label: "Processing", icon: <FaClock />, count: withdrawData.filter(d => d.status === "pending").length },
    { id: "failed", label: "Failed", icon: <FaTimes />, count: withdrawData.filter(d => d.status === "failed").length },
  ];

  const filteredWithdrawals = withdrawData.filter(w =>
    activeTab === "all" ? true : w.status === activeTab
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed": return "text-green-400 bg-green-500/20 border-green-400/30";
      case "pending": return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30";
      case "failed": return "text-red-400 bg-red-500/20 border-red-400/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-400/30";
    }
  };

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case "completed": return <FaCheck className="text-sm" />;
      case "pending": return <FaClock className="text-sm" />;
      case "failed": return <FaTimes className="text-sm" />;
      default: return <FaHistory className="text-sm" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white text-xl font-medium">Loading withdrawals...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-2 lg:px-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('https://i.pinimg.com/1200x/db/38/f0/db38f0a52e6e49591ed29add58a322a5.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center my-6">
          <h1 className="text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 mb-2">
            Withdrawal History
          </h1>
          <p className="text-blue-100 text-sm lg:text-base">Track your withdrawal requests in real-time</p>
        </div>

        {/* Card Container */}
        <div className="relative p-6 rounded-2xl bg-gray-900/90 border border-gray-700 shadow-2xl overflow-hidden">
          <div
            className="absolute -inset-2 rounded-2xl opacity-60 animate-spin"
            style={{
              background: "conic-gradient(from 0deg, #10b981, #3b82f6, #8b5cf6, #f59e0b, #10b981)",
              animationDuration: "12s",
            }}
          ></div>

          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-[1]"></div>

          {/* Tabs */}
          <div className="relative z-20 flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab.id ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Withdrawal Cards */}
          <div className="relative z-20 space-y-4">
            {filteredWithdrawals.length === 0 ? (
              <div className="text-center py-16">
                <FaHistory className="text-5xl text-white/40 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">No Withdrawals Found</h3>
                <p className="text-white/60">No records match your current filter</p>
              </div>
            ) : (
              filteredWithdrawals.map((w) => (
                <div
                  key={w._id}
                  className="p-5 lg:p-6 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/40 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <FaMoneyBillWave className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{w.method}</h3>
                        <p className="text-white/70 text-sm">{new Date(w.createdAt).toLocaleString()}</p>
                        <p className="font-mono text-xs text-white/60 truncate max-w-[180px] lg:max-w-none">
                          {w.walletAddress}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-white text-2xl font-bold mb-1">${w.amount.toLocaleString()}</div>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                          w.status
                        )}`}
                      >
                        {getStatusIcon(w.status)}
                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalHistoryPage;
