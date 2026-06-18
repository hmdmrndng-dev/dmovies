import { tmdb } from "@/lib/tmdb";
import Details from "../Details";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const [setTvs, setImages] = await Promise.all([
    tmdb.get(`https://api.themoviedb.org/3/person/${id}?language=en-US`),
    tmdb.get(`https://api.themoviedb.org/3/person/${id}/tagged_images?page=1`),
  ]);

  const getTvs = setTvs.data;

  const rawPaths =
    setImages.data?.results
      ?.filter((item: any) => !!item.media?.backdrop_path)
      .map((item: any) => item.media.backdrop_path as string) || [];

  const backdrops = Array.from(new Set(rawPaths))
    .slice(0, 10)
    .map((path) => ({
      backdrop_path: path as string,
    }));

  return <Details person={getTvs} images={{ backdrops }} />;
}
