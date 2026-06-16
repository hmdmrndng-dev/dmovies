import { tmdb } from "@/lib/tmdb";
import Details from "../Details";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const [setMovies, setCast, setImages, setExternalIds] = await Promise.all([
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}?language=en-US`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/images`),
    tmdb.get(`https://api.themoviedb.org/3/movie/${id}/external_ids`)
  ]);
  const getMovies = setMovies.data;
  const getCast = setCast.data;
  const getImages = setImages.data;
  const getExternalIds = setExternalIds.data;

  return <Details movies={getMovies} casts={getCast} images={getImages} externalIds={getExternalIds} />;
}
