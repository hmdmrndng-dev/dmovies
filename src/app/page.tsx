import Upcoming from "@/components/home/sections/Upcoming";
import Trending from "@/components/home/sections/Trending";
import { tmdb } from "@/lib/tmdb";
import OnTheAir from "@/components/home/sections/OnTheAir";

export default async function Page() {
  const [popular, genres] = await Promise.all([
    tmdb.get("https://api.themoviedb.org/3/trending/all/day?language=en-US"),
    tmdb.get("https://api.themoviedb.org/3/genre/movie/list?language=en-US"),
  ]);
  const data = popular.data;
  const genresData = genres.data.genres;

  const [upcoming] = await Promise.all([
    tmdb.get(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
    ),
  ]);
  const upcomingData = upcoming.data;

  const [onTheAir] = await Promise.all([
    tmdb.get(
      "https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1",
    ),
  ]);
  const onTheAirData = onTheAir.data;

  return (
    <>
      <Trending initialDatas={data} genres={genresData} />
      <Upcoming initialDatas={upcomingData} />
      <OnTheAir initialDatas={onTheAirData} />
    </>
  );
}
