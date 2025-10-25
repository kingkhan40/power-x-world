// context/BalanceContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface BalanceContextType {
  usdtBalance: number;
  setUsdtBalance: React.Dispatch<React.SetStateAction<number>>;
  addToBalance: (amount: number) => void;
  claimedRewards: number[];
  addClaimedReward: (rewardId: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [usdtBalance, setUsdtBalance] = useState<number>(0);
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);

  useEffect(() => {
    const storedBalance = localStorage.getItem("usdtBalance");
    const storedClaimedRewards = localStorage.getItem("claimedRewards");
    if (storedBalance) {
      setUsdtBalance(parseFloat(storedBalance));
    }
    if (storedClaimedRewards) {
      setClaimedRewards(JSON.parse(storedClaimedRewards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("usdtBalance", usdtBalance.toString());
    localStorage.setItem("claimedRewards", JSON.stringify(claimedRewards));
  }, [usdtBalance, claimedRewards]);

  const addToBalance = (amount: number) => {
    setUsdtBalance((prev) => prev + amount);
  };

  const addClaimedReward = (rewardId: number) => {
    setClaimedRewards((prev) => [...prev, rewardId]);
  };

  return (
    <BalanceContext.Provider
      value={{
        usdtBalance,
        setUsdtBalance,
        addToBalance,
        claimedRewards,
        addClaimedReward,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};