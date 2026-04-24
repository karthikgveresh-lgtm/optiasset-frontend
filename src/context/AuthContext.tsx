"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type Role = "Admin" | "Employee";

interface AuthContextType {
  role: Role;
  userId: number | null;
  userEmail: string | null; // Store user email
  isAuthenticated: boolean;
  login: (role: Role, id: number, email: string) => void;
  logout: () => void;
  permissions: string[];
}

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  Admin: ["view:dashboard", "manage:assets", "manage:users", "manage:assignments"],
  Employee: ["view:dashboard", "view:my_assets", "report:issue"],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("Employee");
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedAuth = localStorage.getItem("optiasset_auth");
    const savedRole = localStorage.getItem("optiasset_role") as Role;
    const savedId = localStorage.getItem("optiasset_id");
    const savedEmail = localStorage.getItem("optiasset_email");
    
    if (savedAuth === "true" && savedRole && savedId) {
      setIsAuthenticated(true);
      setRoleState(savedRole);
      setUserId(parseInt(savedId));
      setUserEmail(savedEmail);
    } else if (pathname !== "/login" && pathname !== "/signup" && pathname !== "/") {
      router.push("/");
    }
  }, [pathname]);

  const login = (selectedRole: Role, id: number, email: string) => {
    setIsAuthenticated(true);
    setRoleState(selectedRole);
    setUserId(id);
    setUserEmail(email);
    localStorage.setItem("optiasset_auth", "true");
    localStorage.setItem("optiasset_role", selectedRole);
    localStorage.setItem("optiasset_id", id.toString());
    localStorage.setItem("optiasset_email", email);
    router.push("/dashboard");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUserEmail(null);
    localStorage.removeItem("optiasset_auth");
    localStorage.removeItem("optiasset_role");
    localStorage.removeItem("optiasset_id");
    localStorage.removeItem("optiasset_email");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ 
      role, 
      userId,
      userEmail,
      isAuthenticated, 
      login, 
      logout, 
      permissions: ROLE_PERMISSIONS[role] 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
