// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "./context/AdminContext"; 
export default function 
    const token = localStorage.getItem("adminToken");

    if (!token) {
      // Not logged in → redirect to login
      router.replace("/admin/login");
    } else {
      // Logged in → allow dashboard access
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    // Show nothing or a loader during redirect
    return (-gray-500 text-lg">Checking authorization...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 classNa
    </div>
  );
}
