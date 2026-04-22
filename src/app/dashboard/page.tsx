"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  total_assets: number;
  assigned_assets: number;
  available_assets: number;
  lost_or_maintenance: number;
}

export default function DashboardPage() {
  const { role, setRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch real statistics from the live backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:8000";
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
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
        <div className="flex items-center gap-4 bg-accent/50 p-2 rounded-lg border">
          <span className="text-xs font-semibold text-muted-foreground uppercase px-2">Mock Role Switcher:</span>
          <Button 
            size="sm"
            variant={role === "Admin" ? "default" : "outline"}
            onClick={() => {
              setRole("Admin");
              document.documentElement.classList.add('dark');
            }}
          >
            Admin (Dark)
          </Button>
          <Button 
            size="sm"
            variant={role === "Employee" ? "default" : "outline"}
            onClick={() => {
              setRole("Employee");
              document.documentElement.classList.remove('dark');
            }}
          >
            Employee (Light)
          </Button>
        </div>
      </div>

      {role === "Admin" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : stats?.total_assets ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Full Inventory Count</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : stats?.assigned_assets ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently in use</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : stats?.available_assets ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready for deployment</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance / Lost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : stats?.lost_or_maintenance ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Action required</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-1">
          <Card className="shadow-lg border-2 border-primary/20 overflow-hidden">
            <div className="h-2 bg-primary"></div>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome Back, Employee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-lg">
                Your personalized asset portal is active. You can view your assigned gear and report any hardware issues directly from here.
              </p>
              <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active Assignments</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Button variant="secondary">View My Gear</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
