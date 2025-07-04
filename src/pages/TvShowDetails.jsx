import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const EPISODES_PER_PAGE = 8;

export default function TvShowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const [show, setShow] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tv/${id}`, {
          params: { api_key: apiKey, language: "en-US" },
        });
        setShow(res.data);
        setSeasons(res.data.seasons);
      } catch (err) {
        console.error(err);
      }
    };
    fetchShow();
  }, [id, apiKey]);

  useEffect(() => {
    if (selectedSeason !== null) {
      const fetchSeason = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/tv/${id}/season/${selectedSeason}`, {
            params: { api_key: apiKey, language: "en-US" },
          });
          setEpisodes(res.data.episodes);
          setPage(1);
        } catch (err) {
          console.error(err);
        }
      };
      fetchSeason();
    }
  }, [selectedSeason, id, apiKey]);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tv/${id}/videos`, {
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
    fetchTrailer();
  }, [id, apiKey]);

  if (!show)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-xl">
        Loading...
      </div>
    );

  const totalPages = Math.ceil(episodes.length / EPISODES_PER_PAGE);
  const displayedEpisodes = episodes.slice(
    (page - 1) * EPISODES_PER_PAGE,
    page * EPISODES_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3a0a0a] via-[#1e0101] to-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-white font-semibold bg-black hover:bg-gray-800 px-4 py-2 rounded shadow"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">{show.name}</h1>
        <p className="mb-6 text-gray-100 max-w-3xl text-lg leading-relaxed">{show.overview}</p>

        {trailerUrl && (
          <div className="mb-12 max-w-4xl rounded overflow-hidden shadow-lg aspect-w-16 aspect-h-9 mx-auto">
            <iframe
              src={trailerUrl}
              title={`${show.name} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* Season selection */}
        <div className="mb-10">
          <label htmlFor="season" className="block mb-2 font-semibold text-lg">
            📺 Select a Season:
          </label>
          <select
            id="season"
            value={selectedSeason || ""}
            onChange={(e) => {
              setSelectedSeason(Number(e.target.value));
              setSelectedEpisode(null);
            }}
            className="bg-black text-white px-4 py-2 rounded w-full sm:w-64 border border-gray-700"
          >
            <option value="">-- Choose Season --</option>
            {seasons.map((s) => (
              <option key={s.season_number} value={s.season_number}>
                Season {s.season_number}
              </option>
            ))}
          </select>
        </div>

        {/* Episodes grid */}
        {displayedEpisodes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
            {displayedEpisodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => setSelectedEpisode(ep)}
                className={`bg-black bg-opacity-60 rounded-lg p-4 shadow-md cursor-pointer hover:scale-105 transition-transform duration-300 ${
                  selectedEpisode?.id === ep.id ? "border-2 border-yellow-400" : ""
                }`}
              >
                <h3 className="font-bold text-md mb-1 truncate">
                  S{selectedSeason}E{ep.episode_number}: {ep.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-3">{ep.overview}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {episodes.length > EPISODES_PER_PAGE && (
          <div className="flex justify-center items-center gap-4 mb-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-white">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Selected episode stream */}
        {selectedEpisode && (
          <div className="my-12">
            <h2 className="text-2xl font-bold mb-4">
              🎬 Streaming: Season {selectedSeason} Episode {selectedEpisode.episode_number} - {selectedEpisode.name}
            </h2>
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <iframe
                src={`https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${selectedSeason}&episode=${selectedEpisode.episode_number}&autoplay=1`}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full h-full border-none"
                title={`S${selectedSeason}E${selectedEpisode.episode_number}`}
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}