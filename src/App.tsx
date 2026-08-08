import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ConfirmedRoute } from "./components/RouteGuards";
import { AuthProvider } from "./contexts/AuthContext";
import { I18nProvider } from "./contexts/I18nProvider";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { CheckEmailPage } from "./pages/CheckEmailPage";
import LandingPage from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { SignUpPage } from "./pages/SignUpPage";

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<ShellLayout />}>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/check-email" element={<CheckEmailPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/register" element={<ConfirmedRoute><RegistrationPage /></ConfirmedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}

function ShellLayout() {
  return <AppShell><Outlet /></AppShell>;
}
