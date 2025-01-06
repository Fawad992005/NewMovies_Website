import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import useNowPlayingStore from "../../store/nowplayingmovies";
import { Movie } from "../../store/nowplayingmovies";
import axios from "../../utils/axios/axios";

interface MovieImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: string;
  vote_average: number;
  vote_count: number;
  width: number;
  poster_path: string;
}

const Directory = () => {
  const { fetchNowPlayingMovies, movies, loading, error } =
    useNowPlayingStore();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [DefaultImage, setDefaultImage] = useState<MovieImage | null>(null);

  // Fetch movies when the component mounts
  useEffect(() => {
    console.log("render");
    fetchNowPlayingMovies();
  }, [fetchNowPlayingMovies]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`movie/1241982`, {
          params: {
            region: "US",
            api_key: import.meta.env.VITE_TMDB_API_KEY,
          },
        });
        setDefaultImage(response.data);
      } catch (err) {
        console.log("Error fetching images");
      }
    };
    fetchImage();
  }, []);

  if (loading)
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div
      className="relative"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${
          selectedMovie?.poster_path ||
          `https://image.tmdb.org/t/p/original/${DefaultImage?.poster_path}`
        })`,
        backgroundSize: "cover", // Ensures the background image covers the entire div
        backgroundPosition: "center", // Centers the image
        backgroundRepeat: "no-repeat",
        transition: "background-image 0.5s ease-in-out",
        width: "100%",
        height: "93vh",
      }}
    >
      <div>
        {selectedMovie && (
          <div
            className="absolute top-6 left-0 w-100% flex items-center justify-center md:top-28 md:left-28 md:w-2/5 bg-gray-900 bg-opacity-25 py-5 rounded-lg mx-1"
            onClick={() => setSelectedMovie(null)} // Remove selected movie on click
          >
            <div className="text-white text-center flex flex-col gap-3">
              <h2 className="text-2xl font-semibold md:text-4xl">
                {selectedMovie.title}
              </h2>
              <div className="flex justify-center items-center gap-5">
                <p className="text-lg md:text-xl">
                  Rating: {selectedMovie.vote_average}/10
                </p>
                <p className="text-lg md:text-xl">
                  Runtime: {selectedMovie.runtime} minutes
                </p>
              </div>

              <p className="text-base md:text-lg">
                {selectedMovie.overview.split(" ").slice(0, 30).join(" ")}...
              </p>
              <div className="flex justify-center items-center gap-14">
                <button className="py-2 border rounded-lg px-5 bg-yellow-300 text-black border-black ">
                  Watch Trailer
                </button>
                <button className="p-2 border border-black rounded-lg px-5 bg-yellow-300 text-black">
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Swiper Slider */}
      <Swiper
        spaceBetween={10}
        slidesPerView={4}
        loop={true}
        loopAdditionalSlides={4}
        pagination={{ clickable: true }}
        breakpoints={{
          320: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div
              className="movie-card"
              onClick={() => setSelectedMovie(movie)} // Set selected movie on click
              style={{
                cursor: "pointer",
                padding: "10px", // Adds padding for spacing
                borderRadius: "10px", // Rounded corners for the card
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-96 rounded-lg bg-center"
                style={{
                  objectFit: "contain", // Ensures the image fills the card properly
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style>
        {`
          .swiper {
            position: fixed;
            bottom: 40px;
            left: 0;
            right: 0;
            z-index: 20;
            
          }
            .swiper-slide {
            width: auto; // Ensure slides are only as wide as their content
          }
             @media (max-width: 768px) {
                 .swiper {
                    bottom: -34px; 
                    }
        `}
      </style>
    </div>
  );
};

export default Directory;
