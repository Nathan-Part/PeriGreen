import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EquipmentForm, type EquipmentFormData } from '../../components/equipment/EquipmentForm';
import { useCategories, useEquipment, useUpdateEquipment } from '../../hooks/useEquipment';

export default function EditEquipment() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: equipment, isLoading: isEquipmentLoading } = useEquipment(id ?? '');
    const { data: categories, isLoading: isCategoriesLoading } = useCategories();
    const updateEquipment = useUpdateEquipment();

    const defaultValues = useMemo<Partial<EquipmentFormData> | undefined>(() => {
        if (!equipment) return undefined;

        return {
            name: equipment.name,
            description: equipment.description,
            brand: equipment.brand,
            model: equipment.model,
            serialNumber: equipment.serialNumber,
            etat: equipment.etat,
            totalQuantity: equipment.totalQuantity,
            imageUrl: equipment.imageUrl,
            categoryId: equipment.category.id,
        };
    }, [equipment]);

    const onSubmit = (data: EquipmentFormData) => {
        if (!id) return;

        updateEquipment.mutate(
            { id: Number(id), data },
            {
                onSuccess: () => {
                    navigate(`/dashboard/inventory/${id}`);
                },
            }
        );
    };

    if (isEquipmentLoading) {
        return <div className="p-12 text-center text-gray-500 animate-pulse font-medium">Chargement du materiel...</div>;
    }

    if (!equipment) {
        return <div className="p-12 text-center text-red-500 font-bold">Materiel introuvable</div>;
    }

    return (
        <EquipmentForm
            title="Modifier un article"
            description="Mettez a jour les informations du materiel existant depuis l'espace administrateur."
            submitLabel="Modifier l'article"
            submitError={updateEquipment.isError ? (updateEquipment.error as Error).message : null}
            submitLoading={updateEquipment.isPending}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onCancel={() => navigate('/dashboard/inventory')}
        />
    );
}
