"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ✅ Define the types for our context values
interface BalanceContextType {
  balance: number;
  setBalance: (value: number) => void;
  usdtBalance: number;
  addToBalance: (amount: number) => void;
  claimedRewards: number[];
  addClaimedReward: (rewardId: number) => void;
  resetBalances: () => void;
}

// ✅ Create the context
const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// ✅ Provider component
export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Balances
  const [balance, setBalance] = useState<number>(0);
  const [usdtBalance, setUsdtBalance] = useState<number>(0);

  // Rewards
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const storedBalance = localStorage.getItem("balance");
    const storedUsdtBalance = localStorage.getItem("usdtBalance");
    const storedRewards = localStorage.getItem("claimedRewards");

    if (storedBalance) setBalance(parseFloat(storedBalance));
    if (storedUsdtBalance) setUsdtBalance(parseFloat(storedUsdtBalance));
    if (storedRewards) setClaimedRewards(JSON.parse(storedRewards));
  }, []);

  // ✅ Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem("balance", balance.toString());
    localStorage.setItem("usdtBalance", usdtBalance.toString());
    localStorage.setItem("claimedRewards", JSON.stringify(claimedRewards));
  }, [balance, usdtBalance, claimedRewards]);

  // ✅ Add amount to USDT balance
  const addToBalance = (amount: number) => {
    setUsdtBalance((prev) => prev + amount);
  };

  // ✅ Mark reward as claimed
  const addClaimedReward = (rewardId: number) => {
    setClaimedRewards((prev) => [...prev, rewardId]);
  };

  // ✅ Reset all balances and rewards
  const resetBalances = () => {
    setBalance(0);
    setUsdtBalance(0);
    setClaimedRewards([]);
    localStorage.clear();
  };

  return (
    <BalanceContext.Provider
      value={{
        balance,
        setBalance,
        usdtBalance,
        addToBalance,
        claimedRewards,
        addClaimedReward,
        resetBalances,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

// ✅ Custom hook for easy access
export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};
