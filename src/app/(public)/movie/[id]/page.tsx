import { cookies } from "next/headers";
import { tmdb } from "@/lib/tmdb";
import Details from "../Details";

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
          `https://api.themoviedb.org/3/movie/${id}/account_states?session_id=${sessionId}`,
        )
        .catch(() => null)
    : Promise.resolve(null);

  const [
    setMovies,
    setCredits,
    setImages,
    setExternalIds,
    setKeywords,
    setSimilar,
    accountRes,
    accountStatesRes,
  ] = await Promise.all([
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}?language=en-US`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/images`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/external_ids`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/keywords`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/similar`),
    accountPromise,
    accountStatesPromise,
  ]);
  const getMovies = setMovies.data;
  const getCredits = setCredits.data;
  const getImages = setImages.data;
  const getExternalIds = setExternalIds.data;
  const getKeywords = setKeywords.data.keywords || [];
  const getSimilar = setSimilar.data.results || [];
  const user = accountRes?.data || null;
  const isFavorited: boolean = accountStatesRes?.data?.favorite ?? false;
  const isWatchlisted: boolean = accountStatesRes?.data?.watchlist ?? false;

  return (
    <Details
      movies={getMovies}
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
