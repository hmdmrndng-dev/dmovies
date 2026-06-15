import Home from "@/components/Home";
import { tmdb } from "@/lib/tmdb";

export default async function Page() {
  const response = await tmdb.get("/movie/popular?language=en-US&page=1");
  const data = response.data;
  return <Home data={data} />;
}
