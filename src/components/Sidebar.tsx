'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdMenu, MdClose } from 'react-icons/md';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface MenuItem {
  name: string;
  path?: string;
}

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, fetchUserProfile } = useAuth(); // ✅ Add fetchUserProfile

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(pathname === '/home');

  // Auto-fetch profile when sidebar opens
  useEffect(() => {
    if (isMenuOpen && user?.userId) {
      fetchUserProfile();
    }
  }, [isMenuOpen, user?.userId]);

  useEffect(() => {
    if (pathname === '/home') {
      setIsMenuOpen(true);
    }
  }, [pathname]);

  const menuItems: MenuItem[] = [
    { name: 'Team', path: '/team' },
    { name: 'Self Investment', path: '/selfInvestment' },
    { name: 'Rewards', path: '/rewards' },
    { name: 'Our Team', path: '/team-detail' },
    { name: 'Profile Records', path: '/profileRecords' },
    { name: 'Salary System', path: '/salarySystem' },
    { name: 'Deposit History', path: '/depositHistory' },
    { name: 'Withdrawal History', path: '/withdrawalHistory' },
    { name: 'Transactions History', path: '/transactionsHistory' },
    { name: 'Change Passwords', path: '/change-password' },
    { name: 'Contact Us', path: '/contactUs' },
  ];

  const handleNavigation = (item: MenuItem) => {
    if (item.path) {
      router.push(item.path);
      if (pathname !== '/home' && window.innerWidth < 768) {
        setIsMenuOpen(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    router.push('/home');
    setIsMenuOpen(true);
  };

  return (
    <div className="sticky top-0 z-40">
      <nav className="flex items-center justify-between px-4 bg-gray-900 md:px-16 lg:px-24 xl:px-32 py-2 relative">
        {/* Bottom Gradient Border */}
        <div
          className="absolute bottom-0 left-0 w-full h-0.5"
          style={{
            background:
              'linear-gradient(90deg, #3b82f6, #10b981, #ef4444, #8b5cf6, #f59e0b)',
            backgroundSize: '300% 200%',
            animation: 'gradientFlow 12s linear infinite',
          }}
        ></div>

        {/* Left Section — Logo with Profile */}
        <div onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer">
          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-white/30 shadow-lg overflow-hidden">
            {user?.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-sm">
                {user?.userName?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          
          {/* User Info */}
          <div className="flex flex-col">
            <h3 className="lg:text-xl text-lg font-medium tracking-wider text-white font-mono">
              {user?.userName || 'User'}
            </h3>
            <p className="md:text-xs transition-colors text-[10px] text-gray-200 duration-300">
              PowerX International Platform
            </p>
          </div>
        </div>

        {/* Rest of the sidebar code remains the same */}
        {/* Mobile Menu Button */}
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
                'linear-gradient(45deg, #3b82f6, #10b981, #ef4444, #8b5cf6)',
            }}
          >
            <motion.div
              key={isMenuOpen ? 'close' : 'menu'}
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
              transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
            >
              <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl py-1.5 px-4 shadow-2xl border border-gray-700 min-w-[220px] max-h-[88vh] overflow-y-auto">
                <div className="text-center sticky top-0 bg-gray-900/95 py-1">
                  <h3 className="text-white font-bold text-lg">Quick Menu</h3>
                  <div
                    className="w-16 h-1 mx-auto rounded-full mb-2"
                    style={{
                      background:
                        'linear-gradient(90deg, #3b82f6, #10b981, #ef4444)',
                    }}
                  ></div>
                </div>

                {/* User Info Section */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3 p-2 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border border-white/30 overflow-hidden">
                        {user.profilePic ? (
                          <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-xs font-bold">
                            {user.userName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                          {user.userName}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {user.userEmail}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

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
                              'linear-gradient(45deg, #3b82f6, #10b981, #ef4444, #8b5cf6)',
                          }}
                        ></div>
                        <span className="font-medium text-sm text-gray-200 group-hover:text-white">
                          {item.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Logout */}
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