import { Building2, GraduationCap, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/Card';

const benefitCards = [
    {
        icon: GraduationCap,
        title: 'Pour les étudiants',
        description: 'Accéder plus facilement à du matériel utile pour étudier, travailler et suivre les cours dans de bonnes conditions.',
    },
    {
        icon: Building2,
        title: "Pour l'université",
        description: 'Valoriser le parc existant, mieux organiser les affectations et éviter des achats inutiles.',
    },
    {
        icon: Sprout,
        title: "Pour l'environnement",
        description: "Réduire le gaspillage, prolonger la durée de vie des équipements et diminuer l'empreinte carbone du campus.",
    },
];

export function Benefits() {
    return (
        <section id="admin-space" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8f6b]">Bénéfices</p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight">Une même plateforme, trois bénéfices complémentaires.</h2>
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
    );
}
