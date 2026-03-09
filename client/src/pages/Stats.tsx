import { useEquipments } from '../hooks/useEquipment';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart3, PieChart, TrendingUp, Leaf, Package, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Stats() {
    const { data: equipments } = useEquipments();

    const total = equipments?.length || 0;
    const inUse = equipments?.filter(e => e.status === 'IN_USE').length || 0;
    const maintenance = equipments?.filter(e => e.status === 'MAINTENANCE').length || 0;
    const available = total - inUse - maintenance;

    const usageRate = total > 0 ? Math.round((inUse / total) * 100) : 0;

    const stats = [
        { label: 'Matériel Total', value: total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Taux d\'usage', value: `${usageRate}%`, icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'En Maintenance', value: maintenance, icon: RefreshCcw, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Impact CO2', value: `${total * 15}kg`, icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analyses & Statistiques</h1>
                <p className="text-gray-500 mt-2">Vue d'ensemble de la performance du parc PeriGreen.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className={`p-3 rounded-xl w-fit mb-4 ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-tighter">{stat.label}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 rounded-lg"><PieChart size={18} /></div>
                            Répartition par Statut
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            <StatusRow label="Disponible" count={available} total={total} color="bg-primary-500" />
                            <StatusRow label="En cours d'emprunt" count={inUse} total={total} color="bg-blue-500" />
                            <StatusRow label="En maintenance" count={maintenance} total={total} color="bg-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-100 rounded-lg"><BarChart3 size={18} /></div>
                            Impact Environnemental
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl text-white">
                            <h4 className="text-primary-100 font-bold uppercase tracking-widest text-xs mb-1">Estimation Éco-responsable</h4>
                            <div className="text-4xl font-black mb-4">{(total * 15.4).toFixed(1)} <span className="text-xl font-normal opacity-80">tonnes CO2</span></div>
                            <p className="text-sm opacity-90 leading-relaxed font-medium">
                                Grâce au programme PeriGreen, l'université a évité l'émission de CO2 équivalente à 42 vols Paris-New York en favorisant le réemploi.
                            </p>
                            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                                <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center">
                                    <Leaf size={20} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase">Objectif 2026</div>
                                    <div className="text-lg font-bold">Zéro déchet électronique</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatusRow({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-600">{label}</span>
                <span className="text-gray-900">{count} ({percent}%)</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className={`h-full ${color}`}
                />
            </div>
        </div>
    );
}
