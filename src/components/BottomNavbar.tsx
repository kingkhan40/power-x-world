import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome,
  FaUsers,
  FaChartBar,
  FaMedal,
  FaUserCircle
} from "react-icons/fa";

const BottomNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeRoute = location.pathname;

  const navItems = [
    {
      id: 1,
      icon: <FaHome className="text-2xl" />,
      label: "Home",
      href: "/home",
    },
    {
      id: 2,
      icon: <FaUsers className="text-2xl" />,
      label: "Team",
      href: "/team",
    },
    {
      id: 3,
      icon: <FaChartBar className="text-2xl" />,
      label: "Self Invest",
      href: "/self-invest",
    },
    {
      id: 4,
      icon: <FaMedal className="text-2xl" />,
      label: "Achievements",
      href: "/achievements",
    },
    {
      id: 5,
      icon: <FaUserCircle className="text-2xl" />,
      label: "Menu",
      href: "/menu",
    },
  ];

  const handleNavigation = (href) => {
    navigate(href);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-r from-[#2c2c16] via-[#241b3a] to-[#111827] shadow-lg border-t border-gray-700 z-50">
      <div className="flex justify-around items-center p-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.href)}
            className={`flex flex-col items-center p-1 rounded-md cursor-pointer transition-all $`}
          >
            <div className={`p-2 rounded-md transition-all ${
              activeRoute === item.href 
                ? "bg-blue-600 text-white" 
                : "text-gray-300 hover:text-white hover:bg-gray-700"
            }`}>
              {item.icon}
            </div>
            <p className={` rounded-md lg:text-lg text-sm transition-all ${
              activeRoute === item.href 
                ? "text-blue-400 " 
                : "text-gray-200 hover:text-white hover:bg-gray-700"
            }`}>{item.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;