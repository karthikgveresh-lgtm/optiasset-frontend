"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Assignment {
  id: number;
  asset_id: number;
  assignment_date: string;
  status: string;
}

export default function MyGearPage() {
  const [gear, setGear] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const MOCK_EMPLOYEE_ID = 2; // John Doe (from our seed script)

  useEffect(() => {
    const fetchMyGear = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/employees/${MOCK_EMPLOYEE_ID}/assignments/`, {
          headers: { "Authorization": "Bearer 2" }
        });
        if (response.ok) {
          const data = await response.json();
          setGear(data);
        }
      } catch (error) {
        console.error("Error fetching gear:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyGear();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Equipment</h1>
        <p className="text-muted-foreground">Review and manage the company assets currently assigned to you.</p>
      </div>

      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg">Currently Assigned</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Assigned On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="h-24 text-center">Checking your records...</TableCell></TableRow>
              ) : gear.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <p className="font-medium text-muted-foreground">No gear assigned yet.</p>
                      <p className="text-xs text-muted-foreground/60">Contact your IT Admin if you are missing equipment.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                gear.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold">#ASSET-{item.asset_id}</TableCell>
                    <TableCell>{item.assignment_date}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500">
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-xs text-blue-500 hover:underline cursor-pointer">Report Issue</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
