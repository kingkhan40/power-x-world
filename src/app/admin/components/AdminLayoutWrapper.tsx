// app/admin/components/AdminLayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AdminLoader from "./AdminLoader";
import { useAdmin } from "../context/AdminContext";

function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { sidebarOpen, setSidebarOpen } = useAdmin();

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Landing page aur login page ke liye special layout nahi
  const isLandingPage = pathname === "/admin";
  const isLoginPage = pathname === "/admin/login";

  if (isLandingPage || isLoginPage) {
    return <div>{children}</div>;
  }

  if (isLoading) {
    return <AdminLoader />;
  }

  // Sirf dashboard, users, withdrawals, settings ke liye full admin layout
  return (
    <div
      className="flex h-screen "
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url("https://i.pinimg.com/736x/63/9e/e3/639ee35bff684daae04742635936bb72.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/5 p-1 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayoutWrapper;
