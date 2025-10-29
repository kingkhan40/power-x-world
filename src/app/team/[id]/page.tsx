// components/TeamLevelDetail.tsx
"use client";
import { MdKeyboardArrowLeft } from "react-icons/md";
import {
  FaUsers,
  FaChartLine,
  FaDollarSign,
  FaUserCheck,
  FaCalendar,
  FaLock,
  FaUnlock,
  FaUserPlus,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useParams } from "next/navigation";
import Link from "next/link";
import { teamLevels } from "@/data/teamLevel";

interface LevelInfoCard {
  id: number;
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  border: string;
  textColor: string;
}

interface StatusItem {
  id: number;
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

const TeamLevelDetail = () => {
  const { id } = useParams();

  // Find the specific level data based on levelId
  const levelData = teamLevels.find((level) => level.id === parseInt(id as string));

  // Level info cards data
  const levelInfoCards: LevelInfoCard[] = [
    {
      id: 1,
      title: "Total Commissions",
      value: `$${levelData?.commissions || "0"}`,
      icon: <FaChartLine className="text-green-300 text-xl" />,
      gradient: "from-green-500/20 to-green-600/20",
      border: "border-green-400/30",
      textColor: "text-green-200"
    },
    {
      id: 2,
      title: "Team Commission",
      value: levelData?.teamCommission || "0%",
      icon: <FaUsers className="text-pink-300 text-xl" />,
      gradient: "from-pink-500/20 to-pink-600/20",
      border: "border-pink-400/30",
      textColor: "text-pink-200"
    },
    {
      id: 3,
      title: "Business Volume",
      value: `$${levelData?.business || "0"}`,
      icon: <FaDollarSign className="text-blue-300 text-xl" />,
      gradient: "from-blue-500/20 to-blue-600/20",
      border: "border-blue-400/30",
      textColor: "text-blue-200"
    },
  ];

  // Status items data
  const statusItems: StatusItem[] = [
    {
      id: 1,
      label: "Level Progress",
      value: (
        <div className="w-20 lg:w-24 bg-gray-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              levelData?.locked ? "bg-red-500 w-1/3" : "bg-green-500 w-full"
            }`}
          ></div>
        </div>
      ),
      icon: <FaChartLine className="text-blue-400" />
    },
    {
      id: 2,
      label: "Required Invites",
      value: <span className="text-white font-bold">{levelData?.invitePeople || "0"} People</span>,
      icon: <FaUserPlus className="text-green-400" />
    },
    {
      id: 3,
      label: "Required Invite Amount",
      value: <span className="text-yellow-300 font-bold">${levelData?.inviteAmount || "0"}</span>,
      icon: <FaMoneyBillWave className="text-yellow-400" />
    },
    {
      id: 4,
      label: "Invite Commission",
      value: <span className="text-purple-300 font-bold">{levelData?.inviteCommission || "0%"}</span>,
      icon: <FaUserCheck className="text-purple-400" />
    },
    {
      id: 5,
      label: "Team Commission",
      value: <span className="text-cyan-300 font-bold">{levelData?.teamCommission || "0%"}</span>,
      icon: <FaUsers className="text-cyan-400" />
    }
  ];

  // If level data not found
  if (!levelData) {
    return (
      <div
        className="min-h-screen py-8 px-4 relative"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/b7/c0/45/b7c04588acdc49eac7f0b5a54f7817b1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-6 transition-colors"
          >
            <MdKeyboardArrowLeft className="w-5 h-5" />
            <span>Back to Team</span>
          </Link>

          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-lg rounded-2xl p-8 border border-red-400/30 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Level Not Found
            </h2>
            <p className="text-red-100">
              Team Level {id} does not exist in our system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/b7/c0/45/b7c04588acdc49eac7f0b5a54f7817b1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Light Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Back Button */}
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-6 transition-colors group"
        >
          <MdKeyboardArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          <span className="lg:text-base text-sm">Back to Team Overview</span>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="lg:text-4xl text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text">
            Level {levelData.level.toString().padStart(2, "0")} Details
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                levelData.locked
                  ? "bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30"
                  : "bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-400/30"
              }`}
            >
              {levelData.locked ? (
                <FaLock className="text-red-400 lg:text-base text-sm" />
              ) : (
                <FaUnlock className="text-green-400 lg:text-base text-sm" />
              )}
              <span
                className={`font-semibold lg:text-sm text-xs ${
                  levelData.locked ? "text-red-300" : "text-green-300"
                }`}
              >
                {levelData.locked ? "Level Locked" : "Level Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Level Information Card */}
          <div className="lg:col-span-2">
            <div className=" backdrop-blur-2xl rounded-2xl p-4 lg:p-6 border border-white/30 shadow-2xl">
              <h2 className="lg:text-2xl text-lg font-bold text-white mb-4 lg:mb-6 flex items-center gap-3">
                <FaUsers className="text-blue-400 lg:text-xl text-lg" />
                Level Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {levelInfoCards.map((card) => (
                  <div
                    key={card.id}
                    className={`bg-gradient-to-br ${card.gradient} backdrop-blur-sm rounded-xl p-3 lg:p-4 border ${card.border} hover:transform hover:scale-105 transition-all duration-300`}
                  >
                    <div className="flex lg:flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {card.icon}
                        <h3 className={`font-semibold ${card.textColor} lg:text-sm text-xs`}>
                          {card.title}
                        </h3>
                      </div>
                      <p className="lg:text-xl text-lg font-bold text-white whitespace-nowrap">
                        {card.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className=" backdrop-blur-2xl rounded-2xl p-4 lg:p-6 border border-white/30 shadow-2xl">
            <h2 className="lg:text-2xl text-lg font-bold text-white mb-4 lg:mb-6 flex items-center gap-3">
              <FaChartLine className="text-green-400 lg:text-xl text-base" />
              Level Requires & Commissions
            </h2>

            <div className="space-y-4 lg:space-y-5">
              {statusItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-lg">
                      {item.icon}
                    </div>
                    <span className="text-blue-200 lg:text-sm text-xs flex-1">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invite Details Section */}
        {levelData.inviteName && (
          <div className=" backdrop-blur-2xl rounded-2xl p-4 lg:p-6 border border-white/30 shadow-2xl mb-6">
            <h2 className="lg:text-2xl text-lg font-bold text-white mb-4 lg:mb-6 flex items-center gap-3">
              <FaUserCheck className="text-purple-400 lg:text-xl text-lg" />
              Invite Details
            </h2>

            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-purple-400/30">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Left Column - User Info */}
                <div className=" flex items-center justify-between">
                  <div>
                    <h4 className="text-purple-200 lg:text-sm text-xs font-semibold mb-1">
                      Invited Member
                    </h4>
                    <p className="text-white lg:text-xl text-lg font-bold">
                      {levelData.inviteName}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-purple-200 lg:text-sm text-xs font-semibold mb-1">
                      Investment Amount
                    </h4>
                    <p className="text-yellow-300 text-end lg:text-xl text-lg font-bold">
                      ${levelData.inviteAmount}
                    </p>
                  </div>
                </div>

                {/* Right Column - Status & Date */}
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-purple-200 lg:text-sm text-xs font-semibold">
                      Status
                    </h4>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${
                          levelData.status ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                      <span
                        className={`font-semibold lg:text-sm text-xs ${
                          levelData.status ? "text-green-300" : "text-gray-300"
                        }`}
                      >
                        {levelData.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-purple-200 lg:text-sm text-xs font-semibold mb-1">
                      Investment Date
                    </h4>
                    <div className="flex items-center gap-2 text-white">
                      <FaCalendar className="text-blue-300 lg:text-base text-sm" />
                      <span className="lg:text-base text-sm">{levelData.inviteDataTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Members Section */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-2xl p-4 lg:p-6 border border-white/30 shadow-2xl">
          <h2 className="lg:text-2xl text-lg font-bold text-white mb-4 lg:mb-6 flex items-center gap-3">
            <FaUsers className="text-blue-400 lg:text-xl text-lg" />
            Team Members
          </h2>

          <div className="text-center py-6 lg:py-8">
            <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">👥</div>
            <h3 className="lg:text-xl text-lg font-semibold text-blue-200 mb-2">
              No Team Members Yet
            </h3>
            <p className="text-blue-100 lg:text-base text-sm">
              Start inviting members to build your team and unlock higher
              earning potentials!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLevelDetail;