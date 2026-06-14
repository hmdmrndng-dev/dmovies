import axios from 'axios';

const TMDB_TOKEN = process.env.TMDB_API_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_TOKEN}`, 
  },
});