"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import BasicPlan from "@/components/BasicPlan";
import IconGridNavigation from "@/components/IconGridNavigation";
import InvestmentInfo from "@/components/InvestmentInfo";
import socket from "@/lib/socket";
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

function HomePage() {
  const router = useRouter();
  const { balance: contextBalance, setBalance: setContextBalance } =
    useBalance(); // ✅ from context
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    wallet?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData>({});
  const [balance, setBalance] = useState<number>(0);
  const [totalCommission, setTotalCommission] = useState<number>(0);
  const [rewardPayment, setRewardPayment] = useState<number>(0);
  const [otherPayments, setOtherPayments] = useState<number>(0);
  const [usdtBalance, setUsdtBalance] = useState<number>(0);

  // 🧩 New event listener merged here (window event)
  useEffect(() => {
    const handleBalanceUpdate = (e: any) => {
      if (e.detail?.balance !== undefined) {
        setBalance(e.detail.balance);
        setContextBalance?.(e.detail.balance);
        localStorage.setItem("userBalance", e.detail.balance.toString()); // ✅ sync
      }
    };

    window.addEventListener("balanceUpdated", handleBalanceUpdate);
    return () =>
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
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

    setUser({
      name: userName || "User",
      email: userEmail || "",
      wallet: userWallet || "",
    });

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
          const mainBalance = data.wallet ?? 0;
          setBalance(mainBalance);
          setContextBalance?.(mainBalance);
          localStorage.setItem("userBalance", mainBalance.toString()); // ✅ sync

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
      const updateAllBalances = (newBalance: number) => {
        setBalance(newBalance);
        setContextBalance?.(newBalance);
        localStorage.setItem("userBalance", newBalance.toString()); // ✅ sync
      };

      socket.on(`deposit_${userWallet}`, (data: any) =>
        updateAllBalances(Number(data.newBalance))
      );
      socket.on(`withdraw_${userWallet}`, (data: any) =>
        updateAllBalances(Number(data.newBalance))
      );
      socket.on(`commission_${userWallet}`, (data: any) =>
        setTotalCommission(Number(data.totalCommission))
      );
      socket.on(`reward_${userWallet}`, (data: any) =>
        setRewardPayment(Number(data.rewardPayment))
      );
      socket.on(`otherpayment_${userWallet}`, (data: any) =>
        setOtherPayments(Number(data.otherPayments))
      );

      socket.on("rewardUpdated", (data: any) => {
        if (data?.userId && typeof data.newBalance === "number") {
          updateAllBalances(data.newBalance);
        }
      });
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
      socket.off("rewardUpdated");
    };
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

      <div className="container mx-auto px-3 lg:px-6 py-6 relative z-10 space-y-6">
        <BalanceCard balance={totalBalance} />
        <InvestmentInfo userEmail={user?.email ?? ""} />
        <IconGridNavigation />
        <BasicPlan />
      </div>
    </div>
  );
}

export default HomePage;
