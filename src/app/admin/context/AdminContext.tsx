// src/context/AdminContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

/* -----------------------------
 * 🔧 Type Definitions
 * ----------------------------- */

type NotificationSettings = {
  push: boolean;
  email: boolean;
  sms: boolean;
};

type UserStats = {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalRevenue: number;
  growthRate: number;
};

type AdminSettings = {
  notifications: NotificationSettings;
  twoFactorAuth: boolean;
  profilePicture?: string;
};

type AdminProfile = {
  name?: string;
  email: string;
};

type AdminContextType = {
  // Data
  userStats: UserStats;
  settings: AdminSettings;
  profile: AdminProfile;

  // Actions
  updateSettings: (newSettings: Partial<AdminSettings>) => Promise<void>;
  updateProfile: (newProfile: Partial<AdminProfile>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
};

/* -----------------------------
 * 🧠 Context Initialization
 * ----------------------------- */

const AdminContext = createContext<AdminContextType | undefined>(undefined);

/* -----------------------------
 * 🧩 Provider Component
 * ----------------------------- */

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalRevenue: 0,
    growthRate: 0,
  });

  const [settings, setSettings] = useState<AdminSettings>({
    notifications: { push: true, email: false, sms: true },
    twoFactorAuth: true,
    profilePicture: "",
  });

  const [profile, setProfile] = useState<AdminProfile>({
    email: "admin@example.com",
  });

  /* -----------------------------
   * 📊 Fetch User Stats
   * ----------------------------- */
  const fetchTotalUsers = async () => {
    try {
      const res = await fetch("/api/total-users");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();

      if (data.success && typeof data.total === "number") {
        setUserStats((prev) => ({ ...prev, totalUsers: data.total }));
      } else {
        console.error("Fetch total users error:", data.error);
      }
    } catch (err) {
      console.error("Fetch total users error:", err);
    }
  };

  /* -----------------------------
   * ⚙️ Fetch Profile & Settings
   * ----------------------------- */
  const fetchProfileAndSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();

      if (data.success) {
        if (data.settings) setSettings(data.settings);
        if (data.name || data.email)
          setProfile({ name: data.name, email: data.email });
      } else {
        console.error("Fetch settings error:", data.error);
      }
    } catch (err) {
      console.error("Fetch profile/settings error:", err);
    }
  };

  /* -----------------------------
   * ✏️ Update Methods
   * ----------------------------- */
  const updateSettings = async (newSettings: Partial<AdminSettings>) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.success) setSettings(data.settings);
      else console.error("Update settings error:", data.error);
    } catch (err) {
      console.error("Update settings error:", err);
    }
  };

  const updateProfile = async (newProfile: Partial<AdminProfile>) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      });
      const data = await res.json();
      if (data.success) setProfile({ name: data.name, email: data.email });
      else console.error("Update profile error:", data.error);
    } catch (err) {
      console.error("Update profile error:", err);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return await res.json();
    } catch (err) {
      console.error("Change password error:", err);
      return { success: false, error: "Failed to change password" };
    }
  };

  /* -----------------------------
   * 🔁 Auto-refresh (polling)
   * ----------------------------- */
  useEffect(() => {
    fetchTotalUsers();
    fetchProfileAndSettings();

    const interval = setInterval(() => {
      fetchTotalUsers();
      fetchProfileAndSettings();
    }, 10000); // 10s

    return () => clearInterval(interval);
  }, []);

  /* -----------------------------
   * ✅ Context Value
   * ----------------------------- */
  const value: AdminContextType = {
    userStats,
    settings,
    profile,
    updateSettings,
    updateProfile,
    changePassword,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

/* -----------------------------
 * 🪄 Custom Hook
 * ----------------------------- */
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
