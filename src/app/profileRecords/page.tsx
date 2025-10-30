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
} from "react-icons/fa";

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
}

interface PersonalInfoItem {
  icon: JSX.Element;
  label: string;
  value: string;
}

interface AccountRecord {
  title: string;
  amount: string;
}

interface ReferrerData {
  name: string;
  sponsorId: string;
  profile: string | null;
}

const ProfileRecords = () => {
  // === State Initialization from localStorage ===
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem("userData");
    return saved
      ? JSON.parse(saved)
      : {
          name: "John Doe",
          email: "john@mail.com",
          phone: "+1 (555) 123-4567",
          address: "123 Main Street, New York, NY 10001",
          joinDate: "2024-01-15",
          userId: "USR001234",
          kycStatus: "verified",
          accountType: "Premium",
          totalInvestment: "$12,450.50",
          totalEarnings: "$2,350.75",
          activePlans: "3",
          referralCode: "JOHNDOE25",
          // profilePic: null,
        };
  });

  const [referrerData, setReferrerData] = useState<ReferrerData>(() => {
    const saved = localStorage.getItem("referrerData");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Alex Johnson",
          sponsorId: "SPN001500",
          profile: null,
        };
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserData>({ ...userData });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // === Sync with localStorage ===
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem("referrerData", JSON.stringify(referrerData));
  }, [referrerData]);

  // === Fetch Profile & Referrer on Mount ===
  useEffect(() => {
    async function fetchProfileData() {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const headers: Record<string, string> = { "x-user-id": userId };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      try {
        // Fetch User
        const userRes = await fetch("/api/user/profile", { headers });
        const userDataRes = await userRes.json();
        if (userDataRes.user) {
          setUserData(userDataRes.user);
          localStorage.setItem("userData", JSON.stringify(userDataRes.user));
        }

        // Fetch Referrer
        const refRes = await fetch("/api/user/referrer", { headers });
        const refData = await refRes.json();
        const referrerUpdate = {
          name: refData.name || "Admin",
          sponsorId: refData.sponsorId || "N/A",
          profile: refData.profile || null,
        };
        setReferrerData(referrerUpdate);
        localStorage.setItem("referrerData", JSON.stringify(refData));
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    fetchProfileData();
  }, []);

  // === Email Masking ===
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

  // === Handle Profile Picture Change ===
  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setEditForm((prev) => ({ ...prev, profilePic: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // === Handle Edit Submit (POST to Backend) ===
  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const formData = new FormData();
    formData.append("name", editForm.name);

    if (profileImage && profileImage.startsWith("data:")) {
      try {
        const res = await fetch(profileImage);
        const blob = await res.blob();
        formData.append("profilePic", blob, "profile.jpg");
      } catch (err) {
        console.error("Image processing failed:", err);
      }
    }

    const headers: Record<string, string> = { "x-user-id": userId };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await res.json();

      if (data.user) {
        setUserData(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user));
        setIsEditModalOpen(false);
        setProfileImage(null);
        setEditForm({ ...data.user });
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // === Handle Input Change ===
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // === Static Data ===
  const personalInfo: PersonalInfoItem[] = [
    { icon: <FaUser className="text-blue-400" />, label: "My Self Invest", value: "$0.00" },
    { icon: <FaEnvelope className="text-purple-400" />, label: "Profit Record", value: "$0.00" },
    { icon: <FaCalendar className="text-yellow-400" />, label: "My Total Deposit", value: "$0.00" },
    { icon: <FaIdCard className="text-indigo-400" />, label: "My Withdrawals", value: "$0.00" },
    { icon: <FaShieldAlt className="text-green-400" />, label: "Team Commission", value: "$0.00" },
    { icon: <FaUser className="text-blue-400" />, label: "Direct Commission", value: "$0.00" },
  ];

  const accountRecords: AccountRecord[] = [
    { title: "My Total USDT Earning", amount: "0.00$" },
  ];

  return (
    <div
      className="min-h-screen py-4 lg:px-4 px-2 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/18/9d/30/189d3007b4da750e7e65e1823954464e.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="container mx-auto max-w-6xl relative z-20">

        {/* === Profile Header === */}
        <div className="relative mb-3">
          <div className="relative z-20 flex flex-col lg:flex-row items-center gap-2">
            <div className="relative">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white/30 shadow-2xl overflow-hidden">
                {userData.profilePic ? (
                  <img
                    src={userData.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
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
              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center">
              <h2 className="text-base lg:text-2xl font-bold text-white">{userData.name}</h2>
              <p className="text-blue-100 text-sm lg:text-base">{maskEmail(userData.email)}</p>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-gradient-to-r lg:flex hidden from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl items-center gap-2"
            >
              <FaEdit />
              Edit Profile
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-gradient-to-r block lg:hidden from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white p-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl items-center absolute top-2 right-2 gap-2"
            >
              <FaEdit className="text-sm" />
            </button>
          </div>
        </div>

        {/* === Referrer Card === */}
        <div className="lg:p-6 p-3 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl lg:mb-8 mb-3">
          <div
            className="absolute -top-8 -left-8 w-24 h-24 rounded-full z-10"
            style={{
              background: "linear-gradient(45deg, #a855f7, #ec4899, #a855f7)",
              filter: "blur(12px)",
              opacity: "0.6",
            }}
          ></div>
          <div
            className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full z-10"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #10b981, #3b82f6)",
              filter: "blur(10px)",
              opacity: "0.4",
            }}
          ></div>
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
            style={{
              background:
                "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #10b981, #f59e0b, #3b82f6)",
              animationDuration: "10000ms",
              zIndex: 0,
            }}
          ></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>
          <div className="relative z-20">
            <h3 className="text-white text-lg font-semibold mb-2 flex flex-col items-center justify-center gap-2">
              {referrerData.profile ? (
                <img
                  src={referrerData.profile}
                  className="w-12 h-12 rounded-full"
                  alt="Referrer Profile"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <FaUser className="text-white text-xl" />
                </div>
              )}
              <div className="text-white font-semibold text-sm">{referrerData.name}</div>
              <div className="flex items-center gap-2">
                <div className="text-white/70 text-sm">Sp ID :</div>
                <div className="text-white font-semibold text-xs">{referrerData.sponsorId}</div>
              </div>
            </h3>
          </div>
        </div>

        {/* === Personal Info Grid === */}
        <div className="lg:p-6 p-3 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          <div
            className="absolute -top-8 -left-8 w-24 h-24 rounded-full z-10"
            style={{
              background: "linear-gradient(45deg, #a855f7, #ec4899, #a855f7)",
              filter: "blur(12px)",
              opacity: "0.6",
            }}
          ></div>
          <div
            className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full z-10"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #10b981, #3b82f6)",
              filter: "blur(10px)",
              opacity: "0.4",
            }}
          ></div>
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-50"
            style={{
              background:
                "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #10b981, #f59e0b, #3b82f6)",
              animationDuration: "12000ms",
              zIndex: 0,
            }}
          ></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>
          <div className="relative z-20">
            <div className="grid grid-cols-2 gap-2">
              {personalInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-4 lg:p-3 p-2 rounded-md bg-gradient-to-r from-gray-800/50 to-gray-900/30 border border-white/20 backdrop-blur-sm"
                >
                  <div className="text-white/70 text-sm">{info.label}</div>
                  <div className="text-white text-xs flex flex-wrap font-semibold">{info.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === Account Records === */}
        <div className="p-6 rounded-2xl relative mt-2 overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          <div
            className="absolute -top-8 -left-8 w-24 h-24 rounded-full z-10"
            style={{
              background: "linear-gradient(45deg, #a855f7, #ec4899, #a855f7)",
              filter: "blur(12px)",
              opacity: "0.6",
            }}
          ></div>
          <div
            className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full z-10"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #10b981, #3b82f6)",
              filter: "blur(10px)",
              opacity: "0.4",
            }}
          ></div>
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-50"
            style={{
              background:
                "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #10b981, #f59e0b, #3b82f6)",
              animationDuration: "12000ms",
              zIndex: 0,
            }}
          ></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>
          <div className="relative z-20">
            {accountRecords.map((record, index) => (
              <div
                key={index}
                className="flex justify-between items-center lg:py-2 py-1 border-b border-gray-300 last:border-b-0"
              >
                <span className="text-gray-100 lg:text-lg text-sm">{record.title}</span>
                <span className="font-semibold text-gray-200 lg:text-base text-xs">{record.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === Edit Profile Modal === */}
      {isEditModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center lg:p-4 p-2 z-50">
            <div className="w-full max-w-2xl rounded-2xl relative overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="absolute -inset-1 rounded-2xl overflow-hidden">
                <div
                  className="w-full h-full animate-spin opacity-70"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #a855f7, #ec4899, #f59e0b, #10b981, #3b82f6, #a855f7)",
                    animationDuration: "10000ms",
                  }}
                ></div>
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
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/10"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <form onSubmit={handleEditSubmit} className="space-y-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white/30 shadow-2xl overflow-hidden">
                          {profileImage || editForm.profilePic ? (
                            <img
                              src={profileImage || editForm.profilePic || ""}
                              alt="Profile Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaUser className="text-white text-2xl" />
                          )}
                        </div>
                        <label
                          htmlFor="modalProfilePic"
                          className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white/30 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
                        >
                          <FaCamera className="text-white text-sm" />
                        </label>
                        <input
                          id="modalProfilePic"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                          className="hidden"
                        />
                      </div>
                      <p className="text-white/70 text-sm text-center">
                        Click on camera icon to change profile picture
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white py-3 lg:px-6 px-4 lg:text-lg text-sm rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 lg:px-6 px-4 lg:text-lg text-sm rounded-xl font-bold transition-all duration-300 border border-gray-500/50"
                      >
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
  );
};

export default ProfileRecords;