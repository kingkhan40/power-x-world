// app/admin/context/AdminContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalRevenue: number;
  growthRate: number;
}

interface AdminContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userStats: UserStats;
  updateUserStats: (stats: Partial<UserStats>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 1250,
    activeUsers: 892,
    newUsers: 45,
    totalRevenue: 12458,
    growthRate: 24.5,
  });

  const updateUserStats = (newStats: Partial<UserStats>) => {
    setUserStats((prev) => ({ ...prev, ...newStats }));
  };

  // ✅ Real-time updates via Server-Sent Events (SSE)
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

    return () => {
      eventSource.close();
    };
  }, []);

  const value: AdminContextType = {
    sidebarOpen,
    setSidebarOpen,
    userStats,
    updateUserStats,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
