// app/admin/components/Header.tsx
"use client";

import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  // Function to get page title based on current path
  const getPageTitle = (): string => {
    switch (pathname) {
      case "/admin/dashboard":
        return "Dashboard";
      case "/admin/users":
        return "Users Management";
      case "/admin/withdrawals":
        return "Withdrawals";
      case "/admin/settings":
        return "Settings";
      case "/admin/analytics":
        return "Analytics";
      case "/admin":
        return "Admin Panel";

      default:
        // Handle nested routes or dynamic routes
        if (pathname.startsWith("/admin/users/")) {
          return "User Details";
        }
        if (pathname.startsWith("/admin/withdrawals/")) {
          return "Withdrawal Details";
        }
        return "Admin Panel";
    }
  };

  const pageTitle = getPageTitle();

  return (
    <header className="bg-white/10 backdrop-blur-md shadow-sm border-b border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-200 hover:text-gray-300 hover:bg-gray-600 transition-colors duration-200"
          >
            <FaBars className="w-6 h-6" />
          </button>

          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-100">{pageTitle}</h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className="
            p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-600
            relative transition-colors duration-200
          "
          >
            <FaBell className="w-6 h-6" />
            <span
              className="
              absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full
              border-2 border-gray-800
            "
            ></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <FaUserCircle className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-200">Admin User</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
