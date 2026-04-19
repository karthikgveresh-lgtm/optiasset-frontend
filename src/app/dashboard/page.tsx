"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { role, setRole } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Mock Role Switcher:</span>
          <Button 
            variant={role === "Admin" ? "default" : "outline"}
            onClick={() => {
              setRole("Admin");
              document.documentElement.classList.add('dark');
            }}
          >
            Admin (Dark Mode)
          </Button>
          <Button 
            variant={role === "Employee" ? "default" : "outline"}
            onClick={() => {
              setRole("Employee");
              document.documentElement.classList.remove('dark');
            }}
          >
            Employee (Light Mode)
          </Button>
        </div>
      </div>

      {role === "Admin" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,240</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">890</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">320</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance / Lost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You currently have 2 assets assigned to you. Head over to the "My Gear" page to view details or report issues.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
