import { getJson, patchJson } from './http-client';
import type { Exercise, RatingPayload } from './types';

export function getExerciseById(id: string): Promise<Exercise> {
  return getJson<Exercise>(`/exercises/${encodeURIComponent(id)}`);
}

export function addExerciseRating(
  id: string,
  payload: RatingPayload
): Promise<Exercise> {
  return patchJson<Exercise>(
    `/exercises/${encodeURIComponent(id)}/rating`,
    payload
  );
}
