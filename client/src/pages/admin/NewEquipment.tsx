import { useNavigate } from 'react-router-dom';
import { EquipmentForm, type EquipmentFormData } from '../../components/equipment/EquipmentForm';
import { useCategories, useCreateEquipment } from '../../hooks/useEquipment';

export default function NewEquipment() {
    const navigate = useNavigate();
    const { data: categories, isLoading: isCategoriesLoading } = useCategories();
    const createEquipment = useCreateEquipment();

    const onSubmit = (data: EquipmentFormData) => {
        createEquipment.mutate(data, {
            onSuccess: (createdEquipment) => {
                navigate(`/dashboard/inventory/${createdEquipment.id}`);
            },
        });
    };

    return (
        <EquipmentForm
            title="Ajouter un article"
            description="Cree une nouvelle fiche materiel visible dans l'inventaire admin et dans l'espace utilisateur."
            submitLabel="Enregistrer l'article"
            submitError={createEquipment.isError ? (createEquipment.error as Error).message : null}
            submitLoading={createEquipment.isPending}
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
            onSubmit={onSubmit}
            onCancel={() => navigate('/dashboard/inventory')}
        />
    );
}
