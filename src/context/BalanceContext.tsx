// context/BalanceContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// ✅ Define the shape of the context
type BalanceContextType = {
  balance: number;
  setBalance: Dispatch<SetStateAction<number>>;
  usdtBalance: number;
  addToBalance: (amount: number) => void;
  claimedRewards: number[];
  addClaimedReward: (rewardId: number) => void;
};

// ✅ Create the context with default values
const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  setBalance: () => {},
  usdtBalance: 0,
  addToBalance: () => {},
  claimedRewards: [],
  addClaimedReward: () => {},
});

// ✅ Provider component
export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(0);
  const [usdtBalance, setUsdtBalance] = useState<number>(0);
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);

  const addToBalance = (amount: number) => {
    setUsdtBalance((prev) => prev + amount);
  };

  const addClaimedReward = (rewardId: number) => {
    setClaimedRewards((prev) => [...prev, rewardId]);
  };

  return (
    <BalanceContext.Provider
      value={{ 
        balance, 
        setBalance, 
        usdtBalance, 
        addToBalance, 
        claimedRewards, 
        addClaimedReward 
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

// ✅ Custom hook to access balance context
export const useBalance = () => useContext(BalanceContext);