'use client';

import React, { useEffect, useState } from 'react';
import {
  FaCoins,
  FaDollarSign,
  FaLock,
  FaExchangeAlt,
  FaShieldAlt,
  FaRocket,
  FaArrowLeft, // Added back arrow icon
} from 'react-icons/fa';
import { useBalance } from '@/context/BalanceContext';
import { useRouter } from 'next/navigation'; // Added for navigation
import Loader from '@/components/UI/Loader';

function WithdrawPage() {
  const router = useRouter(); // Initialize router
  const { balance, setBalance } = useBalance();
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const email =
    typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;


  useEffect(() => {
    const fetchBalance = async () => {
      if (!email) return;
      try {
        const res = await fetch(`/api/user-balance?email=${email}`);
        const data = await res.json();
        if (data.success) {
          setBalance(data.balance);
        }
      } catch (err) {
        console.error('Error fetching balance:', err);
      } finally {
        setLoading(false);
      }
    };

    if (balance === 0) {
      fetchBalance();
    } else {
      setLoading(false);
    }
  }, [email, balance, setBalance]);

  const handleWithdraw = async () => {
    if (!walletAddress || !amount) {
      alert('⚠️ Please fill in all required fields.');
      return;
    }

    if (Number(amount) > balance) {
      alert('❌ Insufficient balance for withdrawal.');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          walletAddress,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Withdrawal successful!');
        setBalance(data.newBalance);
        setWalletAddress('');
        setAmount('');
      } else {
        alert(data.message || '❌ Withdrawal failed.');
      }
    } catch (err) {
      console.error('Withdraw error:', err);
      alert('❌ Something went wrong.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className="min-h-screen py-8 px-4 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/d0/e3/f1/d0e3f13661d856add08f293b86bf25d0.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background Overlays */}
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Animated Background Elements - Like BalanceCard */}
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

      <div
        className="absolute top-1/4 -left-8 w-20 h-20 rounded-full z-10 animate-spin"
        style={{
          background: 'linear-gradient(315deg, #ff6b6b, #51cf66)',
          animationDuration: '7000ms',
          filter: 'blur(9px)',
          opacity: '0.5',
        }}
      ></div>

      {/* Back Arrow Button - Top Left Corner */}
      <button
        onClick={() => router.back()}
        className="absolute top-2 left-3 z-20 flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm rounded-full border border-white/30 shadow-2xl hover:from-purple-400 hover:to-pink-400 transform hover:scale-110 transition-all duration-300 cursor-pointer group"
      >
        <FaArrowLeft className="text-white text-base group-hover:animate-pulse" />
      </button>

      <div className="container p-1 mx-auto max-w-2xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="lg:text-4xl text-3xl mb-4">
            💸
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              {' '}
              Withdraw Funds
            </span>
          </h1>
          <p className="text-blue-100 lg:text-xl text-lg tracking-wider max-w-3xl mx-auto">
            Secure and instant withdrawal process with real-time processing
          </p>
        </div>

        {/* ✅ Main Card with Animated Border - Like BalanceCard */}
        <div className="lg:p-5 p-1 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl mb-8">
          {/* 🔥 Main Rotating Border */}
          <div
            className="absolute -inset-1 rounded-2xl animate-spin opacity-70"
            style={{
              background:
                'conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)',
              animationDuration: '9000ms',
              zIndex: 0,
            }}
          ></div>

          {/* 🔥 Secondary Rotating Border */}
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-50"
            style={{
              background:
                'conic-gradient(from 180deg, #51cf66, #ff6b6b, #a83bf8, #7d9efb, #51cf66)',
              animationDuration: '12000ms',
              zIndex: 0,
            }}
          ></div>

          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 z-1"></div>

          {/* Additional Animated Circles Inside Card */}
          <div
            className="absolute top-4 right-4 w-12 h-12 rounded-full z-10 animate-spin"
            style={{
              background: 'linear-gradient(45deg, #7d9efb, #a83bf8)',
              animationDuration: '8000ms',
              filter: 'blur(6px)',
              opacity: '0.4',
            }}
          ></div>

          <div
            className="absolute bottom-4 left-4 w-10 h-10 rounded-full z-10 animate-spin"
            style={{
              background: 'linear-gradient(135deg, #a83bf8, #7d9efb)',
              animationDuration: '6000ms',
              filter: 'blur(5px)',
              opacity: '0.3',
            }}
          ></div>

          {/* Content */}
          <div className="relative z-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900/90 via-blue-900/90 to-purple-900/90 p-6 text-center relative overflow-hidden rounded-t-2xl">
              <div className="relative">
                <h2 className="lg:text-2xl text-xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Secure Withdrawal Process
                </h2>
                <p className="text-blue-200 text-sm">Enter withdrawal amount</p>
              </div>
            </div>

            <div className="lg:p-8 p-2">
              {/* Balance Display - Similar to BalanceCard */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Available Balance */}
                <div className="flex flex-col bg-gradient-to-r from-pink-950 to-blue-950 rounded-xl items-center w-full p-2 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCoins className="text-yellow-400 text-xl" />
                    <h3 className="text-lg font-bold text-white">
                      ${balance.toFixed(2)}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300">Available Balance</p>
                </div>

                {/* Withdrawal Fee */}
                <div className="flex flex-col bg-gradient-to-r from-cyan-950 to-indigo-950 rounded-xl items-center w-full p-2 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FaExchangeAlt className="text-green-400 text-xl" />
                    <h3 className="text-lg font-bold text-green-400">5%</h3>
                  </div>
                  <p className="text-sm text-gray-300">Withdrawal Fee</p>
                </div>
              </div>

              {/* Wallet Address Section */}
              <div className="mb-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
                  <FaLock className="text-blue-300" />
                  Send to Wallet Address
                  <FaShieldAlt className="text-green-400 ml-2 text-sm" />
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter your USDT wallet address"
                    className="w-full p-4 pr-12 bg-gray-800/50 outline-none border border-white/30 rounded-xl text-white font-mono text-sm backdrop-blur-sm transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Ensure the wallet address is correct and supports USDT
                </p>
              </div>

              {/* Amount Section */}
              <div className="mb-6">
                <label className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaDollarSign className="text-green-400" />
                  Enter Withdrawal Amount
                  <span className="text-red-300 ml-1">*</span>
                </label>

                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    max={balance}
                    step="0.01"
                    className="w-full p-4 pr-12 bg-gray-800/50 outline-none border border-white/30 rounded-xl text-white font-mono text-lg backdrop-blur-sm transition-all duration-300 focus:border-green-400 focus:ring-2 focus:ring-green-400/30"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-mono">
                    USDT
                  </span>
                </div>

                {/* Amount Info */}
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Minimum: $5.00</span>
                  <span>Maximum: ${balance.toFixed(2)}</span>
                </div>
              </div>

              {/* Calculation Section */}
              {amount && Number(amount) > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-white/10">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <FaRocket className="text-yellow-400" />
                    Withdrawal Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Amount:</span>
                      <span className="text-white">
                        ${Number(amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Fee (5%):</span>
                      <span className="text-red-400">
                        -${(Number(amount) * 0.05).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-1">
                      <span className="text-gray-300">You'll Receive:</span>
                      <span className="text-green-400 font-semibold">
                        ${(Number(amount) * 0.95).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleWithdraw}
                disabled={
                  !walletAddress ||
                  !amount ||
                  Number(amount) <= 0 ||
                  Number(amount) > balance ||
                  processing
                }
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaExchangeAlt />
                      {!walletAddress || !amount || Number(amount) <= 0
                        ? 'Fill All Fields'
                        : Number(amount) > balance
                        ? 'Insufficient Balance'
                        : 'Confirm Withdrawal'}
                    </>
                  )}
                </span>
              </button>

              {/* Security Note */}
              <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border border-yellow-400/30">
                <div className="flex items-center gap-2 text-sm">
                  <FaShieldAlt className="text-yellow-400" />
                  <span className="text-yellow-200">Secure Transaction</span>
                </div>
                <p className="text-xs text-yellow-100/70 mt-1">
                  Your withdrawal will be processed within 2-4 hours. Contact
                  support for urgent requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawPage;
