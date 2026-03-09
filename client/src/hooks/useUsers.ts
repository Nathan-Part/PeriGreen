import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/api';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });
};
