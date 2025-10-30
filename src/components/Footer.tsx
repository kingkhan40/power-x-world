"use client";
import Image from "next/image";

// ✅ Correct import path — points to src/assets/index.ts

import { tiktok,whatsapp } from "@/app/assets";

const Footer = () => {
  return (
    <div className="w-full flex flex-col items-center my-4 relative">
      {/* Background Image for the entire footer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/2e/e7/6e/2ee76e06f2852ed4f66b2b5576687066.jpg')",
        }}
      ></div>

      <div className="absolute inset-0 bg-black/60 bg-opacity-50 z-10"></div>

      <div className="bg-blue-600 w-full lg:w-fit lg:px-4 lg:my-2 text-center py-2 text-gray-100 font-bold relative z-20">
        Follow Official Account
      </div>

      <div className="relative w-full py-8 mb-3 z-20">
        <div className="flex items-center justify-center">
          <a
            href="https://whatsapp.com/channel/0029VbAW7wpCMY0CSebHfW2k"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 w-full lg:w-fit lg:px-4 lg:my-2 flex items-center rounded-md mx-1 hover:scale-110 transition-transform"
            data-aos="fade-up"
          >
            <Image
              src={whatsapp}
              alt="WhatsApp"
              width={56}
              height={56}
              className="w-14 h-14 object-contain drop-shadow-md"
            />
            <p className="text-white font-bold">Join Now</p>
          </a>

          <a
            href="https://www.tiktok.com/@powerxworld"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 w-full lg:w-fit lg:px-4 lg:my-2 flex items-center rounded-md mx-1 hover:scale-110 transition-transform"
            data-aos="fade-down"
          >
            <Image
              src={tiktok}
              alt="TikTok"
              width={56}
              height={56}
              className="w-14 h-14 object-contain drop-shadow-md"
            />
            <p className="text-white font-bold">Follow Me</p>
          </a>
        </div>
      </div>

      {/* Copyright Text */}
      <div className="w-full text-center my-2 text-white tracking-wider relative z-20">
        Copyright © 2025 Power X World. All Rights Reserved
      </div>
    </div>
  );
};

export default Footer;
