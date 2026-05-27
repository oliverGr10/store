import { api } from './api';
import { ISale, ICreateSaleRequest } from '@/types';

export interface SalesTodaySummary {
  sales_count: number;
  total_revenue: number;
  total_profit: number;
  sales: ISale[];
}

export const salesService = {
  create: (data: ICreateSaleRequest) =>
    api.post<ISale>('/sales', data),

  today: () => api.get<SalesTodaySummary>('/sales/today'),

  history: (params?: { start_date?: string; end_date?: string; limit?: number }) => {
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return api.get<ISale[]>(`/sales${qs}`);
  },

  get: (id: string) => api.get<ISale>(`/sales/${id}`),
};
