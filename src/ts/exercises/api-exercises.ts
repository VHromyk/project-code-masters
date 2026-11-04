import type { Exercise, FilterName, PagedResponse, ExercisesParams } from '../types/exercise';
import http from '../../api/http';
import { API_URL } from '../../api/config/endpoints';

const api = http;

const FILTER_PARAMS: Record<FilterName, string> = {
  Muscles: 'muscles',
  'Body parts': 'bodypart',
  Equipment: 'equipment',
};

export async function fetchExercises({
  filter,
  category,
  keyword,
  page,
  limit,
}: ExercisesParams): Promise<PagedResponse<Exercise>> {
  const params: Record<string, string | number> = {
    page,
    limit,
    [FILTER_PARAMS[filter]]: category,
  };
  if (keyword) params.keyword = keyword;

  const { data } = await api.get<PagedResponse<Exercise>>(API_URL.exercises, { params });
  return data;
}
