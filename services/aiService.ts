import { api } from './api';
import { IAIRequest } from '@/types';

export interface AIAnalysisResponse {
  analysis: string;
  type: string;
  days_analyzed: number;
  data_summary: {
    ventas: number;
    ingresos: number;
    ganancia: number;
    margen_pct: number;
    fiados_pendientes: number;
  };
}

export const aiService = {
  analyze: (data: IAIRequest) =>
    api.post<AIAnalysisResponse>('/ai/recommendations', data),
};
