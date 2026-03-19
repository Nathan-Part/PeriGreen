import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import HomeLayout from "./components/layout/HomeLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./hooks/useAuth";
import { ProtectedRoute, AdminRoute, UserRoute } from "./routes/guards";

// ─── Pages Admin ────────────────────────────────────────────────────────────
const Dashboard           = lazy(() => import("./pages/Dashboard"));
const Inventory           = lazy(() => import("./pages/Inventory"));
const EquipmentDetail     = lazy(() => import("./pages/EquipmentDetail"));
const Loans               = lazy(() => import("./pages/Loans"));
const Stats               = lazy(() => import("./pages/Stats"));
const GestionReservations = lazy(() => import("./pages/admin/GestionReservations"));

// ─── Pages User ─────────────────────────────────────────────────────────────
const TableauDeBordUser   = lazy(() => import("./pages/user/TableauDeBordUser"));
const MesReservations     = lazy(() => import("./pages/user/MesReservations"));
const NouvelleReservation = lazy(() => import("./pages/user/NouvelleReservation"));
const DetailReservation   = lazy(() => import("./pages/user/DetailReservation"));

// ─── Pages publiques ────────────────────────────────────────────────────────
const Home = lazy(() => import("./pages/Home"));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
    </div>
  );
}

function App() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* ── Public ─────────────────────────────────────────── */}
          <Route element={<HomeLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Admin ──────────────────────────────────────────── */}
          <Route
            path="/dashboard"
            element={<AdminRoute><AppLayout /></AdminRoute>}
          >
            <Route index                   element={<Dashboard />} />
            <Route path="inventory"        element={<Inventory />} />
            <Route path="inventory/:id"    element={<EquipmentDetail />} />
            <Route path="loans"            element={<Loans />} />
            <Route path="stats"            element={<Stats />} />
            <Route path="reservations"     element={<GestionReservations />} />
          </Route>

          {/* ── Espace Utilisateur ─────────────────────────────── */}
          <Route
            path="/espace"
            element={<UserRoute><AppLayout /></UserRoute>}
          >
            <Route index                            element={<TableauDeBordUser />} />
            <Route path="inventaire"               element={<Inventory />} />
            <Route path="inventaire/:id"           element={<EquipmentDetail />} />
            <Route path="reservations"             element={<MesReservations />} />
            <Route path="reservations/:id"         element={<DetailReservation />} />
            <Route path="reservations/nouvelle"    element={<NouvelleReservation />} />
          </Route>

          {/* ── Redirections legacy ────────────────────────────── */}
          <Route
            path="/inventory"
            element={<ProtectedRoute><Navigate to="/dashboard/inventory" replace /></ProtectedRoute>}
          />
          <Route
            path="/loans"
            element={<ProtectedRoute><Navigate to="/dashboard/loans" replace /></ProtectedRoute>}
          />

          {/* ── 404 ────────────────────────────────────────────── */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-screen text-center">
                <h2 className="text-6xl font-black text-gray-200 mb-2">404</h2>
                <h3 className="text-xl font-bold text-gray-800">Page introuvable</h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                  La ressource que vous recherchez a été déplacée ou n&apos;existe plus.
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
