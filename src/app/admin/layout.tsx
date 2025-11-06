// app/admin/layout.tsx
import type { Metadata } from "next";
import AdminClientLayout from "./AdminClientLayout";
import { AdminProvider } from "./context/AdminContext";
export const metadata: Metadata = {
  title: "Admin Panel - PowerXWorld",
  description: "PowerXWorld Administration Panel",
};

// Default export must be a React component
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminClientLayout>{children}</AdminClientLayout>
    </AdminProvider>
  );
}
