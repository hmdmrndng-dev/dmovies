"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  IconLoader,
  IconMovie,
  IconMovieOff,
  IconHeart,
  IconHeartFilled,
  IconBookmark,
  IconBookmarkFilled,
} from "@tabler/icons-react";
import { pickTrailer, type Video } from "@/lib/video-utils";
import Link from "next/link";
import { useMediaAction } from "@/hooks/useMediaAction";
import LoginDialog from "@/app/shared/login-dialog";
import { toast } from "sonner";

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

function MediaActions({
  data,
  user,
  initialFavorited,
  initialWatchlist,
  onRequireLogin,
}: {
  data: Data;
  user: any;
  initialFavorited: boolean;
  initialWatchlist: boolean;
  onRequireLogin: () => void;
}) {
  const {
    isActive: favorited,
    isLoading: favLoading,
    toggle: toggleFav,
  } = useMediaAction({
    initialState: initialFavorited,
    user,
    mediaId: data.id,
    mediaType: data.media_type,
    actionType: "favorite",
    onRequireLogin,
  });

  const {
    isActive: watchlisted,
    isLoading: watchLoading,
    toggle: toggleWatch,
  } = useMediaAction({
    initialState: initialWatchlist,
    user,
    mediaId: data.id,
    mediaType: data.media_type,
    actionType: "watchlist",
    onRequireLogin,
  });

  return (
    <div className="flex gap-4 ml-auto md:ml-0">
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10"
        onClick={toggleFav}
        disabled={favLoading}
        title={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        {favorited ? (
          <IconHeartFilled className="!h-8 !w-8 text-red-500" />
        ) : (
          <IconHeart className="!h-8 !w-8" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10"
        onClick={toggleWatch}
        disabled={watchLoading}
        title={watchlisted ? "Remove from watchlist" : "Add to watchlist"}
      >
        {watchlisted ? (
          <IconBookmarkFilled className="!h-8 !w-8 text-primary" />
        ) : (
          <IconBookmark className="!h-8 !w-8" />
        )}
      </Button>
    </div>
  );
}

export default function Trending({
  initialDatas,
  genres,
  user,
  favoriteIds,
  watchlistIds,
}: {
  initialDatas: TmdbResponse;
  genres: Genre[];
  user: any | null;
  favoriteIds: number[];
  watchlistIds: number[];
}) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<"trailer" | "login" | null>(
    null,
  );

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerTitle, setTrailerTitle] = useState("");
  const [trailerDescription, setTrailerDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  async function openTrailer(data: Data) {
    setActiveModal("trailer");
    setLoading(true);
    setTrailerTitle(data.title || data.name);
    setTrailerDescription(data.overview);
    try {
      const res = await fetch(`/api/${data.media_type}/${data.id}/videos`);
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
          {initialDatas.results.slice(0, 10).map((data, index) => {
            const isFavorited = favoriteIds.includes(data.id);
            const isWatchlisted = watchlistIds.includes(data.id);

            return (
              <CarouselItem
                key={data.id}
                className="h-screen basis-full pl-0 [backface-visibility:hidden]"
              >
                <Card className="h-full w-full aspect-[16/10] overflow-hidden rounded-none p-0">
                  <CardContent className="relative h-full w-full">
                    {data.backdrop_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
                        alt={data.title || data.name}
                        fill
                        priority={index === 0}
                        loading={index === 0 ? undefined : "lazy"}
                        sizes="(max-width: 768px) 100vw, 1280px"
                        className="object-cover pointer-events-none"
                      />
                    ) : (
                      <div className="w-full aspect-[10/16] bg-gray-300 rounded-xl flex items-center justify-center text-gray-700 text-sm font-medium select-none shadow-md">
                        <IconMovie />
                      </div>
                    )}

                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-background via-background/70 to-transparent" />

                    <div className="absolute bottom-0 left-0 z-30 flex h-full w-full flex-col justify-end p-8 md:p-16 lg:w-2/3 lg:p-24">
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
                        {`(${new Date(data.release_date || data.first_air_date || "").getFullYear()})`}
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

                      <p className="mt-4 max-w-2xl text-justify text-sm leading-relaxed text-muted-foreground drop-shadow md:text-lg">
                        {data.overview.length > 360
                          ? `${data.overview.substring(0, 360)}...`
                          : data.overview}
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <Button
                          size="lg"
                          disabled={loading}
                          onClick={() => openTrailer(data)}
                        >
                          {loading ? (
                            <IconLoader className="ml-2 animate-spin" />
                          ) : (
                            "Watch Trailer"
                          )}
                        </Button>
                        <Button size="lg" variant="secondary" asChild>
                          <Link href={`/${data.media_type}/${data.id}`}>
                            More Info
                          </Link>
                        </Button>

                        <MediaActions
                          data={data}
                          user={user}
                          initialFavorited={isFavorited}
                          initialWatchlist={isWatchlisted}
                          onRequireLogin={() => setActiveModal("login")}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* ... Carousel Dots stay exactly the same ... */}
        <div className="absolute bottom-4 right-8 z-40 flex items-center justify-center gap-1.5">
          {initialDatas.results.slice(0, 10).map((_, i) => (
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
      </Carousel>

      {/* Trailer Modal */}
      <Dialog
        open={activeModal === "trailer"}
        onOpenChange={(open) => setActiveModal(open ? "trailer" : null)}
      >
        <DialogContent className="w-[95vw] md:w-[88vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw] sm:max-w-[1800px] p-2 sm:p-4 gap-3 border-none bg-zinc-950 text-white">
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
                <IconLoader className="animate-spin" />
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

      {/* 🎯 Login Modal */}
      <LoginDialog
        isOpen={activeModal === "login"}
        onOpenChange={(open) => setActiveModal(open ? "login" : null)}
        onSuccess={() => {
          toast.success("Welcome back!", {
            description: "You have successfully logged in.",
          });
          router.refresh();
        }}
      />
    </section>
  );
}
