import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEquipments } from '../hooks/useEquipment';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Filter, Laptop, Smartphone, Monitor, HardDrive, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { EquipmentStatus } from '../types';

const CATEGORY_ICONS: Record<string, any> = {
    'Portable': Laptop,
    'Mobile': Smartphone,
    'Ecran': Monitor,
    'Stockage': HardDrive,
    'Périphérique': Package,
};

export default function Inventory() {
    const { data: equipments, isLoading } = useEquipments();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    const filteredEquipments = equipments?.filter(eq => {
        const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase()) ||
            eq.reference.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || eq.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: EquipmentStatus) => {
        switch (status) {
            case 'AVAILABLE': return <Badge variant="success">Disponible</Badge>;
            case 'IN_USE': return <Badge variant="info">En cours d'emprunt</Badge>;
            case 'MAINTENANCE': return <Badge variant="warning">En maintenance</Badge>;
            case 'RETIRED': return <Badge variant="default">Ancien</Badge>;
            case 'LOST': return <Badge variant="danger">Perdu</Badge>;
            default: return <Badge variant="default">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inventaire du matériel</h1>
                    <p className="text-gray-500 mt-2">Consultez et gérez l'ensemble du parc informatique de l'établissement.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, référence..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium placeholder:text-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
                    >
                        <option value="ALL">Tous les statuts</option>
                        <option value="AVAILABLE">Disponible</option>
                        <option value="IN_USE">En cours d'emprunt</option>
                        <option value="MAINTENANCE">En maintenance</option>
                    </select>
                </div>
            </div>

            <AnimatePresence mode="popLayout">
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-[280px] bg-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </motion.div>
                ) : filteredEquipments && filteredEquipments.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredEquipments.map((equipment) => {
                            const Icon = CATEGORY_ICONS[equipment.category] || Package;
                            return (
                                <motion.div
                                    key={equipment.id}
                                    layout
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card className="h-full flex flex-col hover:shadow-lg transition-all border-none shadow-sm bg-white overflow-hidden group">
                                        <CardHeader className="bg-gray-50/50 pb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="p-2.5 bg-white border border-gray-100 rounded-xl text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                                    <Icon size={20} />
                                                </div>
                                                {getStatusBadge(equipment.status)}
                                            </div>
                                            <div className="mt-4">
                                                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{equipment.name}</CardTitle>
                                                <p className="text-xs font-mono text-gray-400 mt-1">{equipment.reference}</p>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 py-4">
                                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                                                <div>
                                                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-widest">Catégorie</span>
                                                    <span className="text-gray-700 font-medium">{equipment.category}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-widest">État</span>
                                                    <span className="text-gray-700 font-medium">{equipment.condition}</span>
                                                </div>
                                                {equipment.location && (
                                                    <div className="col-span-2">
                                                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-widest">Localisation</span>
                                                        <span className="text-gray-700 font-medium">{equipment.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-0 border-none">
                                            <Link to={`/inventory/${equipment.id}`} className="w-full">
                                                <Button variant="secondary" className="w-full font-bold group-hover:bg-primary-50 group-hover:text-primary-600 border-none">
                                                    Détails & Emprunter
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center"
                    >
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Filter className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun matériel trouvé</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">Essayez de modifier vos filtres ou de réinitialiser votre recherche.</p>
                        <Button variant="ghost" className="mt-6 text-primary-600" onClick={() => { setSearch(''); setStatusFilter('ALL'); }}>
                            Réinitialiser les filtres
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
