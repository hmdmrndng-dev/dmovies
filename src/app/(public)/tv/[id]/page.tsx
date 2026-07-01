import { tmdb } from "@/lib/tmdb";
import Details from "../Details";
import { cookies } from "next/headers";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tmdb_session_id")?.value ?? null;

  const tvPromise = tmdb.get(
    `https://api.themoviedb.org/3/tv/${id}?language=en-US&append_to_response=credits,images,external_ids,keywords,similar`,
  );

  const accountPromise = sessionId
    ? tmdb
        .get(`https://api.themoviedb.org/3/account?session_id=${sessionId}`)
        .catch(() => null)
    : Promise.resolve(null);

  const accountStatesPromise = sessionId
    ? tmdb
        .get(
          `https://api.themoviedb.org/3/tv/${id}/account_states?session_id=${sessionId}`,
        )
        .catch(() => null)
    : Promise.resolve(null);

  const [tvRes, accountRes, accountStatesRes] = await Promise.all([
    tvPromise,
    accountPromise,
    accountStatesPromise,
  ]);

  const tv = tvRes.data;

  const seasons = await Promise.all(
    tv.seasons.map(async (season: { season_number: number }) => {
      try {
        const res = await tmdb.get(
          `https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}?language=en-US`,
        );

        return res.data;
      } catch {
        return {
          ...season,
          episodes: [],
        };
      }
    }),
  );

  const tvs = {
    ...tv,
    seasons,
  };

  return (
    <Details
      tvs={tvs}
      credits={tv.credits}
      images={tv.images}
      externalIds={tv.external_ids}
      keywords={tv.keywords.results ?? []}
      similar={tv.similar.results ?? []}
      user={accountRes?.data ?? null}
      isFavorited={accountStatesRes?.data?.favorite ?? false}
      isInWatchlist={accountStatesRes?.data?.watchlist ?? false}
    />
  );
}
