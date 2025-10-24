"use client";
import { useState } from "react";

export default function WithdrawPage() {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch balance manually after entering wallet
  const fetchBalance = async () => {
    if (!wallet) return alert("⚠️ Please enter your wallet address first.");

    try {
      setLoading(true);
      const res = await fetch(`/api/user/${wallet}`);
      const data = await res.json();

      if (data.balance !== undefined) {
        setBalance(data.balance);
      } else {
        alert("⚠️ Wallet not found or balance not available");
        setBalance(0);
      }
    } catch (err) {
      console.error("Balance fetch error:", err);
      alert("❌ Failed to fetch balance");
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Withdraw request handler
  const handleWithdraw = async () => {
    if (!wallet || amount <= 0) return alert("Enter valid data");

    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userWallet: wallet,
        destination: wallet, // same wallet for now
        amount,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Withdrawal completed successfully!");
      setBalance(data.newBalance);
      setAmount(0);
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#14002b] to-[#080013] text-white">
      <div className="bg-[#1b0034]/70 backdrop-blur-xl p-8 rounded-2xl w-[400px] shadow-xl border border-[#2a0055]">
        <h2 className="text-center text-2xl font-semibold mb-2">
          Secure Withdrawal Process
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Enter your wallet address and withdrawal amount
        </p>

        {/* 🪙 Wallet Input */}
        <label className="block text-sm font-semibold text-green-400 mb-2">
          Enter Wallet Address *
        </label>
        <div className="flex items-center bg-[#2a1150] rounded-lg border border-gray-600 mb-5">
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="w-full bg-transparent p-3 text-white outline-none"
            placeholder="Enter your wallet address"
          />
        </div>

        {/* 🔘 Fetch Balance Button */}
        <button
          onClick={fetchBalance}
          disabled={!wallet || loading}
          className={`w-full mb-6 py-3 rounded-lg font-semibold transition-all ${
            !wallet || loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-500 hover:opacity-90"
          }`}
        >
          {loading ? "Fetching..." : "Check Balance"}
        </button>

        {/* 💰 Available Balance */}
        {balance !== null && (
          <div className="bg-[#2a1150] p-5 rounded-xl mb-6 flex justify-between items-center">
            <div>
              <p className="text-gray-300 text-sm">Available Balance</p>
              <p className="text-3xl font-bold">{balance.toFixed(2)}$</p>
            </div>
            <span className="text-yellow-400 text-3xl">💰</span>
          </div>
        )}

        {/* 🧾 Withdrawal Input */}
        {balance !== null && (
          <>
            <label className="block text-sm font-semibold text-green-400 mb-2">
              Enter Withdrawal Amount *
            </label>
            <div className="flex items-center bg-[#2a1150] rounded-lg border border-gray-600 mb-5">
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="w-full bg-transparent p-3 text-white outline-none"
                placeholder="Enter withdrawal amount"
              />
              <span className="pr-3 text-gray-400 text-lg">$</span>
            </div>

            {/* 🚀 Withdraw Button */}
            <button
              onClick={handleWithdraw}
              disabled={!wallet || amount <= 0 || amount > balance}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                amount <= 0 || amount > balance
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-90"
              }`}
            >
              Continue to Withdraw
            </button>
          </>
        )}
      </div>
    </div>
  );
}
