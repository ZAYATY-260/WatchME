import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const query = useQuery().get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/search/movie`, {
          params: { api_key: apiKey, query, language: "en-US", include_adult: false },
        });
        setResults(res.data.results || []);
      } catch (err) {
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, apiKey]);

  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black px-6">
        <p className="text-xl font-medium">Please enter a search query.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 md:px-8 py-10 w-full">
      <h1 className="text-4xl font-extrabold mb-8">
        Search Results for <span className="text-red-600">"{query}"</span>
      </h1>

      {loading && <p className="text-lg text-gray-400">Loading...</p>}
      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="text-gray-400 text-lg">No movies found matching your search.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {results.map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            title={movie.title}
            className="cursor-pointer rounded-lg overflow-hidden shadow-md bg-gray-900 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 flex flex-col"
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-56 sm:h-64 md:h-72 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-56 sm:h-64 md:h-72 bg-gray-800 flex items-center justify-center text-gray-500 font-semibold text-sm">
                No Image
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
