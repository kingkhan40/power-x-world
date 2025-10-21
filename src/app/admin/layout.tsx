import type { Metadata } from "next";
import AdminClientLayout from "./AdminClientLayout";

export const metadata: Metadata = {
  title: "Admin Panel - PowerXWorld",
  description: "PowerXWorld Administration Panel",
};

// Default export must be a React component
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Render the client layout (which handles token check, provider, wrapper)
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
