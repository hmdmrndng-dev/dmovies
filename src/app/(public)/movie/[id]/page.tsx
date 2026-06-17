import { tmdb } from "@/lib/tmdb";
import Details from "../Details";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const [
    setMovies,
    setCredits,
    setImages,
    setExternalIds,
    setKeywords,
    setSimilar,
  ] = await Promise.all([
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}?language=en-US`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/images`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/external_ids`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/keywords`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/similar`),
  ]);
  const getMovies = setMovies.data;
  const getCredits = setCredits.data;
  const getImages = setImages.data;
  const getExternalIds = setExternalIds.data;
  const getKeywords = setKeywords.data.keywords || [];
  const getSimilar = setSimilar.data.results || [];
  return (
    <Details
      movies={getMovies}
      credits={getCredits}
      images={getImages}
      externalIds={getExternalIds}
      keywords={getKeywords}
      similar={getSimilar}
    />
  );
}
