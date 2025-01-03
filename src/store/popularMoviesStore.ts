import { create } from "zustand";
import axios from "../utils/axios/axios";

// Define the type for the movie data (reuse the Movie interface)
export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
}

// Define the type for the store state
interface PopularMovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  currentPage: number; // Add currentPage to track the current page
  totalPages: number; // Add totalPages to track total number of pages
  fetchPopularMovies: (page: number) => Promise<void>; // Modify the fetch function to accept a page
}

const usePopularMoviesStore = create<PopularMovieState>((set) => ({
  movies: [],
  loading: false,
  error: null,
  currentPage: 1, // Default starting page
  totalPages: 1, // Default to 1, will be updated once we get the total pages from the API
  fetchPopularMovies: async (page = 1) => {
    set({ loading: true, error: null }); // Start loading and reset errors
    try {
      const response = await axios.get("movie/popular", {
        params: {
          region: "US",
          language: "en-US",
          page, // Pass the page number as part of the request
        },
      });

      const movies = response.data.results;
      const totalPages = response.data.total_pages; // Get total pages from API response

      // Fetch runtime for each movie
      const moviesWithRuntime = await Promise.all(
        movies.map(async (movie: Movie) => {
          const movieDetails = await axios.get(`movie/${movie.id}`, {
            params: { api_key: import.meta.env.VITE_TMDB_API_KEY },
          });
          return { ...movie, runtime: movieDetails.data.runtime }; // Add runtime
        })
      );

      set({
        movies: moviesWithRuntime,
        loading: false,
        currentPage: page,
        totalPages,
      });
    } catch (err) {
      set({ error: "Failed to load popular movies.", loading: false });
    }
  },
}));

export default usePopularMoviesStore;
