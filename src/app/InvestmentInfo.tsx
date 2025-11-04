"use client";
import React from "react";

// ✅ Define props correctly
export interface InvestmentInfoProps {
  userEmail: string;
  todayIncome: number;
}

// ✅ Default export of component — correct structure
const InvestmentInfo: React.FC<InvestmentInfoProps> = ({
  userEmail,
  todayIncome,
}) => {
  return (
    <div className="bg-gray-800/60 rounded-2xl p-4 shadow-md text-white border border-gray-700">
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-300">Email: {userEmail || "N/A"}</p>
        <p className="text-lg font-semibold">
          Today&apos;s Income:{" "}
          <span className="text-green-400">${todayIncome?.toFixed(2) ?? "0.00"}</span>
        </p>
      </div>
    </div>
  );
};

// ✅ Make sure you export only the default (no named export)
export default InvestmentInfo;
