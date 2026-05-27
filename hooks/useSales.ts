import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesService } from '@/services/salesService';
import { ICreateSaleRequest } from '@/types';
import { PRODUCTS_KEY } from './useProducts';

const SALES_KEY = ['sales'];
const SALES_TODAY_KEY = ['sales', 'today'];

export function useSalesToday() {
  return useQuery({
    queryKey: SALES_TODAY_KEY,
    queryFn: () => salesService.today(),
    refetchInterval: 60_000, // refresca cada minuto
  });
}

export function useSalesHistory(params?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: [...SALES_KEY, params],
    queryFn: () => salesService.history(params),
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateSaleRequest) => salesService.create(data),
    onSuccess: () => {
      // Al vender: actualiza dashboard y stock de productos
      qc.invalidateQueries({ queryKey: SALES_TODAY_KEY });
      qc.invalidateQueries({ queryKey: SALES_KEY });
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}
