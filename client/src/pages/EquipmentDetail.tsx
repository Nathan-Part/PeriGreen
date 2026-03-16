import { useParams, useNavigate } from 'react-router-dom';
import { useEquipment } from '../hooks/useEquipment';
import { useUsers } from '../hooks/useUsers';
import { useCreateLoan } from '../hooks/useLoans';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, Calendar, User as UserIcon, FileText, CheckCircle2, AlertCircle, Laptop, Hash, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Adjusted schema to match real API fields
const loanFormSchema = z.object({
    borrowerId: z.coerce.number().min(1, "L'emprunteur est requis"),
    pickupDate: z.string().min(1, "La date de début est requise"),
    dueDate: z.string().min(1, "La date de fin est requise"),
    quantity: z.coerce.number().min(1, "La quantité doit être au moins 1"),
    notes: z.string().optional(),
});

type LoanFormData = z.infer<typeof loanFormSchema>;

const ETAT_BADGE: Record<string, React.ReactNode> = {
    'bon': <Badge variant="success">Bon état</Badge>,
    'bon état': <Badge variant="success">Bon état</Badge>,
    'moyen': <Badge variant="warning">État moyen</Badge>,
    'mauvais': <Badge variant="danger">Mauvais état</Badge>,
    'neuf': <Badge variant="info">Neuf</Badge>,
};

export default function EquipmentDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: equipment, isLoading: isEquipLoading } = useEquipment(id!);
    const { data: users } = useUsers();
    const createLoan = useCreateLoan();
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<LoanFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(loanFormSchema) as any,
        defaultValues: {
            pickupDate: new Date().toISOString().split('T')[0],
            quantity: 1
        }
    });

    const onSubmit = (data: LoanFormData) => {
        // Adapt data to match CreateLoan API signature
        const apiData = {
            ...data,
            equipmentId: Number(id),
            status: 'ACTIVE',
            reservationId: 0, // Placeholder if no reservation exists
            notes: data.notes || ''
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createLoan.mutate(apiData as any, {
            onSuccess: () => {
                setIsSuccess(true);
                reset();
                setTimeout(() => setIsSuccess(false), 5000);
            }
        });
    };

    if (isEquipLoading) return <div className="p-12 text-center text-gray-500 animate-pulse font-medium">Chargement du matériel...</div>;
    if (!equipment) return <div className="p-12 text-center text-red-500 font-bold">Matériel introuvable</div>;

    const categoryName = typeof equipment.category === 'object' ? equipment.category.name : equipment.category;

    // In this version, we assume it's available if totalQuantity > 0 or if we don't have a specific status
    const isAvailable = true;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors font-medium"
            >
                <ArrowLeft size={20} /> Retour à l'inventaire
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card className="border-none shadow-sm overflow-hidden bg-white">
                            <div className="h-48 bg-gray-50 flex items-center justify-center relative border-b border-gray-100">
                                {equipment.imageUrl ? (
                                    <img src={equipment.imageUrl} alt={equipment.name} className="h-full w-full object-contain p-4" />
                                ) : (
                                    <Laptop size={80} className="text-gray-200" />
                                )}
                                <div className="absolute top-4 right-4">
                                    {equipment.etat ? (
                                        ETAT_BADGE[equipment.etat.toLowerCase()] ?? <Badge variant="default">{equipment.etat}</Badge>
                                    ) : (
                                        <Badge variant="success" className="text-lg py-1 px-4">Disponible</Badge>
                                    )}
                                </div>
                            </div>
                            <CardContent className="pt-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{equipment.name}</h1>
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                                                <Tag size={14} /> {equipment.brand} {equipment.model}
                                            </span>
                                            {equipment.serialNumber && (
                                                <span className="flex items-center gap-1.5 text-gray-400 text-sm font-mono">
                                                    <Hash size={14} /> {equipment.serialNumber}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-gray-100">
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Catégorie</span>
                                        <span className="font-medium text-gray-900">{categoryName}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Quantité Totale</span>
                                        <span className="font-medium text-gray-900">{equipment.totalQuantity} unités</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">ID Matériel</span>
                                        <span className="font-medium text-gray-900 font-mono text-sm">#{equipment.id}</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="font-bold text-gray-900 mb-3">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {equipment.description || "Aucune description détaillée disponible pour ce matériel."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Action Sidebar / Form */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className={isAvailable ? 'border-primary-100 shadow-xl ring-1 ring-primary-500/5 bg-white' : 'bg-gray-50 opacity-80'}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar size={20} className="text-primary-600" />
                                    Nouveau Prêt
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AnimatePresence mode="wait">
                                    {isSuccess ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-green-50 text-green-700 p-6 rounded-2xl text-center space-y-3"
                                        >
                                            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <h4 className="font-bold">Emprunt enregistré</h4>
                                            <p className="text-sm">La demande a été traitée avec succès.</p>
                                            <Button variant="ghost" className="text-green-700" onClick={() => setIsSuccess(false)}>Nouveau prêt</Button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <UserIcon size={12} /> Emprunteur
                                                </label>
                                                <select
                                                    {...register('borrowerId')}
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                                    disabled={!isAvailable || createLoan.isPending}
                                                >
                                                    <option value="">Sélectionner...</option>
                                                    {users?.map(u => (
                                                        <option key={u.id} value={u.id}>{u.fullName || u.email}</option>
                                                    ))}
                                                </select>
                                                {errors.borrowerId && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.borrowerId.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <Calendar size={12} /> Date de début
                                                </label>
                                                <input
                                                    type="date"
                                                    {...register('pickupDate')}
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                                    disabled={!isAvailable || createLoan.isPending}
                                                />
                                                {errors.pickupDate && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.pickupDate.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <Calendar size={12} /> Fin prévue
                                                </label>
                                                <input
                                                    type="date"
                                                    {...register('dueDate')}
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                                    disabled={!isAvailable || createLoan.isPending}
                                                />
                                                {errors.dueDate && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.dueDate.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <FileText size={12} /> Quantité
                                                </label>
                                                <input
                                                    type="number"
                                                    {...register('quantity')}
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                                    disabled={!isAvailable || createLoan.isPending}
                                                />
                                                {errors.quantity && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.quantity.message}</p>}
                                            </div>

                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="w-full py-6 text-lg shadow-lg shadow-primary-500/20 mt-4 bg-primary-600 text-white hover:bg-primary-700"
                                                disabled={!isAvailable || createLoan.isPending}
                                                isLoading={createLoan.isPending}
                                            >
                                                {isAvailable ? 'Confirmer l\'emprunt' : 'Indisponible'}
                                            </Button>
                                        </form>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
