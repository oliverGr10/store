/**
 * Cliente HTTP base para BodegaApp.
 * Lee el token de authStore y lo agrega automáticamente a cada request.
 */

import { BASE_URL, REQUEST_TIMEOUT } from '@/constants/config';
import { IApiResponse } from '@/types';

// Importamos el store directamente (no como hook) para usarlo fuera de componentes
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

    // Leer token del store (acceso directo, no hook)
    const token = useAuthStore.getState().token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const json: IApiResponse<T> = await response.json();

      if (!response.ok || json.error) {
        const msg = json.error?.message ?? `Error ${response.status}`;
        throw new Error(msg);
      }

      return json.data as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(path: string) {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>('PUT', path, body);
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>('PATCH', path, body);
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path);
  }
}

export const api = new ApiClient(BASE_URL);
