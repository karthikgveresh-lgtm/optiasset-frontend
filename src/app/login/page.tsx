"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Lock, User, Laptop } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Simple logic: if email contains "admin", log in as Admin. Otherwise, Employee.
      if (email.toLowerCase().includes("admin")) {
        login("Admin");
      } else {
        login("Employee");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent">
      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      
      <Card className="w-full max-w-[400px] bg-black/20 backdrop-blur-2xl border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-white relative z-10 overflow-hidden">
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x" />
        
        <CardHeader className="space-y-1 pt-8 pb-6 text-center">
          <div className="mx-auto bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
            <Laptop className="w-8 h-8 text-blue-400" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tighter">
            OPTI<span className="text-white/40 font-light">ASSET</span>
          </CardTitle>
          <CardDescription className="text-white/50 font-medium">
            Enterprise Asset Management System
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-8">
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
                  className="bg-white/5 border-white/10 pl-10 h-11 focus:ring-blue-500 focus:border-blue-500"
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
                  className="bg-white/5 border-white/10 pl-10 h-11 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-11 bg-white text-black font-bold hover:bg-white/90 transition-all duration-300 shadow-xl"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-white/30">Mock Access for Testing</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => login("Admin")}
              className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white text-xs h-9"
            >
              Demo Admin
            </Button>
            <Button 
              variant="outline" 
              onClick={() => login("Employee")}
              className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white text-xs h-9"
            >
              Demo Employee
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <p className="absolute bottom-8 text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">
        Secure Industrial Terminal v1.0.4
      </p>
    </div>
  );
}
