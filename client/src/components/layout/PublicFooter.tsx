import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
    { label: 'Accueil', href: '#top' },
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Bénéfices', href: '#admin-space' },
    { label: 'Découvrir', href: '#signup' },
];

export function PublicFooter() {
    return (
        <footer className="border-t border-[#2f8f6b]/10 bg-[#f4fbf7]">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
                <div className="max-w-md">
                    <div className="flex items-center gap-3 text-[#0f3d2e]">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f3d2e] text-[#e6f5ef]">
                            <Leaf size={18} strokeWidth={2.4} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">PeriGreen</span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[#1b5e4b]">
                        PeriGreen aide l&apos;université à mettre du matériel à disposition des étudiants dans une logique de
                        réemploi, de réduction du gaspillage et de diminution de l&apos;empreinte carbone.
                    </p>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
                    <nav className="flex flex-wrap gap-4 text-sm text-[#1b5e4b]">
                        {footerLinks.map((item) => (
                            <a key={item.label} href={item.href} className="transition-colors hover:text-[#0f3d2e]">
                                {item.label}
                            </a>
                        ))}
                    </nav>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center rounded-full bg-[#0f3d2e] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1b5e4b]"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </footer>
    );
}
