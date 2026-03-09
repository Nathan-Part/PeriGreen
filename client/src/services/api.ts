import type { Equipment, Loan, User } from '../types';
import { mockEquipment, mockLoans, mockUsers } from '../mocks';
import type { LoanFormData } from '../types/schemas';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const DELAY_MS = 600;

export const getEquipments = async (): Promise<Equipment[]> => {
    await delay(DELAY_MS);
    return [...mockEquipment];
};

export const getEquipmentById = async (id: string): Promise<Equipment | undefined> => {
    await delay(DELAY_MS);
    return mockEquipment.find(e => e.id === id);
};

export const createLoan = async (data: LoanFormData): Promise<Loan> => {
    await delay(DELAY_MS);

    const equipmentIndex = mockEquipment.findIndex(e => e.id === data.equipmentId);
    if (equipmentIndex === -1) {
        throw new Error("L'équipement n'existe pas.");
    }

    const equipment = mockEquipment[equipmentIndex];
    if (equipment.status !== 'AVAILABLE') {
        throw new Error("L'équipement n'est pas disponible pour le moment.");
    }

    // Update logic: Mutating global mock to reflect state change
    mockEquipment[equipmentIndex] = {
        ...equipment,
        status: 'IN_USE',
    };

    const newLoan: Loan = {
        id: `loan_${Date.now()}`,
        equipmentId: data.equipmentId,
        userId: data.userId,
        startDate: data.startDate,
        expectedEndDate: data.expectedEndDate,
        notes: data.notes,
        status: 'ACTIVE',
    };

    mockLoans.push(newLoan);

    return {
        ...newLoan,
        equipment: mockEquipment[equipmentIndex],
        user: mockUsers.find(u => u.id === data.userId),
    };
};

export const getLoans = async (): Promise<Loan[]> => {
    await delay(DELAY_MS);
    return mockLoans.map(loan => ({
        ...loan,
        equipment: mockEquipment.find(e => e.id === loan.equipmentId),
        user: mockUsers.find(u => u.id === loan.userId)
    }));
};

export const getUsers = async (): Promise<User[]> => {
    await delay(DELAY_MS);
    return [...mockUsers];
};
