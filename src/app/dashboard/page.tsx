"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Laptop, 
  Users, 
  ClipboardList, 
  AlertTriangle,
  History,
  ArrowUpRight
} from "lucide-react";

interface DashboardStats {
  total_assets: number;
  assigned_assets: number;
  available_assets: number;
  maintenance_assets: number;
}

interface RecentAssignment {
  id: number;
  asset_id: string;
  asset_name: string;
  employee_name: string;
  status: string;
  date: string;
}

export default function DashboardPage() {
  const { role } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total_assets: 0,
    assigned_assets: 0,
    available_assets: 0,
    maintenance_assets: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState<RecentAssignment[]>([]);

  // FORCE SECURE HTTPS URL
  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    if (url.includes("railway.app") && !url.startsWith("https://")) {
      url = "https://" + url.replace("http://", "");
    }
    return url.replace(/\/$/, "");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = getApiUrl();

        // Fetch Stats
        const statsRes = await fetch(`${apiUrl}/api/dashboard/stats`);
        if (statsRes.ok) setStats(await statsRes.json());

        // Fetch Recent Assignments
        const recentRes = await fetch(`${apiUrl}/api/dashboard/recent-assignments`);
        if (recentRes.ok) setRecentAssignments(await recentRes.json());

      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: "Total Assets", value: stats.total_assets, description: "Full Inventory", icon: Laptop, color: "from-blue-600 to-cyan-500 shadow-blue-500/20" },
    { title: "Assigned", value: stats.assigned_assets, description: "In Use", icon: Users, color: "from-purple-600 to-pink-500 shadow-purple-500/20" },
    { title: "Available", value: stats.available_assets, description: "Ready", icon: ClipboardList, color: "from-green-600 to-emerald-500 shadow-green-500/20" },
    { title: "Maintenance", value: stats.maintenance_assets, description: "Needs Attention", icon: AlertTriangle, color: "from-red-600 to-orange-500 shadow-red-500/20" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
            {role} <span className="text-white/20 font-light not-italic">Dashboard</span>
          </h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1 italic">Real-time Terminal Activity</p>
        </div>
        
        <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${role === 'Admin' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-purple-500 shadow-[0_0_10px_#a855f7]'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
              System Secure <span className="text-white">// Encrypted Session</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.title} className={`group relative bg-black/20 backdrop-blur-xl border border-white/5 p-6 rounded-[32px] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-white/20 shadow-2xl`}>
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${card.color}`} />
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-white/80 transition-colors" />
            </div>
            <div className="text-4xl font-black text-white tracking-tighter mb-1">{card.value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{card.title}</div>
            <p className="text-[9px] text-white/20 italic font-medium mt-1">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">
            <History className="w-5 h-5 text-white/60" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Recent Assignments</h2>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Tracking latest 5 terminal transactions</p>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-3xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 italic">Asset ID</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 italic">Asset Name</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 italic">Employee</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 italic">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {recentAssignments.map((item) => (
                <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <span className="text-xs font-black text-blue-400 font-mono tracking-tighter">{item.asset_id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">{item.asset_name}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">{item.employee_name}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      item.status === 'Active' || item.status === 'DEPLOYED' ? 'bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]' :
                      item.status === 'Pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)]' :
                      'bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
