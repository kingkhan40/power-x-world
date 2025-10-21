"use client";
import React, { useState } from "react";

interface LaunchedItem {
  title: string;
  description: string;
  fullDescription: string;
  bgImg: string;
}

const LaunchedSection = () => {
  const [selectedItem, setSelectedItem] = useState<LaunchedItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Data for the grid items
  const launchedItems: LaunchedItem[] = [
    {
      title: "Power X Coin",
      description:
        "PowerX Coin is not just another cryptocurrency — it's a revolution. Within just 1 to 1.5 years, the price is projected to rise from $1 to $1000. Backed by major global investors...",
      fullDescription:
        "PowerX Coin is not just another cryptocurrency — it's a revolution. Within just 1 to 1.5 years, the price is projected to rise from $1 to $1000.🌍 Backed by major global investors, including shareholders from Amazon, BlackRock, and other multinational companies, PowerX Coin is set to dominate the crypto market. Early investors have the golden chance to multiply their profits thousands of times.This is your time. This is your future. This is PowerX Coin (PXC)",
      bgImg:
        "https://i.pinimg.com/736x/5a/ae/32/5aae3219bde23a58e65d686b948a3058.jpg",
    },
    {
      title: "X Power Exchange",
      description:
        "The World's Next Largest Crypto Exchange Just as Binance became the world's biggest crypto exchange, XPower Exchange is set to rewrite history. Backed by some of the largest global investors...",
      fullDescription:
        "The World's Next Largest Crypto Exchange Just as Binance became the world's biggest crypto exchange, XPower Exchange is set to rewrite history. 🌍 Backed by some of the largest global investors and shareholders from companies like Amazon, BlackRock, and other multinational giants, XPower Exchange is building the strongest foundation in the crypto world. 💰 A secure, transparent, and fastest trading platform where investors can trade PowerX Coin (PXC) along with BTC, ETH, and all major cryptocurrencies. 🚀 With its global vision, XPower Exchange is on the path to becoming the LARGEST crypto exchange in the world.",
      bgImg:
        "https://i.pinimg.com/1200x/5d/17/65/5d1765ab5fcadaa7e7aa26b3c5c2a4ed.jpg",
    },
    {
      title: "Power X Wallet",
      description:
        "PowerX Wallet Your Gateway to Secure Digital Assets PowerX Wallet is more than just a wallet — it's a complete digital bank for your crypto. With advanced blockchain technology...",
      fullDescription:
        "PowerX Wallet Your Gateway to Secure Digital Assets PowerX Wallet is more than just a wallet — it's a complete digital bank for your crypto. 🌍 With advanced blockchain technology, it offers:✅ Ultra-secure storage for PowerX Coin (PXC), BTC, ETH & all major cryptocurrencies.✅ Fast and hassle-free transfers across the globe.✅ User-friendly interface with maximum privacy and security.💰 Backed by global investors and designed for the future, PowerX Wallet ensures that your digital assets are always safe and always accessible.",
      bgImg:
        "https://i.pinimg.com/1200x/64/1b/af/641baff5a88f513d9043eb167a10c12f.jpg",
    },
    {
      title: "Power X Investment Management",
      description:
        "💰 PowerX Investment Plan – A Global Opportunity PowerX Investment Plan is designed to give investors maximum growth with minimum risk. Managed by world-class professionals...",
      fullDescription:
        "💰 PowerX Investment Plan – A Global Opportunity PowerX Investment Plan is designed to give investors maximum growth with minimum risk.🌍 Managed by world-class professionals and backed by shareholders from Amazon, BlackRock, and top crypto companies worldwide, PowerX ensures a transparent and reliable investment structure.📈 Investors will be part of a system where their capital has the potential to grow 3x, 5x, even 10x in the coming years.✅ Secure management✅ Global investment network ✅ Trusted by international giants 🚀 PowerX Investment Plan – Your path to financial freedom and global success",
      bgImg:
        "https://i.pinimg.com/736x/94/90/ad/9490ad7f5784ce11bcabe6793f7c7a07.jpg",
    },
  ];

  const openModal = (item: LaunchedItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const truncateText = (text: string, wordCount: number = 35): string => {
    const words = text.split(" ");
    if (words.length > wordCount) {
      return words.slice(0, wordCount).join(" ") + "...";
    }
    return text;
  };

  return (
    <>
      <section className="bg-transparent py-4">
        <div className="w-full mx-auto px-4">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {launchedItems.map((item, index) => (
              <div
                key={index}
                className="relative p-3 rounded-xl overflow-hidden min-h-[220px]"
              >
                {/* Animated Rotating Border */}
                <div
                  className="absolute -inset-1 rounded-xl animate-spin opacity-70"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
                    animationDuration: "8000ms",
                    zIndex: 0,
                  }}
                ></div>

                {/* Background for content */}
                <div className="absolute inset-0.5 rounded-xl bg-gray-900 z-1"></div>

                {/* Background Image */}
                <div
                  className="absolute inset-0 z-2 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${item.bgImg})` }}
                ></div>

                {/* Top Left Corner Effect */}
                <div
                  className="absolute -top-6 -left-6 w-16 h-16 rounded-full z-3 animate-spin"
                  style={{
                    background:
                      "linear-gradient(45deg, #7d9efb, #a83bf8, #ff6b6b)",
                    animationDuration: "7000ms",
                    filter: "blur(8px)",
                    opacity: "0.6",
                  }}
                ></div>

                {/* Bottom Right Corner Effect */}
                <div
                  className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full z-3 animate-spin"
                  style={{
                    background:
                      "linear-gradient(135deg, #a83bf8, #7d9efb, #51cf66)",
                    animationDuration: "5000ms",
                    filter: "blur(10px)",
                    opacity: "0.5",
                  }}
                ></div>

                {/* Content */}
                <div
                  className="relative z-4 h-full flex flex-col p-4"
                  data-aos="fade-down"
                >
                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 bg-gradient-to-br from-blue-400 to-blue-100 bg-clip-text text-transparent">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="leading-relaxed text-gray-300 text-sm flex-grow"
                    data-aos="fade-up"
                  >
                    {truncateText(item.description)}
                  </p>

                  {/* See More Button with Gradient */}
                  <button
                    onClick={() => openModal(item)}
                    className="mt-3 relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer text-white py-2 px-6 rounded-lg text-sm self-start transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span className="relative z-10">See More</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal/Popup - Perfect Mobile Responsive */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="relative w-full h-full max-w-4xl max-h-[70vh] animate-slide-up flex items-center justify-center">
            <div
              className="relative rounded-xl z-10 w-full h-full max-h-full overflow-hidden flex flex-col"
              style={{
                background:
                  "linear-gradient(315deg, #1e4d2a, #8b2c2c, #4c1d95, #000000)",
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-200">
                  {selectedItem.title}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-300 hover:text-white cursor-pointer text-xl pb-2 sm:text-3xl transition-colors duration-200 bg-gray-800 hover:bg-gray-700 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <p className="text-gray-300 leading-relaxed tracking-wider text-sm sm:text-base lg:text-lg">
                  {selectedItem.fullDescription}
                </p>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-gray-700">
                <button
                  onClick={closeModal}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 cursor-pointer rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LaunchedSection;