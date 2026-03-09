import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLoans, createLoan } from '../services/api';
import type { LoanFormData } from '../types/schemas';

export const useLoans = () => {
    return useQuery({
        queryKey: ['loans'],
        queryFn: getLoans,
    });
};

export const useCreateLoan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoanFormData) => createLoan(data),
        onSuccess: () => {
            // Invalider les requêtes pour mettre à jour les listes
            queryClient.invalidateQueries({ queryKey: ['loans'] });
            queryClient.invalidateQueries({ queryKey: ['equipments'] });
        },
    });
};
