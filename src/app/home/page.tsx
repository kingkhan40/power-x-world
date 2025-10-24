"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import BasicPlan from "@/components/BasicPlan";
import IconGridNavigation from "@/components/IconGridNavigation";
import InvestmentInfo from "@/components/InvestmentInfo";
import socket from "@/lib/socket";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string; wallet?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const userWallet = localStorage.getItem("userWallet");

    if (!token) {
      router.replace("/login");
      return;
    }

    setUser({ name: userName || "User", email: userEmail || "", wallet: userWallet || "" });

    // ✅ Fetch referral link
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
    } else {
      const localReferral = localStorage.getItem("referralLink");
      if (localReferral) setReferralLink(localReferral);
    }

    setLoading(false);

    // ✅ Real-time socket setup
    if (socket && userWallet) {
      // Deposit event (live updates)
      socket.on(`deposit_${userWallet}`, (data: any) => {
        console.log("💰 Deposit Event:", data);
        setBalance(Number(data.newBalance));
      });

      // Withdraw event (live updates)
      socket.on(`withdraw_${userWallet}`, (data: any) => {
        console.log("💸 Withdraw Event:", data);
        setBalance(Number(data.newBalance));
      });
    }

    // ✅ Cleanup on unmount
    return () => {
      if (socket && userWallet) {
        socket.off(`deposit_${userWallet}`);
        socket.off(`withdraw_${userWallet}`);
      }
    };
  }, [router]);

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

      {/* 🔹 Sidebar (kept above overlay) */}
      <div className="relative z-50">
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-3 lg:px-6 py-6 relative z-10">
        {/* Header Section */}
      

        {/* Main Content Section */}
        <div className="space-y-4">
          <BalanceCard balance={balance} />
          <InvestmentInfo userEmail={user?.email ?? ""} />
          <IconGridNavigation />
          <BasicPlan />
        </div>
      </div>
    </div>
  );
}