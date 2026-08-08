import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";
import { useI18n } from "../contexts/i18n";
import { Brand } from "./Brand";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const { t } = useI18n();
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
          <nav className="header-actions" aria-label="Navigation">
            <LanguageSwitcher compact />
            {user ? (
              <button className="button button-ghost button-small" onClick={handleSignOut}>
                <LogOut size={16} /> {t("common.signOut")}
              </button>
            ) : null}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Scaller</span>
        <span>{t("footer.line")}</span>
      </footer>
    </div>
  );
}
