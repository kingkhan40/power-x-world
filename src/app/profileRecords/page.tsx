'use client';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext'; // ✅ Import context

// === INTERFACES ===
interface PersonalInfoItem {
  icon: JSX.Element;
  label: string;
  value: string;
}
interface AccountRecord {
  title: string;
  amount: string;
}

// === COMPONENT ===
const ProfileRecords = () => {
  const {
    user,
    profileData,
    updateUserProfile,
    loading,
    error,
    setError,
    fetchUserProfile,
  } = useAuth(); // ✅ Use context

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.userName || '');
  const [profileImage, setProfileImage] = useState<string | null>(user?.profilePic || null);

  // === FETCH DATA ===
  useEffect(() => {
    if (user?.userId) {
      fetchUserProfile();
    }
  }, [user?.userId, fetchUserProfile]);

  // Update edit form when user data changes
  useEffect(() => {
    if (user) {
      setEditName(user.userName || '');
      setProfileImage(user.profilePic || null);
    }
  }, [user]);

  // === EMAIL MASK ===
  const maskEmail = (email: string): string => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    const masked =
      local.length <= 3
        ? local[0] + '*'.repeat(local.length - 1)
        : local[0] + '*'.repeat(local.length - 3) + local.slice(-2);
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
    };
    reader.readAsDataURL(file);
  };

  // === EDIT SUBMIT ===
  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await updateUserProfile(editName, profileImage || undefined);
      setIsEditModalOpen(false);
      setProfileImage(null);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const personalInfo: PersonalInfoItem[] = user
    ? [
        {
          icon: <FaUser className="text-blue-400" />,
          label: 'My Self Invest',
          value: `$${user.selfBusiness?.toFixed(2) || '0.00'}`,
        },
        {
          icon: <FaEnvelope className="text-purple-400" />,
          label: 'Profit Record',
          value: `$${user.rewardBalance?.toFixed(2) || '0.00'}`,
        },
        {
          icon: <FaCalendar className="text-yellow-400" />,
          label: 'My Total Deposit',
          value: `$${user.usdtBalance?.toFixed(2) || '0.00'}`,
        },
        {
          icon: <FaIdCard className="text-indigo-400" />,
          label: 'My Withdrawals',
          value: `$${(user as any).totalCommission?.toFixed(2) || '0.00'}`,
        },
        {
          icon: <FaShieldAlt className="text-green-400" />,
          label: 'Team Commission',
          value: `$${user.directBusiness?.toFixed(2) || '0.00'}`,
        },
        {
          icon: <FaUser className="text-blue-400" />,
          label: 'Direct Commission',
          value: `$${(user as any).rewardPayment?.toFixed(2) || '0.00'}`,
        },
      ]
    : [];

  const accountRecords: AccountRecord[] = [
    {
      title: 'My Total USDT Earning',
      amount: '0.00$',
    },
  ];

  // === RENDER ===
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Loading...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
        <p>{error || 'No data available'}</p>
        <button
          onClick={fetchUserProfile}
          className="mt-4 px-6 py-2 bg-red-600 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-4 lg:px-4 px-2 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/18/9d/30/189d3007b4da750e7e65e1823954464e.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="container mx-auto max-w-6xl relative z-20">
        {/* My Profile Header Card */}
        <div className="relative mb-3">
          <div className="relative z-20 flex flex-col lg:flex-row items-center gap-2">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white/30 shadow-2xl overflow-hidden">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-white text-xl lg:text-2xl" />
                )}
              </div>
              <button
                onClick={() =>
                  document.getElementById('profilePicInput')?.click()
                }
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
            {/* Profile Info */}
            <div className="flex-1 text-center">
              <h2 className="text-base lg:text-2xl font-bold text-white">
                {user.userName}
              </h2>
              <p className="text-blue-100 text-sm lg:text-base">
                {maskEmail(user.userEmail)}
              </p>
            </div>
            {/* Edit Button */}
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
        {/* Referrer Information Card */}
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
          <div className="relative z-20 text-center">
            {profileData?.referrerData?.profile ? (
              <img
                src={profileData.referrerData.profile}
                className="w-12 h-12 rounded-full mx-auto"
                alt="Referrer Profile"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto">
                <FaUser className="text-white text-xl" />
              </div>
            )}
            <div className="text-white font-semibold text-sm mt-2">
              {profileData?.referrerData?.name || 'N/A'}
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-white/70 text-sm">Sp ID :</span>
              <span className="text-white font-semibold text-xs">
                {profileData?.referrerData?.sponsorId
                  ? profileData.referrerData.sponsorId.slice(-6).toUpperCase()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        {/* Account Records */}
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
                <span className="text-gray-100 lg:text-lg text-sm">
                  {record.title}
                </span>
                <span className="font-semibold text-gray-200 lg:text-base text-xs">
                  {record.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Personal Information */}
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
                  <div className="text-white text-xs flex flex-wrap font-semibold">
                    {info.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Edit Profile Modal */}
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
                        <div className="text-xl font-bold text-white">
                          Edit Profile
                        </div>
                        <div className="text-blue-100 text-sm">
                          Update your personal information
                        </div>
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
                          {profileImage || user.profilePic ? (
                            <img
                              src={profileImage || user.profilePic || ""}
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
                    <div className="space-y-3">
                      <label className="text-white font-semibold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-3 bg-gradient-to-r from-gray-800/90 to-gray-900 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                    {error && (
                      <p className="text-red-400 text-sm text-center">
                        {error}
                      </p>
                    )}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white py-3 lg:px-6 px-4 lg:text-lg text-sm rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
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