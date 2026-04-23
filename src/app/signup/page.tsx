"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, User, Laptop, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  apiUrl = apiUrl.replace("http://", "https://").replace(/\/$/, "");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        const errData = await response.json();
        setError(errData.detail || "Signup failed");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent">
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      
      <Card className="w-full max-w-[450px] bg-black/20 backdrop-blur-2xl border-white/10 shadow-2xl text-white relative z-10 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600" />
        
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-black tracking-tighter">CREATE ACCOUNT</CardTitle>
          <CardDescription className="text-white/50">Join OptiAsset Enterprise</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Success! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className="bg-white/5 border-white/10 h-11"
              />
              <Input
                placeholder="Last Name"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className="bg-white/5 border-white/10 h-11"
              />
            </div>
            
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-white/30" />
              <Input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-white/5 border-white/10 pl-10 h-11"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-white/30" />
              <Input
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="bg-white/5 border-white/10 pl-10 h-11"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || success}
              className="w-full h-11 bg-white text-black font-bold hover:bg-white/90"
            >
              {isLoading ? "Creating Account..." : "Register Now"}
            </Button>
          </form>

          <div className="text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
