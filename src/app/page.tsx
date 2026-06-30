import { cookies } from "next/headers";
import Upcoming from "@/components/home/sections/Upcoming";
import Trending from "@/components/home/sections/Trending";
import OnTheAir from "@/components/home/sections/OnTheAir";
import { tmdb } from "@/lib/tmdb";

export default async function Page() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tmdb_session_id")?.value || null;

  const accountRes = sessionId
    ? await tmdb
        .get(`https://api.themoviedb.org/3/account?session_id=${sessionId}`)
        .catch(() => null)
    : null;

  const user = accountRes?.data || null;

  let favoriteIds: number[] = [];
  let watchlistIds: number[] = [];

  if (user) {
    const [favMovies, favTv, watchMovies, watchTv] = await Promise.all([
      tmdb
        .get(
          `https://api.themoviedb.org/3/account/${user.id}/favorite/movies?session_id=${sessionId}`,
        )
        .catch(() => null),
      tmdb
        .get(
          `https://api.themoviedb.org/3/account/${user.id}/favorite/tv?session_id=${sessionId}`,
        )
        .catch(() => null),
      tmdb
        .get(
          `https://api.themoviedb.org/3/account/${user.id}/watchlist/movies?session_id=${sessionId}`,
        )
        .catch(() => null),
      tmdb
        .get(
          `https://api.themoviedb.org/3/account/${user.id}/watchlist/tv?session_id=${sessionId}`,
        )
        .catch(() => null),
    ]);

    const allFavs = [
      ...(favMovies?.data?.results || []),
      ...(favTv?.data?.results || []),
    ];
    favoriteIds = allFavs.map((item: any) => item.id);

    const allWatch = [
      ...(watchMovies?.data?.results || []),
      ...(watchTv?.data?.results || []),
    ];
    watchlistIds = allWatch.map((item: any) => item.id);
  }

  const [popular, genres, upcoming, onTheAir] = await Promise.all([
    tmdb.get("https://api.themoviedb.org/3/trending/all/day?language=en-US"),
    tmdb.get("https://api.themoviedb.org/3/genre/movie/list?language=en-US"),
    tmdb.get(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
    ),
    tmdb.get(
      "https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1",
    ),
  ]);

  return (
    <>
      <Trending
        initialDatas={popular.data}
        genres={genres.data.genres}
        user={user}
        favoriteIds={favoriteIds}
        watchlistIds={watchlistIds}
      />
      <Upcoming initialDatas={upcoming.data} user={user} favoriteIds={favoriteIds}/>
      <OnTheAir initialDatas={onTheAir.data} user={user} favoriteIds={favoriteIds}/>
    </>
  );
}
