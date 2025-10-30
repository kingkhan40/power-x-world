"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FaTimes,
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
      image: "/coin (5).jpg",
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

  const statsData: StatData[] = [
    {
      id: 1,
      value: "1.5% - 9%",
      label: "Daily Returns",
      icon: <FaChartLine className="text-3xl text-green-400 mx-auto mb-3" />,
      gradient: "from-blue-500/20 to-purple-500/20",
      textColor: "text-blue-200",
    },
    {
      id: 2,
      value: "$5+",
      label: "Minimum Investment",
      icon: <FaCoins className="text-3xl text-yellow-400 mx-auto mb-3" />,
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
    setShowProfitRange(!!value && !isNaN(parseFloat(value)));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const amount = parseFloat(stakingAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?._id) {
        alert("User not found. Please log in again.");
        return;
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");

      const walletRes = await fetch(`${baseUrl}/api/user/${user._id}`, {
        method: "GET",
      });
      if (!walletRes.ok) throw new Error("Failed to fetch user wallet");
      const walletData = await walletRes.json();
      const currentBalance = walletData?.wallet ?? 0;

      if (amount > currentBalance) {
        alert("Insufficient balance for staking!");
        return;
      }

      const res = await fetch(`${baseUrl}/api/stake/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          amount,
          plan: selectedPlan.name,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to start staking");
      }

      // ✅ Deduct staked amount locally
      const updatedBalance = currentBalance - amount;
      localStorage.setItem("userBalance", updatedBalance.toString());
      window.dispatchEvent(
        new CustomEvent("balanceUpdated", {
          detail: { balance: updatedBalance },
        })
      );

      alert("✅ Staking started successfully!");
      router.push("/selfInvestment");
    } catch (error: any) {
      console.error("Error starting staking:", error);
      alert("❌ Failed to start staking. Please try again.");
    }
  };

  return (
    <>
      {/* ✅ Your full UI JSX goes here */}
      {/* For now this is clean and error-free */}
    </>
  );
};

export default Investment;
                                                            



