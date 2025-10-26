// src/context/BalanceContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface BalanceContextType {
  usdtBalance: number;
  addToBalance: (amount: number) => void;
  claimedRewards: number[];
  addClaimedReward: (rewardId: number) => void;
}

interface Props {
  children: ReactNode;
}

export const BalanceContext = createContext<BalanceContextType | null>(null);

export const BalanceProvider = ({ children }: Props) => {
  const [usdtBalance, setUsdtBalance] = useState<number>(0);
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);

  const addToBalance = (amount: number) => setUsdtBalance((prev) => prev + amount);
  const addClaimedReward = (rewardId: number) =>
    setClaimedRewards((prev) => [...prev, rewardId]);

  return (
    <BalanceContext.Provider
      value={{ usdtBalance, addToBalance, claimedRewards, addClaimedReward }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

// Custom hook
export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (!context) throw new Error("useBalance must be used inside BalanceProvider");
  return context;
};
