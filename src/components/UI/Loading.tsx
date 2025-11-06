import React from 'react';

const Loading = () => {
  return (
    <div>
      <div className="flex items-center justify-center h-screen text-white bg-black">
        <div className="relative w-[150px] h-[150px] rounded-full border-[3px] border-[#3c3c3c] text-center leading-[150px] text-[#fff000] text-[20px] uppercase tracking-[4px] font-sans shadow-[0_0_20px_rgba(0,0,0,0.5)] [text-shadow:0_0_10px_#fff000]">
          Loading
          <div className="absolute top-[-1px] left-[-1px] w-full h-full rounded-full border-[3px] border-transparent border-t-[#fff000] border-r-[#fff000] animate-border" />
          <span className="absolute top-1/2 left-1/2 w-1/2 h-[4px] bg-transparent origin-left animate-dot">
            <span className="absolute w-[16px] h-[16px] bg-[#fff000] rounded-full top-[-4px] right-[-6px] shadow-[0_0_20px_#fff000]" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
