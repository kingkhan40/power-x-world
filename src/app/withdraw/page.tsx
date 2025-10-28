"use client";

import React, { useEffect, useState } from "react";
import { FaCoins, FaDollarSign } from "react-icons/fa";
import { FaUnlockKeyhole } from "react-icons/fa6";

function WithdrawPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [balance, setBalance] = useState<number>(0);
  const userEmail = "talha@gmail.com"; // ✅ Replace with logged-in user email (from auth/session)

  // ✅ Fetch real balance from MongoDB
  const fetchBalance = async () => {
    try {
      const res = await fetch(`/api/user-balance?email=${userEmail}`);
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
      }
    } catch (err) {
      console.error("Balance fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // ✅ Withdraw handler
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
          email: userEmail,
          walletAddress,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Withdrawal successful!");
        setAmount("");
        setWalletAddress("");
        setBalance(data.newBalance); // ✅ update balance on frontend instantly
      } else {
        alert(data.message || "❌ Withdrawal failed.");
      }
    } catch (error) {
      console.error("Withdraw Error:", error);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* ... (your same background and styling) */}

      <div className="container mx-auto max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="lg:text-4xl text-3xl mb-4 text-white font-bold">
            💸 Withdraw Funds
          </h1>
        </div>

        <div className="p-6 bg-gray-900/80 rounded-2xl border border-gray-700 shadow-xl">
          {/* Wallet Address */}
          <div className="mb-6">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2 text-lg">
              <FaUnlockKeyhole className="text-blue-300" />
              Enter Wallet Address
            </h3>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your wallet address"
              className="w-full p-3 bg-transparent border border-white/30 rounded-md text-white"
            />
          </div>

          {/* ✅ Show Real Balance */}
          <div className="rounded-2xl p-6 mb-6 border border-white/30">
            <p className="text-blue-100 text-sm tracking-wider mb-2">
              Available Balance
            </p>
            <div className="flex items-center justify-between">
              <p className="lg:text-3xl text-2xl font-bold text-white">
                ${balance.toFixed(2)}
              </p>
              <FaCoins className="text-3xl text-yellow-400" />
            </div>
          </div>

          {/* Withdrawal Amount */}
          <div className="mb-6">
            <label className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <FaDollarSign className="text-green-400" />
              Enter Withdrawal Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full p-3 bg-transparent border border-white/30 rounded-md text-white"
              placeholder="Enter withdrawal amount"
            />
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={!walletAddress || !amount || Number(amount) <= 0}
            className={`w-full p-3 rounded-md font-semibold transition-all duration-200 ${
              !walletAddress || !amount || Number(amount) <= 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
            }`}
          >
            Continue to Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

export default WithdrawPage;
