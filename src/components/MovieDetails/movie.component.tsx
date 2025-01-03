import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../utils/axios/axios";
import { Movie } from "../../store/popularMoviesStore";
import { addToWatchlist } from "../../utils/firebase/firebase.utils";
import useUserStore from "../../store/userstore";

interface ExtendedMovie extends Movie {
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
    title: string;
  }>;
}

const MovieDetailsComponent = () => {
  const { user } = useUserStore();
  const { movieId } = useParams();
  const [movie, setMovie] = useState<ExtendedMovie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`movie/${movieId}`, {
          params: { api_key: import.meta.env.VITE_TMDB_API_KEY },
        });
        setMovie(response.data);

        setLoading(false);
      } catch (err) {
        setError("Failed to load movie details.");
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const showToast = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
  };

  const handleAddToWatchlist = async () => {
    if (!user) {
      alert("Please sign in to add movies to your watchlist.");
      return;
    }

    const movieData = {
      title: movie?.title || "",
      status: "Planned", // Default status
      poster_path: movie?.poster_path || "",
    };

    try {
      await addToWatchlist(user.uid, movieId!, movieData);
      showToast(`${movie?.title} has been added to your watchlist.`, "success");
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
    }
  };

  if (loading) return <div>Loading movie details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {toast && (
        <div className={`toast toast-end `}>
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
      {movie ? (
        <div className="p-6  rounded-lg shadow-lg">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-96 rounded-lg mb-4"
            style={{ objectFit: "cover", backgroundPosition: "center" }}
          />
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-white mt-2">{movie.overview}</p>
          <p className="text-sm text-gray-300 mt-2">
            Release Date: {movie.release_date}
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Ratings: {movie.vote_average}/10 ({movie.vote_count} votes)
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Runtime: {movie.runtime} minutes
          </p>
          <div className="flex gap-4 mt-4">
            <button
              className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg"
              onClick={handleAddToWatchlist}
            >
              Add to Watchlist
            </button>
          </div>
          <h1 className="text-2xl font-bold my-5">Production Companies</h1>
          <div className="flex-wrap gap-5 md:flex">
            {movie.production_companies.map((company) => (
              <div key={company.id} className="flex items-center gap-4 mt-4">
                <img
                  src={`https://image.tmdb.org/t/p/w500${company.logo_path}`}
                  alt={company.name}
                  className="w-16 h-16"
                />
                <div>
                  <h1 className="text-xl font-semibold">{company.name}</h1>
                  <p className="text-gray-500">{company.origin_country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>Movie not found.</div>
      )}
    </div>
  );
};

export default MovieDetailsComponent;
