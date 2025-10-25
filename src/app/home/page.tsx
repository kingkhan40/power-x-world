"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import BasicPlan from "@/components/BasicPlan";
import IconGridNavigation from "@/components/IconGridNavigation";
import InvestmentInfo from "@/components/InvestmentInfo";
import socket from "@/lib/socket";

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
  const [user, setUser] = useState<{ name?: string; email?: string; wallet?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData>({});
  const [balance, setBalance] = useState<number>(0); // wallet balance
  const [totalCommission, setTotalCommission] = useState<number>(0);
  const [rewardPayment, setRewardPayment] = useState<number>(0);
  const [otherPayments, setOtherPayments] = useState<number>(0);
  const [usdtBalance, setUsdtBalance] = useState<number>(0); // 🔹 new state for live USDT balance

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

    // 🔗 Fetch referral link
    if (userEmail) {
      fetch(`/api/user/${userEmail}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.referralLink) {
            setReferralLink(data.referralLink);
            localStorage.setItem("referralLink", data.referralLink);
          } else {
            const localReferral = localStorage.getItem("referralLink");
            if (localReferral) setReferralLink(localReferral);
          }
        })
        .catch(() => {
          const localReferral = localStorage.getItem("referralLink");
          if (localReferral) setReferralLink(localReferral);
        });
    }

    // 📊 Fetch dashboard data
    if (userId) {
      fetch(`/api/user/dashboard?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setDashboard(data);
          setBalance(data.wallet ?? 0);
          setTotalCommission(data.totalCommission ?? 0);
          setRewardPayment(data.rewardPayment ?? 0);
          setOtherPayments(data.otherPayments ?? 0);
        })
        .catch(console.error);

      // 🔹 Fetch live USDT balance
      fetch(`/api/user/${userId}`)
        .then((res) => res.json())
        .then((userData) => {
          if (userData && userData.usdtBalance !== undefined) {
            setUsdtBalance(userData.usdtBalance);
          }
        })
        .catch(console.error);
    }

    setLoading(false);

    // ⚡ Setup socket listeners for live updates
    if (socket && userWallet) {
      socket.on(`deposit_${userWallet}`, (data: any) => setBalance(Number(data.newBalance)));
      socket.on(`withdraw_${userWallet}`, (data: any) => setBalance(Number(data.newBalance)));
      socket.on(`commission_${userWallet}`, (data: any) =>
        setTotalCommission(Number(data.totalCommission))
      );
      socket.on(`reward_${userWallet}`, (data: any) =>
        setRewardPayment(Number(data.rewardPayment))
      );
      socket.on(`otherpayment_${userWallet}`, (data: any) =>
        setOtherPayments(Number(data.otherPayments))
      );
    }

    // 🧹 Cleanup listeners
    return () => {
      if (socket && userWallet) {
        socket.off(`deposit_${userWallet}`);
        socket.off(`withdraw_${userWallet}`);
        socket.off(`commission_${userWallet}`);
        socket.off(`reward_${userWallet}`);
        socket.off(`otherpayment_${userWallet}`);
      }
    };
  }, [router]);

  // 🚪 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("referralLink");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userWallet");
    router.replace("/login");
  };

  // 🕒 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-lg animate-pulse">Checking session...</p>
      </div>
    );
  }

  // 💰 Total combined balance (wallet + commission + rewards + others + USDT)
  const totalBalance =
    (balance ?? 0) +
    (totalCommission ?? 0) +
    (rewardPayment ?? 0) +
    (otherPayments ?? 0) +
    (usdtBalance ?? 0);

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

      <div className="relative z-50">
        {/* Add header / sidebar here if needed */}
      </div>

      <div className="container mx-auto px-3 lg:px-6 py-6 relative z-10 space-y-6">
        {/* 💵 USDT Balance Card */}
        <BalanceCard balance={totalBalance} />

        {/* 📈 Investment info */}
        <InvestmentInfo userEmail={user?.email ?? ""} />

        {/* 🧭 Navigation grid */}
        <IconGridNavigation />

        {/* 📊 Basic Plan */}
        <BasicPlan />

        {/* 🚪 Logout button */}
        <button
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}