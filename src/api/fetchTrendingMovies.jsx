import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchTrendingMovies = async () => {
  const res = await axios.get(`${BASE_URL}/trending/movie/week`, {
    params: { api_key: API_KEY },
  });
  return res.data.results;
};

export const fetchUpcomingMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/upcoming`, {
    params: { api_key: API_KEY, language: "en-US", page: 1 },
  });
  return res.data.results;
};


export const fetchTopRatedMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/top_rated`, {
    params: { api_key: API_KEY, language: "en-US", page: 1 },
  });
  return res.data.results;
};

export const fetchPopularMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/popular`, {
    params: { api_key: API_KEY, language: "en-US", page: 1 },
  });
  return res.data.results;
};

