"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, User, Laptop, AlertCircle, ShieldCheck, UserCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [chosenRole, setChosenRole] = useState("Employee");

  useEffect(() => {
    const role = localStorage.getItem("optiasset_temp_role") || "Employee";
    setChosenRole(role);
  }, []);

  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  apiUrl = apiUrl.replace("http://", "https://").replace(/\/$/, "");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // 1. Try to Login
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.role as any);
      } else if (response.status === 401) {
        // 2. If login fails because user doesn't exist, we should check if we can sign them up
        // Instead of complex checking, we'll guide them to signup with their choice
        setError("Account not found. Click 'Join System' below to register.");
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Server connection failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent">
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      
      <Card className="w-full max-w-[400px] bg-black/20 backdrop-blur-2xl border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-white relative z-10 overflow-hidden">
        {/* Dynamic Accent Color based on role */}
        <div className={`h-1 w-full bg-gradient-to-r ${chosenRole === 'Admin' ? 'from-blue-600 to-cyan-400' : 'from-purple-600 to-pink-400'} animate-gradient-x`} />
        
        <div className="p-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="text-white/40 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            {chosenRole === 'Admin' ? <ShieldCheck className="w-3 h-3 text-blue-400" /> : <UserCircle className="w-3 h-3 text-purple-400" />}
            <span className="text-[10px] font-black uppercase tracking-widest">{chosenRole} Mode</span>
          </div>
        </div>

        <CardHeader className="space-y-1 pt-2 pb-6 text-center">
          <CardTitle className="text-3xl font-black tracking-tighter">
            OPTI<span className="text-white/40 font-light">ASSET</span>
          </CardTitle>
          <CardDescription className="text-white/50 font-medium italic">
            Enter Credentials to Initialize
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-xs font-bold uppercase">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 pl-10 h-11 focus:ring-1 focus:ring-white/20"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                <Input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 pl-10 h-11 focus:ring-1 focus:ring-white/20"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-11 bg-white text-black font-black uppercase tracking-widest hover:bg-white/90 transition-all duration-300 shadow-xl"
            >
              {isLoading ? "Validating..." : "Initialize Session"}
            </Button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold mb-3">New to the terminal?</p>
            <Link 
              href="/signup" 
              className={`inline-block px-6 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest transition-all ${chosenRole === 'Admin' ? 'hover:bg-blue-600/20 hover:border-blue-500/50 text-blue-400' : 'hover:bg-purple-600/20 hover:border-purple-500/50 text-purple-400'}`}
            >
              Join System as {chosenRole}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
