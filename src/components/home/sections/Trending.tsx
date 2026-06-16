"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
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
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerTitle, setTrailerTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function openTrailer(item: Data) {
    setLoading(true);
    setTrailerTitle(item.title || item.name);
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
        className="w-full overflow-hidden transform-gpu"
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {initialDatas.results.slice(0, 10).map((data) => (
            <CarouselItem key={data.id} className="h-screen basis-full">
              <Card className="relative h-full w-full overflow-hidden rounded-none border-none bg-black">
                {data.backdrop_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`}
                    alt={data.title || data.name}
                    fill
                    priority
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    No Image Available
                  </div>
                )}

                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* dark class forces shadcn tokens to dark values over the always-dark image overlay */}
                <div className="dark absolute bottom-0 left-0 z-30 flex h-full w-full flex-col justify-end p-8 md:p-16 lg:w-2/3 lg:p-24">
                  <div className="flex gap-2">
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
                  <div className="flex gap-2">
                    {genres
                      .filter((genre) => data.genre_ids.includes(genre.id))
                      .map((genre) => (
                        <Badge
                          key={genre.id}
                          variant="secondary"
                          className="mb-4 w-fit"
                        >
                          {genre.name}
                        </Badge>
                      ))}
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground drop-shadow md:text-lg">
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
                          <IconLoader data-icon="inline-start" />
                        </>
                      ) : (
                        "Watch Trailer"
                      )}
                    </Button>
                    <Button size="lg" variant="secondary">
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
                  : "w-2 bg-white/30 hover:bg-white/50" /* Swapped to white/30 to pop against dark film backdrops */
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
        <DialogContent className="min-w-7xl">
          <DialogHeader>
            <DialogTitle>{trailerTitle}</DialogTitle>
          </DialogHeader>
          {trailerKey && (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title={`${trailerTitle} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture allowfullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
