"use client";
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaGift,
  FaGem,
  FaAward,
  FaMobile,
  FaCar,                                                                                          
  FaMotorcycle,
  FaHome,
  FaLock,
  FaCheck,
  FaLaptop,
  FaRocket,
} from "react-icons/fa";
import Image from "next/image";
import { useBalance } from "@/context/BalanceContext";
import { RewardPlan, StatData } from "types"; // Adjust path as needed
import { parseRewardAmount } from "utils/parseRewardAmount"; // Adjust path as needed

export default function RewardPage() {
  const { usdtBalance, addToBalance, claimedRewards, addClaimedReward } = useBalance();
  const [selectedReward, setSelectedReward] = useState<RewardPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(""); // From original RewardPage
  const [rewardPlans, setRewardPlans] = useState<RewardPlan[]>([
    {
      id: 1,
      name: "Laptop",
      selfBusiness: "500",
      directBusiness: "7,000",
      rewardAmount: "200$",
      color: "from-blue-500 to-indigo-500",
      icon: <FaLaptop className="text-3xl text-white" />,
      image: "https://i.pinimg.com/1200x/96/dd/c8/96ddc807d329e89f14616245ea7c2e52.jpg",
      achieved: true,
    },
    {
      id: 2,
      name: "iPhone 17 Pro Max",
      selfBusiness: "1,000",
      directBusiness: "10,000",
      rewardAmount: "400$",
      color: "from-purple-500 to-pink-500",
      icon: <FaMobile className="text-3xl text-white" />,
      image: "https://i.pinimg.com/736x/eb/8d/d2/eb8dd224fe917f6c331c25a7968f5107.jpg",
      achieved: false,
    },
    {
      id: 3,
      name: "Motorcycle",
      selfBusiness: "2,000",
      directBusiness: "20,000",
      rewardAmount: "500$",
      color: "from-green-500 to-emerald-500",
      icon: <FaMotorcycle className="text-3xl text-white" />,
      image: "https://i.pinimg.com/1200x/f1/e7/ec/f1e7ec2a68eeaef27976438a19a93cca.jpg",
      achieved: false,
    },
    {
      id: 4,
      name: "Nissan Car",
      selfBusiness: "5,000",
      directBusiness: "30,000",
      rewardAmount: "2,000$",
      color: "from-red-500 to-orange-500",
      icon: <FaCar className="text-3xl text-white" />,
      image: "https://i.pinimg.com/736x/ee/7e/63/ee7e63cb5796dea3620360475b753722.jpg",
      achieved: false,
    },
    {
      id: 5,
      name: "Toyota Fortuner",
      selfBusiness: "7,000",
      directBusiness: "50,000",
      rewardAmount: "N/A",
      color: "from-cyan-500 to-blue-500",
      icon: <FaCar className="text-3xl text-white" />,
      image: "https://i.pinimg.com/736x/4d/63/e7/4d63e788bf1f48e8ad5b03419c47859b.jpg",
      achieved: false,
    },
    {
      id: 6,
      name: "Honda Civic",
      selfBusiness: "7,000",
      directBusiness: "60,000",
      rewardAmount: "N/A",
      color: "from-cyan-500 to-blue-500",
      icon: <FaCar className="text-3xl text-white" />,
      image: "https://i.pinimg.com/736x/28/85/92/288592f5e8d2abb19606f74b611d129b.jpg",
      achieved: false,
    },
    {
      id: 7,
      name: "Dream House",
      selfBusiness: "8,000",
      directBusiness: "100,000",
      rewardAmount: "N/A",
      color: "from-rose-500 to-red-500",
      icon: <FaHome className="text-3xl text-white" />,
      image: "https://i.pinimg.com/736x/82/d1/d9/82d1d911e17c46ea377e5f0573a5105e.jpg",
      achieved: false,
    },
  ]);

  const unlockNextReward = (currentRewardId: number) => {
    const currentIndex = rewardPlans.findIndex(
      (plan) => plan.id === currentRewardId
    );
    const nextIndex = currentIndex + 1;
    if (nextIndex < rewardPlans.length) {
      const nextReward = rewardPlans[nextIndex];
      const userSelfBusiness = 1000; // Replace with actual data (e.g., API or state)
      const userDirectBusiness = 15000; // Replace with actual data
      const selfBusinessMet =
        parseFloat(userSelfBusiness.toString()) >=
        parseFloat(nextReward.selfBusiness.replace(",", ""));
      const directBusinessMet =
        parseFloat(userDirectBusiness.toString()) >=
        parseFloat(nextReward.directBusiness.replace(",", ""));
      if (selfBusinessMet && directBusinessMet) {
        setRewardPlans((prev) =>
          prev.map((plan, index) =>
            index === nextIndex ? { ...plan, achieved: true } : plan
          )
        );
      }
    }
  };

  const handleClaimNow = (plan: RewardPlan) => {
    if (!plan.achieved || claimedRewards.includes(plan.id)) {
      return;
    }
    setSelectedReward(plan);
    setIsProcessing(false);
    setIsSuccess(false);
    setShowConfetti(false);
  };

  const handleCloseModal = () => {
    setSelectedReward(null);
    setIsProcessing(false);
    setIsSuccess(false);
    setShowConfetti(false);
    setMessage(""); // Reset message from original RewardPage
  };

  const handleClaimRewards = async () => {
    if (!selectedReward || claimedRewards.includes(selectedReward.id)) {
      return;
    }
    setIsProcessing(true);
    setShowConfetti(true);

    try {
      // Integrate API call from original RewardPage
      const res = await fetch("/api/user/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "YOUR_USER_ID_HERE", rewardId: selectedReward.id }), // Add rewardId
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);

          const amount = parseRewardAmount(selectedReward.rewardAmount);
          if (amount > 0) {
            addToBalance(amount);
          }
          addClaimedReward(selectedReward.id);
          unlockNextReward(selectedReward.id);

          setTimeout(() => {
            handleCloseModal();
          }, 5000);
        }, 5000);
      } else {
        setIsProcessing(false);
        setShowConfetti(false);
        setMessage(data.message || "Failed to claim reward");
      }
    } catch (error) {
      setIsProcessing(false);
      setShowConfetti(false);
      setMessage("An error occurred while claiming the reward");
    }
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const statsData: StatData[] = [
    {
      id: 1,
      value: "50% - 500%",
      label: "Bonus Rewards",
      icon: <FaGift className="text-3xl text-pink-400 mx-auto mb-3" />,
      gradient: "from-purple-500/20 to-pink-500/20",
      textColor: "text-purple-200",
    },
    {
      id: 2,
      value: "2,000+",
      label: "Minimum Points",
      icon: <FaAward className="text-3xl text-yellow-400 mx-auto mb-3" />,
      gradient: "from-yellow-500/20 to-orange-500/20",
      textColor: "text-yellow-200",
    },
    {
      id: 3,
      value: `${rewardPlans.filter((plan) => plan.achieved).length}/7`,
      label: "Achieved Rewards",
      icon: <FaCheck className="text-3xl text-green-400 mx-auto mb-3" />,
      gradient: "from-green-500/20 to-emerald-500/20",
      textColor: "text-green-200",
    },
    {
      id: 4,
      value: "VIP",
      label: "Premium Benefits",
      icon: <FaGem className="text-3xl text-blue-400 mx-auto mb-3" />,
      gradient: "from-blue-500/20 to-cyan-500/20",
      textColor: "text-blue-200",
    },
  ];

  return (
    <div
      className="min-h-screen py-4 px-4 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/96/da/00/96da00cc311619d2d3c9595f618d3ec9.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Animated Gradient Circles */}
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full z-10"
        style={{
          background: "linear-gradient(45deg, #a855f7, #ec4899, #a855f7)",
          filter: "blur(80px)",
          opacity: "0.4",
        }}
      ></div>
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full z-10"
        style={{
          background: "linear-gradient(135deg, #f59e0b, #10b981, #f59e0b)",
          filter: "blur(70px)",
          opacity: "0.3",
        }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full z-10"
        style={{
          background: "linear-gradient(225deg, #3b82f6, #ec4899, #3b82f6)",
          filter: "blur(90px)",
          opacity: "0.35",
        }}
      ></div>

      <div className="container mx-auto max-w-7xl relative z-20">
        {/* Header Section */}
        <div className="text-start lg:text-center mb-4">
          <h1 className="lg:text-4xl text-xl mb-3">
            🎁{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
              Premium Rewards Collection
            </span>
          </h1>
          <p className="text-purple-100 lg:text-xl text-sm tracking-wide max-w-3xl mx-auto">
            Claim Exclusive Bonuses, Luxury Items, and VIP Benefits. Turn Your
            Points into Dream Rewards!
          </p>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {rewardPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl group transition-all duration-500 ${
                plan.achieved
                  ? "hover:transform hover:scale-105 cursor-pointer"
                  : "opacity-80 cursor-not-allowed"
              }`}
            >
              <div
                className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
                style={{
                  background:
                    "conic-gradient(from 0deg, #a855f7, #ec4899, #f59e0b, #10b981, #3b82f6, #a855f7)",
                  animationDuration: "10000ms",
                  zIndex: 0,
                }}
              ></div>
              <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>

              {!plan.achieved && (
                <div className="absolute inset-0 top-96 bg-black/10 backdrop-blur-sm rounded-2xl z-30 flex items-center justify-center">
                  <div className="text-center">
                    <FaLock className="text-4xl text-yellow-400 mx-auto mb-2" />
                    <div className="text-white font-bold text-lg">Locked</div>
                    <div className="text-yellow-200 text-sm">
                      Complete requirements to unlock
                    </div>
                  </div>
                </div>
              )}

              <div className="relative z-20">
                <div className="w-full h-48 mb-4 rounded-xl overflow-hidden border border-white/20 relative">
                  <Image
                    src={plan.image}
                    alt={plan.name}
                    width={400}
                    height={192}
                    className={`w-full h-full object-fill transition-transform duration-500 ${
                      plan.achieved ? "group-hover:scale-110" : "grayscale"
                    }`}
                  />
                  {plan.achieved && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <FaCheck className="text-xs" />
                      Achieved
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      plan.color
                    } flex items-center justify-center shadow-lg ${
                      !plan.achieved ? "grayscale" : ""
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-xl ${
                        plan.achieved ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {plan.name}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-3 border border-purple-400/30">
                    <div className="text-purple-200 text-xs mb-1">
                      Self Business
                    </div>
                    <div
                      className={`font-bold ${
                        plan.achieved ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {plan.selfBusiness}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm rounded-lg p-3 border border-pink-400/30">
                    <div className="text-pink-200 text-xs mb-1">
                      Direct Business
                    </div>
                    <div
                      className={`font-bold ${
                        plan.achieved ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {plan.directBusiness}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleClaimNow(plan)}
                  disabled={!plan.achieved || claimedRewards.includes(plan.id)}
                  className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-2xl flex items-center justify-center gap-2 ${
                    plan.achieved && !claimedRewards.includes(plan.id)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white transform hover:scale-105 cursor-pointer"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {plan.achieved && !claimedRewards.includes(plan.id) ? (
                    <>
                      <FaGift className="group-hover:animate-bounce" />
                      Claim Now
                    </>
                  ) : (
                    <>
                      <FaLock />
                      {claimedRewards.includes(plan.id) ? "Claimed" : "Locked"}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-lg rounded-2xl lg:p-6 p-4 border border-white/30 text-center hover:transform hover:scale-105 transition-all duration-300`}
            >
              {stat.icon}
              <div className="text-white lg:text-2xl text-lg font-bold mb-1">
                {stat.value}
              </div>
              <div className={`${stat.textColor} text-xs lg:text-sm`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Display API message */}
        {message && (
          <p className="text-center text-white mt-4 bg-gray-800 p-4 rounded-lg">
            {message}
          </p>
        )}
      </div>

      {selectedReward && selectedReward.achieved && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40"
            onClick={handleCloseModal}
          />
          {showConfetti && (
            <div className="fixed inset-0 z-45 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                    borderRadius: "50%",
                  }}
                />
              ))}
            </div>
          )}
          <div className="fixed inset-0 flex items-center justify-center lg:p-4 p-2 z-50">
            <div className="w-full max-w-lg bg-gray-900 rounded-2xl border border-white/20 shadow-2xl max-h-[90vh] animate-slide-up">
              <div className="absolute -inset-0 rounded-2xl overflow-hidden">
                <div
                  className="w-full h-full animate-spin opacity-70"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #a855f7, #ec4899, #f59e0b, #10b981, #3b82f6, #a855f7)",
                    animationDuration: "10000ms",
                  }}
                ></div>
              </div>
              <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>
              <div className="relative z-20 m-1">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 py-6 px-6 w-full rounded-t-2xl relative z-20">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30">
                        <Image
                          src={selectedReward.image}
                          alt={selectedReward.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">
                          Claim {selectedReward.name}
                        </div>
                        <div className="text-purple-100 text-sm">
                          Congratulations! You have achieved this reward
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="text-white hover:text-gray-200 transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/10"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                </div>
                <div className="p-6 relative z-20">
                  {isSuccess && (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-5 border border-green-400/30 mb-6 text-center">
                      <FaCheck className="text-4xl text-green-400 mx-auto mb-3 animate-bounce" />
                      <div className="text-green-200 text-xl font-bold mb-2">
                        🎉 Reward Claimed Successfully!
                      </div>
                      <div className="text-green-100 text-sm">
                        Your {selectedReward.name} reward has been processed
                      </div>
                    </div>
                  )}
                  {!isSuccess && (
                    <div className="relative mb-6">
                      <div className="absolute -inset-0.5 rounded-2xl overflow-hidden">
                        <div
                          className="w-full h-full animate-spin opacity-60"
                          style={{
                            background:
                              "conic-gradient(from 0deg, #f59e0b, #10b981, #3b82f6, #a855f7, #ec4899, #f59e0b)",
                            animationDuration: "8000ms",
                          }}
                        ></div>
                      </div>
                      <div className="relative bg-gray-900 rounded-xl overflow-hidden p-5 border border-yellow-400/30 text-center z-10">
                        <div className="text-yellow-300 text-lg font-bold mb-2">
                          🎉 Reward Amount
                        </div>
                        <div className="text-white text-3xl font-bold">
                          {selectedReward.rewardAmount}
                        </div>
                        <div className="text-yellow-200 text-sm mt-2">
                          Available for immediate claim
                        </div>
                      </div>
                    </div>
                  )}
                  {isProcessing && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-5 border border-purple-400/30 mb-6 text-center">
                      <FaRocket className="text-4xl text-purple-400 mx-auto mb-3 animate-bounce" />
                      <div className="text-purple-200 font-semibold text-lg">
                        Processing Your Claim...
                      </div>
                      <div className="text-purple-100 text-sm mt-2">
                        Please wait while we process your reward
                      </div>
                    </div>
                  )}
                  {!isSuccess && !isProcessing && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="relative">
                        <div className="absolute -inset-0.5 rounded-xl overflow-hidden">
                          <div
                            className="w-full h-full animate-spin opacity-40"
                            style={{
                              background:
                                "conic-gradient(from 0deg, #a855f7, #ec4899, #a855f7)",
                              animationDuration: "6000ms",
                            }}
                          ></div>
                        </div>
                        <div className="relative bg-gray-900 rounded-xl p-4 border border-purple-400/30 z-10">
                          <div className="text-purple-200 text-sm mb-1">
                            Self Business
                          </div>
                          <div className="text-white text-lg font-bold">
                            {selectedReward.selfBusiness}
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -inset-0.5 rounded-xl overflow-hidden">
                          <div
                            className="w-full h-full animate-spin opacity-40"
                            style={{
                              background:
                                "conic-gradient(from 0deg, #ec4899, #f59e0b, #ec4899)",
                              animationDuration: "6000ms",
                            }}
                          ></div>
                        </div>
                        <div className="relative bg-gray-900 rounded-xl p-4 border border-pink-400/30 z-10">
                          <div className="text-pink-200 text-sm mb-1">
                            Direct Business
                          </div>
                          <div className="text-white text-lg font-bold">
                            {selectedReward.directBusiness}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!isSuccess && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleClaimRewards}
                        disabled={isProcessing || claimedRewards.includes(selectedReward.id)}
                        className="flex-1 bg-gradient-to-r from-yellow-900 to-orange-700 hover:from-yellow-800 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 px-6 cursor-pointer rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-2xl flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing Claim...
                          </>
                        ) : claimedRewards.includes(selectedReward.id) ? (
                          <>Already Claimed</>
                        ) : (
                          <>Confirm & Claim Reward</>
                        )}
                      </button>
                      <button
                        onClick={handleCloseModal}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-gray-600 cursor-pointer to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 border border-gray-500/50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}