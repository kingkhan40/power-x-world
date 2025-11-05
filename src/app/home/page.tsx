'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useBalance } from '@/context/BalanceContext';
import BalanceCard from '@/components/BalanceCard';
import BasicPlan from '@/components/BasicPlan';
import IconGridNavigation from '@/components/IconGridNavigation';
import InvestmentInfo from '@/components/InvestmentInfo';
import Loader from '@/components/UI/Loader';
import { initSocket } from '@/lib/socket';

function HomePage() {
  const { totalBalance, setTotalBalance } = useApp();
  const { setBalance: setContextBalance } = useBalance();

  const [todayIncome, setTodayIncome] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ email?: string; wallet?: string } | null>(null);

  // ✅ Load user info from localStorage once
  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    const userWalletKey = localStorage.getItem('userWallet');
    const walletAddressKey = localStorage.getItem('walletAddress');

    if (rawUser) {
      try {
        const parsedUser = JSON.parse(rawUser);
        setUser(parsedUser);
      } catch {
        console.warn('Invalid JSON in localStorage "user" key');
      }
    } else {
      setUser({
        email: localStorage.getItem('userEmail') || undefined,
        wallet: userWalletKey || walletAddressKey || undefined,
      });
    }

    setLoading(false);
  }, []);

  // ✅ Initialize Socket and listen for balance updates
  useEffect(() => {
    const s = initSocket();
    if (!s) {
      console.warn('Socket not initialized (server-side or blocked).');
      return;
    }

    const wallet =
      localStorage.getItem('walletAddress') ||
      localStorage.getItem('userWallet') ||
      (user && user.wallet) ||
      null;

    console.log('🔎 Socket check:', s.id, 'wallet:', wallet);

    if (!wallet) {
      console.warn('No wallet found in storage or user object.');
      return;
    }

    try {
      console.log('📡 Registering wallet with socket:', wallet);
      s.emit('register', { wallet });

      s.on('balanceUpdated', (data: { newBalance: number; wallet?: string }) => {
        console.log('💰 Live balance update received:', data);
        if (typeof data.newBalance === 'number') {
          setTotalBalance?.(data.newBalance);
          setContextBalance?.(data.newBalance);
        }
      });

      s.on('connect', () => console.log('🟢 Socket connected (home page):', s.id));
      s.on('disconnect', (reason) => console.warn('⚪ Socket disconnected (home page):', reason));
    } catch (err) {
      console.error('Error during socket register/listen:', err);
    }

    return () => {
      try {
        s.off('balanceUpdated');
      } catch {}
    };
    // ⚙ only depend on `user` so dependencies remain stable
  }, [user]);

  // ✅ Fetch today's income (unchanged)
  useEffect(() => {
    const fetchTodayIncome = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const res = await fetch(`/api/stake/user?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch user stake data');

        const data = await res.json();
        if (data?.activeStake) {
          const todayReward =
            data.activeStake.todayReward ??
            data.activeStake.rewardsEarned ??
            data.totalEarned ??
            0;
          setTodayIncome(todayReward);
        } else {
          setTodayIncome(0);
        }
      } catch (err) {
        console.error('Error fetching today income:', err);
        setTodayIncome(0);
      }
    };

    fetchTodayIncome();
  }, []);

  // ✅ Sync balance between contexts
  useEffect(() => {
    if (typeof totalBalance === 'number') {
      setContextBalance?.(totalBalance);
    }
  }, [totalBalance]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className="min-h-screen relative text-white"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/21/e7/a7/21e7a74605dc7bc6b548b7ecb00cf900.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="container mx-auto px-3 lg:px-6 py-6 relative z-10 space-y-6">
        <div className="space-y-4">
          <BalanceCard balance={totalBalance ?? 0} />
          <InvestmentInfo userEmail={user?.email ?? ''} />
          <IconGridNavigation />
          <BasicPlan />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
