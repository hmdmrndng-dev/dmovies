"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconLoader } from "@tabler/icons-react";

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

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    async function fetchNewData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/multi?query=${encodeURIComponent(q)}`);
        const data = await res.json();

        const filtered = (data.results || []).filter(
          (item: SearchResult) => item.media_type !== "person",
        );
        setResults(filtered);
      } catch (error) {
        console.error("Real-time fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewData();
  }, [q]);
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
    <main className="w-full gap-4 px-6 py-4 xl:px-24 mt-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Search Results for <span className="text-zinc-400">"{q}"</span>
          </h1>
          <p className="text-zinc-500 mt-2">
            Found {results.length} matching titles
          </p>
        </div>

        {loading && (
          <IconLoader className="h-6 w-6 animate-spin text-zinc-400" />
        )}
      </div>

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
        <div
          className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}
        >
          {results.map((item) => {
            const displayName = item.title || item.name;
            const targetDate = item.release_date || item.first_air_date;
            const releaseYear = targetDate
              ? new Date(targetDate).getFullYear()
              : "";

            return (
              <Link
                key={`${item.media_type}-${item.id}`}
                href={`/${item.media_type}/${item.id}`}
                className="group flex flex-col gap-2 transition-transform hover:scale-105"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                  {item.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={displayName || "Poster"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 16vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">
                      🎬
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="truncate text-sm font-medium text-zinc-200 group-hover:text-white">
                    {displayName}
                  </span>
                  <span className="text-xs text-zinc-500 capitalize">
                    {item.media_type} {releaseYear && `• ${releaseYear}`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
