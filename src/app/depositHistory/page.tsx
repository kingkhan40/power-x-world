"use client";
import React, { useEffect, useState } from "react";
import {
  FaHistory,
  FaClock,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

interface Deposit {
  _id: string;
  wallet?: string;
  amount: number;
  token?: string;
  txHash?: string;
  chain?: string;
  confirmed?: boolean | null;
  createdAt?: string;
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
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Deposits from API
  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setDepositData([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/deposits/history?userId=${userId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch deposits");

      if (Array.isArray(data)) {
        setDepositData(data);
      } else {
        console.warn("Unexpected data format:", data);
        setDepositData([]);
      }
    } catch (error: any) {
      console.error("Error fetching deposits:", error);
      setDepositData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on load + every 5 seconds
  useEffect(() => {
    fetchDeposits();
    const interval = setInterval(fetchDeposits, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get status string
  const getStatus = (confirmed?: boolean | null): "completed" | "pending" | "failed" => {
    if (confirmed === true) return "completed";
    if (confirmed === false) return "pending";
    return "failed";
  };

  // Tabs
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
      count: depositData.filter((d) => d.confirmed === true).length,
    },
    {
      id: "pending",
      label: "Pending",
      icon: <FaClock />,
      count: depositData.filter((d) => d.confirmed === false).length,
    },
    {
      id: "failed",
      label: "Failed",
      icon: <FaTimes />,
      count: depositData.filter((d) => d.confirmed === null).length,
    },
  ];

  // Filter Deposits - FIXED PART
  const filteredDeposits = depositData.filter((deposit) => {
    const status = getStatus(deposit.confirmed);
    const matchesTab = activeTab === "all" || status === activeTab;

    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      (deposit.txHash?.toLowerCase().includes(term) ?? false) ||
      (deposit.token?.toLowerCase().includes(term) ?? false) ||
      (deposit.chain?.toLowerCase().includes(term) ?? false) ||
      (deposit.wallet?.toLowerCase().includes(term) ?? false);

    return matchesTab && matchesSearch;
  });

  // Status UI helpers
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

  // Format Date & Time
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return { date: "N/A", time: "" };
    const dateObj = new Date(isoString);
    return {
      date: dateObj.toLocaleDateString(),
      time: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
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
        <div className="text-center my-4 lg:mt-0">
          <h1 className="lg:text-4xl text-2xl mb-3">
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
              Deposit History
            </span>
          </h1>
          <p className="text-blue-100 lg:text-lg text-sm">
            Track your deposit transactions and their status
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by TxHash, Token, Chain, Wallet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
              <FaHistory />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="p-6 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          {/* Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
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

          {/* Loading */}
          {loading && (
            <div className="text-center text-white/70 py-10">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading deposits...</p>
            </div>
          )}

          {/* Deposits List */}
          {!loading && filteredDeposits.length > 0 && (
            <div className="space-y-4">
              {filteredDeposits.map((deposit) => {
                const status = getStatus(deposit.confirmed);
                const { date, time } = formatDateTime(deposit.createdAt);

                return (
                  <div
                    key={deposit._id}
                    className="p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          {deposit.token || "Unknown"} ({deposit.chain || "N/A"})
                        </h3>
                        <p className="text-blue-300 text-sm font-mono">
                          {deposit.txHash || "N/A"}
                        </p>
                        <p className="text-white/60 text-sm">
                          {date} — {time}
                        </p>
                        <p className="font-mono text-xs text-white/70">
                          {deposit.wallet
                            ? `${deposit.wallet.slice(0, 8)}...${deposit.wallet.slice(-8)}`
                            : "N/A"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-white text-2xl font-bold">
                          ${deposit.amount.toLocaleString()}
                        </span>
                        <span
                          className={`mt-1 px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(
                            status
                          )}`}
                        >
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredDeposits.length === 0 && (
            <div className="text-center py-12 text-white/70">
              <FaHistory className="mx-auto text-3xl mb-3" />
              <p>No deposits found.</p>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        {!loading && filteredDeposits.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={fetchDeposits}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-6 rounded-xl font-semibold hover:scale-105 transition-all"
            >
              Refresh Deposits
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositHistory;          