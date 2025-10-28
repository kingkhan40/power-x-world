"use client";

import React, { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa";
import { useBalance } from "@/context/BalanceContext";

function WithdrawPage() {
  const { balance, setBalance } = useBalance();
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const email =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  // ✅ Fetch balance if not already set in context
  useEffect(() => {
    const fetchBalance = async () => {
      if (!email) return;
      try {
        const res = await fetch(`/api/user-balance?email=${email}`);
        const data = await res.json();
        if (data.success) {
          setBalance(data.balance);
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
      } finally {
        setLoading(false);
      }
    };

    if (balance === 0) {
      fetchBalance();
    } else {
      setLoading(false);
    }
  }, [email, balance, setBalance]);

  const handleWithdraw = async () => {
    if (!walletAddress || !amount) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          walletAddress,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Withdrawal successful!");
        setBalance(data.newBalance); // 🔥 instantly updates everywhere
        setWalletAddress("");
        setAmount("");
      } else {
        alert(data.message || "❌ Withdrawal failed.");
      }
    } catch (err) {
      console.error("Withdraw error:", err);
      alert("❌ Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-black">
        <p>Loading balance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">💸 Withdraw Funds</h1>

        {/* ✅ Live MongoDB Wallet Balance */}
        <div className="border border-white/20 rounded-2xl p-6 mb-6">
          <p className="text-gray-300 text-sm mb-2">Available Balance</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
            <FaCoins className="text-yellow-400 text-3xl" />
          </div>
        </div>

        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter wallet address"
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white outline-none"
        />

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter withdrawal amount"
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white outline-none"
        />

        <button
          onClick={handleWithdraw}
          disabled={!walletAddress || !amount || Number(amount) <= 0}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-md font-semibold hover:opacity-90 transition"
        >
          Continue to Withdraw
        </button>
      </div>
    </div>
  );
}

export default WithdrawPage;
