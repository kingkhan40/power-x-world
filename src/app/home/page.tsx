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

type User = {
  name?: string;
  email?: string;
  wallet?: string;
};

export default function HomePage() {
  const router = useRouter();
  const { setBalance: setContextBalance } = useBalance();

  // ---------- State ----------
  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData>({});
  const [balance, setBalance] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [rewardPayment, setRewardPayment] = useState(0);
  const [otherPayments, setOtherPayments] = useState(0);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const targetDate = new Date("2025-11-01T00:00:00Z").getTime();

  // ---------- Countdown ----------
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // ---------- Auth + Data ----------
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

    // Set user info
    setUser({
      name: userName ?? "User",
      email: userEmail ?? "",
      wallet: userWallet ?? "",
    });

    // ----- Referral handling -----
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");

    if (ref) {
      // Store referral code (you already have a setter somewhere)
      // setReferralCode(ref); // <-- uncomment if you have this state

      fetch(`/api/referrer?ref=${ref}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.referrer?.name) {
            setReferrerName(data.referrer.name);
          }
        })
        .catch((err) =>
          console.error("Error fetching referrer:", err)
        );
    }

    // ----- Dashboard data -----
    if (userId) {
      fetch(`/api/user/dashboard?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setDashboard(data);

          const mainBalance = data.wallet ?? 0;
          setBalance(mainBalance);
          setContextBalance?.(mainBalance);

          setTotalCommission(data.totalCommission ?? 0);
          setRewardPayment(data.rewardPayment ?? 0);
          setOtherPayments(data.otherPayments ?? 0);
        })
        .catch((err) => console.error("Dashboard fetch error:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [router, setContextBalance]);

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-lg animate-pulse">Checking session...</p>
      </div>
    );
  }

  // ---------- Calculations ----------
  const totalBalance =
    balance +
    totalCommission +
    rewardPayment +
    otherPayments;

  // ---------- Render ----------
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
      <div className="absolute inset-0 bg-black/70" />

      <div className="container mx-auto px-3 lg:px-6 py-6 relative z-10 space-y-6">
        {/* Launch Countdown */}
        <div className="bg-black/50 border border-white/20 rounded-xl p-6 text-center backdrop-blur-md shadow-lg space-y-3">
          <p className="text-2xl font-extrabold text-yellow-400 uppercase tracking-wide">
            Platform Launch
          </p>
          <p className="text-xl font-bold text-white">
            {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m :{" "}
            {timeLeft.seconds}s
          </p>
          <p className="text-gray-300 text-sm">Coming Soon</p>

          {/* Optional referrer name */}
          {referrerName && (
            <p className="text-green-400 text-sm">
              Referred by <strong>{referrerName}</strong>
            </p>
          )}
        </div>

        <BalanceCard balance={totalBalance} />
        <InvestmentInfo userEmail={user?.email ?? ""} />
        <IconGridNavigation />
        <BasicPlan />
      </div>
    </div>
  );
}