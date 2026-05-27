// URL base de la API — cambia a tu URL de Railway en producción
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export const API_PREFIX = '/api/v1';

export const BASE_URL = `${API_URL}${API_PREFIX}`;

export const REQUEST_TIMEOUT = 15000; // 15 segundos
