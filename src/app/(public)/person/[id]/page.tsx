import { tmdb } from "@/lib/tmdb";
import Details from "../Details";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const [setTvs, setCredits, setExternalIds] = await Promise.all([
    tmdb.get(`https://api.themoviedb.org/3/person/${id}?language=en-US`),
    tmdb.get(
      `https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`,
    ),
    tmdb.get(`https://api.themoviedb.org/3/person/${id}/external_ids`),
  ]);

  const getTvs = setTvs.data;
  const getCredits = setCredits.data;
  const getExternalIds = setExternalIds.data;

  return (
    <Details
      person={getTvs}
      credits={getCredits}
      externalIds={getExternalIds}
    />
  );
}
