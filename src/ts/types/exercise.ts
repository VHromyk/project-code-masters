export type FilterName = 'Muscles' | 'Body parts' | 'Equipment';

export interface Exercise {
  _id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  description: string;
  rating: number;
  burnedCalories: number;
  time: number;
  popularity: number;
  target?: string;
}

export interface PagedResponse<T> {
  page: number | string;
  perPage: number;
  totalPages: number;
  results: T[];
}

export type CardVariant = 'home' | 'favorites';

export interface ExerciseOpenDetail {
  id: string;
}

export interface RatingPayload {
  rate: number;
  email: string;
  review: string;
}

export interface CategoriesParams {
  filter: FilterName;
  page: number;
  limit: number;
}

export interface ExercisesParams extends CategoriesParams {
  category: string;
  keyword?: string;
}
