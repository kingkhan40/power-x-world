"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminProvider } .json({ error: gv"Server error" }, { status: 500 });

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
