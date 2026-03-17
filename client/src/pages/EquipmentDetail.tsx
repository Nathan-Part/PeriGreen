import { useParams, useNavigate } from 'react-router-dom';
import { useEquipment } from '../hooks/useEquipment';
import { useUsers } from '../hooks/useUsers';
import { useCreateReservation } from '../hooks/useLoans';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, ClipboardList, User as UserIcon, FileText, CheckCircle2, AlertCircle, Laptop, Hash, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Schéma pour créer une réservation admin (au nom d'un utilisateur)
const reservationFormSchema = z.object({
    requesterId: z.coerce.number().min(1, "L'utilisateur est requis"),
    quantity: z.coerce.number().min(1, "La quantité doit être au moins 1"),
    status: z.string().optional(),
});

type ReservationFormData = z.infer<typeof reservationFormSchema>;

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
    const createReservation = useCreateReservation();
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ReservationFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(reservationFormSchema) as any,
        defaultValues: {
            quantity: 1,
            status: 'EN_ATTENTE',
        }
    });

    const onSubmit = (data: ReservationFormData) => {
        setErrorMsg(null);
        const apiData = {
            equipmentId: Number(id),
            requesterId: data.requesterId,
            quantity: data.quantity,
            status: data.status || 'EN_ATTENTE',
        };

        createReservation.mutate(apiData, {
            onSuccess: () => {
                setIsSuccess(true);
                reset();
                setTimeout(() => setIsSuccess(false), 5000);
            },
            onError: (err: Error) => {
                setErrorMsg(err.message || 'Une erreur est survenue');
            }
        });
    };

    if (isEquipLoading) return <div className="p-12 text-center text-gray-500 animate-pulse font-medium">Chargement du matériel...</div>;
    if (!equipment) return <div className="p-12 text-center text-red-500 font-bold">Matériel introuvable</div>;

    const categoryName = typeof equipment.category === 'object' ? equipment.category.name : equipment.category;


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
                        <Card className="border-primary-100 shadow-xl ring-1 ring-primary-500/5 bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList size={20} className="text-primary-600" />
                                    Nouvelle Réservation
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
                                            <h4 className="font-bold">Réservation créée</h4>
                                            <p className="text-sm">La réservation a été enregistrée avec succès.</p>
                                            <Button variant="ghost" className="text-green-700" onClick={() => setIsSuccess(false)}>Nouvelle réservation</Button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                            {errorMsg && (
                                                <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 flex items-center gap-2">
                                                    <AlertCircle size={14} /> {errorMsg}
                                                </div>
                                            )}

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <UserIcon size={12} /> Utilisateur
                                                </label>
                                                <select
                                                    {...register('requesterId')}
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                                    disabled={createReservation.isPending}
                                                >
                                                    <option value="">Sélectionner un utilisateur...</option>
                                                    {users?.map(u => (
                                                        <option key={u.id} value={u.id}>{u.fullName || u.email}</option>
                                                    ))}
                                                </select>
                                                {errors.requesterId && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.requesterId.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <FileText size={12} /> Quantité
                                                </label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    {...register('quantity')}
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                                    disabled={createReservation.isPending}
                                                />
                                                {errors.quantity && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.quantity.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <ClipboardList size={12} /> Statut initial
                                                </label>
                                                <select
                                                    {...register('status')}
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                                    disabled={createReservation.isPending}
                                                >
                                                    <option value="EN_ATTENTE">En attente</option>
                                                    <option value="VALIDEE">Validée directement</option>
                                                </select>
                                            </div>

                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="w-full py-6 text-lg shadow-lg shadow-primary-500/20 mt-4 bg-primary-600 text-white hover:bg-primary-700"
                                                disabled={createReservation.isPending}
                                                isLoading={createReservation.isPending}
                                            >
                                                Créer la réservation
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
