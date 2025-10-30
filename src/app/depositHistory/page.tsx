"use client";

import React, { useEffect, useState } from "react";
import {
  FaHistory,
  FaMoneyBillWave,
  FaClock,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

interface Deposit {
  _id: string;
  transactionId: string;
  amount: number;
  method: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
  wallet: string;
  color?: string;
}

interface Tab {
  id: string;
  label: string;
  icon: JSX.Element;
  count: number;
}

const DepositHistory = () => {
  const [depositData, setDepositData] = useState<Deposit[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 🔹 Fetch Deposits from MongoDB
  const fetchDeposits = async () => {
    try {
      const res = await fetch("/api/deposit/history");
      const data = await res.json();
      setDepositData(data);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  // 🔹 Auto-refresh every 5 seconds
  useEffect(() => {
    fetchDeposits();
    const interval = setInterval(fetchDeposits, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Tabs
  const tabs: Tab[] = [
    {
      id: "all",
      label: "All Deposits",
      icon: <FaHistory />,
      count: depositData.length,
    },
    {
      id: "completed",
      label: "Completed",
      icon: <FaCheck />,
      count: depositData.filter((d) => d.status === "completed").length,
    },
    {
      id: "pending",
      label: "Pending",
      icon: <FaClock />,
      count: depositData.filter((d) => d.status === "pending").length,
    },
    {
      id: "failed",
      label: "Failed",
      icon: <FaTimes />,
      count: depositData.filter((d) => d.status === "failed").length,
    },
  ];

  // 🔹 Filter Deposits
  const filteredDeposits = depositData.filter((deposit) => {
    const matchesTab = activeTab === "all" || deposit.status === activeTab;
    const matchesSearch =
      deposit.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.method?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // 🔹 Status Helpers
  const getStatusColor = (status: "completed" | "pending" | "failed"): string => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/20 border-green-400/30";
      case "pending":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30";
      case "failed":
        return "text-red-400 bg-red-500/20 border-red-400/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-400/30";
    }
  };

  const getStatusIcon = (status: "completed" | "pending" | "failed"): JSX.Element => {
    switch (status) {
      case "completed":
        return <FaCheck className="text-sm" />;
      case "pending":
        return <FaClock className="text-sm" />;
      case "failed":
        return <FaTimes className="text-sm" />;
      default:
        return <FaHistory className="text-sm" />;
    }
  };

  return (
    <div
      className="min-h-screen py-8 lg:px-4 px-2 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/5c/2c/68/5c2c68b57652c6e05ffec8f9000897fb.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header Section */}
        <div className="text-center my-4 lg:mt-0">
          <h1 className="lg:text-4xl text-2xl mb-3">
            💰{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
              Deposit History
            </span>
          </h1>
          <p className="text-blue-100 lg:text-lg text-sm">
            Track Your Deposit Transactions and Status
          </p>
        </div>

        {/* Main Card */}
        <div className="p-6 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          {/* Glow border */}
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

          {/* Gradient circles */}
          <div
            className="absolute -top-8 -left-8 w-24 h-24 rounded-full z-10"
            style={{
              background: "linear-gradient(45deg, #10b981, #3b82f6, #10b981)",
              filter: "blur(12px)",
              opacity: "0.6",
            }}
          ></div>
          <div
            className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full z-10"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #f59e0b, #8b5cf6)",
              filter: "blur(10px)",
              opacity: "0.4",
            }}
          ></div>

          {/* Tabs */}
          <div className="relative z-20">
            <div className="flex overflow-x-auto gap-1 lg:gap-2 mb-4 lg:mb-6 pb-2 lg:pb-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 lg:gap-3 px-3 mx-1 lg:px-6 py-2 lg:py-4 rounded-lg lg:rounded-xl font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg transform scale-105"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <div className="text-sm lg:text-base">{tab.icon}</div>
                  <span className="text-xs lg:text-sm">{tab.label}</span>
                  <span
                    className={`px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Deposits List */}
            <div className="space-y-3 lg:space-y-4">
              {filteredDeposits.map((deposit) => (
                <div
                  key={deposit._id}
                  className="p-4 lg:p-6 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300 group"
                >
                  {/* Desktop layout */}
                  <div className="hidden lg:flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-lg`}
                      >
                        <FaMoneyBillWave className="text-white text-lg" />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-row items-center gap-4 mb-2">
                          <h3 className="text-white font-semibold text-lg">
                            {deposit.method}
                          </h3>
                          <span className="text-blue-300 font-mono text-sm">
                            {deposit.transactionId}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(
                              deposit.status
                            )}`}
                          >
                            {getStatusIcon(deposit.status)}
                            {deposit.status.charAt(0).toUpperCase() +
                              deposit.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                          <span className="flex items-center gap-1">
                            <FaClock />
                            {deposit.date} at {deposit.time}
                          </span>
                          <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">
                            {deposit.wallet?.slice(0, 8)}...
                            {deposit.wallet?.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-white text-2xl font-bold mb-1">
                        ${deposit.amount.toLocaleString()}
                      </div>
                      <div className="text-white/50 text-sm">Amount</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredDeposits.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border border-white/20">
                  <FaHistory className="text-3xl text-white/50" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">
                  No Deposits Found
                </h3>
                <p className="text-white/60">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "No deposits match the current filters"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositHistory;
