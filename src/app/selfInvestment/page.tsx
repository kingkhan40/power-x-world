"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaRocket,
  FaChartLine,
  FaCoins,
  FaCheckCircle,
  FaHistory,
} from "react-icons/fa";

interface InvestmentData {
  plan: string;
  amount: number;
  minProfit: number;
  maxProfit: number;
  date: string;
}

const SelfInvestment = () => {
  const [earnedAmount, setEarnedAmount] = useState<number>(0);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [investmentData, setInvestmentData] = useState<InvestmentData | null>(null);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const router = useRouter();

  // ✅ Fetch user's active stake and rewards
  useEffect(() => {
    const fetchStakeData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await fetch(`/api/stake/user?userId=${userId}`);
        const data = await res.json();

        if (res.ok && data.stakes?.length > 0) {
          const activeStake = data.stakes.find((s: any) => s.status === "active");
          const stakeAmount = activeStake?.amount || 0;
          const earned = activeStake?.totalReward || 0;

          setEarnedAmount(earned); // current earned from active stake
          setTotalEarned(data.totalRewards || earned); // all-time earned
          setMaxAmount(stakeAmount * 3); // 3x max limit

          // ✅ calculate progress bar width
          const progress = Math.min((earned / (stakeAmount * 3)) * 100, 100);
          setCurrentProgress(progress);
        }
      } catch (err) {
        console.error("Error fetching stake info:", err);
      }
    };

    fetchStakeData();
  }, []);

  // ✅ Local investment tracking (for new investments)
  useEffect(() => {
    const data = localStorage.getItem("investmentData");
    if (data && maxAmount > 0) {
      const parsedData: InvestmentData = JSON.parse(data);
      setInvestmentData(parsedData);

      const newProgress = Math.min(
        (earnedAmount / maxAmount) * 100,
        100
      );
      setCurrentProgress(newProgress);
    }
  }, [maxAmount, earnedAmount]);

  const handleNewInvestment = () => {
    router.push("/investment");
  };

  return (
    <div
      className="min-h-screen py-8 px-4 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/8e/cc/cc/8ecccc69ca64a12bb193fb385b97367a.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="lg:text-4xl text-2xl mb-3">
            💰{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Investment Dashboard
            </span>
          </h1>
          <p className="text-blue-100 text-lg">
            Track Your Crypto Investment Progress
          </p>
        </div>

        {/* ✅ Main Investment Card */}
        <div className="lg:p-5 p-4 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl group mb-6">
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-50 z-0"
            style={{
              background:
                "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
              animationDuration: "9000ms",
            }}
          ></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-20"></div>

          <div className="relative z-30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="lg:text-2xl text-lg font-bold text-white flex items-center gap-2">
                <FaChartLine className="text-green-400" size={20} />
                Investment Bar 3X To 9X
              </h2>
              <div className="px-3 py-1 rounded-full text-sm font-bold bg-green-500/20 text-green-300 border border-green-400/30">
                Active
              </div>
            </div>

            {/* ✅ Progress Bar */}
            <div className="relative mb-6">
              <div className="relative w-full bg-gray-700 rounded-full h-6 overflow-hidden border border-white/20">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 relative"
                  style={{ width: `${currentProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-white">
                  {currentProgress.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm text-blue-200 mt-2">
                <span>Start: {earnedAmount > 0 ? "Active" : "0%"}</span>
                <span>Target: 100%</span>
              </div>
            </div>

            {/* ✅ Earnings Display */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
                <div className="text-blue-200 text-sm mb-1">Earned Amount</div>
                <div className="text-white text-xl font-bold">
                  ${earnedAmount.toFixed(2)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
                <div className="text-green-200 text-sm mb-1">Maximum Limit</div>
                <div className="text-white text-xl font-bold">
                  ${maxAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Buttons Section */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            onClick={handleNewInvestment}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-bold transition-all"
          >
            <FaRocket />
            Start New Investment
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-bold transition-all">
            <FaHistory />
            View Investment History
          </button>
        </div>

     
      </div>
    </div>
  );
};

export default SelfInvestment;
