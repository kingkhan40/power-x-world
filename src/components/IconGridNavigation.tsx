"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NavItem {
  id: number;
  name: string;
  url: string;
  icon: React.ReactNode;
}

const IconGridNavigation = () => {
  const router = useRouter();
  
  const navItems: NavItem[] = [
    {
      id: 1,
      name: "Withdrawal",
      url: "/withdraw",
      icon: (
        <Image
          className="mx-auto w-10 h-10 rounded-full object-contain"
          src="https://i.pinimg.com/1200x/ec/13/90/ec13907c65298ee57d1dbc75c95a5b77.jpg"
          alt="Withdrawal"
          width={40}
          height={40}
        />
      ),
    },
    {
      id: 2,
      name: "Deposit",
      url: "",
      icon: (
        <Image
          src="https://i.pinimg.com/736x/0d/9a/78/0d9a78522d383b6114b2b0b112494883.jpg"
          alt="Deposit"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full text-2xl object-contain"
        />
      ),
    },
  ];

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  return (
    <div className="lg:p-5 p-3 rounded-lg relative overflow-hidden min-h-[80px]">
      {/* Animated Rotating Border */}
      <div
        className="absolute -inset-1 rounded-lg animate-spin opacity-70"
        style={{
          background: "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
          animationDuration: "8000ms",
          zIndex: 0,
        }}
      ></div>

      {/* Background for content */}
      <div className="absolute inset-0.5 rounded-lg bg-gray-900 z-1"></div>

      {/* Top Left Corner Effect */}
      <div
        className="absolute -top-4 -left-4 w-12 h-12 rounded-full z-10 animate-spin"
        style={{
          background: "linear-gradient(45deg, #7d9efb, #a83bf8, #ff6b6b)",
          animationDuration: "7000ms",
          filter: "blur(6px)",
          opacity: "0.6",
        }}
      ></div>

      {/* Bottom Right Corner Effect */}
      <div
        className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full z-10 animate-spin"
        style={{
          background: "linear-gradient(135deg, #a83bf8, #7d9efb, #51cf66)",
          animationDuration: "5000ms",
          filter: "blur(8px)",
          opacity: "0.5",
        }}
      ></div>

      {/* Additional Floating Element */}
      <div
        className="absolute top-2 -right-3 w-8 h-8 rounded-full z-10 animate-spin"
        style={{
          background: "linear-gradient(225deg, #ff6b6b, #51cf66, #7d9efb)",
          animationDuration: "6000ms",
          filter: "blur(5px)",
          opacity: "0.4",
        }}
      ></div>

      {/* Content */}
      <div className="w-full flex items-center gap-x-4 relative z-10">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavigation(item.url)}
            title={item.name}
            className="flex items-center cursor-pointer bg-gray-600/20 border w-full rounded-lg gap-4 hover:bg-gray-400/30 transition-all duration-300 p-1 hover:scale-102"
          >
            <div className="outline-button p-1 rounded-full transition-colors">
              {item.icon}
            </div>
            <div className="text-center text-blue-100 text-sm font-medium">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconGridNavigation;