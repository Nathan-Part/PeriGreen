const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jacquesvollet.alwaysdata.net';

// Token management
const getToken = (): string | null => localStorage.getItem('token');

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: object) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeStoredUser = () => {
  localStorage.removeItem('user');
};

// Generic fetch with auth
const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
    throw new Error(error.message || error.error || 'Erreur API');
  }

  return response.json();
};

// Auth API
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Identifiants invalides' }));
    throw new Error(error.message || error.error || 'Erreur de connexion');
  }

  // Get the token from response - JWT is returned
  const data = await response.json();
  if (data.token) {
    setToken(data.token);
  }

  // Fetch current user
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

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  universityId: string;
  role: string;
  roles: string[];
  createdAt?: string;
}

export const getCurrentUser = async () => {
  return fetchApi<AuthUser>('/auth/me');
};

export const updateMyProfile = async (data: {
  email?: string;
  fullName?: string;
  universityId?: string;
  currentPassword?: string;
  password?: string;
}) => {
  return fetchApi<AuthUser>('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const logout = () => {
  removeToken();
  removeStoredUser();
};

// Equipment API
export interface Equipment {
  id: number;
  name: string;
  description: string;
  brand: string;
  model: string;
  serialNumber: string;
  etat: string;
  status?: string;
  localisation?: string;
  totalQuantity: number;
  imageUrl: string;
  category: {
    id: number;
    name: string;
  };
}

export const getEquipments = async (): Promise<Equipment[]> => {
  return fetchApi<Equipment[]>('/api/equipments');
};

export const getEquipmentById = async (id: number): Promise<Equipment> => {
  return fetchApi<Equipment>(`/api/equipments/${id}`);
};

export const createEquipment = async (data: Partial<Equipment>) => {
  return fetchApi<Equipment>('/api/equipments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateEquipment = async (id: number, data: Partial<Equipment>) => {
  return fetchApi<Equipment>(`/api/equipments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteEquipment = async (id: number) => {
  return fetchApi<{ message: string }>(`/api/equipments/${id}`, {
    method: 'DELETE',
  });
};

// Category API
export interface Category {
  id: number;
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  return fetchApi<Category[]>('/api/categories');
};

// Loan API
export interface Loan {
  id: number;
  pickupDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
  quantity: number;
  returnNote?: string;
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

export interface LoanSummary {
  id: number;
  pickupDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'EN_COURS' | 'RETOUR_DEMANDE' | 'TERMINE' | 'EN_RETARD';
  quantity: number;
}

export const getLoans = async (): Promise<Loan[]> => {
  return fetchApi<Loan[]>('/api/loans');
};

export const getLoanById = async (id: number): Promise<Loan> => {
  return fetchApi<Loan>(`/api/loans/${id}`);
};

export const createLoan = async (data: {
  pickupDate: string;
  dueDate: string;
  status: string;
  quantity: number;
  reservationId: number;
  equipmentId: number;
  borrowerId: number;
  notes?: string;
}) => {
  return fetchApi<Loan>('/api/loans', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateLoan = async (id: number, data: Partial<Loan>) => {
  return fetchApi<Loan>(`/api/loans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteLoan = async (id: number) => {
  return fetchApi<{ message: string }>(`/api/loans/${id}`, {
    method: 'DELETE',
  });
};

// Reservation API
export interface Reservation {
  id: number;
  createdAt: string;
  status: string;
  quantity: number;
  validatedAt?: string;
  decisionNote?: string;
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
  };
  loan?: LoanSummary | null;
}

export const getReservations = async (): Promise<Reservation[]> => {
  return fetchApi<Reservation[]>('/api/reservations');
};

export const getReservationById = async (id: number): Promise<Reservation> => {
  return fetchApi<Reservation>(`/api/reservations/${id}`);
};

export const createReservation = async (data: {
  quantity: number;
  equipmentId: number;
  requesterId?: number;
  status?: string;
  dueDate?: string;
}) => {
  return fetchApi<Reservation>('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateReservation = async (id: number, data: Partial<Reservation>) => {
  return fetchApi<Reservation>(`/api/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteReservation = async (id: number) => {
  return fetchApi<{ message: string }>(`/api/reservations/${id}`, {
    method: 'DELETE',
  });
};

/** Mes réservations (filtrées par le backend via le token JWT) */
export const getMyReservations = async (): Promise<Reservation[]> => {
  return fetchApi<Reservation[]>('/api/reservations/me');
};

export const cancelReservation = async (id: number): Promise<Reservation> => {
  return fetchApi<Reservation>(`/api/reservations/${id}/annuler`, {
    method: 'PATCH',
  });
};

export const returnLoan = async (loanId: number): Promise<LoanSummary> => {
  return fetchApi<LoanSummary>(`/api/loans/${loanId}/retourner`, {
    method: 'PATCH',
  });
};

// User API
export interface User {
  id: number;
  email: string;
  fullName: string;
  universityId: string;
  role: string;
  roles?: string[];
  createdAt?: string;
}

export const getUsers = async (): Promise<User[]> => {
  return fetchApi<User[]>('/api/users');
};

export const createUser = async (data: Omit<User, 'id'> & { password?: string }) => {
  return fetchApi<User>('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateUser = async (id: number, data: Partial<User>) => {
  return fetchApi<User>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id: number) => {
  return fetchApi<{ message: string }>(`/api/users/${id}`, {
    method: 'DELETE',
  });
};
