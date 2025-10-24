"use client";
import React from "react";

interface BalanceCardProps {
  balance?: number;
}

export default function BalanceCard({ balance = 0 }: BalanceCardProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-6">
      {/* USDT Balance */}
      <div className="flex-1 bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl shadow-lg p-6 text-center">
        <h3 className="text-2xl font-bold text-white">
          ${balance.toFixed(2)}
        </h3>
        <p className="text-sm text-gray-300 mt-2">USDT Balance</p>
      </div>

      {/* Today Income */}
      <div className="flex-1 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl shadow-lg p-6 text-center">
        <h3 className="text-2xl font-bold text-green-400">+0.00$</h3>
        <p className="text-sm text-gray-300 mt-2">Today Income</p>
      </div>
    </div>
  );
}
