export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department?: string;
  avatarUrl?: string;
}

export type EquipmentStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED' | 'LOST';

export type EquipmentCondition = 'NEW' | 'GOOD' | 'FAIR' | 'POOR';

export interface Equipment {
  id: string;
  name: string;
  reference: string;
  category: string;
  status: EquipmentStatus;
  condition: EquipmentCondition;
  purchaseDate: string;
  nextMaintenanceDate?: string;
  location?: string;
  notes?: string;
  imageUrl?: string;
}

export type LoanStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';

export interface Loan {
  id: string;
  equipmentId: string;
  userId: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  status: LoanStatus;
  notes?: string;
  // Included relations for frontend ease of use
  equipment?: Equipment;
  user?: User;
}

export type MaintenanceType = 'ROUTINE' | 'REPAIR' | 'INSPECTION';

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  type: MaintenanceType;
  description: string;
  date: string;
  cost?: number;
  performedBy?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  timestamp: string;
  details: string;
}

export interface DashboardStats {
  totalEquipment: number;
  availableEquipment: number;
  activeLoans: number;
  overdueLoans: number;
  equipmentInMaintenance: number;
  recentActivity: ActivityLog[];
}
