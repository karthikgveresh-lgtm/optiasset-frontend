"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type Role = "Admin" | "Employee";

interface AuthContextType {
  role: Role;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;
  permissions: string[];
}

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  Admin: ["view:dashboard", "manage:assets", "manage:users", "manage:assignments"],
  Employee: ["view:dashboard", "view:my_assets", "report:issue"],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("Admin");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Load auth state from localStorage on boot
  useEffect(() => {
    const savedAuth = localStorage.getItem("optiasset_auth");
    const savedRole = localStorage.getItem("optiasset_role") as Role;
    
    if (savedAuth === "true" && savedRole) {
      setIsAuthenticated(true);
      setRoleState(savedRole);
    } else if (pathname !== "/login") {
      router.push("/login");
    }
  }, []);

  const login = (selectedRole: Role) => {
    setIsAuthenticated(true);
    setRoleState(selectedRole);
    localStorage.setItem("optiasset_auth", "true");
    localStorage.setItem("optiasset_role", selectedRole);
    router.push("/dashboard");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("optiasset_auth");
    localStorage.removeItem("optiasset_role");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      role, 
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
