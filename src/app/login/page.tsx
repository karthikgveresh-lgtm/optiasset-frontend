"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, User, Laptop, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  apiUrl = apiUrl.replace("http://", "https://").replace(/\/$/, "");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.role as any);
      } else {
        const errData = await response.json();
        setError(errData.detail || "Invalid credentials");
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
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
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
                  className="bg-white/5 border-white/10 pl-10 h-11 focus:ring-blue-500"
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
                  className="bg-white/5 border-white/10 pl-10 h-11 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-11 bg-white text-black font-bold hover:bg-white/90 transition-all duration-300"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-white/40">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:underline font-bold">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
