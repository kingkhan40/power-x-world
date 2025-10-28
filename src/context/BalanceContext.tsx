"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// ✅ Type for context value
interface BalanceContextType {
  balance: number;
  setBalance: (value: number) => void;
}

// ✅ Create context with default empty value
const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// ✅ Provider component
export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

// ✅ Custom hook for usage
export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};
