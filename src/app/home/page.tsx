"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import BasicPlan from "@/components/BasicPlan";
import IconGridNavigation from "@/components/IconGridNavigation";
import InvestmentInfo from "@/components/InvestmentInfo";

type DashboardData = {
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
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData>({});
  const [balance, setBalance] = useState<number>(0);
  const [totalCommission, setTotalCommission] = useState<number>(0);
  const [rewardPayment, setRewardPayment] = useState<number>(0);
  const [otherPayments, setOtherPayments] = useState<number>(0);

  // Countdown timer (optional)
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

    // ✅ Fetch referral link
    if (userEmail) {
      fetch(`/api/user/${userEmail}`)
        .then(res => res.json())
        .then(data => {
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

    // ✅ Fetch dashboard info
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("referralLink");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userWallet");
    router.replace("/login");
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
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="container mx-auto px-3 lg:px-6 py-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            Welcome {user?.name ?? "User"} 👋
          </h1>

          {/* ✅ Display Referral Link */}
          {referralLink && (
            <p className="text-sm mt-2 text-gray-300">
              Your referral link:{" "}
              <span className="text-blue-400 break-all">{referralLink}</span>
            </p>
          )}

          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 hover:bg-red-600 transition-all px-5 py-2 rounded-md text-white font-medium"
          >
            Logout
          </button>
        </div>

        {/* Countdown Section */}
        <div className="bg-black/50 border border-white/20 rounded-xl p-6 text-center backdrop-blur-md shadow-lg flex flex-col items-center justify-center space-y-3 mb-6">
          <p className="text-2xl font-extrabold text-yellow-400 uppercase tracking-wide">Next Event</p>
          <p className="text-white font-mono text-2xl">
            {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
          </p>
          <p className="text-gray-300 text-sm">Coming Soon</p>
        </div>

        {/* Main Content Section */}
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
