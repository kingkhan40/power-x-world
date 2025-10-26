"use client";

import React, { useState } from "react";
import { useBalance } from "@/context/BalanceContext"; // ✅ Balance Context import

export default function WithdrawPage() {
  const { balance } = useBalance(); // ✅ live balance from context
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState<number | "">("");

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
          walletAddress,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Withdrawal request submitted successfully!");
        setAmount("");
        setWalletAddress("");
      } else {
        alert(data.message || "❌ Withdrawal failed. Try again later.");
      }
    } catch (error) {
      console.error("Withdraw Error:", error);
      alert("❌ Something went wrong while processing your request.");
    }
  };

  return (
    <div className="p-8 bg-[#10001f] rounded-2xl text-white max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Secure Withdrawal Process
      </h2>

      {/* ✅ Wallet Address Input */}
      <label className="block text-sm mb-2">Enter Wallet Address *</label>
      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Enter your wallet address"
        className="w-full p-2 rounded-md bg-[#2a004f] mb-5 border border-[#4b0082] focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* ✅ Live Balance Display */}
      <div className="bg-[#31006a] p-4 rounded-lg mb-5 text-center shadow-md">
        <p className="text-sm text-gray-300">Available Balance</p>
        <h3 className="text-2xl font-semibold text-green-400">
          ${balance ? balance.toFixed(2) : "0.00"}
        </h3>
      </div>

      {/* ✅ Withdraw Amount Input */}
      <label className="block text-sm mb-2">Enter Withdrawal Amount *</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
        placeholder="0"
        className="w-full p-2 rounded-md bg-[#2a004f] mb-6 border border-[#4b0082] focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* ✅ Withdraw Button */}
      <button
        onClick={handleWithdraw}
        disabled={!walletAddress || !amount || Number(amount) <= 0}
        className={`w-full p-2 rounded-md font-semibold transition-all duration-200 ${
          !walletAddress || !amount || Number(amount) <= 0
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Continue to Withdraw
      </button>
    </div>
  );
}
