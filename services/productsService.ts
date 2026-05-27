import { api } from './api';
import { IProduct, ICreateProductRequest } from '@/types';

export const productsService = {
  list: (params?: { category?: string; low_stock?: boolean }) => {
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return api.get<IProduct[]>(`/products${qs}`);
  },

  get: (id: string) => api.get<IProduct>(`/products/${id}`),

  create: (data: ICreateProductRequest) =>
    api.post<IProduct>('/products', data),

  update: (id: string, data: Partial<ICreateProductRequest>) =>
    api.put<IProduct>(`/products/${id}`, data),

  delete: (id: string) => api.delete<{ message: string }>(`/products/${id}`),
};
