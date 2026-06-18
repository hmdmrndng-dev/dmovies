import { tmdb } from "@/lib/tmdb";
import People from "./People";

export default async function Page() {
  const [setPeople] = await Promise.all([
    tmdb.get(
      `https://api.themoviedb.org/3/person/popular?language=en-US&page=1`,
    ),
  ]);
  const getPeople = setPeople.data.results || [];
  const getPages = setPeople.data.total_pages || 1;
  return (
    <People
      headers="Top Rated People"
      data={getPeople}
      totalPages={getPages}
      endpoint="/api/people/popular"
    />
  );
}
