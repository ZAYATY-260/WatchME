import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Fetch genres dynamically
const fetchGenres = async () => {
  const res = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: { api_key: API_KEY, language: "en-US" },
  });
  return res.data.genres;
};

// Fetch movies with filters and pagination
const fetchMoviesPage = async (page, genreId, year, minRating) => {
  const params = {
    api_key: API_KEY,
    language: "en-US",
    page,
    sort_by: "popularity.desc",
  };

  if (genreId) params.with_genres = genreId;
  if (year) params.primary_release_year = year;
  if (minRating) params["vote_average.gte"] = minRating;

  const res = await axios.get(`${BASE_URL}/discover/movie`, { params });
  return res.data;
};

const AllMoviesPage = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [minRating, setMinRating] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch(() => setError("Failed to load genres."));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMoviesPage(page, selectedGenre, selectedYear, minRating)
      .then((data) => {
        setMovies(data.results);
        setTotalPages(data.total_pages);
      })
      .catch(() => setError("Failed to load movies."))
      .finally(() => setLoading(false));
  }, [page, selectedGenre, selectedYear, minRating]);

  const onGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setPage(1);
  };
  const onYearChange = (e) => {
    setSelectedYear(e.target.value);
    setPage(1);
  };
  const onRatingChange = (e) => {
    setMinRating(e.target.value);
    setPage(1);
  };

  // List of years (last 30 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Netflix style movie card
  const MovieCard = ({ movie }) => {
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    return (
      <div
        key={movie.id}
        onClick={() => navigate(`/movie/${movie.id}`)}
        className="cursor-pointer rounded-md overflow-hidden shadow-md bg-gray-900 hover:shadow-2xl transform hover:scale-105 transition duration-300"
      >
        <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden rounded-md">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
            loading="lazy"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Topbar />
      <h1 className="text-3xl mb-6 font-bold mt-16">All Movies</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        {/* Genre */}
        <select
          value={selectedGenre}
          onChange={onGenreChange}
          className="bg-gray-800 rounded px-3 py-2 text-white"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          value={selectedYear}
          onChange={onYearChange}
          className="bg-gray-800 rounded px-3 py-2 text-white"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Minimum rating */}
        <select
          value={minRating}
          onChange={onRatingChange}
          className="bg-gray-800 rounded px-3 py-2 text-white"
        >
          <option value="">Any Rating</option>
          {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating}+
            </option>
          ))}
        </select>
      </div>

      {/* Loading/Error */}
      {loading && <p>Loading movies...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Movies grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.length === 0 && !loading && <p>No movies found.</p>}
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          className={`px-6 py-2 rounded ${
            page === 1 || loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          } font-semibold`}
        >
          Prev
        </button>

        <span className="text-white font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={page === totalPages || loading}
          className={`px-6 py-2 rounded ${
            page === totalPages || loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          } font-semibold`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllMoviesPage;
