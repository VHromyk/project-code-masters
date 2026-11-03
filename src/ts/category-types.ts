export interface Category {
  filter: string;
  name: string;
  imgURL: string;
}

export interface CategoriesResponse {
  page: string;
  perPage: string;
  totalPages: number;
  results: Category[];
}
