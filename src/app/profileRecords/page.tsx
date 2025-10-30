"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  FaUser,
  FaEdit,
  FaEnvelope,
  FaCalendar,
  FaIdCard,
  FaShieldAlt,
  FaTimes,
  FaCamera,
  FaExclamationTriangle,
  FaWallet,
  FaTrophy,
  FaUsers,
  FaUserCheck,
  FaChartLine,
} from "react-icons/fa";

// === INTERFACES ===
interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  userId: string;
  kycStatus: string;
  accountType: string;
  totalInvestment: string;
  totalEarnings: string;
  activePlans: string;
  referralCode: string;
  profilePic: string | null;

  wallet: number;
  usdtBalance: number;
  selfBusiness: number;
  directBusiness: number;
  rewardBalance: number;
  currentRewardLevel: number;
  level: number;
  totalTeam: number;
  activeUsers: number;
  investments: Array<any>;
}

interface PersonalInfoItem {
  icon: JSX.Element;
  label: string;
  value: string;
}

interface ReferrerData {
  name: string;
  sponsorId: string | null;
  profile: string | null;
}

// === COMPONENT ===
const ProfileRecords = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [referrerData, setReferrerData] = useState<ReferrerData>({
    name: "Admin",
    sponsorId: null,
    profile: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserData | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // === FETCH DATA ===
  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Login required");
        setLoading(false);
        return;
      }

      const headers: Record<string, string> = { "x-user-id": userId };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      try {
        // Profile
        const profileRes = await fetch("/api/user/profile", { headers });
        if (!profileRes.ok) throw new Error("Profile fetch failed");
        const { user } = await profileRes.json();

        // Deposits
        const depositRes = await fetch("/api/deposits", { headers });
        const deposits = depositRes.ok ? await depositRes.json() : [];
        const totalDeposits = deposits.reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

        // Referrer
        const refRes = await fetch("/api/user/referrer", { headers });
        const ref = refRes.ok ? await refRes.json() : {};

        // Format
        const formatted: UserData = {
          name: user.name || "Unknown",
          email: user.email || "",
          phone: user.phone || "+1 (555) 000-0000",
          address: user.address || "Not set",
          joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "N/A",
          userId: (user._id || "").slice(-6).toUpperCase(),
          kycStatus: "verified",
          accountType: user.role === "Admin" ? "Admin" : "Premium",
          totalInvestment: `$${user.selfBusiness?.toFixed(2) || "0.00"}`,
          totalEarnings: `$${user.rewardBalance?.toFixed(2) || "0.00"}`,
          activePlans: (user.investments?.length || 0).toString(),
          referralCode: user.referralCode || "N/A",
          profilePic: user.profilePic || null,

          wallet: user.wallet || 0,
          usdtBalance: totalDeposits || user.usdtBalance || 0,
          selfBusiness: user.selfBusiness || 0,
          directBusiness: user.directBusiness || 0,
          rewardBalance: user.rewardBalance || 0,
          currentRewardLevel: user.currentRewardLevel || 1,
          level: user.level || 1,
          totalTeam: user.totalTeam || 0,
          activeUsers: user.activeUsers || 0,
          investments: user.investments || [],
        };

        setUserData(formatted);
        setEditForm({ ...formatted });

        setReferrerData({
          name: ref.name || "Admin",
          sponsorId: ref.sponsorId || null,
          profile: ref.profile || null,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // === EMAIL MASK ===
  const maskEmail = (email: string): string => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    const masked =
      local.length <= 3
        ? local[0] + "***".repeat(local.length - 1)
        : local[0] + "*".repeat(local.length - 3) + local.slice(-2);
    return `${masked}@${domain}`;
  };

  // === PROFILE PIC ===
  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfileImage(dataUrl);
      setEditForm((prev) => prev && { ...prev, profilePic: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  // === EDIT SUBMIT ===
  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editForm) return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const formData = new FormData();
    formData.append("name", editForm.name);

    if (profileImage && profileImage.startsWith("data:")) {
      const res = await fetch(profileImage);
      const blob = await res.blob();
      formData.append("profilePic", blob, "profile.jpg");
    }

    const headers: Record<string, string> = { "x-user-id": userId };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch("/api/user/profile", { method: "POST", headers, body: formData });
      const data = await res.json();
      if (data.user) {
        const updated = { ...userData!, name: data.user.name, profilePic: data.user.profilePic || userData!.profilePic };
        setUserData(updated);
        setEditForm(updated);
      }
    } catch {}
    setIsEditModalOpen(false);
    setProfileImage(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditForm((prev) => prev && { ...prev, [e.target.name]: e.target.value });
  };

  // === 6 BOXES – BACKEND FIELDS ===
  const personalInfo: PersonalInfoItem[] = userData
    ? [
        {
          icon: <FaWallet className="text-green-400" />,
          label: "Wallet Balance",
          value: `$${userData.wallet.toFixed(2)}`,
        },
        {
          icon: <FaTrophy className="text-yellow-400" />,
          label: "Reward Earnings",
          value: `$${userData.rewardBalance.toFixed(2)}`,
        },
        {
          icon: <FaUsers className="text-blue-400" />,
          label: "Total Team Size",
          value: userData.totalTeam.toString(),
        },
        {
          icon: <FaUserCheck className="text-purple-400" />,
          label: "Active Members",
          value: userData.activeUsers.toString(),
        },
        {
          icon: <FaChartLine className="text-indigo-400" />,
          label: "Active Plans",
          value: userData.investments.length.toString(),
        },
        {
          icon: <FaIdCard className="text-pink-400" />,
          label: "Account Holder",
          value: userData.name,
        },
      ]
    : [];

  // === RENDER ===
  if (loading) return <div className="flex items-center justify-center min-h-screen text-white text-xl">Loading...</div>;
  if (error || !userData) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
      <p>{error || "No data"}</p>
      <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-600 rounded-lg">Retry</button>
    </div>
  );

  return (
    <div
      className="min-h-screen py-4 lg:px-4 px-2 relative"
      style={{
        backgroundImage: "url('https://i.pinimg.com/1200x/18/9d/30/189d3007b4da750e7e65e1823954464e.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="container mx-auto max-w-6xl relative z-20">

        {/* === HEADER === */}
        <div className="relative mb-3">
          <div className="relative z-20 flex flex-col lg:flex-row items-center gap-2">
            <div className="relative">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white/30 shadow-2xl overflow-hidden">
                {userData.profilePic ? (
                  <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-white text-xl lg:text-2xl" />
                )}
              </div>
              <button
                onClick={() => document.getElementById("profilePicInput")?.click()}
                className="absolute -bottom-1 -right-1 p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white/30 shadow-lg hover:scale-110 transition-transform duration-300"
              >
                <FaCamera className="text-white text-xs" />
              </button>
              <input id="profilePicInput" type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
            </div>

            <div className="flex-1 text-center">
              <h2 className="text-base lg:text-2xl font-bold text-white">{userData.name}</h2>
              <p className="text-blue-100 text-sm lg:text-base">{maskEmail(userData.email)}</p>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-gradient-to-r lg:flex hidden from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl items-center gap-2"
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-gradient-to-r block lg:hidden from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white p-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl items-center absolute top-2 right-2 gap-2"
            >
              <FaEdit className="text-sm" />
            </button>
          </div>
        </div>

        {/* === REFERRER CARD === */}
        <div className="lg:p-6 p-3 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl lg:mb-8 mb-3">
          <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full z-10" style={{ background: "linear-gradient(45deg,#a855f7,#ec4899,#a855f7)", filter: "blur(12px)", opacity: "0.6" }}></div>
          <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full z-10" style={{ background: "linear-gradient(135deg,#3b82f6,#10b981,#3b82f6)", filter: "blur(10px)", opacity: "0.4" }}></div>
          <div className="absolute -inset-2 rounded-2xl animate-spin opacity-70" style={{ background: "conic-gradient(from 0deg,#3b82f6,#8b5cf6,#ec4899,#10b981,#f59e0b,#3b82f6)", animationDuration: "10000ms", zIndex: 0 }}></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>
          
          <div className="relative z-20 text-center">
            {referrerData.profile ? (
              <img src={referrerData.profile} className="w-12 h-12 rounded-full mx-auto" alt="Referrer" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto">
                <FaUser className="text-white text-xl" />
              </div>
            )}
            <div className="text-white font-semibold text-sm mt-2">{referrerData.name}</div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-white/70 text-sm">Sp ID :</span>
              <span className="text-white font-semibold text-xs">
                {referrerData.sponsorId ? referrerData.sponsorId.slice(-6).toUpperCase() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* === 6 BOXES GRID === */}
        <div className="lg:p-6 p-3 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full z-10" style={{ background: "linear-gradient(45deg,#a855f7,#ec4899,#a855f7)", filter: "blur(12px)", opacity: "0.6" }}></div>
          <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full z-10" style={{ background: "linear-gradient(135deg,#3b82f6,#10b981,#3b82f6)", filter: "blur(10px)", opacity: "0.4" }}></div>
          <div className="absolute -inset-2 rounded-2xl animate-spin opacity-50" style={{ background: "conic-gradient(from 0deg,#3b82f6,#8b5cf6,#ec4899,#10b981,#f59e0b,#3b82f6)", animationDuration: "12000ms", zIndex: 0 }}></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>
          <div className="relative z-20">
            <div className="grid grid-cols-2 gap-2">
              {personalInfo.map((info, i) => (
                <div key={i} className="flex flex-col items-center gap-4 lg:p-3 p-2 rounded-md bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-white/20 backdrop-blur-sm">
                  <div className="text-white/70 text-sm">{info.label}</div>
                  <div className="text-white text-xs font-semibold">{info.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === EDIT MODAL === */}
        {isEditModalOpen && editForm && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40" onClick={() => setIsEditModalOpen(false)} />
            <div className="fixed inset-0 flex items-center justify-center lg:p-4 p-2 z-50">
              <div className="w-full max-w-2xl rounded-2xl relative overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="absolute -inset-1 rounded-2xl overflow-hidden">
                  <div className="w-full h-full animate-spin opacity-70" style={{ background: "conic-gradient(from 0deg,#a855f7,#ec4899,#f59e0b,#10b981,#3b82f6,#a855f7)", animationDuration: "10000ms" }}></div>
                </div>
                <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>
                <div className="relative z-20 m-1">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 py-6 px-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FaEdit className="text-white text-xl" />
                        <div>
                          <div className="text-xl font-bold text-white">Edit Profile</div>
                          <div className="text-blue-100 text-sm">Update your personal information</div>
                        </div>
                      </div>
                      <button onClick={() => setIsEditModalOpen(false)} className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/10">
                        <FaTimes className="text-xl" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleEditSubmit} className="space-y-6">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white/30 shadow-2xl overflow-hidden">
                            {profileImage || editForm.profilePic ? (
                              <img src={profileImage || editForm.profilePic!} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <FaUser className="text-white text-2xl" />
                            )}
                          </div>
                          <label htmlFor="modalProfilePic" className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white/30 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                            <FaCamera className="text-white text-sm" />
                          </label>
                          <input id="modalProfilePic" type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
                        </div>
                        <p className="text-white/70 text-sm text-center">Click camera to change picture</p>
                      </div>

                      <div className="space-y-3">
                        <label className="text-white font-semibold">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-gradient-to-r from-gray-800/90 to-gray-900 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                          Save Changes
                        </button>
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 rounded-xl font-bold transition-all duration-300 border border-gray-500/50">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileRecords;