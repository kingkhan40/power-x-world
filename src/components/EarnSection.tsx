"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const EarnSection = () => {
  return (
    <section className="py-4 bg-transparent">
      <div className="w-full mx-auto px-2">
        <div className="grid grid-cols-1 gap-8 rounded-xl overflow-hidden relative min-h-[250px] lg:min-h-[280px]">
          {/* Gradient Background */}
          <div 
            className="absolute inset-0 z-0 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #0a192f 0%, #162135 50%, #103323 75%, #000000 100%)",
            }}
          ></div>

          {/* Animated Border Container */}
          <div className="p-4 rounded-xl relative overflow-hidden w-full h-full">
            {/* Animated Rotating Border */}
            <div
              className="absolute -inset-1 rounded-xl animate-spin opacity-70"
              style={{
                background: "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
                animationDuration: "12000ms",
                zIndex: 0,
              }}
            ></div>
            
            {/* Background for content */}
            <div className="absolute inset-0.5 rounded-xl bg-gray-900 z-1"></div>

            {/* Top Left Corner Effect */}
            <div
              className="absolute -top-8 -left-8 w-20 h-20 rounded-full z-10 animate-spin"
              style={{
                background: "linear-gradient(45deg, #7d9efb, #a83bf8, #ff6b6b)",
                animationDuration: "8000ms",
                filter: "blur(10px)",
                opacity: "0.6",
              }}
            ></div>

            {/* Bottom Right Corner Effect */}
            <div
              className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full z-10 animate-spin"
              style={{
                background: "linear-gradient(135deg, #a83bf8, #7d9efb, #51cf66)",
                animationDuration: "6000ms",
                filter: "blur(12px)",
                opacity: "0.5",
              }}
            ></div>

            {/* Additional Floating Element */}
            <div
              className="absolute top-4 -right-6 w-12 h-12 rounded-full z-10 animate-spin"
              style={{
                background: "linear-gradient(225deg, #ff6b6b, #51cf66, #7d9efb)",
                animationDuration: "7000ms",
                filter: "blur(8px)",
                opacity: "0.4",
              }}
            ></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              {/* Text Content */}
              <div className="px-2 text-center">
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                   Power X Exchange
                </h3>
                <p className="text-gray-400 mb-2">Coming Soon</p>
              </div>

              {/* Centered PNG Image */}
              <motion.div
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  whileHover={{
                    filter: "brightness(1.2)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <Image
                    src="https://minerx.global/assets/images/element/why-choose-us.png"
                    alt="X Power Exchange"
                    width={300}
                    height={200}
                    className="h-44 lg:h-52 w-auto object-contain mx-auto"
                  />
                </motion.div>
              </motion.div>

              {/* App Store Buttons */}
              <div className="flex w-auto gap-x-4 justify-center my-2">
                <Image
                  src="https://vproptrader.com/assets/img/icon-android-D2ehNFw-.png"
                  alt="Google Play Store"
                  width={120}
                  height={40}
                  className="w-auto h-10 object-contain cursor-pointer hover:scale-105 transition-transform"
                />
                <Image
                  src="https://vproptrader.com/assets/img/icon-ios-C4SUDVBR.png"
                  alt="Apple App Store"
                  width={120}
                  height={40}
                  className="w-auto h-10 object-contain cursor-pointer hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarnSection;