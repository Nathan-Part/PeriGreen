import { ArrowRightLeft, ClipboardList, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/Card';

const featureCards = [
    {
        icon: ClipboardList,
        title: 'Inventaire centralisé',
        description: "L'université garde une vision claire du matériel disponible, attribué ou en attente de réaffectation.",
    },
    {
        icon: ArrowRightLeft,
        title: 'Mise à disposition simple',
        description: 'Les équipements utiles peuvent être remis rapidement en circulation pour les étudiants qui en ont besoin.',
    },
    {
        icon: ShieldCheck,
        title: 'Suivi administratif',
        description: "Les équipes suivent les mouvements, les retours et les attributions sans alourdir l'organisation.",
    },
];

export function Features() {
    return (
        <section id="features" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8f6b]">Fonctionnalités</p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight">Les usages essentiels pour faire circuler le matériel utile.</h2>
                <p className="mt-4 text-base leading-7 text-[#1b5e4b]">
                    La plateforme structure les usages principaux : repérer le matériel mobilisable, le mettre à disposition
                    des étudiants et suivre son cycle de réemploi.
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
    );
}
