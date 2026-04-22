"use client";

import { useEffect, useState } from "react";
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
        if (apiUrl.includes("railway.app")) apiUrl = apiUrl.replace("http://", "https://");

        const response = await fetch(`${apiUrl}/api/dashboard/stats`);
        if (response.ok) {
          const data = await response.json();
          console.log("Dashboard stats received:", data);
          setStats(data);
        } else {
          console.error("Dashboard fetch failed:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds for real-time feel
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Total Assets",
      value: stats.total_assets,
      description: "Full Inventory Count",
      icon: Laptop,
      color: "border-blue-500",
    },
    {
      title: "Assigned",
      value: stats.assigned_assets,
      description: "Currently in use",
      icon: Users,
      color: "border-green-500",
    },
    {
      title: "Available",
      value: stats.available_assets,
      description: "Ready for deployment",
      icon: ClipboardList,
      color: "border-orange-500",
    },
    {
      title: "Maintenance / Lost",
      value: stats.maintenance_assets,
      description: "Action required",
      icon: AlertTriangle,
      color: "border-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-1 text-xs font-medium">
          <span className="px-2 text-muted-foreground uppercase tracking-widest">Mock Role Switcher:</span>
          <button className="rounded bg-white px-2 py-1 text-black shadow-sm">Admin (Dark)</button>
          <button className="px-2 py-1 text-muted-foreground hover:text-foreground">Employee (Light)</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className={`border-t-4 ${card.color} shadow-sm`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New asset registered: MacBook Pro 16" (LP-00{i})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i * 2} hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <button className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Deploy New Asset
            </button>
            <button className="flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
              Run Inventory Audit
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
