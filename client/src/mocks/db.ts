import type { Equipment, User, Loan } from '../types';

export let mockUsers: User[] = [
    {
        id: 'u1',
        firstName: 'Admin',
        lastName: 'PeriGreen',
        email: 'admin@perigreen.fr',
        role: 'ADMIN',
    },
    {
        id: 'u2',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@etu.univ.fr',
        role: 'USER',
    }
];

export let mockEquipment: Equipment[] = [
    {
        id: 'e1',
        name: 'Ordinateur Portable Dell XPS 15',
        reference: 'DELL-XPS-001',
        category: 'Informatique',
        status: 'AVAILABLE',
        condition: 'NEW',
        purchaseDate: '2025-01-10',
    },
    {
        id: 'e2',
        name: 'Câble HDMI 2m',
        reference: 'CAB-HDMI-001',
        category: 'Accessoires',
        status: 'AVAILABLE',
        condition: 'GOOD',
        purchaseDate: '2023-05-12',
    },
    {
        id: 'e3',
        name: 'Adaptateur USB-C vers HDMI/USB',
        reference: 'ADAP-USBC-001',
        category: 'Accessoires',
        status: 'IN_USE',
        condition: 'GOOD',
        purchaseDate: '2024-02-20',
    },
    {
        id: 'e4',
        name: 'Vidéoprojecteur Epson',
        reference: 'VID-EPS-001',
        category: 'Audiovisuel',
        status: 'AVAILABLE',
        condition: 'FAIR',
        purchaseDate: '2022-09-01',
    },
    {
        id: 'e5',
        name: 'Écran Dell 27 pouces',
        reference: 'ECR-DELL-001',
        category: 'Informatique',
        status: 'AVAILABLE',
        condition: 'NEW',
        purchaseDate: '2025-08-15',
    },
    {
        id: 'e6',
        name: 'Clavier Mécanique Keychron',
        reference: 'CLA-KEY-001',
        category: 'Informatique',
        status: 'AVAILABLE',
        condition: 'GOOD',
        purchaseDate: '2024-11-05',
    },
    {
        id: 'e7',
        name: 'Microphone USB Blue Yeti',
        reference: 'MIC-YETI-001',
        category: 'Audiovisuel',
        status: 'MAINTENANCE',
        condition: 'POOR',
        purchaseDate: '2021-04-10',
    },
    {
        id: 'e8',
        name: 'Caméra Web Logitech C920',
        reference: 'CAM-LOG-001',
        category: 'Audiovisuel',
        status: 'AVAILABLE',
        condition: 'GOOD',
        purchaseDate: '2023-01-22',
    },
    {
        id: 'e9',
        name: 'Casque Audio Sony WH-1000XM4',
        reference: 'CAS-SONY-001',
        category: 'Audiovisuel',
        status: 'IN_USE',
        condition: 'GOOD',
        purchaseDate: '2024-06-30',
    },
    {
        id: 'e10',
        name: 'MacBook Pro M3 14"',
        reference: 'MAC-PRO-001',
        category: 'Informatique',
        status: 'AVAILABLE',
        condition: 'NEW',
        purchaseDate: '2026-01-15',
    }
];

export let mockLoans: Loan[] = [
    {
        id: 'l1',
        equipmentId: 'e3',
        userId: 'u2',
        startDate: '2026-03-01',
        expectedEndDate: '2026-03-15',
        status: 'ACTIVE',
    },
    {
        id: 'l2',
        equipmentId: 'e9',
        userId: 'u2',
        startDate: '2026-02-15',
        expectedEndDate: '2026-02-28',
        status: 'OVERDUE',
    },
    {
        id: 'l3',
        equipmentId: 'e1',
        userId: 'u1',
        startDate: '2026-01-10',
        expectedEndDate: '2026-01-20',
        actualEndDate: '2026-01-19',
        status: 'COMPLETED',
    }
];
