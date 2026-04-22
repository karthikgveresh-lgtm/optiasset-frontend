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
  asset: { name: string; asset_tag: string };
  employee: { first_name: string; last_name: string };
  assignment_date: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    asset_id: "",
    employee_id: "",
    assigned_by_id: 1,
    assignment_date: new Date().toISOString().split('T')[0],
  });

  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  apiUrl = apiUrl.replace("http://", "https://").replace(/\/$/, "");

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/assignments/`, {
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/assignments/`, {
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
          <h1 className="text-3xl font-bold tracking-tight text-white">Asset Assignments</h1>
          <p className="text-white/60">Deploy hardware to employees and track active gear.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="lg" className="bg-white text-black hover:bg-white/90 shadow-xl">+ New Assignment</Button>} />
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-white/10 text-white">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Deploy Asset</DialogTitle>
                <DialogDescription className="text-white/60">Link a hardware asset to an employee profile.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="assetId">Asset ID (Numeric)</Label>
                  <Input id="assetId" required className="bg-black/50 border-white/10" value={formData.asset_id} onChange={(e) => setFormData({...formData, asset_id: e.target.value})} placeholder="e.g. 1" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="empId">Employee ID (Numeric)</Label>
                  <Input id="empId" required className="bg-black/50 border-white/10" value={formData.employee_id} onChange={(e) => setFormData({...formData, employee_id: e.target.value})} placeholder="e.g. 1" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Assignment Date</Label>
                  <Input id="date" type="date" required className="bg-black/50 border-white/10" value={formData.assignment_date} onChange={(e) => setFormData({...formData, assignment_date: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={() => handleSubmit()} className="w-full bg-white text-black hover:bg-white/90">
                  Deploy Asset
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-black/20 backdrop-blur-md border-white/10 shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10">
                <TableHead className="text-white/80">Asset Tag</TableHead>
                <TableHead className="text-white/80">Employee</TableHead>
                <TableHead className="text-white/80">Assigned On</TableHead>
                <TableHead className="text-white/80 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="h-24 text-center text-white/40">Loading Assignments...</TableCell></TableRow>
              ) : assignments.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="h-24 text-center text-white/40">No active assignments found.</TableCell></TableRow>
              ) : (
                assignments.map((asg) => (
                  <TableRow key={asg.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white">{asg.asset.asset_tag} - {asg.asset.name}</TableCell>
                    <TableCell className="text-white/90">{asg.employee.first_name} {asg.employee.last_name}</TableCell>
                    <TableCell className="text-white/50">{asg.assignment_date}</TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400">Deployed</span>
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
