"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// ✅ Define the shape of the context
type BalanceContextType = {
  usdtBalance: number;
  addToBalance: (amount: number) => void;
  claimedRewards: number[];
  addClaimedReward: (rewardId: number) => void;
};

// ✅ Create the context with default values
const BalanceContext = createContext<BalanceContextType>({
  usdtBalance: 0,
  addToBalance: () => {},
  claimedRewards: [],
  addClaimedReward: () => {},
});

// ✅ Provider component
export const BalanceProvider = ({ children }: { children: ReactNode }) => {
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
      value={{ usdtBalance, addToBalance, claimedRewards, addClaimedReward }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

// ✅ Custom hook to access balance context
export const useBalance = () => useContext(BalanceContext);
