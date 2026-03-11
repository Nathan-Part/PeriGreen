import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Laptop, Archive, BarChart3, Menu, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventaire', href: '/inventory', icon: Laptop },
    { name: 'Emprunts', href: '/loans', icon: Archive },
    { name: 'Statistiques', href: '/stats', icon: BarChart3 },
];

export const AppLayout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-surface flex text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-64 bg-white border-r border-border hidden md:flex flex-col"
            >
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <Link to="/dashboard" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                            <Laptop size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary-600 group-hover:text-primary-500 transition-colors">
                            Peri<span className="text-gray-900">Green</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-primary-50 text-primary-600 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <Icon size={18} className={cn(isActive ? 'text-primary-500' : 'text-gray-400')} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                            AD
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">Admin</span>
                            <span className="text-xs text-gray-500">Logistique</span>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6">
                    <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                        <Menu size={20} />
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:text-primary-600 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
