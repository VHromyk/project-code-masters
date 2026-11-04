export interface Exercise {
  _id: string;
  bodyPart?: string;
  equipment?: string;
  gifUrl?: string;
  name?: string;
  target?: string;
  description?: string;
  rating?: number;
  burnedCalories?: number;
  time?: number;
  popularity?: number;
}

export interface RatingPayload {
  rate: number;
  email: string;
  review: string;
}
