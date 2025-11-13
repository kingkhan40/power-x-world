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
  FaChartLine,
  FaDollarSign,
  FaTrophy,
  FaWallet,
  FaUsers,
  FaCoins,
  FaHandHoldingUsd,
  FaUserFriends,
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// === INTERFACES ===
interface PersonalInfoItem {
  icon: JSX.Element;
  label: string;
  value: string;
  color: string;
  gradient: string;
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
  } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.userName || '');
  const [profileImage, setProfileImage] = useState<string | null>(user?.profilePic || null);

  // === FETCH DATA ===
  useEffect(() => {
    if (user?.userId) {
      fetchUserProfile();
    }
  }, [user?.userId, fetchUserProfile]);

  // Sync form with user changes
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

  // === PROFILE PIC HANDLER ===
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

  // === PERSONAL INFO CARDS ===
  const personalInfo: PersonalInfoItem[] = user
    ? [
        {
          icon: <FaChartLine className="text-xl" />,
          label: 'My Self Invest',
          value: `$${user.selfBusiness?.toFixed(2) || '0.00'}`,
          color: 'text-cyan-400',
          gradient: 'from-cyan-500 to-blue-600',
        },
        {
          icon: <FaTrophy className="text-xl" />,
          label: 'Profit Record',
          value: `$${user.rewardBalance?.toFixed(2) || '0.00'}`,
          color: 'text-amber-400',
          gradient: 'from-amber-500 to-orange-600',
        },
        {
          icon: <FaWallet className="text-xl" />,
          label: 'My Total Deposit',
          value: `$${user.usdtBalance?.toFixed(2) || '0.00'}`,
          color: 'text-emerald-400',
          gradient: 'from-emerald-500 to-green-600',
        },
        {
          icon: <FaCoins className="text-xl" />,
          label: 'My Withdrawals',
          value: `$${(user as any).totalCommission?.toFixed(2) || '0.00'}`,
          color: 'text-purple-400',
          gradient: 'from-purple-500 to-indigo-600',
        },
        {
          icon: <FaUserFriends className="text-xl" />,
          label: 'Team Commission',
          value: `$${user.directBusiness?.toFixed(2) || '0.00'}`,
          color: 'text-rose-400',
          gradient: 'from-rose-500 to-pink-600',
        },
        {
          icon: <FaHandHoldingUsd className="text-xl" />,
          label: 'Direct Commission',
          value: `$${(user as any).rewardPayment?.toFixed(2) || '0.00'}`,
          color: 'text-violet-400',
          gradient: 'from-violet-500 to-purple-600',
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center text-white p-4">
        <FaExclamationTriangle className="text-6xl text-red-400 mb-4" />
        <p className="text-xl font-semibold mb-2 text-center">{error || 'No data available'}</p>
        <p className="text-slate-300 mb-6 text-center">We couldn't load your profile information</p>
        <button
          onClick={fetchUserProfile}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 lg:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-700/50 shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white/20 shadow-2xl overflow-hidden">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-white text-3xl lg:text-4xl" />
                )}
              </div>
              <button
                onClick={() => document.getElementById('profilePicInput')?.click()}
                className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl border-2 border-white/30 shadow-lg hover:scale-110 transition-all duration-300"
              >
                <FaCamera className="text-white text-sm" />
              </button>
              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">{user.userName}</h1>
              <p className="text-slate-300 text-lg lg:text-xl mb-4">{maskEmail(user.userEmail)}</p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl text-sm border border-blue-500/30 backdrop-blur-sm">
                  User ID: {user.userId?.slice(-8)}
                </span>
                <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl text-sm border border-purple-500/30 backdrop-blur-sm">
                  Active Investor
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3"
            >
              <FaEdit className="text-lg" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Referrer Info */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FaUserFriends className="text-blue-400 text-lg" />
                </div>
                Referrer Information
              </h3>
              <div className="flex flex-col items-center text-center space-y-4">
                {profileData?.referrerData?.profile ? (
                  <img
                    src={profileData.referrerData.profile}
                    className="w-20 h-20 rounded-2xl border-2 border-slate-600 shadow-lg"
                    alt="Referrer"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-slate-600 shadow-lg">
                    <FaUser className="text-white text-2xl" />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-white font-bold text-lg">
                    {profileData?.referrerData?.name || 'N/A'}
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-slate-700/50 px-4 py-2 rounded-xl">
                    <span className="text-slate-400 text-sm">Sponsor ID:</span>
                    <span className="text-white font-semibold text-sm">
                      {profileData?.referrerData?.sponsorId
                        ? profileData.referrerData.sponsorId.slice(-6).toUpperCase()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <FaDollarSign className="text-emerald-400 text-lg" />
                </div>
                Account Summary
              </h3>
              {accountRecords.map((record, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/50"
                >
                  <span className="text-slate-300 text-base font-medium">{record.title}</span>
                  <span className="font-bold text-white text-lg bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                    {record.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-700/50 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <FaChartLine className="text-white text-xl" />
                </div>
                Investment Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalInfo.map((info, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${info.gradient} rounded-2xl p-5 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white/90 text-sm font-semibold">{info.label}</div>
                      <div className={`p-2 rounded-xl bg-white/20 ${info.color}`}>{info.icon}</div>
                    </div>
                    <div className="text-white text-2xl font-bold">{info.value}</div>
                    <div className="w-full bg-white/20 h-1 rounded-full mt-3">
                      <div
                        className="bg-white h-1 rounded-full transition-all duration-1000"
                        style={{ width: '75%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-lg z-40 transition-all duration-300"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center lg:p-4 p-2 z-50">
            <div className="w-full max-w-2xl rounded-3xl relative overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
              <div className="bg-slate-800 border border-slate-700 rounded-3xl">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-6 px-8 rounded-t-3xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <FaEdit className="text-white text-2xl" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">Edit Profile</div>
                        <div className="text-blue-100 text-sm">Update your personal information</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-white hover:text-gray-200 transition-colors p-3 rounded-xl hover:bg-white/10"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 lg:p-8">
                  <form onSubmit={handleEditSubmit} className="space-y-8">
                    {/* Avatar */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white/30 shadow-2xl overflow-hidden">
                          {profileImage || user.profilePic ? (
                            <img
                              src={profileImage || user.profilePic || ''}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaUser className="text-white text-4xl" />
                          )}
                        </div>
                        <label
                          htmlFor="modalProfilePic"
                          className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl border-2 border-white/30 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
                        >
                          <FaCamera className="text-white text-base" />
                        </label>
                        <input
                          id="modalProfilePic"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                          className="hidden"
                        />
                      </div>
                      <p className="text-slate-400 text-sm text-center">
                        Click on camera icon to change profile picture
                      </p>
                    </div>

                    {/* Name */}
                    <div className="space-y-4">
                      <label className="text-white font-semibold text-lg">Full Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 text-lg rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-4 px-6 text-lg rounded-xl font-bold transition-all duration-300 border border-slate-600 hover:border-slate-500"
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