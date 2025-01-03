// src/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY, // Make sure to replace with your TMDb API key
  },
});

export default instance;
