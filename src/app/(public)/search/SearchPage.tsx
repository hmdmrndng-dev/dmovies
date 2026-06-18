"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconArrowDown, IconLoader, IconMovie } from "@tabler/icons-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv" | "person";
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setPage(1);
      setTotalPages(0);
      return;
    }

    async function initializeSearch() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/multi?query=${encodeURIComponent(q)}&page=1`,
        );
        const data = await res.json();

        const filtered = (data.results || []).filter(
          (item: SearchResult) => item.media_type !== "person",
        );

        setResults(filtered);
        setPage(1); // Reset back to page 1 for a new search term
        setTotalPages(data.total_pages || 0);
      } catch (error) {
        console.error("Initial search error:", error);
      } finally {
        setLoading(false);
      }
    }

    initializeSearch();
  }, [q]);

  async function loadMorePages() {
    if (loading || page >= totalPages) return;

    const nextPage = page + 1;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/multi?query=${encodeURIComponent(q)}&page=${nextPage}`,
      );
      const data = await res.json();

      const filtered = (data.results || []).filter(
        (item: SearchResult) => item.media_type !== "person",
      );

      setResults((prev) => [...prev, ...filtered]);
      setPage(nextPage);
    } catch (error) {
      console.error("Load more pages error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!q) {
    return (
      <main className="w-full gap-4 px-6 py-4 xl:px-24 text-center">
        <h1 className="text-2xl font-bold text-white">
          Search for a movie or TV show.
        </h1>
      </main>
    );
  }

  return (
    <main className="w-full gap-4 px-6 py-4 xl:px-24 mt-16 pb-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Search Results for <span className="text-zinc-400">"{q}"</span>
          </h1>
          <p className="text-zinc-500 mt-2">
            Showing {results.length} matching titles
          </p>
        </div>

        {loading && (
          <IconLoader className="h-6 w-6 animate-spin text-zinc-400" />
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && results.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col gap-2">
              <div className="aspect-[2/3] w-full rounded-xl bg-zinc-900" />
              <div className="h-4 w-3/4 rounded bg-zinc-900" />
              <div className="h-3 w-1/2 rounded bg-zinc-900" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="py-12 text-center text-zinc-500">
          No movies or TV shows found. Try a different term.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 justify-center gap-4">
            {results.map((data, index) => {
              const displayName = data.title || data.name;
              const targetDate = data.release_date || data.first_air_date;
              const releaseYear = targetDate
                ? new Date(targetDate).getFullYear()
                : "";

              return (
                <Link
                  key={`${data.media_type}-${data.id}-${index}`}
                  href={`/${data.media_type}/${data.id}`}
                  className="flex flex-col p-0 gap-0 bg-transparent ring-0 hover:scale-105 transition-transform duration-200 group"
                >
                  {data.poster_path ? (
                    <div className="relative w-full aspect-[10/16] overflow-hidden rounded-xl">
                      <Image
                        src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
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
                      {data.media_type} {releaseYear && `• ${releaseYear}`}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 🚨 Pure Shadcn Styled Pagination Trigger */}
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
                  <>
                    <IconLoader className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <IconArrowDown className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
