"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdMenu, MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MenuItem {
  name: string;
  path?: string;
}

const Sidebar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    { name: "Team", path: "/team" },
    { name: "Self Investment", path: "/selfInvestment" },
    { name: "Rewards", path: "/rewards" },
    { name: "Profile Records", path: "/profileRecords" },
    { name: "Salary System", path: "/salarySystem" },
    { name: "Deposit History", path: "/depositHistory" },
    { name: "Withdrawal History", path: "/withdrawalHistory" },
    { name: "Transactions History", path: "/transactionsHistory" },
    { name: "Change Passwords", path: "/change-password" },
    { name: "Contact Us", path: "/contactUs" },
    { name: "SignOut" },
  ];

  const handleNavigation = (item: MenuItem) => {
    if (item.path) {
      router.push(item.path);
      setIsMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    router.push("/home");
  };

  return (
    <div className="sticky top-0 z-40">
      <nav
        className={`flex items-center justify-between px-4 bg-gray-900 md:px-16 lg:px-24 xl:px-32 py-2 transition-all duration-300 relative`}
      >
        {/* 5 Color Gradient Border Bottom */}
        <div
          className="absolute bottom-0 left-0 w-full h-0.5"
          style={{
            background:
              "linear-gradient(90deg, #3b82f6, #10b981, #ef4444, #8b5cf6, #f59e0b)",
            backgroundSize: "300% 200%",
            animation: "gradientFlow 12s linear infinite",
          }}
        ></div>

        {/* Logo Section */}
        <div
          onClick={handleLogoClick}
          className="flex gap-2 items-center cursor-pointer"
        >
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzHMRB0BWzNmiT41OwUUYei6Fq4n2Lqi637Q&s"
            alt="PowerX International Platform Logo"
            width={56}
            height={56}
            className="h-14 w-14 object-cover rounded-full border-2 border-blue-200 p-1"
          />
          <div className="flex flex-col ml-2">
            <h3 className="lg:text-3xl text-lg font-extrabold tracking-wider text-white font-mono">
              Masahiro Ito
            </h3>
            <p className="md:text-xs transition-colors text-[13px] text-gray-200 duration-300">
              PowerX International Platform
            </p>
          </div>
        </div>

        {/* Fixed Menu Icon */}
        <motion.div
          className="fixed bottom-4 right-2 z-50 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background:
                "linear-gradient(45deg, #3b82f6, #10b981, #ef4444, #8b5cf6)",
            }}
          >
            <motion.div
              key={isMenuOpen ? "close" : "menu"}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
              className="text-white text-xl font-bold"
            >
              {isMenuOpen ? <MdClose /> : <MdMenu />}
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed bottom-10 right-8 z-40"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
              <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl py-1.5 px-4 shadow-2xl border border-gray-700 min-w-[220px] max-h-[88vh] overflow-y-auto">
                {/* Menu Header */}
                <div className="text-center sticky top-0 bg-gray-900/95 py-1">
                  <h3 className="text-white font-bold text-lg">Quick Menu</h3>
                  <div
                    className="w-16 h-1 mx-auto rounded-full mb-2"
                    style={{
                      background:
                        "linear-gradient(90deg, #3b82f6, #10b981, #ef4444)",
                    }}
                  ></div>
                </div>

                {/* Menu Items */}
                <div className="space-y-0.5">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div
                        onClick={() => handleNavigation(item)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group relative ${
                          item.path 
                            ? "hover:bg-gray-800/80" 
                            : "opacity-90 cursor-not-allowed"
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full transition-transform duration-200 group-hover:scale-150"
                          style={{
                            background: `linear-gradient(45deg, #3b82f6, #10b981, #ef4444, #8b5cf6)`,
                          }}
                        ></div>
                        <span className={`font-medium text-sm ${
                          item.path 
                            ? "text-gray-200 group-hover:text-white" 
                            : "text-gray-400"
                        }`}>
                          {item.name}
                        </span>

                        {/* Permanent Gradient Line under each menu item */}
                        <div
                          className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full mt-0.5"
                          style={{
                            background:
                              "linear-gradient(90deg, #ffffff, #ff6b6b, #10b981, #00ffff)",
                            backgroundSize: "300% 100%",
                            animation: "gradientFlow 8s linear infinite",
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Gradient Animation Style */}
        <style jsx>{`
          @keyframes gradientFlow {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 300% 50%;
            }
          }
        `}</style>
      </nav>
    </div>
  );
};

export default Sidebar;


{/* <div class="fixed top-0 left-0 overflow-y-auto z-40 h-screen w-80 lg:hidden" style="transform: none;"><div class="h-screen overflow-y-auto flex flex-col bg-white dark:bg-gray-900 shadow-xl overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-cyan-500/10 pointer-events-none"></div><div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800"><a class="flex items-center gap-2" href="/"><img alt="logo" loading="lazy" width="70" height="70" decoding="async" data-nimg="1" srcset="/_next/image?url=%2Flogo.png&amp;w=96&amp;q=75 1x, /_next/image?url=%2Flogo.png&amp;w=256&amp;q=75 2x" src="/_next/image?url=%2Flogo.png&amp;w=256&amp;q=75" style="color: transparent;"><span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">RisingTrade</span></a><button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x h-5 w-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button></div><div class="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800"><span data-slot="avatar" class="relative flex size-8 shrink-0 overflow-hidden rounded-full h-10 w-10 border-2 border-white shadow-md"><span data-slot="avatar-fallback" class="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white">ID</span></span><div class="flex flex-col"><span class="font-medium text-sm">0</span><span class="text-xs text-gray-500 dark:text-gray-400">Referred By - </span></div></div><div dir="ltr" data-slot="scroll-area" class="relative flex-1 py-4" style="position: relative; --radix-scroll-area-corner-width: 0px; --radix-scroll-area-corner-height: 0px;"><style>[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}</style><div data-radix-scroll-area-viewport="" data-slot="scroll-area-viewport" class="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1" style="overflow: hidden scroll;"><div style="min-width: 100%; display: table;"><nav class="px-2 space-y-1"><a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-white" href="/dashboard"><div class="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg shadow-blue-500/25" style="opacity: 1;"></div><span class="relative z-10 flex items-center justify-center w-10 h-10"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house h-5 w-5"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></span><span class="relative z-10 truncate">Dashboard</span></a><a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" href="/trade"><span class="relative z-10 flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-right h-5 w-5"><path d="M8 3 4 7l4 4"></path><path d="M4 7h16"></path><path d="m16 21 4-4-4-4"></path><path d="M20 17H4"></path></svg></span><span class="relative z-10 truncate">Trade</span></a><a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" href="/wallet"><span class="relative z-10 flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet h-5 w-5"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg></span><span class="relative z-10 truncate">Wallet</span></a><a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" href="/teams"><span class="relative z-10 flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round h-5 w-5"><path d="M18 21a8 8 0 0 0-16 0"></path><circle cx="10" cy="8" r="5"></circle><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path></svg></span><span class="relative z-10 truncate">Teams</span></a><a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" href="/achievements"><span class="relative z-10 flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column h-5 w-5"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg></span><span class="relative z-10 truncate">Achievements</span></a><a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" href="/pools_and_rewards"><span class="relative z-10 flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame h-5 w-5"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg></span><span class="relative z-10 truncate">Pools &amp; Rewards</span></a><a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" href="/income_history"><span class="relative z-10 flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-pie h-5 w-5"><path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"></path><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path></svg></span><span class="relative z-10 truncate">Income History</span></a><a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" href="/deposit_history"><span class="relative z-10 flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-download h-5 w-5"><path d="M12 13v8l-4-4"></path><path d="m12 21 4-4"></path><path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"></path></svg></span><span class="relative z-10 truncate">Deposit History</span></a><a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" href="/withdrawal_history"><span class="relative z-10 flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-upload h-5 w-5"><path d="M12 13v8"></path><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="m8 17 4-4 4 4"></path></svg></span><span class="relative z-10 truncate">Withdrawal History</span></a><a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" href="/support"><span class="relative z-10 flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smartphone-nfc h-5 w-5"><rect width="7" height="12" x="2" y="6" rx="1"></rect><path d="M13 8.32a7.43 7.43 0 0 1 0 7.36"></path><path d="M16.46 6.21a11.76 11.76 0 0 1 0 11.58"></path><path d="M19.91 4.1a15.91 15.91 0 0 1 .01 15.8"></path></svg></span><span class="relative z-10 truncate">Support</span></a></nav></div></div></div><div class="p-4 border-t border-gray-100 dark:border-gray-800"><div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3 text-xs"><p class="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">BNB Price: $1243.00</p></div></div></div></div> */}
