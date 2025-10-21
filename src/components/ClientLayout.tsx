// components/ClientLayout.tsx
"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Loader from "@/components/UI/Loader";
import AOS from "aos";
import "aos/dist/aos.css";
import Sidebar from "./Sidebar";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });

    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Refresh AOS on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Refresh AOS after route change to trigger animations
      AOS.refresh();
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Define which pages should show which layout
  const isLandingPage = pathname === "/";

  const appPages: string[] = [
    "/home",
    "/team",
    "/deposit",
    "/withdraw",
    "/selfInvestment",
    "/rewards",
    "/profileRecords",
    "/salarySystem",
    "/depositHistory",
    "/withdrawalHistory",
    "/transactionsHistory",
    "/change-password",
    "/contactUs",
    "/investment",
  ];

  // Check if current path matches app pages (including dynamic routes)
  const isAppPage = appPages.some((page: string) => {
    if (page === "/team") {
      // Handle /team and /team/[id]
      return pathname.startsWith("/team");
    }
    return pathname === page;
  });

  if (initialLoad || isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {isLandingPage && <Navbar />}
      {isAppPage && <Sidebar />}
      {children}
    </>
  );
};

export default ClientLayout;