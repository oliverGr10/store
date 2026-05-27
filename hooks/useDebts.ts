import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debtsService } from '@/services/debtsService';
import { ICreateDebtRequest } from '@/types';

const DEBTS_KEY = ['debts'];

export function useDebts(paid?: boolean) {
  return useQuery({
    queryKey: [...DEBTS_KEY, { paid }],
    queryFn: () => debtsService.list(paid),
  });
}

export function useCreateDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateDebtRequest) => debtsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: DEBTS_KEY }),
  });
}

export function usePayDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debtsService.pay(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: DEBTS_KEY }),
  });
}

export function useDeleteDebt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debtsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: DEBTS_KEY }),
  });
}
