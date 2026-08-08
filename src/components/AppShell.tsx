import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";
import { Brand } from "./Brand";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav className="header-actions" aria-label="Hauptnavigation">
            {user ? (
              <button className="button button-ghost button-small" onClick={handleSignOut}>
                <LogOut size={16} /> Abmelden
              </button>
            ) : (
              <Link className="button button-ghost button-small" to="/login">Anmelden</Link>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Scaller</span>
        <span>Seller onboarding · Pakistan COD infrastructure</span>
      </footer>
    </div>
  );
}
