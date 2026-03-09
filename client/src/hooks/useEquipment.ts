import { useQuery } from '@tanstack/react-query';
import { getEquipments, getEquipmentById } from '../services/api';

export const useEquipments = () => {
    return useQuery({
        queryKey: ['equipments'],
        queryFn: getEquipments,
    });
};

export const useEquipment = (id: string) => {
    return useQuery({
        queryKey: ['equipments', id],
        queryFn: () => getEquipmentById(id),
        enabled: !!id,
    });
};
