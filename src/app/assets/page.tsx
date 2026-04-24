"use client";

import { useState, useEffect } from "react";
import { 
  Laptop, 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown,
  MoreVertical,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Asset {
  id: number;
  asset_id: string;
  name: string;
  category: string;
  status: string;
  purchase_date: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    if (url.includes("railway.app") && !url.startsWith("https://")) {
      url = "https://" + url.replace("http://", "");
    }
    return url.replace(/\/$/, "");
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/assets`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      }
    } catch (error) {
      console.error("Fetch assets error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.asset_id.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
            Master <span className="text-white/20 font-light not-italic">Inventory</span>
          </h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1 italic">
            Managing {assets.length} global hardware assets
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={fetchAssets} 
            variant="outline" 
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button className="bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl px-6 hover:bg-white/90 shadow-xl shadow-white/10">
            <Plus className="w-4 h-4 mr-2" /> Add Asset
          </Button>
        </div>
      </div>

      <Card className="bg-black/20 backdrop-blur-3xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-white/20 group-focus-within:text-white transition-colors" />
            <Input
              placeholder="SEARCH BY SERIAL, NAME OR CATEGORY..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border-white/10 pl-11 h-12 text-[10px] font-black uppercase tracking-widest rounded-2xl focus:ring-1 focus:ring-white/20"
            />
          </div>
          <Button variant="outline" className="bg-white/5 border-white/10 text-white/60 hover:text-white h-12 rounded-2xl px-6">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                <th className="px-4 py-5">Asset Tag</th>
                <th className="px-4 py-5">Inventory Name</th>
                <th className="px-4 py-5">Category</th>
                <th className="px-4 py-5">Status</th>
                <th className="px-4 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-4 py-5 h-16 bg-white/5 rounded-xl mb-2" />
                  </tr>
                ))
              ) : filteredAssets.length > 0 ? (
                filteredAssets.slice(0, 50).map((asset) => (
                  <tr key={asset.id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-5">
                      <span className="text-xs font-black text-blue-400 font-mono tracking-tighter">{asset.asset_id}</span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                          <Laptop className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">{asset.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-xs font-medium text-white/40 italic">{asset.category}</td>
                    <td className="px-4 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        asset.status === 'Available' ? 'bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]' :
                        asset.status === 'Assigned' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                        asset.status === 'Maintenance' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                        'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-white/20" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-20 text-center text-white/10 font-black uppercase tracking-[0.3em] text-xs">
                    Inventory is currently empty // System Sync Required
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
