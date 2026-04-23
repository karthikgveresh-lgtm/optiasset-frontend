"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Laptop, 
  Users, 
  ClipboardList, 
  AlertTriangle 
} from "lucide-react";

interface DashboardStats {
  total_assets: number;
  assigned_assets: number;
  available_assets: number;
  maintenance_assets: number;
}

export default function DashboardPage() {
  const { role, setRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total_assets: 0,
    assigned_assets: 0,
    available_assets: 0,
    maintenance_assets: 0,
  });

  // Fetch real statistics from the live backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        apiUrl = apiUrl.replace("http://", "https://").replace(/\/$/, "");

        const response = await fetch(`${apiUrl}/api/dashboard/stats/`, {
           headers: { "Authorization": "Bearer 1" }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Assets", value: stats.total_assets, description: "Full Inventory", icon: Laptop, color: "border-blue-500" },
    { title: "Assigned", value: stats.assigned_assets, description: "In Use", icon: Users, color: "border-green-500" },
    { title: "Available", value: stats.available_assets, description: "Ready", icon: ClipboardList, color: "border-orange-500" },
    { title: "Maintenance", value: stats.maintenance_assets, description: "Action Required", icon: AlertTriangle, color: "border-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        
        <div className="flex items-center gap-2 rounded-lg bg-black/20 backdrop-blur-md p-1 border border-white/10">
          <button 
            onClick={() => setRole("Admin")}
            className={`rounded px-3 py-1 text-xs font-bold transition-all ${role === "Admin" ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"}`}
          >
            Admin Mode
          </button>
          <button 
            onClick={() => setRole("Employee")}
            className={`rounded px-3 py-1 text-xs font-bold transition-all ${role === "Employee" ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"}`}
          >
            Employee Mode
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className={`bg-black/20 backdrop-blur-md border-t-4 ${card.color} border-x-white/5 border-b-white/5 text-white shadow-2xl`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-80">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-white/60" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-xs opacity-60">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
