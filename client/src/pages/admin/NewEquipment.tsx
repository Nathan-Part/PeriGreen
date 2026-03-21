import { useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Boxes, ImagePlus, PackagePlus } from 'lucide-react';
import { useCategories, useCreateEquipment } from '../../hooks/useEquipment';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const equipmentSchema = z.object({
    name: z.string().min(2, 'Le nom est requis'),
    description: z.string().min(10, 'La description doit contenir au moins 10 caracteres'),
    brand: z.string().min(2, 'La marque est requise'),
    model: z.string().min(1, 'Le modele est requis'),
    serialNumber: z.string().min(3, 'Le numero de serie est requis'),
    etat: z.string().min(1, "L'etat est requis"),
    totalQuantity: z.coerce.number().int().min(1, 'La quantite doit etre au moins 1'),
    imageUrl: z.string().url("L'URL de l'image est invalide"),
    categoryId: z.coerce.number().int().min(1, 'La categorie est requise'),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

const etatOptions = ['Neuf', 'Bon etat', 'Moyen', 'Mauvais', 'Maintenance'];

export default function NewEquipment() {
    const navigate = useNavigate();
    const { data: categories, isLoading: isCategoriesLoading } = useCategories();
    const createEquipment = useCreateEquipment();

    const defaultImageUrl = useMemo(
        () => 'https://placehold.co/600x400?text=Nouvel+article',
        []
    );

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<EquipmentFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(equipmentSchema) as any,
        defaultValues: {
            etat: 'Neuf',
            totalQuantity: 1,
            imageUrl: defaultImageUrl,
        },
    });

    const imagePreview = watch('imageUrl') || defaultImageUrl;

    const onSubmit = (data: EquipmentFormData) => {
        createEquipment.mutate(data, {
            onSuccess: (createdEquipment) => {
                navigate(`/dashboard/inventory/${createdEquipment.id}`);
            },
        });
    };

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <button
                type="button"
                onClick={() => navigate('/dashboard/inventory')}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary-600"
            >
                <ArrowLeft size={18} />
                Retour a l'inventaire
            </button>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Ajouter un article</h1>
                    <p className="mt-2 max-w-2xl text-gray-500">
                        Cree une nouvelle fiche materiel visible dans l'inventaire admin et dans l'espace
                        utilisateur.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
                <Card className="border-none bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <PackagePlus size={20} className="text-primary-600" />
                            Informations du materiel
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5 md:grid-cols-2">
                        <FormField
                            label="Nom"
                            error={errors.name?.message}
                            className="md:col-span-2"
                            input={
                                <input
                                    {...register('name')}
                                    className={inputClassName}
                                    placeholder="Exemple : Taille-haie electrique"
                                />
                            }
                        />

                        <FormField
                            label="Marque"
                            error={errors.brand?.message}
                            input={<input {...register('brand')} className={inputClassName} placeholder="Bosch" />}
                        />

                        <FormField
                            label="Modele"
                            error={errors.model?.message}
                            input={
                                <input {...register('model')} className={inputClassName} placeholder="AdvancedHedgeCut" />
                            }
                        />

                        <FormField
                            label="Numero de serie"
                            error={errors.serialNumber?.message}
                            input={
                                <input
                                    {...register('serialNumber')}
                                    className={inputClassName}
                                    placeholder="PG-TAH-2026-001"
                                />
                            }
                        />

                        <FormField
                            label="Quantite totale"
                            error={errors.totalQuantity?.message}
                            input={<input type="number" min={1} {...register('totalQuantity')} className={inputClassName} />}
                        />

                        <FormField
                            label="Etat"
                            error={errors.etat?.message}
                            input={
                                <select {...register('etat')} className={inputClassName}>
                                    {etatOptions.map((etat) => (
                                        <option key={etat} value={etat}>
                                            {etat}
                                        </option>
                                    ))}
                                </select>
                            }
                        />

                        <FormField
                            label="Categorie"
                            error={errors.categoryId?.message}
                            input={
                                <select
                                    {...register('categoryId')}
                                    className={inputClassName}
                                    disabled={isCategoriesLoading}
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        {isCategoriesLoading ? 'Chargement des categories...' : 'Choisir une categorie'}
                                    </option>
                                    {(categories ?? []).map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            }
                        />

                        <FormField
                            label="URL de l'image"
                            error={errors.imageUrl?.message}
                            className="md:col-span-2"
                            input={
                                <input
                                    {...register('imageUrl')}
                                    className={inputClassName}
                                    placeholder="https://..."
                                />
                            }
                        />

                        <FormField
                            label="Description"
                            error={errors.description?.message}
                            className="md:col-span-2"
                            input={
                                <textarea
                                    {...register('description')}
                                    rows={5}
                                    className={`${inputClassName} resize-none`}
                                    placeholder="Decris l'usage, les accessoires ou les conditions d'emprunt."
                                />
                            }
                        />
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-none bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <ImagePlus size={20} className="text-primary-600" />
                                Apercu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                                <img
                                    src={imagePreview}
                                    alt="Apercu du materiel"
                                    className="h-56 w-full object-cover"
                                    onError={(event) => {
                                        event.currentTarget.src = defaultImageUrl;
                                    }}
                                />
                            </div>
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                                L'image est affichee dans l'inventaire et dans la fiche detail.
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Boxes size={20} className="text-primary-600" />
                                Publication
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {createEquipment.isError && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {(createEquipment.error as Error).message}
                                </div>
                            )}

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                                Une fois cree, l'article apparaitra immediatement dans l'inventaire admin.
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" isLoading={createEquipment.isPending}>
                                    Enregistrer l'article
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => navigate('/dashboard/inventory')}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}

const inputClassName =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';

function FormField({
    label,
    input,
    error,
    className = '',
}: {
    label: string;
    input: ReactNode;
    error?: string;
    className?: string;
}) {
    return (
        <div className={className}>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
                {label}
            </label>
            {input}
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
    );
}
