"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FaTimes,
  FaDollarSign,
  FaRocket,
  FaChartLine,
  FaCoins,
} from "react-icons/fa";
import Image from "next/image";

interface StakingPlan {
  id: number;
  name: string;
  min: string;
  max: string;
  profit: string;
  image: string;
  minAmount: number;
  maxAmount: number;
  minProfit: number;
  maxProfit: number;
  duration: string;
  features: string[];
}

interface StatData {
  id: number;
  value: string;
  label: string;
  icon: JSX.Element;
  gradient: string;
  textColor: string;
}

const Investment = () => {
  const [selectedPlan, setSelectedPlan] = useState<StakingPlan | null>(null);
  const [stakingAmount, setStakingAmount] = useState<string>("");
  const [showProfitRange, setShowProfitRange] = useState<boolean>(false);
  const router = useRouter();

  const stakingPlans: StakingPlan[] = [
    {
      id: 1,
      name: "Crypto Mining",
      min: "$5",
      max: "Unlimited",
      profit: "1.5% to 9% daily",
      image: "/coin (5).jpg", // Replace with actual path
      minAmount: 5,
      maxAmount: 10000000,
      minProfit: 1.5,
      maxProfit: 9,
      duration: "Flexible",
      features: [
        "Daily Profits",
        "Instant Withdrawal",
        "24/7 Support",
        "Secure Platform",
      ],
    },
  ];

  // Stats data stored in variable
  const statsData: StatData[] = [
    {
      id: 1,
      value: "1.5% - 9%",
      label: "Daily Returns",
      icon: <FaChartLine className="text-2xl text-green-400 mx-auto mb-3" />,
      gradient: "from-blue-500/20 to-purple-500/20",
      textColor: "text-blue-200",
    },
    {
      id: 2,
      value: "$5+",
      label: "Minimum Investment",
      icon: <FaCoins className="text-2xl text-yellow-400 mx-auto mb-3" />,
      gradient: "from-green-500/20 to-emerald-500/20",
      textColor: "text-green-200",
    },
  ];

  const handleStakeNow = (plan: StakingPlan) => {
    setSelectedPlan(plan);
    setStakingAmount("");
    setShowProfitRange(false);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setStakingAmount("");
    setShowProfitRange(false);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStakingAmount(value);

    if (value && !isNaN(parseFloat(value))) {
      setShowProfitRange(true);
    } else {
      setShowProfitRange(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const investmentData = {
      plan: selectedPlan.name,
      amount: parseFloat(stakingAmount),
      image: selectedPlan.image,
      minProfit: selectedPlan.minProfit,
      maxProfit: selectedPlan.maxProfit,
      date: new Date().toISOString(),
    };

    localStorage.setItem("investmentData", JSON.stringify(investmentData));
    router.push("/selfInvestment");
  };

  return (
    <>
      <div
        className="min-h-screen py-8 px-4 relative"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/c7/5e/da/c75edacc751eedacedcfaf435d833159.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="lg:text-4xl text-3xl mb-4">
              🚀
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                {" "}
                Crypto Staking
              </span>
            </h1>
            <p className="text-blue-100 lg:text-xl text-lg tracking-wider max-w-3xl mx-auto">
              Start Earning Daily Profits with Secure Crypto Staking
            </p>
          </div>

          {/* Staking Plan Card */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            {stakingPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-6 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl group"
              >
                {/* Rotating Border Animation */}
                <div
                  className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
                    animationDuration: "9000ms",
                    zIndex: 0,
                  }}
                ></div>
                <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>

                {/* Animated Gradient Circles Inside */}
                {/* Top Left - Blue & Green Mix */}
                <div
                  className="absolute -top-6 -left-6 w-20 h-20 rounded-full z-10"
                  style={{
                    background:
                      "linear-gradient(45deg, #3b82f6, #10b981, #3b82f6)",
                    filter: "blur(8px)",
                    opacity: "0.7",
                  }}
                ></div>

                {/* Bottom Right - Red & Indigo Mix */}
                <div
                  className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, #ef4444, #8b5cf6, #ef4444)",
                    filter: "blur(10px)",
                    opacity: "0.5",
                  }}
                ></div>

                {/* Top Right - All Colors Mix */}
                <div
                  className="absolute top-1/2 -right-8 w-16 h-16 rounded-full z-10"
                  style={{
                    background:
                      "linear-gradient(225deg, #3b82f6, #10b981, #ef4444, #8b5cf6)",
                    filter: "blur(8px)",
                    opacity: "0.4",
                  }}
                ></div>

                {/* Bottom Left - Another Mix */}
                <div
                  className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full z-10"
                  style={{
                    background:
                      "linear-gradient(315deg, #10b981, #8b5cf6, #3b82f6)",
                    filter: "blur(6px)",
                    opacity: "0.3",
                  }}
                ></div>

                {/* Center - Floating Circle */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full z-10"
                  style={{
                    background:
                      "linear-gradient(180deg, #7d9efb, #a83bf8, #ff6b6b)",
                    filter: "blur(12px)",
                    opacity: "0.2",
                    animation: "float 6s ease-in-out infinite",
                  }}
                ></div>

                {/* Content */}
                <div className="relative z-20">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Left Section - Plan Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          {/* Outer Rotating Border */}
                          <div
                            className="absolute -inset-1 rounded-full animate-spin opacity-90"
                            style={{
                              background:
                                "conic-gradient(from 45deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
                              animationDuration: "10000ms",
                              zIndex: 0,
                            }}
                          ></div>

                          {/* Image Container */}
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 bg-gray-800 backdrop-blur-sm z-20">
                            <Image
                              src={plan.image}
                              alt={plan.name}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-white mb-1">
                            {plan.name}
                          </h2>
                          <p className="text-blue-200 text-sm">
                            High-Yield Crypto Staking
                          </p>
                        </div>
                      </div>

                      {/* Investment Range */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
                          <div className="text-blue-200 text-sm mb-1">
                            Minimum
                          </div>
                          <div className="text-white text-xl font-bold">
                            {plan.min}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
                          <div className="text-green-200 text-sm mb-1">
                            Maximum
                          </div>
                          <div className="text-white text-xl font-bold">
                            {plan.max}
                          </div>
                        </div>
                      </div>

                      {/* Profit Info */}
                      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30 mb-4">
                        <div className="text-purple-200 text-sm mb-1">
                          Daily Profit
                        </div>
                        <div className="text-white text-xl font-bold">
                          {plan.profit}
                        </div>
                        <div className="text-purple-100 text-xs mt-1">
                          Based on market conditions & investment size
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        {plan.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs border border-white/20"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Section - Action Button */}
                    <div className="lg:w-48 w-full">
                      <button
                        onClick={() => handleStakeNow(plan)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 group"
                      >
                        <FaRocket className="group-hover:animate-bounce" />
                        Start Staking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Overview - Using map from variable */}
          <div className="grid grid-cols-2 gap-3">
            {statsData.map((stat) => (
              <div
                key={stat.id}
                className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-sm rounded-lg p-2 border border-white/30 text-center hover:transform hover:scale-105 transition-all duration-300`}
              >
                {stat.icon}
                <div className="text-white text-xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className={`${stat.textColor} text-sm`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {selectedPlan && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40"
            onClick={handleCloseModal}
          />

          {/* Modal */}
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-gray-900 to-gray-800 rounded-t-3xl animate-slide-up shadow-2xl z-50 max-h-[85vh] overflow-y-auto border-t border-white/20">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 py-8 px-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/30">
                    <Image
                      src={selectedPlan.image}
                      alt={selectedPlan.name}
                      width={80} // w-20 = 5rem = 80px
                      height={80} // h-20 = 5rem = 80px
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">
                      Stake in {selectedPlan.name}
                    </div>
                    <div className="text-blue-100 text-sm">
                      Enter your investment amount
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/10"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {/* Investment Range */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
                    <div className="text-blue-200 text-sm mb-1">Minimum</div>
                    <div className="text-white text-lg font-bold">
                      {selectedPlan.min}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
                    <div className="text-green-200 text-sm mb-1">Maximum</div>
                    <div className="text-white text-lg font-bold">
                      {selectedPlan.max}
                    </div>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="relative mb-6">
                  <div className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaDollarSign className="text-green-400" />
                    Enter Staking Amount In{" "}
                    <span className="text-red-400"> USDT*</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/20 rounded-xl text-white placeholder-gray-400 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter amount in USDT"
                      value={stakingAmount}
                      onChange={handleAmountChange}
                      min={selectedPlan.minAmount}
                      max={selectedPlan.maxAmount}
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300">
                      <FaDollarSign className="text-xl" />
                    </div>
                  </div>
                </div>

                {/* Profit Calculation */}
                {showProfitRange && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-5 border border-green-400/30 mb-6">
                    <div className="text-green-300 text-lg font-bold mb-3 text-center">
                      💰 Profit Projection
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-green-200 text-sm mb-1">
                          Minimum Daily
                        </div>
                        <div className="text-white text-xl font-bold">
                          $
                          {(
                            (parseFloat(stakingAmount) *
                              selectedPlan.minProfit) /
                            100
                          ).toFixed(2)}
                        </div>
                        <div className="text-green-300 text-xs">
                          ({selectedPlan.minProfit}%)
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-200 text-sm mb-1">
                          Maximum Daily
                        </div>
                        <div className="text-white text-xl font-bold">
                          $
                          {(
                            (parseFloat(stakingAmount) *
                              selectedPlan.maxProfit) /
                            100
                          ).toFixed(2)}
                        </div>
                        <div className="text-green-300 text-xs">
                          ({selectedPlan.maxProfit}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
                >
                  <FaRocket className="animate-pulse" />
                  Confirm & Start Staking
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Investment;
