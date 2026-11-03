import { getJson } from './http-client';
import type { Exercise } from './exercise-types';

export function getExerciseById(id: string): Promise<Exercise> {
  return getJson<Exercise>(`/exercises/${encodeURIComponent(id)}`);
}
