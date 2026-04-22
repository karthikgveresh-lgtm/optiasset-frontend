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

interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  department?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    role_id: 2,
  });

  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  apiUrl = apiUrl.replace("http://", "https://").replace(/\/$/, "");

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/employees/`, {
        headers: { "Authorization": "Bearer 1" }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/employees/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer 1"
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({ employee_code: "", first_name: "", last_name: "", email: "", department: "", role_id: 2 });
        fetchUsers();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Employee Directory</h1>
          <p className="text-white/60">Manage company personnel and their access roles.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="lg" className="bg-white text-black hover:bg-white/90 shadow-xl">+ Add Employee</Button>} />
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-white/10 text-white">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription className="text-white/60">Create a new profile for the employee directory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="code">ID Code</Label>
                    <Input id="code" required className="bg-black/50 border-white/10" value={formData.employee_code} onChange={(e) => setFormData({...formData, employee_code: e.target.value})} placeholder="EMP-001" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dept">Department</Label>
                    <Input id="dept" className="bg-black/50 border-white/10" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} placeholder="IT" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fname">First Name</Label>
                    <Input id="fname" required className="bg-black/50 border-white/10" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lname">Last Name</Label>
                    <Input id="lname" required className="bg-black/50 border-white/10" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required className="bg-black/50 border-white/10" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={() => handleSubmit()} className="w-full bg-white text-black hover:bg-white/90">
                  Create Profile
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
                <TableHead className="text-white/80">Code</TableHead>
                <TableHead className="text-white/80">Full Name</TableHead>
                <TableHead className="text-white/80">Email</TableHead>
                <TableHead className="text-white/80">Department</TableHead>
                <TableHead className="text-white/80 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center text-white/40">Loading Directory...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center text-white/40">No employees found.</TableCell></TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white">{user.employee_code}</TableCell>
                    <TableCell className="text-white/90">{user.first_name} {user.last_name}</TableCell>
                    <TableCell className="text-white/70">{user.email}</TableCell>
                    <TableCell className="text-white/50 italic">{user.department || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400">Active</span>
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
