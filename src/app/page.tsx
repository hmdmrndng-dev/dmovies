import Trending from "@/components/home/sections/Trending";
import { tmdb } from "@/lib/tmdb";

export default async function Page() {
  const [popular, genres] = await Promise.all([
    tmdb.get("https://api.themoviedb.org/3/trending/all/day?language=en-US"),
    tmdb.get("https://api.themoviedb.org/3/genre/movie/list?language=en-US"),
  ]);
  const data = popular.data;
  const genresData = genres.data.genres;
  return <Trending initialDatas={data} genres={genresData} />;
}
