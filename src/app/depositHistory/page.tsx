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
  wallet?: string;
  amount: number;
  token?: string;
  txHash?: string;
  chain?: string;
  confirmed?: boolean;
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
  // ✅ Fetch data from MongoDB via API with userId
  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("userData");
      if (!storedUser) {
        throw new Error("User not logged in");
      }
      const user = JSON.parse(storedUser);
      const userId = user._id;
      const res = await fetch(`/api/deposits/history?userId=${userId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch deposits");
      }
      setDepositData(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching deposits:", err);
      setError(err.message || 'Failed to load deposits');
      setDepositData([]);
    } finally {
      setLoading(false);
    }
  };
  // ✅ Load on mount only
  useEffect(() => {
    fetchDeposits();
  }, []);
  // ✅ Tabs
  const tabs: Tab[] = [
    {
      id: "all",
      label: "All Deposits",
      icon: <FaHistory />,
      count: depositData.length
    },
    {
      id: "completed",
      label: "Completed",
      icon: <FaCheck />,
      count: depositData.filter(d => d.confirmed === true).length
    },
    {
      id: "pending",
      label: "Pending",
      icon: <FaClock />,
      count: depositData.filter(d => d.confirmed === false).length
    },
    {
      id: "failed",
      label: "Failed",
      icon: <FaTimes />,
      count: depositData.filter(d => d.confirmed === undefined).length // Assuming no 'failed', count will be 0
    },
  ];
  // ✅ Filtering logic
  const filteredDeposits = depositData.filter((deposit) => {
    const status = deposit.confirmed === true ? "completed" : deposit.confirmed === false ? "pending" : "failed";
    const matchesTab = activeTab === "all" || status === activeTab;
    const matchesSearch =
      deposit.txHash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.token?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.chain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.wallet?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });
  // ✅ Helper functions
  const getStatusColor = (confirmed?: boolean) => {
    if (confirmed === true) return "text-green-400 bg-green-500/20 border-green-400/30";
    if (confirmed === false) return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30";
    return "text-red-400 bg-red-500/20 border-red-400/30"; // For undefined or failed
  };
  const getStatusIcon = (confirmed?: boolean) => {
    if (confirmed === true) return <FaCheck className="text-sm" />;
    if (confirmed === false) return <FaClock className="text-sm" />;
    return <FaTimes className="text-sm" />;
  };
  const getStatusLabel = (confirmed?: boolean) => {
    if (confirmed === true) return "Completed";
    if (confirmed === false) return "Pending";
    return "Failed";
  };
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading deposits...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-2xl text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Deposits</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchDeposits}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white py-2 px-6 rounded-xl font-semibold transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
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
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header Section */}
        <div className="text-center my-6 lg:mt-0">
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
        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by TxHash, Token, Chain, or Wallet..."
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
        {/* Main Content Card */}
        <div className="lg:p-6 p-3 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
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
          {/* Animated Gradient Circles */}
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
          <div
            className="absolute top-1/2 -right-10 w-16 h-16 rounded-full z-10"
            style={{
              background: "linear-gradient(225deg, #f59e0b, #ec4899, #3b82f6, #10b981)",
              filter: "blur(8px)",
              opacity: "0.3",
            }}
          ></div>
          {/* Content */}
          <div className="relative z-20">
            {/* Tabs */}
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
              {filteredDeposits.map((deposit) => {
                const dateObj = deposit.createdAt ? new Date(deposit.createdAt) : null;
                const date = dateObj ? dateObj.toLocaleDateString() : 'N/A';
                const time = dateObj ? dateObj.toLocaleTimeString() : '';
                return (
                  <div
                    key={deposit._id}
                    className="p-4 lg:p-6 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300 group"
                  >
                    {/* Mobile Layout */}
                    <div className="lg:hidden flex flex-col gap-3">
                      {/* Top Row - Icon, Method, Amount */}
                      <div className="flex items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-lg`}
                          >
                            <FaMoneyBillWave className="text-white text-sm" />
                          </div>
                          <h3 className="text-white font-semibold text-base capitalize truncate">
                            {deposit.token || 'Unknown'} on {deposit.chain || 'N/A'}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-lg font-bold">
                            ${deposit.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {/* Middle Row - Transaction ID */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-blue-300 font-mono text-xs truncate">
                          ID: {deposit.txHash || 'N/A'}
                        </span>
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                              deposit.confirmed
                            )}`}
                          >
                            {getStatusIcon(deposit.confirmed)}
                            {getStatusLabel(deposit.confirmed)}
                          </span>
                        </div>
                      </div>
                      {/* Bottom Row - Details */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
                        <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                          <FaClock className="text-xs" />
                          {date}
                        </span>
                        <span className="bg-white/10 px-2 py-1 rounded-full capitalize">
                          {deposit.chain || 'N/A'}
                        </span>
                        <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded truncate max-w-[120px]">
                          {deposit.wallet?.slice(0, 8)}...
                          {deposit.wallet?.slice(-6)}
                        </span>
                      </div>
                    </div>
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Icon with gradient background */}
                        <div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-lg`}
                        >
                          <FaMoneyBillWave className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-row items-center gap-4 mb-2">
                            <h3 className="text-white font-semibold text-lg">
                              {deposit.token || 'Unknown'} on {deposit.chain || 'N/A'}
                            </h3>
                            <span className="text-blue-300 font-mono text-sm">
                              {deposit.txHash || 'N/A'}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(
                                deposit.confirmed
                              )}`}
                            >
                              {getStatusIcon(deposit.confirmed)}
                              {getStatusLabel(deposit.confirmed)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                            <span className="flex items-center gap-1">
                              <FaClock />
                              {date} at {time}
                            </span>
                            <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">
                              {deposit.wallet?.slice(0, 12)}...
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
                );
              })}
            </div>
            {/* Empty State */}
            {filteredDeposits.length === 0 && (
              <div className="text-center py-8 lg:py-12">
                <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-3 lg:mb-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border border-white/20">
                  <FaHistory className="text-xl lg:text-3xl text-white/50" />
                </div>
                <h3 className="text-white text-lg lg:text-xl font-semibold mb-2">
                  {depositData.length === 0 ? "No Deposits Found" : "No Matching Deposits"}
                </h3>
                <p className="text-white/60 text-sm lg:text-base">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : depositData.length === 0
                    ? "You haven't made any deposits yet"
                    : "No deposits match the current filters"}
                </p>
              </div>
            )}
            {/* Refresh Button */}
            {filteredDeposits.length > 0 && (
              <div className="text-center mt-6 lg:mt-8">
                <button
                  onClick={fetchDeposits}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white py-2 lg:py-3 px-6 lg:px-8 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Refresh Deposits
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DepositHistory; 