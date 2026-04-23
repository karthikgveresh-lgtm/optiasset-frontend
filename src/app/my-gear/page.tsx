"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Laptop, 
  Monitor, 
  Smartphone, 
  Keyboard, 
  MousePointer2, 
  HardDrive,
  Info,
  Calendar,
  ShieldCheck
} from "lucide-react";

interface UserAsset {
  id: number;
  asset_name: string;
  asset_id: string;
  assigned_date: string;
}

export default function MyGearPage() {
  const { userId } = useAuth();
  const [gear, setGear] = useState<UserAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyGear = async () => {
      if (!userId) return;
      
      try {
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        apiUrl = apiUrl.replace("http://", "https://").replace(/\/$/, "");

        // Removed the trailing slash to match the new backend routes
        const response = await fetch(`${apiUrl}/api/dashboard/personal-assignments/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setGear(data);
        }
      } catch (error) {
        console.error("Fetch gear error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyGear();
  }, [userId]);

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("laptop") || n.includes("macbook")) return <Laptop className="w-6 h-6" />;
    if (n.includes("monitor") || n.includes("display")) return <Monitor className="w-6 h-6" />;
    if (n.includes("phone") || n.includes("iphone")) return <Smartphone className="w-6 h-6" />;
    if (n.includes("keyboard")) return <Keyboard className="w-6 h-6" />;
    if (n.includes("mouse")) return <MousePointer2 className="w-6 h-6" />;
    return <HardDrive className="w-6 h-6" />;
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
          MY <span className="text-white/20 font-light not-italic">GEAR</span>
        </h1>
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1 italic">Personal Inventory & Assignments</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white/5 rounded-[32px] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : gear.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gear.map((item) => (
            <Card key={item.id} className="bg-black/20 backdrop-blur-3xl border border-white/5 rounded-[32px] overflow-hidden group hover:border-white/20 transition-all duration-500 shadow-2xl hover:scale-[1.02]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500">
                    {getIcon(item.asset_name)}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Serial / ID</span>
                    <span className="text-xs font-mono font-black text-blue-400">{item.asset_id}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{item.asset_name}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white/40">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Assigned: {item.assigned_date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-500/80">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Asset</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 flex justify-between items-center border-t border-white/5 group-hover:bg-white/10 transition-colors">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">Inventory Terminal // OPTI-PRO</span>
                <Info className="w-3 h-3 text-white/20" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-black/20 backdrop-blur-md rounded-[40px] border border-white/5 border-dashed">
          <div className="bg-white/5 p-6 rounded-full mb-6">
            <HardDrive className="w-12 h-12 text-white/10" />
          </div>
          <h2 className="text-2xl font-black text-white/20 uppercase italic italic">No Gear Assigned</h2>
          <p className="text-white/10 text-xs font-bold uppercase tracking-widest mt-2">Contact your administrator for equipment</p>
        </div>
      )}
    </div>
  );
}
