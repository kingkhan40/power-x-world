const BalanceCard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 gap-3">
        <div className="lg:p-5 p-1 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
            style={{
              background:
                "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
              animationDuration: "9000ms",
              zIndex: 0,
            }}
          ></div>
          <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-1"></div>

          <div
            className="absolute -top-12 -left-12 w-24 h-24 rounded-full z-10 animate-spin"
            style={{
              background: "linear-gradient(45deg, #7d9efb, #a83bf8)",
              animationDuration: "9000ms",
              filter: "blur(12px)",
              opacity: "0.6",
            }}
          ></div>

          <div
            className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full z-10 animate-spin"
            style={{
              background: "linear-gradient(135deg, #a83bf8, #7d9efb)",
              animationDuration: "4000ms",
              filter: "blur(10px)",
              opacity: "0.4",
            }}
          ></div>

          <div
            className="absolute top-1/2 -right-8 w-16 h-16 rounded-full z-10 animate-spin"
            style={{
              background: "linear-gradient(225deg, #7d9efb, #a83bf8)",
              animationDuration: "5000ms",
              filter: "blur(8px)",
              opacity: "0.3",
            }}
          ></div>

          {/* Content */}
          <div className="relative z-0">
            <div className="flex items-center justify-between gap-2 p-1 rounded-lg  w-full">
              <div className="flex flex-col bg-gradient-to-r from-pink-950 to-blue-950 rounded-xl items-center  w-full p-2">
                <span className="text-2xl font-bold text-white">0.00 $</span>
                <span className="text-sm font-medium text-gray-300 mb-1">
                  USDT Balance
                </span>
              </div>
              <div className="flex flex-col bg-gradient-to-r from-cyan-950 to-indigo-950 rounded-xl items-center  w-full p-2">
                <span className="text-2xl font-bold text-green-400">
                  +0.00$
                </span>
                <span className="text-sm text-gray-300 mb-1">Today Income</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
