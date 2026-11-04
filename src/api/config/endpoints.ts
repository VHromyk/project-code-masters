export const API_URL = {
  filters: '/filters',
  exercises: '/exercises',
  exerciseById: (id: string) => `/exercises/${encodeURIComponent(id)}`,
  exerciseRating: (id: string) => `/exercises/${encodeURIComponent(id)}/rating`,
  subscription: '/subscription',
} as const;
