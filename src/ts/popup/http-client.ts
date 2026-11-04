import axios from 'axios';
import http from '../../api/http';

const NETWORK_ERROR_STATUS = 0;
const NETWORK_ERROR_MESSAGE = 'Check your internet connection and try again.';
const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again later.';

const api = http;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error) && error.response) {
    return new ApiError(error.response.status, error.message);
  }

  return new ApiError(NETWORK_ERROR_STATUS, 'Network error');
}

export async function getJson<T>(path: string): Promise<T> {
  try {
    const response = await api.get<T>(path);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function patchJson<T>(path: string, body: unknown): Promise<T> {
  try {
    const response = await api.patch<T>(path, body);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export function getErrorMessage(
  error: unknown,
  messages: Record<number, string> = {}
): string {
  if (!(error instanceof ApiError)) return DEFAULT_ERROR_MESSAGE;
  if (error.status === NETWORK_ERROR_STATUS) return NETWORK_ERROR_MESSAGE;

  return messages[error.status] || DEFAULT_ERROR_MESSAGE;
}
