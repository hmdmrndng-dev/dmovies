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
import MediaHeader from "@/components/movie/sections/MediaHeader";
import { cn } from "@/lib/utils";
import Credits from "@/components/movie/sections/Credits";
import Similar from "@/components/movie/sections/Similar";
import { IconLoader, IconMovie, IconMovieOff } from "@tabler/icons-react";

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

type MovieCredits = {
  cast: Cast[];
  crew: Crew[];
};

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

type Keywords = {
  id: number;
  name: string;
};

type SimilarMovies = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
};

export default function Details({
  movies,
  credits,
  images,
  externalIds,
  keywords,
  similar,
}: {
  movies: Movies;
  credits: MovieCredits;
  images: TmdbImages;
  externalIds: ExternalIds;
  keywords: Keywords[];
  similar: SimilarMovies[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  async function openTrailer(data: Movies) {
    setIsDialogOpen(true);
    setLoading(true);
    setTrailerTitle(data.title);
    setTrailerDescription(data.overview);
    try {
      const res = await fetch(`/api/movie/${data.id}/videos`);
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
                    src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                    alt={movies.title}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                    sizes="100vw"
                    className="object-cover pointer-events-none"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    <IconMovie />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              </CarouselItem>
            ))}
          </CarouselContent>

          {backdropsList.length > 1 && (
            <div className="absolute bottom-4 right-8 z-40 flex items-center justify-center gap-1.5">
              {backdropsList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                    i === current
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50 dark:bg-muted/40 dark:hover:bg-muted/80",
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>

      <div
        className={cn(
          "relative z-10 px-4 md:px-8 xl:px-24 pb-12",
          backdropsList.length > 1 ? "-mt-16 md:-mt-24" : "mt-4",
        )}
      >
        <MediaHeader
          tv={movies}
          socialLinks={socialLinks}
          hasMultipleBackdrops={backdropsList.length > 1}
          onOpenTrailer={() => openTrailer(movies)}
          isTrailerLoading={loading}
          keywords={keywords}
        />
        <Credits cast={credits.cast} />

        <Credits crew={credits.crew} />

        <Similar similar={similar} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] md:w-[88vw] lg:w-[80vw] xl:w-[75vw] sm:max-w-[1800px] p-2 sm:p-4 gap-3 border-none bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle className="px-2 pt-2 sm:p-0 text-lg sm:text-xl font-bold tracking-tight">
              {trailerTitle}
            </DialogTitle>
            <DialogDescription>{trailerDescription}</DialogDescription>
          </DialogHeader>
          {trailerKey ? (
            <div className="aspect-video w-full overflow-hidden rounded-md bg-black shadow-2xl shadow-black/50">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title={`${trailerTitle} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-none"
              />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-md bg-black">
              {loading ? (
                <>
                  <IconLoader className="ml-2 animate-spin" />
                </>
              ) : (
                <IconMovieOff className="h-12 w-12 text-muted-foreground" />
              )}
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
