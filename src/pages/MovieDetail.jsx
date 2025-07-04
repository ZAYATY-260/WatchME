import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
      requiresImdb: true,
    },
  ];

  const handleBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate("/");
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/movie/${id}`, {
          params: { api_key: apiKey, language: "en-US" },
        });
        setMovie(res.data);
        setImdbId(res.data.imdb_id);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCredits = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/movie/${id}/credits`, {
          params: { api_key: apiKey },
        });

        const directors = res.data.crew.filter((m) => m.job === "Director");
        setDirector(directors[0] || null);
        setCast(res.data.cast.slice(0, 15));
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

  const availableServers = servers.filter(
    (s) => !s.requiresImdb || (s.requiresImdb && imdbId)
  );

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-60"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex justify-between mb-6 items-center">
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 font-semibold rounded"
          >
            Back Home
          </button>
          <button
            onClick={handleBack}
            className="text-white text-3xl font-bold hover:text-red-600 transition"
          >
            &times;
          </button>
        </div>

        {/* Title + Overview */}
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">{movie.title}</h1>
        <p className="max-w-3xl mb-6 text-lg leading-relaxed drop-shadow-md">{movie.overview}</p>

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

        {/* Details */}
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
            <span className="font-semibold">Release Date: </span>
            {movie.release_date}
          </div>
          <div>
            <span className="font-semibold">Runtime: </span>
            {movie.runtime} min
          </div>
        </div>

        {/* Top Cast Carousel with Swiper */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Top Cast</h2>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
          >
            {cast.map((actor) => (
              <SwiperSlide key={actor.id}>
                <div className="w-full cursor-pointer transform hover:scale-105 transition-transform duration-300">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "https://via.placeholder.com/185x278?text=No+Image"
                    }
                    alt={actor.name}
                    className="rounded-lg object-cover w-full h-48"
                  />
                  <p className="mt-2 text-center text-sm truncate">{actor.name}</p>
                  <p className="text-center text-xs text-gray-400 truncate">
                    {actor.character}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Watch Movie */}
        <section className="mb-10 px-4">
          <h2 className="text-2xl font-semibold mb-4 max-w-screen-xl mx-auto">Watch Movie</h2>

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

          <div className="aspect-w-16 aspect-h-9 rounded overflow-hidden shadow-lg max-w-screen-xl mx-auto">
            <iframe
              key={selectedServer}
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

        {/* Similar Movies Carousel with Swiper */}
        <div>
          <h2 className="text-3xl font-bold mb-6">More Like This</h2>
          {similarMovies.length === 0 ? (
            <p className="text-gray-400">No similar movies found.</p>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={20}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 6 },
              }}
            >
              {similarMovies.map((sim) => (
                <SwiperSlide key={sim.id}>
                  <div
                    onClick={() => navigate(`/movie/${sim.id}`)}
                    className="cursor-pointer rounded-md overflow-hidden shadow-lg hover:scale-105 transition-transform"
                    title={sim.title}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w300${sim.poster_path}`}
                      alt={sim.title}
                      className="w-full h-52 object-cover"
                    />
                    <div className="text-sm mt-1 truncate px-1">{sim.title}</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}
