/**
 * Root Layout — carga token guardado y provee QueryClient.
 */

import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

// Exportado para poder limpiarlo desde login y api.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: false,              // no reintentar en 401
      refetchOnWindowFocus: true,
    },
  },
});

export default function RootLayout() {
  const loadStoredToken = useAuthStore((s) => s.loadStoredToken);

  useEffect(() => {
    loadStoredToken();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryClientProvider>
  );
}
