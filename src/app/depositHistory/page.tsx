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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeposits = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in");

      const res = await fetch(`/api/deposits/history?userId=${userId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch deposits");

      setDepositData(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching deposits:", err);
      setError(err.message || "Failed to load deposits");
      setDepositData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const tabs: Tab[] = [
    { id: "all", label: "All Deposits", icon: <FaHistory />, count: depositData.length },
    { id: "completed", label: "Completed", icon: <FaCheck />, count: depositData.filter(d => d.confirmed === true).length },
    { id: "pending", label: "Pending", icon: <FaClock />, count: depositData.filter(d => d.confirmed === false).length },
    { id: "failed", label: "Failed", icon: <FaTimes />, count: depositData.filter(d => d.confirmed === null).length },
  ];

  const filteredDeposits = depositData.filter(deposit => {
    const status = deposit.confirmed === true ? "completed" :
                   deposit.confirmed === false ? "pending" : "failed";
    const matchesTab = activeTab === "all" || status === activeTab;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = deposit.txHash?.toLowerCase().includes(term) ||
                          deposit.token?.toLowerCase().includes(term) ||
                          deposit.chain?.toLowerCase().includes(term) ||
                          deposit.wallet?.toLowerCase().includes(term);
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (confirmed?: boolean | null) => {
    if (confirmed === true) return "text-green-400 bg-green-500/20 border-green-400/30";
    if (confirmed === false) return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30";
    return "text-red-400 bg-red-500/20 border-red-400/30";
  };

  const getStatusIcon = (confirmed?: boolean | null) => {
    if (confirmed === true) return <FaCheck className="text-sm" />;
    if (confirmed === false) return <FaClock className="text-sm" />;
    return <FaTimes className="text-sm" />;
  };

  const getStatusLabel = (confirmed?: boolean | null) => {
    if (confirmed === true) return "Completed";
    if (confirmed === false) return "Pending";
    return "Failed";
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading deposits...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex justify-center items-center text-white">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTimes className="text-2xl text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Deposits</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchDeposits}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-6 rounded-xl font-semibold transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4 relative bg-black/70">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center my-6">
          <h1 className="text-3xl mb-3 text-white font-bold">💰 Deposit History</h1>
          <p className="text-blue-100 text-sm">Track Your Deposit Transactions and Status</p>
        </div>

        {/* Search */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by TxHash, Token, Chain, or Wallet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"><FaHistory /></div>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors">
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${activeTab === tab.id ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg" : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"}`}
            >
              {tab.icon} <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-white/10 text-white/70"}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Deposits List */}
        <div className="space-y-4">
          {filteredDeposits.map(deposit => {
            const dateObj = deposit.createdAt ? new Date(deposit.createdAt) : null;
            const date = dateObj ? dateObj.toLocaleDateString() : "N/A";
            const time = dateObj ? dateObj.toLocaleTimeString() : "";
            return (
              <div key={deposit._id} className="p-4 rounded-xl bg-gray-800/60 border border-white/10 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">{deposit.token || "Unknown"} ({deposit.chain || "N/A"})</h3>
                    <p className="text-white/70 text-sm">TxHash: {deposit.txHash || "N/A"}</p>
                    <p className="text-white/60 text-xs">{date} {time}</p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(deposit.confirmed)}`}>
                      {getStatusIcon(deposit.confirmed)} {getStatusLabel(deposit.confirmed)}
                    </div>
                    <p className="text-white text-lg font-bold mt-2">${deposit.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredDeposits.length === 0 && (
            <div className="text-center py-10 text-white/70">
              <FaHistory className="text-4xl mx-auto mb-2 opacity-60" />
              <p>No deposits found.</p>
            </div>
          )}
        </div>

        {filteredDeposits.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={() => { setSearchTerm(""); setActiveTab("all"); fetchDeposits(); }}
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
