"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Role = "Admin" | "Employee";

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  permissions: string[];
}

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  Admin: ["view:dashboard", "manage:assets", "manage:users", "manage:assignments"],
  Employee: ["view:dashboard", "view:my_assets", "report:issue"],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Admin"); // Default to Admin for testing

  return (
    <AuthContext.Provider value={{ role, setRole, permissions: ROLE_PERMISSIONS[role] }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
