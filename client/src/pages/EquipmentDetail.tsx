import { useParams, useNavigate } from 'react-router-dom';
import { useEquipment } from '../hooks/useEquipment';
import { useUsers } from '../hooks/useUsers';
import { useCreateLoan } from '../hooks/useLoans';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanSchema, type LoanFormData } from '../types/schemas';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, Calendar, User as UserIcon, FileText, CheckCircle2, AlertCircle, Laptop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function EquipmentDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: equipment, isLoading: isEquipLoading } = useEquipment(id!);
    const { data: users } = useUsers();
    const createLoan = useCreateLoan();
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<LoanFormData>({
        resolver: zodResolver(loanSchema),
        defaultValues: {
            equipmentId: id,
            startDate: new Date().toISOString().split('T')[0],
        }
    });

    const onSubmit = (data: LoanFormData) => {
        createLoan.mutate(data, {
            onSuccess: () => {
                setIsSuccess(true);
                reset();
                setTimeout(() => setIsSuccess(false), 5000);
            }
        });
    };

    if (isEquipLoading) return <div className="p-12 text-center">Chargement...</div>;
    if (!equipment) return <div className="p-12 text-center text-danger-500 font-bold">Matériel introuvable</div>;

    const isAvailable = equipment.status === 'AVAILABLE';

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
                        <Card className="border-none shadow-sm overflow-hidden">
                            <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                                <Laptop size={80} className="text-gray-300" />
                                <div className="absolute top-4 right-4">
                                    <Badge variant={isAvailable ? 'success' : 'warning'} className="text-lg py-1 px-4">
                                        {equipment.status === 'AVAILABLE' ? 'Disponible' : 'Indisponible'}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="pt-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{equipment.name}</h1>
                                <p className="text-gray-400 font-mono text-sm mb-6">{equipment.reference}</p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-gray-100">
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Catégorie</span>
                                        <span className="font-medium text-gray-900">{equipment.category}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">État</span>
                                        <span className="font-medium text-gray-900">{equipment.condition}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Date d'achat</span>
                                        <span className="font-medium text-gray-900">{equipment.purchaseDate}</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="font-bold text-gray-900 mb-3">Notes & Observations</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {equipment.notes || "Aucune note spécifique pour ce matériel. Équipement standard du parc informatique."}
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
                        <Card className={isAvailable ? 'border-primary-100 shadow-xl ring-1 ring-primary-500/5' : 'bg-gray-50 opacity-80'}>
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
                                            className="bg-primary-50 text-primary-700 p-6 rounded-2xl text-center space-y-3"
                                        >
                                            <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <h4 className="font-bold">Demande acceptée !</h4>
                                            <p className="text-sm">L'emprunt a été enregistré avec succès.</p>
                                            <Button variant="ghost" className="text-primary-700" onClick={() => setIsSuccess(false)}>Nouveau prêt</Button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <UserIcon size={12} /> Emprunteur
                                                </label>
                                                <select
                                                    {...register('userId')}
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                                    disabled={!isAvailable || createLoan.isPending}
                                                >
                                                    <option value="">Sélectionner...</option>
                                                    {users?.map(u => (
                                                        <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                                                    ))}
                                                </select>
                                                {errors.userId && <p className="text-xs text-danger-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.userId.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <Calendar size={12} /> Date de début
                                                </label>
                                                <input
                                                    type="date"
                                                    {...register('startDate')}
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                                    disabled={!isAvailable || createLoan.isPending}
                                                />
                                                {errors.startDate && <p className="text-xs text-danger-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.startDate.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <Calendar size={12} /> Fin prévue
                                                </label>
                                                <input
                                                    type="date"
                                                    {...register('expectedEndDate')}
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                                    disabled={!isAvailable || createLoan.isPending}
                                                />
                                                {errors.expectedEndDate && <p className="text-xs text-danger-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.expectedEndDate.message}</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <FileText size={12} /> Notes (Optionnel)
                                                </label>
                                                <textarea
                                                    {...register('notes')}
                                                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all min-h-[80px]"
                                                    placeholder="Motif de l'emprunt..."
                                                    disabled={!isAvailable || createLoan.isPending}
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="w-full py-6 text-lg shadow-lg shadow-primary-500/20 mt-4"
                                                disabled={!isAvailable || createLoan.isPending}
                                                isLoading={createLoan.isPending}
                                            >
                                                {isAvailable ? 'Confirmer l\'emprunt' : 'Indisponible'}
                                            </Button>
                                            {!isAvailable && (
                                                <p className="text-center text-xs text-gray-400 font-medium">
                                                    Ce matériel ne peut être emprunté pour le moment.
                                                </p>
                                            )}
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
