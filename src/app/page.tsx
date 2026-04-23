"use client";

import { useRouter } from "next/navigation";
import { Laptop, ShieldCheck, UserCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();

  const handleChoice = (role: string) => {
    // Save their choice and move to the auth page
    localStorage.setItem("optiasset_temp_role", role);
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-transparent relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Header */}
      <div className="relative z-10 text-center mb-16 space-y-4">
        <div className="mx-auto bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-xl">
          <Laptop className="w-10 h-10 text-blue-400" />
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">
          OPTI<span className="text-white/30 font-light not-italic">ASSET</span>
        </h1>
        <p className="text-white/40 font-bold tracking-[0.3em] text-sm">PRO TERMINAL v1.2.0</p>
      </div>

      {/* Choice Grid */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-6 relative z-10">
        
        {/* Admin Card */}
        <button 
          onClick={() => handleChoice("Admin")}
          className="group relative flex flex-col items-center p-12 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[40px] hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_80px_rgba(59,130,246,0.2)]"
        >
          <div className="mb-8 p-6 bg-blue-500/10 rounded-full group-hover:bg-blue-500 group-hover:text-black transition-all duration-500">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-wider">Admin Portal</h2>
          <p className="text-white/40 text-center text-sm font-medium leading-relaxed mb-8">
            Manage inventory, approve requests, and monitor system health.
          </p>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Initialize Access <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Employee Card */}
        <button 
          onClick={() => handleChoice("Employee")}
          className="group relative flex flex-col items-center p-12 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[40px] hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_80px_rgba(168,85,247,0.2)]"
        >
          <div className="mb-8 p-6 bg-purple-500/10 rounded-full group-hover:bg-purple-500 group-hover:text-black transition-all duration-500">
            <UserCircle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-wider">Employee Mode</h2>
          <p className="text-white/40 text-center text-sm font-medium leading-relaxed mb-8">
            Access your gear, report issues, and view personal assignments.
          </p>
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Access Terminal <ArrowRight className="w-4 h-4" />
          </div>
        </button>

      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none border-[32px] border-white/[0.02]" />
    </div>
  );
}
