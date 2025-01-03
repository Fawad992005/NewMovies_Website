// src/types.ts
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export interface MovieResponse {
  results: Movie[];
}
