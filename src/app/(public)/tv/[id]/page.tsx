import { tmdb } from "@/lib/tmdb";
import Details from "../Details";
import { cookies } from "next/headers";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("tmdb_session_id")?.value || null;

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

  const [
    setTvs,
    setCredits,
    setImages,
    setExternalIds,
    setKeywords,
    setSimilar,
    accountRes,
    accountStatesRes,
  ] = await Promise.all([
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}?language=en-US`),
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`),
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}/images`),
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}/external_ids`),
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}/keywords`),
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}/similar`),
    accountPromise,
    accountStatesPromise,
  ]);
  const getTvs = setTvs.data;
  const getCredits = setCredits.data;
  const getImages = setImages.data;
  const getExternalIds = setExternalIds.data;
  const getKeywords = setKeywords.data.results || [];
  const getSimilar = setSimilar.data.results || [];
  const user = accountRes?.data || null;
  const isFavorited: boolean = accountStatesRes?.data?.favorite ?? false;
  const isWatchlisted: boolean = accountStatesRes?.data?.watchlist ?? false;

  return (
    <Details
      tvs={getTvs}
      credits={getCredits}
      images={getImages}
      externalIds={getExternalIds}
      keywords={getKeywords}
      similar={getSimilar}
      user={user}
      isFavorited={isFavorited}
      isInWatchlist={isWatchlisted}
    />
  );
}
