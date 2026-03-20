import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Menu, X, User, LogIn, LayoutDashboard } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

export function PublicNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    const closeMenu = () => setIsOpen(false);

    return (
        <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-[#e6f5ef]/90 backdrop-blur-md">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3 text-[#0f3d2e]" onClick={closeMenu}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f3d2e] text-[#e6f5ef] shadow-sm">
                        <Leaf size={18} strokeWidth={2.4} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">PeriGreen</span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    <a href="#features" className="text-sm font-medium text-[#1b5e4b] transition-colors hover:text-[#0f3d2e]">
                        Catalogue
                    </a>
                    
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/register"
                                className="text-sm font-medium text-[#1b5e4b] transition-colors hover:text-[#0f3d2e]"
                            >
                                Inscription
                            </Link>
                            <Link
                                to="/login"
                                className="btn-primary px-5 py-2 text-sm"
                            >
                                <LogIn size={16} />
                                Se connecter
                            </Link>
                        </>
                    ) : (
                        <Link
                            to={isAdmin ? "/dashboard" : "/espace"}
                            className="btn-primary px-5 py-2 text-sm"
                        >
                            {isAdmin ? <LayoutDashboard size={16} /> : <User size={16} />}
                            {isAdmin ? 'Administration' : 'Mon Espace'}
                        </Link>
                    )}
                </nav>

                <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0f3d2e]/15 text-[#0f3d2e] md:hidden"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <div className={cn('border-t border-emerald-950/10 bg-[#e6f5ef] md:hidden', isOpen ? 'block' : 'hidden')}>
                <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
                    <a
                        href="#features"
                        className="rounded-2xl px-4 py-3 text-sm font-medium text-[#1b5e4b] transition-colors hover:bg-white/60 hover:text-[#0f3d2e]"
                        onClick={closeMenu}
                    >
                        Catalogue
                    </a>
                    
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/register"
                                className="rounded-2xl px-4 py-3 text-sm font-medium text-[#1b5e4b] transition-colors hover:bg-white/60 hover:text-[#0f3d2e]"
                                onClick={closeMenu}
                            >
                                Inscription
                            </Link>
                            <Link
                                to="/login"
                                className="mt-2 btn-primary w-full py-3"
                                onClick={closeMenu}
                            >
                                <LogIn size={18} />
                                Se connecter
                            </Link>
                        </>
                    ) : (
                        <Link
                            to={isAdmin ? "/dashboard" : "/espace"}
                            className="mt-2 btn-primary w-full py-3"
                            onClick={closeMenu}
                        >
                            {isAdmin ? <LayoutDashboard size={18} /> : <User size={18} />}
                            {isAdmin ? 'Administration' : 'Mon Espace'}
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
