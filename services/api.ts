/**
 * Cliente HTTP base para BodegaApp.
 * - Agrega el token automáticamente a cada request
 * - Si recibe 401, limpia la sesión y redirige a login
 */

import { router } from 'expo-router';
import { BASE_URL, REQUEST_TIMEOUT } from '@/constants/config';
import { IApiResponse } from '@/types';
import { useAuthStore } from '@/store/authStore';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = useAuthStore.getState().token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleUnauthorized() {
    // Limpia sesión y redirige a login
    await useAuthStore.getState().logout();
    // Limpia cache de queries para evitar datos viejos
    const { queryClient } = await import('@/app/_layout');
    queryClient.clear();
    router.replace('/(auth)/login');
  }

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      // Token expirado o inválido → limpiar sesión
      if (response.status === 401) {
        await this.handleUnauthorized();
        throw new Error('Sesión expirada. Por favor inicia sesión de nuevo.');
      }

      const json: IApiResponse<T> = await response.json();

      if (!response.ok || json.error) {
        throw new Error(json.error?.message ?? `Error ${response.status}`);
      }

      return json.data as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(path: string) { return this.request<T>('GET', path); }
  post<T>(path: string, body: unknown) { return this.request<T>('POST', path, body); }
  put<T>(path: string, body: unknown) { return this.request<T>('PUT', path, body); }
  patch<T>(path: string, body?: unknown) { return this.request<T>('PATCH', path, body); }
  delete<T>(path: string) { return this.request<T>('DELETE', path); }
}

export const api = new ApiClient(BASE_URL);
