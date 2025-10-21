"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { FaCopy, FaCheck, FaSync } from "react-icons/fa";
import {
  WagmiProvider,
  useAccount,
  useDisconnect,
  useWriteContract,
} from "wagmi";
import { bsc } from "wagmi/chains";
import {
  createWeb3Modal,
  defaultWagmiConfig,
} from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { parseUnits } from "viem";

const projectId = "4ed88d6c567e9799d509e8050f3f73c4"; // ✅ Web3Modal project id
const chains = [bsc] as const;

const wagmiConfig = defaultWagmiConfig({
  projectId,
  chains,
  metadata: {
    name: "KRM Wallet",
    description: "Deposit USDT via MetaMask / TrustWallet / SafePal / TokenPocket",
    url: "https://yourwebsite.com",
    icons: ["https://yourwebsite.com/icon.png"],
  },
});

if (typeof window !== "undefined" && !(window as any).web3ModalInitialized) {
  createWeb3Modal({
    wagmiConfig,
    projectId,
    enableAnalytics: false,
    themeMode: "dark",
  });
  (window as any).web3ModalInitialized = true;
}

const queryClient = new QueryClient();

function DepositInner() {
  const [depositAmount, setDepositAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();

  const adminWallet = "0xB34aA0eEb2424C7DE1587b417B3Ba923e82847d9"; //  your receiving wallet

  const copyToClipboard = () => {
    navigator.clipboard.writeText(adminWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDeposit = async () => {
    if (!isConnected) return alert("⚠️ Connect your wallet first!");
    if (!depositAmount || parseFloat(depositAmount) <= 0)
      return alert("⚠️ Enter valid amount!");

    try {
      setIsLoading(true);

      const usdtContract = "0x55d398326f99059fF775485246999027B3197955"; // USDT (BEP20)
      const usdtABI = [
        {
          name: "transfer",
          type: "function",
          stateMutability: "nonpayable",
          inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
          ],
          outputs: [{ name: "", type: "bool" }],
        },
      ];

      const amountInWei = parseUnits(depositAmount, 18);

      const txHash = await writeContractAsync({
        address: usdtContract as `0x${string}`,
        abi: usdtABI,
        functionName: "transfer",
        args: [adminWallet as `0x${string}`, amountInWei],
      });

      setTxHash(txHash as string);
      alert("✅ Deposit sent! Confirm in your wallet.");

      // Save to MongoDB
      await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: address,
          amount: depositAmount,
          token: "USDT (BEP20)",
          txHash,
          chain: "BNB Smart Chain",
        }),
      });

      setDepositAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
      alert("❌ Deposit failed, try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative">
      <div className="absolute inset-0 bg-[url('https://i.pinimg.com/1200x/d3/41/1d/d3411d9ca4a908d779248dc1dce86822.jpg')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-full max-w-md p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
        {!isConnected ? (
          <div className="text-center">
            <h2 className="text-xl mb-4 font-semibold">Connect Your Wallet</h2>
            <w3m-button />
          </div>
        ) : (
          <>
            <p className="text-green-400 text-center mb-4">
              ✅ Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>

            <div className="relative mb-4">
              <input
                type="text"
                value={adminWallet}
                readOnly
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-sm font-mono"
              />
              <button
                onClick={copyToClipboard}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg ${
                  copied ? "bg-green-600" : "bg-blue-600"
                }`}
              >
                {copied ? <FaCheck /> : <FaCopy />}
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter amount (USDT)"
              value={depositAmount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDepositAmount(e.target.value)
              }
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-sm text-white mb-3"
            />

            <button
              onClick={handleDeposit}
              disabled={isLoading}
              className="w-full bg-green-600 py-3 rounded-xl font-bold"
            >
              {isLoading ? "Processing..." : "Confirm Deposit"}
            </button>

            {txHash && (
              <p className="mt-4 text-center text-sm text-green-400 break-all">
                ✅ Tx Hash: {txHash}
              </p>
            )}

            <button
              onClick={() => disconnect()}
              className="mt-4 w-full bg-red-600 py-2 rounded-xl font-bold"
            >
              Disconnect Wallet
            </button>
          </>
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <FaSync className="animate-spin text-4xl text-blue-400" />
        </div>
      )}
    </div>
  );
}

export default function Deposit() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <DepositInner />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
