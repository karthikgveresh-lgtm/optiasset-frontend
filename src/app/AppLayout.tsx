"use client";

import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // If we are on the login page, just show the content (no sidebar)
  if (pathname === "/login") {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  // If not authenticated and not on login page, show nothing (Context will redirect)
  if (!isAuthenticated) {
    return <div className="h-screen bg-black" />; 
  }

  return (
    <div className="flex h-screen text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
