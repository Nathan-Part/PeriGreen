import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import HomeLayout from './components/layout/HomeLayout';
import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import { DashboardRedirect, ProtectedRoute, PublicOnlyRoute } from './routes/guards';
import { ROUTES } from './routes/paths';

const AdminDashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const EquipmentDetail = lazy(() => import('./pages/EquipmentDetail'));
const Loans = lazy(() => import('./pages/Loans'));
const Stats = lazy(() => import('./pages/Stats'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-perigreen-600" />
    </div>
  );
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
          <Route element={<HomeLayout />}>
            <Route path={ROUTES.home} element={<HomePage />} />
          </Route>

          <Route
            path={ROUTES.login}
            element={(
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            )}
          />
          <Route
            path={ROUTES.register}
            element={(
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            )}
          />

          <Route
            path={ROUTES.dashboard}
            element={(
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            )}
          >
            <Route index element={<UserDashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/:id" element={<EquipmentDetail />} />
            <Route path="loans" element={<Loans />} />
          </Route>

          <Route
            path={ROUTES.adminRoot}
            element={(
              <ProtectedRoute requireAdmin>
                <AppLayout />
              </ProtectedRoute>
            )}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/:id" element={<EquipmentDetail />} />
            <Route path="loans" element={<Loans />} />
            <Route path="stats" element={<Stats />} />
          </Route>

          <Route path="/inventory" element={<DashboardRedirect />} />
          <Route path="/inventory/:id" element={<DashboardRedirect />} />
          <Route path="/loans" element={<DashboardRedirect />} />
          <Route path="/stats" element={<Navigate to={ROUTES.adminStats} replace />} />

          <Route
            path="*"
            element={(
              <div className="flex flex-col items-center justify-center h-screen text-center py-20">
                <h2 className="text-4xl font-black text-gray-200 mb-2">404</h2>
                <h3 className="text-xl font-bold text-gray-800">Page introuvable</h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                  La ressource demandee n existe pas ou n est pas accessible avec votre role.
                </p>
              </div>
            )}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
