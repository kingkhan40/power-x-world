// context/AdminContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* -----------------------------
 * 🔧 Type Definitions
 * ----------------------------- */

interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalRevenue: number;
  growthRate: number;
}

interface AdminSettings {
  notifications: NotificationSettings;
  twoFactorAuth: boolean;
  profilePicture?: string;
}

interface AdminProfile {
  name?: string;
  email: string;
}

interface AdminContextType {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Stats
  userStats: UserStats;
  updateUserStats: (stats: Partial<UserStats>) => void;

  // Settings
  settings: AdminSettings;
  updateSettings: (newSettings: Partial<AdminSettings>) => Promise<void>;

  // Profile
  profile: AdminProfile;
  updateProfile: (profile: Partial<AdminProfile>) => Promise<void>;

  // Password
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
}

/* -----------------------------
 * 🧩 Context Creation
 * ----------------------------- */

const AdminContext = createContext<AdminContextType | undefined>(undefined);

/* -----------------------------
 * 🧠 Provider Component
 * ----------------------------- */

export function AdminProvider({ children }: { children: ReactNode }) {
  /** -------------------------------
   * 📁 STATE
   * ------------------------------- */
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  });

  const [profile, setProfile] = useState<AdminProfile>({
    email: "admin@example.com",
  });

  /** -------------------------------
   * 📊 USER STATS: SSE + Polling
   * ------------------------------- */

  const updateUserStats = (newStats: Partial<UserStats>) => {
    setUserStats((prev) => ({ ...prev, ...newStats }));
  };

  const fetchTotalUsers = async () => {
    try {
      const res = await fetch("/api/total-users");
      const data = await res.json();
      if (data.success) {
        setUserStats((prev) => ({ ...prev, totalUsers: data.total }));
      }
    } catch (error) {
      console.error("Fetch total users error:", error);
    }
  };

  useEffect(() => {
    const eventSource = new EventSource("/api/total-users/sse");

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.total !== undefined) {
          setUserStats((prev) => ({ ...prev, totalUsers: data.total }));
        }
      } catch (err) {
        console.error("Failed to parse SSE message:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  // Fallback polling
  useEffect(() => {
    fetchTotalUsers();
    const interval = setInterval(fetchTotalUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  /** -------------------------------
   * ⚙️ SETTINGS: Fetch + SSE + Update
   * ------------------------------- */

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setProfile({ name: data.name, email: data.email });
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
    }
  };

  const updateSettings = async (newSettings: Partial<AdminSettings>) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Update settings error:", error);
    }
  };

  useEffect(() => {
    const eventSource = new EventSource("/api/settings/sse");

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setSettings(data);
      } catch (err) {
        console.error("Failed to parse settings SSE message:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Settings SSE connection error:", err);
      eventSource.close();
    };

    fetchSettings();
    const interval = setInterval(fetchSettings, 10000);

    return () => {
      eventSource.close();
      clearInterval(interval);
    };
  }, []);

  /** -------------------------------
   * 👤 PROFILE + PASSWORD MANAGEMENT
   * ------------------------------- */

  const updateProfile = async (newProfile: Partial<AdminProfile>) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      });
      const data = await res.json();
      if (data.success) {
        setProfile({ name: data.name, email: data.email });
      }
    } catch (error) {
      console.error("Update profile error:", error);
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
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Change password error:", error);
      return { success: false, error: "Failed to change password" };
    }
  };

  /** -------------------------------
   * ✅ PROVIDER VALUE
   * ------------------------------- */
  const value: AdminContextType = {
    sidebarOpen,
    setSidebarOpen,
    userStats,
    updateUserStats,
    settings,
    updateSettings,
    profile,
    updateProfile,
    changePassword,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

/* -----------------------------
 * 🪄 Custom Hook
 * ----------------------------- */

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
