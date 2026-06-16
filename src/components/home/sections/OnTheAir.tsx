import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Data = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string | null;
};

type TmdbResponse = {
  results: Data[];
};

export default function OnTheAir({
  initialDatas,
}: {
  initialDatas: TmdbResponse;
}) {
  return (
    <section className="w-full gap-4 px-6 py-8 xl:px-24 bg-muted/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">On The Air</h2>
        <Link
          href="/tv/on-the-air"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "")}
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 justify-center gap-4">
        {initialDatas.results.splice(0, 16).map((data) => (
          <Link
            href={`/tv/${data.id}`}
            key={data.id}
            className="flex flex-col p-0 gap-0 bg-transparent ring-0 hover:scale-105 transition-transform duration-200"
          >
            {data.poster_path ? (
              <div className="relative w-full aspect-[10/16] overflow-hidden rounded-xl">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                  alt={data.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover pointer-events-none"
                />
              </div>
            ) : (
              <div className="w-48 h-72 bg-gray-300 rounded-md flex items-center justify-center">
                No Image
              </div>
            )}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">
                {data.name.substring(0, 16)}
                {data.name.length > 16 ? "..." : ""}
              </h3>
              <p className="text-xs text-gray-600">
                {data.first_air_date || "N/A"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
