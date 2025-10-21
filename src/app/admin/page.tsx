// src/app/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      // Already logged in → redirect to dashboard
      router.replace("/admin/dashboard");
    } else {
      // Not logged in → redirect to login page
      router.replace("/admin/login");
    }
  }, [router]);

  // While redirecting, render nothing or a loader
  return null;
}
