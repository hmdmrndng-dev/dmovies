import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconMovie } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

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
    <section className="w-full gap-4 px-6 py-8 xl:px-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Upcoming Movies</h2>
        <Link
          href="/movie/upcoming"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "")}
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 justify-center gap-4">
        {initialDatas.results.splice(0, 16).map((data, index) => (
          <Link
            href={`/movie/${data.id}`}
            key={data.id}
            className="flex flex-col p-0 gap-0 bg-transparent ring-0 hover:scale-105 transition-transform duration-200"
          >
            {data.poster_path ? (
              <div className="relative w-full aspect-[10/16] overflow-hidden rounded-xl">
                <Image
                  src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
                  alt={data.title}
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
            <div className="flex flex-col">
              <span className="truncate text-sm font-medium">
                {data.title.substring(0, 32)}
                {data.title.length > 32 ? "..." : ""}
              </span>
              <span className="text-xs text-gray-600 capitalize">
                {data.release_date || "N/A"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
