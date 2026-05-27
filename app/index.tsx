/**
 * Pantalla raíz — solo redirige según estado de autenticación.
 */

import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}
