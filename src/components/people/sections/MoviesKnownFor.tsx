import { IconMovie } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

// 🎯 1. Renamed type to avoid naming collisions and added TV fields
type KnownForMedia = {
  id: number;
  title?: string;
  name?: string;
  media_type?: "movie" | "tv";
  character?: string;
  job?: string;
  poster_path: string | null;
};

export default function MoviesKnownFor({
  movies,
}: {
  movies: KnownForMedia[];
}) {
  const displayList = movies || [];

  return (
    <section className="w-full gap-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Known For</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 justify-center gap-4">
        {displayList.map((data, index) => {
          const resolvedTitle = data.title || data.name || "Untitled";
          const mediaType = data.media_type || "movie";

          return (
            <Link
              href={`/${mediaType}/${data.id}`}
              key={`${mediaType}-${data.id}-${index}`}
              className="flex flex-col p-0 gap-0 bg-transparent ring-0 hover:scale-105 transition-transform duration-200"
            >
              {data.poster_path ? (
                <div className="relative w-full aspect-[10/16] overflow-hidden rounded-xl">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                    alt={`${resolvedTitle} poster`}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover pointer-events-none"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[10/16] bg-gray-300 rounded-xl flex items-center justify-center text-gray-700 text-sm font-medium select-none shadow-md">
                  <IconMovie />
                </div>
              )}

              <div className="flex flex-col mt-2">
                <span
                  className="truncate text-sm font-medium"
                  title={resolvedTitle}
                >
                  {resolvedTitle}
                </span>
                {data.character && (
                  <span
                    className="truncate text-xs text-muted-foreground"
                    title={data.character}
                  >
                    as {data.character || "N/A"}
                  </span>
                )}
                {data.job && (
                  <span
                    className="truncate text-xs text-muted-foreground"
                    title={data.job}
                  >
                    {data.job}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
