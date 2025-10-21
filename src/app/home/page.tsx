"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BalanceCard from "@/components/BalanceCard";
import BasicPlan from "@/components/BasicPlan";
import IconGridNavigation from "@/components/IconGridNavigation";
import InvestmentInfo from "@/components/InvestmentInfo";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");

    if (!token) {
      router.replace("/login");
    } else {
      setUser({ name: userName || "User", email: userEmail || "" });

      // ✅ Fetch referral link from backend (MongoDB)
      if (userEmail) {
        fetch(`/api/user/${userEmail}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.referralLink) {
              setReferralLink(data.referralLink);
              // Optional: save to localStorage for fallback
              localStorage.setItem("referralLink", data.referralLink);
            } else {
              // fallback if API does not return referralLink
              const localReferral = localStorage.getItem("referralLink");
              if (localReferral) setReferralLink(localReferral);
            }
          })
          .catch(err => {
            console.log("Error fetching referral link:", err);
            const localReferral = localStorage.getItem("referralLink");
            if (localReferral) setReferralLink(localReferral);
          });
      } else {
        // fallback to localStorage if userEmail is missing
        const localReferral = localStorage.getItem("referralLink");
        if (localReferral) setReferralLink(localReferral);
      }
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("referralLink");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
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

        {/* Main Content Section */}
        <div className="space-y-4">
          <BalanceCard />
          <InvestmentInfo userEmail={user?.email ?? ""} />
          <IconGridNavigation />
          <BasicPlan />
        </div>
      </div>
    </div>
  );
}
