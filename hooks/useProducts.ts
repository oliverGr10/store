import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/productsService';
import { ICreateProductRequest } from '@/types';

export const PRODUCTS_KEY = ['products'];

export function useProducts(filters?: { category?: string; low_stock?: boolean }) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, filters],
    queryFn: () => productsService.list(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn: () => productsService.get(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateProductRequest) => productsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICreateProductRequest> }) =>
      productsService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}
