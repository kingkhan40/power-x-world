"use client";

import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaLock,
  FaChartLine,
  FaDollarSign,
  FaUserCheck,
  FaLayerGroup,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { teamLevels as staticTeamLevels } from "@/data/teamLevel";
import { getSocket } from "@/lib/socket";

interface StatsItem {
  id: number;
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface TeamLevel {
  id: number;
  level: number;
  business: string;
  commissions: string;
  inviteCommission: string;
  teamCommission: string;
  locked: boolean;
  inviteName: string;
  inviteDataTime: string;
  investAmount: string;
  status: boolean;
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  deposit: number;
  status: "active" | "inactive";
}

interface DashboardData {
  level?: number;
  totalTeam?: number;
  activeUsers?: number;
  totalBusiness?: number;
  wallet?: number;
  totalCommission?: number;
  selfBusiness?: number;
  directBusiness?: number;
}

const Team = () => {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [errorTeam, setErrorTeam] = useState<string>("");

  // ===== Get userId from localStorage =====
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setUserId(storedId);
  }, []);

  // ===== Fetch Dashboard Data =====
  useEffect(() => {
    if (!userId) return;

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`/api/user/dashboard?userId=${userId}`);
        const data = await res.json();

        if (res.ok) {
          // Combine selfBusiness + directBusiness if exists
          const combinedBusiness =
            (data.selfBusiness || 0) + (data.directBusiness || 0);

          setDashboard({ ...data, totalBusiness: combinedBusiness });
        } else {
          console.error("Dashboard fetch error:", data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [userId]);

  // ===== Socket for Level Updates =====
  useEffect(() => {
    const userWallet = localStorage.getItem("userWallet");
    const socket = getSocket();

    if (socket && userWallet) {
      socket.on(`level_update_${userWallet}`, (data: { level: number }) => {
        setDashboard((prev) => ({ ...prev, level: data.level }));
      });
    }

    return () => {
      if (socket && userWallet) {
        socket.off(`level_update_${userWallet}`);
      }
    };
  }, []);

  // ===== Fetch Team Members =====
  useEffect(() => {
    if (!userId) return;

    const fetchTeamMembers = async () => {
      try {
        const res = await fetch(`/api/user/team?userId=${userId}`);
        const data = await res.json();

        if (!res.ok) {
          setErrorTeam(data.message || "Failed to fetch team members");
          return;
        }

        setTeamMembers(data.team || []);
      } catch (err) {
        console.error("Failed to fetch team members:", err);
        setErrorTeam("Network error. Please try again.");
      } finally {
        setLoadingTeam(false);
      }
    };

    fetchTeamMembers();
  }, [userId]);

  // ===== Stats Cards =====
  const statsData: StatsItem[] = [
    {
      id: 1,
      value: loading ? "Loading..." : (dashboard.totalTeam ?? 0).toString(),
      label: "Total Partners",
      icon: <FaUsers className="text-blue-400" />,
    },
    {
      id: 2,
      value: loading ? "..." : `${dashboard.activeUsers ?? 0} Users`,
      label: "Active With $50+",
      icon: <FaUserCheck className="text-purple-400" />,
    },
    {
      id: 3,
      value: loading ? "..." : `Level ${dashboard.level ?? 0}`,
      label: "Invest Levels",
      icon: <FaLayerGroup className="text-yellow-400" />,
    },
    {
      id: 4,
      value: loading
        ? "..."
        : `$${dashboard.totalBusiness?.toLocaleString() || 0}`,
      label: "Total Business",
      icon: <FaChartLine className="text-green-400" />,
    },
  ];

  const handleMemberClick = (memberId: string) => {
    router.push(`/team/member/${memberId}`);
  };

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Main Container */}
      <div className="container mx-auto max-w-7xl relative z-20">
        <div className="text-center mb-8">
          <h1 className="lg:text-4xl text-2xl mb-3">
            👥{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Team Network
            </span>
          </h1>
          <p className="text-blue-100 lg:text-lg text-sm">
            Grow Your Team & Maximize Earnings
          </p>
          {errorTeam && <p className="text-red-400 mt-2 text-sm">{errorTeam}</p>}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statsData.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-2xl lg:p-6 p-3 border border-white/30 shadow-2xl hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="lg:text-2xl text-lg font-bold text-white mb-1">
                    {item.value}
                  </div>
                  <div className="lg:text-2xl text-xl">{item.icon}</div>
                </div>
                <div className="text-blue-100 text-sm font-medium">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Levels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {staticTeamLevels.map((levelData: TeamLevel) => (
            <div
              key={levelData.id}
              className="lg:p-6 p-3 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl hover:transform hover:scale-105 transition-all duration-500 group"
            >
              <div className="absolute -inset-2 rounded-2xl animate-spin opacity-50 bg-conic-gradient"></div>
              <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-1"></div>

              <div className="absolute top-0 right-2 z-20">
                <div
                  className={`flex justify-center items-center text-lg font-bold text-white w-12 h-12 rounded-full shadow-2xl ${
                    levelData.locked
                      ? "bg-gradient-to-r from-gray-600 to-gray-700"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  }`}
                >
                  {levelData.locked ? <FaLock /> : <FaUsers />}
                </div>
              </div>

              <div className="text-center mb-2 pt-2 relative z-20">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Level {levelData.level.toString().padStart(2, "0")}
                </h3>
              </div>

              <div className="grid grid-cols-2 lg:gap-4 gap-2 mb-2 relative z-20">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-md lg:p-4 p-2 border border-blue-400/30">
                  <div className="flex items-center justify-between">
                    <FaDollarSign className="text-blue-300 text-xl" />
                    <div className="text-white lg:text-lg text-sm font-bold">{levelData.business}</div>
                  </div>
                  <div className="text-blue-200 text-sm mt-1">Business</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-md lg:p-4 p-2 border border-green-400/30">
                  <div className="flex items-center justify-between">
                    <FaChartLine className="text-green-300 text-xl" />
                    <div className="text-white lg:text-lg text-sm font-bold">${levelData.commissions}</div>
                  </div>
                  <div className="text-green-200 text-sm mt-1">Commissions</div>
                </div>
              </div>

              <button
                onClick={() => router.push(`/team/${levelData.id}`)}
                className="w-full lg:py-3 py-1.5 text-sm lg:text-lg rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 opacity-90 cursor-pointer relative z-20"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
