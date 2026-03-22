import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEquipments, useCategories } from '../hooks/useEquipment';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Filter, Laptop, Smartphone, Monitor, Package, PlusCircle, type LucideIcon, MousePointer2 as Mouse, Keyboard, Cable, Cpu, Headphones, Webcam, Usb, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    'Souris': Mouse,
    'Clavier': Keyboard,
    'Câble HDMI': Cable,
    'Câble Ethernet': Cable,
    'Adaptateur USB': Usb,
    'Adaptateur HDMI': Cpu,
    'Hub USB': Cpu,
    'Écran': Monitor,
    'Chargeur PC': Zap,
    'Casque audio': Headphones,
    'Webcam': Webcam,
    'Clé USB': Usb,
    'Multiprise': Zap,
    // Fallbacks
    'Portable': Laptop,
    'Mobile': Smartphone,
    'Ecran': Monitor,
    'Matériel': Package,
};

const ETAT_BADGE: Record<string, React.ReactElement> = {
    'BON':           <Badge variant="success">Bon état</Badge>,
    'USÉ':           <Badge variant="warning">Usé</Badge>,
    'RECONDITIONNÉ': <Badge variant="info">Reconditionné</Badge>,
    // Rétrocompatibilité
    'bon':       <Badge variant="success">Bon état</Badge>,
    'neuf':      <Badge variant="info">Neuf</Badge>,
};

export default function Inventory() {
    const { data: equipments, isLoading: isEquipLoading } = useEquipments();
    const { data: apiCategories, isLoading: isCatsLoading } = useCategories();
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

    const categories = apiCategories ?? [];

    const filteredEquipments = equipments?.filter(eq => {
        const categoryName = typeof eq.category === 'object' ? eq.category.name : eq.category;
        const matchesSearch =
            eq.name.toLowerCase().includes(search.toLowerCase()) ||
            (eq.brand ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (eq.model ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (eq.serialNumber ?? '').toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || categoryName === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const isLoading = isEquipLoading || isCatsLoading;

    const getEtatBadge = (etat: string) => {
        if (!etat) return null;
        const key = etat.toUpperCase();
        return ETAT_BADGE[key] ?? <Badge variant="default">{etat}</Badge>;
    };

    const getStatusBadge = (status?: string) => {
        if (!status) return null;
        const normalized = status.toUpperCase();
        switch (normalized) {
            case 'AVAILABLE':
            case 'DISPONIBLE': return null; // On masque pour ne pas encombrer l'interface si dispo
            case 'EMPRUNTÉ':
            case 'IN_USE':     return <Badge variant="warning" className="bg-orange-100 text-orange-700">Emprunté</Badge>;
            case 'EN RÉPARATION': 
            case 'MAINTENANCE': return <Badge variant="danger">En réparation</Badge>;
            default: return <Badge variant="default">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Inventaire du matériel</h1>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        {isAdmin
                            ? 'Gérez l\'ensemble du parc informatique.'
                            : 'Consultez le matériel disponible et faites vos demandes.'}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    {isAdmin && (
                        <button
                            onClick={() => navigate('/dashboard/inventory/new')}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 w-fit self-end bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                        >
                            <PlusCircle size={16} /> Ajouter matériel
                        </button>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative group flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, marque, modèle..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium placeholder:text-gray-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
                        >
                            <option value="ALL">Toutes les catégories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="popLayout">
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-[240px] sm:h-[280px] bg-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </motion.div>
                ) : filteredEquipments && filteredEquipments.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                    >
                        {filteredEquipments.map((equipment) => {
                            const categoryName = typeof equipment.category === 'object' ? equipment.category.name : equipment.category;
                            const Icon = CATEGORY_ICONS[categoryName] || Package;
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
                                                <div className="flex flex-col gap-2 items-end">
                                                    {equipment.etat ? getEtatBadge(equipment.etat) : null}
                                                    {getStatusBadge(equipment.status)}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{equipment.name}</CardTitle>
                                                <p className="text-xs font-mono text-gray-400 mt-1">{equipment.brand} {equipment.model}</p>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 py-4">
                                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                                                <div>
                                                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-widest">Catégorie</span>
                                                    <span className="text-gray-700 font-medium">{categoryName}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-widest">Quantité</span>
                                                    <span className="text-gray-700 font-medium">{equipment.totalQuantity ?? '—'}</span>
                                                </div>
                                                {equipment.serialNumber && (
                                                    <div className="col-span-2">
                                                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-widest">N° Série</span>
                                                        <span className="text-gray-700 font-medium font-mono text-xs">{equipment.serialNumber}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-0 border-none">
                                            {isAdmin ? (
                                                <div className="flex gap-2 w-full">
                                                    <Link to={`/dashboard/inventory/${equipment.id}/edit`} className="flex-1">
                                                        <Button variant="secondary" className="w-full font-bold text-xs border-none">
                                                            Modifier
                                                        </Button>
                                                    </Link>
                                                </div>
                                             ) : (
                                                 (equipment.totalQuantity ?? 0) === 0 ? (
                                                     <Button 
                                                         variant="danger" 
                                                         disabled 
                                                         className="w-full font-bold cursor-not-allowed opacity-70 pointer-events-auto shadow-none"
                                                     >
                                                         Rupture de stock
                                                     </Button>
                                                 ) : (
                                                     <Link to={`/espace/reservations/nouvelle?equipmentId=${equipment.id}`} className="w-full">
                                                         <Button variant="secondary" className="w-full font-bold group-hover:bg-green-50 group-hover:text-green-700 border-none">
                                                             Réserver
                                                         </Button>
                                                     </Link>
                                                 )
                                             )}
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
                        <Button variant="ghost" className="mt-6 text-primary-600" onClick={() => { setSearch(''); setCategoryFilter('ALL'); }}>
                            Réinitialiser les filtres
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
