import { useEffect, useRef, useState } from "react";
import { fetchTrendingMovies } from "./api/trending_movie";
import Topbar from "./components/Topbar";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingMovies().then(setMovies).catch(console.error);
  }, []);

  const scroll = (direction) => {
    const container = carouselRef.current;
    const scrollAmount = 300;

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const heroMovie = movies.length > 0 ? movies[0] : null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // optionally clear search input after redirect
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Topbar />
      {/* Hero Banner */}
      {heroMovie && (
        <section
          className="relative h-[85vh] bg-cover bg-center flex items-center px-8"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative max-w-7xl z-10 text-white flex justify-between items-start w-full">
            {/* Left side: movie info */}
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">{heroMovie.title}</h1>
              <p className="max-w-xl mb-6 line-clamp-3">{heroMovie.overview}</p>

              <button className="flex items-center bg-black hover:bg-red-700 px-6 py-3 rounded font-semibold text-lg transition">
                <Play className="mr-2" />
                Play
              </button>
            </div>

            {/* Right side: search bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-black bg-opacity-50 rounded overflow-hidden"
              style={{ minWidth: "300px" }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="px-4 py-2 bg-transparent text-white placeholder-gray-300 focus:outline-none w-full"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 font-semibold"
                aria-label="Search"
              >
                Search
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Trending Movies Section */}
      <section className="px-6 py-6 relative">
        <h2 className="text-2xl font-bold mb-4">Trending Now</h2>

        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-2 rounded-full hover:bg-black hidden md:block"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto space-x-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="snap-start flex-shrink-0 w-[220px] rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-100 hover:scale-95 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-tr from-gray-900/80 to-gray-800/70"
            >
              <div className="relative overflow-hidden rounded-t-xl h-[320px]">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
                <span className="absolute top-3 left-3 z-20 inline-flex items-center bg-yellow-500 text-black rounded-full px-3 py-1 font-semibold shadow">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.388-2.455a1 1 0 00-1.175 0l-3.388 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.047 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
                  </svg>
                  {movie.vote_average.toFixed(1)}
                </span>
                <div className="absolute inset-0 bg-black bg-opacity-80 text-gray-200 p-4 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center text-sm rounded-t-xl pointer-events-none hover:pointer-events-auto">
                  <p className="line-clamp-5">{movie.overview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-2 rounded-full hover:bg-black hidden md:block"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </section>
    </div>
  );
}

export default App;
