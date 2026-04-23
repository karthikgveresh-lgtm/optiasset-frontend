"use client";

import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Whitelist pages that don't need a sidebar or authentication
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/";

  if (isAuthPage) {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  // If not authenticated and not on an auth page, show nothing (Context will redirect)
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
