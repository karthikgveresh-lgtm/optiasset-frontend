"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Laptop, 
  Users, 
  ClipboardList, 
  Settings,
  ShieldCheck
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const { role } = useAuth();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Employee"] },
    { name: "Manage Inventory", href: "/assets", icon: Laptop, roles: ["Admin"] },
    { name: "All Users", href: "/users", icon: Users, roles: ["Admin"] },
    { name: "Assignments", href: "/assignments", icon: ClipboardList, roles: ["Admin"] },
    { name: "My Gear", href: "/my-gear", icon: ShieldCheck, roles: ["Employee", "Admin"] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen w-64 flex-col bg-black/10 backdrop-blur-xl border-r border-white/5 text-white transition-all duration-300">
      <div className="flex h-20 items-center px-6">
        <span className="text-2xl font-black tracking-tighter text-white">
          OPTI<span className="text-white/40 font-light">ASSET</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200 ${
                isActive 
                  ? "bg-white text-black shadow-lg scale-105" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-black" : "text-white/40"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-4 bg-white/5">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 font-bold text-xs">
            {role[0]}
          </div>
          <div>
            <p className="text-xs font-bold text-white">Logged in as:</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
