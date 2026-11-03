import axios from 'axios';

export const NETWORK_ERROR_STATUS = 0;

const api = axios.create({
  baseURL: 'https://your-energy.b.goit.study/api',
});

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function getJson<T>(path: string): Promise<T> {
  try {
    const response = await api.get<T>(path);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new ApiError(error.response.status, error.message);
    }

    throw new ApiError(NETWORK_ERROR_STATUS, 'Network error');
  }
}
