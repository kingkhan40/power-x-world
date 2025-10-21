// app/admin/context/AdminContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userStats: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    totalRevenue: number;
    growthRate: number;
  };
  updateUserStats: (stats: Partial<AdminContextType['userStats']>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    totalUsers: 1250,
    activeUsers: 892,
    newUsers: 45,
    totalRevenue: 12458,
    growthRate: 24.5,
  });

  const updateUserStats = (newStats: Partial<AdminContextType['userStats']>) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  };

  const value: AdminContextType = {
    sidebarOpen,
    setSidebarOpen,
    userStats,
    updateUserStats,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}