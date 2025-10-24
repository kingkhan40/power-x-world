// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { MdMenu, MdClose } from "react-icons/md";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// interface MenuItem {
//   name: string;
//   path?: string;
// }

// const Sidebar = () => {
//   const router = useRouter();
//   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

//   const menuItems: MenuItem[] = [
//     { name: "Team", path: "/team" },
//     { name: "Self Investment", path: "/selfInvestment" },
//     { name: "Rewards", path: "/rewards" },
//     { name: "Profile Records", path: "/profileRecords" },
//     { name: "Salary System", path: "/salarySystem" },
//     { name: "Deposit History", path: "/depositHistory" },
//     { name: "Withdrawal History", path: "/withdrawalHistory" },
//     { name: "Transactions History", path: "/transactionsHistory" },
//     { name: "Change Passwords", path: "/change-password" },
//     { name: "Contact Us", path: "/contactUs" },
//     { name: "SignOut" },
//   ];

//   const handleNavigation = (item: MenuItem) => {
//     if (item.path) {
//       router.push(item.path);
//       setIsMenuOpen(false);
//     }
//   };

//   const handleLogoClick = () => {
//     router.push("/home");
//   };

//   return (
//     <div className="sticky top-0 z-40">
//       <nav className="flex items-center justify-between px-4 bg-gray-900 md:px-16 lg:px-24 xl:px-32 py-2 transition-all duration-300 relative">
//         {/* 5 Color Gradient Border Bottom */}
//         <div
//           className="absolute bottom-0 left-0 w-full h-0.5"
//           style={{
//             background:
//               "linear-gradient(90deg, #3b82f6, #10b981, #ef4444, #8b5cf6, #f59e0b)",
//             backgroundSize: "300% 200%",
//             animation: "gradientFlow 12s linear infinite",
//           }}
//         ></div>
//         {/* Logo Section */}
//         <div
//           onClick={handleLogoClick}
//           className="flex gap-2 items-center cursor-pointer"
//         >
//           <Image
//             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzHMRB0BWzNmiT41OwUUYei6Fq4n2Lqi637Q&s"
//             alt="PowerX International Platform Logo"
//             width={56}
//             height={56}
//             className="h-14 w-14 object-cover rounded-full border-2 border-blue-200 p-1"
//           />
//           <div className="flex flex-col ml-2">
//             <h3 className="lg:text-3xl text-lg font-extrabold tracking-wider text-white font-mono">
//               Masahiro Ito
//             </h3>
//             <p className="md:text-xs transition-colors text-[13px] text-gray-200 duration-300">
//               PowerX International Platform
//             </p>
//           </div>
//         </div>
//         {/* Fixed Menu Icon */}
//         <motion.div
//           className="fixed bottom-4 right-2 z-50 cursor-pointer"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <div
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="w-10 h-10 rounded-full flex items-center justify-center shadow-2xl"
//             style={{
//               background:
//                 "linear-gradient(45deg, #3b82f6, #10b981, #ef4444, #8b5cf6)",
//             }}
//           >
//             <motion.div
//               key={isMenuOpen ? "close" : "menu"}
//               initial={{ scale: 0, rotate: -180 }}
//               animate={{ scale: 1, rotate: 0 }}
//               transition={{ duration: 0.3 }}
//               className="text-white text-xl font-bold"
//             >
//               {isMenuOpen ? <MdClose /> : <MdMenu />}
//             </motion.div>
//           </div>
//         </motion.div>
//         {/* Animated Menu */}
//         <AnimatePresence>
//           {isMenuOpen && (
//             <motion.div
//               className="fixed bottom-10 right-8 z-40"
//               initial={{ opacity: 0, scale: 0.5, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.5, y: 20 }}
//               transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
//             >
//               <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl py-1.5 px-4 shadow-2xl border border-gray-700 min-w-[220px] max-h-[88vh] overflow-y-auto">
//                 {/* Menu Header */}
//                 <div className="text-center sticky top-0 bg-gray-900/95 py-1">
//                   <h3 className="text-white font-bold text-lg">Quick Menu</h3>
//                   <div
//                     className="w-16 h-1 mx-auto rounded-full mb-2"
//                     style={{
//                       background:
//                         "linear-gradient(90deg, #3b82f6, #10b981, #ef4444)",
//                     }}
//                   ></div>
//                 </div>
//                 {/* Menu Items */}
//                 <div className="space-y-0.5">
//                   {menuItems.map((item, index) => (
//                     <motion.div
//                       key={item.name}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                     >
//                       <div
//                         onClick={() => handleNavigation(item)}
//                         className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group relative ${
//                           item.path
//                             ? "hover:bg-gray-800/80"
//                             : "opacity-90 cursor-not-allowed"
//                         }`}
//                       >
//                         <div
//                           className="w-3 h-3 rounded-full transition-transform duration-200 group-hover:scale-150"
//                           style={{
//                             background:
//                               "linear-gradient(45deg, #3b82f6, #10b981, #ef4444, #8b5cf6)",
//                           }}
//                         ></div>
//                         <span
//                           className={`font-medium text-sm ${
//                             item.path
//                               ? "text-gray-200 group-hover:text-white"
//                               : "text-gray-400"
//                           }`}
//                         >
//                           {item.name}
//                         </span>
//                         {/* Permanent Gradient Line under each menu item */}
//                         <div
//                           className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full mt-0.5"
//                           style={{
//                             background:
//                               "linear-gradient(90deg, #ffffff, #ff6b6b, #10b981, #00ffff)",
//                             backgroundSize: "300% 100%",
//                             animation: "gradientFlow 8s linear infinite",
//                           }}
//                         ></div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//         {/* Overlay */}
//         <AnimatePresence>
//           {isMenuOpen && (
//             <motion.div
//               className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsMenuOpen(false)}
//             />
//           )}
//         </AnimatePresence>
//         {/* Gradient Animation Style */}
//         <style jsx>{`
//           @keyframes gradientFlow {
//             0% {
//               background-position: 0% 50%;
//             }
//             100% {
//               background-position: 300% 50%;
//             }
//           }
//         `}</style>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdMenu, MdClose } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

