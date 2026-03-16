const API_BASE_URL = 'http://localhost:8000';

export type AppRole = 'ADMIN' | 'USER';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  universityId: string;
  role: AppRole;
  roles: string[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Equipment {
  id: number;
  name: string;
  description: string;
  brand: string;
  model: string;
  serialNumber: string;
  etat: string;
  totalQuantity: number;
  imageUrl: string;
  category: Category;
}

export type LoanStatus = 'EN_COURS' | 'RETOUR_DEMANDE' | 'TERMINE' | 'EN_RETARD';

export interface Loan {
  id: number;
  pickupDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: LoanStatus;
  quantity: number;
  returnNote?: string | null;
  equipment: {
    id: number;
    name: string;
  };
  borrower: {
    id: number;
    email: string;
  };
  reservation: {
    id: number;
  };
}

export type ReservationStatus = 'EN_ATTENTE' | 'VALIDEE' | 'REFUSEE' | 'ANNULEE' | 'EXPIREE';

export interface Reservation {
  id: number;
  createdAt: string;
  status: ReservationStatus;
  quantity: number;
  validatedAt?: string | null;
  decisionNote?: string | null;
  equipment: {
    id: number;
    name: string;
  };
  requester: {
    id: number;
    email: string;
  };
  approver?: {
    id: number;
    email: string;
  } | null;
}

export interface ApiUser {
  id: number;
  email: string;
  fullName: string;
  universityId: string;
  role: AppRole;
  roles: string[];
  createdAt: string;
}

const getToken = (): string | null => localStorage.getItem('token');

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getStoredUser = (): AuthUser | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) as AuthUser : null;
};

export const setStoredUser = (user: AuthUser) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeStoredUser = () => {
  localStorage.removeItem('user');
};

const fetchApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
    throw new Error(error.message || error.error || 'Erreur API');
  }

  return response.json() as Promise<T>;
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Identifiants invalides' }));
    throw new Error(error.message || error.error || 'Erreur de connexion');
  }

  const data = await response.json();
  if (data.token) {
    setToken(data.token);
  }

  const user = await getCurrentUser();
  setStoredUser(user);

  return user;
};

export const register = async (userData: {
  email: string;
  password: string;
  fullName: string;
  universityId: string;
}) => {
  return fetchApi<{ message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  return fetchApi<AuthUser>('/auth/me');
};

export const logout = () => {
  removeToken();
  removeStoredUser();
};

export const getEquipments = async (): Promise<Equipment[]> => fetchApi<Equipment[]>('/api/equipments');
export const getEquipmentById = async (id: number): Promise<Equipment> => fetchApi<Equipment>(`/api/equipments/${id}`);

export const createEquipment = async (data: {
  name: string;
  description: string;
  brand: string;
  model: string;
  serialNumber: string;
  etat: string;
  totalQuantity: number;
  imageUrl: string;
  categoryId: number;
}) => fetchApi<Equipment>('/api/equipments', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const updateEquipment = async (id: number, data: Partial<{
  name: string;
  description: string;
  brand: string;
  model: string;
  serialNumber: string;
  etat: string;
  totalQuantity: number;
  imageUrl: string;
  categoryId: number;
}>) => fetchApi<Equipment>(`/api/equipments/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

export const deleteEquipment = async (id: number) => fetchApi<{ message: string }>(`/api/equipments/${id}`, {
  method: 'DELETE',
});

export const getCategories = async (): Promise<Category[]> => fetchApi<Category[]>('/api/categories');

export const getLoans = async (): Promise<Loan[]> => fetchApi<Loan[]>('/api/loans');
export const getLoanById = async (id: number): Promise<Loan> => fetchApi<Loan>(`/api/loans/${id}`);

export const createLoan = async (data: {
  pickupDate: string;
  dueDate: string;
  status: LoanStatus;
  quantity: number;
  reservationId: number;
  equipmentId: number;
  borrowerId: number;
  returnNote?: string;
}) => fetchApi<Loan>('/api/loans', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const updateLoan = async (id: number, data: Partial<{
  pickupDate: string;
  dueDate: string;
  returnDate: string;
  status: LoanStatus;
  quantity: number;
  returnNote: string;
  reservationId: number;
  equipmentId: number;
  borrowerId: number;
}>) => fetchApi<Loan>(`/api/loans/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

export const deleteLoan = async (id: number) => fetchApi<{ message: string }>(`/api/loans/${id}`, {
  method: 'DELETE',
});

export const getReservations = async (): Promise<Reservation[]> => fetchApi<Reservation[]>('/api/reservations');
export const getReservationById = async (id: number): Promise<Reservation> => fetchApi<Reservation>(`/api/reservations/${id}`);

export const createReservation = async (data: {
  quantity: number;
  equipmentId: number;
  requesterId?: number;
  status?: ReservationStatus;
}) => fetchApi<Reservation>('/api/reservations', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const updateReservation = async (id: number, data: Partial<{
  quantity: number;
  status: ReservationStatus;
  equipmentId: number;
  requesterId: number;
  approverId: number;
  validatedAt: string;
  decisionNote: string;
}>) => fetchApi<Reservation>(`/api/reservations/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

export const deleteReservation = async (id: number) => fetchApi<{ message: string }>(`/api/reservations/${id}`, {
  method: 'DELETE',
});

export const getUsers = async (): Promise<ApiUser[]> => fetchApi<ApiUser[]>('/api/users');
