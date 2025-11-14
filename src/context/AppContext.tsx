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
    user: UserData | null;
    dashboard: DashboardData;
    loading: boolean;
    balance: number;
    totalCommission: number;
    rewardPayment: number;
    otherPayments: number;
    totalBalance: number;
    setTotalBalance: (value: number) => void;
    fetchRewardData: () => Promise<{ claimedRewards: number[] }>;
    claimReward: (rewardId: number, rewardName: string, rewardAmount: string) => Promise<{ success: boolean; message: string }>;
    getDashboardData: () => Promise<DashboardData>;
    fetchDashboardData: () => Promise<void>;
    refreshDashboard: () => Promise<void>;
    setLoading: (loading: boolean) => void;
    setUser: (user: UserData | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();

    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<DashboardData>({});
    const [balance, setBalance] = useState<number>(0);
    const [totalCommission, setTotalCommission] = useState<number>(0);
    const [rewardPayment, setRewardPayment] = useState<number>(0);
    const [otherPayments, setOtherPayments] = useState<number>(0);
    const [totalBalance, setTotalBalance] = useState<number>(0);

    // Update totalBalance automatically
    useEffect(() => {
        setTotalBalance(
            (balance ?? 0) + (totalCommission ?? 0) + (rewardPayment ?? 0) + (otherPayments ?? 0)
        );
    }, [balance, totalCommission, rewardPayment, otherPayments]);

    // Fetch dashboard data
    const fetchDashboardData = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const userName = localStorage.getItem('userName');
            const userEmail = localStorage.getItem('userEmail');
            const userWallet = localStorage.getItem('userWallet');

            if (!token || !userId) {
                router.replace('/login');
                return;
            }

            setUser({
                name: userName || 'User',
                email: userEmail || '',
                wallet: userWallet || '',
                userId: userId || '',
            });

            const response = await fetch(`/api/user/dashboard?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch dashboard data');

            const data = await response.json();
            setDashboard(data);

            // Update balances
            setBalance(data.wallet ?? 0);
            setTotalCommission(data.totalCommission ?? 0);
            setRewardPayment(data.rewardPayment ?? 0);
            setOtherPayments(data.otherPayments ?? 0);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setDashboard({});
        } finally {
            setLoading(false);
        }
    };

    const getDashboardData = async (): Promise<DashboardData> => {
        const userId = localStorage.getItem('userId');
        if (!userId) return {};
        try {
            const res = await fetch(`/api/user/dashboard?userId=${userId}`);
            if (!res.ok) return {};
            return await res.json();
        } catch (err) {
            console.error('Error getting dashboard data:', err);
            return {};
        }
    };

    const fetchRewardData = async (): Promise<{ claimedRewards: number[] }> => {
        const userId = localStorage.getItem('userId');
        if (!userId) return { claimedRewards: [] };
        try {
            const res = await fetch(`/api/user/rewards?userId=${userId}`);
            if (!res.ok) return { claimedRewards: [] };
            const data = await res.json();
            return { claimedRewards: data.claimedRewards || [] };
        } catch (err) {
            console.error('Error fetching reward data:', err);
            return { claimedRewards: [] };
        }
    };

    const claimReward = async (
        rewardId: number,
        rewardName: string,
        rewardAmount: string
    ): Promise<{ success: boolean; message: string }> => {
        const userId = localStorage.getItem('userId');
        if (!userId) return { success: false, message: 'User not found' };

        try {
            const res = await fetch('/api/user/reward', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, rewardId, rewardName, rewardAmount }),
            });
            const data = await res.json();
            return { success: res.ok, message: data.message || 'Reward claimed' };
        } catch (err) {
            console.error('Error claiming reward:', err);
            return { success: false, message: 'Error claiming reward' };
        }
    };

    const refreshDashboard = async (): Promise<void> => {
        setLoading(true);
        await fetchDashboardData();
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const value: AppContextType = {
        user,
        dashboard,
        loading,
        balance,
        totalCommission,
        rewardPayment,
        otherPayments,
        totalBalance,
        setTotalBalance,
        fetchRewardData,
        claimReward,
        getDashboardData,
        fetchDashboardData,
        refreshDashboard,
        setLoading,
        setUser,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};
