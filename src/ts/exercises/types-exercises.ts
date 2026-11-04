
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
