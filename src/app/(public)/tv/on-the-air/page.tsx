import { tmdb } from "@/lib/tmdb";
import Tvs from "../Tvs";

export default async function Page() {
  const [setTvs] = await Promise.all([
    tmdb.get(`https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1`),
  ]);
  const getTvs = setTvs.data.results || [];
  const getPages = setTvs.data.total_pages || 1;
  return (
    <Tvs
      headers="On The Air"
      data={getTvs}
      totalPages={getPages}
      endpoint="/api/tv/on-the-air"
    />
  );
}
