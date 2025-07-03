import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const [movie, setMovie] = useState(null);
  const [imdbId, setImdbId] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [selectedServer, setSelectedServer] = useState("vidsrc");

  // Servers array with dynamic URLs
  const servers = [
    {
      key: "vidsrc",
      name: "VidSrc",
      getUrl: (tmdbId) => `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}&autoplay=1`,
    },
    {
      key: "godrive",
      name: "GoDrivePlayer",
      getUrl: (imdb) => `https://godriveplayer.com/player.php?imdb=${imdb}`,
      requiresImdb: true, // flag that this needs imdb id
    },
    // Add more servers here if needed
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/movie/${id}`, {
          params: { api_key: apiKey, language: "en-US" },
        });
        setMovie(res.data);
        setImdbId(res.data.imdb_id); // Save imdb_id for GoDrivePlayer
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCredits = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/movie/${id}/credits`, {
          params: { api_key: apiKey },
        });

        const directors = res.data.crew.filter(
          (member) => member.job === "Director"
        );
        setDirector(directors[0] || null);
        setCast(res.data.cast.slice(0, 6)); // top 6 cast
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTrailer = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/movie/${id}/videos`, {
          params: { api_key: apiKey, language: "en-US" },
        });

        const trailers = res.data.results.filter(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer"
        );
        if (trailers.length > 0) {
          setTrailerUrl(`https://www.youtube.com/embed/${trailers[0].key}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSimilar = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/movie/${id}/similar`, {
          params: { api_key: apiKey, language: "en-US", page: 1 },
        });
        setSimilarMovies(res.data.results || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetails();
    fetchCredits();
    fetchTrailer();
    fetchSimilar();
  }, [id, apiKey]);

  if (!movie)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-xl">
        Loading...
      </div>
    );

  // Filter servers for availability based on imdbId presence
  const availableServers = servers.filter(
    (s) => !s.requiresImdb || (s.requiresImdb && imdbId)
  );

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background image + overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-50"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-75"></div>

      {/* Content container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex flex-col min-h-screen">

        {/* Top bar: X button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate(-1)}
            aria-label="Close"
            className="text-white text-3xl font-bold hover:text-red-600 transition"
          >
            &times;
          </button>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">{movie.title}</h1>

        {/* Description */}
        <p className="max-w-3xl mb-6 text-lg leading-relaxed drop-shadow-md">
          {movie.overview}
        </p>

        {/* Details: genres, director, cast */}
        <div className="flex flex-wrap gap-6 mb-10 max-w-3xl">
          <div>
            <span className="font-semibold">Genres: </span>
            {movie.genres.map((g) => g.name).join(", ")}
          </div>
          {director && (
            <div>
              <span className="font-semibold">Director: </span>
              {director.name}
            </div>
          )}
          <div>
            <span className="font-semibold">Cast: </span>
            {cast.map((c) => c.name).join(", ")}
          </div>
          <div>
            <span className="font-semibold">Release Date: </span>
            {movie.release_date}
          </div>
          <div>
            <span className="font-semibold">Runtime: </span>
            {movie.runtime} min
          </div>
        </div>

        {/* Trailer */}
        <div className="mb-12 max-w-4xl rounded overflow-hidden shadow-lg aspect-w-16 aspect-h-9 mx-auto">
          {trailerUrl ? (
            <iframe
              src={trailerUrl}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <p className="text-gray-400 text-center">Trailer not available.</p>
          )}
        </div>
{/* Watch Movie Section */}
{/* Watch Movie Section */}
<section className="mt-10 mb-10 px-4">
  <h2 className="text-2xl font-semibold mb-4 max-w-screen-xl mx-auto">Watch Movie</h2>

  {/* Server Selection Buttons */}
  <div className="flex space-x-4 mb-4 max-w-screen-xl mx-auto px-4">
    {availableServers.map((server) => (
      <button
        key={server.key}
        onClick={() => setSelectedServer(server.key)}
        className={`px-4 py-2 rounded font-semibold border transition ${
          selectedServer === server.key
            ? "bg-red-600 text-white border-red-600"
            : "bg-black text-gray-300 border-gray-700 hover:border-gray-500"
        }`}
      >
        {server.name}
      </button>
    ))}
  </div>

  {/* Video iframe with 16:9 aspect ratio, wider max width */}
  <div className="aspect-w-16 aspect-h-9 rounded overflow-hidden shadow-lg max-w-screen-xl mx-auto">
    <iframe
      key={selectedServer} // reload iframe on server change
      src={
        selectedServer === "godrive"
          ? servers.find((s) => s.key === selectedServer).getUrl(imdbId)
          : servers.find((s) => s.key === selectedServer).getUrl(id)
      }
      title={`${movie.title} - Watch (${selectedServer})`}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className="w-full h-full border-none"
    />
  </div>
</section>


        {/* Like This Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6">More Like This</h2>
          {similarMovies.length === 0 ? (
            <p className="text-gray-400">No similar movies found.</p>
          ) : (
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2">
              {similarMovies.map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => navigate(`/movie/${sim.id}`)}
                  className="flex-shrink-0 w-36 cursor-pointer rounded-md overflow-hidden shadow-lg hover:scale-105 transition-transform"
                  title={sim.title}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${sim.poster_path}`}
                    alt={sim.title}
                    className="w-full h-52 object-cover"
                  />
                  <div className="text-sm mt-1 truncate px-1">{sim.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating & footer info */}
        <footer className="mt-auto pt-10 border-t border-gray-700 max-w-3xl">
          <div className="flex flex-wrap gap-8 text-gray-300 text-sm">
            <div>
              <span className="font-semibold text-white">Rating:</span>{" "}
              {movie.vote_average.toFixed(1)} / 10
            </div>
            <div>
              <span className="font-semibold text-white">Votes:</span>{" "}
              {movie.vote_count.toLocaleString()}
            </div>
            <div>
              <span className="font-semibold text-white">Status:</span> {movie.status}
            </div>
            <div>
              <span className="font-semibold text-white">Original Language:</span>{" "}
              {movie.original_language.toUpperCase()}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
