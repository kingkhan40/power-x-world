"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import socket from "@/lib/socket"; // ✅ default import

// Context ka type define karo
interface BalanceContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

// Default null se context create
const BalanceContext = createContext<BalanceContextType | null>(null);

interface BalanceProviderProps {
  children: ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    // ✅ Jab socket se balance update event aaye
    socket.on("rewardUpdated", (data: { newBalance: number }) => {
      if (data && typeof data.newBalance === "number") {
        setBalance(data.newBalance);
      }
    });

    return () => {
      socket.off("rewardUpdated");
    };
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

// Custom hook for consuming the context
export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};

export default BalanceContext;
