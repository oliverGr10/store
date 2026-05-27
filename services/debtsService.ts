import { api } from './api';
import { IDebt, ICreateDebtRequest } from '@/types';

export const debtsService = {
  list: (paid?: boolean) => {
    const qs = paid !== undefined ? `?paid=${paid}` : '';
    return api.get<IDebt[]>(`/debts${qs}`);
  },

  create: (data: ICreateDebtRequest) =>
    api.post<IDebt>('/debts', data),

  pay: (id: string) =>
    api.patch<IDebt>(`/debts/${id}/pay`),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/debts/${id}`),
};
