import { ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(120,198,163,0.45),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(47,143,107,0.2),_transparent_35%)]" />
            <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="max-w-2xl"
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2f8f6b]/20 bg-white/70 px-4 py-2 text-sm font-medium text-[#1b5e4b]">
                        <Leaf size={16} />
                        Réemploi du matériel universitaire
                    </div>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                        L&apos;université met du matériel à disposition des étudiants dans une logique de réemploi.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-8 text-[#1b5e4b]">
                        PeriGreen aide les universités à distribuer, suivre et réaffecter leur matériel pour éviter le
                        gaspillage, favoriser le réemploi et diminuer l&apos;empreinte carbone du campus.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link to="/dashboard">
                            <Button size="lg" className="w-full rounded-full bg-[#0f3d2e] px-7 text-white hover:bg-[#1b5e4b] sm:w-auto">
                                Accéder au dashboard
                            </Button>
                        </Link>
                        <a href="#features" className="sm:w-auto">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="w-full rounded-full border-[#2f8f6b]/30 bg-white/80 px-7 text-[#0f3d2e] hover:bg-white"
                            >
                                Découvrir la plateforme
                                <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
                    className="lg:justify-self-end"
                >
                    <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,61,46,0.12)] backdrop-blur">
                        <div className="rounded-[1.5rem] bg-[#0f3d2e] p-6 text-[#e6f5ef]">
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#78c6a3]">Aperçu</p>
                            <h2 className="mt-4 text-2xl font-bold">Une plateforme pour connecter université, admin et étudiants.</h2>
                            <p className="mt-4 text-sm leading-7 text-[#d7eee4]">
                                L&apos;université peut remettre du matériel en circulation, l&apos;administration suit les affectations
                                et les étudiants accèdent plus facilement aux équipements disponibles.
                            </p>
                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl bg-white/10 p-4">
                                    <div className="text-2xl font-black">Étudiants</div>
                                    <div className="mt-1 text-sm text-[#d7eee4]">Accès facilité au matériel utile</div>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-4">
                                    <div className="text-2xl font-black">Réemploi</div>
                                    <div className="mt-1 text-sm text-[#d7eee4]">Moins de gaspillage, plus d&apos;impact</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
