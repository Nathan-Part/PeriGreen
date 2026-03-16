import { z } from 'zod';

export const loanSchema = z.object({
    equipmentId: z.string().min(1, "L'équipement est requis"),
    userId: z.string().min(1, "L'utilisateur est requis"),
    startDate: z.string().min(1, "La date de début est requise"),
    expectedEndDate: z.string().min(1, "La date de fin prévue est requise"),
    notes: z.string().optional(),
}).refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.expectedEndDate);
    return end > start;
}, {
    message: "La date de fin doit être strictement ultérieure à la date de début",
    path: ["expectedEndDate"],
});

// Export explicite du type inféré (requis pour la compatibilité ES modules)
export type LoanFormData = {
    equipmentId: string;
    userId: string;
    startDate: string;
    expectedEndDate: string;
    notes?: string;
};