interface MenuItem {
  name: string;
  path?: string;
}

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  // Initialize isMenuOpen to true for homepage
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(pathname === "/home");
  const [userName, setUserName] = useState<string>("Jobi");

  // Fetch username from localStorage on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("userName");
      setUserName(storedName || "Jobi");
    }
  }, []);

  // Ensure menu is open on homepage
  useEffect(() => {
    if (pathname === "/home") {
      setIsMenuOpen(true);
    }
  }, [pathname]);

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
  ];

  const handleNavigation = (item: MenuItem) => {
    if (item.path) {
      router.push(item.path);
      // Only close menu if not on homepage and on mobile
      if (pathname !== "/home" && window.innerWidth < 768) {
        setIsMenuOpen(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    router.push("/login");
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    router.push("/home");
    setIsMenuOpen(true); // Keep menu open on homepage
  };

  return (
    <div className="sticky top-0 z-40">
      <nav
        className="flex items-center justify-between px-4 bg-gray-900 md:px-16 lg:px-24 xl:px-32 py-2 transition-all duration-300 relative"
      >
        {/* Bottom Gradient Border */}
        <div
          className="absolute bottom-0 left-0 w-full h-0.5"
          style={{
            background:
              "linear-gradient(90deg, #3b82f6, #10b981, #ef4444, #8b5cf6, #f59e0b)",
            backgroundSize: "300% 200%",
            animation: "gradientFlow 12s linear infinite",
          }}
        ></div>

        {/* Left Section — Logo + Username */}
        <div
          onClick={handleLogoClick}
          className="flex gap-2 items-center cursor-pointer"
        >
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn=USYei6Fq4n2Lqi637Q&s"
            alt="PowerX International Platform Logo"
            width={56}
            height={56}
            className="h-14 w-14 object-cover rounded-full border-2 border-blue-200 p-1"
          />
          <div className="flex flex-col ml-2">
            <h3 className="lg:text-3xl text-lg font-extrabold tracking-wider text-white font-mono">
              {userName}
            </h3>
            <p className="md:text-xs transition-colors text-[13px] text-gray-200 duration-300">
              PowerX International Platform
            </p>
          </div>
        </div>

        {/* Right Section — Logout Button (Desktop) */}
        <button
          onClick={handleLogout}
          className="hidden md:inline-flex px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full hover:opacity-90 transition-all duration-300 shadow-lg"
        >
          Logout
        </button>

        {/* Fixed Floating Menu Icon (Mobile) */}
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

        {/* Animated Mobile Menu */}
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
                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-800/80 transition-all duration-200 group relative"
                      >
                        <div
                          className="w-3 h-3 rounded-full transition-transform duration-200 group-hover:scale-150"
                          style={{
                            background:
                              "linear-gradient(45deg, #3b82f6, #10b981, #ef4444, #8b5cf6)",
                          }}
                        ></div>
                        <span className="font-medium text-sm text-gray-200 group-hover:text-white">
                          {item.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Logout Option (Mobile Menu) */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: menuItems.length * 0.05 }}
                  >
                    <div
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-red-700/80 transition-all duration-200 group relative"
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-sm text-gray-200 group-hover:text-white">
                        Logout
                      </span>
                    </div>
                  </motion.div>
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

        {/* Gradient Animation */}
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