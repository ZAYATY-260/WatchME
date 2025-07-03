import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
export async function fetchMovieDetails(id) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export const fetchTrendingMovies = async () => {
  const res = await axios.get(`${BASE_URL}/trending/movie/week`, {
    params: { api_key: API_KEY, language: "en-US" ,include_video: "true" },
  });
  return shuffleArray(res.data.results);
};

export const fetchUpcomingMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/upcoming`, {
    params: { api_key: API_KEY, language: "en-US" ,include_video: "true"},
  });
  return shuffleArray(res.data.results);
};

export const fetchTopRatedMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/top_rated`, {
    params: { api_key: API_KEY, language: "en-US" , include_video: "true"},
  });
  return shuffleArray(res.data.results);
};

export const fetchPopularOnTV = async () => {
  const res = await axios.get(`${BASE_URL}/discover/tv`, {
    params: { api_key: API_KEY, language: "en-US" ,include_video: "true"},
  });
  return shuffleArray(res.data.results);
};
