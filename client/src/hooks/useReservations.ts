import { create } from 'zustand';
import {
  getReservations,
  createReservation as apiCreate,
  updateReservation,
  cancelReservation as apiCancel,
  deleteReservation as apiDelete,
  type Reservation,
} from '../services/api';

interface ReservationsState {
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchMine: (userId: number) => Promise<void>;
  create: (data: { quantity: number; equipmentId: number }) => Promise<void>;
  updateStatus: (id: number, status: string, decisionNote?: string, dueDate?: string) => Promise<void>;
  cancel: (id: number) => Promise<void>;
  deleteOne: (id: number) => Promise<void>;
  deleteAll: (ids: number[]) => Promise<void>;
}

export const useReservations = create<ReservationsState>((set) => ({
  reservations: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getReservations();
      set({ reservations: data, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  fetchMine: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const all = await getReservations();
      const mine = all.filter((r) => r.requester?.id === userId);
      set({ reservations: mine, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  create: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const created = await apiCreate(data);
      set((s) => ({ reservations: [created, ...s.reservations], isLoading: false }));
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
      throw e;
    }
  },

  updateStatus: async (id, status, decisionNote, dueDate) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = { status, decisionNote };
      if (dueDate) payload.dueDate = dueDate;
      const updated = await updateReservation(id, payload as Partial<Reservation>);
      set((s) => ({
        reservations: s.reservations.map((r) => (r.id === id ? updated : r)),
      }));
    } catch (e) {
      set({ error: (e as Error).message });
      throw e;
    }
  },

  cancel: async (id) => {
    try {
      const updated = await apiCancel(id);
      set((s) => ({
        reservations: s.reservations.map((r) => (r.id === id ? updated : r)),
      }));
    } catch (e) {
      set({ error: (e as Error).message });
      throw e;
    }
  },

  deleteOne: async (id) => {
    try {
      await apiDelete(id);
      set((s) => ({ reservations: s.reservations.filter((r) => r.id !== id) }));
    } catch (e) {
      set({ error: (e as Error).message });
      throw e;
    }
  },

  deleteAll: async (ids) => {
    try {
      await Promise.all(ids.map((id) => apiDelete(id)));
      set((s) => ({ reservations: s.reservations.filter((r) => !ids.includes(r.id)) }));
    } catch (e) {
      set({ error: (e as Error).message });
      throw e;
    }
  },
}));
