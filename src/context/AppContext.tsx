'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Types
export interface RewardPlan {
  id: number;
  name: string;
  selfBusiness: string;
  directBusiness: string;
  rewardAmount: string;
  color: string;
  icon: JSX.Element;
  image: string;
  achieved: boolean;
}

export interface DashboardData {
  level?: number;
  totalTeam?: number;
  activeUsers?: number;
  wallet?: number;
  totalCommission?: number;
  rewardPayment?: number;
  otherPayments?: number;
  selfBusiness?: number;
  directBusiness?: number;
}

export interface UserData {
  name?: string;
  email?: string;
  wallet?: string;
  userId?: string;
}

interface AppContextType {
  // Dashboard States
  user: UserData | null;
  dashboard: DashboardData;
  loading: boolean;
  
  // Balance States
  balance: number;
  totalCommission: number;
  rewardPayment: number;
  otherPayments: number;
  totalBalance: number;

  // Balance Setter (exposed so other components can update totalBalance)
  setTotalBalance: (value: number) => void;

  // Reward API Functions
  fetchRewardData: () => Promise<{ claimedRewards: number[] }>;
  claimReward: (rewardId: number, rewardName: string, rewardAmount: string) => Promise<{ success: boolean; message: string }>;
  getDashboardData: () => Promise<DashboardData>;

  // Dashboard Functions
  fetchDashboardData: () => Promise<void>;
  refreshDashboard: () => Promise<void>;

  // Utility Functions
  setLoading: (loading: boolean) => void;
  setUser: (user: UserData | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData>({});
  
  // Balance states
  const [balance, setBalance] = useState<number>(0);
  const [totalCommission, setTotalCommission] = useState<number>(0);
  const [rewardPayment, setRewardPayment] = useState<number>(0);
  const [otherPayments, setOtherPayments] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  // Update totalBalance automatically when components change
  useEffect(() => {
    setTotalBalance(
      (balance ?? 0) + (totalCommission ?? 0) + (rewardPayment ?? 0) + (otherPayments ?? 0)
    );
  }, [balance, totalCommission, rewardPayment, otherPayments]);

  // Fetch dashboard data
  const fetchDashboardData = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      const userWallet = localStorage.getItem('userWallet');
      const userId = localStorage.getItem('userId');

      if (!token) {
        router.replace('/login');
        return;
      }

      // Set user data from localStorage
      setUser({
        name: userName || 'User',
        email: userEmail || '',
        wallet: userWallet || '',
        userId: userId || '',
      });

      // Fetch dashboard info from API
      if (userId) {
        const response = await fetch(`/api/user/dashboard?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch dashboard data');

        const data = await response.json();
        setDashboard(data);

        // Update balances
        setBalance(data.wallet ?? 0);
        setTotalCommission(data.totalCommission ?? 0);
        setRewardPayment(data.rewardPayment ?? 0);
        setOtherPayments(data.otherPayments ?? 0);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get dashboard data for rewards page
  const getDashboardData = async (): Promise<DashboardData> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User not found');

      const response = await fetch(`/api/user/dashboard?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      return await response.json();
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return {};
    }
  };

  // Fetch reward data
  const fetchRewardData = async (): Promise<{ claimedRewards: number[] }> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return { claimedRewards: [] };

      const response = await fetch(`/api/user/rewards?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        return { claimedRewards: data.claimedRewards || [] };
      }
      return { claimedRewards: [] };
    } catch (error) {
      console.error('Error fetching reward data:', error);
      return { claimedRewards: [] };
    }
  };

  // Claim reward API call
  const claimReward = async (rewardId: number, rewardName: string, rewardAmount: string): Promise<{ success: boolean; message: string }> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return { success: false, message: 'User not found' };
      }

      const res = await fetch('/api/user/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          rewardId: rewardId,
          rewardName: rewardName,
          rewardAmount: rewardAmount,
        }),
      });

      const data = await res.json();
      return { 
        success: res.ok, 
        message: data.message || (res.ok ? 'Reward claimed successfully' : 'Failed to claim reward')
      };
    } catch (error) {
      console.error('Error claiming reward:', error);
      return { success: false, message: 'An error occurred while claiming the reward' };
    }
  };

  // Refresh dashboard data
  const refreshDashboard = async (): Promise<void> => {
    setLoading(true);
    await fetchDashboardData();
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const value: AppContextType = {
    // States
    user,
    dashboard,
    loading,
    balance,
    totalCommission,
    rewardPayment,
    otherPayments,
    totalBalance,

    // Setter
    setTotalBalance,

    // API Functions
    fetchRewardData,
    claimReward,
    getDashboardData,

    // Dashboard Functions
    fetchDashboardData,
    refreshDashboard,

    // Utility Functions
    setLoading,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use AppContext
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
