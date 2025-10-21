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
  transactionId: string;
  amount: number;
  method: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
  wallet: string;
  fee?: number;
}

interface Tab {
  id: string;
  label: string;
  icon: JSX.Element;
  count: number;
}

const WithdrawalHistory = () => {
  const [withdrawData, setWithdrawData] = useState<Withdraw[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  // 🔹 Fetch from MongoDB
  const fetchWithdraws = async () => {
    try {
      const res = await fetch("/api/withdraw/history");
      const data = await res.json();
      setWithdrawData(data);
    } catch (error) {
      console.error("Error fetching withdraws:", error);
    }
  };

  // 🔹 Auto-refresh every 5 seconds
  useEffect(() => {
    fetchWithdraws();
    const interval = setInterval(fetchWithdraws, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Tabs
  const tabs: Tab[] = [
    { id: "all", label: "All Withdrawals", icon: <FaHistory />, count: withdrawData.length },
    { id: "completed", label: "Completed", icon: <FaCheck />, count: withdrawData.filter((d) => d.status === "completed").length },
    { id: "pending", label: "Processing", icon: <FaClock />, count: withdrawData.filter((d) => d.status === "pending").length },
    { id: "failed", label: "Failed", icon: <FaTimes />, count: withdrawData.filter((d) => d.status === "failed").length },
  ];

  // 🔹 Filter data
  const filteredWithdrawals = withdrawData.filter((withdraw) =>
    activeTab === "all" ? true : withdraw.status === activeTab
  );

  // 🔹 Helpers
  const getStatusColor = (status: "completed" | "pending" | "failed"): string => {
    switch (status) {
      case "completed": return "text-green-400 bg-green-500/20 border-green-400/30";
      case "pending": return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30";
      case "failed": return "text-red-400 bg-red-500/20 border-red-400/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-400/30";
    }
  };
  const getStatusIcon = (status: "completed" | "pending" | "failed"): JSX.Element => {
    switch (status) {
      case "completed": return <FaCheck className="text-sm" />;
      case "pending": return <FaClock className="text-sm" />;
      case "failed": return <FaTimes className="text-sm" />;
      default: return <FaHistory className="text-sm" />;
    }
  };

  return (
    <div
      className="min-h-screen py-8 lg:px-4 px-2 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/db/38/f0/db38f0a52e6e49591ed29add58a322a5.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header Section */}
        <div className="text-center my-4">
          <h1 className="lg:text-4xl text-2xl mb-3">
            💸{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
              Withdrawal History
            </span>
          </h1>
          <p className="text-blue-100 lg:text-lg text-sm">
            Track Your Withdrawal Requests and Status
          </p>
        </div>

        {/* Main Card */}
        <div className="p-6 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          {/* Rotating Border Animation */}
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
            style={{
              background:
                "conic-gradient(from 0deg, #10b981, #3b82f6, #8b5cf6, #f59e0b, #10b981)",
              animationDuration: "9000ms",
              zIndex: 0,
            }}
          ></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>

          {/* Tabs */}
          <div className="relative z-20 flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {tab.icon}
                <span className="text-sm">{tab.label}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Withdraw List */}
          <div className="relative z-20 space-y-4">
            {filteredWithdrawals.map((withdraw) => (
              <div
                key={withdraw._id}
                className="p-5 lg:p-6 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div
                      className={`w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center`}
                    >
                      <FaMoneyBillWave className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{withdraw.method}</h3>
                      <p className="text-blue-300 font-mono text-sm">
                        TXN: {withdraw.transactionId}
                      </p>
                      <p className="text-white/70 text-sm">
                        {withdraw.date} {withdraw.time}
                      </p>
                      <p className="font-mono text-xs text-white/60 truncate max-w-[200px]">
                        {withdraw.wallet}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-white text-2xl font-bold mb-1">
                      ${withdraw.amount.toLocaleString()}
                    </div>
                    {withdraw.fee && (
                      <div className="text-red-400 text-sm mb-1">
                        Fee: ${withdraw.fee}
                      </div>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 justify-center ${getStatusColor(
                        withdraw.status
                      )}`}
                    >
                      {getStatusIcon(withdraw.status)}
                      {withdraw.status.charAt(0).toUpperCase() + withdraw.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredWithdrawals.length === 0 && (
              <div className="text-center py-12">
                <FaHistory className="text-4xl text-white/50 mx-auto mb-3" />
                <h3 className="text-white text-xl font-semibold mb-2">
                  No Withdrawals Found
                </h3>
                <p className="text-white/60">
                  No withdrawals match the current filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalHistory;
