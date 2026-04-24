"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Laptop, 
  Users, 
  ClipboardList, 
  ShieldCheck,
  LogOut,
  User
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const { role, userEmail, logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Employee"] },
    { name: "Manage Inventory", href: "/assets", icon: Laptop, roles: ["Admin"] },
    { name: "All Users", href: "/users", icon: Users, roles: ["Admin"] },
    { name: "Assignments", href: "/assignments", icon: ClipboardList, roles: ["Admin"] },
    { name: "My Gear", href: "/my-gear", icon: ShieldCheck, roles: ["Employee"] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen w-64 flex-col bg-black/10 backdrop-blur-xl border-r border-white/5 text-white transition-all duration-300">
      <div className="flex h-20 items-center px-6">
        <span className="text-2xl font-black tracking-tighter text-white italic">
          OPTI<span className="text-white/40 font-light not-italic">ASSET</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                isActive 
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive ? "text-black" : "text-white/20"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-5 bg-white/5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm ${role === 'Admin' ? 'bg-blue-500 shadow-blue-500/20' : 'bg-purple-500 shadow-purple-500/20'} text-white shadow-lg`}>
              {role[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-white/80 font-black truncate">{userEmail || "User Session"}</p>
              <p className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${role === 'Admin' ? 'text-blue-400' : 'text-purple-400'}`}>
                {role} Mode Active
              </p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-3 h-3" />
            Logout System
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
