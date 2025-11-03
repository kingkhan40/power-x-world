'use client';

import React, { useState, useEffect } from "react";
import {
  FaHistory,
  FaMoneyBillWave,
  FaClock,
  FaCheck,
  FaTimes,
  FaChartLine,
  FaGift,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
} from "react-icons/fa";

interface Transaction {
  id: number;
  transactionId: string;
  amount: number;
  type: "deposit" | "withdrawal" | "investment" | "reward" | "transfer";
  method: string;
  date: string;
  time: string;
  status: "completed" | "processing" | "failed";
  wallet: string;
  color: string;
  icon: JSX.Element;
}

interface Tab {
  id: string;
  label: string;
  icon: JSX.Element;
  count: number;
}

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

interface Withdrawal {
  _id: string;
  wallet?: string;
  amount: number;
  token?: string;
  txHash?: string;
  chain?: string;
  confirmed?: boolean;
  createdAt?: string;
}

const TransactionsHistory = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const userId = userData?._id;
        if (!userId) {
          console.warn("No userId found");
          return;
        }

        // Fetch deposits
        const depRes = await fetch(`/api/deposits/history?userId=${userId}`);
        let deposits: Deposit[] = [];
        if (depRes.ok) {
          deposits = await depRes.json();
        } else {
          console.warn("Deposits fetch failed:", depRes.status);
        }

        const mappedDeposits: Transaction[] = deposits.map((dep, index) => ({
          id: index + 1,
          transactionId: dep.txHash || dep._id,
          amount: dep.amount,
          type: "deposit",
          method: dep.token || "USDT",
          date: dep.createdAt ? new Date(dep.createdAt).toLocaleDateString() : "N/A",
          time: dep.createdAt ? new Date(dep.createdAt).toLocaleTimeString() : "N/A",
          status: dep.confirmed ? "completed" : "processing",
          wallet: dep.wallet || "N/A",
          color: "from-green-500 to-emerald-500",
          icon: <FaArrowDown className="text-white" />,
        }));

        // Fetch withdrawals
        const withRes = await fetch(`/api/withdraw/history?userId=${userId}`);
        let withdrawals: Withdrawal[] = [];
        if (withRes.ok) {
          withdrawals = await withRes.json();
        } else {
          console.warn("Withdrawa fetch failed:", withRes.status);
        }

        const mappedWithdrawals: Transaction[] = withdrawals.map((withd, index) => ({
          id: mappedDeposits.length + index + 1,
          transactionId: withd.txHash || withd._id,
          amount: withd.amount,
          type: "withdrawal",
          method: withd.token || "USDT",
          date: withd.createdAt ? new Date(withd.createdAt).toLocaleDateString() : "N/A",
          time: withd.createdAt ? new Date(withd.createdAt).toLocaleTimeString() : "N/A",
          status: withd.confirmed ? "completed" : "processing",
          wallet: withd.wallet || "N/A",
          color: "from-blue-500 to-cyan-500",
          icon: <FaArrowUp className="text-white" />,
        }));

        // Combine and sort by date descending
        const combined = [...mappedDeposits, ...mappedWithdrawals].sort((a, b) => {
          return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
        });

        setTransactionsData(combined);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds for real-time updates
    return () => clearInterval(interval);
  }, []);

  const tabs: Tab[] = [
    {
      id: "all",
      label: "All Transactions",
      icon: <FaHistory />,
      count: transactionsData.length,
    },
    {
      id: "deposit",
      label: "Deposits",
      icon: <FaArrowDown />,
      count: transactionsData.filter((t) => t.type === "deposit").length,
    },
    {
      id: "withdrawal",
      label: "Withdrawals",
      icon: <FaArrowUp />,
      count: transactionsData.filter((t) => t.type === "withdrawal").length,
    },
    {
      id: "investment",
      label: "Investments",
      icon: <FaChartLine />,
      count: transactionsData.filter((t) => t.type === "investment").length,
    },
    {
      id: "reward",
      label: "Rewards",
      icon: <FaGift />,
      count: transactionsData.filter((t) => t.type === "reward").length,
    },
  ];

  // Filter transactions based on active tab and filters
  const filteredTransactions = transactionsData.filter((transaction) => {
    const matchesTab = activeTab === "all" || transaction.type === activeTab;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesSearch =
      transaction.transactionId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.method.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesType && matchesSearch;
  });

  const getStatusColor = (status: "completed" | "processing" | "failed"): string => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/20 border-green-400/30";
      case "processing":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30";
      case "failed":
        return "text-red-400 bg-red-500/20 border-red-400/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-400/30";
    }
  };

  const getStatusIcon = (status: "completed" | "processing" | "failed"): JSX.Element => {
    switch (status) {
      case "completed":
        return <FaCheck className="text-sm" />;
      case "processing":
        return <FaClock className="text-sm" />;
      case "failed":
        return <FaTimes className="text-sm" />;
      default:
        return <FaHistory className="text-sm" />;
    }
  };

  const getAmountColor = (type: Transaction["type"]): string => {
    switch (type) {
      case "deposit":
      case "reward":
        return "text-green-400";
      case "withdrawal":
      case "investment":
        return "text-red-400";
      default:
        return "text-blue-400";
    }
  };

  const getAmountPrefix = (type: Transaction["type"]): string => {
    switch (type) {
      case "deposit":
      case "reward":
        return "+";
      case "withdrawal":
      case "investment":
        return "-";
      default:
        return "";
    }
  };

  return (
    <div
      className="min-h-screen py-8 lg:px-4 px-2 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/2a/b3/7e/2ab37e7f71e0afae627c1af02447c14d.jpg')",
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
          <h1 className="lg:text-4xl text-2xl  mb-3">
            📊 <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">Transactions History</span> 
          </h1>
          <p className="text-blue-100 lg:text-lg text-sm">
            Complete Overview of All Your Financial Activities
          </p>
        </div>

        {/* Main Content Card */}
        <div className="lg:p-6 p-3 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          {/* Rotating Border Animation */}
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
            style={{
              background:
                "conic-gradient(from 0deg, #a855f7, #ec4899, #3b82f6, #10b981, #f59e0b, #a855f7)",
              animationDuration: "9000ms",
              zIndex: 0,
            }}
          ></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>

          {/* Animated Gradient Circles */}
          <div
            className="absolute -top-8 -left-8 w-24 h-24 rounded-full z-10"
            style={{
              background: "linear-gradient(45deg, #a855f7, #ec4899, #a855f7)",
              filter: "blur(12px)",
              opacity: "0.6",
            }}
          ></div>

          <div
            className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full z-10"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #10b981, #3b82f6)",
              filter: "blur(10px)",
              opacity: "0.4",
            }}
          ></div>

          <div
            className="absolute top-1/2 -right-10 w-16 h-16 rounded-full z-10"
            style={{
              background:
                "linear-gradient(225deg, #f59e0b, #ec4899, #3b82f6, #10b981)",
              filter: "blur(8px)",
              opacity: "0.3",
            }}
          ></div>

          {/* Content */}
          <div className="relative z-20">
            <div className="flex overflow-x-auto gap-1 lg:gap-2 mb-4 lg:mb-6 pb-2 lg:pb-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 lg:gap-3 px-3 mx-1 lg:px-6 py-2 lg:py-4 rounded-lg lg:rounded-xl font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
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

            <div className="space-y-3 lg:space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 lg:p-6 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300 group"
                >
                  {/* Mobile Layout */}
                  <div className="lg:hidden flex flex-col gap-3">
                    {/* Top Row - Icon, Type, Amount */}
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${transaction.color} flex items-center justify-center shadow-lg`}
                        >
                          <div className="text-white text-sm">
                            {transaction.icon}
                          </div>
                        </div>
                         <h3 className="text-white font-semibold text-base capitalize truncate">
                              {transaction.type}
                            </h3>
                                </div>

                        <div className="flex">
                          <div
                            className={`text-lg font-bold mt-1 ${getAmountColor(
                              transaction.type
                            )}`}
                          >
                            {getAmountPrefix(transaction.type)}$
                            {transaction.amount.toLocaleString()}
                          </div>
                        </div>
                    </div>

                    {/* Middle Row - Transaction ID */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-blue-300 font-mono text-xs truncate">
                        ID: {transaction.transactionId}
                      </span>
                       <div className="flex flex-col gap-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                                transaction.status
                              )}`}
                            >
                              {getStatusIcon(transaction.status)}
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </span>
                          </div>
                    </div>

                    {/* Bottom Row - Details */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
                      <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                        <FaClock className="text-xs" />
                        {transaction.date}
                      </span>
                      <span className="bg-white/10 px-2 py-1 rounded-full capitalize">
                        {transaction.method}
                      </span>
                      <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded truncate max-w-[120px]">
                        {transaction.wallet.slice(0, 8)}...
                        {transaction.wallet.slice(-6)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout - Original justify-between */}
                  <div className="hidden lg:flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Icon with gradient background */}
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${transaction.color} flex items-center justify-center shadow-lg`}
                      >
                        {transaction.icon}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-row items-center gap-4 mb-2">
                          <h3 className="text-white font-semibold text-lg capitalize">
                            {transaction.type}
                          </h3>
                          <span className="text-blue-300 font-mono text-sm">
                            {transaction.transactionId}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {getStatusIcon(transaction.status)}
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                          <span className="flex items-center gap-1">
                            <FaClock />
                            {transaction.date} at {transaction.time}
                          </span>
                          <span className="bg-white/10 px-3 py-1 rounded-full capitalize">
                            {transaction.method}
                          </span>
                          <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">
                            {transaction.wallet.slice(0, 12)}...
                            {transaction.wallet.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold mb-1 ${getAmountColor(
                          transaction.type
                        )}`}
                      >
                        {getAmountPrefix(transaction.type)}$
                        {transaction.amount.toLocaleString()}
                      </div>
                      <div className="text-white/50 text-sm capitalize">
                        {transaction.type}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Empty State */}
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 lg:py-12">
                <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-3 lg:mb-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border border-white/20">
                  <FaHistory className="text-xl lg:text-3xl text-white/50" />
                </div>
                <h3 className="text-white text-lg lg:text-xl font-semibold mb-2">
                  No Transactions Found
                </h3>
                <p className="text-white/60 text-sm lg:text-base">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "No transactions match the current filters"}
                </p>
              </div>
            )}

            {/* Load More Button */}
            {filteredTransactions.length > 0 && (
              <div className="text-center mt-6 lg:mt-8">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white py-2 lg:py-3 px-6 lg:px-8 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Load More Transactions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsHistory;