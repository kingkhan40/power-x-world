"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

// ✅ Centralized imports from assets/index.ts

import { slide1, slide2, slide3, slide4  } from "@/app/assets";

interface Slide {
  id: number;
  image: any; // Use 'any' type for imported images or StaticImageData
}

const DiscountSlider = () => {
  const slideContent: Slide[] = [
    { id: 1, image: slide1 },
    { id: 2, image: slide2 },
    { id: 3, image: slide3 },
    { id: 4, image: slide4 },
  ];

  return (
    <div className="w-full container mx-auto lg:px-4 px-0 py-1">
      {/* Static Background Container */}
      <div className="w-full h-[270px] lg:h-80 rounded-xl px-1 overflow-hidden relative">
        {/* Gradient Background - Static */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(135deg, #0a192f 0%, #162135 50%, #103323 75%, #000000 100%)",
          }}
        ></div>

        {/* Top Left Animated Circle - Static */}
        <div
          className="absolute -top-12 -left-12 w-24 h-24 rounded-full z-10 animate-spin"
          style={{
            background:
              "linear-gradient(45deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66)",
            animationDuration: "9000ms",
            filter: "blur(12px)",
            opacity: "0.6",
          }}
        ></div>

        {/* Bottom Right Animated Circle - Static */}
        <div
          className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full z-10 animate-spin"
          style={{
            background:
              "linear-gradient(135deg, #a83bf8, #7d9efb, #51cf66, #ff6b6b)",
            animationDuration: "4000ms",
            filter: "blur(10px)",
            opacity: "0.4",
          }}
        ></div>

        {/* Additional Floating Elements - Static */}
        <div
          className="absolute top-1/4 -right-8 w-16 h-16 rounded-full z-10 animate-spin"
          style={{
            background:
              "linear-gradient(225deg, #ff6b6b, #51cf66, #7d9efb)",
            animationDuration: "5000ms",
            filter: "blur(8px)",
            opacity: "0.3",
          }}
        ></div>

        <div
          className="absolute bottom-1/4 -left-8 w-14 h-14 rounded-full z-10 animate-spin"
          style={{
            background:
              "linear-gradient(315deg, #51cf66, #ff6b6b, #a83bf8)",
            animationDuration: "6000ms",
            filter: "blur(10px)",
            opacity: "0.3",
          }}
        ></div>

        {/* Swiper Container - Only images will slide */}
        <Swiper
          spaceBetween={20}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper h-full relative z-20"
          speed={1000}
        >
          {slideContent.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="h-full flex items-center justify-center w-full">
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={slide.image}
                    alt={`Slide ${slide.id}`}
                    width={800}
                    height={400}
                    className="lg:h-80 h-auto w-full object-contain lg:object-fill lg:rounded-xl rounded-lg overflow-hidden border-2 border-blue-500/30 shadow-2xl"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default DiscountSlider;
