import { useState, useEffect } from "react";
import axios from "../../utils/axios/axios"; // Ensure this points to your axios instance
import { Link } from "react-router-dom";
import { Movie } from "../../store/topRatedMoviesStore";

const SearchComponent = () => {
  const [query, setQuery] = useState(""); // Search query state
  const [searchResults, setSearchResults] = useState<Movie[]>([]); // To store search results
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(""); // Error handling

  const handleSearch = async () => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get("search/movie", {
        params: {
          query: query,
          region: "US",
          language: "en-US",
        },
      });
      setSearchResults(response.data.results); // Store the search results
      setError("");
    } catch (err) {
      setError("Failed to fetch search results.");
      setSearchResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch();
    }, 500); // Debounce the search to avoid calling the API too frequently
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-center text-yellow-300 mt-14">
          Search For A Movie
        </h1>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded-lg my-5 w-1/2 text-white"
        />
      </div>

      {error && <div className="mt-5">{error}</div>}
      <div className="mt-4">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}
        {searchResults.length > 0 && !loading ? (
          <div>
            <h2 className="text-yellow-300 text-2xl ml-4 font-bold">
              Search Results:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((movie) => (
                <Link to={`/movie/${movie.id}`} key={movie.id}>
                  <div className="rounded-lg shadow-md p-4 cursor-pointer">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-96 rounded-lg bg-center"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <h1 className="text-xl font-semibold mt-4 text-center">
                      {movie.title}
                    </h1>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-xl text-yellow-300">
            No search results found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
