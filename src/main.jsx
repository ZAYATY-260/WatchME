import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import MovieDetail from "./pages/MovieDetail";
import SearchResults from "./pages/SearchResults";
import TvShowDetail from "./pages/TvShowDetails";
import AllMoviesPage from "./pages/AllMovies";
import MyMovieListPage from "./pages/MyMovieListPage";
import AllShowsPage from "./pages/AllTvShows";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/movies" element={<AllMoviesPage />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
       <Route path="/tv/:id" element={<TvShowDetail />} />
      <Route path="/Tv Shows" element={<AllShowsPage />} />
      <Route path="/mylist" element={<MyMovieListPage />} />
      <Route path="/search" element={<SearchResults />} />

    </Routes>
  </BrowserRouter>
);
