import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isConfirmed: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
