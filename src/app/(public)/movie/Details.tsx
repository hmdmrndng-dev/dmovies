"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { pickTrailer, type Video } from "@/lib/video-utils";
import { Button } from "@/components/ui/button";
import { IconLoader } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSocialLinks } from "@/lib/social-utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Movies = {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  vote_average: number;
  adult: boolean;
  genres: Genre[];
  release_date: string | null;
  poster_path: string | null;
  runtime: number | null;
  status: string;
};

type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

type TmdbImages = {
  backdrops: Array<{ file_path: string }>;
};

type Genre = {
  id: number;
  name: string;
};

type ExternalIds = {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
};

export default function Details({
  movies,
  casts,
  images,
  externalIds,
}: {
  movies: Movies;
  casts: Cast[];
  images: TmdbImages;
  externalIds: ExternalIds;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const socialLinks = getSocialLinks(externalIds);

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

  async function openTrailer(item: Movies) {
    setLoading(true);
    setTrailerTitle(item.title);
    setTrailerDescription(item.overview);
    try {
      const res = await fetch(`/api/movie/${item.id}/videos`);
      const json = await res.json();
      setTrailerKey(pickTrailer(json.results as Video[]));
    } finally {
      setLoading(false);
    }
  }

  const backdropsList = images?.backdrops?.slice(0, 10) || [];

  return (
    <main className="mt-16">
      <div className="relative">
        <Carousel
          className="w-full overflow-hidden transform-gpu [backface-visibility:hidden]"
          setApi={setApi}
          plugins={[autoplayPlugin.current]}
        >
          <CarouselContent className="will-change-transform ml-0">
            {backdropsList.map((image, index) => (
              <CarouselItem
                key={image.file_path}
                className="relative h-[40vh] md:h-[55vh] lg:h-[65vh] pl-0 basis-full [backface-visibility:hidden]"
              >
                {image.file_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w1280${image.file_path}`}
                    alt={movies.title}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                    sizes="100vw"
                    className="object-cover pointer-events-none"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    No Image Available
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              </CarouselItem>
            ))}
          </CarouselContent>

          {backdropsList.length > 1 && (
            <div className="absolute bottom-4 right-8 z-20 flex justify-center gap-2">
              {backdropsList.map((_, i) => (
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
          )}
        </Carousel>
      </div>

      <section className="relative z-10 -mt-16 md:-mt-24 px-4 md:px-8 xl:px-24 pb-12">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
          <div className="flex flex-row md:flex-col gap-4 items-end md:items-stretch shrink-0 md:w-52 lg:w-64">
            <div className="w-28 sm:w-36 md:w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-border">
              {movies.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movies.poster_path}`}
                  alt={movies.title}
                  width={300}
                  height={450}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[2/3] flex items-center justify-center bg-muted text-muted-foreground text-xs">
                  No Poster
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 flex-1 md:flex-none">
              {socialLinks.filter((l) => l.id).length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {socialLinks
                    .filter((link) => link.id)
                    .map((link) => (
                      <Button
                        key={link.label}
                        size="icon"
                        variant="outline"
                        asChild
                        title={link.label}
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.icon}
                          <span className="sr-only">{link.label}</span>
                        </a>
                      </Button>
                    ))}
                </div>
              )}
              <Button
                size="lg"
                disabled={loading}
                onClick={() => openTrailer(movies)}
                className="w-full"
              >
                {loading ? (
                  <>
                    Loading
                    <IconLoader className="ml-2 animate-spin" />
                  </>
                ) : (
                  "Watch Trailer"
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1 min-w-0 pt-2">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 font-semibold"
              >
                {movies.status || "Unknown Status"}
              </Badge>
              <Badge
                variant="outline"
                className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 font-semibold"
              >
                Movie
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-semibold"
              >
                TMDB{" "}
                {movies.vote_average ? movies.vote_average.toFixed(1) : "N/A"}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "px-2.5 py-0.5 font-bold tracking-wider uppercase",
                  movies.adult
                    ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
                )}
              >
                {movies.adult ? "R-Rated" : "PG-13"}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              {movies.title}
            </h1>

            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                {movies.release_date
                  ? new Date(movies.release_date).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "long", day: "numeric" },
                    )
                  : "N/A"}
              </p>
              {movies.tagline && (
                <p className="text-sm italic text-muted-foreground">
                  &ldquo;{movies.tagline}&rdquo;
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {movies.genres?.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
              {movies.runtime && (
                <>
                  <span className="text-muted-foreground text-sm mx-1">•</span>
                  <Badge variant="secondary">
                    {`${Math.floor(movies.runtime / 60)}h ${movies.runtime % 60}m`}
                  </Badge>
                </>
              )}
            </div>

            <div>
              <h2 className="font-semibold text-base mb-2">Overview</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {movies.overview || "No overview available."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Dialog
        open={trailerKey !== null}
        onOpenChange={(open) => !open && setTrailerKey(null)}
      >
        <DialogContent className="w-[95vw] md:w-[88vw] lg:w-[80vw] xl:w-[75vw] sm:max-w-[1800px] p-2 sm:p-4 gap-3 border-none bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle className="px-2 pt-2 sm:p-0 text-lg sm:text-xl font-bold tracking-tight">
              {trailerTitle}
            </DialogTitle>
            <DialogDescription>{trailerDescription}</DialogDescription>
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
    </main>
  );
}
