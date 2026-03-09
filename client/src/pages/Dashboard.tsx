import { motion } from 'framer-motion';
import { useLoans } from '../hooks/useLoans';
import { useEquipments } from '../hooks/useEquipment';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Leaf, Zap, Clock, ArrowRight, Laptop, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Dashboard() {
    const { data: loans, isLoading: loansLoading } = useLoans();
    const { data: equipments } = useEquipments();

    const totalEquipments = equipments?.length ?? 0;
    const reusedMaterials = Math.floor(totalEquipments * 0.85);
    const co2Saved = reusedMaterials * 15;
    const urgentLoans = loans?.filter(l => l.status === 'OVERDUE' || l.status === 'ACTIVE').slice(0, 3) ?? [];

    return (
        <motion.div
            className="relative -m-6 min-h-[calc(100vh-64px)] overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Background Video Hero */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback: hide video on error, show gradient background
                        (e.currentTarget as HTMLVideoElement).style.display = 'none';
                    }}
                >
                    <source
                        src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4"
                        type="video/mp4"
                    />
                </video>
                {/* Fallback gradient if video fails */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b5e20] via-[#2e7d32] to-[#388e3c] -z-10" />
            </div>

            {/* Hero Content */}
            <div className="relative z-20 px-6 py-16 md:py-24 flex flex-col items-center justify-center text-center text-white min-h-[55vh]">
                <motion.div
                    variants={itemVariants}
                    className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium"
                >
                    <Leaf size={16} className="text-green-300" />
                    <span>PeriGreen · Technologie Durable</span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg"
                >
                    Gérez votre parc,<br />
                    <span className="text-green-300">préservez l'avenir.</span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="max-w-2xl text-lg text-white/80 mb-10 leading-relaxed"
                >
                    Optimisez le cycle de vie de vos équipements informatiques universitaires.
                    Réduisez votre empreinte carbone grâce à un réemploi intelligent.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
                    <Link to="/inventory">
                        <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 border-none font-bold px-8 shadow-xl">
                            Explorer l'inventaire
                        </Button>
                    </Link>
                    <Link to="/loans">
                        <Button
                            size="lg"
                            variant="ghost"
                            className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white"
                        >
                            Gérer les emprunts
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* KPI Cards — Glassmorphism */}
            <div className="relative z-20 px-6 -mt-8 pb-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: Leaf,
                            value: `${reusedMaterials}`,
                            label: 'Matériel réemployé',
                            unit: 'unités',
                            badge: 'Impact +',
                            badgeVariant: 'success' as const,
                            iconBg: 'bg-green-100',
                            iconColor: 'text-green-700',
                        },
                        {
                            icon: Zap,
                            value: `${co2Saved}`,
                            label: 'CO₂ Économisé',
                            unit: 'kg',
                            badge: null,
                            iconBg: 'bg-blue-100',
                            iconColor: 'text-blue-700',
                        },
                        {
                            icon: Clock,
                            value: '92%',
                            label: 'Disponibilité du parc',
                            unit: '',
                            badge: null,
                            iconBg: 'bg-orange-100',
                            iconColor: 'text-orange-700',
                        },
                    ].map((kpi, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="bg-white/85 backdrop-blur-xl border-white/30 shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 ${kpi.iconBg} ${kpi.iconColor} rounded-2xl`}>
                                            <kpi.icon size={24} />
                                        </div>
                                        {kpi.badge && <Badge variant={kpi.badgeVariant ?? 'success'}>{kpi.badge}</Badge>}
                                    </div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
                                    <div className="text-3xl font-black text-gray-900">
                                        {kpi.value} <span className="text-base font-normal text-gray-500">{kpi.unit}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Urgent Loans */}
                <div className="max-w-6xl mx-auto mt-12">
                    <motion.div variants={itemVariants}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2 drop-shadow">
                                <AlertCircle size={22} className="text-red-400" />
                                Emprunts urgents
                            </h2>
                            <Link
                                to="/loans"
                                className="text-green-200 hover:text-white font-medium flex items-center gap-1 group transition-colors"
                            >
                                Voir tout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {loansLoading ? (
                                <div className="text-center text-white/60 py-10 italic">Chargement…</div>
                            ) : urgentLoans.length > 0 ? (
                                urgentLoans.map((loan) => (
                                    <Card key={loan.id} className="bg-white/85 backdrop-blur-xl border-white/20 shadow-lg">
                                        <CardContent className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                                                    <Laptop size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{loan.equipment?.name ?? 'Matériel inconnu'}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Emprunté par : {loan.user?.firstName} {loan.user?.lastName}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-400">Échéance</p>
                                                    <p className={loan.status === 'OVERDUE' ? 'text-red-600 font-bold' : 'text-gray-800'}>
                                                        {loan.expectedEndDate}
                                                    </p>
                                                </div>
                                                <Badge variant={loan.status === 'OVERDUE' ? 'danger' : 'info'}>
                                                    {loan.status === 'OVERDUE' ? 'EN RETARD' : 'EN COURS'}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="bg-white/20 border border-dashed border-white/30 rounded-2xl p-12 text-center">
                                    <p className="text-white/70 italic">Aucun emprunt urgent à signaler. Bravo !</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
