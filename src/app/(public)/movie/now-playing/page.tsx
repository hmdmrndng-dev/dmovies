import { tmdb } from "@/lib/tmdb";
import Movies from "../Movies";

export default async function Page() {
  const [setMovies] = await Promise.all([
    tmdb.get(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`,
    ),
  ]);
  const getMovies = setMovies.data.results || [];
  const getPages = setMovies.data.total_pages || 1;
  return (
    <Movies
      headers="Now Playing"
      data={getMovies}
      totalPages={getPages}
      endpoint="/api/movie/now-playing"
    />
  );
}
