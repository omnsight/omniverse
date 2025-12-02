import { useAuth } from "react-oidc-context";
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Geovision } from './pages/Geovision';
import { AdminPanel } from './pages/AdminPanel';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorPage } from './pages/ErrorPage';
import { SearchModel } from "./components/SearchModel";
import { useAppStore } from "./store/useAppStore";
import { useEffect } from "react";
import { KEYCLOAK_CLIENT_ID } from "./constants";

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function App() {
  const auth = useAuth();
  const { user, setUser } = useAppStore();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const profile = auth.user.profile;
      const accessToken = auth.user.access_token;

      const decodedToken = parseJwt(accessToken);
      const clientRoles = decodedToken?.resource_access?.[KEYCLOAK_CLIENT_ID]?.roles || [];

      setUser({
        name: profile.preferred_username || profile.name || "User",
        email: profile.email || "",
        roles: clientRoles
      });
    } else if (!auth.isLoading && !auth.isAuthenticated) {
      setUser(undefined);
    }
  }, [auth.isAuthenticated, auth.user, setUser]);

  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
        <Sidebar />

        {/* Main content area */}
        <div className="flex min-h-0 flex-1 flex-col">
          <TopBar>
            <SearchModel />
          </TopBar>

          <main className="flex-1 overflow-auto bg-slate-950">
            <Routes>
              <Route path="/" element={<Geovision />} />
              <Route path="/geovision" element={<Geovision />} />
              <Route path="/admin" element={user?.roles.includes('admin') ? <AdminPanel /> : <ErrorPage message="您没有权限访问管理面板" />} />
              <Route path="/unauthorized" element={<ErrorPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </BrowserRouter>
  );
}

export default App;