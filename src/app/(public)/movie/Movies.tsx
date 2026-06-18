"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconArrowDown, IconLoader, IconMovie } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Movies = {
  id: number;
  title: string;
  release_date: string | null;
  poster_path: string | null;
};
interface MoviesProps {
  headers: string;
  data: Movies[];
  totalPages: number;
  endpoint: string;
}

export default function Movies({
  headers,
  data,
  totalPages,
  endpoint,
}: MoviesProps) {
  const [movies, setMovies] = useState<Movies[]>(data);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function loadMorePages() {
    if (loading || page >= totalPages) return;

    const nextPage = page + 1;
    setLoading(true);

    try {
      const res = await fetch(`${endpoint}?page=${nextPage}`);
      const data = await res.json();

      setMovies((prev) => [...prev, ...(data.results || [])]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="w-full gap-4 px-6 py-4 xl:px-24 mt-16 pb-24">
      <div className="mb-8 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{headers}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 justify-center gap-4">
          {movies.map((movie, index) => {
            const displayName = movie.title;
            const targetDate = movie.release_date;
            const releaseYear = targetDate
              ? new Date(targetDate).getFullYear()
              : "";

            return (
              <Link
                key={`movie-${movie.id}-${index}`}
                href={`/movie/${movie.id}`}
                className="flex flex-col p-0 gap-0 bg-transparent ring-0 hover:scale-105 transition-transform duration-200 group"
              >
                {movie.poster_path ? (
                  <div className="relative w-full aspect-[10/16] overflow-hidden rounded-xl">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                      alt={displayName || "Poster"}
                      fill
                      priority={index < 4}
                      loading={index < 4 ? undefined : "lazy"}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                      className="object-cover pointer-events-none"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[10/16] bg-gray-300 rounded-xl flex items-center justify-center text-gray-700 text-sm font-medium select-none shadow-md">
                    <IconMovie />
                  </div>
                )}

                <div className="flex flex-col mt-2">
                  <span className="truncate text-sm font-medium">
                    {displayName}
                  </span>
                  <span className="text-xs text-gray-600 capitalize">
                    Movie {releaseYear && `• ${releaseYear}`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      {page < totalPages && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={loadMorePages}
            disabled={loading}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full max-w-xs",
            )}
          >
            {loading ? (
              <IconLoader className="h-4 w-4 animate-spin" />
            ) : (
              <IconArrowDown className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </main>
  );
}
