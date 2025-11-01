'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import {
  FaCopy,
  FaCheck,
  FaSync,
  FaCoins,
  FaBolt,
  FaGem,
  FaArrowLeft,
} from 'react-icons/fa';
import {
  WagmiProvider,
  useAccount,
  useDisconnect,
  useWriteContract,
} from 'wagmi';
import { bsc } from 'wagmi/chains';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { parseUnits } from 'viem';
import { useRouter } from 'next/navigation';

const projectId = '4ed88d6c567e9799d509e8050f3f73c4';
const chains = [bsc] as const;

const wagmiConfig = defaultWagmiConfig({
  projectId,
  chains,
  metadata: {
    name: 'KRM Wallet',
    description:
      'Deposit USDT via MetaMask / TrustWallet / SafePal / TokenPocket',
    url: 'http://localhost:3000',
    icons: ['https://yourwebsite.com/icon.png'],
  },
});

if (typeof window !== 'undefined' && !(window as any).web3ModalInitialized) {
  createWeb3Modal({
    wagmiConfig,
    projectId,
    enableAnalytics: false,
    themeMode: 'dark',
  });
  (window as any).web3ModalInitialized = true;
}

const queryClient = new QueryClient();

function DepositInner() {
  const [depositAmount, setDepositAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('connectWallet');
  const router = useRouter();

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();

  const adminWallet = '0x6E84f52A49F290833928e651a86FF64e5851f422';

  // Auto switch to deposit tab when wallet connects
  useEffect(() => {
    if (isConnected) {
      setActiveTab('deposit');
    }
  }, [isConnected]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(adminWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(e.target.value);
  };

  const calculateTax = (amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    return (numAmount * 0.05).toFixed(2);
  };

  const calculateNetAmount = (amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    const tax = numAmount * 0.05;
    return (numAmount - tax).toFixed(2);
  };

  const tax = calculateTax(depositAmount);
  const netAmount = calculateNetAmount(depositAmount);

  const handleDeposit = async () => {
    if (!isConnected) return alert('⚠️ Connect your wallet first!');
    if (!depositAmount || parseFloat(depositAmount) <= 0)
      return alert('⚠️ Enter valid amount!');

    try {
      setIsLoading(true);

      const usdtContract = '0x55d398326f99059fF775485246999027B3197955';
      const usdtABI = [
        {
          name: 'transfer',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bool' }],
        },
      ];

      const amountInWei = parseUnits(depositAmount, 18);

      const txHash = await writeContractAsync({
        address: usdtContract as `0x${string}`,
        abi: usdtABI,
        functionName: 'transfer',
        args: [adminWallet as `0x${string}`, amountInWei],
      });

      setTxHash(txHash as string);
      alert('✅ Deposit sent! Confirm in your wallet.');

      // Save to MongoDB
      await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: address,
          amount: depositAmount,
          token: 'USDT (BEP20)',
          txHash,
          chain: 'BNB Smart Chain',
        }),
      });

      setDepositAmount('');
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('❌ Deposit failed, try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/d3/41/1d/d3411d9ca4a908d779248dc1dce86822.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <button
        onClick={() => router.back()}
        className="absolute top-2 left-3 z-20 flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm rounded-full border border-white/30 shadow-2xl hover:from-purple-400 hover:to-pink-400 transform hover:scale-110 transition-all duration-300 cursor-pointer group"
      >
        <FaArrowLeft className="text-white text-base group-hover:animate-pulse" />
      </button>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="lg:text-4xl text-3xl mb-4">
            💰
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              {' '}
              Deposit & Grow
            </span>
          </h1>
          <p className="text-blue-100 lg:text-xl text-lg tracking-wider max-w-3xl mx-auto">
            Boost Your Portfolio with Secure Crypto Deposits and Instant
            Processing
          </p>
        </div>

        {/* Main Card with BalanceCard Style Animation */}
        <div className="lg:p-5 p-1 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl mb-8">
          {/* Animated Border - Exactly like BalanceCard */}
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
            style={{
              background:
                'conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)',
              animationDuration: '9000ms',
              zIndex: 0,
            }}
          ></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-1"></div>

          {/* Animated Gradient Circles - Exactly like BalanceCard */}
          <div
            className="absolute -top-12 -left-12 w-24 h-24 rounded-full z-10 animate-spin"
            style={{
              background: 'linear-gradient(45deg, #7d9efb, #a83bf8)',
              animationDuration: '9000ms',
              filter: 'blur(12px)',
              opacity: '0.6',
            }}
          ></div>

          <div
            className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full z-10 animate-spin"
            style={{
              background: 'linear-gradient(135deg, #a83bf8, #7d9efb)',
              animationDuration: '4000ms',
              filter: 'blur(10px)',
              opacity: '0.4',
            }}
          ></div>

          <div
            className="absolute top-1/2 -right-8 w-16 h-16 rounded-full z-10 animate-spin"
            style={{
              background: 'linear-gradient(225deg, #7d9efb, #a83bf8)',
              animationDuration: '5000ms',
              filter: 'blur(8px)',
              opacity: '0.3',
            }}
          ></div>

          {/* Main Content */}
          <div className="relative z-20">
            {/* Header with Premium Design */}
            <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-t-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              <div className="relative">
                <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Secure Deposit Process
                </h2>
                <p className="text-blue-200 text-sm">
                  {activeTab === 'connectWallet'
                    ? 'Connect your wallet to start'
                    : 'Make your deposit securely'}
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-white/20">
              <button
                onClick={() => setActiveTab('connectWallet')}
                className={`flex-1 py-4 font-semibold transition-all duration-300 ${
                  activeTab === 'connectWallet'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                Step 1: Connect Wallet
              </button>
              <button
                onClick={() => isConnected && setActiveTab('deposit')}
                className={`flex-1 py-4 font-semibold transition-all duration-300 ${
                  activeTab === 'deposit'
                    ? 'bg-green-600 text-white'
                    : isConnected
                    ? 'text-gray-300 hover:bg-white/5'
                    : 'text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isConnected}
              >
                Step 2: Deposit
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'connectWallet' && (
                <div className="text-center">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Connect Your Wallet
                    </h3>
                    <p className="text-blue-200">
                      Connect your wallet to start the deposit process
                    </p>
                  </div>

                  {!isConnected ? (
                    <div className="flex flex-col items-center gap-4">
                      <w3m-button />
                    </div>
                  ) : (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6">
                      <div className="text-green-400 text-lg font-bold mb-2">
                        ✅ Wallet Connected Successfully!
                      </div>
                      <p className="text-green-300 text-sm mb-4">
                        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                      </p>
                      <button
                        onClick={() => setActiveTab('deposit')}
                        className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-bold transition-colors"
                      >
                        Proceed to Deposit
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'deposit' && (
                <div>
                  {!isConnected ? (
                    <div className="text-center py-8">
                      <p className="text-red-400 mb-4">
                        Please connect your wallet first
                      </p>
                      <button
                        onClick={() => setActiveTab('connectWallet')}
                        className="bg-gradient-to-br from-blue-500/70 to-purple-500/70 via-cyan-600/70 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-bold transition-colors"
                      >
                        Connect Wallet
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Connected Wallet Info */}
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-300 text-sm">
                              Connected Wallet
                            </p>
                            <p className="text-white font-mono">
                              {address?.slice(0, 8)}...{address?.slice(-6)}
                            </p>
                          </div>
                          <button
                            onClick={() => disconnect()}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>

                      {/* Security Alert */}
                      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 text-center">
                          <div className="text-orange-200 text-sm leading-relaxed">
                            <span className="font-bold">
                              🚨<strong> CRITICAL NOTICE:</strong>{' '}
                            </span>
                            Please ensure you only send{' '}
                            <strong>USDT (BEP-20)</strong> to this address.
                            Sending other cryptocurrencies may cause
                            irreversible loss.
                          </div>
                        </div>
                      </div>

                      {/* Deposit Amount Input */}
                      <div className="mb-6">
                        <label className="text-white text-lg font-bold mb-4 block">
                          Enter Deposit Amount (USDT)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-white/20 rounded-2xl text-white placeholder-blue-200 pr-12 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm text-lg"
                            placeholder="Enter amount"
                            value={depositAmount}
                            onChange={handleAmountChange}
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200">
                            <FaCoins className="text-xl" />
                          </div>
                        </div>

                        {/* Tax Calculation */}
                        {depositAmount && (
                          <div className="mt-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl p-4 border border-white/20">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-gray-400">
                                  Deposit Amount:
                                </div>
                                <div className="text-white font-bold">
                                  ${depositAmount}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-400">Tax (5%):</div>
                                <div className="text-red-400 font-bold">
                                  -${tax}
                                </div>
                              </div>
                              <div className="col-span-2 border-t border-white/20 pt-2">
                                <div className="text-gray-400">Net Amount:</div>
                                <div className="text-green-400 font-bold text-lg">
                                  ${netAmount}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Wallet Address Section */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                          <label className="text-white text-lg font-bold flex items-center gap-2">
                            <FaCoins className="text-yellow-400" />
                            Deposit Address
                          </label>
                          <span className="text-green-300 text-sm bg-green-500/20 px-3 py-1 rounded-full">
                            Active
                          </span>
                        </div>

                        <div className="relative group">
                          <input
                            type="text"
                            className="w-full p-4 pr-12 bg-gradient-to-r from-gray-900/50 to-blue-900/30 border border-white/20 rounded-2xl text-white font-mono text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 group-hover:border-blue-400/50"
                            value={adminWallet}
                            readOnly
                          />
                          <button
                            onClick={copyToClipboard}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-300 group ${
                              copied
                                ? 'bg-green-500 text-white shadow-lg scale-110'
                                : 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-300 hover:from-blue-500 hover:to-purple-500 hover:text-white hover:scale-110'
                            }`}
                          >
                            {copied ? (
                              <FaCheck className="text-sm" />
                            ) : (
                              <FaCopy className="text-sm" />
                            )}
                          </button>
                        </div>

                        {copied && (
                          <div className="text-green-400 text-sm text-center animate-bounce flex items-center justify-center gap-2 bg-green-500/10 py-2 rounded-xl border border-green-500/30">
                            <FaCheck className="text-green-400" />✅ Success!
                            Address copied to clipboard
                          </div>
                        )}
                      </div>

                      {/* Deposit Button */}
                      <button
                        onClick={handleDeposit}
                        disabled={
                          !depositAmount ||
                          parseFloat(depositAmount) <= 0 ||
                          isLoading
                        }
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 px-6 rounded-2xl font-bold text-xl tracking-wide shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <FaSync className="animate-spin" />
                            Processing Deposit...
                          </div>
                        ) : (
                          `Deposit $${
                            depositAmount || '0'
                          } (Net: $${netAmount})`
                        )}
                      </button>

                      {/* Transaction Hash Display */}
                      {txHash && (
                        <div className="mt-6 bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
                          <p className="text-green-400 text-center text-sm break-all">
                            ✅ Transaction Hash: {txHash}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid with Same Animation Style */}
        <div className="grid grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="p-1 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
            <div
              className="absolute -inset-2 rounded-2xl animate-spin opacity-60"
              style={{
                background:
                  'conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)',
                animationDuration: '8000ms',
                zIndex: 0,
              }}
            ></div>
            <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-1"></div>
            <div className="relative  backdrop-blur-sm rounded-2xl p-6 text-center   z-20">
              <FaBolt className="text-3xl text-blue-400 mx-auto mb-3 group-hover:animate-pulse" />
              <div className="text-white text-lg font-bold mb-1">
                Instant Process
              </div>
              <div className="text-blue-100 text-sm">Real-time processing</div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className=" p-0.5 rounded-2xl relative overflow-hidden bg-gray-900 shadow-2xl">
            <div
              className="absolute -inset-0.5 rounded-2xl animate-spin opacity-50"
              style={{
                background:
                  'conic-gradient(from 0deg, #a83bf8, #ff6b6b, #51cf66, #7d9efb, #a83bf8)',
                animationDuration: '8000ms',
                zIndex: 0,
              }}
            ></div>
            <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-1"></div>
            <div className="relative backdrop-blur-sm rounded-2xl p-6 text-center  z-20">
              <FaGem className="text-3xl text-purple-400 mx-auto mb-3 group-hover:animate-pulse" />
              <div className="text-white text-lg font-bold mb-1">
                Low 5% Tax
              </div>
              <div className="text-blue-100 text-sm">Competitive fees</div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50">
            <div className="lg:p-5 p-1 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
              <div
                className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
                style={{
                  background:
                    'conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)',
                  animationDuration: '9000ms',
                  zIndex: 0,
                }}
              ></div>
              <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-1"></div>
              <div className="relative bg-gradient-to-br from-gray-800 to-indigo-900 p-8 rounded-2xl shadow-2xl border border-white/10 flex flex-col items-center transform scale-110 transition-all duration-300 z-20">
                <div className="relative mb-4">
                  <FaSync className="animate-spin text-4xl text-blue-400" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                </div>
                <p className="text-white text-xl font-bold mb-2">
                  Processing Deposit...
                </p>
                <p className="text-blue-200 text-sm">
                  Confirming transaction...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Deposit() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <DepositInner />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Deposit;
