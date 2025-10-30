"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminProvider } from "./context/AdminContext";
import AdminLayoutWrapper from "./components/AdminLayoutWrapper";

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/admin/login") return; // allow login page
    const token = localStorage.getItem("adminToken");
    if (!token) router.replace("/admin/login");
  }, [pathname, router]);

  return (
    <AdminProvider>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </AdminProvider>
  );
}
