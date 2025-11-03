'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useBalance } from '@/context/BalanceContext';
import BalanceCard from '@/components/BalanceCard';
import BasicPlan from '@/components/BasicPlan';
import IconGridNavigation from '@/components/IconGridNavigation';
import InvestmentInfo from "@/components/InvestmentInfo";

import Loader from '@/components/UI/Loader';

function HomePage() {
  const { user, loading, totalBalance } = useApp();
  const { setBalance: setContextBalance } = useBalance();

  const [todayIncome, setTodayIncome] = useState<number>(0);

  // ✅ Fetch today's income from API
  useEffect(() => {
    const fetchTodayIncome = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const res = await fetch(`/api/stake/user?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch user stake data');

        const data = await res.json();

        if (data?.activeStake) {
          // ✅ try to read todayReward or fallback to totalReward / totalEarned
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

  // ✅ Sync balance context safely
  useEffect(() => {
    if (typeof totalBalance === 'number') {
      setContextBalance?.(totalBalance);
    }
  }, [totalBalance, setContextBalance]);

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
        {/* ✅ Main Content (UI untouched) */}
        <div className="space-y-4">
          <BalanceCard balance={totalBalance ?? 0} />
          <InvestmentInfo
            userEmail={user?.email ?? ''}
            todayIncome={todayIncome ?? 0}
          />
          <IconGridNavigation />
          <BasicPlan />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
