import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
    { label: 'Accueil', href: '#top' },
    { label: 'Catalogue', href: '#features' },
    { label: 'Inscription', href: '#signup' },
    { label: 'Espace étudiant', href: '#student-space' },
    { label: 'Espace admin', href: '#admin-space' },
];

export function PublicNavbar() {
    const [isOpen, setIsOpen] = useState(false);

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
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-[#1b5e4b] transition-colors hover:text-[#0f3d2e]"
                        >
                            {item.label}
                        </a>
                    ))}
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center rounded-full bg-[#0f3d2e] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1b5e4b]"
                    >
                        Dashboard
                    </Link>
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
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="rounded-2xl px-4 py-3 text-sm font-medium text-[#1b5e4b] transition-colors hover:bg-white/60 hover:text-[#0f3d2e]"
                            onClick={closeMenu}
                        >
                            {item.label}
                        </a>
                    ))}
                    <Link
                        to="/dashboard"
                        className="mt-2 rounded-full bg-[#0f3d2e] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1b5e4b]"
                        onClick={closeMenu}
                    >
                        Dashboard
                    </Link>
                </nav>
            </div>
        </header>
    );
}
