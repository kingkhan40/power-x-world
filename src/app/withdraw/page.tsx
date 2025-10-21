'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaDollarSign, FaKey, FaCopy, FaArrowLeft, FaCheck, FaCoins, FaLock } from 'react-icons/fa';

const Withdrawal = () => {
  const [step, setStep] = useState<number>(1);
  const [amount, setAmount] = useState<string>('');
  const [mpin, setMpin] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const mainBalance = 50.03;
  const taxRate = 0.05; // 5%
  const taxAmount = amount ? (parseFloat(amount) * taxRate).toFixed(2) : '0.00';
  const netAmount = amount ? (parseFloat(amount) - parseFloat(taxAmount)).toFixed(2) : '0.00';

  const walletAddress = "0xFfdb5dCE9702Bb9dD1C2E90Ee1555F71e8C081D8";

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleMpinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setMpin(value);
    }
  };

  const handleProceed = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (amount && amountNum >= 5 && amountNum <= mainBalance) {
      setStep(2);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmWithdrawal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mpin.length === 6) {
      console.log('Withdrawal confirmed:', { amount, taxAmount, netAmount, mpin });
      alert('Withdrawal request submitted successfully!');
    }
  };

  const handleBack = () => {
    setStep(1);
    setMpin('');
  };

  const amountNum = parseFloat(amount) || 0;
  const isAmountValid = amountNum >= 5;
  const hasSufficientBalance = amountNum <= mainBalance;
  const isProceedDisabled = !amount || !isAmountValid || !hasSufficientBalance;

  return (
    <div 
      className="min-h-screen py-8 px-4 relative"
      style={{
        backgroundImage: "url('https://i.pinimg.com/1200x/d0/e3/f1/d0e3f13661d856add08f293b86bf25d0.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Light overlay instead of dark */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Header Section - Like ContactUs */}
        <div className="text-center mb-8">
          <h1 className="lg:text-4xl text-3xl mb-4">
            💸 
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"> Withdraw Funds</span> 
          </h1>
          <p className="text-blue-100 lg:text-xl text-lg tracking-wider max-w-3xl mx-auto">
            Secure and instant withdrawal process with real-time processing
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-white/20 via-white/15 to-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900/90 via-blue-900/90 to-purple-900/90 p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
            <div className="relative">
              <h2 className="lg:text-2xl text-xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Secure Withdrawal Process
              </h2>
              <p className="text-blue-200 text-sm">
                {step === 1 ? "Enter withdrawal amount" : "Confirm transaction details"}
              </p>
            </div>
          </div>

          <div className="lg:p-8 p-6">
            {/* Step 1: Amount Input */}
            {step === 1 && (
              <>
                {/* Balance Card */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30">
                  <p className='text-blue-100 text-sm tracking-wider mb-2'>Available Balance</p>
                  <div className="flex items-center justify-between">
                    <p className='lg:text-3xl text-2xl font-bold text-white'>{mainBalance}$</p>
                    <FaCoins className="text-3xl text-yellow-400" />
                  </div>
                </div>

                <form onSubmit={handleProceed}>
                  <div className="mb-6">
                    <label className="text-white text-lg font-semibold mb-4 block  items-center gap-2">
                      <FaDollarSign className="text-green-400" />
                      Enter Withdrawal Amount
                      <span className="text-red-300 ml-1">*</span>
                    </label>
                    
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full p-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-blue-200 pr-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm text-lg"
                        placeholder="Enter withdrawal amount"
                        value={amount}
                        onChange={handleAmountChange}
                        min="5"
                        max={mainBalance}
                        step="0.01"
                        required
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200">
                        <FaDollarSign className="text-xl" />
                      </div>
                    </div>
                    
                    {/* Validation Messages */}
                    <div className="mt-4 space-y-2">
                      {amount && !isAmountValid && (
                        <div className="text-red-300 text-sm flex items-center gap-2">
                          ❌ Minimum withdrawal amount is 5$
                        </div>
                      )}
                      {amount && !hasSufficientBalance && (
                        <div className="text-red-300 text-sm flex items-center gap-2">
                          ❌ Insufficient balance
                        </div>
                      )}
                      {amount && isAmountValid && hasSufficientBalance && (
                        <div className="text-green-300 text-sm flex items-center gap-2">
                          ✅ You will receive: {netAmount}$ (after 5% tax)
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isProceedDisabled}
                  >
                    Continue to Withdraw
                  </button>
                </form>
              </>
            )}

            {/* Step 2: Confirmation and MPIN */}
            {step === 2 && (
              <>
                {/* Transaction Summary */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
                    <FaCheck className="text-green-300" />
                    Transaction Summary
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 text-base">Withdrawal Amount:</span>
                      <span className="font-bold text-white text-lg">{amount}$</span>
                    </div>
                    <div className="flex justify-between items-center text-red-200">
                      <span className="text-base">Processing Fee (10%):</span>
                      <span className="text-lg">-{taxAmount}$</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/30 pt-4 mt-2">
                      <span className="font-bold text-white text-lg">Net Amount:</span>
                      <span className="font-bold text-green-300 text-xl">{netAmount}$</span>
                    </div>
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
                    <FaLock className="text-blue-300" />
                    Send to Wallet Address
                  </h3>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      className="w-full p-4 pr-12 bg-white/10 border border-white/30 rounded-xl text-white font-mono text-sm backdrop-blur-sm"
                      value={walletAddress}
                      readOnly
                    />
                    <button
                      onClick={handleCopyAddress}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-300 ${
                        copied 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-500/40 text-blue-200 hover:bg-blue-500 hover:text-white'
                      }`}
                    >
                      {copied ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                  {copied && (
                    <div className="text-green-300 text-sm text-center animate-pulse">
                      ✅ Address copied to clipboard!
                    </div>
                  )}
                  <p className="text-blue-100 text-sm mt-3">
                    Send exactly <strong className="text-white">{netAmount}$ USDT (BEP-20)</strong> to this address
                  </p>
                </div>

          
                <form onSubmit={handleConfirmWithdrawal}>
                  <div className="mb-6">
                    <label className="text-white text-lg font-semibold mb-4 block  items-center gap-2">
                      <FaKey className="text-purple-400" />
                      Enter 6-digit Security PIN
                      <span className="text-red-300 ml-1">*</span>
                    </label>
                    
                    <div className="relative">
                      <input
                        type="password"
                        className="w-full p-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-blue-200 pr-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm text-lg"
                        placeholder="Enter your 6-digit PIN"
                        value={mpin}
                        onChange={handleMpinChange}
                        maxLength={6}
                        pattern="\d{6}"
                        inputMode="numeric"
                        required
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200">
                        <FaKey className="text-xl" />
                      </div>
                    </div>
                    
                    {mpin.length > 0 && mpin.length !== 6 && (
                      <div className="text-red-300 text-sm mt-3 flex items-center gap-2">
                        ❌ Security PIN must be exactly 6 digits
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                    >
                      <FaArrowLeft />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                      disabled={mpin.length !== 6}
                    >
                      <FaCheck />
                      Confirm
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-3 lg:gap-6 gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl lg:p-6 p-2 text-center border border-white/30">
            <FaLock className="lg:text-3xl text-xl text-green-300 mx-auto mb-2" />
            <div className="text-white lg:text-lg text-base font-bold ">Secure</div>
            <div className="text-blue-100 text-sm">Encrypted</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl lg:p-6 p-2 text-center border border-white/30">
            <FaCheck className="lg:text-3xl text-xl text-blue-300 mx-auto mb-2" />
            <div className="text-white lg:text-lg text-base font-bold ">Instant</div>
            <div className="text-blue-100 text-sm">Processing</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl lg:p-6 p-2 text-center border border-white/30">
            <FaCoins className="lg:text-3xl text-xl text-yellow-300 mx-auto mb-2" />
            <div className="text-white lg:text-lg text-base font-bold ">Low Fee</div>
            <div className="text-blue-100 text-sm">5% Only</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;