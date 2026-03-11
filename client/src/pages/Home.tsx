import {
    ArrowRight,
    ArrowRightLeft,
    Building2,
    ClipboardList,
    GraduationCap,
    Leaf,
    ShieldCheck,
    Sprout,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const featureCards = [
    {
        icon: ClipboardList,
        title: 'Inventaire centralise',
        description: "L'universite garde une vision claire du materiel disponible, attribue ou en attente de reaffectation.",
    },
    {
        icon: ArrowRightLeft,
        title: 'Mise a disposition simple',
        description: 'Les equipements utiles peuvent etre remis rapidement en circulation pour les etudiants qui en ont besoin.',
    },
    {
        icon: ShieldCheck,
        title: 'Suivi administratif',
        description: "Les equipes suivent les mouvements, les retours et les attributions sans alourdir l'organisation.",
    },
];

const benefitCards = [
    {
        icon: GraduationCap,
        title: 'Pour les etudiants',
        description: 'Acceder plus facilement a du materiel utile pour etudier, travailler et suivre les cours dans de bonnes conditions.',
    },
    {
        icon: Building2,
        title: "Pour l'universite",
        description: 'Valoriser le parc existant, mieux organiser les affectations et eviter des achats inutiles.',
    },
    {
        icon: Sprout,
        title: "Pour l'environnement",
        description: "Reduire le gaspillage, prolonger la duree de vie des equipements et diminuer l'empreinte carbone du campus.",
    },
];

const journeySteps = [
    {
        step: '01',
        title: 'Le materiel disponible est identifie',
        description: "L'universite repere les equipements mobilisables et les integre dans un suivi clair.",
    },
    {
        step: '02',
        title: 'Les besoins etudiants sont pris en charge',
        description: 'Le materiel est mis a disposition dans une logique de reemploi plutot que de remplacement systematique.',
    },
    {
        step: '03',
        title: 'Les retours alimentent un nouveau cycle',
        description: 'Chaque retour permet une nouvelle attribution et renforce une gestion durable du parc informatique.',
    },
];

export default function Home() {
    return (
        <div id="top" className="min-h-screen bg-[#e6f5ef] text-[#0f3d2e]">
            <PublicNavbar />

            <main>
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
                                Reemploi du materiel universitaire
                            </div>
                            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                                L&apos;universite met du materiel a disposition des etudiants dans une logique de reemploi.
                            </h1>
                            <p className="mt-6 max-w-xl text-lg leading-8 text-[#1b5e4b]">
                                PeriGreen aide les universites a distribuer, suivre et reaffecter leur materiel pour eviter le
                                gaspillage, favoriser le reemploi et diminuer l&apos;empreinte carbone du campus.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link to="/dashboard">
                                    <Button size="lg" className="w-full rounded-full bg-[#0f3d2e] px-7 text-white hover:bg-[#1b5e4b] sm:w-auto">
                                        Acceder au dashboard
                                    </Button>
                                </Link>
                                <a href="#features" className="sm:w-auto">
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="w-full rounded-full border-[#2f8f6b]/30 bg-white/80 px-7 text-[#0f3d2e] hover:bg-white"
                                    >
                                        Decouvrir la plateforme
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
                                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#78c6a3]">Apercu</p>
                                    <h2 className="mt-4 text-2xl font-bold">Une plateforme pour connecter universite, admin et etudiants.</h2>
                                    <p className="mt-4 text-sm leading-7 text-[#d7eee4]">
                                        L&apos;universite peut remettre du materiel en circulation, l&apos;administration suit les affectations
                                        et les etudiants accedent plus facilement aux equipements disponibles.
                                    </p>
                                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-white/10 p-4">
                                            <div className="text-2xl font-black">Etudiants</div>
                                            <div className="mt-1 text-sm text-[#d7eee4]">Acces facilite au materiel utile</div>
                                        </div>
                                        <div className="rounded-2xl bg-white/10 p-4">
                                            <div className="text-2xl font-black">Reemploi</div>
                                            <div className="mt-1 text-sm text-[#d7eee4]">Moins de gaspillage, plus d&apos;impact</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section id="student-space" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid gap-8 rounded-[2rem] border border-[#2f8f6b]/10 bg-white/70 p-8 shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8f6b]">Mission</p>
                            <h2 className="mt-4 text-3xl font-bold tracking-tight">Permettre aux etudiants d&apos;acceder au materiel sans produire plus de dechets.</h2>
                        </div>
                        <div className="space-y-4 text-base leading-7 text-[#1b5e4b]">
                            <p>
                                PeriGreen aide l&apos;universite a mettre a disposition des ordinateurs et autres equipements pour les
                                etudiants, en priorisant le materiel deja existant.
                            </p>
                            <p>
                                La plateforme soutient une gestion plus responsable du parc: moins de gaspillage, plus de reemploi et
                                une baisse mesurable de l&apos;empreinte carbone liee aux achats et remplacements inutiles.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="features" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-8 max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8f6b]">Fonctionnalites</p>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight">Les usages essentiels pour faire circuler le materiel utile.</h2>
                        <p className="mt-4 text-base leading-7 text-[#1b5e4b]">
                            La plateforme structure les usages principaux: reperer le materiel mobilisable, le mettre a disposition
                            des etudiants et suivre son cycle de reemploi.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {featureCards.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.08, duration: 0.45 }}
                            >
                                <Card className="h-full rounded-[1.75rem] border-[#2f8f6b]/10 bg-white/80 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f5ef] text-[#1b5e4b]">
                                            <feature.icon size={22} />
                                        </div>
                                        <h3 className="mt-5 text-xl font-bold text-[#0f3d2e]">{feature.title}</h3>
                                        <p className="mt-3 text-sm leading-7 text-[#1b5e4b]">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section id="admin-space" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-8 max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8f6b]">Benefices</p>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight">Une meme plateforme, trois benefices complementaires.</h2>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {benefitCards.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.12 + index * 0.08, duration: 0.45 }}
                            >
                                <Card className="h-full rounded-[1.75rem] border-[#2f8f6b]/10 bg-[#f7fcf9] shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f3d2e] text-[#e6f5ef]">
                                            <benefit.icon size={22} />
                                        </div>
                                        <h3 className="mt-5 text-xl font-bold text-[#0f3d2e]">{benefit.title}</h3>
                                        <p className="mt-3 text-sm leading-7 text-[#1b5e4b]">{benefit.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] border border-[#2f8f6b]/10 bg-white/75 p-8 shadow-sm lg:p-10">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8f6b]">Parcours utilisateur</p>
                            <h2 className="mt-4 text-3xl font-bold tracking-tight">Comment PeriGreen fonctionne au quotidien.</h2>
                        </div>
                        <div className="mt-8 grid gap-6 lg:grid-cols-3">
                            {journeySteps.map((step, index) => (
                                <motion.div
                                    key={step.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.14 + index * 0.08, duration: 0.45 }}
                                    className="rounded-[1.5rem] border border-[#2f8f6b]/10 bg-[#f9fdfb] p-6"
                                >
                                    <div className="text-sm font-bold tracking-[0.22em] text-[#2f8f6b]">{step.step}</div>
                                    <h3 className="mt-4 text-xl font-bold text-[#0f3d2e]">{step.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-[#1b5e4b]">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="signup" className="mx-auto max-w-7xl px-4 py-10 pb-16 sm:px-6 lg:px-8">
                    <div className="rounded-[2rem] bg-[#0f3d2e] px-8 py-10 text-[#e6f5ef] shadow-[0_24px_80px_rgba(15,61,46,0.18)] lg:px-12">
                        <div className="max-w-3xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#78c6a3]">Decouvrir PeriGreen</p>
                            <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                                Une plateforme pour mieux equiper les etudiants tout en reduisant le gaspillage.
                            </h2>
                            <p className="mt-4 text-base leading-7 text-[#d7eee4]">
                                Explorez l&apos;espace PeriGreen et decouvrez comment l&apos;universite peut organiser le reemploi du
                                materiel au service des etudiants et d&apos;une gestion plus durable.
                            </p>
                        </div>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link to="/dashboard">
                                <Button size="lg" className="w-full rounded-full bg-white px-7 text-[#0f3d2e] hover:bg-[#e6f5ef] sm:w-auto">
                                    Ouvrir la plateforme
                                </Button>
                            </Link>
                            <a
                                href="#features"
                                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                            >
                                Revoir les fonctionnalites
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
