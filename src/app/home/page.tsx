'use client';
import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useBalance } from '@/context/BalanceContext';
import BalanceCard from '@/components/BalanceCard';
import BasicPlan from '@/components/BasicPlan';
import IconGridNavigation from '@/components/IconGridNavigation';
import InvestmentInfo from '@/components/InvestmentInfo';
import Loader from '@/components/UI/Loader';

function HomePage() {
  const { user, loading, totalBalance } = useApp();
  const { setBalance: setContextBalance } = useBalance();

  useEffect(() => {
    setContextBalance?.(totalBalance);
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
        {/* Main Content */}
        <div className="space-y-4">
          <BalanceCard balance={totalBalance} />
          <InvestmentInfo userEmail={user?.email ?? ''} />
          <IconGridNavigation />
          <BasicPlan />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
