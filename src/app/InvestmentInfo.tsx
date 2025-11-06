"use client";
import React from "react";

// ✅ Props me sirf userEmail rakha
export interface InvestmentInfoProps {
  userEmail: string;
}

// ✅ Clean component without todayIncome
const InvestmentInfo: React.FC<InvestmentInfoProps> = ({ userEmail }) => {
  return (
    <div className="bg-gray-800/60 rounded-2xl p-4 shadow-md text-white border border-gray-700">
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-300">
          Email: {userEmail || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default InvestmentInfo;
