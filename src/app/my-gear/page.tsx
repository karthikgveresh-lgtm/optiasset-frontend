"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
  asset: { name: string; asset_tag: string };
  assignment_date: string;
  status: string;
}

export default function MyGearPage() {
  const { role } = useAuth();
  const [gear, setGear] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  apiUrl = apiUrl.replace("http://", "https://").replace(/\/$/, "");
  
  // DYNAMIC ID based on role
  // Admin (Karthik) = ID 1
  // Employee (Jane) = ID 2
  const currentId = role === "Admin" ? 1 : 2;

  useEffect(() => {
    const fetchMyGear = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/dashboard/personal-assignments/${currentId}/`, {
          headers: { "Authorization": `Bearer ${currentId}` }
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
  }, [role, currentId]); // Refetch when role changes!

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">My Equipment</h1>
        <p className="text-white/60">Viewing assets for: <span className="text-white font-bold">{role === "Admin" ? "Karthik (Admin)" : "Jane (Employee)"}</span></p>
      </div>

      <Card className="bg-black/20 backdrop-blur-md border-white/10 shadow-2xl overflow-hidden">
        <CardHeader className="bg-white/5 border-b border-white/10">
          <CardTitle className="text-lg text-white">Currently Assigned</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/80">Asset Tag</TableHead>
                <TableHead className="text-white/80">Name</TableHead>
                <TableHead className="text-white/80">Assigned On</TableHead>
                <TableHead className="text-white/80 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="h-24 text-center text-white/40">Checking your records...</TableCell></TableRow>
              ) : gear.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <p className="font-medium text-white/40">No gear assigned to this profile.</p>
                  </TableCell>
                </TableRow>
              ) : (
                gear.map((item) => (
                  <TableRow key={item.id} className="border-white/5">
                    <TableCell className="font-bold text-white">{item.asset.asset_tag}</TableCell>
                    <TableCell className="text-white/90">{item.asset.name}</TableCell>
                    <TableCell className="text-white/60">{item.assignment_date}</TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400">
                        {item.status}
                      </span>
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
