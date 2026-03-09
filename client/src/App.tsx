import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

// Lazy loading pages for better performance and clean structure
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const EquipmentDetail = lazy(() => import('./pages/EquipmentDetail'));
const Loans = lazy(() => import('./pages/Loans'));
const Stats = lazy(() => import('./pages/Stats'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/:id" element={<EquipmentDetail />} />
            <Route path="loans" element={<Loans />} />
            <Route path="stats" element={<Stats />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <h2 className="text-4xl font-black text-gray-200 mb-2">404</h2>
                <h3 className="text-xl font-bold text-gray-800">Page Introuvable</h3>
                <p className="text-gray-500 mt-2 max-w-sm">Désolé, la ressource que vous recherchez semble avoir été déplacée ou n'existe plus.</p>
              </div>
            } />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
