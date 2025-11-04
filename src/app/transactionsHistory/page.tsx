"use client";

import React, { useState, useEffect } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaChartLine,
  FaGift,
  FaExchangeAlt,
  FaHistory,
  FaClock,
  FaCheck,
  FaTimes,
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
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ✅ Fetch deposits & withdrawals
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const userId = userData?._id;
        if (!userId) {
          console.warn("No userId found in localStorage");
          setLoading(false);
          return;
        }

        // Fetch deposits
        const depRes = await fetch(`/api/deposits/history?userId=${userId}`);
        let deposits: Deposit[] = [];
        if (depRes.ok) deposits = await depRes.json();

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
        if (withRes.ok) withdrawals = await withRes.json();

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

        // Combine all
        const combined = [...mappedDeposits, ...mappedWithdrawals].sort(
          (a, b) =>
            new Date(b.date + " " + b.time).getTime() -
            new Date(a.date + " " + a.time).getTime()
        );

        setTransactionsData(combined);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "all", label: "All Transactions", icon: <FaHistory /> },
    { id: "deposit", label: "Deposits", icon: <FaArrowDown /> },
    { id: "withdrawal", label: "Withdrawals", icon: <FaArrowUp /> },
  ];

  const filteredTransactions = transactionsData.filter((t) => {
    const matchTab = activeTab === "all" || t.type === activeTab;
    const matchSearch =
      !searchTerm ||
      t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.wallet.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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

  const getAmountColor = (type: string) =>
    ["deposit", "reward"].includes(type) ? "text-green-400" : "text-red-400";

  const getAmountPrefix = (type: string) =>
    ["deposit", "reward"].includes(type) ? "+" : "-";

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading transactions...
      </div>
    );

  return (
    <div
      className="min-h-screen py-8 lg:px-4 px-2 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/2a/b3/7e/2ab37e7f71e0afae627c1af02447c14d.jpg')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <h1 className="text-center text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
          📊 Transactions History
        </h1>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by Transaction ID, Method, or Wallet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Transactions */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 rounded-xl bg-gray-900/70 border border-white/20 hover:border-white/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${transaction.color} flex items-center justify-center`}
                  >
                    {transaction.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold capitalize">
                      {transaction.type}
                    </h3>
                    <p className="text-xs text-blue-300">
                      {transaction.transactionId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xl font-bold ${getAmountColor(
                      transaction.type
                    )}`}
                  >
                    {getAmountPrefix(transaction.type)}$
                    {transaction.amount.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs border rounded-full px-2 py-1 ${getStatusColor(
                      transaction.status
                    )} flex items-center gap-1`}
                  >
                    {getStatusIcon(transaction.status)} {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-10 text-white/70">
              <FaHistory className="mx-auto text-3xl mb-3 opacity-50" />
              No transactions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsHistory;
 