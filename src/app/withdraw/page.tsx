"use client";

import React, { useState } from "react";
import { useBalance } from "@/context/BalanceContext"; // ✅ Balance Context import
import { FaCoins, FaDollarSign } from "react-icons/fa";
import { FaUnlockKeyhole } from "react-icons/fa6";

function WithdrawPage() {
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
    <div
      className="min-h-screen py-8 px-4 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/d0/e3/f1/d0e3f13661d856add08f293b86bf25d0.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Light overlay instead of dark */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Header Section - Like ContactUs */}
        <div className="text-center mb-8">
          <h1 className="lg:text-4xl text-3xl mb-4">
            💸
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              {" "}
              Withdraw Funds
            </span>
          </h1>
          <p className="text-blue-100 lg:text-xl text-lg tracking-wider max-w-3xl mx-auto">
            Secure and instant withdrawal process with real-time processing
          </p>
        </div>
        <div className="lg:p-5 p-1 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
            style={{
              background:
                "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
              animationDuration: "9000ms",
              zIndex: 0,
            }}
          ></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-1"></div>

          <div
            className="absolute -top-12 -left-12 w-24 h-24 rounded-full z-10 animate-spin"
            style={{
              background: "linear-gradient(45deg, #7d9efb, #a83bf8)",
              animationDuration: "9000ms",
              filter: "blur(12px)",
              opacity: "0.6",
            }}
          ></div>

          <div
            className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full z-10 animate-spin"
            style={{
              background: "linear-gradient(135deg, #a83bf8, #7d9efb)",
              animationDuration: "4000ms",
              filter: "blur(10px)",
              opacity: "0.4",
            }}
          ></div>

          <div
            className="absolute top-1/2 -right-8 w-16 h-16 rounded-full z-10 animate-spin"
            style={{
              background: "linear-gradient(225deg, #7d9efb, #a83bf8)",
              animationDuration: "5000ms",
              filter: "blur(8px)",
              opacity: "0.3",
            }}
          ></div>

          {/* Content */}
          <div className="relative z-0">
            <div className=" backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900/90 via-blue-900/90 to-purple-900/90 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                <div className="relative">
                  <h2 className="lg:text-2xl text-xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Secure Withdrawal Process
                  </h2>
                </div>
              </div>
              <div className="lg:p-8 p-6">
                {/* ✅ Wallet Address Input */}
                <div className=" mb-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
                    <FaUnlockKeyhole className="text-blue-300" />
                    Enter Wallet Address
                  </h3>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter your wallet address"
                    className="w-full p-3 bg-transparent border border-white/30 rounded-md text-white placeholder-blue-200 pr-12 outline-none transition-all duration-300 backdrop-blur-sm text-lg"
                  />
                </div>

                {/* ✅ Live Balance Display */}
                <div className="  rounded-2xl p-6 mb-6 border border-white/30">
                  <p className="text-blue-100 text-sm tracking-wider mb-2">
                    Available Balance
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="lg:text-3xl text-2xl font-bold text-white">
                      {" "}
                      ${balance ? balance.toFixed(2) : "0.00"}$
                    </p>
                    <FaCoins className="text-3xl text-yellow-400" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-white text-lg  font-semibold mb-4 flex  items-center gap-2">
                    <FaDollarSign className="text-green-400" />
                    Enter Withdrawal Amount
                    <span className="text-red-300 ml-1">*</span>
                  </label>

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full p-3 bg-transparent border border-white/30 rounded-md text-white placeholder-blue-200 pr-12 outline-none transition-all duration-300 backdrop-blur-sm text-lg"
                    placeholder="Enter withdrawal amount"
                  />
                </div>

                {/* ✅ Withdraw Button */}
                <button
                  onClick={handleWithdraw}
                  disabled={!walletAddress || !amount || Number(amount) <= 0}
                  className={`w-full p-2 rounded-md font-semibold transition-all duration-200 ${
                    !walletAddress || !amount || Number(amount) <= 0
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-green-700"
                  }`}
                >
                  Continue to Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawPage;
