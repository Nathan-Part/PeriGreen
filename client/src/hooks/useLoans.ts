import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation
} from '../services/api';

// Loans
export const useLoans = () => {
  return useQuery({
    queryKey: ['loans'],
    queryFn: getLoans,
  });
};

export const useLoan = (id: string | number) => {
  return useQuery({
    queryKey: ['loans', id],
    queryFn: () => getLoanById(Number(id)),
    enabled: !!id,
  });
};

export const useCreateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createLoan>[0]) => createLoan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
    },
  });
};

export const useUpdateLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateLoan>[1] }) =>
      updateLoan(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['loans', id] });
    },
  });
};

export const useDeleteLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
};

// Reservations
export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
  });
};

export const useReservation = (id: string | number) => {
  return useQuery({
    queryKey: ['reservations', id],
    queryFn: () => getReservations().then(reservations =>
      reservations.find(r => r.id === Number(id))
    ),
    enabled: !!id,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createReservation>[0]) =>
      createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateReservation>[1] }) =>
      updateReservation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservations', id] });
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};
