import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function CTA() {
    return (
        <section id="signup" className="mx-auto max-w-7xl px-4 py-10 pb-16 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] bg-[#0f3d2e] px-8 py-10 text-[#e6f5ef] shadow-[0_24px_80px_rgba(15,61,46,0.18)] lg:px-12">
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#78c6a3]">Découvrir PeriGreen</p>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                        Une plateforme pour mieux équiper les étudiants tout en réduisant le gaspillage.
                    </h2>
                    <p className="mt-4 text-base leading-7 text-[#d7eee4]">
                        Explorez l&apos;espace PeriGreen et découvrez comment l&apos;université peut organiser le réemploi du
                        matériel au service des étudiants et d&apos;une gestion plus durable.
                    </p>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link to="/dashboard">
                        <Button size="lg" className="w-full rounded-full bg-green-300 px-7 text-[#0f3d2e] hover:bg-green-200 sm:w-auto">
                            Ouvrir la plateforme
                        </Button>
                    </Link>
                    <a
                        href="#features"
                        className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                    >
                        Revoir les fonctionnalités
                    </a>
                </div>
            </div>
        </section>
    );
}
