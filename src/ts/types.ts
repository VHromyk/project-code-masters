export enum Filter {
  Muscles = "Muscles",
  BodyParts = "Body parts",
  Equipment = "Equipment"
}

export interface ICategory {
  filter: Filter;
  name: string;
  imgURL: string;
}

export interface ICategoriesData {
  page: number;
  perPage: number;
  totalPages: number;
  results: ICategory[];
}

export interface IMakeCategories { 
  (data: ICategoriesData): void;
}

export interface IChangeFiltersState { 
  (): void;
}