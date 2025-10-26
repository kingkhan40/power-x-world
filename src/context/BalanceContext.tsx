"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// BalanceContext type
type BalanceContextType = {
  balance: number;
  setBalance: (value: number) => void;
};

// Default context
const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  setBalance: () => {},
});

// Provider
export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(0);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

// Hook for easy usage
export const useBalance = () => useContext(BalanceContext);
