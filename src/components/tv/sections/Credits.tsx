import { IconMovie } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

type Crew = {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
};

type CreditsProps = {
  title?: string;
  cast?: Cast[];
  crew?: Crew[];
};

export default function Credits({ title, cast, crew }: CreditsProps) {
  const items = cast || crew || [];
  const displayTitle = title || (cast ? "Series Top Cast" : "Production Crew");

  if (items.length === 0) return null;

  return (
    <section className="w-full gap-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{displayTitle}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 justify-center gap-4">
        {items.slice(0, 16).map((data, index) => {
          const subLabel = "job" in data ? data.job : data.character;

          return (
            <Link
              href={`/person/${data.id}`}
              key={`${data.id}-${index}`}
              className="flex flex-col p-0 gap-0 bg-transparent ring-0 hover:scale-105 transition-transform duration-200"
            >
              {data.profile_path ? (
                <div className="relative w-full aspect-[10/16] overflow-hidden rounded-xl">
                  <Image
                    src={`https://image.tmdb.org/t/p/original${data.profile_path}`}
                    alt={data.name}
                    fill
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
                <h3 className="text-lg font-bold truncate">
                  {data.name.substring(0, 16)}
                  {data.name.length > 16 ? "..." : ""}
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  {subLabel || "N/A"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
