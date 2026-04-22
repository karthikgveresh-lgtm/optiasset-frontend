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

interface Asset {
  id: number;
  asset_tag: string;
  name: string;
  category: string;
  status: string;
  serial_number: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    asset_tag: "",
    name: "",
    category: "Laptop",
    serial_number: "",
  });

  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  apiUrl = apiUrl.replace("http://", "https://").replace(/\/$/, "");

  const fetchAssets = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/assets/`, {
        headers: { "Authorization": "Bearer 1" }
      });
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/assets/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer 1"
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({ asset_tag: "", name: "", category: "Laptop", serial_number: "" });
        fetchAssets();
      }
    } catch (error) {
      console.error("Error creating asset:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Master Inventory</h1>
          <p className="text-white/60">Manage and track all company hardware assets.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="lg" className="bg-white text-black hover:bg-white/90 shadow-xl">+ Add Asset</Button>} />
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-white/10 text-white">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription className="text-white/60">Enter the hardware details below to add it to inventory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="tag">Asset Tag (e.g. LAP-001)</Label>
                  <Input id="tag" required className="bg-black/50 border-white/10" value={formData.asset_tag} onChange={(e) => setFormData({...formData, asset_tag: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Asset Name (e.g. MacBook Pro 16")</Label>
                  <Input id="name" required className="bg-black/50 border-white/10" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select 
                    id="category" 
                    className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm"
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Peripheral">Peripheral</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="serial">Serial Number</Label>
                  <Input id="serial" required className="bg-black/50 border-white/10" value={formData.serial_number} onChange={(e) => setFormData({...formData, serial_number: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={() => handleSubmit()} className="w-full bg-white text-black hover:bg-white/90">
                  Save Asset
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
                <TableHead className="text-white/80">Name</TableHead>
                <TableHead className="text-white/80">Category</TableHead>
                <TableHead className="text-white/80">Serial</TableHead>
                <TableHead className="text-white/80 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center text-white/40">Loading Inventory...</TableCell></TableRow>
              ) : assets.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center text-white/40">No assets found in database.</TableCell></TableRow>
              ) : (
                assets.map((asset) => (
                  <TableRow key={asset.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white">{asset.asset_tag}</TableCell>
                    <TableCell className="text-white/90">{asset.name}</TableCell>
                    <TableCell className="text-white/70">{asset.category}</TableCell>
                    <TableCell className="font-mono text-xs text-white/50">{asset.serial_number}</TableCell>
                    <TableCell className="text-right">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        asset.status === "Available" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                      }`}>
                        {asset.status}
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
