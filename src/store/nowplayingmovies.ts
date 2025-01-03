import { create } from "zustand";
import axios from "../utils/axios/axios";

// Define the type for the movie data
export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null; // Add runtime here
}

// Define the type for the store state
interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  fetchNowPlayingMovies: () => Promise<void>;
}

const useNowPlayingStore = create<MovieState>((set) => ({
  movies: [],
  loading: false,
  error: null,
  fetchNowPlayingMovies: async () => {
    set({ loading: true, error: null }); // Start loading and reset errors
    try {
      const response = await axios.get("movie/now_playing", {
        params: { region: "US", language: "en-US" },
      });
      const movies = response.data.results;

      // Now, fetch runtime for each movie
      const moviesWithRuntime = await Promise.all(
        movies.map(async (movie: Movie) => {
          const movieDetails = await axios.get(`movie/${movie.id}`, {
            params: { api_key: import.meta.env.VITE_TMDB_API_KEY },
          });
          return { ...movie, runtime: movieDetails.data.runtime }; // Add runtime
        })
      );

      set({ movies: moviesWithRuntime, loading: false });
    } catch (err) {
      set({ error: "Failed to load movies.", loading: false });
    }
  },
}));

export default useNowPlayingStore;
