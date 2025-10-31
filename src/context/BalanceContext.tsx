'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// ✅ Define the shape of the context
type BalanceContextType = {
  balance: number;
  setBalance?: (balance: number) => void;
};

// ✅ Create the context with default value
const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
});

// ✅ Provider component
export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(0);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

// ✅ Custom hook to access balance context
export const useBalance = () => useContext(BalanceContext);
