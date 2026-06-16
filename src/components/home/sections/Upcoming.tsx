import { Card } from "@/components/ui/card";
import Image from "next/image";

type Data = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string | null;
};

type TmdbResponse = {
  results: Data[];
};

export default function Upcoming({
  initialDatas,
}: {
  initialDatas: TmdbResponse;
}) {
  return (
    <section className="w-full gap-4 px-6 py-8 xl:px-24 ">
      <h2 className="text-2xl font-semibold">Upcoming Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 xl:grid-cols-8 justify-center gap-4">
        {initialDatas.results.splice(0, 16).map((movie) => (
          <Card
            key={movie.id}
            className="flex flex-col p-0 gap-0 bg-transparent ring-0"
          >
            {movie.poster_path ? (
              <div className="relative" style={{ aspectRatio: 10 / 16 }}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-48 h-72 bg-gray-300 rounded-md flex items-center justify-center">
                No Image
              </div>
            )}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">
                {movie.title.substring(0, 20)}
                {movie.title.length > 20 ? "..." : ""}
              </h3>
              <p className="text-xs text-gray-600">
                {movie.release_date || "N/A"}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
