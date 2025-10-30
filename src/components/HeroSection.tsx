"use client";
import Link from "next/link";
import AnimatedButton from "./UI/AnimatedButton";

const HeroSection = () => {
  return (
    <section className="relative py-3 flex items-center justify-center overflow-hidden">
      {/* Background Images with Blur */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/b8/24/27/b824276b14cc453889d2d6f4a3613981.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(5px) brightness(0.9)", // Increased blur and reduced brightness
        }}
      ></div>
   

      {/* Dark Overlay - Increased opacity for better contrast */}
      <div className="absolute inset-0 bg-black opacity-70 z-10"></div>

      {/* Content Container with Animated Border */}
      <div className="container mx-auto px-4 flex flex-col items-center relative z-40 text-white text-center">
        {/* Animated Border Container - Same as BalanceCard */}
        <div className="p-5 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl max-w-4xl w-full">
          {/* Animated Rotating Border */}
          <div
            className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
            style={{
              background:
                "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
              animationDuration: "9000ms",
              zIndex: 0,
            }}
          ></div>
          
          {/* Background for content */}
          <div className="absolute inset-1 rounded-2xl bg-gray-900 z-1"></div>

          {/* Top Left Corner Effect */}
          <div
            className="absolute -top-12 -left-12 w-24 h-24 rounded-full z-10 animate-spin"
            style={{
              background: "linear-gradient(45deg, #7d9efb, #a83bf8)",
              animationDuration: "9000ms",
              filter: "blur(12px)",
              opacity: "0.6",
            }}
          ></div>

          {/* Bottom Right Corner Effect */}
          <div
            className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full z-10 animate-spin"
            style={{
              background: "linear-gradient(135deg, #a83bf8, #7d9efb)",
              animationDuration: "4000ms",
              filter: "blur(10px)",
              opacity: "0.4",
            }}
          ></div>

          {/* Additional Floating Element */}
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
          <div className="relative z-10">
            {/* Main heading */}
            <Link href="#"
              className="text-3xl font-poppins md:text-5xl lg:text-6xl font-bold mb-6 block"
              data-aos="fade-up"
            >
              <span className="bg-gradient-to-br from-blue-600 to-blue-100 bg-clip-text text-transparent">
                Power X World
              </span>
            </Link>

            {/* Subheading */}
            <p
              className="text-lg md:text-2xl mb-8  max-w-2xl font-poppins mx-auto"
              data-aos="fade-down"
            >
              <span className="text-blue-100 ">
                Power X World 🌍 Decentralized Blockchain International Platform
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-x-2" data-aos="fade-up">
              <AnimatedButton to="/login">Login</AnimatedButton>
              <AnimatedButton to="/register">Register</AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;