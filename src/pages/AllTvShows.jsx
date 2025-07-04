import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";

// TMDB Bearer token from your example
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OWUzZWE0ZDY1OTc4MjE5NzFjOTE3M2RlZGVhZmUwMCIsIm5iZiI6MTc1MTQ5MzQxNy4xMDQsInN1YiI6IjY4NjVhYjI5NDJiNGZlOWM3YzhmMWE0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WDJ-llzTQk0ynlmWP8iDlQN3SMJl5kYNy3lug1K2YyI";

const BASE_URL = "https://api.themoviedb.org/3";

// Fetch TV genres dynamically
const fetchGenres = async () => {
  const res = await axios.get(`${BASE_URL}/genre/tv/list`, {
    headers: { Authorization: AUTH_TOKEN },
    params: { language: "en-US" },
  });
  return res.data.genres;
};

// Fetch TV shows with filters and pagination
const fetchShowsPage = async (page, genreId, year, minRating) => {
  const params = {
    language: "en-US",
    page,
    sort_by: "popularity.desc",
    include_adult: false,
    include_null_first_air_dates: false,
  };

  if (genreId) params.with_genres = genreId;
  if (year) params.first_air_date_year = year;
  if (minRating) params["vote_average.gte"] = minRating;

  const res = await axios.get(`${BASE_URL}/discover/tv`, {
    params,
    headers: { Authorization: AUTH_TOKEN },
  });
  return res.data;
};

const AllShowsPage = () => {
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [minRating, setMinRating] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Years list (last 30 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch(() => setError("Failed to load TV genres."));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchShowsPage(page, selectedGenre, selectedYear, minRating)
      .then((data) => {
        setShows(data.results);
        setTotalPages(data.total_pages);
      })
      .catch(() => setError("Failed to load TV shows."))
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

  const ShowCard = ({ show }) => {
    const posterUrl = show.poster_path
      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    return (
      <div
        key={show.id}
        onClick={() => navigate(`/tv/${show.id}`)}
        className="cursor-pointer rounded-md overflow-hidden shadow-md bg-gray-900 hover:shadow-2xl transform hover:scale-105 transition duration-300"
      >
        <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden rounded-md">
          <img
            src={posterUrl}
            alt={show.name}
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
      <h1 className="text-3xl mb-6 font-bold mt-16">All TV Shows</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
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
      {loading && <p>Loading TV shows...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Shows grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {shows.length === 0 && !loading && <p>No TV shows found.</p>}
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} />
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

export default AllShowsPage;
