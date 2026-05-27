/**
 * Store de autenticación.
 * Persiste el token en expo-secure-store (móvil) o localStorage (web).
 */

import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { IUser } from '@/types';

const TOKEN_KEY = 'bodega_token';

// Abstracción de storage compatible con web y móvil
const storage = {
  async get(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async set(value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, value);
      return;
    }
    return SecureStore.setItemAsync(TOKEN_KEY, value);
  },
  async delete(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
      return;
    }
    return SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

interface AuthState {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (token: string, user: IUser) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (token, user) => {
    await storage.set(token);
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    await storage.delete();
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadStoredToken: async () => {
    try {
      const token = await storage.get();
      if (token) {
        set({ token, isAuthenticated: true });
      }
    } catch {
      // ignorar errores de storage
    } finally {
      set({ isLoading: false });
    }
  },
}));
