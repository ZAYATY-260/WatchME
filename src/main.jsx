import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import MovieDetail from "./pages/MovieDetail";
import SearchResults  from "./pages/SearchResults";
import AllMoviesPage   from "./pages/AllMovies";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
        <Route path="/movies" element={<AllMoviesPage />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/search" element={<SearchResults />} />
      
    </Routes>
  </BrowserRouter>
);
