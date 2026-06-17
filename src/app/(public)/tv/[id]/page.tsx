import { tmdb } from "@/lib/tmdb";
import Details from "../Details";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const [
    setTvs,
    setCredits,
    setImages,
    setExternalIds,
    setKeywords,
    setSimilar,
  ] = await Promise.all([
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}?language=en-US`),
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`),
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}/images`),
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}/external_ids`),
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}/keywords`),
    tmdb.get(`https://api.themoviedb.org/3/tv/${id}/similar`),
  ]);
  const getTvs = setTvs.data;
  const getCredits = setCredits.data;
  const getImages = setImages.data;
  const getExternalIds = setExternalIds.data;
  const getKeywords = setKeywords.data.results || [];
  const getSimilar = setSimilar.data.results || [];

  return (
    <Details
      movies={getTvs}
      credits={getCredits}
      images={getImages}
      externalIds={getExternalIds}
      keywords={getKeywords}
      similar={getSimilar}
    />
  );
}
