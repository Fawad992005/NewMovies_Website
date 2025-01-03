import { useEffect, useState } from "react";
import {
  getWatchlist,
  addToWatchlist,
} from "../../utils/firebase/firebase.utils";
import useUserStore from "../../store/userstore";

interface MovieDetails {
  title: string;
  status: string; // You can add more status types if needed
  poster_path: string;
  addedAt: string; // You can use Date type if you want to work with date objects
}

// Define the structure of the watchlist state
interface Watchlist {
  [movieId: string]: MovieDetails; // The key is a movieId (string) and the value is the movie details object
}

const Watchlist = () => {
  const { user } = useUserStore();
  const [watchlist, setWatchlist] = useState<Watchlist>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        const watchlistData = await getWatchlist(user.uid);
        setWatchlist(watchlistData || {});
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [user]);

  const handleStatusChange = async (movieId: string, newStatus: string) => {
    if (!user || !movieId) return;

    const movieData = watchlist[movieId];
    const updatedMovieData: MovieDetails = { ...movieData, status: newStatus };

    try {
      await addToWatchlist(user.uid, movieId, updatedMovieData); // Update the status in Firestore
      setWatchlist((prevState: Watchlist) => ({
        ...prevState,
        [movieId]: updatedMovieData, // Update status locally
      }));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}
      <h1 className="my-5 text-4xl font-bold text-yellow-300 text-center">
        Your Watchlist
      </h1>

      {/* Display a message if the watchlist is empty */}
      {Object.keys(watchlist).length === 0 ? (
        <p className="text-center text-xl text-gray-500">
          Your watchlist is empty. Add some movies to your watchlist!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-2">
          {Object.keys(watchlist).map((movieId) => {
            const movie = watchlist[movieId];
            return (
              <div
                key={movieId}
                className="p-4 border-black border bg-gray-950 rounded-lg shadow-sm"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-60 object-cover mb-4"
                />
                <h2 className="text-3xl font-semibold">{movie.title}</h2>
                <p
                  className={`text-xl ${
                    movie.status === "Completed"
                      ? "text-green-500"
                      : "text-yellow-200"
                  }`}
                >
                  Status: {movie.status}
                </p>

                <div className="mt-4">
                  <label htmlFor={`status-${movieId}`} className="mr-2">
                    Change Status:
                  </label>
                  <select
                    id={`status-${movieId}`}
                    value={movie.status}
                    onChange={(e) =>
                      handleStatusChange(movieId, e.target.value)
                    }
                    className="px-2 py-1 border rounded-lg cursor-pointer"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Watching">Watching</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
