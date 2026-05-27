import { useMutation } from '@tanstack/react-query';
import { aiService } from '@/services/aiService';
import { IAIRequest } from '@/types';

// useMutation (no useQuery) porque el análisis es on-demand, no al cargar la pantalla
export function useAIAnalysis() {
  return useMutation({
    mutationFn: (data: IAIRequest) => aiService.analyze(data),
  });
}
