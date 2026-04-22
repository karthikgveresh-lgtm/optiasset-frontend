"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface Assignment {
  id: number;
  asset_id: number;
  employee_id: number;
  assignment_date: string;
  status: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    asset_id: "",
    employee_id: "",
    assigned_by_id: 1, // Admin
    assignment_date: new Date().toISOString().split('T')[0],
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/assignments`, {
        headers: { "Authorization": "Bearer 1" }
      });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/assignments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer 1"
        },
        body: JSON.stringify({
          ...formData,
          asset_id: parseInt(formData.asset_id),
          employee_id: parseInt(formData.employee_id)
        }),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({ asset_id: "", employee_id: "", assigned_by_id: 1, assignment_date: new Date().toISOString().split('T')[0] });
        fetchAssignments();
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Assignments</h1>
          <p className="text-muted-foreground">Track and manage equipment deployment across the team.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="lg" className="shadow-lg">New Assignment</Button>} />
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create Assignment</DialogTitle>
                <DialogDescription>Link an available asset to an employee.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="asset">Asset ID</Label>
                  <Input id="asset" type="number" required value={formData.asset_id} onChange={(e) => setFormData({...formData, asset_id: e.target.value})} placeholder="e.g. 1" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="emp">Employee ID</Label>
                  <Input id="emp" type="number" required value={formData.employee_id} onChange={(e) => setFormData({...formData, employee_id: e.target.value})} placeholder="e.g. 1" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Assignment Date</Label>
                  <Input id="date" type="date" required value={formData.assignment_date} onChange={(e) => setFormData({...formData, assignment_date: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleSubmit} className="w-full shadow-md">
                  Deploy Asset
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Assignment ID</TableHead>
                <TableHead>Asset ID</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading Assignments...</TableCell></TableRow>
              ) : assignments.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">No active assignments found.</TableCell></TableRow>
              ) : (
                assignments.map((asgn) => (
                  <TableRow key={asgn.id}>
                    <TableCell className="font-medium">ASGN-{asgn.id}</TableCell>
                    <TableCell>Asset #{asgn.asset_id}</TableCell>
                    <TableCell>Employee #{asgn.employee_id}</TableCell>
                    <TableCell>{asgn.assignment_date}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500">{asgn.status}</span>
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
