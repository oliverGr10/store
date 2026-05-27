/**
 * Root Layout — carga token guardado y provee QueryClient.
 * Redirige a /login o /(tabs) según autenticación.
 */

import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,       // 30s antes de refetch
      retry: 1,
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
