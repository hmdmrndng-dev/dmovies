"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { IconLoader } from "@tabler/icons-react";
import { pickTrailer, type Video } from "@/lib/video-utils";

type Data = {
  id: number;
  title: string;
  name: string;
  overview: string;
  backdrop_path: string | null;
  vote_average: number;
  adult: boolean;
  genre_ids: number[];
  release_date: string | null;
  first_air_date: string | null;
  media_type: "movie" | "tv";
};

type TmdbResponse = {
  results: Data[];
};

type Genre = {
  id: number;
  name: string;
};

export default function Trending({
  initialDatas,
  genres,
}: {
  initialDatas: TmdbResponse;
  genres: Genre[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const autoplayPlugin = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    }),
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerTitle, setTrailerTitle] = useState("");
  const [trailerDescription, setTrailerDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function openTrailer(item: Data) {
    setLoading(true);
    setTrailerTitle(item.title || item.name);
    setTrailerDescription(item.overview);
    try {
      const res = await fetch(`/api/${item.media_type}/${item.id}/videos`);
      const json = await res.json();
      setTrailerKey(pickTrailer(json.results as Video[]));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full">
      <Carousel
        className="w-full overflow-hidden transform-gpu [backface-visibility:hidden]"
        setApi={setApi}
        plugins={[autoplayPlugin.current]}
      >
        <CarouselContent className="will-change-transform ml-0">
          {initialDatas.results.slice(0, 10).map((data, index) => (
            <CarouselItem
              key={data.id}
              className="h-screen basis-full pl-0 [backface-visibility:hidden]"
            >
              <Card className="relative h-full w-full overflow-hidden rounded-none border-none bg-black">
                {data.backdrop_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`}
                    alt={data.title || data.name}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                    sizes="(max-width: 768px) 100vw, 1280px"
                    className="object-cover object-center pointer-events-none"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    No Image Available
                  </div>
                )}

                <div className="absolute inset-0 z-20 bg-gradient-to-tr from-black via-black/70 to-black/10" />

                <div className="dark absolute bottom-0 left-0 z-30 flex h-full w-full flex-col justify-end p-8 md:p-16 lg:w-2/3 lg:p-24">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 font-semibold"
                    >
                      Popular
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 font-semibold"
                    >
                      {data.media_type === "movie" ? "Movie" : "TV Show"}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-semibold"
                    >
                      <span>
                        TMDB{" "}
                        {data.vote_average
                          ? data.vote_average.toFixed(1)
                          : "N/A"}
                      </span>
                    </Badge>

                    <Badge
                      variant="outline"
                      className={cn(
                        "px-2.5 py-0.5 font-bold tracking-wider uppercase backdrop-blur-sm",
                        data.adult
                          ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
                      )}
                    >
                      {data.adult ? "R-Rated" : "PG-13"}
                    </Badge>
                  </div>

                  <h2 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-lg md:text-6xl lg:text-7xl">
                    {data.title || data.name}{" "}
                    {`(${new Date(
                      data.release_date || data.first_air_date || "",
                    ).getFullYear()})`}
                  </h2>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {genres
                      .filter((genre) => data.genre_ids.includes(genre.id))
                      .map((genre) => (
                        <Badge
                          key={genre.id}
                          variant="secondary"
                          className="w-fit"
                        >
                          {genre.name}
                        </Badge>
                      ))}
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300 drop-shadow md:text-lg">
                    {data.overview.length > 300
                      ? `${data.overview.substring(0, 300)}...`
                      : data.overview}
                  </p>

                  <div className="mt-8 flex items-center gap-4">
                    <Button
                      size="lg"
                      disabled={loading}
                      onClick={() => openTrailer(data)}
                    >
                      {loading ? (
                        <>
                          Loading
                          <IconLoader
                            data-icon="inline-start"
                            className="ml-2 animate-spin"
                          />
                        </>
                      ) : (
                        "Watch Trailer"
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white/10 hover:bg-white/20 border-none backdrop-blur-sm text-white"
                    >
                      More Info
                    </Button>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute bottom-3 left-0 right-0 z-40 flex justify-center gap-2">
          {initialDatas.results.slice(0, 10).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-primary shadow-lg shadow-primary/50"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </Carousel>

      <Dialog
        open={trailerKey !== null}
        onOpenChange={(open) => !open && setTrailerKey(null)}
      >
        <DialogContent className="w-[95vw] md:w-[88vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw] sm:max-w-[1800px] p-2 sm:p-4 gap-3 border-none bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle className="px-2 pt-2 sm:p-0 text-lg sm:text-xl font-bold tracking-tight">
              {trailerTitle}
            </DialogTitle>
            <DialogDescription>
              {trailerDescription}
            </DialogDescription>
          </DialogHeader>

          {trailerKey && (
            <div className="aspect-video w-full overflow-hidden rounded-md bg-black shadow-2xl shadow-black/50">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title={`${trailerTitle} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-none"
              />
            </div>
          )}

          <DialogFooter className="px-2 pb-2 sm:p-0">
            <DialogClose asChild>
              <Button
                variant="secondary"
                className="w-full sm:w-auto font-medium"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
