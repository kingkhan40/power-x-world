"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import BasicPlan from "@/components/BasicPlan";
import IconGridNavigation from "@/components/IconGridNavigation";
import InvestmentInfo from "@/components/InvestmentInfo";
import { useBalance } from "@/context/BalanceContext";

type DashboardData = {
  level?: number;
  totalTeam?: number;
  activeUsers?: number;
  wallet?: number;
  totalCommission?: number;
  rewardPayment?: number;
  otherPayments?: number;
};

export default function HomePage() {
  const router = useRouter();
  const { balance: contextBalance, setBalance: setContextBalance } = useBalance();

  const [user, setUser] = useState<{ name?: string; email?: string; wallet?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData>({});
  const [balance, setBalance] = useState<number>(0);
  const [totalCommission, setTotalCommission] = useState<number>(0);
  const [rewardPayment, setRewardPayment] = useState<number>(0);
  const [otherPayments, setOtherPayments] = useState<number>(0);
  const [stakingAmount, setStakingAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const targetDate = new Date("2025-11-01T00:00:00Z").getTime();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch user & dashboard data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const userWallet = localStorage.getItem("userWallet");
    const userId = localStorage.getItem("userId");

    if (!token) {
      router.replace("/login");
      return;
    }

    setUser({ name: userName || "User", email: userEmail || "", wallet: userWallet || "" });

    // Fetch dashboard info
    if (userId) {
      fetch(`/api/user/dashboard?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          setDashboard(data);
          const mainBalance = data.wallet ?? 0;
          setBalance(mainBalance);
          setContextBalance?.(mainBalance);
          setTotalCommission(data.totalCommission ?? 0);
          setRewardPayment(data.rewardPayment ?? 0);
          setOtherPayments(data.otherPayments ?? 0);
        })
        .catch(console.error);
    }

    setLoading(false);
  }, [router, setContextBalance]);

  // Stake functionality
  const handleStakeNow = async () => {
    if (stakingAmount < 5) {
      setMessage("Minimum staking amount is $5");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("User not found");
      return;
    }

    const res = await fetch("/api/stake/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount: stakingAmount }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to stake");
      return;
    }

    setMessage("✅ Stake created successfully!");
    setBalance(data.walletBalance);
    setContextBalance?.(data.walletBalance);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-lg animate-pulse">Checking session...</p>
      </div>
    );
  }

  const totalBalance =
    (balance ?? 0) +
    (totalCommission ?? 0) +
    (rewardPayment ?? 0) +
    (otherPayments ?? 0);

  return (
    <div
      className="min-h-screen relative text-white"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/21/e7/a7/21e7a74605dc7bc6b548b7ecb00cf900.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="container mx-auto px-3 lg:px-6 py-6 relative z-10 space-y-6">
        {/* Countdown */}
        <div className="bg-black/50 border border-white/20 rounded-xl p-6 text-center backdrop-blur-md shadow-lg flex flex-col items-center justify-center space-y-3 mb-6">
          <p className="text-2xl font-extrabold text-yellow-400 uppercase tracking-wide">
            Next Event
          </p>
          <p className="text-white font-mono text-2xl">
            {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
          </p>
          <p className="text-gray-300 text-sm">Coming Soon</p>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <BalanceCard balance={totalBalance} />
          <InvestmentInfo userEmail={user?.email ?? ""} />
          <IconGridNavigation />
          <BasicPlan />
        </div>

        {/* Staking Section */}
        <div className="mt-6 text-center">
          <input
            type="number"
            value={stakingAmount}
            onChange={(e) => setStakingAmount(parseFloat(e.target.value))}
            placeholder="Enter staking amount"
            className="p-2 rounded text-black"
          />
          <button
            onClick={handleStakeNow}
            className="ml-2 px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400"
          >
            Stake Now
          </button>
          {message && <p className="mt-2 text-sm text-yellow-300">{message}</p>}
        </div>
      </div>
    </div>
  );
}
