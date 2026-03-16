import { Gauge, GraduationCap, Leaf, Recycle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImpactCounter } from '../ui/ImpactCounter';

const impactStats = [
    {
        icon: Recycle,
        value: 120,
        suffix: '',
        label: 'équipements réemployés',
        description: 'Du matériel déjà disponible remis en circulation pour les étudiants.',
    },
    {
        icon: Leaf,
        value: 850,
        suffix: ' kg',
        label: 'de CO₂ évités',
        description: "Une estimation de l'impact carbone évité grâce au réemploi plutôt qu'au remplacement.",
    },
    {
        icon: GraduationCap,
        value: 300,
        suffix: '',
        label: 'étudiants équipés',
        description: 'Des besoins couverts plus vite avec du matériel utile et disponible.',
    },
    {
        icon: Gauge,
        value: 92,
        suffix: ' %',
        label: "de taux d'utilisation",
        description: 'Un parc mieux valorisé, mieux affecté et moins laissé de côté.',
    },
];

export function Impact() {
    return (
        <section id="impact" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-[#7bc9a7]/30 bg-[linear-gradient(135deg,_#f7fcf9_0%,_#edf8f2_42%,_#dff3e8_100%)] px-8 py-10 shadow-[0_28px_90px_rgba(47,143,107,0.12)] lg:px-10">
                <div className="absolute -right-24 top-8 h-56 w-56 rounded-full bg-[#78c6a3]/25 blur-3xl" />
                <div className="absolute left-1/3 top-1/2 h-40 w-40 rounded-full bg-green-300/20 blur-3xl" />

                <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f8f6b]">Impact / chiffres clés</p>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f3d2e] lg:text-4xl">
                            Des preuves visibles que le réemploi peut être
                            <span className="text-green-300"> utile, sobre et mesurable.</span>
                        </h2>
                        <p className="mt-4 text-base leading-7 text-[#1b5e4b]">
                            PeriGreen aide l&apos;université à rendre son impact lisible : plus de matériel remis en circulation,
                            plus d&apos;étudiants équipés et moins d&apos;émissions liées aux remplacements évitables.
                        </p>

                        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#2f8f6b]/10 bg-white/80 px-5 py-3 text-sm text-[#1b5e4b] shadow-sm backdrop-blur-sm">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-300" />
                            Analysons ensemble les chiffres les plus importants.
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ duration: 0.45 }}
                            className="mt-8 max-w-md"
                        >
                            <div className="grid h-full grid-cols-1 gap-6 rounded-[2rem] border border-[#2f8f6b]/10 bg-[#0f3d2e] p-7 text-white shadow-[0_24px_60px_rgba(15,61,46,0.18)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-end">
                                <div className="flex h-full flex-col">
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-green-300">
                                            <Leaf size={22} />
                                        </div>
                                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#d7eee4]">
                                            vision durable
                                        </span>
                                    </div>
                                    <div className="mt-8 text-5xl font-black tracking-tight text-green-300">
                                        <ImpactCounter value={impactStats[1].value} suffix={impactStats[1].suffix} />
                                    </div>
                                </div>
                                <div className="flex h-full flex-col justify-end">
                                    <h3 className="text-xl font-bold">{impactStats[1].label}</h3>
                                    <p className="mt-3 text-sm leading-7 text-[#d7eee4]">{impactStats[1].description}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid auto-rows-fr gap-5 md:grid-cols-2">
                        {impactStats.filter((_, index) => index !== 1).map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.35 }}
                                transition={{ duration: 0.45, delay: index * 0.08 }}
                                className={index === 2 ? 'md:col-span-2' : ''}
                            >
                                <div className="grid h-full auto-rows-min rounded-[2rem] border border-[#2f8f6b]/12 bg-white/78 p-6 shadow-[0_18px_45px_rgba(47,143,107,0.08)] backdrop-blur-sm">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[#e6f5ef] text-[#2f8f6b]">
                                            <stat.icon size={21} />
                                        </div>
                                        <span className="h-px flex-1 bg-gradient-to-r from-[#78c6a3]/0 via-[#78c6a3]/70 to-green-300/80" />
                                    </div>
                                    <div className="mt-6 text-4xl font-black tracking-tight text-[#0f3d2e]">
                                        <ImpactCounter value={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <h3 className="mt-2 text-lg font-bold text-[#0f3d2e]">{stat.label}</h3>
                                    <p className="mt-3 text-sm leading-7 text-[#1b5e4b]">{stat.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
