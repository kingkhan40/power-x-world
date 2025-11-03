"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRocket, FaChartLine, FaCoins, FaClock, FaCheckCircle, FaHistory } from "react-icons/fa";

interface InvestmentData {
  plan: string;
  amount: number;
  minProfit: number;
  maxProfit: number;
  date: string;
}

const SelfInvestment = () => {
  const [earnedAmount, setEarnedAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(20);
  const [investmentData, setInvestmentData] = useState<InvestmentData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [initialFillPercentage, setInitialFillPercentage] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    // Clear old localStorage data
    if (typeof window !== 'undefined') {
      localStorage.removeItem("investmentData");
      localStorage.removeItem("investmentTimer");

      // Retrieve investment data from localStorage
      const data = localStorage.getItem("investmentData");
      if (data) {
        const parsedData: InvestmentData = JSON.parse(data);
        setInvestmentData(parsedData);

        // Calculate initial fill percentage based on investment amount
        const investmentPercentage = (parsedData.amount / maxAmount) * 100;
        setInitialFillPercentage(investmentPercentage);
        setCurrentProgress(investmentPercentage);

        // Set initial earned amount based on investment
        setEarnedAmount((prev) => {
          const newAmount = prev + parsedData.amount;
          return Math.min(newAmount, maxAmount);
        });

        // Check if we have a timer already running in localStorage
        const timerData = localStorage.getItem("investmentTimer");
        let startTime: number, duration: number;

        if (timerData) {
          const timer = JSON.parse(timerData);
          startTime = timer.startTime;
          duration = timer.duration;
        } else {
          // Set new timer for 24 hours (86400 seconds)
          startTime = Date.now();
          duration = 86400;
          localStorage.setItem(
            "investmentTimer",
            JSON.stringify({
              startTime,
              duration,
            })
          );
        }

        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, duration - elapsedSeconds);
        setTimeRemaining(remaining);

        if (remaining > 0) {
          setIsActive(true);
          const timeProgress = 1 - remaining / duration;
          const additionalProgress = (100 - investmentPercentage) * timeProgress;
          setCurrentProgress(investmentPercentage + additionalProgress);
        } else {
          setCurrentProgress(100);
        }
      }
    }
  }, [maxAmount]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            setCurrentProgress(100);
            if (typeof window !== 'undefined') {
              localStorage.removeItem("investmentTimer");
            }
            return 0;
          }
          return prevTime - 1;
        });

        if (investmentData) {
          const duration = 86400;
          const timeProgress = 1 - timeRemaining / duration;
          const additionalProgress = (100 - initialFillPercentage) * timeProgress;
          setCurrentProgress(initialFillPercentage + additionalProgress);
          setEarnedAmount((currentProgress / 100) * maxAmount);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, investmentData, initialFillPercentage, currentProgress, maxAmount]);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleNewInvestment = () => {
    router.push("/investment");
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 relative"
      style={{
        backgroundImage: "url('https://i.pinimg.com/1200x/8e/cc/cc/8ecccc69ca64a12bb193fb385b97367a.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="lg:text-4xl text-2xl mb-3">
            💰 <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"> Investment Dashboard </span>
          </h1>
          <p className="text-blue-100 text-lg">
            Track Your Crypto Investment Progress
          </p>
        </div>

        {/* Investment Status Card */}
        <div className="lg:p-5 p-4 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl group mb-6">
          {/* Rotating Border Animation - z-0 */}
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-50 z-0"
            style={{
              background: "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
              animationDuration: "9000ms",
            }}
          ></div>
          
        
          
          {/* Background for content - z-20 */}
          <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-20"></div>

          {/* Top Left Corner Effect - z-0 */}
          <div
            className="absolute -top-6 -left-6 w-16 h-16 rounded-full z-0 animate-spin"
            style={{
              background: "linear-gradient(45deg, #7d9efb, #a83bf8, #ff6b6b)",
              animationDuration: "7000ms",
              filter: "blur(8px)",
              opacity: "0.6",
            }}
          ></div>

          {/* Bottom Right Corner Effect - z-0 */}
          <div
            className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full z-0 animate-spin"
            style={{
              background: "linear-gradient(135deg, #a83bf8, #7d9efb, #51cf66)",
              animationDuration: "5000ms",
              filter: "blur(10px)",
              opacity: "0.5",
            }}
          ></div>

          {/* Additional Floating Element - z-0 */}
          <div
            className="absolute top-4 -right-6 w-12 h-12 rounded-full z-0 animate-spin"
            style={{
              background: "linear-gradient(225deg, #ff6b6b, #51cf66, #7d9efb)",
              animationDuration: "6000ms",
              filter: "blur(8px)",
              opacity: "0.4",
            }}
          ></div>

          {/* Content - z-30 */}
          <div className="relative z-30">
            <div className="flex items-center justify-between lg:mb-4 mb-2">
              <h2 className="lg:text-2xl text-base font-bold text-white flex items-center gap-2">
                <FaChartLine className="text-green-400" size={20} />
                Investment Bar 3X to 9X
              </h2>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                timeRemaining > 0 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' : 'bg-green-500/20 text-green-300 border border-green-400/30'
              }`}>
                {timeRemaining > 0 ? 'In Progress' : 'Completed'}
              </div>
            </div>

            {/* Progress Bar with Animated Border */}
            <div className="relative lg:mb-6 mb-3">
              <div className="relative w-full bg-gray-700 rounded-full h-6 overflow-hidden border border-white/20">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 relative"
                  style={{ width: `${currentProgress}%` }}
                >
                  {/* Progress Bar Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-white">
                  {currentProgress.toFixed(1)}%
                </span>
              </div>
              
              {/* Progress Labels */}
              <div className="flex justify-between text-sm text-blue-200 mt-2">
                <span>Start: {initialFillPercentage.toFixed(1)}%</span>
                <span>Target: 100%</span>
              </div>
            </div>

            {/* Earnings Display */}
            <div className="grid grid-cols-2 gap-4 lg:mb-4 mb-2">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl lg:p-4 p-2 border border-blue-400/30">
                <div className="text-blue-200 text-sm mb-1">Earned Amount</div>
                <div className="text-white lg:text-xl text-base font-bold">${earnedAmount.toFixed(2)}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl lg:p-4 p-2 border border-green-400/30">
                <div className="text-green-200 text-sm mb-1">Maximum Limit</div>
                <div className="text-white lg:text-xl text-base font-bold">${maxAmount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Details */}
        {investmentData && (
          <div className="p-5 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl group mb-6">
            {/* Rotating Border Animation - z-0 */}
            <div
              className="absolute -inset-2 rounded-2xl animate-spin opacity-70 z-0"
              style={{
                background: "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
                animationDuration: "9000ms",
              }}
            ></div>
            
            {/* Background Image - z-10 */}
            <div
              className="absolute inset-0 z-10 bg-cover bg-center opacity-30"
              style={{ 
                backgroundImage: `url('https://i.pinimg.com/1200x/76/9c/5a/769c5a423da6b1db7d30b5e97ce0f469.jpg')` 
              }}
            ></div>
            
            {/* Background for content - z-20 */}
            <div className="absolute inset-0 bg-gray-900/80 z-20"></div>

            {/* Top Left Corner Effect - z-0 */}
            <div
              className="absolute -top-6 -left-6 w-16 h-16 rounded-full z-0 animate-spin"
              style={{
                background: "linear-gradient(45deg, #7d9efb, #a83bf8, #ff6b6b)",
                animationDuration: "7000ms",
                filter: "blur(8px)",
                opacity: "0.6",
              }}
            ></div>

            {/* Bottom Right Corner Effect - z-0 */}
            <div
              className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full z-0 animate-spin"
              style={{
                background: "linear-gradient(135deg, #a83bf8, #7d9efb, #51cf66)",
                animationDuration: "5000ms",
                filter: "blur(10px)",
                opacity: "0.5",
              }}
            ></div>

            {/* Content - z-30 */}
            <div className="relative z-30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaHistory className="text-purple-400" />
                Investment Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                  <div className="text-purple-200 text-sm mb-1">Plan Name</div>
                  <div className="text-white text-lg font-bold">{investmentData.plan}</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
                  <div className="text-yellow-200 text-sm mb-1">Invested Amount</div>
                  <div className="text-white text-lg font-bold">${investmentData.amount}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
                  <div className="text-green-200 text-sm mb-1">Profit Range</div>
                  <div className="text-white text-lg font-bold">
                    {investmentData.minProfit}% - {investmentData.maxProfit}%
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
                  <div className="text-blue-200 text-sm mb-1">Start Date</div>
                  <div className="text-white text-sm">{new Date(investmentData.date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Countdown Timer */}
        {investmentData && timeRemaining > 0 && (
          <div className="p-5 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl group mb-6">
            {/* Rotating Border Animation - z-0 */}
            <div
              className="absolute -inset-2 rounded-2xl animate-spin opacity-70 z-0"
              style={{
                background: "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
                animationDuration: "9000ms",
              }}
            ></div>
            
            {/* Background Image - z-10 */}
            <div
              className="absolute inset-0 z-10 bg-cover bg-center opacity-30"
              style={{ 
                backgroundImage: `url('https://i.pinimg.com/1200x/76/9c/5a/769c5a423da6b1db7d30b5e97ce0f469.jpg')` 
              }}
            ></div>
            
            {/* Background for content - z-20 */}
            <div className="absolute inset-0 bg-gray-900/80 z-20"></div>

            {/* Top Left Corner Effect - z-0 */}
            <div
              className="absolute -top-6 -left-6 w-16 h-16 rounded-full z-0 animate-spin"
              style={{
                background: "linear-gradient(45deg, #7d9efb, #a83bf8, #ff6b6b)",
                animationDuration: "7000ms",
                filter: "blur(8px)",
                opacity: "0.6",
              }}
            ></div>

            {/* Bottom Right Corner Effect - z-0 */}
            <div
              className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full z-0 animate-spin"
              style={{
                background: "linear-gradient(135deg, #a83bf8, #7d9efb, #51cf66)",
                animationDuration: "5000ms",
                filter: "blur(10px)",
                opacity: "0.5",
              }}
            ></div>

            {/* Content - z-30 */}
            <div className="relative z-30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaClock className="text-yellow-400" />
                Time Remaining
              </h3>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2 font-mono">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-blue-200 text-sm">
                  Your investment will complete when the timer reaches zero
                </div>
              </div>

              <div className="mt-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30">
                <div className="text-yellow-200 text-sm text-center">
                  Progress Rate: <strong>{((100 - initialFillPercentage) / (timeRemaining / 3600)).toFixed(2)}% per hour</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {investmentData && timeRemaining === 0 && (
          <div className="p-5 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl group mb-6">
            {/* Rotating Border Animation - z-0 */}
            <div
              className="absolute -inset-2 rounded-2xl animate-spin opacity-70 z-0"
              style={{
                background: "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
                animationDuration: "9000ms",
              }}
            ></div>
            
            {/* Background Image - z-10 */}
            <div
              className="absolute inset-0 z-10 bg-cover bg-center opacity-30"
              style={{ 
                backgroundImage: `url('https://i.pinimg.com/1200x/76/9c/5a/769c5a423da6b1db7d30b5e97ce0f469.jpg')` 
              }}
            ></div>
            
            {/* Background for content - z-20 */}
            <div className="absolute inset-0 bg-gray-900/80 z-20"></div>

            {/* Top Left Corner Effect - z-0 */}
            <div
              className="absolute -top-6 -left-6 w-16 h-16 rounded-full z-0 animate-spin"
              style={{
                background: "linear-gradient(45deg, #7d9efb, #a83bf8, #ff6b6b)",
                animationDuration: "7000ms",
                filter: "blur(8px)",
                opacity: "0.6",
              }}
            ></div>

            {/* Bottom Right Corner Effect - z-0 */}
            <div
              className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full z-0 animate-spin"
              style={{
                background: "linear-gradient(135deg, #a83bf8, #7d9efb, #51cf66)",
                animationDuration: "5000ms",
                filter: "blur(10px)",
                opacity: "0.5",
              }}
            ></div>

            {/* Content - z-30 */}
            <div className="relative z-30">
              <div className="text-center">
                <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-400 mb-2">Investment Completed!</h3>
                <p className="text-green-200 mb-4">
                  Your ${investmentData.amount} investment in {investmentData.plan} has reached 100% completion.
                </p>
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
                  <div className="text-green-200 text-sm mb-1">Total Earnings</div>
                  <div className="text-white text-2xl font-bold">${earnedAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleNewInvestment}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 group"
          >
            <FaRocket className="group-hover:animate-bounce" />
            {timeRemaining > 0 ? 'Track Another' : 'New Investment'}
          </button>
          
          <button
            onClick={() => router.push('/home')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
          >
            <FaCoins />
            Back to Dashboard
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl lg:p-6 p-2 border border-white/30 text-center relative overflow-hidden">
            {/* Background Effects for Stats - z-0 */}
            <div
              className="absolute -top-4 -left-4 w-12 h-12 rounded-full z-0 animate-spin"
              style={{
                background: "linear-gradient(45deg, #7d9efb, #a83bf8)",
                animationDuration: "5000ms",
                filter: "blur(6px)",
                opacity: "0.4",
              }}
            ></div>
            <FaChartLine className="lg:text-3xl text-xl text-green-400 mx-auto lg:mb-3 mb-1 relative z-20" />
            <div className="text-white lg:text-2xl text-lg font-bold mb-1 relative z-20">{currentProgress.toFixed(1)}%</div>
            <div className="text-blue-200 text-sm relative z-20">Current Progress</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl lg:p-6 p-2 border border-white/30 text-center relative overflow-hidden">
            {/* Background Effects for Stats - z-0 */}
            <div
              className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full z-0 animate-spin"
              style={{
                background: "linear-gradient(135deg, #51cf66, #7d9efb)",
                animationDuration: "6000ms",
                filter: "blur(6px)",
                opacity: "0.4",
              }}
            ></div>
            <FaCoins className="lg:text-3xl text-xl text-yellow-400 mx-auto lg:mb-3 mb-1 relative z-20" />
            <div className="text-white lg:text-2xl text-lg font-bold mb-1 relative z-20">${earnedAmount.toFixed(2)}</div>
            <div className="text-green-200 text-sm relative z-20">Total Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfInvestment;