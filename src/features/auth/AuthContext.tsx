import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { loginRequest } from "../../services/authApi";
import type { AuthUser, Role } from "../../types/auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: Role | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  enterDevelopmentMode: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = "keystone.auth";

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<{ token: string; user: AuthUser } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) ?? sessionStorage.getItem(storageKey);
    if (!saved) return;
    try { setSession(JSON.parse(saved)); } catch { localStorage.removeItem(storageKey); sessionStorage.removeItem(storageKey); }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: Boolean(session), user: session?.user ?? null, role: session?.user.role ?? null, token: session?.token ?? null,
    login: async (email, password) => {
      const result = await loginRequest(email, password);
      setSession(result);
      localStorage.setItem(storageKey, JSON.stringify(result));
    },
    enterDevelopmentMode: (role) => {
      // Deliberately tokenless: API calls remain protected and are never simulated.
      const developmentSession = { token: "", user: { id: "UI-DEVELOPMENT-ONLY", email: "Development access", role } } satisfies { token: string; user: AuthUser };
      setSession(developmentSession);
      sessionStorage.setItem(storageKey, JSON.stringify(developmentSession));
    },
    logout: () => { setSession(null); localStorage.removeItem(storageKey); sessionStorage.removeItem(storageKey); },
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
