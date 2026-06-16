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
import { Card, CardContent } from "@/components/ui/card";
import { pickTrailer, type Video } from "@/lib/video-utils";
import { Button } from "@/components/ui/button";
import { IconBrandFacebook, IconLoader } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSocialLinks } from "@/lib/social-utils";

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
    <main className="mt-16 px-6 py-8 xl:px-24">
      <Carousel
        className="w-full overflow-hidden transform-gpu [backface-visibility:hidden] rounded-xl"
        setApi={setApi}
        plugins={[autoplayPlugin.current]}
      >
        <Card className="absolute left-0 right-0 z-40 pointer-events-none h-full w-full rounded-xl bg-gradient-to-tr from-black via-black/70 to-black/10 p-0">
          <CardContent className="flex md:flex-row h-full w-full p-4 gap-4 text-center text-white">
            <div className="flex flex-col items-center gap-2">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movies.poster_path}`}
                alt={movies.title}
                width={200}
                height={300}
                className="rounded-lg"
              />
              <div className="flex gap-2">
                {socialLinks
                  .filter((link) => link.id)
                  .map((link) => (
                    <Button
                      key={link.label}
                      size="icon"
                      variant="outline"
                      asChild
                      title={link.label}
                      className="pointer-events-auto"
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
              <Button
                size="lg"
                disabled={loading}
                onClick={() => openTrailer(movies)}
                className="pointer-events-auto"
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
            </div>
            <div className="flex flex-col text-justify gap-2">
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
                  <span>
                    TMDB{" "}
                    {movies.vote_average
                      ? movies.vote_average.toFixed(1)
                      : "N/A"}
                  </span>
                </Badge>

                <Badge
                  variant="outline"
                  className={cn(
                    "px-2.5 py-0.5 font-bold tracking-wider uppercase backdrop-blur-sm",
                    movies.adult
                      ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
                  )}
                >
                  {movies.adult ? "R-Rated" : "PG-13"}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold">{movies.title}</h2>
              <h4 className="text-sm italic text-gray-300">
                {movies.release_date
                  ? new Date(movies.release_date).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "N/A"}
              </h4>
              <p className="text-sm italic text-gray-300">
                {movies.tagline || "No tagline available."}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {movies?.genres?.map((genre) => (
                  <Badge key={genre.id} variant="secondary" className="w-fit">
                    {genre.name}
                  </Badge>
                ))}
                <span className="mx-1 text-gray-500">|</span>
                <Badge variant="secondary" className="w-fit">
                  {movies.runtime
                    ? `${Math.floor(movies.runtime / 60)}h ${
                        movies.runtime % 60
                      }m`
                    : "Runtime N/A"}
                </Badge>
              </div>
              <p className="max-w-2xl text-sm">{movies.overview}</p>
            </div>
          </CardContent>
        </Card>
        <CarouselContent className="will-change-transform ml-0">
          {backdropsList.map((image, index) => (
            <CarouselItem
              key={image.file_path}
              className="h-[50vh] basis-full pl-0 [backface-visibility:hidden]"
            >
              <Card className="h-full w-full aspect-[16/10] overflow-hidden rounded-xl p-0">
                <CardContent className="relative h-full w-full">
                  {image.file_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w1280${image.file_path}`}
                      alt={image.file_path}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? undefined : "lazy"}
                      sizes="(max-width: 768px) 100vw, 1280px"
                      className="object-cover pointer-events-none"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      No Image Available
                    </div>
                  )}

                  <div className="absolute inset-0 z-20 bg-gradient-to-tr from-black via-black/70 to-black/10" />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {backdropsList.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-40 flex justify-center gap-2">
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
    </main>
  );
}
