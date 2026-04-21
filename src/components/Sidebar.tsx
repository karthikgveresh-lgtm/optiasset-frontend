"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Laptop, Users, ClipboardList, ShieldAlert, LogOut } from "lucide-react";

export function Sidebar() {
  const { role, permissions } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-white/5 bg-sidebar/50 backdrop-blur-xl px-4 py-6 shadow-2xl">
      <div className="mb-8 px-2 text-xl font-bold tracking-tight text-primary">
        OptiAsset Pro
      </div>

      <nav className="flex-1 space-y-2">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground transition-all hover:text-primary">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>

        {permissions.includes("manage:assets") && (
          <Link href="/assets" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
            <Laptop className="h-5 w-5" />
            Manage Inventory
          </Link>
        )}

        {permissions.includes("manage:users") && (
          <Link href="/users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
            <Users className="h-5 w-5" />
            All Users
          </Link>
        )}

        {permissions.includes("manage:assignments") && (
          <Link href="/assignments" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
            <ClipboardList className="h-5 w-5" />
            Assignments
          </Link>
        )}

        {permissions.includes("view:my_assets") && (
          <Link href="/my-gear" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground">
            <Laptop className="h-5 w-5" />
            My Gear
          </Link>
        )}

        {role === "Admin" && (
          <div className="mt-4 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Admin Tools
          </div>
        )}
      </nav>

      <div className="mt-auto border-t pt-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
          <div className="flex flex-col">
            <span className="font-medium text-foreground">Logged in as:</span>
            <span className="font-bold text-primary">{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
