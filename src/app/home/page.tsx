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
        {/* Main Content */}
        <div className="space-y-4">
          <BalanceCard balance={totalBalance} />
          <InvestmentInfo userEmail={user?.email ?? ""} />
          <IconGridNavigation />
          <BasicPlan />
        </div>
      </div>
    </div>
  );
}
