import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Laptop, Archive, BarChart3,
  Menu, LogOut, ClipboardList, Users, CalendarCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

// ─── Navigation selon rôle ───────────────────────────────────────────────────

const adminNav = [
  { label: 'Tableau de bord',  href: '/dashboard',              icon: LayoutDashboard },
  { label: 'Inventaire',       href: '/dashboard/inventory',    icon: Laptop },
  { label: 'Emprunts',         href: '/dashboard/loans',        icon: Archive },
  { label: 'Réservations',     href: '/dashboard/reservations', icon: ClipboardList },
  { label: 'Statistiques',     href: '/dashboard/stats',        icon: BarChart3 },
];

const userNav = [
  { label: 'Tableau de bord',      href: '/espace',                          icon: LayoutDashboard },
  { label: 'Inventaire',           href: '/espace/inventaire',               icon: Laptop },
  { label: 'Mes réservations',     href: '/espace/reservations',             icon: CalendarCheck },
];

// ─── Composant ───────────────────────────────────────────────────────────────

export const AppLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const navigation = isAdmin ? adminNav : userNav;
  const roleLabel = isAdmin ? 'Administrateur' : 'Étudiant';
  const initials = user?.email?.split('@')[0]?.substring(0, 2)?.toUpperCase() ?? 'U';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href: string) =>
    href === '/dashboard' || href === '/espace'
      ? location.pathname === href
      : location.pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900 overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col shadow-sm"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to={isAdmin ? '/dashboard' : '/espace'} className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-green-100 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all duration-200">
              <Laptop size={17} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-green-600">
              Peri<span className="text-gray-900">Green</span>
            </span>
          </Link>
        </div>

        {/* Badge rôle */}
        <div className="mx-4 mt-4 mb-2">
          <span className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
            isAdmin
              ? 'bg-purple-50 text-purple-700 border border-purple-100'
              : 'bg-green-50 text-green-700 border border-green-100'
          )}>
            {isAdmin ? <Users size={11} /> : <CalendarCheck size={11} />}
            {roleLabel}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-green-50 text-green-700 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                )}
              >
                <Icon size={17} className={cn(active ? 'text-green-600' : 'text-gray-400')} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer user */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {user?.email?.split('@')[0] ?? 'Utilisateur'}
              </span>
              <span className="text-xs text-gray-400 truncate">{roleLabel}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ── Contenu principal ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <button
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />

        </header>

        {/* Mobile nav overlay */}
        {mobileOpen && (
          <div className="md:hidden absolute inset-0 z-50 bg-black/40" onClick={() => setMobileOpen(false)}>
            <motion.nav
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              className="w-64 bg-white h-full flex flex-col shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <span className="text-xl font-bold text-green-600">Peri<span className="text-gray-900">Green</span></span>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        active ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50'
                      )}
                    >
                      <Icon size={17} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
