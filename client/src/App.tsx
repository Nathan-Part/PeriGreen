import { Suspense, lazy, useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import HomeLayout from "./components/layout/HomeLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./hooks/useAuth";

// Lazy loading pages for better performance and clean structure
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inventory = lazy(() => import("./pages/Inventory"));
const EquipmentDetail = lazy(() => import("./pages/EquipmentDetail"));
const Loans = lazy(() => import("./pages/Loans"));
const Stats = lazy(() => import("./pages/Stats"));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { checkAuth, isLoading } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Homepage routes */}
          <Route element={<HomeLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/:id" element={<EquipmentDetail />} />
            <Route path="loans" element={<Loans />} />
            <Route path="stats" element={<Stats />} />
          </Route>

          {/* Legacy routes - also protected */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Inventory />} />
            <Route path=":id" element={<EquipmentDetail />} />
          </Route>
          <Route
            path="/loans"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Loans />} />
          </Route>
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Stats />} />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <h2 className="text-4xl font-black text-gray-200 mb-2">404</h2>
                <h3 className="text-xl font-bold text-gray-800">
                  Page Introuvable
                </h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                  Désolé, la ressource que vous recherchez semble avoir été
                  déplacée ou n&apos;existe plus.
                </p>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
