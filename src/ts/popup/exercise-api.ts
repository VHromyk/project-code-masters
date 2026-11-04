import { getJson, patchJson } from './http-client';
import type { Exercise, RatingPayload } from '../types/exercise';
import { API_URL } from '../../api/config/endpoints';

export function getExerciseById(id: string): Promise<Exercise> {
  return getJson<Exercise>(API_URL.exerciseById(id));
}

export function addExerciseRating(
  id: string,
  payload: RatingPayload
): Promise<Exercise> {
  return patchJson<Exercise>(API_URL.exerciseRating(id), payload);
}
