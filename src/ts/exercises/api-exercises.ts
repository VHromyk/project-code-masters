import axios from 'axios';
import type { Category, Exercise, FilterName, PagedResponse } from './types-exercises';

const api = axios.create({
  baseURL: 'https://your-energy.b.goit.study/api',
});

const FILTER_PARAMS: Record<FilterName, string> = {
  Muscles: 'muscles',
  'Body parts': 'bodypart',
  Equipment: 'equipment',
};

export interface CategoriesParams {
  filter: FilterName;
  page: number;
  limit: number;
}

export interface ExercisesParams extends CategoriesParams {
  category: string;
  keyword?: string;
}


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

  const { data } = await api.get<PagedResponse<Exercise>>('/exercises', { params });
  return data;
}
