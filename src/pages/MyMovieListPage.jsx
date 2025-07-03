import React, { useEffect, useState } from "react";
import useFavorites from "../hook/useFavorites";
import { useNavigate } from "react-router-dom";
import { fetchMovieDetails } from "../api/TMDB";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

function MyMovieListPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { message, type }
  const navigate = useNavigate();

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteMovies([]);
      return;
    }

    setLoading(true);
    Promise.all(favorites.map((id) => fetchMovieDetails(id)))
      .then((movies) => {
        setFavoriteMovies(movies);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching favorite movies:", error);
        setFeedback({ message: "Failed to load favorite movies", type: "error" });
        setLoading(false);
      });
  }, [favorites]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleToggleFavorite = (id) => {
    toggleFavorite(id);
    const isFav = favorites.includes(id);
    setFeedback({
      message: isFav ? "Removed from favorites" : "Added to favorites",
      type: isFav ? "error" : "success",
    });
  };

  return (
    <>
      <Topbar />

      {/* Loading bar */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-50"></div>
      )}

      <div className="flex flex-col min-h-screen bg-black text-white">
        <main className="flex-grow pt-24 pb-10 px-6 sm:px-10 max-w-[1200px] mx-auto">
          <h1 className="text-4xl font-extrabold mb-10 border-b border-gray-700 pb-4 text-center mt-8">
            My Favorite Movies
          </h1>

          {loading ? (
            <div className="flex justify-center items-center text-lg font-medium py-20">
              Loading favorite movies...
            </div>
          ) : favoriteMovies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-gray-400 text-lg font-semibold">
              You have no favorite movies yet.
            </div>
          ) : (
            <div
              className="grid grid-cols-5 gap-8 mx-auto"
              style={{ width: 1100 }}
            >
              {favoriteMovies.map((movie) => {
                const isFavorite = favorites.includes(movie.id);
                return (
                  <div
                    key={movie.id}
                    className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-4xl hover:-translate-y-1 bg-gradient-to-tr from-gray-900/90 to-gray-800/80"
                    style={{ width: 220, height: 320 }}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-3">
                      <h3 className="text-sm font-semibold truncate text-white drop-shadow-lg">
                        {movie.title}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(movie.id);
                      }}
                      className="absolute top-3 right-3 bg-black bg-opacity-70 hover:bg-opacity-90 text-red-500 rounded-full p-2 shadow-lg transition-colors"
                      aria-label={
                        isFavorite ? "Remove from favorites" : "Add to favorites"
                      }
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {isFavorite ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 fill-current"
                          viewBox="0 0 24 24"
                          stroke="none"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Notification Toast */}
      {feedback && !loading && (
        <div
          className={`fixed top-5 right-5 px-5 py-3 rounded-md text-white shadow-lg transition-opacity duration-500
            ${feedback.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          style={{ zIndex: 1000 }}
        >
          {feedback.message}
        </div>
      )}
    </>
  );
}

export default MyMovieListPage;
