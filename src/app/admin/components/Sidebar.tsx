// app/admin/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUsers,
  FaDollarSign,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import {
  BarChart2,
  DollarSign,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart2,
    color: "#6366f1",
  },
  { name: "Users", href: "/admin/users", icon: Users, color: "#EC4899" },
  {
    name: "Withdrawals",
    href: "/admin/withdrawals",
    icon: DollarSign,
    color: "#10B981",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: TrendingUp,
    color: "#3B82F6",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    color: "#6EE7B7",
  },
];

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white/10 backdrop-blur-md shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="ml-3 flex gap-x-2 text-xl font-bold text-gray-100">
              Power{" "}
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">X</span>
              </div>{" "}
              Admin
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-200 hover:text-gray-300 hover:bg-gray-500"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 ">
          <div className="space-y-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${
                      isActive
                        ? `border border-gray-500 bg-opacity-20 `
                        : "text-gray-200 hover:bg-gray-600 hover:text-gray-300"
                    }
                  `}
                  onClick={() => onClose()}
                >
                  <IconComponent 
                    className={`w-5 h-5 mr-3  `}
                    style={{ color: isActive ? item.color : item.color }}
                  />
                  <span >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <button
              className="
              flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg
              hover:bg-red-50 hover:text-red-700 transition-colors duration-200
            "
            >
              <FaSignOutAlt className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;