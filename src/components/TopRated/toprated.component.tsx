import { useEffect } from "react";
import { Link } from "react-router-dom";
import useTopRatedMoviesStore from "../../store/topRatedMoviesStore";

const TopRatedComponent = () => {
  const {
    movies,
    loading,
    error,
    fetchTopRatedMovies,
    currentPage,
    totalPages,
  } = useTopRatedMoviesStore();

  useEffect(() => {
    fetchTopRatedMovies(currentPage); // Fetch movies for the current page
  }, [currentPage, fetchTopRatedMovies]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      <h1 className="my-5 text-4xl font-bold text-yellow-300 text-center">
        Top Rated Movies
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {movies.map((movie) => (
          <Link to={`/topratedmovies/${movie.id}`} key={movie.id}>
            <div className="rounded-lg shadow-md p-4 cursor-pointer">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-96 rounded-lg bg-center"
                style={{
                  objectFit: "cover", // Ensures the image fills the card properly
                }}
              />
              <h1 className="text-xl font-semibold mt-4 text-center">
                {movie.title}
              </h1>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center items-center">
        <div className="btn-group">
          <button
            className="btn bg-yellow-300 text-black"
            onClick={() => fetchTopRatedMovies(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button className="btn btn-outline">{currentPage}</button>
          <button
            className="btn bg-yellow-300 text-black"
            onClick={() =>
              fetchTopRatedMovies(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopRatedComponent;
